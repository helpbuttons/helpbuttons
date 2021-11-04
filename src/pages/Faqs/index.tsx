//QUESTIONS AND INFO
import NavHeader from '../../components/nav/NavHeader'

import Directory from '../../elements/Directory'
import Accordion from '../../elements/Accordion'
import Popup from 'components/popup/Popup'

export default function Faqs() {

  return (

    <>
      <Popup title="Faqs">

        <div className="popup__section">

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

      </Popup>

    </>


  );
}
