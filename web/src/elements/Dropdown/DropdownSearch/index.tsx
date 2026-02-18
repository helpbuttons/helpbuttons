
export function DropdownSearch({placeholder = '', input, setInput, results, handleFocus, handleSelected, handleBlur = (val) => {} }) {   

    const onChange = (value) => {
        setInput(() => value)
    };

    const onFocus = (event) => {
        event.target.select();
        handleFocus()
    }

    const onBlur = (event) => {
        handleBlur(input)
    }
    return <>
        <div onBlur={onBlur} className="form__input--dropdown-search">
            <input
                className="form__input--dropdown-search__input"
                placeholder={placeholder}
                value={input}
                onChange={(e) => onChange(e.target.value)}
                onFocus={onFocus}
               
            />
        </div>
        <div className="dropdown__dropdown-content">
            {results.map((result, id) => {
                return (<div key={id} className="dropdown__dropdown-option" onMouseDown={(e) => {handleSelected(result) }}>
                    {result.label}
                </div>)
            })}
        </div>

    </>

}