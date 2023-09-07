import router from "next/router";

export default function Unsubscribe() {
    const email = router.query.email as string;
    return (<>unsubscribe me {email}</>)
}