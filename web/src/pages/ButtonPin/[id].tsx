import t from 'i18n';
import { useRouter } from 'next/router';
import { store } from 'state';
import { useEffect, useRef } from 'react';
import { alertService } from 'services/Alert';
import { ButtonPin as BP } from 'state/Button';

export default function ButtonPin() {
  const router = useRouter()
  const once = useRef(false)
  useEffect(() => {
    if(!router.isReady){
      return;
    }
    if (once.current)
    {
      return;
    }
    once.current = true;
    const buttonId = router.query.id as string;

    store.emit(
      new BP(
        buttonId,
        (nextPinned) => {
          alertService.success(
            nextPinned ? t('button.unpinSuccess') : t('button.pinSuccess')
          );
          router.push('/Explore');
        }
      ),
    );
  }, [router.isReady])

  return <>removing</>;
}
