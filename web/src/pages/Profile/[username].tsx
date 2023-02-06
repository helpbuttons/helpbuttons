//Users buttons an profile info URL
import NavHeader from 'components/nav/NavHeader'
import CardProfile from 'components/user/CardProfile'
import DynForm from 'elements/DynForm'

import { useRef } from "store/Store";
import { GlobalState, store } from "pages";
import router from 'next/router';
import { useEffect, useState } from 'react';
import { User } from 'shared/entities/user.entity';
import { FindUser } from 'state/Users';

export default function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const knownUsers = useRef(store, (state: GlobalState) => state.knownUsers);

  const username = router.query.username as string
  useEffect(() => {
    if (knownUsers) {
      const newUserProfile = knownUsers.filter((user: User) => {
        return user.username == username;
      })
      if (newUserProfile.length > 0) {
        console.log('found user profile')
        console.log(newUserProfile)
        setUserProfile(
          newUserProfile[0]
        )
      }else {
        // console.log('getting unknown user')
        store.emit(new FindUser(username, (user) => {
          setUserProfile(user)
        }))
      }
    }
  }, [knownUsers])
  return (

    <>

      <div className="body__content">

        <div className="body__section">
         { userProfile && (
            <CardProfile user={ userProfile }/>
          )}

        </div>

      </div>

    </>


  );
}

