import { forwardRef, useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";
import FieldError from "../FieldError";

export default function FieldTags({
  label,
  name,
  validationError,
  control
}) {
  const {  append, remove } = useFieldArray({
    control,
    name: name
  });

  const onInputChange = (e) => {
    let inputText = e.target.value;

    setInput(inputText);
  };
  const [tags, setTags] = useState([]); // Suggested tags, can be changed or removed
  const [input, setInput] = useState("");

  const removeTag = (tagToRemove) => {
    setTags((previousState) => {
      previousState = previousState.filter(
        (tag) => tag.toLowerCase() !== tagToRemove.toLowerCase()
      );
      remove(tagToRemove.toLowerCase())
      return previousState;
    });
  };

  const addTag = (newTag: string) => {
    if (tags.find((tag) => tag.toLowerCase() == newTag.toLocaleLowerCase())) {
      return;
    }
    append(newTag.toLowerCase());
    setTags([...tags, newTag]);
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
  };

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
        onChange={onInputChange}
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
