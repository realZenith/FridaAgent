import { PatcherModuleJava } from "../../../helper.js";

export class Test implements PatcherModuleJava {
    initializeJavaModule(): void {
        Java.scheduleOnMainThread(() => {
            const applicationContext = Java.use("android.app.ActivityThread").currentApplication().getApplicationContext();
            const text = Java.use("java.lang.String").$new("Modded");
            // It's only shown during the initial splash screen, 
            // can't be seen after the real game started
            Java.use("android.widget.Toast").makeText(applicationContext, text, 1000).show();
        });
    }
}
