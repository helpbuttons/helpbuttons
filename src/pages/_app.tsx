import type { AppProps } from 'next/app'
import '../styles/app.scss'
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { userObs } from 'services/Users';
import NavBottom from 'components/nav/NavBottom';
import Alert from 'components/overlay/Alert';

export default MyApp;

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // on initial load - run auth check
        authCheck(router.asPath);

        // on route change start - hide page content by setting authorized to false
        const hideContent = () => setAuthorized(false);
        router.events.on('routeChangeStart', hideContent);

        // on route change complete - run auth check
        router.events.on('routeChangeComplete', authCheck)

        // unsubscribe from events in useEffect return function
        return () => {
            router.events.off('routeChangeStart', hideContent);
            router.events.off('routeChangeComplete', authCheck);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function authCheck(url) {
        // redirect to login page if accessing a private page and not logged in
        setUser(userObs.userValue);
        const publicPaths = ['/Login', '/Signup'];
        const path = url.split('?')[0];
        if (!userObs.userValue && !publicPaths.includes(path)) {
            setAuthorized(false);
            router.push({
                pathname: '/Login',
                query: { returnUrl: router.asPath }
            });
        } else {
            setAuthorized(true);
        }
    }

    return (
        <>
            <Head>
                <title>Next.js 11 - User Registration and Login Example</title>
                {/* eslint-disable-next-line @next/next/no-css-tags */}
            </Head>

            <div className={`${user ? '' : ''}`}>
                <NavBottom />
                <Alert />
                {authorized &&
                    <Component {...pageProps} />
                }
            </div>
        </>
    );
}
