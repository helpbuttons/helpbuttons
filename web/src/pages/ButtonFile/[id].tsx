import { NextPageContext } from 'next';
import { ServerPropsService } from 'services/ServerProps';
import { Button } from 'shared/entities/button.entity';
import { makeImageUrl } from 'shared/sys.helper';
import { useButtonTypes } from 'shared/buttonTypes';
import { useEffect, useState } from 'react';
import { HttpStatus } from 'shared/types/http-status.enum';
import Router from 'next/router';
import Popup from 'components/popup/Popup';
import router from 'next/router';
import { updateCurrentButton } from 'state/Explore';
import { GlobalState, store } from 'pages';
import { useStore } from 'store/Store';
import { ButtonShow } from 'components/button/ButtonShow';
import t from 'i18n';
export default function ButtonFile({
  metadata,
  currentButtonServer,
}) {
  const buttonTypes = useButtonTypes();
  const currentButton = useStore(
    store,
    (state: GlobalState) => state.explore.currentButton,
  );
  
  const [buttonNotFound, setButtonNotFound] = useState(null)
  useEffect(() => {
    if (!currentButtonServer) {
      setButtonNotFound(() => true)
    } else {
      store.emit(new updateCurrentButton(currentButtonServer));
    }
  }, [currentButtonServer]);

  return (
      <Popup        
        sectionClass=""
        title={buttonNotFound ? t('button.notFound'): ''}
        linkBack={() => router.back()}
      >
        {(currentButton && buttonTypes?.length > 0 )&& (
          <ButtonShow
            currentButton={currentButton}
            buttonTypes={buttonTypes}
          />
        )}
      </Popup>
  );
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  const serverProps = await ServerPropsService.general(
    'New Button',
    ctx,
  );
  const buttonUrl = `${process.env.API_URL}/buttons/findById/${ctx.params.id}`;
  const currentButtonFetch = await fetch(buttonUrl, {
    next: { revalidate: 10 },
  }).catch((err) => {console.log(err);return { props: serverProps };});
  const currentButtonData: Button = await currentButtonFetch.json();
  if (currentButtonData?.statusCode == HttpStatus.NOT_FOUND) {
    return { props: serverProps };
  }
  const serverPropsModified = {
    ...serverProps,
    metadata: {
      ...serverProps.metadata,
      title: currentButtonData.title,
      description: currentButtonData.description,
      image: `${makeImageUrl(
        currentButtonData.image
      )}`,
    },
  };

  return {
    props: {
      ...serverPropsModified,
      currentButtonServer: await currentButtonData,
    },
  };
};
