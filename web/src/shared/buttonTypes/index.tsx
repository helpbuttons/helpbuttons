import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export const buttonTypes = JSON.parse(publicRuntimeConfig.buttonTypes)


export const buttonColorStyle = (cssColor: string) => {
    return { "--button-color": cssColor } as React.CSSProperties;
}