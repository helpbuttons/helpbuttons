// here we have the basic configuration of an network
import Btn, { BtnType, ContentAlignment, IconType } from 'elements/Btn';
import Popup from 'components/popup/Popup';

import FieldAreaMap from 'elements/Fields/FieldAreaMap';
import { FieldImageUpload } from 'elements/Fields/FieldImageUpload';
import FieldLocation from 'elements/Fields/FieldLocation';
import { FieldPrivacy } from 'elements/Fields/FieldPrivacy';
import FieldTags from 'elements/Fields/FieldTags';
import FieldText from 'elements/Fields/FieldText';
import { FieldTextArea } from 'elements/Fields/FieldTextArea';
import Form from 'elements/Form';

import t from 'i18n';
import { useRouter } from 'next/router';
import { getUrlOrigin } from 'shared/sys.helper';
import ButtonTypesSelector from 'components/feed/ButtonTypesCreator';
import FieldCheckbox from 'elements/Fields/FieldCheckbox';
import CheckBox from 'elements/Checkbox';
// name, description, logo, background image, button template, color pallete, colors
export default NetworkForm;

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
  defaultExploreSettings = null,
}) {
  const router = useRouter();

  return (
    <>
        <Form
          classNameExtra="createAdmin"
          onSubmit={handleSubmit(onSubmit)}
        >
            <div className="form__inputs-wrapper">

              <div className="form__field">
                <p className="form__explain">{description}</p>
                <p>
                  <b>{getUrlOrigin()}</b>
                </p>
              </div>

              <FieldText
                name="name"
                label="Network name:"
                placeholder={t('configuration.namePlaceHolder')}
                classNameInput="squared"
                validationError={errors.name}
                {...register('name', { required: true })}
              />

              <FieldTextArea
                name="description"
                label="Network description:"
                placeholder={t('configuration.descriptionPlaceHolder')}
                classNameInput="squared"
                validationError={errors.description}
                watch={watch}
                setValue={setValue}
                setFocus={setFocus}
                {...register('description', { required: true })}
              />
              <FieldPrivacy
                name="privacy"
                setValue={setValue}
                textPrivate={t('configuration.privacySetPrivate')}
                textPublic={t('configuration.privacySetPublic')}
                {...register('privacy', { required: true })}
              />
              <hr></hr>

              <div className="form__section-title">{t('configuration.customizeNetwork')}</div>

              <div className="form__field">
                <label className="form__label">{t('configuration.chooseColors')}</label>
                <p className="form__explain">{t('configuration.chooseColorsExplain')}</p>
                <Btn caption={'Choose main color'} btnType={BtnType.splitIcon} iconLeft={IconType.green}/>

                <Btn caption={'Choose second color'} btnType={BtnType.splitIcon} iconLeft={IconType.green}/>
              </div>


              <FieldText
                name="alias"
                label={t('configuration.aliasLabel')}
                explain={t('configuration.aliasExplain')}
                placeholder={t('configuration.namePlaceHolder')}
                classNameInput="squared"
                validationError={errors.name}
                {...register('name', { required: true })}
              />

              {/* BUTTON TYPES */}

              <ButtonTypesSelector postId={undefined} onSubmit={undefined} label={t('configuration.createButtonType')} explain={t('configuration.explainCreateButtonType')} />

            
              <div className='form__field'>
                <div className='form__label'>{t('configuration.images')}</div>
              </div>

                <FieldImageUpload
                  name="logo"
                  label={t('configuration.logo')}
                  width={200}
                  height={200}
                  subtitle="400x400px"
                  setValue={setValue}
                  validationError={errors.logo}
                  control={control}
                  {...register('logo', { required: true })}
                />
                <FieldImageUpload
                  name="jumbo"
                  label={t('configuration.jumbo')}
                  subtitle="1500x1500px"
                  setValue={setValue}
                  width={750}
                  height={250}
                  validationError={errors.jumbo}
                  control={control}
                  {...register('jumbo', { required: true })}
                />
              <FieldAreaMap
                defaultExploreSettings={defaultExploreSettings}
                label={t('configuration.locationLabel')}
                explain={t('configuration.locationExplain')}
                marker={{
                  caption: watch('name'),
                  image: watch('logo')}
                }
                validationError={errors.location}
                onChange={(exploreSettings) => {
                  setValue('exploreSettings', exploreSettings);
                }}
              />
              <FieldTags
                label={t('configuration.tags')}
                explain={t('configuration.tagsExplain')}
                placeholder={t('common.add')}
                validationError={errors.tags}
                setTags={(tags) => {
                  setValue('tags', tags);
                }}
                tags={watch('tags')}
              />

              <hr></hr>

              <div className="form__section-title">{t('configuration.moderateNetwork')}</div>


                {/* Blocked users */}
              <FieldTags
                label={t('configuration.blocked')}
                explain={t('configuration.blockedExplain')}
                placeholder={t('common.add')}
                validationError={errors.tags}
                setTags={(tags) => {
                  setValue('tags', tags);
                }}
                tags={watch('tags')}
              />

                {/* Admin Users */}
              <FieldTags
                label={t('configuration.adminUsers')}
                explain={t('configuration.adminUsersExplain')}
                placeholder={t('common.add')}
                validationError={errors.tags}
                setTags={(tags) => {
                  setValue('tags', tags);
                }}
                tags={watch('tags')}
              />      

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
    </>
  );
}
