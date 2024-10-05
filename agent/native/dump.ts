import { FridaHelpers } from "../frida/FridaHelpers.js";
import { PatcherModuleNative, Helpers } from "../../Agent/helper.js";
import Settings from "../../../Frida/Agent/config.json";

// https://velog.io/@koo00/17

const moduleName = "libil2cpp.so";
export class UnityDump implements PatcherModuleNative {
    module!: Module;

    async initializeNativeModule(): Promise<void> {
        console.log("Test");
        const settings = Settings.Dump;
        this.module = await FridaHelpers.getModuleWhenLoadedAsync(moduleName);
        console.log("Test2");
        if (settings.GlobalMetadata) {
            this.dumpGlobalMetadata();
        }
        if (settings.LibIl2Cpp) {
            this.dumpLibIl2Cpp();
        }
        if (settings.Il2CppBridge) {
            this.dumpIl2cppBridge();
        }
    }

    dumpIl2cppBridge() {
        // Avoid timeout
        const what = "Il2CppBridgeDump";
        console.log(`${what} Started...`);
        const path = Helpers.GetExportPath("");
        Il2Cpp.dump(`${what}.cs`, path);
        console.log(`${what} Finished`);
    }

    async dumpLibIl2Cpp() {
        FridaHelpers.memoryDumpRange(moduleName, this.module)
    }

    async dumpGlobalMetadata() {
        // Magic Number, need to find the function that calls the load of the global-metadata.dat file
        // We can't do a memory scan because the magic number is deleted
        const offset = 0x71EA2AC;
        const metadataPointer = this.module.base.add(offset);
        console.log(`Metadata pointer :${offset.toString(16)} (Current address:${metadataPointer.toString(16)})`);
        // Follow the pointer
        const metadata = metadataPointer.readPointer();
        console.log(`Metadata pointer deref address:${metadata.toString(16)}`);
        // this.calculateMetadataSizeOffsetTest(metadata);
        const size = this.calculateMetadataSize(metadata, 0);
        FridaHelpers.memoryDump("global-metadata.dat", metadata, size);
    }
    
    calculateMetadataSizeOffsetTest(base: NativePointer) {
        for (let offset = -4; offset <= 4; offset++) {
            try {
                let size = this.calculateMetadataSize(base, offset);
                if (size < 0) continue;
                console.log(`Offset: ${offset} => Size: ${size}`);
            } catch (error) {
    
            }
        }
    }
    calculateMetadataSize(base: NativePointer, offset: number) {
        // Credits to the original author
        // https://github.com/350030173/global-metadata_dump/blob/master/global-metadata_dump.js
        //0x108，0x10 or 0x100，0x104
        base = base.add(offset);
        
        let DefinitionsOffset = base.add(0x108);
        let DefinitionsOffsetSize = DefinitionsOffset.readInt();
        let DefinitionsCount = base.add(0x10C);
        let DefinitionsCountSize = DefinitionsCount.readInt();
        
        if (DefinitionsCountSize < 10) {
            DefinitionsOffset = base.add(0x100);
            DefinitionsOffsetSize = DefinitionsOffset.readInt();
            DefinitionsCount = base.add(0x104);
            DefinitionsCountSize = DefinitionsCount.readInt();
        }

        //Find global-metadata size by adding all components
        let totalSize = DefinitionsOffsetSize + DefinitionsCountSize
        return totalSize;
    }
}