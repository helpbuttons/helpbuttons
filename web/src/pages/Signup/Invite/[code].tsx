//Form component with the main fields for signup in the platform
//imported from libraries
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Invite() {
  const router = useRouter();

  useEffect(() => {
    if(!router.isReady){
      return;
    }
    const code = router.query.code as string;
    router.push(`/Signup?inviteCode=${code}`);
  }, [router.isReady])

  return (
    <>
      redirecting...
    </>
    
  );
}
