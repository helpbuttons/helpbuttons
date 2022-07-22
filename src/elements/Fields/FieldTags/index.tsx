import { useEffect, useState } from "react";
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
  const [tags, setTags] = useState(["Video", "Call"]); // Suggested tags, can be changed or removed
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
    } else if (e.key === "Backspace" && !val) {
      removeTag(val);
    }
    handleChange(name, tags);
  };
  
  useEffect(()=>{handleChange(name, tags);}, [tags, name, handleChange])

  return (
    <div className="tag__field">
    <label className="label light">{label}</label>
    <div className="card-button-list__tags">
        <ul className="tags__list">
          {tags.map((tag, i) => (
              <li className="tags__list-tag" key={`${tag}-${i}`}>
                {tag}
                    <button className="tag__btn" type="button" onClick={() => removeTag(tag)}>
                    x
                    </button>
              </li>
          ))}
        </ul>
      </div>
      <input
        name={name}
        type="text"
        onChange={onChange}
        className={`tag__input form__input ${validationError ? "validation-error" : ""}`}
        onKeyDown={inputKeyDown}
        value={input}
        placeholder= "+Add"
        autoComplete="off"
      />
      <FieldError validationError={validationError} />
    </div>
  );
}
