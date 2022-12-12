import { BrokenHeart, Heart, Arrow, Search, Loader } from "../../components/icons";
import Image from "next/image";
import { trpc } from "../../utils/trpc";
import supabase from "../../utils/supabase";
import { useEffect } from "react";

enum Direction {
  Left = 'left',
  Right = 'right',
}

const Home = () => {
  const joinQueueMutation = trpc.matchmaking.joinQueue.useMutation();
  const sub = supabase
    .channel('value-db-changes')
    .on('postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'rooms',
      },
     (payload) => {
        console.log(payload);
     }
    );

  useEffect(() => {
    const fetchChats = async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select(`
          *,
          messages (
            *
          )
        `);
      console.log(data);
    };
    fetchChats();
  }, []);
  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="text-center font-Poppins font-bold text-4xl flex justify-between">
        <div className="flex flex-row-reverse items-center bg-rose-600 w-full py-2">
          <div className="absolute top-0 w-full mt-2">
            <p className="font-Poppins select-none font-black text-4xl mt-2 text-white bg-rose-600 w-fit mx-auto">Chats</p>
          </div>
          <div className="rounded-full overflow-hidden mr-4 bg-white right-0">
            <Image src={"https://avatars.dicebear.com/api/micah/4.svg"} alt="Contexter Logo" width={50} height={50} />
          </div>
        </div>
      </div>
      <div className="flex-grow max-w-xl mx-auto w-full px-2 flex flex-col justify-between">
        <div className="flex flex-col">
          <i className="absolute mt-[1.65rem] ml-3">
            <Search width={20} height={20} />
          </i>
          <input className="h-10 cursor-pointer w-full flex-row flex items-center mt-4 pl-9 focus:outline-rose-500 shadow-md rounded-lg border border-gray-200 bg-gray-100">
          </input>
          <div className="h-20 cursor-pointer w-full flex-row flex items-center mt-4 shadow-md rounded-lg border border-rose-200 bg-rose-50">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-white ml-2">
              <Image src={"https://avatars.dicebear.com/api/micah/4.svg"} alt="Profile Picture" width={100} height={100} />
            </div>
            <div className="flex flex-col flex-grow ml-4">
              <p className="font-Poppins text-red-700 font-bold">John Doe</p>
              <p className="font-Lato text-gray-500 opacity-60">John Doe: Hello!</p>
            </div>
            <div className="mr-2">
              <Arrow width={40} height={40} color={"#64748b"} direction={Direction.Right}/>
            </div>
          </div>
        </div>
        <div onClick={() => joinQueueMutation.mutate()} className="select-none cursor-pointer mb-4 h-16 w-4/5 mx-auto flex-row flex border-t text-xl border-red-200 bg-rose-600 rounded-lg mt-4 text-white font-Poppins font-bold justify-center items-center">
          {joinQueueMutation.isLoading ? <Loader height={50} width={50} /> : <><Heart height={40} width={40}/> New Context </>}
        </div>
      </div>
    </div>
  );
};

export default Home;
