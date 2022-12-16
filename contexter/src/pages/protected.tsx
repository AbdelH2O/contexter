import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";

const ProtectedLayout = ({ children }: { children: JSX.Element }) => {
    const { data: session } = useSession();
    const router = useRouter();
    useEffect(() => {
        if(session === undefined) return;
        if(!session && router.pathname !== "/") {
            router.push("/");
        } else if(session && session.user?.name && router.pathname === "/") {
            router.push("/app");
        }
    }, [session])
    return (
        <>
            <ToastContainer />
            {children}
        </>
    );
};

export default ProtectedLayout;