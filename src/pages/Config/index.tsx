//All the edition posibilities menus and accordion, including neet preferences etc
import NavHeader from '../../components/nav/NavHeader'

import Directory from '../../elements/Directory'
import Accordion from '../../elements/Accordion'
import Btn, {ContentAlignment, BtnType, IconType} from 'elements/Btn'
import CheckBox from 'elements/Checkbox'
import BtnCircle from 'elements/BtnCircle'

export default function Config() {

  return (

    <>

      <NavHeader />

      <div className="body__content">

        <div className="body__section">

          <h2 className="title__h3 config__title">Config</h2>

          <Accordion title="User data">

            <form>

              <div className="form__field">
                <label className="form__label label">
                  Username
                </label>
                <input type="text" className="form__input" placeholder="Write your name"></input>
              </div>


              <div className="form__field">
                <label className="form__label label">
                  Email
                </label>
                <input type="text" className="form__input" placeholder="Write your email"></input>
                <div className="form__input-subtitle">
                  <div className="form__input-subtitle-side">
                    <label className="form__input-subtitle--error">
                      Notes in this side to explain the field, also errors
                    </label>
                  </div>
                </div>
              </div>

              <div className="form__field">
                <label className="form__label label">
                  Imagen de perfil
                </label>
                <input type="text" className="form__input" placeholder="Write your email"></input>
                <div className="form__input-subtitle">
                  <div className="form__input-subtitle-side">
                    <label className="form__input-subtitle--text">
                      Notes in this side to explain the field, also errors
                    </label>
                  </div>
                </div>
              </div>

              <div className="form__field">
                <label className="form__label label">
                  Imagen de perfil
                </label>
                <input type="text" className="form__input" placeholder="Write your email"></input>
                <div className="form__input-subtitle">
                  <div className="form__input-subtitle-side">
                    <label className="form__input-subtitle--error">
                      Notes in this side to explain the field, also errors
                    </label>
                    <label className="form__input-subtitle--text">
                      Notes in this side to explain the field, also errors
                    </label>
                  </div>
                </div>
              </div>

              <div className="form__field">
                <div className="textarea">
                  <label className="form__label label">
                    Description
                  </label>
                  <textarea rows={4} cols={50} className="textarea__textarea" placeholder="p.ej. Soy estudiante y trabajador autónomo, tengo dos hijos. Soy amante de los animales y del bricolaje. Me gustaría colaborar en el barrio..."></textarea>
                </div>
              </div>

              <div className="form__field">
                <label className="form__label label">
                  Share location
                </label>
                <CheckBox icon="cross" text="Compartir" inputId="ahora-checkbox" />
              </div>

              <div className="form__field">
                <label className="form__label label">
                  Languages
                </label>
                <input type="text" className="form__input" placeholder="Write your email"></input>
              </div>

              <div className="form__field">
                <label className="form__label label">
                  App language
                </label>
                <input type="text" className="form__input" placeholder="Write your email"></input>
              </div>

              <div className="form__field">
                <label className="form__label label">
                  Activate/Deactivate User
                </label>
                <CheckBox icon="cross" text="Activar" inputId="ahora-checkbox" />
                <div className="form__input-subtitle">
                  <div className="form__input-subtitle-side">
                    <label className="form__input-subtitle--text">
                      Si desactivas tu perfil tus botones dejarán de ser accesibles aunque seguirán existiendo para cuando los necesites.
                    </label>
                  </div>
                </div>
              </div>

              <div className="form__field">
                <label className="form__label label">
                  Borrar perfil
                </label>
                <CheckBox icon="cross" text="Activar" inputId="ahora-checkbox" />
                <div className="form__input-subtitle">
                  <div className="form__input-subtitle-side">
                    <label className="form__input-subtitle--text">
                      Si borras tu perfil tus botones también se borrarán.
                    </label>
                  </div>
                </div>
              </div>

              <Btn contentAlignment={ContentAlignment.center} caption="Save changes" />

            </form>

          </Accordion>

          <Accordion title="Interests and Alerts">
            <form>

            <p>Elige las etiquetas que te interesan para que otras personas las conozcan y si quieres recibir avisos :</p>

              <div className="form__field">
                <label className="form__label label">
                  Intereses
                </label>
                <input type="text" className="form__input" placeholder="i.e. sports food etc"></input>
              </div>

              <div className="form__field">

                <Btn contentAlignment={ContentAlignment.center} caption="Receive Notifications" />

              </div>

              <p>Aquí puedes elegir para qué redes y qué tipo de botones (Necesitan rojo/ Ofrecen verde) quieres recibir los avisos de cada interés:</p>

              <div className="form__field">

                <label className="form__label label">
                  Intereses
                </label>

                <div className="form__interests">

                    <a href="" className="hashtag hashtag--yellow-home">example</a>

                    <input className="dropdown-nets__dropdown-trigger dropdown__dropdown" autoComplete="off" list="" id="input" name="browsers" placeholder="Select Network" type='text'></input>
                    <datalist className="dropdown-nets__dropdown-content" id='listid'>
                      <option className="dropdown-nets__dropdown-option" label='label1' value='Net1'>hola</option>
                      <option className="dropdown-nets__dropdown-option" label='label2' value='Net2'>hola</option>
                      <option className="dropdown-nets__create-new-button" label='label2' value='Net2'>Create Net</option>
                    </datalist>

                    <BtnCircle />

                </div>

              </div>

              <p>Aquí puedes elegir a qué distancia y tu lugar de referencia para recibir avisos.</p>

              <div className="form__field">

                <label className="form__label label">
                  Distance
                </label>
                <input type="text" className="form__input" placeholder="choose distance"></input>

              </div>

              <div className="form__field">

                <label className="form__label label">
                  Lugar de referencia :
                </label>
                <input type="text" className="form__input" placeholder="choose distance"></input>

              </div>

              <Btn contentAlignment={ContentAlignment.center} caption="Save changes" />
            </form>
          </Accordion>

          <Accordion title="Seguridad y Contraseña">

            <form>

              <p>Aquí puedes elegir a qué distancia y tu lugar de referencia para recibir avisos.</p>
              <div className="form__field">

                <label className="form__label label">
                  Password
                </label>
                <input type="text" className="form__input" placeholder="Present password"></input>

              </div>

              <Btn contentAlignment={ContentAlignment.center} caption="Reset password"/>

            </form>

          </Accordion>

          <Accordion title="Connected apps">

            <form>

              <div className="form__field">

                <label className="form__label label">
                  Phone
                </label>
                <input type="text" className="form__input" placeholder="choose distance"></input>

              </div>

              <div className="form__field">

                <label className="form__label label">
                  Telegram
                </label>
                <input type="text" className="form__input" placeholder="Telegram Username"></input>

              </div>

              <div className="form__field">

                <label className="form__label label">
                  Whatsapp
                </label>
                <input type="text" className="form__input" placeholder="Telegram Username"></input>

                <Btn contentAlignment={ContentAlignment.center} caption="Show phone"/>

              </div>

              <Btn contentAlignment={ContentAlignment.center} caption="Save changes"/>

            </form>

          </Accordion>


          <Accordion title="User Management">

            <form>

              <div className="form__field">

                <label className="form__label label">
                  Blocked Users
                </label>
                <input type="text" className="form__input" placeholder="Telegram Username"></input>

              </div>

              <Btn contentAlignment={ContentAlignment.center} caption="Save changes"/>

            </form>

          </Accordion>


          <Accordion title="Networks">

          <form>

            <div className="form__field">

              <label className="form__label label">
                Network Name
              </label>
              <input type="text" className="form__input" placeholder="Name"></input>

            </div>

            <div className="form__field">

              <label className="form__label label">
                Network Search Name
              </label>
              <input type="text" className="form__input" placeholder="Name"></input>

            </div>

            <div className="form__field">

              <label className="form__label label">
                Description
              </label>
              <input type="text" className="form__input" placeholder="Name"></input>

            </div>

            <div className="form__field">

              <label className="form__label label">
                Location
              </label>
              <input type="text" className="form__input" placeholder="Name"></input>

            </div>

            <div className="form__field">

              <label className="form__label label">
                Network Icon
              </label>
              <input type="text" className="form__input" placeholder="Name"></input>

            </div>

            <div className="form__field">

              <label className="form__label label">
                Network tags
              </label>
              <input type="text" className="form__input" placeholder="Name"></input>

            </div>

            <div className="form__field">

              <label className="form__label label">
                Network Url
              </label>
              <input type="text" className="form__input" placeholder="Name"></input>

            </div>

            <div className="form__field">

              <label className="form__label label">
                Network Friends
              </label>
              <input type="text" className="form__input" placeholder="Name"></input>

            </div>

            <div className="form__field">

              <label className="form__label label">
                Blocked Users
              </label>
              <input type="text" className="form__input" placeholder="Name"></input>

            </div>

            <div className="form__field">

              <label className="form__label label">
                Admin Users
              </label>
              <input type="text" className="form__input" placeholder="Name"></input>

            </div>

            <div className="form__field">

              <label className="form__label label">
                Admitted Users
              </label>
              <input type="text" className="form__input" placeholder="Name"></input>

            </div>

            <Btn contentAlignment={ContentAlignment.center} caption="External Network"/>

            <div className="form__field">

              <label className="form__label label">
                External Url
              </label>
              <input type="text" className="form__input" placeholder="Name"></input>

            </div>

            <Btn contentAlignment={ContentAlignment.center} caption="Save Changes"/>

          </form>

          </Accordion>


        </div>

      </div>



    </>


  );
}
