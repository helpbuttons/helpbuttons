import { useRouter } from 'next/router';
import { Link } from 'elements/Link';


type Props = {
    href: string
    exact?: boolean
} & React.ComponentProps<typeof Link>


export default function NavLink({ children, href, exact = false, ...props }: Props) {
    const { pathname } = useRouter();
    const isActive = exact ? pathname === href : pathname.startsWith(href);

    if (isActive) {
        props.className += ' active';
    }

    return <Link href={href} {...props}>{children}</Link>;
}
