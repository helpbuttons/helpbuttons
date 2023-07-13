///dropddown selector component
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';


interface DropdownProps {
  caption: string;
  iconLink?: string;
  contentAlignment?: ContentAlignment;
  btnType?: BtnType;
  disabled?: boolean;
  onClick?: Function;
}

export default function Dropdown ({
  label,
  children,
  caption,
  contentAlignment = null,
  onClick = () => {},
}: DropdownProps) {
  return (
    <>

        
      <div class="label">{label} </div>
      <Btn
          btnType={BtnType.dropdown}
          caption={caption}
          contentAlignment={contentAlignment}
          onClick={onClick}
        /> 
      <select className="dropdown-select__trigger">
        {children}
      </select>


    </>

  );
}
