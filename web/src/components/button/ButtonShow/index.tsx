import Feed from 'layouts/Feed';
import CardButton from '../CardButton';
import { useToggle } from 'shared/custom.hooks';

export function ButtonShow({ currentButton, buttonTypes }) {
  const [show, toggleShow] = useToggle(false);

  return (
    <>
      <CardButton
        button={currentButton}
        buttonTypes={buttonTypes}
        onScollToCompose={() => {
          toggleShow(true);
        }}
      />
      <Feed
        button={currentButton}
        show={show}
        toggleShow={toggleShow}
      />
    </>
  );
}
