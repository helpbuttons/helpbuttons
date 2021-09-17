// chat card that goes in ButtonFile component, under ButtonCard, and repeats for every chat that is available. It can also displays in Chats page, on the left column (desktop) or other pllaciess for notifications in the future. It has a "remove chat"icon, date and last message preview
import CrossIcon from '../../../public/assets/svg/icons/cross1.tsx'

export default function CardChat() {
  return (
    <>
      <div class="card-notification">
        <div class="card-notification__content">
          <div class="card-notification__avatar">
            <div class="avatar-medium">
              <img src="https://dummyimage.com/50/#ccc/fff" alt="Avatar" class="picture__img"></img>
            </div>
          </div>
          <div class="card-notification__text">
            <div class="card-notification__header">
              <div class="card-notification__date card-notification__date--nflex">
                hace 2 días
              </div>
            </div>
            <h2 class="card-notification__title">
              Jorge
            </h2>
            <div class="card-notification__paragraph">
              Lorem ipsum es el texto..
            </div>
          </div>
          <button class="btn-circle card-notification__delete">
            <div class="btn-circle__content">
              <div class="btn-circle__icon">
                <CrossIcon />
              </div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
