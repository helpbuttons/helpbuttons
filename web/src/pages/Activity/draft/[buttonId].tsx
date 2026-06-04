import ActivitiesUser from "components/feed/Activities/Activity"
import { useRouter } from "next/router"
import { useEffect, useRef } from "react"
import { GlobalState, store, useGlobalStore } from "state"
import { FindActivityDetails, SetDraftButton } from "state/Activity"
import { FindButton } from "state/Explore"

export default function ActivityDraft() {
    const router = useRouter()
    const sessionUser = useGlobalStore((state: GlobalState) => state.sessionUser);
    const draftButton = useGlobalStore(
        (state: GlobalState) => state.activities.draftButton,
      );
    const redirecting = useRef(false);
    useEffect(() => {
        if(redirecting.current){
          return;
        }
        redirecting.current = true
        // first check if button has an activity open
        store.emit(new FindActivityDetails(router.query.buttonId, sessionUser.id, 0, (_activities) => {
            if(_activities.length > 0){
                router.push(`/Activity/${_activities[0].id}`)
            }else{
                store.emit(
                    new FindButton(
                        router.query.buttonId as string,
                      (buttonFetched) => {
                        store.emit(new SetDraftButton(buttonFetched))
                      }
                    ),
                  );
            }
        }))
        
      }, [router.isReady])
    
    return <>{draftButton && <ActivitiesUser draft={true}/>}</>
}