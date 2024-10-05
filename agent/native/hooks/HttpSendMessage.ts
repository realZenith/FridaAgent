import { PatcherModuleNative, Helpers } from "../../../helper.js";

import * as util from "util"

export class SendMessageHttp implements PatcherModuleNative {
    
    AssemblyCSharp = Il2Cpp.domain.assembly("Assembly-CSharp");
    
    initializeNativeModule(): void {
        this.SendMessageHttp();
    }

    // Prints the key used to decrypt some game assets

    SendMessageHttp() {
        const Class = this.AssemblyCSharp.image.class("AG_Net.HttpClient");
        const Method = Class.method("SendMessageHttp", 6);

        // @ts-ignore
        Method.implementation = function (serverurl: Il2Cpp.String, msgId: number, data: Il2Cpp.Array, modelDialog: boolean, signs: Il2Cpp.Array, realySigns: Il2Cpp.Array<Il2Cpp.String>): void {
            // <--- onEnter

            const result = this.method<void>("SendMessageHttp", 6).invoke(serverurl, msgId, data, modelDialog, signs, realySigns);

            var serverPacket = util.format("PacketUrl: %s, PacketMsgId: %s, PacketData: %s, PacketModelDialog: %s, PacketSigns: %s, PacketRealySigns: %s", serverurl, msgId, data, modelDialog, signs, realySigns)
 
            return result;
        };

        Helpers.LogMethodInfo(Method);
    }
}