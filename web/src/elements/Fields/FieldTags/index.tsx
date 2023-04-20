import { useState } from 'react';
import FieldError from '../FieldError';
import t from 'i18n';

export default function FieldTags({
  label,
  validationError,
  tags = [],
  setTags,
  placeholder
}) {
  const onInputChange = (e) => {
    let inputText = e.target.value;

    setInput(inputText);
  };
  const [input, setInput] = useState('');

  const addTag = (newTag: string) => {
    if (
      tags &&
      tags.length > 0 &&
      tags.find(
        (tag) => tag.toLowerCase() == newTag.toLocaleLowerCase(),
      )
    ) {
      return;
    }
    tags.push(newTag);
    setTags(tags);
  };

  const inputKeyDown = (e) => {
    const val = e.target.value;

    if (e.key === 'Enter' && val) {
      addTag(val);
      setInput('');
      e.preventDefault();
    } else if (e.key === 'Backspace' && !val) {
      tags.pop();
      setTags(tags);
    }
  };

  const remove = (newTag) => {
    tags = tags.filter(tag => tag !== newTag);
    setTags(tags);
  };
  return (
    <div className="tag__field">
      <label className="label light">{label}</label>
      <div className="card-button-list__tags">
        <ul className="tags__list">
          {tags &&
            tags.map((item, index) => (
              <li key={`${index}`} className="tags__list-tag">
                {item}
                <button
                  className="tag__btn"
                  type="button"
                  onClick={() => remove(item)}
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
          validationError ? 'validation-error' : ''
        }`}
        onKeyDown={inputKeyDown}
        value={input}
        placeholder={placeholder}
        autoComplete="off"
      />
      <FieldError validationError={validationError} />
    </div>
  );
}
