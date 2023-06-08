import t from 'i18n';
import React, { useState } from 'react';

import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import DropDownSearchLocation from 'elements/DropDownSearchLocation';
import FieldText from 'elements/Fields/FieldText';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Bounds } from 'pigeon-maps';
import { ButtonFilters, defaultFilters } from './filters.type';
import { useForm } from 'react-hook-form';
import Form from 'elements/Form';
import Filters from '../Filters';
import { buttonColorStyle, buttonTypes } from 'shared/buttonTypes';
import FieldRadio from 'elements/Fields/FieldRadio';
import FieldRadioOption from 'elements/Fields/FieldRadio/option';

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
  } = useForm({defaultValues: {
    query: filters.query
  }});

  const [selectedTypes, setSelectedTypes]= useState(() => {
    return buttonTypes.map((type) => type.name)
  })
  const [radius, setRadius] = useState(10);
  const clearFilters = (e) => {
    e.preventDefault()
    // setFilters(defaultFilters)
    toggleShowFiltersForm(false)
  }
  const onSubmit = (data) => {
    let filters = defaultFilters
    if(data.query)
    {
      filters.query = data.query
    }else{
      filters.query = ''
    }

    filters.helpButtonTypes = selectedTypes

    if(data.place)
    {
      filters.where = {address: data.place.address, center: data.place.center, radius}
    }
    setFilters(filters);
    toggleShowFiltersForm(false)
  }
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

          <HelpButtonTypes
          />
          

          <div className="form__field">
            <label className="form__label label">
              ¿Dónde buscas?
            </label>
            <DropDownSearchLocation
              placeholder={t('homeinfo.searchlocation')}
              // handleSelectedPlace={handleSelectedPlace}
            />
          </div>

          <div className="form__field">
            <label className="form__label label">
              Distancia de búsqueda
            </label>
            <select className="dropdown__dropdown">
              <option value="status" className="dropdown-select__option">10km</option>
              <option value="status" className="dropdown-select__option">100km</option>
              <option value="status" className="dropdown-select__option">200km</option>
              <option value="status" className="dropdown-select__option">300km</option>
            </select>
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
    // <>
    // {JSON.stringify(selectedTypes)}
    //   <Btn
    //     btnType={BtnType.link}
    //     caption="CANCEL"
    //     contentAlignment={ContentAlignment.center}
    //     onClick={(e) => {
    //       toggleShowFiltersForm(false);
    //     }}
    //   />
    //   <div className="filters__container">
    //     <Form
    //       classNameExtra="filters--vertical"
    //       onSubmit={handleSubmit(onSubmit)}
    //     >
    //       <FieldText
    //         name="query"
    //         label={t('buttonFilters.queryLabel')}
    //         placeholder={t('buttonFilters.queryPlaceHolder')}
    //         explain={t('buttonFilters.queryExplain')}
    //         classNameInput="squared"
    //         validationError={errors.query}
    //         {...register('query')}
    //       />
    //       {/* <Filters setSelectedTypes={setSelectedTypes}/> */}
    //       <HelpButtonTypes/>
    //       <div className="form__field">
    //         <label className="form__label label">
    //           ¿Dónde buscas?
    //         </label>
    //         <DropDownSearchLocation
    //           placeholder={t('homeinfo.searchlocation')}
    //           handleSelectedPlace={(place) => {console.log(place.geometry); setValue('place', {center: [place.lat,place.lng], address: place.formatted })}}
    //         />
    //       </div>

    //       {/* <Slider
    //              {...getSliderSettings(mapZoom, mapBounds)}
    //           /> */}
    //       <div className="form__field">
    //         <label className="form__label label">
    //           Distancia de búsqueda
    //         </label>
    //         RADIUS: {radius}
    //         <Slider min={1} max={100} onChange={(radius) => setRadius(radius)} />
    //       </div>

    //       <hr></hr>

    //       <div className="filters__actions">
    //         <Btn
    //           btnType={BtnType.submit}
    //           caption="Clear filters"
    //           contentAlignment={ContentAlignment.center}
    //           onClick={(e) => {
    //             e.preventDefault()
    //             clearFilters()
    //           }}
    //         />
    //         <Btn
    //           btnType={BtnType.submit}
    //           caption="Save filters"
    //           contentAlignment={ContentAlignment.center}
    //           submit={true}
    //         />
    //       </div>
    //     </Form>
    //   </div>
    // </>
  );
}


const HelpButtonTypes = React.forwardRef(
  ({ name, onChange, onBlur, validationError, label, explain }, ref) => {

// function HelpButtonTypes(){
  return (
    <div className="form__field">
            <label className="form__label label">
              Tipos de botón
            </label>
            <FieldRadio label={'testing'} explain={'explainme'}>
            {buttonTypes.map((buttonType, idx) => (
            <div key={idx} style={buttonColorStyle(buttonType.cssColor)}>
            <FieldRadioOption
              onChange={() => console.log('on change')}
              onBlur={() => console.log('on blur')}
              name={name}
              // ref={ref}
              value={buttonType.name}
              key={idx}
            >
            <div className="btn-filter__icon"></div>
            <div className="btn-with-icon__text">{buttonType.caption}</div>
            </FieldRadioOption>
          </div>
          
        ))}
            </FieldRadio>
          </div>
  )
});
