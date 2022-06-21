import { useState } from "react";
import FieldError from "../FieldError";

export default function FieldTags({
  label,
  handleChange,
  name,
  validationError,
}) {
  const onChange = (e) => {
    let inputText = e.target.value;

    setInput(inputText);
  };
  const [tags, setTags] = useState([]);
  const [input, setInput] = useState("");

  const removeTag = (tagToRemove) => {
    setTags((previousState) => {
      previousState = previousState.filter(
        (tag) => tag.toLowerCase() !== tagToRemove.toLowerCase()
      );
      return previousState;
    });
  };

  const addTag = (newTag: string) => {
    setTags((previousState) => {
      if (tags.find((tag) => tag.toLowerCase() === newTag.toLowerCase())) {
        return previousState;
      }
      previousState.push(newTag);
      return previousState;
    });
  };

  const inputKeyDown = (e) => {
    const val = e.target.value;

    if (e.key === "Enter" && val) {
      addTag(val);
      setInput("");
      e.preventDefault();
      //   this.tagInput.value = null;
    } else if (e.key === "Backspace" && !val) {
      removeTag(val);
    }
    handleChange(name, tags);
  };

  return (
    <div className="form__field">
      <label className="label">{label}</label>
      <ul className="input-tag__tags">
        {tags.map((tag, i) => (
          <li key={tag}>
            {tag}
            <button type="button" onClick={() => removeTag(tag)}>
              x
            </button>
          </li>
        ))}
      </ul>
      <input
        name={name}
        type="text"
        onChange={onChange}
        className={`form__input ${validationError ? "validation-error" : ""}`}
        onKeyDown={inputKeyDown}
        value={input}
      />
      <FieldError validationError={validationError} />
    </div>
  );
}
