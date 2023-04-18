import t from 'i18n';
import router from 'next/router';
import { store } from 'pages';
import { useEffect, useState } from 'react';
import { alertService } from 'services/Alert';
import { ButtonDelete } from 'state/Explore';

export default function ButtonFile() {
  const buttonId = router.query.id as string;
  useEffect(() => {
    if (buttonId) {
      store.emit(
        new ButtonDelete(
          buttonId,
          () => {
            alertService.success(t('common.saveSuccess', [buttonId]));
            router.push('/Explore');
          },
          (errorMessage) => {
            alertService.error(errorMessage.caption);
            router.push('/Explore');
          },
        ),
      );
    }
  }, [buttonId]);

  return <>removing {buttonId}</>;
}
