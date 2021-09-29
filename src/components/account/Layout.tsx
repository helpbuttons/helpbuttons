import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { userService } from 'services';
import { userObs } from 'services/Users';

export { Layout };

function Layout({ children }) {
    const router = useRouter();

    useEffect(() => {
        // redirect to home if already logged in
        if (userObs.userValue) {
            router.push('/');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="">
            {children}
        </div>
    );
}
