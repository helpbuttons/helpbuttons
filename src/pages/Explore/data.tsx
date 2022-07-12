import { map, tap, take, catchError } from 'rxjs/operators';

import { ButtonService } from 'services/Buttons';
import { localStorageService } from 'services/LocalStorage';


 export function GetButtonsEvent (setButtons) {
   const networkId = localStorageService.read("network_id");
   if (!networkId)
   {
    return [];
   }
   // Anything in here is fired on component mount.
   let btns = ButtonService.find(networkId).subscribe(buttons => {

     if (buttons) {
           // add message to local state if not empty
           setButtons({ btns: [buttons.response] });
       } else {
           // clear messages when empty message received
           setButtons({ btns: [] });
       }

   });
   return () => {
       // Anything in here is fired on component unmount.
       btns.unsubscribe();
   }

 }
