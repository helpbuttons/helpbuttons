export function LoadabledComponent({children, loading, ...props}) {
    if(loading)
    {
      return (<><Loading/></>)
    }
    return children
  }

export default function Loading() {
    return (<div className="loading__"></div>)
}

export function LoadingWrapper() {
  return (<span className='loading__wrapper'><Loading /></span>)
}
