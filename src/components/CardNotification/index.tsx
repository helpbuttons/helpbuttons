//notification card that can be used in a notif menu or a message notification, it's the same as chat card with slight modifitaion for different purposes.
import CrossIcon from '../../../public/assets/svg/icons/cross1.tsx'


export default function CardNotification() {
  return (
    <>
      <div class="card-notification card-notification--intercambio">
        <div class="card-notification__content">
          <div class="card-notification__avatar">

            <div class="avatar-medium">
              <img src="https://dummyimage.com/50/#ccc/fff" alt="Avatar" class="picture__img"></img>
            </div>

            <div class="card-notification__icon">
              <CrossIcon />
            </div>
          </div>
          <div class="card-notification__text">
            <div class="card-notification__header">
              <div class="card-notification__info">
                Comentario en #Amigos, #Tarde
              </div>
              <div class="card-notification__date">
                hace 2 días
              </div>
            </div>
            <h2 class="card-notification__title">
              Jorge
            </h2>
            <div class="card-notification__paragraph">
              Lorem ipsum es el texto que se usa en diseño gráfico en demostraciones...
            </div>
          </div>
        </div>
      </div>
    </>
);

}
