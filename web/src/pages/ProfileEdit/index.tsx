//Form component with the main fields for signup in the platform
//imported from libraries
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

//imported internal classes, variables, files or functions
import { GlobalState, store } from 'pages';
import { FetchUserData, UpdateProfile } from 'state/Users';

//imported react components
import { Link } from 'elements/Link';
import Popup from 'components/popup/Popup';
import Btn, {
  ContentAlignment,
  BtnType,
} from 'elements/Btn';
import Form from 'elements/Form';

import { useRouter } from 'next/router';

import FieldText from 'elements/Fields/FieldText';
import { alertService } from 'services/Alert';
import { User } from 'shared/entities/user.entity';
import { useRef } from 'store/Store';
import { FieldImageUpload } from 'elements/Fields/FieldImageUpload';
import FieldPassword from 'elements/Fields/FieldPassword';
import { getHostname } from 'shared/sys.helper';
import { UserUpdateDto } from 'shared/dtos/user.dto';
import { FieldTextArea } from 'elements/Fields/FieldTextArea';
import t from 'i18n';
import { FieldLanguagePick } from 'elements/Fields/FieldLanguagePick';
import { FieldCheckbox } from 'elements/Fields/FieldCheckbox';
import Accordion from 'elements/Accordion';
import DropDownSearchLocation from 'elements/DropDownSearchLocation';
import FieldTags from 'elements/Fields/FieldTags';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Role } from 'shared/types/roles';

