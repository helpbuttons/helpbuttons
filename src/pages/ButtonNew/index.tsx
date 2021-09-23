//Create new button and edit button URL, with three steps with different layouts in the following order: NewType --> NewData --> NewPublish --> Share
import PopupHeader from '../../components/PopupHeader'
import NavBottom from '../../components/NavBottom'
import ButtonNewType from "../../layouts/ButtonNewType";
import ButtonNewData from "../../layouts/ButtonNewData";
import ButtonPublish from "../../layouts/ButtonPublish";
import ButtonShare from "../../layouts/ButtonShare";

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
