import Btn, { BtnType, ContentAlignment } from "elements/Btn";
import { LocationCoordinates } from "elements/Fields/FieldLocation";
import { useGeoReverse } from "elements/Fields/FieldLocation/location.helpers";
import t from "i18n";
import router from "next/router";
import { useEffect, useState } from "react";
import { alertService } from "services/Alert";
import { GlobalState, useGlobalStore } from "state";

export const useMapLongPress = () => {

    const [startLongPress, setStartLongPress] = useState(false);
    const [showLongPressMenu, setShowLongPressMenu] = useState(false)
    const [clickPosition, setClickPosition] = useState([0, 0])
    const [menuPosition, setMenuPosition] = useState([0, 0])
    const mapClickCoords = useGlobalStore((state: GlobalState) => state.explore.settings.mapClick)
    const zoom = useGlobalStore((state: GlobalState) => state.explore.settings.zoom)
    const [address, setAddress] = useState(null)
    useEffect(() => {
      let timerId;
      if (startLongPress) {
        setShowLongPressMenu(() => false)
        timerId = setTimeout(() => { setShowLongPressMenu(() => true) }, 500);
      } else {
        clearTimeout(timerId);
      }
  
      return () => {
        clearTimeout(timerId);
      };
    }, [startLongPress]);
  
    useEffect(() => {
      if (showLongPressMenu) {
        setMenuPosition(() => [clickPosition[0] + 20, clickPosition[1] - 380])
      }
      if(!showLongPressMenu)
      {
        setAddress(() => null)
      }
    }, [showLongPressMenu])
    const events = {
      onMouseDown: (e) => { setStartLongPress(true); setClickPosition([e.pageX, e.pageY]) },
      onMouseUp: () => setStartLongPress(false),
      onMouseLeave: () => setStartLongPress(false),
      onTouchStart: () => setStartLongPress(true),
      onTouchEnd: () => setStartLongPress(false)
    }
  
    const findGeoReverse = useGeoReverse();
    useEffect(() => {
      if(showLongPressMenu)
      {
        findGeoReverse(mapClickCoords, false, (place) => {setAddress(() => place.formatted)}, () => alertService.error('unknown place'))
      }
    }, [mapClickCoords])
    
  
  
    const menu = (<>{showLongPressMenu && <div className='index__explore-map-menu-overflow' style={{ '--long-press-menu-x': `${menuPosition[0]}px`, '--long-press-menu-y': `${menuPosition[1]}px` }}>
      <div className="card-button__dropdown-container">
        <div className="card-button__dropdown-arrow"></div>
        <div className="card-button__dropdown-content" id="listid">
          {t('explore.create')}
          <Btn
            btnType={BtnType.submit}
            contentAlignment={ContentAlignment.center}
            caption={t('common.publish')}
            onClick={() => router.push(`/ButtonNew/${zoom}/${mapClickCoords[0]}/${mapClickCoords[1]}`)}
            submit={false}
          />
          <LocationCoordinates
          latitude={mapClickCoords[0]}
          longitude={mapClickCoords[1]}
          address={address}
          label={''}
        />
        </div>
      </div>
  
    </div>}</>)
    return { events, menu,  showMenu: showLongPressMenu}
  }