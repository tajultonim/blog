import { NextPage, GetStaticProps } from "next";
import { FC } from "react";
import Layout from "../components/Layout";
import DefaultSidebar from "../components/Layout/DefaultSidebar";
import supabase from "../supabase/init";
import Image from "next/legacy/image";
import Link from "next/link";

interface Props {
  posts: PostType[];
}

interface PostType {
  title: string;
  slug: string;
  description: string;
  cover: string;
  word: number;
  created_at: string;
  author: {
    name: string;
    display_profile: string;
    username: string;
  };
}

type RelativeTimeFormatUnit = any;

const Home: NextPage<Props> = ({ posts }) => {
  return (
    <>
      <Layout Sidebar={<DefaultSidebar />}>
        <div className="grid gap-2">
          {posts.map((post) => (
            <Post key={post.slug} data={post} />
          ))}
        </div>
      </Layout>
    </>
  );
};

const Post = ({ data }: { data: PostType }) => {
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

  let postedAt = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  }).format(-secs, dur);

  return (
    <Link href={"/" + data.slug}>
      <div className="border bg-white rounded-md w-full">
        <div className=" flex flex-col w-full">
          <div className="flex justify-center items-center relative w-full aspect-[2] rounded">
            <Image
              alt={data.title}
              src={data.cover}
              layout="fill"
              objectFit="cover"
              className=" rounded-t"
            />
          </div>
          <div className="px-4 pb-4">
            <div className=" flex mt-1 w-full items-center">
              {/* <Link href={"/a/" + data.author.username}> */}
              <div className="relative w-10 h-10 ">
                <Image
                  alt={data.author.name}
                  src={data.author.display_profile}
                  layout="fill"
                  objectFit="cover"
                  className=" rounded-full"
                  quality={100}
                />
              </div>
              {/* </Link> */}
              <div className=" pl-3 py-1 flex-1 flex flex-col justify-between ">
                <h3 className=" text-2xl font-bold">{data.title}</h3>
                <div className=" text-xs">
                  {data.author.name} • {postedAt}
                </div>
              </div>
            </div>
            <div className=" w-full line-clamp-2 text-sm">
              {data.description}
            </div>
            <div className="relative mt-5">
              <div className=" absolute right-0 bottom-0 text-xs">
                {Math.round(data.word / 250)} min read
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const PostSkaleton: FC = () => {
  return (
    <div className="border bg-white rounded-md p-4 w-full">
      <div className="animate-pulse flex flex-col w-full">
        <div className="flex justify-center items-center w-full aspect-[2] bg-gray-500 rounded">
          <svg
            className="w-12 h-12 text-gray-200"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 640 512"
          >
            <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
          </svg>
        </div>
        <div className=" flex mt-3 w-full">
          <div className="rounded-full bg-slate-500 h-8 w-8"></div>
          <div className=" pl-3 py-2 flex-1 flex flex-col justify-between ">
            <div className=" bg-slate-500 w-1/4 rounded-lg  h-2"></div>
            <div className=" bg-slate-500 w-1/6 rounded-lg  h-2 mt-1"></div>
          </div>
        </div>
        <div className=" w-full grid grid-cols-6 mt-1 gap-1 pl-2">
          <div className=" col-span-2 h-2 bg-slate-500  rounded-lg"></div>
          <div className=" col-span-3 h-2 bg-slate-500  rounded-lg"></div>
          <div className=" col-span-1 h-2 bg-slate-500  rounded-lg"></div>
          <div className=" col-span-4 h-2 bg-slate-500  rounded-lg"></div>
          <div className=" col-span-2 h-2 bg-slate-500  rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  let { data, error } = await supabase
    .from("posts")
    .select(
      "title,description,slug,cover,author(name,display_profile,username),created_at,word"
    );
  return {
    props: {
      posts: data,
    },
  };
};

export default Home;
