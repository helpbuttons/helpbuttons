import { BtnCaption } from 'elements/Btn';
import router from 'next/router';
import { GlobalState, store, useGlobalStore } from 'state';
import { useEffect, useState } from 'react';
import { useButtonTypes } from 'shared/buttonTypes';
import {
  UpdateFilters,
  UpdateFiltersToFilterButtonType,
} from 'state/Explore';
import { useStore } from 'state';
import FieldMultiSelect from 'elements/Fields/FieldMultiSelect';
import MultiSelectOption from 'elements/MultiSelectOption';
import t from 'i18n';

export function ListButtonTypes() {
  const filters = useStore(
    store,
    (state: GlobalState) => state.explore.map.filters,
    false
  );
  const pageName = useGlobalStore((state: GlobalState) => state.homeInfo.pageName)
  const buttonTypes = useButtonTypes();
  const selectedNetwork = useGlobalStore((state: GlobalState) => state.networks.selectedNetwork)

  const [types, setTypes] = useState([]);
  useEffect(() => {
    if (buttonTypes) {

      setTypes(() => {
      return buttonTypes.map((buttonType) => {
        const typeCount = selectedNetwork.buttonTypesCount.find(
          (buttonTypeCount) =>
            buttonTypeCount.type == buttonType.name,
        )?.count;

        const disabled = !typeCount;

        return {
          ...buttonType,
          caption: `${buttonType.caption}`,
          selected: false,
          disabled,
        }
      });
    });

    }
  }, [buttonTypes]);

  useEffect(() => {
    const selectedTypes = filters.helpButtonTypes;
    if (selectedTypes) {
      setTypes(() => types.map((type) => {
        if (selectedTypes.indexOf(type.name) > -1) {
          return { ...type, selected: true, }
        }
        return { ...type, selected: false };
      }))
    }
  }, [filters.helpButtonTypes])
  const handleClick = (type) => {

    const newFilters = { ...filters, helpButtonTypes: [type] }
    store.emit(new UpdateFilters(newFilters));
    if (pageName != 'Explore') {
      router.push('/Explore');
    }
  }

  return (
    <>
      {types.map((buttonType, idx) => {
        return <div key={idx} className="hashtags__list-item"><BtnButtonType type={buttonType} onClick={handleClick} /></div>

      })}
    </>
  );
}

export function BtnButtonType({ type, onClick = (type) => { } }) {
  return (
      <BtnCaption
        caption={`${type.caption}`}
        // caption={`${type.caption} ${type.selected ? '!': ''}`}
        icon={type?.icon}
        color={type.cssColor}
        disabled={type.disabled}
        onClick={() =>
          onClick(type.name)
        }
      />
  );
}



export function FieldMultiSelectButtonTypes({ selectedTypes, types, handleChange }) {
  return (<FieldMultiSelect
    label={t('buttonFilters.types')}
    validationError={null}
    explain={t('buttonFilters.typesExplain')}
  >
    <MultiSelectButtonTypes selectedTypes={selectedTypes} types={types} handleChange={handleChange} />
  </FieldMultiSelect>
  )
}
export function MultiSelectButtonTypes({ selectedTypes, types, handleChange }) {
  return <>
    {(selectedTypes && types) && types.map((buttonType, idx) => {
      return (

        <MultiSelectOption
          iconLink={buttonType.icon}
          color={buttonType.cssColor}
          icon='emoji'
          name={buttonType.name}
          handleChange={(name, newValue) => {
            handleChange(name, newValue)
          }}
          key={idx}
          checked={selectedTypes.indexOf(buttonType.name) > -1}
        >
          {/* <div className="btn-filter__icon"></div> */}
          <div className="btn-with-icon__text">
            {buttonType.caption}
          </div>
        </MultiSelectOption>
      );
    })}</>

}