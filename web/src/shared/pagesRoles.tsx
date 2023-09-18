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
            '/HomeInfo',
            '/ButtonFile/:id',
            '/LoginClick',
            '/LoginClick/:loginToken',
            '/Profile/:username',
            '/Unsubscribe'
        ]
    },
    {
        role: Role.registered,
        paths: [
            '/Profile',
            '/Activity'
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