import { useEffect, useRef, useState } from 'react';
import { userPattern } from 'shared/types/message.helper';


export function TextFormatted ({text}) {

  const [isExpanded, setIsExpanded] = useState(false); 
  const maxLength = 200; 

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  const isLongText = text.length > maxLength;

  return (
    <>
      {isExpanded ? (
        <div>
          {formatMessage(text)}
          {isLongText && <button onClick={toggleExpanded}>See Less</button>}
        </div>
      ) : (
        <div>
          {formatMessage(text.slice(0, maxLength))}
          {isLongText && (
            <>
              ... <button onClick={toggleExpanded}>See More</button>
              <Btn
                      btnType={BtnType.corporative}
                      iconLink={<IoSaveOutline />}
                      iconLeft={IconType.circle}
                      contentAlignment={ContentAlignment.center}
                      onClick={() => toggleExpanded()}
             />
            </>
          )}        
          </div>
      )}
    </>
  );

}

export function formatMessage(text, mentions = []) {
  const aRef = useRef();
  const content = linkify(text, mentions);

  useEffect(() => {
    if (aRef == null) return;
    aRef.current.innerHTML = content;
  }, [aRef, content]);
  return <div ref={aRef} />;
}

function linkify(text, mentions) {
  var urlPattern =
    /(?:https?:)?\/\/(?:(?:[\w-]+\.)+[\w/#@~.-]*)(?:\?(?:[\w&=.!,;$#%-]+)?)?/gi;

  
  text = text.replace(userPattern, function (atUsername) {
    const username = atUsername.substring(1)
    const user = mentions.find((mentionUser) => mentionUser.username == username)
    const name = user ? user.name :  atUsername
    return (
      `<a href="/p/${username}">${name}</a>`
    );
  });
  return (text || '').replace(urlPattern, function (url) {
    return '<a href="' + url + '">' + url + '</a>';
  });
}
