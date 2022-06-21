import { useState } from "react";

export function DropdownAutoComplete({
  options,
  onChange,
  setValue,
  placeholder,
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [input, setInput] = useState("");

  const onChangeInput = (e) => {
    let inputText = e.target.value;

    const userInput = e.target.value;
    setInput(inputText);
    setShowSuggestions(true);
    onChange(userInput);
  };

  const onClick = (e) => {
    setInput('');
    setValue(
      e.target.attributes.value.nodeValue,
      e.target.attributes.label.nodeValue
    );
    setShowSuggestions(false);
  };

  const onInputClick = (e) => {
    e.target.select();
  };

  return (
    <>
      <input
        className="dropdown-nets__dropdown-trigger dropdown__dropdown"
        autoComplete="on"
        onChange={onChangeInput}
        list=""
        id="input"
        name="browsers"
        placeholder={placeholder}
        type="text"
        value={input}
        onClick={onInputClick}
      ></input>

      {showSuggestions && (
        <datalist
          onClick={onClick}
          className="dropdown-nets__dropdown-content"
          id="listid"
        >
          {options}
        </datalist>
      )}
    </>
  );
}

export function DropDownAutoCompleteOption({ value, label }) {
  return (
    <option
      className="dropdown-nets__dropdown-option"
      label={label}
      value={value}
    ></option>
  );
}
