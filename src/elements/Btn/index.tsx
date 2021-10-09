///Btn is the project convention for tradittional buttons, in order to avoidd confussion with app's buttons
import React from "react";

export enum BtnType {
    corporative,
    splitIcon,
    filter,
}

export enum IconType {
    red,
    green,
    remove,
    splitRedGreen,
}
export enum ContentAlignment {
    left,
    center,
    right,
}
interface BtnProps {
    caption: string;
    iconLeft?: IconType;
    iconRight?: IconType;
    contentAlignment?: ContentAlignment;
    type?: BtnType;
    disabled?: boolean;
}

function BtnIcon({ icon }: { icon: IconType }) {
    switch (icon) {
        case IconType.red:
            return <div className="btn-filter__icon red"></div>;
        case IconType.green:
            return <div className="btn-filter__icon green"></div>;
        case IconType.remove:
            return <div className="btn-filter__remove-icon"></div>;
        case IconType.splitRedGreen:
            return (
                <div className="btn-filter__split-icon">
                    <div className="btn-filter__split-icon--half green-l"></div>
                    <div className="btn-filter__split-icon--half red-r"></div>
                </div>
            );
        default:
            return null;
    }
}

function CaptionNode({
    caption,
    hasIcon = false,
}: {
    caption: string;
    hasIcon: boolean;
}) {
    if (hasIcon) {
        return <div className="btn-with-icon__text">{caption}</div>;
    } else {
        return <>{caption}</>;
    }
}

export default function Btn({
    caption,
    iconRight = null,
    iconLeft = null,
    type = null,
    contentAlignment = null,
    disabled = false,
}: BtnProps) {
    let classNames = [];
    const hasIcon = iconRight !== null || iconLeft !== null;

    switch (contentAlignment) {
        case ContentAlignment.center:
            classNames.push("btn--center");
            break;
    }

    switch (type) {
        case BtnType.corporative:
            classNames.push("btn btn--corporative");
            break;
        case BtnType.filter:
            if (hasIcon) {
                classNames.push("btn-filter-with-icon");
            } else {
                classNames.push("btn-filter");
            }
            break;
        default:
            if (hasIcon) {
                classNames.push("btn-with-icon");
            } else {
                classNames.push("btn");
            }
            break;
    }
    const className = classNames.join(" ");

    return (
        <button disabled={disabled} className={className}>
            <BtnIcon icon={iconLeft} />
            <CaptionNode caption={caption} hasIcon={hasIcon} />
            <BtnIcon icon={iconRight} />
        </button>
    );
}
