import PickerField from 'components/picker/PickerField';
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import { LocationSearchBarSimple } from 'elements/LocationSearchBar';
import t from 'i18n';
import Slider from 'rc-slider';
import { useState } from 'react';
import { IoLocation, IoLocationOutline } from 'react-icons/io5';
import { readableDistance } from 'shared/sys.helper';
import { useNetworkCenter, useSelectedNetwork } from 'state/Networks';

export function FilterByLocationRadius({
  handleSelectedPlace,
  address,
  center,
  radius,
  setRadius,
}) {
  const [showPopup, setShowPopup] = useState(false);

  const focusPoint = useNetworkCenter()

  const closePopup = () => setShowPopup(() => false);
  const openPopup = () => setShowPopup(() => true);

  const marks = [100, 1000, 5000, 25000, 100000, 300000];
  const calcRadiusFromSlider = (value) => {
    const mark = Math.ceil(value / 100);
    const min = marks[mark - 1];
    const max = marks[mark];
    return min + ((max - min) / 100) * (value - (mark - 1) * 100);
  };

  const calcSliderFromRadius = (value) => {
    let markIndex = 0;

    for (let i = 0; i < marks.length - 1; i++) {
      if (value >= marks[i] && value <= marks[i + 1]) {
        markIndex = i;
        break;
      }
    }

    const min = marks[markIndex];
    const max = marks[markIndex + 1];

    const sliderValue =
      markIndex * 100 + ((value - min) / (max - min)) * 100;
    return sliderValue;
  };

  const [pickedRadius, setPickedRadius] = useState(radius);
  const [pickedPosition, setPickedPosition] = useState(center);
  const [pickedAddress, setPickedAddress] = useState(address);

  const saveAndClose = () => {
    setRadius(pickedRadius);
    handleSelectedPlace(pickedAddress, pickedPosition)
    closePopup();
  };
  const discardAndClose = () => {
    setPickedRadius(() => radius);
    setPickedPosition(() => center);
    setPickedAddress(() => null);
    closePopup();
  };
  return (
    <PickerField
      label={t('buttonFilters.where')}
      explain={t('buttonFilters.whereExplain')}
      title={t('buttonFilters.where')}
      iconLink = {<IoLocationOutline/>}
      btnLabel={
        pickedAddress ? (
          <>
            {t('buttonFilters.locationLimited', [
              pickedAddress,
              readableDistance(pickedRadius),
            ])}
          </>
        ) : (
          t('buttonFilters.pickLocationLimits')
        )
      }

      showPopup={showPopup}
      openPopup={openPopup}
      closePopup={discardAndClose}
    >
      <LocationSearchBarSimple 
        placeholder={t('homeinfo.searchlocation')}
        markerAddress={pickedAddress}
        setMarkerAddress={(address) => setPickedAddress(() => address)}
        focusPoint={focusPoint}
        setMarkerPosition={(markerPosition) => setPickedPosition(() => markerPosition)}
      />
      {pickedAddress && (
        <div className="form__field">
          <label className="form__label">
            {t('buttonFilters.distance')} -&nbsp;
            <>{readableDistance(pickedRadius)}</>
          </label>
          <div style={{ padding: '1rem' }}>
            <Slider
              min={0}
              max={(marks.length - 1) * 100}
              onChange={(radiusValue) => {
                setPickedRadius(() =>
                  calcRadiusFromSlider(radiusValue),
                );
              }}
              defaultValue={calcSliderFromRadius(pickedRadius)}
            />
          </div>
        </div>
      )}
      <Btn
        btnType={BtnType.submit}
        caption={t('common.save')}
        contentAlignment={ContentAlignment.center}
        onClick={() => saveAndClose()}
      />
    </PickerField>
  );
}
