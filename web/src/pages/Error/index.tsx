//ERROR PAGE
import NavBottom from 'components/nav/NavBottom';
import Popup from 'components/popup/Popup';
import router from 'next/router';
import t from 'i18n';
import { NextPageContext } from 'next';
import { ServerPropsService } from 'services/ServerProps';

export default function Error({metadata}) {

  return (
    <>
      <Popup
        title={t('common.error')}
        linkBack={() => {
          router.back()
        }}
      >
        <div className="error__message">
          {t('error.notFoundMessage')}
        </div>
      </Popup>
      <NavBottom loggedInUser={null} />
    </>
  );
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  try {
    const serverProps = await ServerPropsService.general('Error page', ctx);
    return { props: {} };
  } catch (err) {
    return {
      props: {
        metadata: null,
        selectedNetwork: null,
        config: null,
        noconfig: true,
      },
    };
  }
};