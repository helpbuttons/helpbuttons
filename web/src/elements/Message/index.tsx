import { useEffect, useRef } from 'react';
const userPattern = /@[\w]+/gi;
export function formatMessage(text) {
  const aRef = useRef();
  const content = linkify(text);

  useEffect(() => {
    if (aRef == null) return;
    aRef.current.innerHTML = content;
  }, [aRef, content]);
  return <div ref={aRef} />;
}

function linkify(text) {
  var urlPattern =
    /(?:https?:)?\/\/(?:(?:[\w-]+\.)+[\w/#@~.-]*)(?:\?(?:[\w&=.!,;$#%-]+)?)?/gi;

  
  text = text.replace(userPattern, function (user) {
    return (
      '<a href="/Profile/' + user.substring(1) + '">' + user + '</a>'
    );
  });
  return (text || '').replace(urlPattern, function (url) {
    return '<a href="' + url + '">' + url + '</a>';
  });
}

export function mentionsOfMessage(message) {
  const matches = message.match(userPattern)
  if(!matches)
  {
    return []
  }
  return matches.map((user) => user.substring(1))
}
