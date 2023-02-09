//Users buttons an profile info URL
import CardProfile from 'components/user/CardProfile'

import { useRef } from "store/Store";
import { GlobalState, store } from "pages";

export default function Profile() {

  const currentUser = useRef(store, (state: GlobalState) => state.loggedInUser);

  return (

    <>

      <div className="body__content">

        <div className="body__section">

          { currentUser && (
            <CardProfile user={ currentUser }/>
          )}

        </div>

      </div>

    </>


  );
}
