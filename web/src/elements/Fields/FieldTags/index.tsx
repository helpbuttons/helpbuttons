import { useState } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import FieldError from "../FieldError";
import t from "i18n";

export default function FieldTags({
  label,
  name,
  validationError,
  control,
  watch,
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name,
  });

  const onInputChange = (e) => {
    let inputText = e.target.value;

    setInput(inputText);
  };
  const [input, setInput] = useState("");

  const watchTags = watch(name, []);

  const addTag = (newTag: string) => {
    if (
      watchTags.find((tag) => tag.toLowerCase() == newTag.toLocaleLowerCase())
    ) {
      return;
    }
    append(newTag);
  };

  const inputKeyDown = (e) => {
    const val = e.target.value;

    if (e.key === "Enter" && val) {
      addTag(val);
      setInput("");
      e.preventDefault();
    } else if (e.key === "Backspace" && !val) {
      remove(-1);
    }
  };

  return (
    <div className="tag__field">
      <label className="label light">{label}</label>
      <div className="card-button-list__tags">
        <ul className="tags__list">
          {fields.map((item, index) => (
            <li key={`${item.id}`} className="tags__list-tag">
              <Controller
                render={({ field: { value } }) => value}
                name={`${name}.${index}`}
                control={control}
              />
              <button
                className="tag__btn"
                type="button"
                onClick={() => remove(index)}
              >
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
        className={`tag__input form__input ${
          validationError ? "validation-error" : ""
        }`}
        onKeyDown={inputKeyDown}
        value={input}
        placeholder={t('common.add')}
        autoComplete="off"
      />
      <FieldError validationError={validationError} />
    </div>
  );
}
