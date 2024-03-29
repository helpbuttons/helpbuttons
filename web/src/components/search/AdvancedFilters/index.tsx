import t from 'i18n';
import React, { useEffect, useState } from 'react';
import Btn, { BtnType, ContentAlignment, IconType } from 'elements/Btn';
import FieldText from 'elements/Fields/FieldText';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { defaultFilters } from './filters.type';
import { useForm } from 'react-hook-form';
import Form from 'elements/Form';
import { buttonColorStyle } from 'shared/buttonTypes';
import { GlobalState, store } from 'pages';
import { ResetFilters, ToggleAdvancedFilters, UpdateFilters } from 'state/Explore';
import router from 'next/router';
import { useStore } from 'store/Store';
import { useButtonTypes } from 'shared/buttonTypes';
import FieldMultiSelect from 'elements/Fields/FieldMultiSelect';
import { uniqueArray } from 'shared/sys.helper';
import MultiSelectOption from 'elements/MultiSelectOption';
import { AdvancedFiltersCustomFields, getCustomDropDownOrderBy } from 'components/button/ButtonType/CustomFields/AdvancedFiltersCustomFields';
import { Dropdown, DropdownField } from 'elements/Dropdown/Dropdown';
import DropDownSearchLocation from 'elements/DropDownSearchLocation';
import { alertService } from 'services/Alert';
import { FollowTag } from 'state/Users';


export default function AdvancedFilters({
  isHome = false,
}) {
  const filters = useStore(
    store,
    (state: GlobalState) => state.explore.map.filters,
    false
  );

  const queryFoundTags = useStore(
    store,
    (state: GlobalState) => state.explore.map.queryFoundTags,
    false
  );

  const showAdvancedFilters = useStore(
    store,
    (state: GlobalState) => state.explore.map.showAdvancedFilters,
    false
  );
  const [buttonTypes, setButtonTypes] = useState([]);
  useButtonTypes(setButtonTypes);

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: filters
  });

  const clearFilters = (e) => {
    e.preventDefault();
    reset(defaultFilters)
    store.emit(new ResetFilters());
    store.emit(new ToggleAdvancedFilters(false))
  };
  const onSubmit = (data) => {
    const newFilters = { ...filters, ...data }
    store.emit(new UpdateFilters(newFilters));
    store.emit(new ToggleAdvancedFilters(false))

    if (isHome) {
      router.push('/Explore');
    }
  };

  const address = watch('where.address');
  const center = watch('where.center');
  const radius = watch('where.radius');
  const helpButtonTypes = watch('helpButtonTypes');
  const [tags, setTags] = useState([])
  const query = watch('query');

  const handleSelectedPlace = (place) => {
    setValue('where.address', place.formatted);
    setValue('where.center', [
      place.geometry.lat,
      place.geometry.lng,
    ]);
  };


  const setButtonTypeValue = (name, value) => {
    if (value) {
      setValue(
        'helpButtonTypes',
        uniqueArray([...helpButtonTypes, name]),
      );
      return;
    }
    setValue(
      'helpButtonTypes',
      uniqueArray(
        helpButtonTypes.filter((prevValue) => prevValue != name),
      ),
    );
  };

  useEffect(() => {
    if(queryFoundTags)
    {
      setTags(() => queryFoundTags)
    }
  }, [queryFoundTags])
  useEffect(() => {
    reset(filters)
  }, [filters])

  useEffect(() => {
    const params = new URLSearchParams(router.query)
    if(params.has('showFilters'))
    {
      store.emit(new ToggleAdvancedFilters(true))
    }else{
      store.emit(new ToggleAdvancedFilters(false))
    }
    
  }, [])
  
  return (
    <>
      {showAdvancedFilters && (
          <Form
            classNameExtra="filters__container"
            onSubmit={handleSubmit(onSubmit)}
          >
          <div className="filters__content">

            <FieldText
              name="query"
              label={t('buttonFilters.queryLabel')}
              placeholder={t('buttonFilters.queryPlaceHolder')}
              explain={t('buttonFilters.queryExplain')}
              {...register('query')}
            ><TagFollow tags={tags}/></FieldText>
            
            <FieldMultiSelect
              label={t('buttonFilters.types')}
              validationError={null}
              explain={t('buttonFilters.typesExplain')}
            >
              {buttonTypes.map((buttonType) => {
                return (
                  <div
                    key={buttonType.name}
                    style={buttonColorStyle(buttonType.cssColor)}
                  >
                    <MultiSelectOption
                      defaultValue={
                        helpButtonTypes.indexOf(buttonType.name) > -1
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
                    </MultiSelectOption>
                  </div>
                );
              })}
            </FieldMultiSelect>
            
            <DropDownSearchLocation
              placeholder={t('homeinfo.searchlocation')}
              handleSelectedPlace={handleSelectedPlace}
              address={address}
              label={t('buttonFilters.where')}
              explain={t('buttonFilters.whereExplain')}
              center={center}
            />
            
            {center && (
              <div className="form__field">
                <label className="form__label">
                  {t('buttonFilters.distance')} ({radius} km)
                </label>
                <div style={{ padding: '1rem' }}>
                  <Slider
                    min={1}
                    max={300}
                    onChange={(radiusValue) =>
                      setValue('where.radius', radiusValue)
                    }
                    defaultValue={radius}
                  />
                </div>
              </div>
            )}

            <AdvancedFiltersSortDropDown
              className={'dropdown__dropdown-trigger'}
              label={t('buttonFilters.orderBy')}
              explain={t('buttonFilters.orderByExplain')}
              orderBy={watch('orderBy')}
              isForm={true}
              setOrderBy={(value) => setValue('orderBy',value)}
              buttonTypes={buttonTypes}
              selectedButtonTypes={watch('helpButtonTypes')}
            />

              <AdvancedFiltersCustomFields watch={watch} buttonTypes={buttonTypes} register={register} setValue={setValue}/>
            </div>
            <div className={ isHome ? 'filters__actions' : 'filters__actions'  }>
              <div className={'filters__actions--buttons'}>
                <Btn
                  btnType={BtnType.corporative}
                  caption={t('common.reset')}
                  contentAlignment={ContentAlignment.center}
                  onClick={clearFilters}
                />

                <Btn
                  submit={true}
                  btnType={BtnType.submit}
                  caption={t('common.search')}
                  contentAlignment={ContentAlignment.center}
                />
              </div>
            </div>
          </Form>
      )}
    </>
  );
}

