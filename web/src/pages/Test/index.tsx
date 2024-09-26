import { getIframe } from "components/share/embbed";

export default function Test(){
    return (<div dangerouslySetInnerHTML={{ __html: getIframe() }} />)
}