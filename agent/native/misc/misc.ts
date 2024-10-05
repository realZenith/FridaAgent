import { PatcherModuleNative } from "../../../helper.js";

export class Misc implements PatcherModuleNative {

    initializeNativeModule(): void {
        this.PrintUnityVersion();
    }

    PrintUnityVersion() {
        console.log(`Unity version => ${Il2Cpp.unityVersion}`);
    }
}