export function AdvancedFiltersSortDropDown({className, label = '', orderBy, setOrderBy, buttonTypes, selectedButtonTypes, isForm = false, explain = '' }) {

//   -Order by creation date (default)
// -Order by proximity (When a place is selected)
// -Order by price
// -Order by event date (Closer dates appear before)
  let dropdownOptions = [
    {
      value: ButtonsOrderBy.DATE,
      name: t('buttonFilters.byDate'),
    },
    {
      value: ButtonsOrderBy.PROXIMITY,
      name: t('buttonFilters.byProximity'),
    },
  ];

  dropdownOptions = getCustomDropDownOrderBy(dropdownOptions,buttonTypes, selectedButtonTypes )
  return (
    <>
      {isForm ? 
        (
          <DropdownField
            className={className}
            explain={explain}
            label={label}
            options={dropdownOptions}
            onChange={(value) => {setOrderBy(value)}}
            defaultSelected={orderBy}
          />
        ) : (
          <Dropdown
          className={className}
          options={dropdownOptions}
          onChange={(value) => {setOrderBy(value)}}
          defaultSelected={orderBy}
          />
        )  
      }
      
    </>
  );
}

function TagFollow({tags}) {
  const loggedInUser = useStore(
    store,
    (state: GlobalState) => state.loggedInUser,
    false,
  );
  const followTag = (tag) => {
    if (!loggedInUser) {
      router.push(`/Signup?follow=${tag}`)
      return;
    }
    store.emit(new FollowTag(tag, () => {alertService.success(t('buttonFilters.followTagSucess', [tag]))}));
  }

  return (
    <>

        {tags.map((tag) => {
          return ( 
                  <Btn
                      btnType={BtnType.submit}
                      contentAlignment={ContentAlignment.center}
                      caption={`${t('buttonFilters.followTag')} '${tag}'`}
                      onClick={() => { followTag(tag) }}
                    />
                  )
        })}
    </>
  )
}

export enum ButtonsOrderBy {
  DATE = 'date',
  PROXIMITY = 'proximity',
  PRICE = 'price',
  EVENT_DATE = 'eventDate',
}