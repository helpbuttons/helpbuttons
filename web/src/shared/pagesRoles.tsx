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
            '/Show/:btn',
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
            '/HomeInfo',
            '/Embbed/:number'
        ]
    },
    {
        role: Role.registered,
        paths: [
            '/Profile',
            '/Activity',
            '/ProfileEdit',
            '/ButtonEdit/:id',
            '/ProfileDelete'
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