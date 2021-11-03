//QUESTIONS AND INFO
import NavHeader from '../../components/nav/NavHeader'

import Directory from '../../elements/Directory'
import Accordion from '../../elements/Accordion'

export default function Faqs() {

  return (

    <>

      <NavHeader />

      <div className="body__content">

        <div className="body__section">

          <h2 className="title__h3 faqs__title">Faqs</h2>


          <Accordion title="What's Helpbuttons">
          </Accordion>

          <Accordion title="What's for">
          </Accordion>

          <Accordion title="What's a button">
          </Accordion>

          <Accordion title="What's a Net">
          </Accordion>

          <Accordion title="The community">
          </Accordion>

          <Accordion title="Ethics Policies">
          </Accordion>

          <Accordion title="Privacy Policies">
          </Accordion>

          <Accordion title="Security Policies">
          </Accordion>

          <Accordion title="Contact">
          </Accordion>

        </div>

      </div>



    </>


  );
}
