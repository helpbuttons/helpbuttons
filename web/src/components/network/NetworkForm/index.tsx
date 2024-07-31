// here we have the basic configuration of an network
import Btn, {
  BtnType,
  ContentAlignment,
} from 'elements/Btn';

import FieldAreaMap from 'elements/Fields/FieldAreaMap';
import { FieldImageUpload } from 'elements/Fields/FieldImageUpload';
import FieldTags from 'elements/Fields/FieldTags';
import FieldText from 'elements/Fields/FieldText';
import { FieldTextArea } from 'elements/Fields/FieldTextArea';
import Form from 'elements/Form';

import t from 'i18n';
import { useRouter } from 'next/router';
import { findError, getUrlOrigin } from 'shared/sys.helper';
// name, description, logo, background image, button template, color pallete, colors

import { FieldColorPick } from 'elements/Fields/FieldColorPick';
import { useEffect, useState } from 'react';
import Accordion from 'elements/Accordion';
import { FieldCheckbox } from 'elements/Fields/FieldCheckbox';
import { FieldLanguagePick } from 'elements/Fields/FieldLanguagePick';
import FieldButtonTemplates from 'components/button/ButtonType/FieldButtonTemplates';
import { DropdownField } from 'elements/Dropdown/Dropdown';
import { alertService } from 'services/Alert';

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
}) {
  const router = useRouter();

  const buttonTemplates = watch('buttonTemplates');

  const [showCurrencyDropDown, setShowCurrencyDropDown] = useState(false)
  useEffect(() => {
    if(buttonTemplates)
    {
      const needsCurrency = buttonTemplates.find((btnTemplate) =>{
        if(!btnTemplate.customFields){
          return false;
        }
        return btnTemplate.customFields.find((customField) => customField.type == 'price')
        })
      if(needsCurrency)
      {
        setShowCurrencyDropDown(() => true)
      }else{
        setShowCurrencyDropDown(() => false)
      }
  }
  }, [buttonTemplates])

  const accordionChapters = [
    { name: 'defineNetwork', fields: ['name', 'description'] },
    { name: 'appearance', fields: ['logo', 'jumbo'] },
    { name: 'configuration', fields: ['exploreSettings'] },
  ];
  const hasErrors = (chapterName) => {
    const chapter = accordionChapters.find(
      (chapter) => chapter.name == chapterName,
    );
    if (!chapter) {
      return false;
    }
    return findError(chapter.fields, errors);
  };
  return (
    <>
      <Form
        classNameExtra="configuration"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="form__inputs-wrapper">
          <div className="form__field">
            <p className="form__explain">{description}</p>
            <p>
              <b>{getUrlOrigin()}</b>
            </p>
          </div>


          <Accordion collapsed={hasErrors('defineNetwork')} title={t('configuration.defineNetwork')}>
            <FieldText
              name="name"
              label={t('configuration.nameLabel')}
              placeholder={t('configuration.namePlaceHolder')}
              classNameInput="squared"
              validationError={errors.name}
              {...register('name', { required: true })}
            />
            <FieldTextArea
              name="description"
              label={t('configuration.descriptionLabel')}
              placeholder={t('configuration.descriptionPlaceHolder')}
              classNameInput="squared"
              validationError={errors.description}
              watch={watch}
              setValue={setValue}
              setFocus={setFocus}
              {...register('description', { required: true })}
            />
            <FieldCheckbox
                    name='inviteOnly'
                    label={t('invite.inviteOnlyLabel')}
                    explain={t('invite.inviteOnlyExplain')}
                    defaultValue={watch('inviteOnly')}
                    text={t('invite.inviteOnly')}
                    onChanged={(value) => setValue('inviteOnly', value)}
            />

            <FieldCheckbox
                    name='requireApproval'
                    label={t('moderation.requireApprovalLabel')}
                    explain={t('moderation.requireApprovalExplain')}
                    defaultValue={watch('requireApproval')}
                    text={t('moderation.requireApproval')}
                    onChanged={(value) => setValue('requireApproval', value)}
            />
            <FieldLanguagePick onChange={(value) => setValue('locale',value)} defaultValue={watch('locale')}/>

            {/* https://github.com/helpbuttons/helpbuttons/issues/290 */}
            {/* <FieldPrivacy
              name="privacy"
              setValue={setValue}
              textPrivate={t('configuration.privacySetPrivate')}
              textPublic={t('configuration.privacySetPublic')}
              {...register('privacy', { required: true })}
            /> */}

           </Accordion>
         
           <Accordion collapsed={hasErrors('appearance')} title={t('configuration.customizeAppearance')}>

             <FieldText
                name="nomeclature"
                label={t('configuration.nomeclatureLabel')}
                explain={t('configuration.nomeclatureExplain')}
                placeholder={t('configuration.nomeclaturePlaceHolder')}
                classNameInput="squared"
                validationError={errors.nomeclature}
                {...register('nomeclature', { required: true })}
              />
              <FieldText
                name="nomeclaturePlural"
                placeholder={t('configuration.nomeclaturePluralPlaceHolder')}
                classNameInput="squared"
                validationError={errors.nomeclaturePlural}
                {...register('nomeclaturePlural', { required: true })}
              />
            <div className="form__field">
                <label className="form__label">{t('configuration.chooseColors')}</label>
                <p className="form__explain">{t('configuration.chooseColorsExplain')}</p>

              <FieldColorPick
                name="backgroundColor"
                classNameInput="squared"
                validationError={errors.backgroundColor}
                setValue={setValue}
                actionName={t('configuration.pickMainColor')}
                value={watch('backgroundColor')}
                {...register('backgroundColor', { required: true })}
                hideBoilerPlate={true}
              />

              <FieldColorPick
                name="texColor"
                classNameInput="squared"
                validationError={errors.texColor}
                setValue={setValue}
                actionName={t('configuration.pickSecondaryColor')}
                value={watch('textColor')}
                {...register('textColor', { required: true })}
                hideBoilerPlate={true}
              />
            </div>

            <div className="form__field">
              <div className="form__section-title">
                {t('configuration.images')}
              </div>
            </div>

            <FieldImageUpload
              name="logo"
              label={t('configuration.logo')}
              text={t('configuration.logo')}
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
              text={t('configuration.jumbo')}
              subtitle="1500x1500px"
              setValue={setValue}
              width={750}
              height={250}
              validationError={errors.jumbo}
              control={control}
              {...register('jumbo', { required: true })}
            />

          </Accordion>

          <Accordion collapsed={hasErrors('configuration')} title={t('configuration.configureNetwork')}>

            {/* BUTTON TYPES */}
          
            <FieldButtonTemplates
              label={t('configuration.buttonTemplateLabel')}
              explain={t('configuration.buttonTemplateFormTitle')}
              name="buttonTemplates"
              placeholder={t('configuration.buttonTemplatePlaceHolder')}
              classNameInput="squared"
              errors={errors}
              watch={watch}
              register={register}
              control={control}
            />
    
            {showCurrencyDropDown && 
                <FieldText
                  name="nomeclaturePlural"
                  label={t('configuration.currencyLabel')}
                  classNameInput="squared"
                  validationError={errors.currency}
                  {...register('currency')}
                />
            }
            <FieldAreaMap
              label={t('configuration.locationLabel')}
              explain={t('configuration.locationExplain')}
              marker={{
                caption: watch('name'),
                image: watch('logo'),
              }}
              validationError={errors.exploreSettings}
              onChange={(exploreSettings) => {
                setValue('exploreSettings', exploreSettings);
              }}
              value={watch('exploreSettings')}
              markerColor={watch('backgroundColor')}
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
              maxTags={30}
            />

          </Accordion>

{/*
          <div className="form__section-title">
            {t('configuration.moderateNetwork')}
          </div>

            */}
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
