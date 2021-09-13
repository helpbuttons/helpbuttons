//Card that displays a resume of the button info in tthe List component. Its fieldds can be customizedd according to buttonTemplate.
export default function CardButtonList() {
  return (
    <>
    <div class="card-button-list card-button--ofrece card-button{{buttonType}} card-button-list{{cardStateBtnType}}">
      <div class="card-button-list__thumb">
        <a href="" class="card-button-list__notif-circle notif-circle">1</a>
        <div class="card-button-list__author">
          <div class="card-button-list__nets">
              <div class="hashtag">
                <img src='https://help-buttons-staging.s3.eu-west-3.amazonaws.com/statics/assets/categories/{{net.imgUrl}}.png' alt="" class="card-avatar card-button-list__net-icon"></img>NetName
              </div>
          </div>
          <div class="card-button-list__avatar">
              <img src="{{creatorAvatar.smallThumb}}" alt="Avatar" class="card-avatar"></img>
          </div>
        </div>
        <div class="card-button-list__author-wrap">
          <span class="card-button-list__author-name">
            <span>
              Creador
            </span>
          </span>
          <span class="card-button-list__state card-button-list__state{{cardBtnType}}">

                <span class="card-button__status--offer">OFRECE</span> y <span class="card-button__status--need">BUSCA</span>

          </span>
        </div>
      </div>

      <div class="card-button-list__content">

        <div class="card-button-list__tags card-button-list__tags--green">
          <div class="hashtag">
            tag
          </div>
        </div>

        <div class="card-button-list__tags card-button-list__tags--green">
          <div class="hashtag">
            tag
          </div>
        </div>

        <div class="resume">
          <p>
            description
          </p>
        </div>

      </div>

      <div class="card-button-list__head">

        <div class="card-button__city">
          loca
        </div>

        <div class="card-button__city-list card-button__everywhere">
        En todas partes
        </div>

        <div class="card-button__city-list">
          location
        </div>

        <div class="card-button-list__when">
            Date
        </div>

      </div>

      <picture class="card-button-list__picture image">
        <img alt="Button Image" src=""></img>
      </picture>

    </div>

  

    </>

  );
}
