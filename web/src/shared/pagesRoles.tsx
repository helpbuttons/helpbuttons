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
            '/Show/:btn',
            '/Explore',
            '/Explore/:zoom/:lat/:lng',
            '/Explore/:zoom/:lat/:lng/:btn',
            '/',
            '/ButtonFile/:id',
            '/LoginClick',
            '/LoginClick/:loginToken',
            '/p/:username',
            '/Signup/Invite',
            '/Signup/Invite/:code',
            '/Unsubscribe',
            '/Error',
            '/Logout',
            '/HomeInfo',
            '/Embbed/:number',
            '/Show/:buttonId/:messageId'
        ]
    },
    {
        role: Role.registered,
        paths: [
            '/ButtonNew',
            '/Profile',
            '/Activity',
            '/Activity/:activityId',
            '/Activity/draft/:buttonId',
            '/Activity/admin',
            '/Activity/community',
            '/ProfileEdit',
            '/ButtonEdit/:id',
            '/ProfileDelete',
            '/Profile/Invites'
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