import ContentList from 'components/list/ContentList';
import List from 'components/list/List';
import { useRouter } from 'next/router';
import { store } from 'pages';
import { useEffect, useState } from 'react';
import { useButtonTypes } from 'shared/buttonTypes';
import { FindBulletinButtons } from 'state/Button';

export default function Embbed() {
  const router = useRouter();
  const [nr, setNr] = useState(null);
  const [buttons, setButtons] = useState([]);
  const buttonTypes = useButtonTypes();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    setNr(() => router.query.nr as string);
  }, [router.isReady]);

  useEffect(() => {
    store.emit(
      new FindBulletinButtons(0, nr, 400, (buttons) => {
        setButtons(() => buttons);
      }),
    );
  }, [nr]);
  return (
    <>
      {buttonTypes?.length > 0 && (
        <ContentList buttons={buttons} buttonTypes={buttonTypes} />
      )}
    </>
  );
}
