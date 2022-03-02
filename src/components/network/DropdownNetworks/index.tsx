//a variation of dropddown specific for time
import { useState } from "react";

const SuggestionsListComponent = (filteredSuggestions=[],activeSuggestionIndex) => {
  const onClick=()=>{};
   return filteredSuggestions.length ? (
     <ul className="suggestions">
       {filteredSuggestions.map((suggestion, index) => {
         let className;
         // Flag the active suggestion with a class
         if (index === activeSuggestionIndex) {
           className = "suggestion-active";
         }
         return (
           <li className={className} key={suggestion} onClick={onClick}>
             {suggestion}
           </li>
         );
       })}
     </ul>
   ) : (
     <div className="no-suggestions">
       <em>No suggestions, you '&apos re on your own!</em>
     </div>
   );
 };

export default function DropdownNetworks({networks, ...props}) {

  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [input, setInput] = useState("");


  let networksArray = networks.length > 0 ? networks[0] : networks;

  const options = networksArray.map((net, i) => (

      <option key={net.id} className="dropdown-nets__dropdown-option" label={net.name} value={net.name}>{net.name}</option>

  ));

  const onChange = (e) => {
    const userInput = e.target.value;

    // Filter our suggestions that don't contain the user's input
    const unLinked = networksArray;

    setInput(e.target.value);
    setFilteredSuggestions(unLinked);
    setActiveSuggestionIndex(0);
    setShowSuggestions(true);
  };

  const onClick = (e) => {
   setFilteredSuggestions([]);
   setInput(e.target.innerText);
   setActiveSuggestionIndex(0);
   setShowSuggestions(false);
  };

  return (

    <>
      <input className="dropdown-nets__dropdown-trigger dropdown__dropdown" autoComplete="on" onChange={onChange} list="" id="input" name="browsers" placeholder="Select other Network" type='text'></input>

        {showSuggestions && input &&
          <datalist className="dropdown-nets__dropdown-content" id='listid'>
            {options}
          </datalist>
        }

    </>


  );
}
