import t from 'i18n';
import router from 'next/router';
import { store } from 'pages';
import { useEffect } from 'react';
import { alertService } from 'services/Alert';
import { ButtonDelete } from 'state/Explore';

export default function ButtonRemove() {
  const buttonId = router.query.id as string;
  useEffect(() => {
    store.emit(
      new ButtonDelete(
        buttonId,
        () => {
          alertService.success(t('common.deleteSuccess', [buttonId]));
          router.push('/Explore');
        },
        (errorMessage) => {
          console.error(errorMessage)
          alertService.error(errorMessage.caption);
          router.push('/Explore');
        },
      ),
    );
  }, [])
  

  return <>removing {buttonId}</>;
}
