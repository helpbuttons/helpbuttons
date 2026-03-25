import ActivitiesUser from "components/feed/Activities/Activity"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { store } from "state"
import { SetDraftButton } from "state/Activity"
import { FindButton } from "state/Explore"

export default function ActivityDraft() {
    const router = useRouter()

    useEffect(() => {
        if(!router.isReady){
          return;
        }
        // first check if button has an activity open
        
        store.emit(
            new FindButton(
                router.query.buttonId as string,
              (buttonFetched) => {
                store.emit(new SetDraftButton(buttonFetched))
              }
            ),
          );
      }, [router.isReady])
    
    return <ActivitiesUser draft={true}/>
}