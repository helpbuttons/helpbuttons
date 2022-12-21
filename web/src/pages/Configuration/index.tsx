// here we have the basic configuration of an network
import NetworkLogo from 'components/network/Components';
import Popup from 'components/popup/Popup';
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import FieldUploadImages from 'elements/Fields/FieldImagesUpload';
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
import { SetupSteps } from 'shared/setupSteps';
import { CreateNetwork } from 'state/Networks';

// name, description, logo, background image, button template, color pallete, colors
export default Configuration;

function Configuration() {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    control,
    setValue,
    watch,
    } = useForm({
    defaultValues: {
      name: "My permaculture network",
      description: "In this network we will use a map to share tools in-between our network"
    }
  });

  const router = useRouter();

  const onSubmit = (data) => {
    store.emit(new CreateNetwork({
      name: data.name,
      description: data.description,
      radius: 10,
      latitude: '-8.0321',
      longitude: '3.32131',
      tags: data.tags,
      privacy: "public",
      logo: data.logo[0].data_url,
      jumbo: data.jumbo[0]?.data_url,
    },
      () => {
        alertService.info('done!, your network should be on the db')
        router.replace('/HomeInfo');
    }, 
    (err) => {

      alertService.warn(`You already created an admin account, do you want to <a href="/Login">login</a>? Or you want to <a href="${SetupSteps.FIRST_OPEN}">configure your network</a>?`)
      // console.log(JSON.stringify(err))
      console.log(err)
      console.log(data)
    }));
  };

  alertService.clearAll();
  return (
    <>
      <Popup title="Create your network">
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

            400x400px
            <FieldUploadImage
              name="logo"
              label="Choose logo"
              control={control}
              width={50}
              height={50}
            />

            1500x500px
            <FieldUploadImage
              name="jumbo"
              label="Choose background image"
              control={control}
              width={375}
              height={125}
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
              label="Network Tags"
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
