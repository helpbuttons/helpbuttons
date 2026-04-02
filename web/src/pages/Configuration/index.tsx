import NetworkForm from 'components/network/NetworkForm';
import Popup from 'components/popup/Popup';
import t from 'i18n';
import router, { useRouter } from 'next/router';
import { GlobalState, store } from 'state';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { alertService } from 'services/Alert';
import { Role } from 'shared/types/roles';
import { UpdateExploreSettings } from 'state/Explore';
import {
  FetchDefaultNetwork,
  FetchNetworkConfiguration,
  UpdateNetwork,
  UpdateNetworkBackgroundColor,
  UpdateNetworkTextColor,
} from 'state/Networks';
import { useStore } from 'state';
import dconsole from 'shared/debugger';
import { useWarnIfUnsavedChanges } from 'shared/custom.hooks';

export default Configuration;

function Configuration() {
  
  const sessionUser = useStore(
    store,
    (state: GlobalState) => state.sessionUser,
    false,
  );

  const {
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    register,
    control,
    setValue,
    watch,
    setError,
    reset,
    setFocus,
  } = useForm({});

  const backgroundColor = watch('backgroundColor');
  useUpdateBackgroundColor(backgroundColor);
  const [on, setOn] = useState(false)
  const textColor = watch('textColor');
  useTextColor(textColor);
  const { pathname, asPath, query } = useRouter();
  const [submitting, setSubmitting] = useState(false) // isSubmitting won't work?

  const [selectedNetwork, setSelectedNetwork] = useState(null);
  useEffect(() => {
    if (selectedNetwork && !selectedNetwork?.init) {
      setOn(() => true)
      reset(selectedNetwork);
    }
  }, [selectedNetwork]);
  useEffect(() => {
    store.emit(
      new FetchNetworkConfiguration((network) => {
        setSelectedNetwork(() => network);
      }, () => {}),
      
    );
  }, []);

  const _setValue = (name, value) => {
    setValue(name, value, { shouldDirty: true });
  }
  useWarnIfUnsavedChanges(isDirty && !submitting, () => {
    return confirm(t('common.unsavedChanges'))
  })

  const onSubmit = (data) => {
    setSubmitting(() => true)
    store.emit(
      new UpdateNetwork(
        {
          name: data.name,
          description: data.description,
          tags: data.tags,
          privacy: data.privacy,
          logo: data.logo,
          jumbo: data.jumbo,
          exploreSettings: data.exploreSettings,
          backgroundColor: data.backgroundColor,
          textColor: data.textColor,
          buttonTemplates: data.buttonTemplates,
          inviteOnly: data.inviteOnly,
          locale: data.locale,
          currency: data.currency,
          nomeclature: data.nomeclature,
          nomeclaturePlural: data.nomeclaturePlural,
          requireApproval: data.requireApproval,
          slogan: data.slogan,
          hideLocationDefault: data.hideLocationDefault,
          allowGuestCreation: data.allowGuestCreation,
          privacyPolicy: data. privacyPolicy,
          ethicsPolicy: data. ethicsPolicy,
          contactEmail: data. contactEmail,
        },
        (network) => {
          store.emit(new UpdateExploreSettings(data.exploreSettings));
          alertService.info(
            t('common.saveSuccess', ['Configuration']),
          );
          if (data.locale != 'en') {
            router.push(`/${data.locale}/HomeInfo`);
          } else {
            router.push({ pathname: '/' }, asPath, {
              locale: 'en',
            });
          }
          store.emit(
            new FetchDefaultNetwork(
              () => {},
              (error) => {
                dconsole.error(error);
              },
            ),
          );
        },
        (error) => {
          if(error.caption){
            alertService.error(error.caption)
          }else{
            alertService.error(JSON.stringify(error))
          }
          
          setSubmitting(() => false)
        },
      ),
    );
  };
  return (
    <>
      {(selectedNetwork &&
        sessionUser &&
        sessionUser.role == Role.admin && on) && (
          <Popup title={t('configuration.title')} linkBack="/Profile">
             {/* <Plugins customFields={'ld'} setCustomFields={() => {}} /> */}
            <NetworkForm
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              register={register}
              setValue={_setValue}
              setFocus={setFocus}
              watch={watch}
              isSubmitting={isSubmitting}
              control={control}
              errors={errors}
              captionAction={t('common.save')}
              linkFwd="/Profile"
              description={t('configuration.description')}
            />
          </Popup>
        )}
    </>
  );
}

const useUpdateBackgroundColor = (backgroundColor) => {
  useEffect(() => {
    if (backgroundColor) {
      store.emit(new UpdateNetworkBackgroundColor(backgroundColor));
    }
  }, [backgroundColor]);
};

const useTextColor = (textColor) => {
  useEffect(() => {
    if (textColor) {
      store.emit(new UpdateNetworkTextColor(textColor));
    }
  }, [textColor]);
};
