import { useEffect } from 'react'
import { useRouter } from 'next/router'
export default function ButtonFile({
  metadata,
}) {
  const router = useRouter()
  useEffect(() => {
    if(router?.query?.id)
    {
      router.push(`/Explore/?btn=${router.query.id}`)
    }
    
  }, [router.query.id])
  
}