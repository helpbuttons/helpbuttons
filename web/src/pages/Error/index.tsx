//ERROR PAGE
import NavBottom from 'components/nav/NavBottom';
import Popup from 'components/popup/Popup';
import router from 'next/router';
import t from 'i18n';
import { NextPageContext } from 'next';
import { setMetadata } from 'services/ServerProps';
import { useMetadataTitle } from 'state/Metadata';

export default function Error({metadata}) {
  useMetadataTitle('Error')

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
      <NavBottom pageName='Error' loggedInUser={null} />
    </>
  );
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  return setMetadata('Error', ctx)
};