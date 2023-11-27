import CardButton from 'components/button/CardButton';
import Feed from 'layouts/Feed';
import { NextPageContext } from 'next';
import SEO from 'components/seo';
import { ServerPropsService } from 'services/ServerProps';
import { Button } from 'shared/entities/button.entity';
import { makeImageUrl } from 'shared/sys.helper';
import { useButtonTypes } from 'shared/buttonTypes';
import { useEffect, useState } from 'react';
import { HttpStatus } from 'shared/types/http-status.enum';
import Router from 'next/router';
import PopupButtonFile from 'components/popup/PopupButtonFile';
import Popup from 'components/popup/Popup';
import t from 'i18n';
import router from 'next/router';
import { updateCurrentButton } from 'state/Explore';
import { GlobalState, store } from 'pages';
import { useStore } from 'store/Store';
export default function ButtonFile({
  metadata,
  currentButtonServer,
}) {
  const [buttonTypes, setButtonTypes] = useState([]);
  const currentButton = useStore(
    store,
    (state: GlobalState) => state.explore.currentButton,
  );
  useButtonTypes(setButtonTypes);

  useEffect(() => {
    if(!currentButtonServer)
    {
      console.log(currentButtonServer)
      Router.push('/Error')
    }else{
      store.emit(new updateCurrentButton(currentButtonServer));
    }
  }, [currentButtonServer])
  
  return (
    <>
      <SEO {...metadata} />
      {currentButton && 
            <Popup
            sectionClass=''
            title={t('button.title')}
            onCloseClicked={() => router.back()}
            >

                {buttonTypes?.length > 0 && (
                  <CardButton
                    button={currentButton}
                    buttonTypes={buttonTypes}
                  />
                )}

                <Feed button={currentButton} />
                
            </Popup> 
      }
    </>
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
  });
  const currentButtonData: Button = await currentButtonFetch.json();
  if(currentButtonData?.statusCode == HttpStatus.NOT_FOUND)
  {
    return {props: serverProps};
  }
  const serverPropsModified = {
    ...serverProps,
    metadata: {
      ...serverProps.metadata,
      title: currentButtonData.title,
      description: currentButtonData.description,
      image: `${makeImageUrl(
        currentButtonData.image,
        serverProps.config.hostName + '/api',
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
