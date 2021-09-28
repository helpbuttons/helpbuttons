///popup general component for all overlayed sections like PopupExtraFilters
//Form component with the main fields for signup in the platform
//imported from libraries
import React from 'react';



export default function Popup({children}) {


  return (
      <>
          <div className="popup">

              <div className="popup__content">

                    {children}

              </div>

          </div>
      </>
  );

}
