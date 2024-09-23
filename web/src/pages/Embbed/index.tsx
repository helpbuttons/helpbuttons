import CardButtonList from 'components/list/CardButtonList';
import {  store } from 'pages';
import { useEffect, useRef, useState } from 'react';
import { useButtonTypes } from 'shared/buttonTypes';
import { FindEmbbedButtons } from 'state/Button';

export default function Embbed() {
  const buttonTypes = useButtonTypes();
  const init = useRef(null)
  const containerRef = useRef(null)
  const page = useRef(0)
  const take = 2;
  const [buttons, setButtons] = useState([])
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0
  }
  const callbackFunction = (entries) => {
    const [ entry ] = entries
      if((page.current*take) > buttons.length){
        return;
      }
      console.log('emitting..' , page, take)
      store.emit(new FindEmbbedButtons(page.current, take, 0, (buttons) => {
        setButtons((prevButtons) => [...prevButtons, ...buttons])
      }));
      page.current = page.current + 1

  }
  useEffect(() => {
    if(!init.current)
    {
      init.current = true;
      callbackFunction([])
    }
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(callbackFunction, options)
    if (containerRef.current) observer.observe(containerRef.current)
    
    return () => {
      if(containerRef.current) observer.unobserve(containerRef.current)
    }
  }, [containerRef, options])

  return (
    <>
      {buttonTypes?.length > 0 && (
          <>{buttons.map((btn, i) => (
              <CardButtonList
                button={btn}
                key={i}
                buttonTypes={buttonTypes}
                showMap={false}
                linkToPopup={false}
              />
            ))}
           <div ref={containerRef}></div>
          </>
      )}
    </>
  );
}

