import Feed from 'layouts/Feed';
import CardButton from '../CardButton';
import { useToggle } from 'shared/custom.hooks';

export function ButtonShow({ currentButton, buttonTypes }) {

  return (
    <>
      <CardButton
        button={currentButton}
        buttonTypes={buttonTypes}
      />
      <Feed
        button={currentButton}
      />
    </>
  );
}
