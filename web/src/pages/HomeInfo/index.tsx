//INFO AND RESULTS
//libraries
import { useState, useEffect } from "react";
import { ImageContainer } from "elements/ImageWrapper";
import { useRef } from "store/Store";
import { Subject } from "rxjs";
// import {
//   setValueAndDebounce,
// } from "./data";
import {
  DropdownAutoComplete,
  DropDownAutoCompleteOption,
} from "elements/DropDownAutoComplete";
import { GlobalState, store } from "pages";
import { setValueAndDebounce } from "state/HomeInfo";
import router from "next/router";
import t from "i18n";
import { alertService } from "services/Alert";
import { Network } from "shared/entities/network.entity";
import NetworkLogo from "components/network/Components";

export default function HomeInfo() {

  const selectedNetwork : Network = useRef(
    store,
    (state: GlobalState) => state.networks.selectedNetwork
  );
  const selectedNetworkLoading = useRef(
    store,
    (state: GlobalState) => state.networks.selectedNetworkLoading
  );
   
  return (
    <div className="info-overlay__container">
      <div className="info-overlay__content">
        <form className="info-overlay__location">
          <label className="form__label label">
            {t("homeinfo.start")}
          </label>
          <DropDownWhere />
          {/* <input
              type="text"
              className="form__input"
              placeholder="Search Location"
            ></input> */}
        </form>
        {selectedNetworkLoading && (
          <>
            <div className="info-overlay__card">Loading...</div>
          </>
        )}
        {selectedNetwork && (
          <><style jsx global>{`
          .info-overlay__container {
            background-image:  url(/api/${selectedNetwork.jumbo});
           }
         `}</style>
          <div className="info-overlay__card">
            <div className="card">
              <div className="card__header">
                <NetworkLogo
                  network={selectedNetwork}
                />
                <h3 className="card__header-title">{selectedNetwork.name}</h3>
              </div>
              <div className="info-overlay__description">
                {selectedNetwork.description}
              </div>
            </div>
          </div>
          </>
        )}

        {/* Uncomment when we enable multi network */}
        {/* <div className="info-overlay__bottom"> */}
        {/*   <div className="info-overlay__nets"> */}
        {/*     <DropdownNetworks/> */}
        {/*     <Link href="/NetworkNew"> */}
        {/*       <Btn */}
        {/*         btnType={BtnType.corporative} */}
        {/*         contentAlignment={ContentAlignment.center} */}
        {/*         caption="Create Network" */}
        {/*       /> */}
        {/*     </Link> */}
        {/*   </div> */}
        {/* </div> */}
      </div>
    </div>
  );
}

// Uncomment when we enable multi networks
//
// function DropdownNetworks() {
//   const timeInMsBetweenStrokes = 200; //ms
//
//   const [options, setOptions] = useState([]);
//
//   const [sub, setSub] = useState(new Subject()); //evita la inicializaacion en cada renderizado
//   const [sub$, setSub$] = useState(
//     setValueAndDebounce(sub, timeInMsBetweenStrokes)
//   ); //para no sobrecargar el componente ,lo delegamos a una lib externa(solid);
//
//   const onChange = (inputText) => {
//     sub.next(inputText);
//   };
//
//   useEffect(() => {
//     let s = sub$.subscribe(
//       (rs: any) => {
//         setOptions(
//           rs.response.map((net) => {
//             return (
//               <DropDownAutoCompleteOption
//                 key={net.id}
//                 label={net.name}
//                 value={net.id}
//               />
//             );
//           })
//         );
//       },
//       (e) => {
//         console.log("error subscribe", e);
//       }
//     );
//     return () => {
//       s.unsubscribe(); //limpiamos
//     };
//   }, [sub$]); //first time
//
//   const setValue = (networkId, networkName) => {
//     setSelectedNetworkId(networkId);
//   };
//   return (
//     <>
//       <DropdownAutoComplete
//         setValue={setValue}
//         onChange={onChange}
//         options={options}
//         placeholder="Search other Network"
//       ></DropdownAutoComplete>
//     </>
//   );
// }

function DropDownWhere() {
  
  const timeInMsBetweenStrokes = 150; //ms

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
          rs.results.map((place) => {
            return (
              <DropDownAutoCompleteOption
                key={place.place_id}
                label={place.formatted}
                value={JSON.stringify(place)}
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

  const setValue = (place) => {
    place = JSON.parse(place);
    router.push({
      pathname: "/Explore",
      query: { lat: place.lat, lng: place.lon },
    });
    // move to explore with this coordinates?!
  };
  // const setValue = (networkId, networkName) => {
  //   setSelectedNetworkId(networkId);
  // };
  return (
    <>
      <DropdownAutoComplete
        setValue={setValue}
        onChange={onChange}
        options={options}
        placeholder={t("homeinfo.searchlocation")}
      ></DropdownAutoComplete>
    </>
  );
}