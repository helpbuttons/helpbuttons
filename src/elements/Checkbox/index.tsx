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
    inputId,
    value,
}: {
    icon: IconType;
    text: string;
    inputId: string;
    value: string;
}) {
    return (
        <div className="checkbox">
            <label className="checkbox__label">
                <input
                    type="checkbox"
                    className="checkbox__checkbox"
                    id={inputId}
                    value={value}
                ></input>
                <div className={`checkbox__content ${value ? 'checked' : ''}`}>
                    <CheckBoxIcon icon={icon} />
                    <div className="checkbox__text">{text}</div>
                </div>
            </label>
        </div>
    );
}
