import { useState } from 'react';
import FieldError from '../FieldError';

import t from 'i18n';
import { IoClose } from 'react-icons/io5';


export default function FieldTags({
  label,
  validationError,
  tags = [],
  setTags,
  placeholder,
  explain
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
      <div className="form__label">{label}</div>
      <div className="form__explain">{explain}</div>
      <input
        name={name}
        type="text"
        onChange={onInputChange}
        className={`form__input ${validationError ? 'validation-error' : ''
          }`}
        onKeyDown={inputKeyDown}
        value={input}
        placeholder={placeholder}
        autoComplete="off"
      />
      <div className="form__tags-list">
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
                  <IoClose/>
                </button>
              </li>
            ))}
        </ul>
      </div>

      <FieldError validationError={validationError} />
    </div>
  );
}
