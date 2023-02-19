//QUESTIONS AND INFO
import NavHeader from '../../components/nav/NavHeader'

import Directory from '../../elements/Directory'
import Accordion from '../../elements/Accordion'
import Popup from 'components/popup/Popup'

export default function Faqs() {

  return (

    <>
      <Popup title="Faqs" linkFwd="/Explore">

        <div className="popup__section">

            <Accordion title="What's <Instance name>">
              Description of Network instance
            </Accordion>

            <Accordion title="What's Helpbuttons">
              Helpbuttons.org is the software used to make this app. It's an opensource platform for collaborative network making -like airnbnb, blablacar and so many others, but opensource- specialized in connecting unknown people by purposes in real life. 
            </Accordion>

            <Accordion title="What's for">
              Shortly, we want to democratize collaborative-apps-creation and we need a big community for this to be sustainable in time.
            </Accordion>

            <Accordion title="What's a Button">
              A Button is a post. Every post published by an user in Helpbuttons it´s called a button. Buttons can be offers, needs, exchanges, transport proposals, bussinesses, anything you want. 
            </Accordion>

            <Accordion title="What's a Network">
              A network is your instance of Helpbuttons. You can create your own network and assign it a purpose (shaare food, help animals, take care of elders,...) so you can start collaborating with whatever collective you want. 
            </Accordion>

            <Accordion title="The community">
              The Helpbuttons community is what makes this project sustainable. This tool is made to be adapted to many purposes, so many people can both benefit and help to sustain the project. We don´t need an app for sharing food and a different app for sharing transport, we believe we can share the same core structure and adapt the same app to different purposes. In that way we could get more people together and make a better tool. 
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
