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
import { readableDistance, uniqueArray } from 'shared/sys.helper';
import MultiSelectOption from 'elements/MultiSelectOption';
import { AdvancedFiltersCustomFields, getCustomDropDownOrderBy } from 'components/button/ButtonType/CustomFields/AdvancedFiltersCustomFields';
import { Dropdown, DropdownField } from 'elements/Dropdown/Dropdown';
import DropDownSearchLocation from 'elements/DropDownSearchLocation';
import { alertService } from 'services/Alert';
import { FollowTag, FollowTags } from 'state/Users';
import Popup from 'components/popup/Popup';
import PickerField from 'components/picker/PickerField';
import { Network } from 'shared/entities/network.entity';
import { AllSuggestedTags, TagList, updateQueryWhenTagAdded, useTagsList } from 'elements/Fields/FieldTags';
import _ from 'lodash';


export default function AdvancedFilters({
  isHome = false,
}) {
  const filters = useStore(
    store,
    (state: GlobalState) => state.explore.map.filters,
    false
  );

  const showAdvancedFilters = useStore(
    store,
    (state: GlobalState) => state.explore.map.showAdvancedFilters,
    false
  );
  
  const selectedNetwork: Network = useStore(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );

  const buttonTypes = useButtonTypes();

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
  const tags = watch('tags')
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
  const {onInputChange, inputKeyDown, input, remove, addTag} = useTagsList({
    tags,
    setTags : (tags) => {
      setValue('tags', tags)
    }
  })
  return (
    <>
      {(selectedNetwork && showAdvancedFilters) && (
        <>
          <div className='filters__wrapper'>
            <Popup         
              title={t('buttonFilters.filters')}
              cancelAction={clearFilters}
              approveAction={handleSubmit(onSubmit)}
              linkBack={() => {
                store.emit(new ToggleAdvancedFilters(false))
              }}
            >
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
                    >
                      <TagList tags={tags} remove={remove}/>
                      <AllSuggestedTags word={query.substring(query.lastIndexOf(" ")+1)} maxTags={5} tags={tags} addTag={(tag) => {addTag(tag); setValue('query',updateQueryWhenTagAdded(query, tag))}}/>
                      <TagFollow tags={tags}/>
                    </FieldText>
                    <FieldMultiSelect
                      label={t('buttonFilters.types')}
                      validationError={null}
                      explain={t('buttonFilters.typesExplain')}
                    > 
                      {(helpButtonTypes && buttonTypes) && buttonTypes.map((buttonType) => {
                        return (
                          <div
                            key={buttonType.name}
                            style={buttonColorStyle(buttonType.cssColor)}
                          >
                            <MultiSelectOption
                              defaultValue={
                                helpButtonTypes.indexOf(buttonType.name) > -1
                              } 
                              iconLink={buttonType.icon}
                              color={buttonType.cssColor}
                              icon='emoji'
                              name={buttonType.name}
                              handleChange={(name, newValue) => {
                                setButtonTypeValue(name, newValue);
                              }}
                            >
                              {/* <div className="btn-filter__icon"></div> */}
                              <div className="btn-with-icon__text">
                                {buttonType.caption}
                              </div>
                            </MultiSelectOption>
                          </div>
                        );
                      })}
                    </FieldMultiSelect>
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

                    <FilterByLocationRadius handleSelectedPlace={handleSelectedPlace} address={address} center={center} radius={radius} setRadius={(value) => setValue('where.radius', value)}/>

                  </div>
                
              </Form>
            </Popup>
          </div>
          <div className='filters__close-overlay'
            onClick={() => store.emit(new ToggleAdvancedFilters(false))}
          >
          </div>
        </>
      )}
    </>
  );
}


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
            value={orderBy}
          />
        ) : (
          <Dropdown
          className={className}
          options={dropdownOptions}
          onChange={(value) => {setOrderBy(value)}}
          value={orderBy}
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

  const followTags = (tags) => {
    if (!loggedInUser) {
      router.push(`/Signup?follow=${tags}`)
      return;
    }
    store.emit(new FollowTags(tags, () => {alertService.success(t('buttonFilters.followTagsSucess', [tags]))}));
  }

  const [tagsToFollow, setTagsToFollow] = useState(tags)
  useEffect(() => {
    if(loggedInUser)
    {
      setTagsToFollow(() => 
        _.difference(tags, loggedInUser.tags)
      )
    }
  }, [loggedInUser, tags])
  return (
    <>
      {(tagsToFollow && tagsToFollow.length > 0) && 
        <Btn
            btnType={BtnType.submit}
            contentAlignment={ContentAlignment.center}
            caption={`${t('buttonFilters.followTag')} '${tagsToFollow.join(', ')}'`}
            onClick={() => { followTags(tagsToFollow) }}
          />
      }
    </>
  )
}

export enum ButtonsOrderBy {
  DATE = 'date',
  PROXIMITY = 'proximity',
  PRICE = 'price',
  EVENT_DATE = 'eventDate',
}