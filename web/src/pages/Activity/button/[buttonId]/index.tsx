import Loading from "components/loading";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { GlobalState, store, useGlobalStore } from "state";
import { FindLatestActivities } from "state/Activity";

export default function ActivityButton() {
    const router = useRouter();
    const { buttonId } = router.query;

    const userButtonActivities = useGlobalStore((state: GlobalState) => state.activities.buttons)
    useEffect(() => {
        const activity = userButtonActivities.find((activity) => activity.buttonId == buttonId)
        if(activity)
        {
            router.push(`/Activity/${activity.id}`)
        }
    }, [userButtonActivities])
    useEffect(() => {
        store.emit(new FindLatestActivities())
    }, [])
    return <><Loading/></>;
}