import { useEffect, useRef } from 'react';
import { userPattern } from 'shared/types/message.helper';


export function TextFormatted ({text}) {

  return  (
    <>
      {formatMessage(text)}
    </>
  )

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
