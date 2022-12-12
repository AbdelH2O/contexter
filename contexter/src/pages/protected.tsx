import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const ProtectedLayout = ({ children }: { children: JSX.Element }) => {
    const { data: session } = useSession();
    const router = useRouter();
    useEffect(() => {
        if(!session && router.pathname !== "/") {
            router.push("/");
        } else if(session && session.user?.name && router.pathname === "/") {
            router.push("/app");
        }
    }, [session])
    return (
        <>
            {children}
        </>
    );
};

export default ProtectedLayout;