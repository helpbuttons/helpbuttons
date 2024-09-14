import PickerField from "components/picker/PickerField"
import Btn, { BtnType, ContentAlignment } from "elements/Btn"
import DropDownSearchLocation from "elements/DropDownSearchLocation"
import t from "i18n"
import Slider from "rc-slider"
import { useState } from "react"
import { readableDistance } from "shared/sys.helper"

export function FilterByLocationRadius({handleSelectedPlace, address, center, radius, setRadius})
{
  const [showPopup, setShowPopup] =  useState(false)

  const closePopup = () => setShowPopup(() => false)
  const openPopup = () => setShowPopup(() => true)

  const marks = [100, 1000, 5000, 25000, 100000,300000 ]
  const calcRadiusFromSlider = (value) => {
    const mark = Math.ceil(value / 100)
    const min = marks[mark-1]
    const max = marks[mark]
    return min + ((max-min) / 100)* (value - (mark - 1) * 100);
  }

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

    const sliderValue = (markIndex * 100) + ((value - min) / (max - min)) * 100;
    return sliderValue;
  };

  // <PickerField label={t("buttonFilters.where")} explain={t("buttonFilters.whereExplain")} title={t("buttonFilters.where")} btnLabel={(center ? <>{t('buttonFilters.locationLimited', [address, radius])}</> : t('buttonFilters.pickLocationLimits'))} showPopup={showPopup} openPopup={openPopup} closePopup={closePopup}>
  return (
    <PickerField 
      label={t("buttonFilters.where")} 
      explain={t("buttonFilters.whereExplain")} 
      title={t("buttonFilters.where")} 
      btnLabel={(center ? <>{t('buttonFilters.locationLimited', [address, readableDistance(radius)])}</> : t('buttonFilters.pickLocationLimits'))} 
      showPopup={showPopup} 
      openPopup={openPopup} 
      closePopup={closePopup}
    >

    {/* <FieldAccordion 
      collapsed={showPopup} 
      btnLabel={(center ? <>{t('buttonFilters.locationLimited', [address, radius])}</> : t('buttonFilters.pickLocationLimits'))}
      label={t("buttonFilters.where")}
      explain={t("buttonFilters.whereExplain")}
      title={t("buttonFilters.where")}
      hideChildren={closePopup}
    > */}
     <DropDownSearchLocation
              placeholder={t('homeinfo.searchlocation')}
              handleSelectedPlace={handleSelectedPlace}
              address={address}
              // label={t('buttonFilters.where')}
              center={center}
            />
            
            {center && (
              <div className="form__field">
                <label className="form__label">
                  {t('buttonFilters.distance')} -&nbsp;
                  {readableDistance(radius)}
                </label>
                <div style={{ padding: '1rem' }}>
                  <Slider
                    min={1}
                    max={(marks.length - 1)*100}
                    onChange={(radiusValue) =>{
                      setRadius(calcRadiusFromSlider(radiusValue))
                    }
                    }
                    defaultValue={calcSliderFromRadius(radius)}
                  />
                </div>
              </div>
            )}
                <Btn
                btnType={BtnType.submit}
                caption={t('common.save')}
                contentAlignment={ContentAlignment.center}
                onClick={() => closePopup()}
              />
      </PickerField>
  );
}