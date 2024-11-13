import ImageWrapper, { ImageType } from 'elements/ImageWrapper';
import { readableTimeLeftToDate } from 'shared/date.utils';
import Link from 'next/link';
import { formatMessage } from 'elements/Message';

export function ActivityCard({ type, title, image, notifIcon, date, message = '', id, read }) {
  return (
    <>{JSON.stringify(title)}</>

    // <Link href={'/ButtonFile/'+ id.toString()} className="card-notification card-notification">
    //   <div className="card-notification__comment-count">
    //     <div className="card-notification__label">
    //       <div className="hashtag hashtag--blue hashtag--with-icon">{notifIcon}{type}</div>
    //     </div>
    //   </div>
    //   <div className="card-notification__content">
    //     <div className="card-notification__avatar">
    //       <div className="avatar-medium">
    //         <ImageWrapper
    //           imageType={ImageType.avatarMed}
    //           src={image}
    //           alt="image"
    //         />
    //       </div>
    //     </div>
    //     <div className="card-notification__text">
    //       <div className="card-notification__header">
    //         <div className="card-notification__info">
    //         </div>
    //         {read ? 
    //           <div className="card-notification__date">
    //            {readableTimeLeftToDate(date)}
    //           </div>
    //         : 
    //           <div className="card-notification__date">
    //             {readableTimeLeftToDate(date)}
    //           </div>
    //         }
            
    //       </div>
    //       <h2 className="card-notification__title">{title}</h2>
    //       <div className="card-notification__paragraph">{message && formatMessage(message)}</div>
    //     </div>
    //   </div>
    // </Link>
  );
}
