import { Role } from "shared/types/roles";

export const allowedPathsPerRole =
[
    {
        role: Role.guest,
        paths: [
            '/Login',
            '/Signup',
            '/RepositoryPage',
            '/Faqs',
            '/',
            '/ButtonNew',
            '/Explore',
            '/HomeInfo',
            '/ButtonFile/:id',
        ]
    },
    // {
    //     role: Role.registered,
    //     paths: []
    // },
    {
        role: Role.admin,
        paths:

        [
            '/Configuration'
        ]
    }
]