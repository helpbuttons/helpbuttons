// here we have the basic configuration of an network
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import {FieldImageUpload} from 'elements/Fields/FieldImageUpload';
import FieldLocation from 'elements/Fields/FieldLocation';
import { FieldPrivacy } from 'elements/Fields/FieldPrivacy';
import FieldTags from 'elements/Fields/FieldTags';
import FieldText from 'elements/Fields/FieldText';
import { FieldTextArea } from 'elements/Fields/FieldTextArea';
import Form from 'elements/Form';
import { useRouter } from 'next/router';
import { getUrlOrigin } from 'shared/sys.helper';
// name, description, logo, background image, button template, color pallete, colors
export default NetworkForm;

const defaultMarker = { latitude: 41.687, longitude: -7.7406 };
function NetworkForm({
  captionAction = 'NEXT',
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

  const watchLogo = watch('logo')
  const watchTitle = watch('title')

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
                placeholder="Network of permaculture farmers from Vilanova"
                classNameInput="squared"
                validationError={errors.name}
                {...register('name', { required: true })}
              />
              <FieldTextArea
                name="description"
                label="Description"
                placeholder="Welcome to the network of sharing ..."
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
                textPrivate="Click here to set it up as a private network"
                textPublic="Click here to set it back to a public network"
                {...register('privacy', { required: true })}
              />
              400x400px
              
              <FieldImageUpload
                name="logo"
                label="Choose logo"                
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
                label="Choose background image"
                setValue={setValue}
                width={750}
                height={250}
                validationError={errors.jumbo}
                control={control}
                {...register('jumbo', { required: true })}
              />
              <FieldLocation
              validationErrors={undefined}
              setValue={setValue}
              watch={watch}
              markerImage={watchLogo}
              markerCaption={watchTitle}
              markerColor='yellow'
              selectedNetwork={selectedNetwork}
              />
             
              <FieldTags
                label="Network Tags"
                placeholder="Food, tools, toys..."
                name="tags"
                control={control}
                validationError={errors.tags}
                watch={watch}
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
