import Loading from "components/loading";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { store } from "state";
import { SetFocusOnMessage } from "state/Activity";
import { FindAndSetMainPopupCurrentButton } from "state/HomeInfo";

export default function Show({
    metadata
}) {

    const router = useRouter();

    const { messageId, buttonId } = router.query;

    useEffect(() => {
        if (messageId) {
            store.emit(new SetFocusOnMessage(messageId))
        }
        if(buttonId)
        {
            router.push(`/Explore/0/0/0/${buttonId}`, undefined, { shallow: true });
        }
    }, [buttonId,messageId])
    return <></>
}