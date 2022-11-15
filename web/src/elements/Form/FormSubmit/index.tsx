///default form element that can be customized with label, input, checkbox, description, note, etc. 
export default function FormSubmit({isSubmitting, title, classNameExtra}
    ) {
        const resultedClass = classNameExtra || "popup__options-btn btn-menu-white"
        return (
            <button type="submit" disabled={isSubmitting} className={resultedClass}>
                {isSubmitting && <span className=""></span>}
                {title}
            </button>
        );
    }
    

