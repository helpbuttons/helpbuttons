//a variation of dropddown specific for time
import { useState } from "react";
import { storeService } from "";

const SuggestionsListComponent = () => {
   return filteredSuggestions.length ? (
     <ul class="suggestions">
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
     <div class="no-suggestions">
       <em>No suggestions, you're on your own!</em>
     </div>
   );
 };

export default function DropdownNetworks({networks, setSelectedNetworkObject, ...props}) {

  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [input, setInput] = useState("");

  let networksArray = networks.length > 0 ? networks[0] : networks;

  const options = networksArray.map((net, i) => (

      <option data_id={net.id} className="dropdown-nets__dropdown-option" label={net.name} value={net.name}>{net.name}</option>

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

   console.log(e.target.data_id + e.target.label);
   setFilteredSuggestions([]);
   setInput(e.target.innerText);
   setActiveSuggestionIndex(0);
   setShowSuggestions(false);
   setSelectedNetworkObject(e.target.data_id);

  };

  return (

    <>
      <input className="dropdown-nets__dropdown-trigger dropdown__dropdown" autoComplete="on" onChange={onChange} list="" id="input" name="browsers" placeholder="Select other Network" type='text'></input>

        {showSuggestions && input &&
          <datalist className="dropdown-nets__dropdown-content" onClick={onClick} id='listid'>
            {options}
          </datalist>
        }

    </>


  );
}
