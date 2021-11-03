//Users buttons an profile info URL
import NavHeader from '../../components/nav/NavHeader'

import CardProfile from '../../components/user/CardProfile'
import FeedProfile from '../../layouts/FeedProfile'


export default function Profile() {

  return (

    <>

      <NavHeader />

      <div className="body__content">

        <div className="body__section">

          <CardProfile />

          <FeedProfile />

        </div>

      </div>

    </>


  );
}
