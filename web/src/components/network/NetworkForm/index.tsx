// here we have the basic configuration of an network
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import {FieldImageUpload} from 'elements/Fields/FieldImageUpload';
import FieldLocation from 'elements/Fields/FieldLocation';
import { FieldPrivacy } from 'elements/Fields/FieldPrivacy';
import FieldTags from 'elements/Fields/FieldTags';
import FieldText from 'elements/Fields/FieldText';
import { FieldTextArea } from 'elements/Fields/FieldTextArea';
import Form from 'elements/Form';
import t from 'i18n';
import { useRouter } from 'next/router';
import { getUrlOrigin } from 'shared/sys.helper';
// name, description, logo, background image, button template, color pallete, colors
export default NetworkForm;

const defaultMarker = { latitude: 41.687, longitude: -7.7406 };
function NetworkForm({
  captionAction = t('common.save'),
  handleSubmit,
  onSubmit,
  register,
  setValue,
  watch,
  isSubmitting,
  control,
  errors,
  linkFwd,
  setFocus,
  description,
  showClose = true,
  selectedNetwork = null
}) {
  const router = useRouter();


  return (
    <>
        <Form
          classNameExtra="createAdmin"
          onSubmit={handleSubmit(onSubmit)}
        >
          <p>{description}</p>
          <p>
            <b>{getUrlOrigin()}</b>
          </p>
          <div className="login__form">
            <div className="form__inputs-wrapper">
              <FieldText
                name="name"
                label="Name"
                placeholder={t('configuration.namePlaceHolder')}
                classNameInput="squared"
                validationError={errors.name}
                {...register('name', { required: true })}
              />
              <FieldTextArea
                name="description"
                label="Description"
                placeholder={t('configuration.descriptionPlaceHolder')}
                classNameInput="squared"
                validationError={errors.description}
                watch={watch}
                setValue={setValue}
                setFocus={setFocus}
                {...register('description', { required: true })}
              />
              <FieldPrivacy
                name='privacy'
                setValue={setValue}
                textPrivate={t('configuration.privacySetPrivate')}
                textPublic={t('configuration.privacySetPublic')}
                {...register('privacy', { required: true })}
              />
              400x400px
              
              <FieldImageUpload
                name="logo"
                label={t('configuration.logo')}
                width={200}
                height={200}
                setValue={setValue}
                validationError={errors.logo}
                control={control}
                {...register('logo', { required: true })}
              />
              1500x500px
              <FieldImageUpload
                name="jumbo"
                label={t('configuration.jumbo')}
                setValue={setValue}
                width={750}
                height={250}
                validationError={errors.jumbo}
                control={control}
                {...register('jumbo', { required: true })}
              />
              <FieldLocation
                  setMarkerPosition={([lat,lng]) => {
                      setValue('latitude',lat)
                      setValue('longitude',lng)
                  }}
                  setMarkerAddress={(address) => {
                    setValue('address', address)
                  }}
                  setZoom={(zoom) => {
                    setValue('zoom', zoom)
                  }}
                  markerZoom={watch('zoom')}
                  markerAddress={watch('address')}
                  markerImage={watch('logo') ? watch('logo') : getUrlOrigin() + '/apple-touch-icon.png'}
                  markerCaption={watch('title')}
                  markerColor={'yellow'}
                  markerPosition={[watch('latitude'),watch('longitude')]}
                  selectedNetwork={selectedNetwork}
                  validationError={errors.location}
                />
             
              <FieldTags
                label={t('common.tags')}
                placeholder={t('common.add')}
                validationError={errors.tags}
                setTags={(tags) => {
                  setValue('tags', tags)
                }}
                tags={watch('tags')}
              />
              <Btn
                btnType={BtnType.splitIcon}
                caption={captionAction}
                contentAlignment={ContentAlignment.center}
                isSubmitting={isSubmitting}
              /> 
            </div>
          </div>
        </Form>
    </>
  );
}
