///default form element that can be customized with label, input, checkbox, description, note, etc. 
export default function Form({children, onSubmit}
) {
    return (
        <form onSubmit={onSubmit} className="popup__section">
            {children}
        </form>
    );
}
