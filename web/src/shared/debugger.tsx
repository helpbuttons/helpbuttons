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
            const { stack } = new Error();
            const stackLine = stack.split('\n')[1] || '';
            const fileName = stackLine.split('///')[1] || '';
            if (fileName) {
                console.log(`[DEBUG]`, ...args, '      >' , fileName);
            }else{
                console.log(`[DEBUG]`, ...args);
            }
        }
    }

    error(...args) {
        if (this.isDebugEnabled) {
            const { stack } = new Error();
            console.error(`[DEBUG ERROR]`, ...args, stack);
        }
    }
}

const dconsole = new Console();
export default dconsole;
