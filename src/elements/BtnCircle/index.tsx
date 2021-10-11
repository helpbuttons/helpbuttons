import CrossIcon from "../../../public/assets/svg/icons/cross1";

export default function BtnCircle({
    disabled = false,
}: {
    disabled?: boolean;
}) {
    return (
        <button disabled={disabled} className="btn-circle">
            <div className="btn-circle__content">
                <div className="btn-circle__icon">
                    <CrossIcon />
                </div>
            </div>
        </button>
    );
}
