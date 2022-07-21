//notification card that can be used in a notif menu or a message notification, it's the same as feed card with slight modifitaion for different purposes.
import Image from 'next/image'
import { IoClose } from "react-icons/io5";
import ImageWrapper, { ImageType } from 'elements/ImageWrapper'


export default function CardNotification() {
  return (
    <>
      <div className="card-notification card-notification--exchange">
        <div className="card-notification__content">
          <div className="card-notification__avatar">

            <div className="avatar-medium">
              <ImageWrapper imageType={ImageType.avatar} src="https://dummyimage.com/80/#ccc/fff" alt="Avatar"/>
            </div>

            <div className="card-notification__icon">
              <IoClose />
            </div>
          </div>
          <div className="card-notification__text">
            <div className="card-notification__header">
              <div className="card-notification__info">
                Comentario en #Amigos, #Tarde
              </div>
              <div className="card-notification__date">
                hace 2 días
              </div>
            </div>
            <h2 className="card-notification__title">
              Jorge
            </h2>
            <div className="card-notification__paragraph">
              Lorem ipsum es el texto que se usa en diseño gráfico en demostraciones...
            </div>
          </div>
        </div>
      </div>
    </>
);

}
