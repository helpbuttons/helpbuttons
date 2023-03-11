///Accordion section component for displaying long section data
import React, {useState} from "react";


export default function DebugToJSON({
    data
}) {

    return (
        <>
        <pre>
          {JSON.stringify(data, null, 4)}
          </pre>
        </>

    );
}
