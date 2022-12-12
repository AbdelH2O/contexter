// import { type NextPage } from "next";
// import { useRouter } from "next/router";
// import Head from "next/head";
// import Link from "next/link";
import { useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";
import { Loader } from "../components/icons";
import Peronalities from "../enums/personalities";
// import type { CtxOrReq } from "next-auth/client/_utils";

// const Home: NextPage = () => {
//   const hello = trpc.example.hello.useQuery({ text: "from tRPC" });
  
//   return (
//     <div className="h-screen w-screen bg-white flex justify-center items-center">
//       <div className="max-w-5xl w-96 h-40 m-auto bottom-1/2 top-1/2">
//         <div className="font-Poppins m-auto text-center text-5xl -mt-20">
//           <span className="font-Kurale text-rose-700 font-bold text-7xl">C</span>ontexter
//           <p className="text-lg mt-4">AI generated role playing simulation</p>
//         </div>
//         <AuthShowcase />
//       </div>
//     </div>
//   );
// };

// export default Home;

// const AuthShowcase: React.FC = () => {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined },
//   );
//   const router = useRouter();

//   return (
//     <div onClick={sessionData ? undefined : () => router.push('/auth/signin')} className="bg-rose-600 text-white w-fit px-4 py-2 rounded-md mx-auto mt-16 text-xl font-Lato font-bold">
//       {sessionData ? "Continue" : "Get started"}
//     </div>
//     // <div className="flex flex-col items-center justify-center gap-4">
//     //   <p className="text-center text-2xl text-white">
//     //     {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//     //     {secretMessage && <span> - {secretMessage}</span>}
//     //   </p>
//     //   <button
//     //     className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//     //     onClick={sessionData ? () => signOut() : () => signIn()}
//     //   >
//     //     {sessionData ? "Sign out" : "Sign in"}
//     //   </button>
//     // </div>
//   );
// };
import type { CtxOrReq } from "next-auth/client/_utils"
import { getCsrfToken, getSession } from "next-auth/react"
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function SignIn({ csrfToken }: { csrfToken: string }) {
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("male");
  const [personality, setPersonality] = useState<Peronalities>(Peronalities.ENFJA);
  const { data: sessionData } = useSession();
  const nameMutate = trpc.auth.setUsername.useMutation({
    onSuccess: () => {
      router.push("/app");
    }
  });
  const router = useRouter();
  if(sessionData?.user?.name) {
    router.push("/app");
  }
  if(!sessionData) {
    return (
      <div className="max-w-5xl w-96 h-40 m-auto bottom-1/2 top-1/2">
        <div className="font-Poppins m-auto text-center font-bold text-5xl mt-20">
          <span className="font-Kurale text-rose-700 text-7xl">C</span>ontexter
          <p className="text-lg mt-4">AI generated role playing simulation</p>
        </div>
        <p className="text-base font-Lato border border-green-300 text-center text-black mt-8 bg-green-200 p-2 rounded">Sign in with your email address <span className="text-green-900 font-bold">(no signup required)</span></p>
        <form method="post" action="/api/auth/signin/email" className="flex h-60 w-96 border border-red-200 rounded flex-col mt-4 bg-red-100 left-1/2 -translate-x-1/2 absolute p-4 justify-around">
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <label className="text-red-700 font-Poppins mx-auto text-center">
            Email address: <br/>
            <input className="border border-red-200 mt-4 px-2 py-1 rounded" type="email" id="email" name="email" />
          </label>
          <button className="bg-rose-600 text-white font-bold font-Poppins py-2 rounded" type="submit">Sign in with Email</button>
        </form>
      </div>
    );
  }
  console.log(sessionData);
  if(!sessionData.user?.name) {
    
    return (
      <div className="max-w-5xl w-96 h-40 m-auto bottom-1/2 top-1/2">
        <div className="font-Poppins m-auto text-center font-bold text-5xl mt-20">
          <span className="font-Kurale text-rose-700 text-7xl">C</span>ontexter
          <p className="text-lg mt-4">AI generated role playing simulation</p>
        </div>
        {/* <p className="text-base font-Lato border border-green-300 text-center text-black mt-8 bg-green-200 p-2 rounded">Sign in with your email address <span className="text-green-900 font-bold">(no signup required)</span></p> */}
        <div className="flex h-96 w-96 border border-red-200 rounded-lg flex-col mt-4 bg-red-100 left-1/2 -translate-x-1/2 absolute p-4 justify-around">
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <label className="text-red-700 font-Poppins font-bold mx-auto text-center">
            What should we call you? <br/>
            <input onChange={(e) => setUsername(e.target.value)} className="border text-black font-normal border-red-200 mt-1 px-2 py-1 rounded" placeholder="eg: John Doe" type="text" id="username" name="username" />
          </label>
          <label className="text-red-700 font-Poppins font-bold mx-auto text-center mt-2">
            Gender: <br/>
            <select onChange={(e) => setGender(e.target.value)} className="border text-black font-normal border-red-200 mt-1 px-2 py-1 rounded" id="male" name="male" value={gender} > 
              <option value="male" >Male</option>
              <option value="female" >Female</option>
            </select>


          </label>
          <label className="text-red-700 font-Poppins font-bold mx-auto text-center mt-2">
            Personality type:&nbsp;&nbsp;<br/>
            <select
              onChange={(e) => setPersonality(e.target.value as Peronalities)}
              className="border text-black font-normal border-red-200 mt-1 px-2 py-1 rounded"
              id="personality"
              name="personality"
              value={personality}
            > 
              {
                Object.values(Peronalities).map((personalityType, index) => {
                  return <option key={index} value={personalityType}>{personalityType}</option>
                })
              }
            </select><br/><br/>
            <a href={"https://www.16personalities.com/"} target="_blank" rel="noopener noreferrer" className="font-bold hover:bg-red-50 mb-2 bg-white px-2 py-1 rounded shadow-md">Take the test!</a><br/>

          </label>
          <button
            className="bg-rose-600 text-white mt-2 font-bold font-Poppins py-2 rounded-lg max-h-10"
            disabled={username === '' || gender === '' || nameMutate.isLoading}
            style={{
              opacity: username === '' || gender === '' || nameMutate.isLoading ? 0.8 : 1,
              cursor: username === '' || gender === '' || nameMutate.isLoading ? 'not-allowed' : 'pointer'
            }}
            onClick={() => username !== '' && gender !== '' && nameMutate.mutate({name: username, gender, personality: personality})}
          >{nameMutate.isLoading ? <Loader width={50} height={50}/> : "Save"}</button>
        </div>
      </div>
    );
  }
}

export async function getServerSideProps(context: CtxOrReq | undefined) {
  const csrfToken = await getCsrfToken(context);
  const session = await getSession(context);
  
  if(session?.user?.name) {
    return {
      redirect: {
        destination: '/app',
        permanent: false,
      },
    }
  }
  console.log(session);
  return {
    props: { csrfToken },
  }
}