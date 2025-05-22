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
        if (!showLongPressMenu) {
            setAddress(() => null)
        }
    }, [showLongPressMenu])
    const events = {
        onMouseDown: (e) => { if(e.target.tagName != 'BUTTON') {setStartLongPress(true); }},
        onMouseUp: () => setStartLongPress(false),
        onMouseLeave: () => setStartLongPress(false),
        onTouchStart: () => setStartLongPress(true),
        onTouchEnd: () => setStartLongPress(false),
    }

    const findGeoReverse = useGeoReverse();
    useEffect(() => {
        if (showLongPressMenu) {
            findGeoReverse(mapClickCoords, false, (place) => { setAddress(() => place.formatted) }, () => alertService.error('unknown place'))
        }
    }, [mapClickCoords])

    const menu = showLongPressMenu ? (<div>
        <Btn
            btnType={BtnType.submit}
            contentAlignment={ContentAlignment.center}
            caption={t('explore.create')}
            onClick={() => router.push(`/ButtonNew/${zoom}/${mapClickCoords[0]}/${mapClickCoords[1]}`)}
            submit={false}
        />
    </div>) : null

    const location = (<div><LocationCoordinates
          latitude={mapClickCoords[0]}
          longitude={mapClickCoords[1]}
          address={address}
          label={''}
        /></div>)
    return { events, menu, location }
}