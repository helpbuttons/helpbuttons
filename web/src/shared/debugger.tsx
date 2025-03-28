import getConfig from "next/config";

class Console {
    private isDebugEnabled = false;
    constructor() {
        const { publicRuntimeConfig } = getConfig();
        this.isDebugEnabled = publicRuntimeConfig.debug !== "undefined";
    }

    setDebugEnabled(isEnabled) {
        this.isDebugEnabled = isEnabled;
    }

    log(...args) {
        if (this.isDebugEnabled) {
            // const timestamp = new Date().toISOString();
            console.log(`[DEBUG]`, ...args);
        }
    }

    error(...args) {
        if (this.isDebugEnabled) {
            console.error(`[DEBUG ERROR]`, ...args);
        }
    }
}

const dconsole = new Console();
export default dconsole;
