import Settings from "./config.json";

export class Helpers {
    static LogMethodInfo<T extends Il2Cpp.Method.ReturnType>(Method: Il2Cpp.Method<T>) {
        console.log(`Hooked ${Method}`);
    }
    static GetExportPath(subPath: string): string{
        return `${Settings.Misc.ExportPath}${subPath}`;
    }
    static String2Bin(str: String) {
        return str.split("").map( function( val ) { 
            return val.charCodeAt( 0 ); 
        } );
    }
     static Bin2String(array: number[]) {
        return String.fromCharCode.apply(String, array);
    }
    static convertIl2cppArrayToByteArray(il2cppByteArray: Il2Cpp.Array<Il2Cpp.number>): Uint8Array {
        const arrayLength = il2cppByteArray.length;
        const byteArray = new Uint8Array(arrayLength);
    
        for (let i = 0; i < arrayLength; i++) {
            const byteValue = il2cppByteArray.get(i); 
            byteArray[i] = byteValue; 
        }
    
        return byteArray;
    }
    static Il2cppString2String(il2cppString: Il2Cpp.String): string{
        if (il2cppString.content === null) {
            return '';
        }
        const content: string = il2cppString.content;

        return content;
    }
    static Il2cppStringArrayToStringArray(il2cppStringArray: Il2Cpp.Array<Il2Cpp.String>): string[] {
        const arrayLength = il2cppStringArray.length;
        const resultArray: string[] = new Array(arrayLength); 
    
        for (let i = 0; i < arrayLength; i++) {
            const il2cppString = il2cppStringArray.get(i);
    

            resultArray[i] = il2cppString.content ? il2cppString.content : ''; 
        }
    
        return resultArray;
    }
}


// Good idea, doesn't work.
// looks like Typescript doesn't care about types as long as they have the same signature
// Dynamic interfacing?
export interface PatcherModuleJava {
    initializeJavaModule(): Promise<void> | void;
}

export interface PatcherModuleNative {
    initializeNativeModule(): Promise<void> | void;
}