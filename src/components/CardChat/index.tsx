// chat card that goes in ButtonFile component, under ButtonCard, and repeats for every chat that is available. It can also displays in Chats page, on the left column (desktop) or other pllaciess for notifications in the future. It has a "remove chat"icon, date and last message preview
export default function CardChat() {
  return (
    <>
      <div class="card-notification__content">

        <div class="card-notification__avatar">
            <a href="" class="notif-circle card-chat__unread">1</a>
            <picture class="picture">
              <img
                src="{{userAvatar.url}}"
                alt="Avatar"
                class="avatar picture__img"
              />
            </picture>
        </div>

        <div class="pl-2 text-truncate card-notification__header">
          <div
            class="card-notification__date card-notification__old card-notification__date--nflex">
            message date
          </div>
        </div>

        <h2 class="text-truncate card-notification__title">
          Username
        </h2>

        <button class="card-notification__close">
          cross icon
        </button>

      </div>
    </>
  );
}
