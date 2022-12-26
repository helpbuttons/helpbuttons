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
import { CreateNetwork, FetchDefaultNetwork } from 'state/Networks';

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
    setError
    } = useForm({
    defaultValues: {
      name: "My permaculture network",
      description: "In this network we will use a map to share tools in-between our network",
      logo: "",
      jumbo: "",
      tags: []
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
      logo: data.logo[0]?.data_url,
      jumbo: data.jumbo[0]?.data_url,
    },
      () => {
        const onComplete = () => {
          alertService.info('done!, your network should be on the db')
          router.replace('/HomeInfo');
        }
        store.emit(new FetchDefaultNetwork(onComplete, onComplete));
        
    }, 
    (err) => {

      if(err?.message.indexOf('validation-error') === 0)
      {
        const mimetypeError = 'invalid-mimetype-';
        if(err?.validationErrors?.jumbo && err.validationErrors.jumbo.indexOf(mimetypeError) === 0 ){
            const mimetype = err.validationErrors.jumbo.substr(mimetypeError.length);
            const mimetypeErrorMessage = `invalid image mimetype: "${mimetype}"`;
            setError('jumbo',{ type: 'custom', message: mimetypeErrorMessage
          })
        }else if(err?.validationErrors?.logo && err.validationErrors.logo.indexOf(mimetypeError) === 0 ){
          const mimetype = err.validationErrors.logo.substr(mimetypeError.length);
          const mimetypeErrorMessage = `invalid image mimetype: "${mimetype}"`;
            setError('logo',{ type: 'custom', message: mimetypeErrorMessage
          })
        }else {
          alertService.warn(`Validation errors ${JSON.stringify(err)}`)
        }
      }else{
        alertService.warn(`You already created an admin account, do you want to <a href="/Login">login</a>? Or you want to <a href="${SetupSteps.FIRST_OPEN}">configure your network</a>?`)
        console.log(err)
      }

    }));
  };

  // alertService.clearAll();
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
              validationError={errors.logo}
              {...register('logo', { required: true })}
            />

            1500x500px
            <FieldUploadImage
              name="jumbo"
              label="Choose background image"
              control={control}
              width={375}
              height={125}
              validationError={errors.jumbo}
              {...register('jumbo', { required: true })}
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
