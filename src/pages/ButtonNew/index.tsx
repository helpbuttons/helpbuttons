//Create new button and edit button URL, with three steps with different layouts in the following order: NewType --> NewData --> NewPublish --> Share
import Popup from '../../components/popup/Popup'
import NavBottom from '../../components/nav/NavBottom'
import ButtonNewType from "../../components/button/ButtonNewType";
import ButtonNewData from "../../components/button/ButtonNewData";
import ButtonPublish from "../../layouts/ButtonPublish";
import ButtonShare from "../../components/button/ButtonShare";

export default function ButtonNew() {

  return (

    <>

        <Popup title="Crear Botón">


        <div className="button-new__container">

          <ButtonNewType />

          <ButtonNewData />

          <ButtonPublish />

          <ButtonShare />

        </div>

        <NavBottom />

        </Popup>

    </>


  );
}
