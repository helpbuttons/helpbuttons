import FieldError from "../FieldError";
import { useTagsList } from "../FieldTags";

export default function FieldInterets({
  label,
  validationError,
  interests = [],
  setInterests,
  placeholder,
  explain,
  defaultSuggestedTags = ['suggested']
}) {
  const {onInputChange, inputKeyDown, input, remove, suggestedTags, addTag} = useTagsList({
    defaultSuggestedTags,
    tags: interests,
    setTags: setInterests
  })

  return (<>
  <div className="form__field">
      {label && <div className="form__label">{label}</div>}
      {explain && <div className="form__explain">{explain}</div>}
      
      <InterestsList interests={interests} suggestedInterests={suggestedTags} add={(item) => addTag(item)} remove={(item) => {remove(item)}}/>
      <input
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
      <FieldError validationError={validationError} />
    </div>
    </>);
}

export function InterestsList({interests, suggestedInterests, add, remove})
{
  const isSelected = (interest, interests) => {
    if(interests.length > 0 && interests.indexOf(interest) > -1 )
    {
      return true
    }
    return false;
  }
  
  const addToItems = (interest) => {
    if(isSelected(interest, interests))
    {
      return;
    }
    add(interest)
  }
  
  return (<div className="form__tags-list">
        <ul className="tags__list">
          {suggestedInterests.length > 0 &&
            suggestedInterests.map((item, index) => {
              if(!isSelected(item, interests)) {
                return  (<><InterestElement item={item} index={index} onClick={() => {addToItems(item)}}/></>)
              }
            })
          }
          {interests.length > 0 &&
            interests.map((item, index) => (
              <InterestElement item={item} index={index} onClick={() => {remove(item)}} selected={true}/>
          ))}
        </ul>
      </div>
  );
}

function InterestElement({index, item, onClick, selected = false})
{
  return (<>
    {selected && 
    <li key={`${index}`} className="tags__list-interest__selected" onClick={onClick}>
      {item}
    </li>
    }
    {!selected && 
      <li key={`${index}`} className="tags__list-interest" onClick={onClick}>
      {item}
    </li>
    }
    </>
  )
}