//ERROR PAGE
import NavBottom from 'components/nav/NavBottom';
import ErrorMessage from '../../components/overlay/ErrorMessage'



export default function Error() {

  return (
    <>
      This page could not be found.
      <NavBottom loggedInUser={null}/>
    </>
  );
}
