import PickerField from "components/picker/PickerField";
import Btn, { BtnType, ContentAlignment, IconType } from "elements/Btn";
import FieldLocation, { LocationCoordinates } from "elements/Fields/FieldLocation";
import t from "i18n";
import { useEffect, useState } from "react";
import { IoLocationOutline, IoTrashBinOutline } from "react-icons/io5";
import { store } from "state";
import { CreateKeyLocation, DeleteKeyLocation, ListKeyLocation } from "state/Geo";
import { useSelectedNetwork } from "state/Networks";

export function FieldKeySpots() {
    const [showPopup, setShowPopup] = useState(false)

    const closePopup = () => setShowPopup(() => false)
    const openPopup = () => setShowPopup(() => true)

    return (<PickerField iconLink={<IoLocationOutline />} showPopup={showPopup} validationError={null} label={t('configuration.locationKeys')} btnLabel={t('configuration.locationKeys')} explain={t('configuration.keyLocationsExplain')} headerText={t('picker.headerText')} openPopup={openPopup} closePopup={closePopup}>
        <div className="location-keys">
            <LocationKeyTable />
        </div>
    </PickerField>

    )

}


export function LocationKeyAdd({ addAction }) {
    const selectedNetwork = useSelectedNetwork()
    const [locationName, setLocationName] = useState('')
    const [latitude, setLatitude] = useState(0)
    const [longitude, setLongitude] = useState(0)
    const [isCustomAddress, setIsCustomAddress] = useState(false)

    const onCloseAndSave = (place, afterSave) => {
        addAction(place, () => {
            afterSave()
        })
    }
    return <div className="location-keys--form">
        <FieldLocation
            label={t('configuration.addLocationKey')}
            headerText={t('configuration.keyLocations')}
            explain={t('configuration.keyLocationsExplain')}
            setLatitude={(lat) => setLatitude(() => lat)}
            setLongitude={(lng) => setLongitude(() => lng)}
            markerPosition={[latitude, longitude]}
            setMarkerAddress={(address) => { setLocationName(() => address) }}
            setHideAddress={(value) => { }}
            hideAddress={false}
            markerCaption={locationName}
            isLocationKey={true}
            selectedNetwork={selectedNetwork}
            validationError={[]}
            isCustomAddress={isCustomAddress}
            setIsCustomAddress={setIsCustomAddress}
            markerColor={'white'}
            markerAddress={locationName}
            onCloseAndSave={onCloseAndSave}
        />
    </div>
}

export function LocationKeyItem({ place, deleteAction }) {

    return <div>
        <LocationCoordinates latitude={place.latitude} longitude={place.longitude} address={place.address} label={'no'} />
        <Btn
            btnType={BtnType.iconActions}
            iconLink={<IoTrashBinOutline />}
            iconLeft={IconType.circle}
            contentAlignment={ContentAlignment.center}
            onClick={() => {
                deleteAction(place.id)
            }}
        />
    </div>
}


export function LocationKeyTable() {

    const [locations, setLocations] = useState([])
    const reloadLocations = () => {
        store.emit(
            new ListKeyLocation((list) => {
                setLocations(() => list)
            }),
        );
    }
    useEffect(() => {
        reloadLocations()
    }, []);

    const addLocation = (place, afterAdd) => {
        store.emit(new CreateKeyLocation(place, () => {

            afterAdd()
            reloadLocations()
        }))

    }
    const deleteLocation = (id) => {
        store.emit(new DeleteKeyLocation(id))
        setLocations((prevLocations) => prevLocations.filter((place) => place.id != id))
    }
    return (
        <>
            <LocationKeyAdd addAction={addLocation} />
            <div>
                {locations?.length > 0 && (
                    <div>
                        {locations.map((place, idx) =>
                            <LocationKeyItem key={idx} place={place} deleteAction={deleteLocation} />
                        )}
                    </div>
                )}
            </div>
        </>
    )
}
