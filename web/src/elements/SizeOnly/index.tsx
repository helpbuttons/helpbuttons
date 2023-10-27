import React, {useEffect, useState} from "react";

export const ShowMobileOnly = ({children}) => {
    const [width, setWidth] = useState(100);
    const handleWindowSizeChange = () => {
            setWidth(window.innerWidth);
    }

    useEffect(() => {
        setWidth(window.innerWidth)
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    if((width <  1280))
    {
        return <>{children}</>
    }
    return ;
}


export const ShowDesktopOnly = ({children}) => {
    const [width, setWidth] = useState(1000);
    const handleWindowSizeChange = () => {
            setWidth(window.innerWidth);
    }

    useEffect(() => {
        setWidth(window.innerWidth)
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    if((width >=  1280))
    {
        return <>{children}</>
    }
    return ;
}


/* Example */

/*
<ShowMobileOnly>
im am mobile only

</ShowMobileOnly>
<ShowDesktopOnly>
im am desktop only

</ShowDesktopOnly>
*/