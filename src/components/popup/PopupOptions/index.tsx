///popup general component for all overlayed sections like PopupExtraFilters
//Form component with the main fields for signup in the platform
//imported from libraries


export default function PopupOptions({children, title, linkFwd, ...props}) {

  return (

    <div className="popup__options-v">
        {children}
    </div>
  );

}
