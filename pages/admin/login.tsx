import { NextPage } from "next";
import Image from "next/image";
import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const Login: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  async function handleLogin() {
    if (!email || !password) {
      return;
    }
    try {
      const res = await fetch("/api/auth/admin/login", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });
      if (res.status == 200) {
        router.push("/admin");
      } else {
        console.log(res.status);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <Head>
        <title>Admin Login | TajulTonim</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className=" w-screen h-screen bg-gray-200 flex justify-center items-center p-2">
        <div className=" bg-white border rounded-md flex flex-col p-3 w-full max-w-sm">
          <div className="w-full flex justify-center">
            <div className=" relative h-10 w-32 my-6">
              <Image src="/icon.svg" layout="fill" alt="tt" objectFit="cover" />
            </div>
          </div>
          <label htmlFor="email" className="ml-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className=" border rounded outline-blue-500 p-1 pl-2"
          />
          <label htmlFor="password" className="ml-2 mt-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className=" border rounded outline-blue-500 p-1 pl-2"
          />
          <div className=" w-full flex justify-end">
            <button
              onClick={() => {
                handleLogin();
              }}
              className=" bg-blue-500 rounded p-1 px-2 text-white mt-2 hover:bg-blue-400"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
