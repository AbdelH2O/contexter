import { BrokenHeart, Heart, Arrow, Search, Loader } from "../../components/icons";
import Image from "next/image";
import { trpc } from "../../utils/trpc";
import supabase from "../../utils/supabase";
import client from "../../utils/redisClient";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useSession, getSession } from "next-auth/react";
import type { CtxOrReq } from "next-auth/client/_utils";
import Link from "next/link";

enum Direction {
  Left = 'left',
  Right = 'right',
}

type Chat = {
  id: string;
  name1: string;
  name2: string;
  lastMessage: {
    sender: string;
    message: string;
  };
}

export async function getServerSideProps (context: CtxOrReq) {
  const session = await getSession(context);
  try {
    await client.connect();
  } catch(err) {
    console.log(err);
  }
  if(!session || !session?.user?.name || session.user.gender === undefined) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }
  const inQueue = await client.ZSCAN(session.user.gender, 0);
  if(!inQueue || !inQueue.members) {
    return {
      props: {
        inQueue: -1,
      }
    }
  }
  for(let i = 0; i < inQueue.members.length; i++) {
    const mem = inQueue.members[i];
    if(!mem) continue;
    const member: { username: string } = JSON.parse(mem.value);
    if(member.username === session.user.id) {
      return {
        props: {
          inQueue: mem.score,
        }
      }
    }
  }
  return {
    props: {
      inQueue: -1,
    }
  }
}

const Home = ({ inQueue }: { inQueue: number }) => {  
  const [inn, setInn] = useState<boolean>(inQueue !== -1);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const joinQueueMutation = trpc.matchmaking.joinQueue.useMutation({
    onSuccess: () => {
      setInn(true);
      toast.success('Joined queue!');
    }
  });
  const session = useSession();
  supabase
    .channel('value-db-changes')
    .on('postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'rooms',
      },
      (payload) => {
        console.log(payload);
        toast.success('New chat!');
        setInn(false);
        const setNewChat = async () => {
          const { data, error } = await supabase
            .from('rooms')
            .select(`
              *,
              name1(*),
              name2(*)
            `)
            .eq('id', payload.new.id);
          if (error) {
            toast.error('Failed to fetch new chat! Please try again later.');
            return;
          }
          console.log({
            id: data[0].id,
            name1: data[0].name1.username,
            name2: data[0].name2.username,
            lastMessage: {
              sender: 'System',
              message: 'No messages yet',
            },
          });
          
          setChats((prev) => {
            return [
              ...prev,
              {
                id: data[0].id,
                name1: data[0].name1.name,
                name2: data[0].name2.name,
                lastMessage: {
                  sender: 'System',
                  message: 'No messages yet',
                },
              }
            ];
          });
        }
        setNewChat();
      }
    ).subscribe();

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('rooms')
        .select(`
          *,
          messages (
            *,
            user(*)
          ),
          name1(*),
          name2(*)
        `)
        .limit(1, { foreignTable: 'messages' })
        .or(`name1.eq.${session.data?.user?.id},name2.eq.${session.data?.user?.id}`);
      console.log(data);
      if (error) {
        toast.error('Failed to fetch chats! Please try again later.', {
          icon: {
            children: <BrokenHeart width={20} height={20} />,
            key: 'broken-heart',
            type: 'error',
            props: {
              theme: 'primary',
            },
          },
          className: 'font-Poppins text-red-700',
          progress: 0,
        });
      } else {
        setChats(data.map((chat) => {
          return {
            id: chat.id,
            name1: chat.name1.name,
            name2: chat.name2.name,
            lastMessage: {
              sender: chat.messages.length !== 0 ? chat.messages[0].user.name : 'System',
              message: chat.messages.length !== 0 ? chat.messages[0].message : 'No messages yet',
            },
          };
        }));
      }
      setLoading(false);
    };
    session.data?.user?.id !== undefined && fetchChats();
  }, [session.data?.user?.id]);

  if(loading) {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen">
          <div className="lds-heart animate-pulse">
            <div></div>
          </div>
        </div>
    )
  }

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="text-center font-Poppins font-bold text-4xl flex justify-between">
        <div className="flex flex-row-reverse items-center bg-rose-600 w-full py-2">
          <div className="absolute top-0 w-full mt-2">
            <p className="font-Poppins select-none font-black text-4xl mt-2 text-white bg-rose-600 w-fit mx-auto">Chats</p>
          </div>
          <div className="rounded-full overflow-hidden mr-4 bg-white right-0">
            <Image src={`https://avatars.dicebear.com/api/micah/${session.data?.user?.name}.svg`} alt="Contexter Logo" width={50} height={50} />
          </div>
        </div>
      </div>
      <div className="flex-grow max-w-xl mx-auto w-full px-2 flex flex-col justify-between">
        <div className="flex flex-col">
          <i className="absolute mt-[1.65rem] ml-3">
            <Search width={20} height={20} />
          </i>
          <input className="h-10 w-full flex-row flex items-center mt-4 pl-9 focus:outline-rose-500 shadow-md rounded-lg border border-gray-200 bg-gray-100">
          </input>
          {
            chats.length !== 0 && (
              chats.map((chat, index) => {
                const receipient = chat.name1 === session.data?.user?.name ? chat.name2 : chat.name1;
                return (
                  <Link key={index} href={`/app/room/${chat.id}`} passHref>
                    <div className="h-20 cursor-pointer w-full flex-row flex items-center mt-4 shadow-md rounded-lg border border-rose-200 bg-rose-50">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-white ml-2">
                        <Image src={`https://avatars.dicebear.com/api/micah/${receipient}.svg`} alt="Profile Picture" width={100} height={100} />
                      </div>
                      <div className="flex flex-col flex-grow ml-4">
                        <p className="font-Poppins text-red-700 font-bold">{receipient}</p>
                        <p className="font-Lato text-gray-500 opacity-60">
                          {
                            chat.lastMessage.sender === 'System' ?
                            'System' : 
                            (chat.lastMessage.sender === receipient ?
                            receipient :
                            "You")
                          }: {chat.lastMessage.message}
                        </p>
                      </div>
                      <div className="mr-2">
                        <Arrow width={40} height={40} color={"#64748b"} direction={Direction.Right}/>
                      </div>
                    </div>
                  </Link>
                )
              })
            )
          }
        </div>
        {
          chats.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full my-auto select-none">
                <BrokenHeart height={100} width={100} />
                <p className="font-Poppins text-2xl text-gray-500">No chats yet!</p>
                <p className="font-Lato text-gray-500">Join a queue to start chatting!</p>
              </div>
          )
        }
        <div onClick={() => inQueue === -1 && joinQueueMutation.mutate()} style={{cursor: inQueue === -1 ? 'auto' : 'pointer'}} className="select-none mb-4 h-16 w-4/5 mx-auto flex-row flex border-t text-xl border-red-200 bg-rose-600 rounded-lg mt-4 text-white font-Poppins font-bold justify-center items-center">
          {
            !inn ?
            (
              joinQueueMutation.isLoading ?
              <Loader height={100} width={100} /> :
              <><Heart height={40} width={40}/> New Context </>
            ) :
            (
              <div className="font-Poppins font-bold text-2xl flex items-center justify-center"><Loader height={100} width={100}/></div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Home;
