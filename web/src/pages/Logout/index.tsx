import { store } from "state";
import { useEffect } from "react"
import { UserService } from "services/Users";
import { SessionUserLogout } from "state/Profile";

export default function Logout()
{
    
    useEffect(() => {
        UserService.logout();
        store.emit(new SessionUserLogout());
    }, [])

    return (<></>)
}