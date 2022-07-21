///default form element that can be customized with label, input, checkbox, description, note, etc. 
export default function Form({children, onSubmit, classNameExtra}
) {
    return (
        <form onSubmit={onSubmit} className={`${classNameExtra} popup__section`}>
            {children}
        </form>
    );
}
