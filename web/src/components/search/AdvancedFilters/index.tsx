import t from 'i18n';
import React, { useEffect, useState } from 'react';
import Btn, { BtnType, ContentAlignment, IconType } from 'elements/Btn';
import FieldText from 'elements/Fields/FieldText';
import 'rc-slider/assets/index.css';
import { defaultFilters } from './filters.type';
import { useForm } from 'react-hook-form';
import Form from 'elements/Form';
import { buttonColorStyle } from 'shared/buttonTypes';
import { GlobalState, store } from 'state';
import { ResetFilters, ToggleAdvancedFilters, UpdateFilters } from 'state/Explore';
import router from 'next/router';
import { useStore } from 'state';
import { useButtonTypes } from 'shared/buttonTypes';
import FieldMultiSelect from 'elements/Fields/FieldMultiSelect';
import { uniqueArray } from 'shared/sys.helper';
import MultiSelectOption from 'elements/MultiSelectOption';
import { AdvancedFiltersCustomFields, getCustomDropDownOrderBy } from 'components/button/ButtonType/CustomFields/AdvancedFiltersCustomFields';
import { Dropdown, DropdownField } from 'elements/Dropdown/Dropdown';
import { alertService } from 'services/Alert';
import { FollowTags,  FollowTag } from 'state/Profile'
import Popup from 'components/popup/Popup';
import { Network } from 'shared/entities/network.entity';
import { AllSuggestedTags, TagList, updateQueryWhenTagAdded, useTagsList } from 'elements/Fields/FieldTags';
import _ from 'lodash';
import { FilterByLocationRadius } from './filter-by-location';
import { FilterByDays } from './filter-by-days';
import Accordion from 'elements/Accordion';
import { IoBook, IoList } from 'react-icons/io5';



export default function AdvancedFilters({
  isHome = false,
  target = '/Explore',
  showFilterByDays = false
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
      router.push(target);
    }
  };

  const address = watch('where.address');
  const center = watch('where.center');
  const radius = watch('where.radius');
  const helpButtonTypes = watch('helpButtonTypes');
  const tags = watch('tags')
  const days = watch('days')
  const query = watch('query');

  const handleSelectedPlace = (address, center) => {
    setValue('where.address', address);
    setValue('where.center', center);
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
 
                  {/* <Accordion icon={<IoList/>} title={t('buttonFilters.byCategory')}> */}
                    <FieldMultiSelect
                      label={t('buttonFilters.types')}
                      validationError={null}
                      explain={t('buttonFilters.typesExplain')}
                    > 
                      {(helpButtonTypes && buttonTypes) && buttonTypes.map((buttonType, idx) => {
                        return (

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
                              key={idx}
                            >
                              {/* <div className="btn-filter__icon"></div> */}
                              <div className="btn-with-icon__text">
                                {buttonType.caption}
                              </div>
                            </MultiSelectOption>

                        //   <div
                        //     key={buttonType.name}
                        //     style={buttonColorStyle(buttonType.cssColor)}
                        //   >
                        //     {/* <div className="btn-filter__icon"></div> */}
                        //     <div className="btn-with-icon__text">
                        //       {buttonType.caption}
                        //     </div>
                        // </div>
                      );
                    })}
                    </FieldMultiSelect>
                    {/* </Accordion> */}

                    {showFilterByDays && 
                      <FilterByDays days={days} setDays={(value) => setValue('days', value)}/>
                    }
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
                    <div className="form__btn-search">
                      <FilterByLocationRadius handleSelectedPlace={handleSelectedPlace} address={address} center={center} radius={radius} setRadius={(value) => setValue('where.radius', value)}/>
                    </div>
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
  const sessionUser = useStore(
    store,
    (state: GlobalState) => state.sessionUser,
    false,
  );
  const followTag = (tag) => {
    if (!sessionUser) {
      router.push(`/Signup?follow=${tag}`)
      return;
    }
    store.emit(new FollowTag(tag, () => {alertService.success(t('buttonFilters.followTagSucess', [tag]))}));
  }

  const followTags = (tags) => {
    if (!sessionUser) {
      router.push(`/Signup?follow=${tags}`)
      return;
    }
    store.emit(new FollowTags(tags, () => {alertService.success(t('buttonFilters.followTagsSucess', [tags]))}));
  }

  const [tagsToFollow, setTagsToFollow] = useState(tags)
  useEffect(() => {
    if(sessionUser)
    {
      setTagsToFollow(() => 
        _.difference(tags, sessionUser.tags)
      )
    }
  }, [sessionUser, tags])
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