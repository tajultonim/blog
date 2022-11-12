import { NextPage } from "next";
import { useEffect, useState } from "react";
import Header from "./../components/Header";
import { FC, ReactNode } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/legacy/image";
import Head from "next/head";

interface PostType {
  title: string;
  slug: string;
  created_at: string;
  word: number;
  tags: {
    title: string;
    color: string;
  }[];
  author: {
    name: string;
    display_profile: string;
    username: string;
  };
}

interface TagType {
  title: string;
  description: string;
  cover: string;
  color: string;
  posts: PostType[];
}

type RelativeTimeFormatUnit = any;

const Search: NextPage = () => {
  const router = useRouter();
  const [queryText, setQueryText] = useState("");
  const [type, setType] = useState("posts");
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    setQueryText(router.query.q as string);
    setType((router.query.type as string) === "tags" ? "tags" : "posts");
    (async () => {
      if (!router.query.q) {
        setPosts([]);
        return;
      }

      let result = await fetch(
        `/api/search?q=${router.query.q}${
          router.query.type ? "&type=" + router.query.type : ""
        }`
      ).then((res) => res.json());

      setPosts(result.data || []);
    })();
  }, [router.query.q, router.query.type]);
  return (
    <>
      <Head>
        <title>{queryText + "-Search"}</title>
        <link rel="canonical" href={"https://" + process.env.SITE_URL} />
      </Head>
      <Header fixed={true} />
      <div className="flex w-full justify-center mt-14 ">
        <div className="container grid grid-cols-7 gap-2 max-w-5xl mx-2 ">
          <h2 className=" col-span-9 lg:col-span-7 text-2xl font-bold my-1">
            Search resulf for {queryText}
          </h2>
          <div className=" hidden sm:flex left-sidebar col-span-2 flex-col gap-2 ">
            <div
              onClick={() => {
                router.push({ query: { type: "posts", q: queryText } });
              }}
              className={` p-2 rounded ${
                type == "posts"
                  ? "bg-blue-200 hover:bg-blue-100"
                  : "bg-blue-50 hover:bg-blue-100"
              } cursor-pointer`}
            >
              Posts
            </div>
            <div
              onClick={() => {
                router.push({ query: { type: "tags", q: queryText } });
              }}
              className={` p-2 rounded ${
                type == "tags"
                  ? "bg-blue-200 hover:bg-blue-100"
                  : "bg-blue-50 hover:bg-blue-100"
              } cursor-pointer`}
            >
              Tags
            </div>
          </div>
          <main className=" mb-2 sm:col-span-5 col-span-9 flex flex-col gap-3 ">
            {posts.map((p) => (
              <Post key={p.slug} length={posts.length} data={p} />
            ))}
          </main>
        </div>
      </div>
    </>
  );
};

const Post = ({ data, length }: { data: PostType; length: number }) => {
  let secs = Math.round(
    (new Date().getTime() - new Date(data.created_at).getTime()) / 1000
  );
  let dur: RelativeTimeFormatUnit = "seconds";
  if (secs >= 60) {
    secs = Math.round(secs / 60);
    dur = secs == 1 ? "minute" : "minutes";
    if (secs >= 60) {
      secs = Math.round(secs / 60);
      dur = secs == 1 ? "hour" : "hours";
      if (secs >= 24) {
        secs = Math.round(secs / 24);
        dur = secs == 1 ? "day" : "days";
        if (secs >= 30) {
          secs = Math.round(secs / 30);
          dur = secs == 1 ? "month" : "months";
          if (secs >= 12) {
            secs = Math.round(secs / 12);
            dur = secs == 1 ? "year" : "years";
          }
        }
      }
    }
  }

  let month = new Intl.DateTimeFormat("en-GB", { month: "short" }).format(
    new Date(data.created_at).getTime()
  );

  let postedAt =
    month +
    " " +
    new Date(data.created_at).getDate() +
    " (" +
    new Intl.RelativeTimeFormat("en", {
      numeric: "auto",
    }).format(-secs, dur) +
    ")";

  return (
    <div className="border bg-white rounded-md w-full">
      <div className=" flex flex-col w-full">
        <div className="px-4 pb-4">
          <div className=" flex mt-1 w-full items-center">
            <div className="relative w-6 h-6 ">
              <Link href={"/author/" + data.author.username}>
                <Image
                  alt={data.author.name}
                  src={data.author.display_profile}
                  layout="fill"
                  objectFit="cover"
                  className=" rounded-full"
                  quality={100}
                  priority={length < 3}
                />
              </Link>
            </div>

            <div className=" pl-2 py-1 flex-1 flex flex-col justify-between ">
              <Link href={"/author/" + data.author.username}>
                <h3 className=" hover:text-blue-700 text-gray-900 text-sm font-semibold">
                  {data.author.name}
                </h3>
              </Link>
              <div className=" text-gray-900 -mt-[2px] text-xs">{postedAt}</div>
            </div>
          </div>
          <Link href={"/post/" + data.slug}>
            <div className=" text-2xl font-bold -mt-1 mb-1 pl-8 pr-5">
              {data.title}
            </div>
          </Link>
          <div className=" ml-8 flex mb-1">
            {data.tags.map((t) => (
              <Link key={t.title} href={"/t/" + t.title}>
                <div
                  className={` border border-transparent px-1 rounded tag-${t.title} text-sm`}
                >
                  <span className=" mr-1" style={{ color: t.color }}>
                    #
                  </span>
                  {t.title}
                </div>
              </Link>
            ))}
          </div>

          <div className="relative -mt-1">
            <div className=" absolute right-0 bottom-0 text-xs">
              {Math.round(data.word / 250)} min read
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
