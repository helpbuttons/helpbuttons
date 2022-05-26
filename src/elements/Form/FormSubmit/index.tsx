///default form element that can be customized with label, input, checkbox, description, note, etc. 
export default function FormSubmit({isSubmitting, title}
    ) {
        return (
            <button type="submit" disabled={isSubmitting} className="popup__options-btn btn-menu-white">
            {isSubmitting && <span className=""></span>}
                        {title}
            </button>
        );
    }
    

