//QUESTIONS AND INFO
import NavHeader from '../../components/nav/NavHeader'
import NavBottom from '../../components/nav/NavBottom'
import Directory from '../../elements/Directory'
import Accordion from '../../elements/Accordion'

export default function Faqs() {

  return (

    <>

      <NavHeader />

      <div className="faqs__content">

        <h2 className="title__h3 faqs__title">Faqs</h2>


        <Directory />



        <Accordion />
        <Accordion />

      </div>

      <NavBottom />

    </>


  );
}