export default function ProfileEdit() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    reset,
    watch,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm({defaultValues: {
    locale: 'en',
    receiveNotifications: true,
    showButtons: false,
    tags: [],
    address: '',
    center: {coordinates: null},
    radius: 0,
    publishPhone: false,
  }});
  const [errorMsg, setErrorMsg] = useState(undefined);
  const [setNewPassword, setSetNewPassword] = useState(false);


  const router = useRouter();
  const { pathname, asPath, query } = useRouter()
  const loggedInUser: User = useRef(
    store,
    (state: GlobalState) => state.loggedInUser,
  );
  const [locale, setLocale] = useState(null)

  const onSubmit = (data: UserUpdateDto) => {
    let dataToSubmit : UserUpdateDto =
    {
      name: data.name,
      email: data.email,
      avatar: data.avatar,
      password_new: data.password_new,
      password_new_confirm: data.password_new_confirm,
      set_new_password: setNewPassword,
      description: data.description,
      locale: locale,
      receiveNotifications: data.receiveNotifications,
      showButtons: data.showButtons,
      tags: data.tags,
      center: data.center,
      address: data.address,
      radius: data.radius,
      phone: data.phone,
      publishPhone: data.publishPhone
    }
    if (setNewPassword)  {
      // check passwords match.. send to backend
      if (dataToSubmit.password_new != dataToSubmit.password_new_confirm)
      {
        setError('password_new',  { type: 'custom', message: t('user.passwordMismatch')})
        setError('password_new_confirm',  { type: 'custom', message: t('user.passwordMismatch')})
      }else{
        dataToSubmit = {...dataToSubmit, set_new_password: true}
      } 
    }
    
    store.emit(new UpdateProfile(dataToSubmit, onSuccess, onError));
  };

  const onSuccess = () => {
    
    store.emit(new FetchUserData((userData) => {
      if(userData.locale != 'en')
      {
        router.push(`/${userData.locale}/Profile`)
      }else{
        router.push({ pathname: '/Profile' }, asPath, { locale: 'en' });
      }
    }, onError));
    ;
  };

  const onError = (errorMessage) => {
    alertService.error(errorMessage.caption);
  };

  useEffect(() => {
    if (loggedInUser) {
      setLocale(loggedInUser.locale)
      reset(loggedInUser);
    }
  }, [loggedInUser]);

  const radius = watch('radius')
  const coordinates = watch('center.coordinates')
  const center = coordinates ? [coordinates[1],coordinates[0]] : null;
  return (
    <>
      {loggedInUser && (
        <>
          <Popup title={t('user.updateProfile')} linkBack={() => router.back()}>
            <Form
              onSubmit={handleSubmit(onSubmit)}
              classNameExtra="login"
            >
              <div className='form__label'> {loggedInUser.username}@{getHostname()} </div>
              
                <div className="form__inputs-wrapper">
                <Accordion title={t('user.personalData')}>

                  <FieldText
                    name="name"
                    label={t('user.name')}
                    explain={t('user.nameExplain')}
                    classNameInput="squared"
                    placeholder={t('user.namePlaceHolder')}
                    validationError={errors.name}
                    {...register('name', { required: true })}
                  ></FieldText>
                  <FieldImageUpload
                    name="avatar"
                    text={t('user.avatar')}
                    label={t('user.avatarLabel')}
                    explain={t('user.avatarExplain')}
                    control={control}
                    width={150}
                    height={150}
                    subtitle={'150x150px'}
                    validationError={errors.avatar}
                    setValue={setValue}
                    {...register('avatar')}
                  />
                   <FieldTextArea
                    name="description"
                    label={t('user.description')}
                    explain={t('user.descriptExplain')}
                    classNameInput="squared"
                    watch={watch}
                    setValue={setValue}
                    setFocus={setFocus}
                    validationError={errors.description}
                    {...register('description', { required: true })}
                  />
                                  
                  <FieldLanguagePick onChange={(value) => setLocale(value)} explain={t('user.pickLanguageExplain')} defaultValue={loggedInUser.locale}/>

                  <FieldText
                    name="email"
                    label={t('user.email')}
                    explain={t('user.emailExplain')}
                    classNameInput="squared"
                    placeholder={t('user.emailPlaceHolder')}
                    validationError={errors.email}
                    {...register('email', { required: true })}
                  ></FieldText>  

                  <FieldText
                    name="phone"
                    label={t('user.phone')}
                    explain={t('user.phoneExplain')}
                    classNameInput="squared"
                    placeholder={t('user.phonePlaceHolder')}
                    validationError={errors.phone}
                    {...register('phone')}
                  ></FieldText>  

                  {loggedInUser.role == Role.admin && 
                    <>
                      <FieldCheckbox
                        name='publishPhone'
                        defaultValue={loggedInUser.publishPhone}
                        text={t('user.adminPhonePublish')}
                        explain={t('user.adminPhonePublishExplain')}
                        onChanged={(value) => {setValue('publishPhone', value)}}
                      />
                      {/* <FieldCheckbox
                        name='showWhatsapp'
                        defaultValue={loggedInUser.showWhatsapp}
                        text={t('user.showWhatsapp')}
                        onChanged={(value) => {setValue('showWhatsapp', value)}}
                      /> */}
                    </>
                  }
                  <FieldCheckbox
                    name='showButtons'
                    label={t('user.showButtonsProfileLabel')}
                    explain={t('user.showButtonsProfileExplain')}
                    defaultValue={loggedInUser.showButtons}
                    text={t('user.showButtons')}
                    onChanged={(value) => {setValue('showButtons', value)}}
                  />

                </Accordion>
                <Accordion title={t('user.notificationConfig')}>

                  <FieldCheckbox
                    label={t('user.receiveNotifications')}
                    explain={t('user.receiveNotificationsExplain')}                                 
                    name='receiveNotifications'
                    defaultValue={loggedInUser.receiveNotifications}
                    text={t('user.textReceiveNotifications')}
                    onChanged={(value) => {setValue('receiveNotifications', value)}}
                  />


                  <DropDownSearchLocation
                    label={t('user.location')}
                    handleSelectedPlace={(newPlace) => {setValue('center', {coordinates: [newPlace.geometry.lat, newPlace.geometry.lng]}); setValue('address', newPlace.formatted)}}
                    placeholder={t('user.location')}
                    address={watch('address')}
                    explain={t('user.locationExplain')}
                    center={center}
                  />
                <div className="form__field">
                    <label className="form__label">
                      {t('user.distance')} ({radius} km)
                    </label>
                    <div className='form__explain'>{t('user.distanceExplain')} </div>
                    <div style={{ padding: '1rem' }}>
                      <Slider
                        min={0}
                        max={300}
                        onChange={(radiusValue) =>
                          setValue('radius', radiusValue)
                        }
                        value={radius}
                      />
                    </div>
                  </div>
                <FieldTags
                  label={t('user.tags')}
                  explain={t('user.tagsExplain')}
                  placeholder={t('common.add')}
                  validationError={errors.tags}
                  setTags={(tags) => {
                    setValue('tags', tags);
                  }}
                  tags={watch('tags')}
                />
                
                </Accordion>


                {errorMsg && (
                  <div className="form__input-subtitle--error">
                    {errorMsg}
                  </div>
                )}
                 
                <Accordion 
                  title={!setNewPassword ?  t('user.setNewPassword') : t('user.dontChangePassword') }
                  handleClick={() => setSetNewPassword(() => !setNewPassword)}
                >

                        <FieldPassword
                          name="password_new"
                          label={t('user.newPassword')}
                          classNameInput="squared"
                          placeholder={t('user.newPasswordPlaceHolder')}
                          validationError={errors.password_new}
                          {...register('password_new', {
                            minLength: 8,
                          })}
                        ></FieldPassword>
                        <FieldPassword
                          name="password_new_confirm"
                          label={t('user.passwordConfirmation')}
                          classNameInput="squared"
                          placeholder={t('user.passwordConfirmationPlaceHolder')}
                          validationError={errors.password_new_confirm}
                          {...register('password_new_confirm', {
                            minLength: 8,
                          })}
                        ></FieldPassword>

                  </Accordion>

                      <div className="publish__submit">
                        <Btn
                          btnType={BtnType.submit}
                          contentAlignment={ContentAlignment.center}
                          caption={t('common.publish')}
                          isSubmitting={isSubmitting}
                          submit={true}
                        />
                      </div>
                    </div>
            </Form>
          </Popup>
        </>
      )}
    </>
  );
}
