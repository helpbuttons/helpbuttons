//ERROR PAGE
import NavBottom from 'components/nav/NavBottom';
import ErrorMessage from '../../components/overlay/ErrorMessage'
import Popup from 'components/popup/Popup';
import router from 'next/router';
import t from 'i18n';
import SEO from 'components/seo';
import { NextPageContext } from 'next';
import { ServerPropsService } from 'services/ServerProps';
import { HttpStatus } from 'shared/types/http-status.enum';
import { makeImageUrl } from 'shared/sys.helper';



export default function Error({metadata}) {

  return (
    <>
      <SEO {...metadata} />
      <Popup
        title={t('common.error')}
        linkBack={() => router.replace({ pathname: '/HomeInfo?'+ (new Date()).getTime() })}    
        >        
        <div className='error__message'>

          {t('error.notFoundMessage')}

        </div>
      </Popup>
      <NavBottom loggedInUser={null}/>
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