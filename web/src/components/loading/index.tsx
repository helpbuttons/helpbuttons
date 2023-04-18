import t from "i18n";


export function LoadabledComponent({children, loading, ...props}) {
    return (
      <>
      {loading ? 
        <Loading/> :
        <>{children}</>
      }
      
      </>
    )
  }

export default function Loading() {
    return (
        <>
        <div className="loading__"></div>
    </>
    )
}