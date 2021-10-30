//List of elements component that can be used in home, profile and other pages/layouts where we need to ddisplay buttons/networks/other elements
//a foreach => buttons
import ImageWrapper, { ImageType } from 'elements/ImageWrapper'
import Image from 'next/dist/client/image';


function UploadedImageList() {
  
  return (
      <>
              <div className="drag-tab"><span className="drag-tab__line"></span></div>

              <div className="list__content">
                <div className="list__element">
                  <Image src="https://dummyimage.com/200/#ccc/fff" alt="popup_img" width="300" height="300"/>
                </div>
                <div className="list__element">
                  <Image src="https://dummyimage.com/200/#ccc/fff" alt="popup_img" width="300" height="300"/>
                </div><div className="list__element">
                  <Image src="https://dummyimage.com/200/#ccc/fff" alt="popup_img" width="300" height="300"/>
                </div>
                <div className="list__element">
                  <Image src="https://dummyimage.com/200/#ccc/fff" alt="popup_img" width="300" height="300"/>
                </div>
                <div className="list__element">
                  <Image src="https://dummyimage.com/200/#ccc/fff" alt="popup_img" width="300" height="300"/>
                </div>
              </div>
      </>
  );

}

export default UploadedImageList;
