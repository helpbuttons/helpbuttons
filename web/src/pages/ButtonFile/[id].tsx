import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { NextPageContext } from 'next'
import { setMetadata } from 'services/ServerProps'
import t from 'i18n'
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

export const getServerSideProps = async (ctx: NextPageContext) => {
  return setMetadata(t('seo.buttonEdit'), ctx);
};