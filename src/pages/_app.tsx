import type { AppProps } from 'next/app'
import '../styles/app.scss'
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NavBottom from "components/nav/NavBottom"; //just for mobile
import Alert from "components/overlay/Alert";
import { NetworkService } from 'services/Networks';
import { localStorageService, LocalStorageVars } from 'services/LocalStorage';

import { GlobalState, store } from "pages";
import { FetchDefaultNetwork } from "pages/Common/data";

export default MyApp;

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [authorized, setAuthorized] = useState(false);
    const [logged, setLogged] = useState(false);

    useEffect(() => {
        // on initial load - run auth check
        authCheck(router.asPath);

        // load the default network and make it available globally
        store.emit(new FetchDefaultNetwork());

        // on route change start - hide page content by setting authorized to false
        const hideContent = () => setAuthorized(false);
        router.events.on('routeChangeStart', hideContent);

        // on route change complete - run auth check
        router.events.on('routeChangeComplete', authCheck);
        
        // unsubscribe from events in useEffect return function
        return () => {
            router.events.off('routeChangeStart', hideContent);
            router.events.off('routeChangeComplete', authCheck);
        }


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function authCheck(url) {
        // redirect to login page if accessing a private page and not logged in
        const token =  localStorageService.read(LocalStorageVars.ACCESS_TOKEN);
        const publicPaths = ['/Login', '/Signup', '/RepositoryPage', '/Faqs', '/', '/ButtonNew', '/Explore', '/HomeInfo'];
        const path = url.split('?')[0];

        if (token) {
           setLogged(true);
         }
        else {
          setLogged(false);
        }

        if (!token && !publicPaths.includes(path)) {
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
                <title>Helpbuttons.org</title>
                {/* eslint-disable-next-line @next/next/no-css-tags */}
            </Head>

            <div className={`${user ? '' : ''}`}>

                {authorized &&

                    <Component {...pageProps} />

                }
                <Alert />
                <NavBottom logged={logged} />
            </div>

        </>
    );
}
