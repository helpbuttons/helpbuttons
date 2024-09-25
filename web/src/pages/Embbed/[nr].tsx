import CardButtonList from 'components/list/CardButtonList';
import Loading from 'components/loading';
import router from 'next/router';
import {  store } from 'pages';
import { useEffect, useRef, useState } from 'react';
import { useButtonTypes } from 'shared/buttonTypes';
import { FindEmbbedButtons } from 'state/Button';

export default function Embbed() {
  const buttonTypes = useButtonTypes();
  const init = useRef(null)
  const containerRef = useRef(null)
  const page = useRef(0)
  const [take, setTake] = useState(null);
  const [buttons, setButtons] = useState([])
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0
  }

  useEffect(() => {
    if(router?.query?.nr)
    {
      setTake(() => parseInt(router.query.nr as string))
    }
    
  }, [router.query.nr])

  const callbackFunction = () => {
      if((page.current*take) > buttons.length){
        return;
      }
      store.emit(new FindEmbbedButtons(page.current, take, 0, (buttons) => {
        setButtons((prevButtons) => buttons)
      }));
      page.current = page.current + 1

  }
  useEffect(() => {
    if(take)
    {
      callbackFunction()
    }
  }, [take]);

  return (
    <>
      {!buttonTypes || !buttonTypes.length && <Loading/>}
      
      {buttonTypes?.length > 0 && (
          <>{buttons.map((btn, i) => (
              <CardButtonList
                button={btn}
                key={i}
                buttonTypes={buttonTypes}
                showMap={false}
                linkToPopup={false}
                linkIframe={true}
              />
            ))}
          </>
      )}
    </>
  );
}
