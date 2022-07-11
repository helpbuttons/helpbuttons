//INFO AND RESULTS
//libraries
import { useState, useEffect } from "react";
import { ImageContainer } from "elements/ImageWrapper";
import { useRef } from "store/Store";

//components
import Btn, { ContentAlignment, BtnType } from "elements/Btn";
import { Link } from "elements/Link";

import { Subject } from "rxjs";
import {
  setValueAndDebounce,
} from "./data";
import {
  DropdownAutoComplete,
  DropDownAutoCompleteOption,
} from "elements/DropDownAutoComplete";
import { GlobalState, store } from "pages";
import { setSelectedNetworkId } from "./data";

export default function HomeInfo() {
  const selectedNetwork = useRef(store, (state :GlobalState) => state.commonData.selectedNetwork);

  return (
    <>
      <div className="info-overlay__container">
        <div className="info-overlay__content">
          <div className="info-overlay__name"></div>

          <div className="info-overlay__description"></div>

          <div className="info-overlay__image">
            <form className="info-overlay__location">
              <label className="form__label label">Where do you start?</label>

              <input
                type="text"
                className="form__input"
                placeholder="Search Location"
              ></input>
            </form>
          </div>

          <div className="info-overlay__bottom">
            <div className="info-overlay__nets">
              <div>
                { selectedNetwork && (
                  <>
                    {selectedNetwork.name}
                    <ImageContainer
                              src={selectedNetwork.avatar}
                              alt={selectedNetwork.name}
                              width={50}
                              height={50}
                              localUrl
                    />
                  </>)
                }
              </div>
              <DropdownNetworks/>
              <Link href="/NetworkNew">
                <Btn
                  btnType={BtnType.corporative}
                  contentAlignment={ContentAlignment.center}
                  caption="Create Network"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function DropdownNetworks() {
  const timeInMsBetweenStrokes = 200; //ms

  const [options, setOptions] = useState([]);

  const [sub, setSub] = useState(new Subject()); //evita la inicializaacion en cada renderizado
  const [sub$, setSub$] = useState(
    setValueAndDebounce(sub, timeInMsBetweenStrokes)
  ); //para no sobrecargar el componente ,lo delegamos a una lib externa(solid);

  const onChange = (inputText) => {
    sub.next(inputText);
  };

  useEffect(() => {
    let s = sub$.subscribe(
      (rs: any) => {
        setOptions(
          rs.response.map((net) => {
            return (
              <DropDownAutoCompleteOption
                key={net.id}
                label={net.name}
                value={net.id}
              />
            );
          })
        );
      },
      (e) => {
        console.log("error subscribe", e);
      }
    );
    return () => {
      s.unsubscribe(); //limpiamos
    };
  }, [sub$]); //first time

  const setValue = (networkId, networkName) => {
    setSelectedNetworkId(networkId);
  };
  return (
    <>
      <DropdownAutoComplete
        setValue={setValue}
        onChange={onChange}
        options={options}
        placeholder="Search other Network"
      ></DropdownAutoComplete>
    </>
  );
}
