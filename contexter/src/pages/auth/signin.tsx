import { CtxOrReq } from "next-auth/client/_utils"
import { getCsrfToken } from "next-auth/react"

export default function SignIn({ csrfToken }: { csrfToken: string }) {    
  return (
    <div className="max-w-5xl w-96 h-40 m-auto bottom-1/2 top-1/2">
      <div className="font-Poppins m-auto text-center text-5xl mt-20">
        <span className="font-Kurale text-rose-700 font-bold text-7xl">C</span>ontexter
        <p className="text-lg mt-4">AI generated role playing simulation</p>
      </div>
      <p className="font-Lato text-center text-black mt-16 bg-green-300 p-2 rounded">Sign in with your email address (no signup required)</p>
      <form method="post" action="/api/auth/signin/email" className="flex h-60 w-96 border-red-200 rounded flex-col mt-4 bg-red-100 left-1/2 -translate-x-1/2 absolute p-4 justify-around">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <label className="text-red-700 font-Poppins mx-auto text-center">
          Email address: <br/>
          <input className="border border-red-200 mt-4 p-2" type="email" id="email" name="email" />
        </label>
        <button className="bg-rose-600 text-white font-bold font-Poppins py-2 rounded" type="submit">Sign in with Email</button>
      </form>
    </div>
  )
}

export async function getServerSideProps(context: CtxOrReq | undefined) {
  const csrfToken = await getCsrfToken(context)
  return {
    props: { csrfToken },
  }
}