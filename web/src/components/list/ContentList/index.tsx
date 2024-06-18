///button marker over the map
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import router from 'next/router';

import CardButtonList from 'components/list/CardButtonList';
import t from 'i18n';
import Btn, { ContentAlignment } from 'elements/Btn';

export default function ContentList({
  buttons,
  buttonTypes,
  showMap = false,
  linkToPopup = true,
  ...props
}) {
  const containerRef = useRef(null)
  const [ isVisible, setIsVisible ] = useState(false)
  const [buttonsSlice, setButtonsSlice] = useState(2)

  const callbackFunction = (entries) => {
    const [ entry ] = entries
    setIsVisible(() => entry.isIntersecting)

    if(isVisible  && buttonsSlice < buttons.length)
    {
      setButtonsSlice(() => buttonsSlice + 2)
    }
  }
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0
  }

  useEffect(() => {
    const observer = new IntersectionObserver(callbackFunction, options)
    if (containerRef.current) observer.observe(containerRef.current)
    
    return () => {
      if(containerRef.current) observer.unobserve(containerRef.current)
    }
  }, [containerRef, options])

  if (buttons.length < 1) {
    return (
      <>
        <div className="list__empty-message">
          <div className="list__empty-message--prev">
            {t('explore.noResults')}
          </div>
          <div className="list__empty-message--comment">
            {t('explore.emptyList')}
          </div>
          <Btn
            caption={t('explore.createEmpty')}
            onClick={() => router.push('/ButtonNew')}
            contentAlignment={ContentAlignment.center}
          />
        </div>
      </>
    );
  }

  return (
    <>{buttons.slice(0,buttonsSlice).map((btn, i) => (
        <CardButtonList
          button={btn}
          key={i}
          buttonTypes={buttonTypes}
          showMap={showMap}
          linkToPopup={linkToPopup}
        />
      ))}
     <div ref={containerRef}></div>
    </>
  );
}
