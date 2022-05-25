import React, { useState } from 'react';
import Popup from 'components/popup/Popup';
import { INetwork } from 'services/Networks/network.type';
import { CreateNetworkEvent } from './data';
import { store } from 'pages/index';


export default function NetworkNew() {
  const token = window.localStorage.getItem('access_token');
    const [networkData, setNetworkData] = useState({
      name: "",
    });

    const handleChange = (event) => {
      setNetworkData({ ...networkData, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event) => {
      // prevents the submit button from refreshing the page
      event.preventDefault();
      console.log(networkData);
      store.emit(new CreateNetworkEvent(networkData, token, () => {}));
    };

    return (

        <>
        
            <Popup title="Create Network" linkFwd="/HomeInfo">
              <form onSubmit={handleSubmit} className="popup__section">

                <div className="form__field">
                    <label className="label">Name</label>
                    <input 
                      name="name" 
                      type="text"
                      value={networkData.name}
                      onChange={handleChange}
                    />
                </div>
                <FieldText value={networkData.name} onChange={handleChange} name="name" label="Name">
                </FieldText>

                <div className="popup__options-v">

                  <button type="submit" className="popup__options-btn btn-menu-white">

                    <span className="">Create Net</span>
                      

                  </button>

                </div>

              </form>

            </Popup>



        </>
    );

}
