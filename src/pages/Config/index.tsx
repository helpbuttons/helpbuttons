//All the edition posibilities menus and accordion, including neet preferences etc
import NavHeader from '../../components/nav/NavHeader'

import Directory from '../../elements/Directory'
import Accordion from '../../elements/Accordion'

export default function Config() {

  return (

    <>

      <NavHeader />

      <div className="config__content">

        <h2 className="title__h3 config__title">Config</h2>

        <Directory />

        <Accordion>
          <p>Texto molón de mi acorodeón</p>
        </Accordion>

        <Accordion>
          <p>Otro Texto molón de mi acorodeón</p>
        </Accordion>

      </div>

      

    </>


  );
}
