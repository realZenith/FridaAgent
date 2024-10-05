import { Helpers } from "../../helper.js";

import "frida-il2cpp-bridge";

export class FridaHelpers {
    static memoryDump(name: string, base: NativePointer, size: number) {
        const extension = name.split('.').pop();
        const path = Helpers.GetExportPath(`${name}.Base=${base}Size=${size}.${extension}`);
        console.log(`Dumping memory to ${path}`);
        console.log(`Dumping ${path} Pre File Created (If stuck here can't write to directory)`);
        const file: any = new File(path, 'wb+');
        console.log(`Dumping ${path} File Created`);
        const buf = base.readByteArray(size);
        console.log(`Dumping ${path} Write To File Started`);
        file.write(buf);
        file.flush();
        file.close();
        console.log(`Dumping ${path} finished`);
    }
    static memoryDumpRange(name: string, range: MemoryRange) {
        const base = range.base;
        const size = range.size;
        FridaHelpers.memoryDump(name, base, size);
    }
    static memoryDumpRangeOfAddress(name: string, addr: NativePointer) {
        const range = Process.findRangeByAddress(addr);
        if (range == null) {
            throw "Tried to dump a non existand memory range";
        }
        FridaHelpers.memoryDumpRange(name, range);
    }
    static previewMemory(base: NativePointer, size: number = 0x110) {
        const temp = hexdump(base,
            {
                offset: 0,
                length: size,
                header: true,
                ansi: true
            }
        );
        console.log(temp);
    }
    static async getModuleWhenLoadedAsync(name: string, retryDelay: number = 100): Promise<Module> {
        while (true) {
            let module = Process.getModuleByName(name);
            if (module != null) {
                return module;
            }
            await (new Promise(r => setTimeout(r, retryDelay)));
        }
    }
}

interface MemoryRange {
    /**
     * Base address.
     */
    base: NativePointer;

    /**
     * Size in bytes.
     */
    size: number;
}