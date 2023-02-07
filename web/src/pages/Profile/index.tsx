import router from "next/router";
import { GlobalState, store } from "pages";
import { useEffect } from "react";
import { User } from "shared/entities/user.entity";
import { useRef } from "store/Store";

export default function ProfileRedirect() {
    const currentUser : User= useRef(
        store,
        (state: GlobalState) => state.loggedInUser
      );
      
    useEffect(() => {
        if (currentUser){
            console.log(currentUser)
            router.push({
                pathname: `/Profile/${currentUser.username}`
              });
        }
        
    }, [currentUser])
   return (<>
   
   </>);
}
