import { map, tap, take, catchError } from 'rxjs/operators';

import { ButtonService } from 'services/Buttons';
import { IButton } from 'services/Buttons/types';
import { alertService }  from 'services/Alert/index.ts';


 export function GetButtonsEvent (setButtons) {

   // Anything in here is fired on component mount.
   let btns = ButtonService.find().subscribe(buttons => {

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
