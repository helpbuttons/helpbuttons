import { useEffect, useRef } from 'react';

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

  return (text || '').replace(urlPattern, function (url) {
    return '<a href="' + url + '">' + url + '</a>';
  });
}
