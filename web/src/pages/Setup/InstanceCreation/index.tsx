// here we have the basic configuration of an instance
import Popup from 'components/popup/Popup';
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import FieldUploadImage from 'elements/Fields/FieldImageUpload';
import FieldLocation from 'elements/Fields/FieldLocation';
import FieldTags from 'elements/Fields/FieldTags';
import FieldText from 'elements/Fields/FieldText';
import { FieldTextArea } from 'elements/Fields/FieldTextArea';
import Form from 'elements/Form';
import { useRouter } from 'next/router';
import { store } from 'pages';
import { useForm } from 'react-hook-form';
import { alertService } from 'services/Alert';
import {
  localStorageService,
  LocalStorageVars,
} from 'services/LocalStorage';
import { CreateNetwork } from 'state/Networks';
import { setupNextStep, SetupSteps } from '../steps';

// name, description, logo, background image, button template, color pallete, colors
export default InstanceCreation;

function InstanceCreation() {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    control,
    setValue,
    watch
  } = useForm({
    defaultValues: {
      name: "My permaculture network",
      description: "In this network we will use a map to share tools in-between our network"
    }
  });

  const router = useRouter();

  const onSubmit = (data) => {
    alertService.warn('implementing...')
    // console.log(data);
    store.emit(new CreateNetwork({
      name: data.name,
      description: data.description,
      radius: 10,
      latitude: '-8.0321',
      longitude: '3.32131',
      tags: data.tags,
    },
      () => {
        alertService.info('done!, your network should be on the db')
        localStorageService.remove(LocalStorageVars.SETUP_STEP);
        router.replace('/HomeInfo');
    }, 
    (err) => {
      alertService.warn(`You already created an admin account, do you want to <a href="/Login">login</a>? Or you want to <a href="${SetupSteps.FIRST_OPEN}">configure your instance</a>?`)
      // console.log(JSON.stringify(err))
      console.log(err)
      console.log(data)
    }));
  };

  return (
    <>
      <Popup title="Create your instance">
        <Form classNameExtra="createAdmin">
          <p>Wizard to help on configuring your network</p>
          <p>
            <b>{window.location.origin}</b>
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
              {...register('description', { required: true })}
            />
            <FieldUploadImage
              name="logo"
              label="Choose logo"
              control={control}
            />
            <FieldUploadImage
              name="jumbo"
              label="Choose background image"
              control={control}
            />
            <FieldLocation
                defaultZoom={1}
                validationErrors={undefined}
                initMapCenter={{
                  lat: 0,
                  lng: 0,
                }}
                setValue={setValue}
                watch={watch}
              />
            <FieldTags
              label="Instance Tags"
              placeholder="Food, tools, toys..."
              name="tags"
              control={control}
              validationError={errors.tags}
              watch={watch}
            />
            <Btn
              btnType={BtnType.splitIcon}
              caption="NEXT"
              contentAlignment={ContentAlignment.center}
              isSubmitting={isSubmitting}
              onClick={handleSubmit(onSubmit)}
            />
          </div>
          </div>
        </Form>
      </Popup>
    </>
  );
}
