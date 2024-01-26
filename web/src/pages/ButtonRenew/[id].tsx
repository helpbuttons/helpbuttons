import t from 'i18n';
import { useRouter } from 'next/router';
import { GlobalState, store } from 'pages';
import { useEffect, useRef, useState } from 'react';
import { alertService } from 'services/Alert';
import { ButtonUpdateModifiedDate } from 'state/Explore';
import { useStore } from 'store/Store';

export default function ButtonBump({}) {
  const [id, setId] = useState(null);
  const router = useRouter();

  const loggedInUser = useStore(
    store,
    (state: GlobalState) => state.loggedInUser,
    false,
  );

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    setId(() => router.query.id as string);
  }, [router.isReady]);

  useEffect(() => {
    if (id && loggedInUser) {
      store.emit(
        new ButtonUpdateModifiedDate(
          id,
          () => {
            alertService.success(t('button.renewSuccess'));
            router.push(`/ButtonFile/${id}`);
          },
          () => {
            alertService.error(t('button.renewError'));
            router.push(`/ButtonFile/${id}`);
          },
        ),
      );
    }
  }, [id]);

  return <></>;
}
