import "frida-il2cpp-bridge";

import Settings from "./config.json";
import { PatcherModuleJava, PatcherModuleNative } from "./helper.js";
import { SendMessageHttp } from "./agent/native/hooks/HttpSendMessage.js";
import { Log } from "./agent/native/hooks/Log.js";
import { Test } from "./agent/java/test/test.js";


if (Settings.ExecuteJavaModules) {
    JavaMain();
}

if (Settings.ExecuteIl2cppModules) {
    //Il2CppDumpTools()
    Il2cppMain();
}

// Module Loading Order is important, later ones override previously loaded ones

async function JavaMain() {
    console.log(`Executing Java modules...`);
    Java.perform(() => {
        const javaModules: PatcherModuleJava[] = [
            new Test(),
        ]
        javaModules.forEach(async module => {
            await module.initializeJavaModule();
        });
    });
    console.log(`Finished Executing Java modules`);
}

async function Il2cppMain() {
    console.log(`Executing Il2cpp modules...`);
    Il2Cpp.perform(() => {
        console.log(Il2Cpp.unityVersion);
        const nativeModules: PatcherModuleNative[] = [
            //new Log(),
            new SendMessageHttp(),
        ]
        nativeModules.forEach(async module => {
            await module.initializeNativeModule();
        });
        console.log(`Finished Executing Il2cpp modules`);
    });
}
