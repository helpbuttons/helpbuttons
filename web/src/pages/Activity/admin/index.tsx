import ActivitiesUser from "components/feed/Activities/Activity";
import { GroupMessageType } from "shared/types/group-message.enum";

export default function ActivityAdmin() {
    return <ActivitiesUser selectedGroupMessageType={GroupMessageType.admin} />;
}