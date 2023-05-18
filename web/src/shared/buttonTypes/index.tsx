export const buttonTypes = [
    {
        name: "offer",
        caption: "Offer",
        color: "custom",
        cssColor: "#FFDD02"
    },
    {
        name: "need",
        caption: "Need",
        color: "custom",
        cssColor: "#19AF96"
    }
    ,{
        name: "service",
        caption: "Service",
        color: "custom",
        cssColor: "#EA5648"
    },
];

export const buttonColorStyle = (cssColor: string) => {
    return { "--button-color": cssColor } as React.CSSProperties;
}