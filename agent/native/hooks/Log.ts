import { PatcherModuleNative, Helpers } from "../../../helper.js";


export class Log implements PatcherModuleNative {
    
    AssemblyCSharp = Il2Cpp.domain.assembly("Assembly-CSharp");
    
    initializeNativeModule(): void {
        this.Log();
    }

    // Prints the key used to decrypt some game assets

    Log() {
        const Class = this.AssemblyCSharp.image.class("LogUtil");
        const Method = Class.method("Log");

        // @ts-ignore
        Method.implementation = function (message: Il2Cpp.Object): void {

        const result = this.method<void>("Log").invoke(message);

        console.log("LogUtils.Log: ", message);

        return result;

        };

        Helpers.LogMethodInfo(Method);
    }
}