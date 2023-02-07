// here we have the basic configuration of an network
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
import { SetupSteps } from 'shared/setupSteps';
import { getUrlOrigin } from 'shared/sys.helper';
import { CreateNetwork, FetchDefaultNetwork } from 'state/Networks';
// name, description, logo, background image, button template, color pallete, colors
export default Configuration;

const defaultMarker = {latitude: 41.6870, longitude: -7.7406};
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
      tags: [],
      latitude: defaultMarker.latitude,
      longitude: defaultMarker.longitude,
      zoom: 10,
    }
  });

  const router = useRouter();

  const onSubmit = (data) => {
    store.emit(new CreateNetwork({
      name: data.name,
      description: data.description,
      radius: 10,
      latitude: data.latitude,
      longitude: data.longitude,
      tags: data.tags,
      privacy: "public",
      logo: data.logo,
      jumbo: data.jumbo,
      zoom: data.zoom,
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
      <Popup title="Create your network" linkFwd="/Setup/NetworkCreation">
        <Form classNameExtra="createAdmin"
        onSubmit={handleSubmit(onSubmit)}
        >
          <p>Wizard to help on configuring your network</p>
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
              {...register('description', { required: true })}
            />

            400x400px
            <FieldUploadImage
              name="logo"
              label="Choose logo"
              setValue={setValue}
              width={50}
              height={50}
              validationError={errors.logo}
              {...register('logo', { required: true })}
            />

            1500x500px
            <FieldUploadImage
              name="jumbo"
              label="Choose background image"
              setValue={setValue}
              width={55}
              height={125}
              validationError={errors.jumbo}
              {...register('jumbo', { required: true })}
            />

            <FieldLocation
                defaultZoom={10}
                validationErrors={undefined}
                setValue={setValue}
                watch={watch}
                markerImage={watch('logo')}
                markerCaption={watch('name')}
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
            />
          </div>
          </div>
        </Form>
      </Popup>
    </>
  );
}
