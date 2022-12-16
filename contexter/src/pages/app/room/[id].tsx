import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Arrow, Send } from "../../../components/icons";
import supabase from "../../../utils/supabase";
import 'react-toastify/dist/ReactToastify.css';
import Context from "../../../components/Context";

enum Direction {
    Left = 'left',
    Right = 'right',
}

type Message = {
    id: string;
    message: string;
    sender: string;
    timestamp: string;
};

type RawMessage = {
    id: string;
    user: string;
    message: string;
    room: string;
    created_at: string;
}

type User = {
    id: string;
    name: string;
    personality: string;
    gender: string;
}

const Room = () => {
    const router = useRouter();
    const session = useSession();
    const { id } = router.query;
    const [messages, setMessages] = useState<Message[]>([]);
    const [fetched, setFetched] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [message, setMessage] = useState<string>('');
    const [scene, setScene] = useState<string>('');
    const [showContext, setShowContext] = useState<boolean>(false);
    const [users, setUsers] = useState<{ receipient: User, user: User }>({
        receipient: { id:'', name: '', personality: '', gender: '' },
        user: { id:'', name: '', personality: '', gender: '' }
    });
    // const ref = useRef<HTMLDivElement>(null);
    const [ref, setRef] = useState<HTMLDivElement>();
    const onRefChange = useCallback((node: HTMLDivElement) => {
        if (node !== null) { 
            setRef(node);
            node.scrollTo(0, node.scrollHeight);
        }
    }, []);
    
    useEffect(() => {
        const getChat = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('rooms')
                .select(`
                    *,
                    name1(*),
                    name2(*),
                    messages(*),
                    scene(*)
                `)
                .eq('id', id);
            if(error) {
                toast.error("Error getting chat");
                // router.push("/app");
            } else {
                setUsers({
                    receipient: data[0].name1.id === session.data?.user?.id ? 
                        {
                            id: data[0].name2.id,
                            name: data[0].name2.name,
                            personality: data[0].name2.personality,
                            gender: data[0].name2.gender
                        } : 
                        {
                            id: data[0].name1.id,
                            name: data[0].name1.name,
                            personality: data[0].name1.personality,
                            gender: data[0].name1.gender
                        },
                        user: data[0].name2.id === session.data?.user?.id ? 
                        {
                            id: data[0].name2.id,
                            name: data[0].name2.name,
                            personality: data[0].name2.personality,
                            gender: data[0].name2.gender
                        } : 
                        {
                            id: data[0].name1.id,
                            name: data[0].name1.name,
                            personality: data[0].name1.personality,
                            gender: data[0].name1.gender
                        },
                });
                setScene(data[0].scene.context + data[0].scene.scene);
                const messages = data[0].messages.map((message: RawMessage) => {
                    return {
                        id: message.id,
                        message: message.message,
                        sender: message.user,
                        timestamp: message.created_at,
                    }
                });
                setMessages(messages);
            }
            setLoading(false);
            setFetched(true);
            if(ref)
                ref.scrollTo(0, ref.scrollHeight);
        }
        if(id !== undefined) {
            !fetched && getChat();
            const sub = supabase
                .channel('value-db-changes')
                .on('postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'messages',
                        filter: `room=eq.${id}`
                    },
                    (payload) => {
                        console.log(payload);
                        const message = payload.new as RawMessage;
                        setMessages(old => [...old, {
                            id: message.id,
                            message: message.message,
                            sender: message.user,
                            timestamp: message.created_at,
                        }]);
                        if(ref){
                            ref.scrollTo(0, ref.scrollHeight);
                            console.log(ref.scrollTop);
                            
                        }
                    }
                ).subscribe();
        }
    }, [id, session.data?.user?.id, ref]);

    if(loading || users.user.name === ''){
        return (
            <div className="h-screen w-screen flex justify-center items-center">
                <div className="lds-heart"><div></div></div>
            </div>
        )
    }

    const handleSendMessage: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
        const { error } = await supabase
            .from('messages')
            .insert({
                message: e.currentTarget.value,
                room: id,
                user: session.data?.user?.id,
            });
        if(error) {            
            toast.error("Error sending message");
        } else {
            setMessage('');
        }

    }
    // command on MacOS to find process running on port 3000 and kill it
    // lsof -i tcp:3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
    
    return (
        <>
            <Context
                setShowContext={setShowContext}
                showContext={showContext}
                scene={scene}
            />
            <div className="h-screen w-screen grid grid-cols-1 grid-rows-[8vh_84vh_8vh]">
                <div className="bg-rose-600 flex flex-row items-center">
                    <ToastContainer />
                    <div className="flex flex-row items-center h-full flex-grow">
                        <Arrow
                            direction={Direction.Left}
                            width={50}
                            height={50}
                            onClick={() => router.push("/app")}
                            color="#e2e8f0"
                        />
                        <div className="bg-rose-100 rounded-full h-fit overflow-hidden">
                            <Image
                                src={`https://avatars.dicebear.com/api/micah/${users.receipient.name}.svg`}
                                alt="receipient pfp"
                                width={50}
                                height={50}
                            />
                        </div>
                        <div className="flex flex-col ml-4">
                            <h1 className="text-white text-2xl font-Poppins font-bold">{users.receipient.name}</h1>
                            <div className="flex flex-row items-center">
                                <div className="bg-green-500 rounded-full h-2 w-2">
                                </div>
                                <h1 className="text-green-100 text-sm ml-2 font-Poppins font-normal">Online</h1>
                            </div>
                        </div>
                    </div>
                    <div className="w-28 h-full flex items-center">
                        <button onClick={() => setShowContext(true)} className="h-2/3 w-full rounded-xl bg-rose-900 mr-3 flex items-center justify-center text-white font-bold font-Poppins px-2">
                            Context
                        </button>
                    </div>
                </div>
                <div className="mx-2 overflow-scroll" ref={onRefChange}>
                    <div className="w-full h-fit mt-2">
                        <div className="h-full w-full overflow-y-auto">
                            <div className="flex flex-col items-center">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="bg-rose-100 rounded-full h-fit overflow-hidden">
                                        <Image
                                            src={`https://avatars.dicebear.com/api/micah/${users.receipient.name}.svg`}
                                            alt="receipient pfp"
                                            width={150}
                                            height={150}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <h1 className="text-2xl font-Poppins font-bold">{users.receipient.name}</h1>
                                    </div>
                                    <div>
                                        <h1 className="text-lg font-Poppins font-normal">{users.receipient.personality}</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-4/5 border-b-2 my-2 border-rose-100 mx-auto"></div>
                    {
                        messages.map((message, index) => {
                            if(message.sender === users.user.id){
                                let roundedTopRight = true; 
                                let roundedBottomRight = true; 
                                if(index > 0){
                                    const prevMessage = messages[index-1];                                
                                    if(prevMessage?.sender === users.user.id){
                                        roundedTopRight = false;
                                    }
                                }
                                if(index < messages.length - 1){
                                    const nextMessage = messages[index+1];
                                    if(nextMessage?.sender === users.user.id){
                                        roundedBottomRight = false;
                                    }
                                }
                                return (
                                    <div key={index} className="flex flex-row items-center justify-end mt-1">
                                        <div
                                            className={`bg-rose-600 rounded-3xl p-4 py-2`}
                                            style={{
                                                borderTopRightRadius: roundedTopRight ? '1.5rem' : '0.5rem',
                                                borderBottomRightRadius: roundedBottomRight ? '1.5rem' : '0.5rem',
                                            }}
                                        >
                                            <h1 className="text-white text-lg font-Poppins font-normal">{message.message}</h1>
                                        </div>
                                    </div>
                                )
                            }
                            let roundedTopLeft = true;
                            let roundedBottomLeft = true;
                            if(index > 0){
                                const prevMessage = messages[index-1];                            
                                if(prevMessage?.sender === users.receipient.id){
                                    roundedTopLeft = false;
                                }
                            }
                            if(index < messages.length - 1){
                                const nextMessage = messages[index+1];
                                if(nextMessage?.sender === users.receipient.id){
                                    roundedBottomLeft = false;
                                }
                            }
                            return (
                                <div key={index} className="flex flex-row items-center mt-1">
                                    <div className="rounded-full h-[44px] w-[44px] overflow-hidden" style={{
                                        backgroundColor: roundedTopLeft ? '#ffe4e6' : 'transparent',
                                    }}>
                                        {
                                            roundedTopLeft &&
                                            (<Image
                                                src={`https://avatars.dicebear.com/api/micah/${users.receipient.name}.svg`}
                                                alt="receipient pfp"
                                                width={44}
                                                height={44}
                                            />)
                                        }
                                    </div>
                                    <div className="flex flex-col ml-2">
                                        <div
                                            className={`flex flex-row items-center bg-rose-100 p-4 py-2 rounded-3xl`}
                                            style={{
                                                borderTopLeftRadius: roundedTopLeft ? '1.5rem' : '0.5rem',
                                                borderBottomLeftRadius: roundedBottomLeft ? '1.5rem' : '0.5rem',
                                            }}
                                        >
                                            <h1 className="text-rose-800 text-lg font-Poppins font-normal">{message.message}</h1>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="m-2 flex flex-row">
                    <input onChange={(e) => setMessage(e.target.value)} value={message} type="text" className="flex-grow h-full p-2 focus:outline-rose-500 rounded-xl border-2 border-gray-200 my-auto"></input>
                    <button disabled={message === ''} value={message} onClick={handleSendMessage} style={{opacity: message === '' ? 0.7 : 1}} className="bg-rose-600 rounded-xl px-3 w-[8vh] h-[6vh] ml-2 flex justify-center items-center">
                        <p className="text-white font-Poppins font-bold select-none">
                            Send
                        </p>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Room;