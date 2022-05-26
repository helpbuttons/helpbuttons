import React, { useState } from "react";
import CrossIcon from "../../../public/assets/svg/icons/cross1";


function CheckBoxIcon({ icon }: { icon: IconType }) {
    switch (icon) {
        case "cross":
            return (
                <div className="checkbox__icon">
                    <CrossIcon />
                </div>
            );
        case "red":
            return <div className="btn-filter__icon red"></div>;
        default:
            return null;
    }
}



export default function CheckBox({
    icon,
    text,
    inputId,
    value,
    name,
    handleChange,
}: {
    icon: IconType;
    text: string;
    inputId: string;
    value: string;
    name: string;
    handleChange: Object;
}) {

    type IconType = "cross" | "red";
    const [checked, setChecked] = useState(false);

    const onChange = () => {
        setChecked(!checked);
        handleChange(name, !checked);
      };

    return (
        <div className="checkbox">
            {checked.toString()}
            <label className="checkbox__label">
                <input
                    type="checkbox"
                    className="checkbox__checkbox"
                    name={name}
                    checked={checked}
                    onChange={onChange}
                ></input>
                <div className={`checkbox__content ${value ? 'checked' : ''}`}>
                    <CheckBoxIcon icon={icon} />
                    <div className="checkbox__text">{text}</div>
                </div>
            </label>
        </div>
    );
}
