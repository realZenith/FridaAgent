import Settings from "../../../config.json";
import { PatcherModuleNative } from "../../../helper.js";

interface TraceConfig {
    Namespaces: Array<string>;
    ClassNames: Array<string>;
    MethodName: Array<string>;
}

// We exclude those values since they spam the console a lot
const exclude: TraceConfig = {
    Namespaces: [

    ],
    ClassNames: [
        
    ],
    MethodName: [

    ],
}

const badPatterns = [
    "MoveNext",
    "Async",
    "Iterator",
    "IEnumerator",
    ".cctor",
    ".ctor",
    "Lua",
]

const detailed = true;
const skipFilter = true;

function IsBadPattern(name: string): boolean {
    // blind guess trying to avoid memory corruptions
    return ContainsAnyPatternInternal(name, badPatterns);
}

function ContainsAnyPatternInternal(name: string, patterns: string[]): boolean {
    name = name.trim().toLowerCase();
    for (let pattern of patterns) {
        pattern = pattern.trim().toLowerCase();
        if (name.includes(pattern)) {
            //console.log(`\x1B[38;5;12mFound '${pattern}' in '${name}'\x1B[0m`);
            //console.log(`\x1B[38;5;11mDettected trace exclusion '${pattern}' on '${name}'\x1B[0m`);
            return true;
        }
        //console.log(`\x1B[38;5;12m '${pattern}' not in '${name}'\x1B[0m`);
    }

    return false;
}

function ContainsAnyPattern(name: string, patterns: string[]): boolean {
    if (skipFilter) {
        return false;
    }

    return ContainsAnyPatternInternal(name, patterns);
}

export class Trace implements PatcherModuleNative {

    AssemblyCSharp = Il2Cpp.domain.assembly("Assembly-CSharp");
    AssemblyCSharpFirstpass = Il2Cpp.domain.assembly("Assembly-CSharp-firstpass");

    initializeNativeModule(): void {
        if (!Settings.Trace) {
            return;
        }

        //this.SetupTracing();
        console.log('Starting To Setup Trace');

        this.SetupTracingExclude();

        console.log('Tracing Setup Sucessfully');
    }

    SetupTracingExclude() {
        Il2Cpp.trace(detailed)
            .assemblies(this.AssemblyCSharp)
            .filterClasses(function (klass: Il2Cpp.Class): boolean {
                if (klass.namespace === "") {
                    //console.log(`\x1B[0m\x1B[38;5;9mEmpty Namespace, Skipping\x1B[0m`);
                    return false;
                }

                if (ContainsAnyPattern(klass.namespace, exclude.Namespaces)) {
                    return false;
                }

                if (IsBadPattern(klass.namespace)) {
                    return false;
                }

                if (ContainsAnyPattern(klass.name, exclude.ClassNames)) {
                    return false;
                }

                if (IsBadPattern(klass.name)) {
                    return false;
                }

                return true;
            })
            .filterMethods(function (method: Il2Cpp.Method): boolean {
                if (method.isStatic) {
                    return false;
                }
                if (ContainsAnyPattern(method.name, exclude.MethodName)) {
                    return false;
                }

                if (IsBadPattern(method.name)) {
                    return false;
                }

                if (method.isStatic) {
                    return false;
                }

                //console.log(`Tracing namespace '${method.class.namespace}' class '${method.class.name}' method '${method.name}'`);
                return true;
            })
            .and()
            .attach();
    }
}