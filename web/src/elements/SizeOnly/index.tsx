import Popup from "components/popup/Popup";
import React, {useEffect, useState} from "react";

export const ShowMobileOnly = ({children}) => {
    const width = useWindowWith();

    if((width <  1280))
    {
        return <>{children}</>
    }
    return ;
}

export const useIsMobile = () => {
    const width = useWindowWith();
    if((width <  1280)){
        return true;
    }
    return false;
}
const useWindowWith = () => {
    const [width, setWidth] = useState(1024)
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
    return width;
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


export const MobileOnlyPopup = (props) => {
    const {children} = props;
    return (<>    
    <ShowMobileOnly>
        <Popup {...props} linkFwd={'/Explore'}>
            {children}
        </Popup>
    </ShowMobileOnly>
        <ShowDesktopOnly>
            {children}
        </ShowDesktopOnly>
    </>
    )
}