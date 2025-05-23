import translate from "@src/shared/helpers/i18n.helper.js";
import { ActivityEventName } from "@src/shared/types/activity.list.js"
import { getUserActivity } from "./activity.transform.js";



interface RoleChangeAction {
    type: ActivityEventName.RoleUpdate;
    transform: (locale: string, activityOut: any, activity: any) => any;
    onEvent: (payload: any) =>  {user: any, addToDaily: boolean};
}

interface EndorsedAction {
    type: ActivityEventName.Endorsed;
    transform: (locale: string, activityOut: any, activity: any) => any;
    onEvent: (payload: any) => {user: any, payload: any, addToDaily: boolean};
}

interface RevokeEndorsedAction {
    type: ActivityEventName.RevokeEndorsed;
    transform: (locale: string, activityOut: any, activity: any) => any;
    onEvent: (payload: any) =>  {user: any, addToDaily: boolean};
}


const activitiesActions: ActivityAction[] = [
    {
        type: ActivityEventName.RoleUpdate,
        transform: (locale, activityOut, activity) => {
            const {role} = activity.data
            return {
                ...activityOut,
                message: '',
                title: translate(locale, 'activities.roleupdate', [role]),
                image: null,
            }
        },
        onEvent: (payload) =>  OnEventDefault(payload, false),
    },
    {
        type: ActivityEventName.Endorsed,
        transform: (locale, activityOut, activity) => {
            return {
                ...activityOut,
                message: '',
                title: translate(locale, 'activities.endorsed'),
                image: null,
              };
        },
        onEvent: (payload) =>  OnEventDefault(payload, false),
    },
    {
        type: ActivityEventName.RevokeEndorsed,
        transform: (locale, activityOut, activity) => {
            return {
                ...activityOut,
                message: '',
                title: translate(locale, 'activities.revokeEndorse'),
                image: null,
              };
        },
        onEvent: (payload) => OnEventDefault(payload, false),
    },
];

const OnEventDefault = (payload, addToDaily) => {
    const { user } = payload.data;
    return {user: user, payload: payload, addToDaily: addToDaily}
}
type ActivityAction = RoleChangeAction | EndorsedAction | RevokeEndorsedAction;
export const getAction = (activityEventName: ActivityEventName): ActivityAction => {
    return activitiesActionsMap.get(activityEventName)
}
const activitiesActionsMap = new Map<ActivityEventName, ActivityAction>(
    activitiesActions.map(action => [action.type, action])
);
