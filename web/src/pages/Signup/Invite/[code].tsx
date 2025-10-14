import { useRouter } from "next/router";

export default function Invite( {metadata})
{
    const router = useRouter();
    const code = router.query.code as string;
    
    router.push(`/Signup/Invite/?code=${code}`)
}