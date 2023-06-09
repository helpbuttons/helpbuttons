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
import { buttonColorStyle, buttonTypes } from 'shared/buttonTypes';
import { roundCoords } from 'shared/honeycomb.utils';
import FieldCheckbox from 'elements/Fields/FieldCheckbox';
import CheckBox, { CheckBoxIcon } from 'elements/Checkbox';

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
    watch,
  } = useForm({
    defaultValues: {
      query: filters.query,
      helpButtonTypes: filters.helpButtonTypes,
      place: {
        address: filters.where.address,
        center: filters.where.center,
        radius: filters.where.radius,
      },
    },
  });

  const [selectedTypes, setSelectedTypes] = useState(filters.helpButtonTypes);
  const clearFilters = (e) => {
    e.preventDefault();
    setValue('query', '')

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

  const address = watch('place.address');
  const center = watch('place.center');
  const radius = watch('place.radius');

  const handleSelectedPlace = (place) => {
    setValue('place.address', place.formatted);
    setValue('place.center', [
      place.geometry.lat,
      place.geometry.lng,
    ]);
  };

  const uniqueArray = (a) =>
      Array.from(new Set(a.map((o) => JSON.stringify(o)))).map((s) =>
        JSON.parse(s),
      );

  const setButtonTypeValue = (name, value) => {
    setSelectedTypes((prevValues) => {
      if (value)
      {
        return uniqueArray([...prevValues, name]);  
      }
      return uniqueArray(prevValues.filter((prevValue) => prevValue != name));
    });
  };

  return (
    <>
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

          <FieldCheckbox
            label={'Tipos de botón'}
            validationError={null}
            explain={'exlpain'}
          >
            {buttonTypes.map((buttonType) => {
              return (
                <div style={buttonColorStyle(buttonType.cssColor)}>
                  <CheckBox
                    defaultValue={
                      filters.helpButtonTypes.indexOf(
                        buttonType.name,
                      ) > -1
                    }
                    name={buttonType.name}
                    handleChange={(name, newValue) => {
                      setButtonTypeValue(name, newValue);
                    }}
                  >
                    <div className="btn-filter__icon"></div>
                    <div className="btn-with-icon__text">
                      {buttonType.caption}
                    </div>
                  </CheckBox>
                </div>
              );
            })}
          </FieldCheckbox>
          <div className="form__field">
            <label className="form__label label">
              ¿Dónde buscas?{' '}
              {address && center && (
                <>
                  ({address} - {roundCoords(center).toString()})
                </>
              )}
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
            <div style={{ backgroundColor: 'black' }}>
              <Slider
                min={1}
                max={300}
                onChange={(radiusValue) =>
                  setValue('place.radius', radiusValue)
                }
                defaultValue={radius}
              />
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