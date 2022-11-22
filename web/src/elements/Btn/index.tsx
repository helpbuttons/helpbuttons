///Btn is the project convention for tradittional buttons, in order to avoidd confussion with app's buttons
import React from "react";
import Spinner from "elements/Spinner";

export enum BtnType {
    corporative,
    splitIcon,
    filter,
}

export enum IconType {
    red,
    green,
    svg,
    splitRedGreen,
}
export enum ContentAlignment {
    left,
    center,
    right,
}
interface BtnProps {
    caption: string;
    iconLink: string;
    iconLeft?: IconType;
    iconRight?: IconType;
    contentAlignment?: ContentAlignment;
    btnType?: BtnType;
    disabled?: boolean;
    isSubmitting?: boolean;
    onClick?: Function;
}

function BtnIcon({ icon, iconLink }: { icon: IconType }) {
    switch (icon) {
        case IconType.red:
            return <div className="btn-filter__icon red"></div>;
        case IconType.green:
            return <div className="btn-filter__icon green"></div>;
        case IconType.svg:
            return <div className="btn-with-icon__icon">{iconLink}</div>;
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
    iconLink = null,
    btnType = null,
    contentAlignment = null,
    disabled = false,
    isSubmitting = false,
    onClick = {},
}: BtnProps) {
    let classNames = [];
    const hasIcon = iconRight !== null || iconLeft !== null;

    switch (contentAlignment) {
        case ContentAlignment.center:
            classNames.push("btn--center");
            break;
    }

    switch (btnType) {
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
        <button onClick={onClick} disabled={disabled} className={className}>
            {isSubmitting && <Spinner />}
            <BtnIcon icon={iconLeft} iconLink={iconLink}/>
            <CaptionNode caption={caption} hasIcon={hasIcon} />
            <BtnIcon icon={iconRight} iconLink={iconLink}/>
        </button>
    );
}
