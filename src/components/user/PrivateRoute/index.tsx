import React from 'react';
import { useRouter, Router } from 'next/router'

import { authenticationService } from '../../services/authentication.service.ts';

export const PrivateRoute = ({ component: Component, ...rest }) => (

    useEffect(() => {
       const {pathname} = Router
       if(pathname == '/' ){
           Router.push('/hello-nextjs')
       }
    })

    <useRouter {...rest} render={props => {
        const currentUser = authenticationService.currentUserValue;
        if (!currentUser) {
            // not logged in so redirect to login page with the return url
            return <Router to={{ pathname: '/login', state: { from: props.location } }} />
        }

        // authorised so return component
        return <Component {...props} />
    }} />
)
