import { useState } from 'react';
import FieldError from '../FieldError';
import { IoClose } from 'react-icons/io5';
import { tagify } from 'shared/sys.helper';


export function useTagsList({tags, setTags})
{
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
    setTags([...tags, tagify(newTag)])
  };

  const inputKeyDown = (e) => {
    const val = e.target.value;

    if ((e.key === 'Enter' || e.key === ',') && val) {
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
  return ({
    onInputChange, inputKeyDown, input, remove, addTag
  })
}
export default function FieldTags({
  label,
  validationError,
  tags = [],
  setTags,
  placeholder,
  explain,
  defaultSuggestedTags = []
}) {
  const {onInputChange, inputKeyDown, input, remove, addTag} = useTagsList({
    tags,
    setTags
  })
  return (
    <div className="tag__field form__field">
      {label && <label className="form__label">{label}</label>}
      {explain && <div className="form__explain">{explain}</div>}
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
        onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
      />
      <TagList tags={tags} remove={remove}/>
      <div className="homeinfo__hashtags">
        {defaultSuggestedTags.map((tag, idx) => {
          return <div className="hashtag" key={idx} onClick={() => addTag(tag.tag)}>{tag.tag}</div>
        })}
      </div>
      <FieldError validationError={validationError} />
    </div>
  );
}

export function TagList({tags, remove = null})
{
  return (<div className="form__tags-list">
        <ul className="tags__list">
          {tags.length > 0 &&
            tags.map((item, index) => (
              <li key={`${index}`} className="tags__list-tag">
                {item}
                {remove &&
                <button
                  className="tag__btn"
                  type="button"
                  onClick={() => remove(item)}
                >
                  <IoClose/>
                </button>
                }
              </li>
            ))}
        </ul>
      </div>
  );
}