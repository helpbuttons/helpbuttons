import { Role } from "shared/types/roles";

export const allowedPathsPerRole =
[
    {
        role: Role.guest,
        paths: [
            '/Login',
            '/Signup',
            '/Faqs',
            '/',
            '/ButtonNew',
            '/Explore',
            '/Explore/:zoom/:lat/:lng',
            '/Explore/:zoom/:lat/:lng/:btn',
            '/',
            '/ButtonFile/:id',
            '/LoginClick',
            '/LoginClick/:loginToken',
            '/p/:username',
            '/Signup/Invite/:code',
            '/Unsubscribe',
            '/Error',
            '/Logout',
            '/HomeInfo'
        ]
    },
    {
        role: Role.registered,
        paths: [
            '/Profile',
            '/Activity',
            '/ProfileEdit',
            '/ButtonEdit/:id',
        ]
    },
    {
        role: Role.admin,
        paths:

        [
            '/Configuration'
        ]
    }
]