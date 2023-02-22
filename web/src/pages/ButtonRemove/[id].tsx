import router from "next/router";
import { store } from "pages";
import { useEffect, useState } from "react";
import { alertService } from "services/Alert";
import { ButtonDelete } from "state/Explore";

export default function ButtonFile() {
    // const [buttonId, setId] = useState("");
    const buttonId = router.query.id as string;
    useEffect(() => {
        // setId()
        // console.log(buttonId);
        if(buttonId) {
            store.emit(new ButtonDelete(buttonId, () => {
                alertService.success('Scucceful removing the button')
                router.push('/Explore')
            },(error) => {
                // console.log(error)
                alertService.error('could not remove button')
                router.push('/Explore')
            }),
            )    
        }
        
        
    }, [buttonId])
    

    return (
        <>
        removing {buttonId}
        </>

    )
}
