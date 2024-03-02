//ERROR PAGE
import NavBottom from 'components/nav/NavBottom';
import ErrorMessage from '../../components/overlay/ErrorMessage'
import Popup from 'components/popup/Popup';
import router from 'next/router';
import t from 'i18n';



export default function Error() {

  return (
    <>
      <Popup
        title={t('common.error')}
        linkBack={() => router.back()}    
        >        
        <div className='error__message'>

          {t('error.notFoundMessage')}

        </div>
      </Popup>
      <NavBottom loggedInUser={null}/>
    </>
  );
}
