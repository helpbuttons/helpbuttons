import t from "i18n";
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import React, {useState} from "react";

import DropDownSearchLocation from "elements/DropDownSearchLocation";
import FieldText from 'elements/Fields/FieldText';


//Mobile filters section that includes not only the filters but some search input fields, maybe needed to make a separate component from the rest of esktop elements
export default function AdvancedFilters({
  onSubmit,
  watch,
  reset,
  getValues,
  handleSubmit,
  register,
  errors,
  control,
  setValue,
  setFocus,
  isSubmitting,
  title,
  showFilters,
  setShowFilters,
}) {


  return (
    <>
      { showFilters && (
        <div className="filters__container">
          <form className="filters--vertical">

              <FieldText
                    name="title"
                    label="Qué buscas"
                    placeholder="Escribe aquí lo que quieras"
                    watch={watch}
                    setValue={setValue}
                    setFocus={setFocus}
                    explain="Explain what's for here"
              />


              <div className="form__field">
                <label className="form__label label">
                  Tipos de botón
                </label>
                <button className="btn-with-icon">
                  <div className="btn-filter__split-icon">
                    <div className="btn-filter__split-icon--half green-l"></div>
                    <div className="btn-filter__split-icon--half red-r"></div>
                  </div>
                  <div className="btn-with-icon__text">
                    Need
                  </div>
                </button>
                <button className="btn-with-icon">
                  <div className="btn-filter__split-icon">
                    <div className="btn-filter__split-icon--half green-l"></div>
                    <div className="btn-filter__split-icon--half red-r"></div>
                  </div>
                  <div className="btn-with-icon__text">
                    Offer
                  </div>
                </button>
                <button className="btn-with-icon">
                  <div className="btn-filter__split-icon">
                    <div className="btn-filter__split-icon--half green-l"></div>
                    <div className="btn-filter__split-icon--half red-r"></div>
                  </div>
                  <div className="btn-with-icon__text">
                    Service
                  </div>
                </button>
              </div>

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
                        onClick={(e) => {setShowFilters(false)}}
                      />

                      <Btn
                        btnType={BtnType.submit}
                        caption="SAVE"
                        contentAlignment={ContentAlignment.center}
                        onClick={(e) => {setShowFilters(false);}}
                      />
              </div>

          </form>

        </div>
      )}
    </>
);
}
