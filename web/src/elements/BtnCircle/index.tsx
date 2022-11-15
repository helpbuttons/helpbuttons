import { IoClose } from "react-icons/io5";

export default function BtnCircle({
    disabled = false,
}: {
    disabled?: boolean;
}) {
    return (
        <button disabled={disabled} className="btn-circle">
            <div className="btn-circle__content">
                <div className="btn-circle__icon">
                    <IoClose />
                </div>
            </div>
        </button>
    );
}
