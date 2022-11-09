import * as React from "react";

function IoClose(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="1em"
      height="1em"
      {...props}
    >
      <path d="M42 43a1 1 0 01-.71-.29l-36-36a1 1 0 011.42-1.42l36 36a1 1 0 010 1.42A1 1 0 0142 43z" />
      <path d="M6 43a1 1 0 01-.71-.29 1 1 0 010-1.42l36-36a1 1 0 111.42 1.42l-36 36A1 1 0 016 43z" />
    </svg>
  );
}

export default IoClose;
