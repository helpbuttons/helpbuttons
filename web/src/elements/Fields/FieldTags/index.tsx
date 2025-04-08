import { useEffect, useState } from 'react';
import FieldError from '../FieldError';
import { IoClose } from 'react-icons/io5';
import { tagify } from 'shared/sys.helper';
import _ from 'lodash';
import { useStore } from 'state';
import { GlobalState, store } from 'state';
import { UpdateFiltersToFilterTag, updateCurrentButton } from 'state/Explore';
import router from 'next/router';

export function useTagsList({ tags, setTags }) {
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
    setInput(() => input.substring(0,input.lastIndexOf(" ")+1))
    setTags([...tags, tagify(newTag)]);
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
    tags = tags.filter((tag) => tag !== newTag);
    setTags(tags);
  };
  return {
    onInputChange,
    inputKeyDown,
    input,
    remove,
    addTag,
  };
}
export default function FieldTags({
  label,
  validationError,
  tags = [],
  setTags,
  placeholder,
  explain,
  maxTags = 5
}) {
  const { onInputChange, inputKeyDown, input, remove, addTag } =
    useTagsList({
      tags,
      setTags,
    });

  return (
    <div className="tag__field form__field">
      {label && <label className="form__label">{label}</label>}
      {explain && <div className="form__explain">{explain}</div>}
      <input
        name={name}
        type="text"
        onChange={onInputChange}
        className={`form__input ${
          validationError ? 'validation-error' : ''
        }`}
        onKeyDown={inputKeyDown}
        value={input}
        placeholder={placeholder}
        autoComplete="off"
        onKeyPress={(e) => {
          e.key === 'Enter' && e.preventDefault();
        }}
      />
      <TagList tags={tags} remove={remove} />
      <AllSuggestedTags word={input.substring(input.lastIndexOf(" ")+1)} maxTags={maxTags} tags={tags} addTag={addTag}/>
      <FieldError validationError={validationError} />
    </div>
  );
}

export function SuggestedTags({
  defaultSuggestedTags,
  tags,
  addTag,
}) {
  return (
    <div className="homeinfo__hashtags">
      {defaultSuggestedTags
        .filter(
          (suggestedTag) =>
            !tags.find((tag) => tag == suggestedTag.tag),
        )
        .map((tag, idx) => {
          return (
            <div
              className="hashtag"
              key={idx}
              onClick={() => addTag(tag.tag)}
            >
              {tag.tag}
            </div>
          );
        })}
    </div>
  );
}
export function TagList({ tags, remove = null }) {
  return (
    <div className="form__tags-list">
      <ul className="tags__list">
        {tags.length > 0 &&
          tags.map((item, index) => (
            <li key={`${index}`} className="hashtag tags__list-tag">
              {item}
              {remove && (
                <button
                  className="tag__btn"
                  type="button"
                  onClick={() => remove(item)}
                >
                  <IoClose />
                </button>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}

export const updateQueryWhenTagAdded = (query, tag) => {
  const lastWord = query.substring(query.lastIndexOf(" ")+1)
  if(tag.search(lastWord) > -1)
  {
    return query.substring(0,query.lastIndexOf(" ")+1)
  }
  return query;
}

export function AllSuggestedTags({ word, maxTags, tags, addTag }) {
  const allTags = useStore(
    store,
    (state: GlobalState) => state.explore.map.allTags,
  );
  const topTags = useStore(
    store,
    (state: GlobalState) => state.networks.selectedNetwork.topTags,
  );
  const networkTags = useStore(
    store,
    (state: GlobalState) => state.networks.selectedNetwork.tags,
  );

  const [suggestedTags, setSuggestedTags] = useState([]);
  const allSuggestedTags = (sort = false) => {
    if (topTags && allTags && networkTags) {
      const all= _.uniq([
        ...networkTags,
        ...topTags.map((tag) => tag.tag),
        ...allTags,
      ])
      if(sort)
      {
        return all.sort()
      }
      return all
    }
    return [];
  };
  useEffect(() => {
    if (topTags && allTags) {
      setSuggestedTags(() => {
        return allSuggestedTags();
      });
    }
  }, [topTags, allTags]);
  useEffect(() => {
    if (word) {
      setSuggestedTags(() =>
        allSuggestedTags(true).filter((tag) => {
          return tag.search(word) > -1;
        }),
      );
    } else {
      setSuggestedTags(() => {
        return allSuggestedTags();
      });
    }
  }, [word]);
  return (
    <div className="homeinfo__hashtags">
      {suggestedTags
        .filter(
          (suggestedTag) => !tags.find((tag) => tag == suggestedTag),
        )
        .slice(0, maxTags)
        .map((tag, idx) => {
          return (
            <div
              className="hashtag"
              key={idx}
              onClick={() => addTag(tag)}
            >
              {tag}
            </div>
          );
        })}
    </div>
  );
}


export function TagsNav({ tags }) {
  const filterTag = (tag) => {
    store.emit(new UpdateFiltersToFilterTag(tag));
  };

  return (
    <div className="card-button__hashtags">
      {tags.map((tag, idx) => {
        return (
          <div
            className="hashtag"
            key={idx}
            onClick={() => {
              filterTag(tag);
              store.emit(new updateCurrentButton(null));
              router.push('/Explore');
            }}
          >
            {tag}
          </div>
        );
      })}
    </div>
  );
}
