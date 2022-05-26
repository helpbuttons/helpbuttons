import CrossIcon from "../../../public/assets/svg/icons/cross1";
type IconType = "cross" | "red";

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
    value,
    onClick = ()=>{},
    name = "",
    inputId = "",
}) {
    let input = <input
                    type="checkbox"
                    className="checkbox__checkbox"
                    name={name}
                    onChange={onClick}
                    ></input>
    if(value) {
        // http://react.tips/checkboxes-in-react/
        input = <input
        type="checkbox"
        className="checkbox__checkbox"
        name={name}
        onChange={onClick}
        checked
        ></input>
    }
    return (
        <div className="checkbox">
            <label className="checkbox__label">
               {input}
                <div className={`checkbox__content ${value ? 'checked' : ''}`}>
                    <CheckBoxIcon icon={icon} />
                    <div className="checkbox__text">{text}</div>
                </div>
            </label>
        </div>
    );
}
