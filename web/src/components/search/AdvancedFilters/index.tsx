import t from 'i18n';
import React, { useEffect, useState } from 'react';

import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import DropDownSearchLocation from 'elements/DropDownSearchLocation';
import FieldText from 'elements/Fields/FieldText';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Bounds } from 'pigeon-maps';
import { ButtonFilters, defaultFilters } from './filters.type';
import { useForm } from 'react-hook-form';
import Form from 'elements/Form';
import { buttonTypes } from 'shared/buttonTypes';
import { roundCoords } from 'shared/honeycomb.utils';

//Mobile filters section that includes not only the filters but some search input fields, maybe needed to make a separate component from the rest of esktop elements
export default function AdvancedFilters({
  toggleShowFiltersForm,
  mapZoom,
  mapBounds,
  filters,
  setFilters,
}: {
  toggleShowFiltersForm: any;
  mapZoom: number;
  mapBounds: Bounds;
  filters: ButtonFilters;
  setFilters: any;
}) {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    setValue,
    watch
  } = useForm({
    defaultValues: {
      query: filters.query,
      helpButtonTypes: filters.helpButtonTypes,
      place: {
        address: filters.where.address,
        center: filters.where.center,
        radius: filters.where.radius,
      }
    },
  });

  const [selectedTypes, setSelectedTypes] = useState(() => {
    return buttonTypes.map((type) => type.name);
  });
  const clearFilters = (e) => {
    e.preventDefault();
    toggleShowFiltersForm(false);
  };
  const onSubmit = (data) => {
    let filters = defaultFilters;
    if (data.query) {
      filters.query = data.query;
    } else {
      filters.query = '';
    }

    filters.helpButtonTypes = selectedTypes;

    if (data.place) {
      filters.where = {
        address: data.place.address,
        center: data.place.center,
        radius: data.place.radius,
      };
    }
    setFilters(() => filters);
    toggleShowFiltersForm(false);
  };

  const address = watch('place.address')
  const center = watch('place.center')
  const radius = watch('place.radius')

  const handleSelectedPlace = (place) => {
    setValue('place.address', place.formatted)
    setValue('place.center', [place.geometry.lat,place.geometry.lng])
  }
  return (
    <>
    {JSON.stringify(filters)}
      <div className="filters__container">
        <Form
          classNameExtra="filters--vertical"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FieldText
            name="query"
            label={t('buttonFilters.queryLabel')}
            placeholder={t('buttonFilters.queryPlaceHolder')}
            explain={t('buttonFilters.queryExplain')}
            {...register('query')}
          />

          <HelpButtonTypes onChange={setSelectedTypes} values={filters.helpButtonTypes}/>

          <div className="form__field">
            <label className="form__label label">
              ¿Dónde buscas? { (address && center) &&
                <>({address} - {roundCoords(center).toString()})</>
              }
            </label>
            <DropDownSearchLocation
              placeholder={t('homeinfo.searchlocation')}
              handleSelectedPlace={handleSelectedPlace}
            />
          </div>

          <div className="form__field">
            <label className="form__label label">
              Distancia de búsqueda ({radius} km)
            </label>
            <div style={{backgroundColor: 'black'}}>
            <Slider min={1} max={300} onChange={(radiusValue) => setValue('place.radius', radiusValue)} defaultValue={radius} />
            </div>
          </div>

          <hr></hr>

          <div className="filters__actions">
            <Btn
              btnType={BtnType.link}
              caption="CANCEL"
              contentAlignment={ContentAlignment.center}
              onClick={clearFilters}
            />

            <Btn
              submit={true}
              btnType={BtnType.submit}
              caption="SAVE"
              contentAlignment={ContentAlignment.center}
            />
          </div>
        </Form>
      </div>
    </>
  );
}

const HelpButtonTypes = ({onChange = (newValues) => console.log(newValues), values}) => {  
  return (
    <div className="form__field">
      <label className="form__label label">Tipos de botón</label>
      <FieldMultiCheckbox availableValues={buttonTypes} onChange={onChange} defaultValues={values}/>
    </div>
  );
};


const FieldMultiCheckbox = ({availableValues = [], onChange, defaultValues}) => {
  const [values, setValues] = useState(defaultValues);
  const toggleValue = (value) => {
    setValues((prevValues) => {
      if (prevValues.indexOf(value) > -1) {
        return prevValues.filter(
          (prevValue) => prevValue != value,
        );
      }
      return [...prevValues, value]
    });
  };

  useEffect(() => {
    onChange(values);
  }, [values])

  return (
    <>
      {availableValues.map((value) => (
        <div key={value.name}>
          {value.caption}
          <input
            type="checkbox"
            checked={values.indexOf(value.name) > -1}
            onChange={(e) => toggleValue(value.name)}
          />
        </div>
      ))}
    </>
  );
}