import FieldError from "../FieldError";
import { useTagsList } from "../FieldTags";

export default function FieldInterets({
  label,
  validationError,
  interests = [],
  setInterests,
  placeholder,
  explain,
  defaultSuggestedTags = ['suggested'],
  defaultTrendingTags = []
}) {
  const {onInputChange, inputKeyDown, input, remove, addTag} = useTagsList({
    tags: interests,
    setTags: setInterests
  })

  return (<>
  <div className="form__field">
      {label && <div className="form__label">{label}</div>}
      {explain && <div className="form__explain">{explain}</div>}

      <input
        type="text"
        onChange={onInputChange}
        className={`form__input-tags ${validationError ? 'validation-error' : ''
          }`}
        onKeyDown={inputKeyDown}
        value={input}
        placeholder={placeholder}
        autoComplete="off"
        onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
      />
      
      <InterestsList interests={interests} suggestedInterests={defaultSuggestedTags} trendingInterests={defaultTrendingTags} add={(item) => addTag(item)} remove={(item) => {remove(item)}}/>

      <FieldError validationError={validationError} />
    </div>
    </>);
}

export function InterestsList({interests, suggestedInterests,trendingInterests, add, remove})
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
  
  const interestList = (list) => {
    if(list.length > 0 ) {
      return list.map((item, index) => {
        if(!isSelected(item, interests)) {
          return  (<InterestElement item={item} index={index} onClick={() => {addToItems(item)}} key={index}/>)
        }else{
          return  (<InterestElement selected={true} item={item} index={index} onClick={() => {remove(item)}} key={index}/>)
        }
      })
    }
  }
  return (<div className="form__tags-list">
        <ul className="tags__list">
          {interestList(suggestedInterests)}
          {interestList(trendingInterests)}
          {interests.length > 0 &&
            interests.map((item, index) => {
              if(!(suggestedInterests.indexOf(item) > -1) && !(trendingInterests.indexOf(item) > -1)) {
                return <InterestElement item={item} index={index} onClick={() => {remove(item)}} selected={true} key={index}/>
              }
            })}
        </ul>
      </div>
  );
}

function InterestElement({index, item, onClick, selected = false})
{
  return (<>
    {selected && 
    <li className="tags__list-interest__selected" onClick={onClick}>
      {item}
    </li>
    }
    {!selected && 
      <li className="tags__list-interest" onClick={onClick}>
      {item}
    </li>
    }
    </>
  )
}