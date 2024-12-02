import t from "i18n";
import { useRouter } from "next/router";
import { store } from "state";
import { useEffect } from "react";
import { alertService } from "services/Alert";
import { UnsubscribeMails } from "state/Users";

export default function Unsubscribe() {
    const router = useRouter();
    const email = router.query.email as string;
    useEffect(() => {
        if(email)
        {
            store.emit(new UnsubscribeMails(email, () => {alertService.info(t('user.unsubscribed'))}))
            router.push('/HomeInfo')
        }
        
    }, [email])
    return (<>unsubscribe me {email}</>)
}