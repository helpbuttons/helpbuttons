//a variation of dropddown specific for networks
//libraries
import { useState } from "react";

export default function DropdownComp({
  options,
  bubbleChange,
  setValue,
  placeholder,
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [input, setInput] = useState("");

  const onChange = (e) => {
    let inputText = e.target.value;

    const userInput = e.target.value;
    setInput(inputText);
    setShowSuggestions(true);
    bubbleChange(e);
  };

  const onClick = (e) => {
    setInput(e.target.attributes.label.nodeValue);
    setValue(
      e.target.attributes.value.nodeValue,
      e.target.attributes.label.nodeValue
    );
    setShowSuggestions(false);
  };

  return (
    <>
      <input
        className="dropdown-nets__dropdown-trigger dropdown__dropdown"
        autoComplete="on"
        onChange={onChange}
        list=""
        id="input"
        name="browsers"
        placeholder={placeholder}
        type="text"
        value={input}
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
