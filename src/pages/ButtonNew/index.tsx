//Create new button and edit button URL, with three steps with different layouts in the following order: NewType --> NewData --> NewPublish --> Share
import NavHeader from '../../components/NavHeader'
import NavBottom from '../../components/NavBottom'
import ButtonNewType from "../../layouts/ButtonNewType";
import ButtonNewData from "../../layouts/ButtonNewData";
import ButtonPublish from "../../layouts/ButtonPublish";
import ButtonShare from "../../layouts/ButtonShare";

export default function ButtonNew() {

  return (

    <>

        <ButtonNewType />

        <ButtonNewData />

        <ButtonPublish />

        <ButtonShare />

    </>


  );
}
