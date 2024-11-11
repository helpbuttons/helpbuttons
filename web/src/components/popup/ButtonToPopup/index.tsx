import Btn, {
  BtnType,
  ContentAlignment,
  IconType,
} from 'elements/Btn';
// import Popup from '../Popup';
// import { useShowPopup } from 'shared/custom.hooks';

// export default function ButtonToPopup({
//   children,
//   buttonIcon,
//   buttonCaption,
//   title,
// }) {
//   const [popupShowState, openPopup, closePopup] = useShowPopup();

//   return (
//     <>
//       {title}
//       <Btn
//         btnType={BtnType.filterCorp}
//         iconLink={buttonIcon}
//         caption={buttonCaption}
//         iconLeft={IconType.circle}
//         contentAlignment={ContentAlignment.center}
//         onClick={openPopup}
//       />
//       {popupShowState && (
//         <Popup>
//           yellow
//           {children}
//         </Popup>
//       )}
//     </>
//   );
// }

export function ButtonForPopup({
  buttonIcon,
  buttonCaption,
  onClick,
}) {
  return (
    <>
      <Btn
        btnType={BtnType.corporative}
        iconLink={buttonIcon}
        caption={buttonCaption}
        iconLeft={IconType.circle}
        contentAlignment={ContentAlignment.left}
        onClick={onClick}
      />
    </>
  );
}