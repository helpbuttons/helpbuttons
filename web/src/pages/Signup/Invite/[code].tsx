//Form component with the main fields for signup in the platform
//imported from libraries
import React from 'react';
import router from 'next/router';

export default function Invite() {
  
  const code = router.query.code as string;

  router.push(`/Signup?inviteCode=${code}`);
  return (
    <>
      redirecting...
    </>
    
  );
}
