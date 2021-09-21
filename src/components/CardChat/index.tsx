// chat card that goes in ButtonFile component, under ButtonCard, and repeats for every chat that is available. It can also displays in Chats page, on the left column (desktop) or other pllaciess for notifications in the future. It has a "remove chat"icon, date and last message preview
import CrossIcon from '../../../public/assets/svg/icons/cross1.tsx'

export default function CardChat() {
  return (
    <>
      <div className="card-notification">
        <div className="card-notification__content">
          <div className="card-notification__avatar">
            <div className="avatar-medium">
              <img src="https://dummyimage.com/50/#ccc/fff" alt="Avatar" className="picture__img"></img>
            </div>
          </div>
          <div className="card-notification__text">
            <div className="card-notification__header">
              <div className="card-notification__date card-notification__date--nflex">
                hace 2 días
              </div>
            </div>
            <h2 className="card-notification__title">
              Jorge
            </h2>
            <div className="card-notification__paragraph">
              Lorem ipsum es el texto..
            </div>
          </div>
          <button className="btn-circle card-notification__delete">
            <div className="btn-circle__content">
              <div className="btn-circle__icon">
                <CrossIcon />
              </div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
