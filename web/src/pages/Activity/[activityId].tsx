import ActivitiesUser from "components/feed/Activities/Activity";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ActivityPage() {
  const router = useRouter();
  const [activityId, setActivityId] = useState(null)
  useEffect(() => {
    if(!router.isReady){
      return;
    }
    setActivityId(() => router.query.activityId as string)

  }, [router.query.activityId])
  
  return <ActivitiesUser activityId={activityId} />;
}