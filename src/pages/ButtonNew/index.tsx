//Create new button and edit button URL, with three steps with different layouts in the following order: NewType --> NewData --> NewPublish --> Share
import PopupHeader from '../../components/popup/PopupHeader'
import NavBottom from '../../components/nav/NavBottom'
import ButtonNewType from "../../components/button/ButtonNewType";
import ButtonNewData from "../../components/button/ButtonNewData";
import ButtonPublish from "../../layouts/ButtonPublish";
import ButtonShare from "../../components/button/ButtonShare";

export default function ButtonNew() {

  return (

    <>
        <PopupHeader />

        <div className="button-new__container">

          <ButtonNewType />

          <ButtonNewData />

          <ButtonPublish />

          <ButtonShare />

        </div>

        <NavBottom />

    </>


  );
}
