import { NextPage, GetStaticProps } from "next";
import { FC } from "react";
import Layout from "../components/Layout";
import DefaultSidebar from "../components/Layout/DefaultSidebar";
import supabase from "../supabase/init";
import Image from "next/legacy/image";
import Link from "next/link";
import Head from "next/head";

interface Props {
  posts: PostType[];
  tags: TagType[];
}

interface TagType {
  id: string;
  title: string;
  description: string;
  cover: string;
  color: string;
  posts: {
    title: string;
    slug: string;
    word: number;
  }[];
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
  tags: {
    title: string;
    color: string;
  }[];
}

type RelativeTimeFormatUnit = any;

const Home: NextPage<Props> = ({ posts, tags }) => {
  let styletxt = "";
  tags.forEach((tag) => {
    styletxt += `.tag-${tag.title} span{
      color: ${tag.color};
    }
    
    .tag-${tag.title}:hover{
        background-color: ${tag.color}26;
        border-color: ${tag.color}CC;
    }`;
  });

  return (
    <>
      <Head>
        <meta
          name="facebook-domain-verification"
          content="17feoonrfhqenwtfaw98urwul9b813"
        />
      </Head>
      <style>{styletxt}</style>
      <Layout
        Sidebar={<DefaultSidebar tags={tags} />}
        // RightSidebar={<RightSidebar tags={tags} />}
      >
        <div className="grid gap-4">
          {posts.map((post, i) => (
            <Post i={i} key={post.slug} data={post} />
          ))}
        </div>
      </Layout>
    </>
  );
};

const Post = ({ data, i }: { data: PostType; i: number }) => {
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
        <Link href={"/post/" + data.slug}>
          <div className="flex justify-center items-center relative w-full aspect-[2] rounded">
            <Image
              alt={data.title}
              src={data.cover}
              sizes=""
              layout="fill"
              objectFit="cover"
              className=" rounded-t"
              priority={i < 2}
            />
          </div>
        </Link>
        <div className="px-4 pb-4">
          <div className=" flex mt-1 w-full items-center">
            <Link href={"/author/" + data.author.username}>
              <div className="relative w-6 h-6 ">
                <Image
                  alt={data.author.name}
                  src={data.author.display_profile}
                  layout="fill"
                  objectFit="cover"
                  className=" rounded-full"
                  quality={100}
                  priority={i < 2}
                />
              </div>
            </Link>
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
            <div className=" text-3xl font-bold -mt-1 mb-1 pl-8">
              {data.title}
            </div>
          </Link>
          <div className=" ml-8 flex mb-1">
            {data.tags.map((t) => (
              <Link href={"/t/" + t.title} key={t.title}>
                <div
                  className={` tag-${t.title} border border-transparent px-1 rounded text-sm`}
                >
                  <span className=" mr-1">#</span>
                  {t.title}
                </div>
              </Link>
            ))}
          </div>
          <Link href={"/post/" + data.slug}>
            <div className=" pl-8 w-full line-clamp-2 text-sm">
              {data.description}
            </div>
          </Link>
          <div className="relative mt-5">
            <div className=" absolute right-0 bottom-0 text-xs">
              {Math.round(data.word / 250)} min read
            </div>
          </div>
        </div>
      </div>
    </div>
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

export const RightSidebar: FC<{ tags: TagType[] }> = ({ tags }) => {
  return (
    <div className=" gap-2 flex flex-col mt-2">
      {tags.map((t) => (
        <div key={t.title} className="bg-white rounded p-2">
          <Link href={"/t/" + t.title}>
            <div className=" hover:text-blue-700 text-lg font-bold text-gray-800">
              #{t.title}
            </div>
          </Link>
          {t.posts.map((p) => (
            <Link key={p.slug + t.title} href={"/post/" + p.slug}>
              <div className=" group mb-1">
                <div className=" py-1 group-hover:text-blue-700">{p.title}</div>
                <div className=" text-xs -mt-2">
                  {Math.round(p.word / 250)} min read
                </div>
              </div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};
export const getStaticProps: GetStaticProps = async (context) => {
  let { data, error } = await supabase
    .from("posts")
    .select(
      "title,description,slug,cover,author(name,display_profile,username),created_at,word,tags(title)"
    );
  let tagsres = await supabase
    .from("tags")
    .select("*,posts(title,slug,word)")
    .order("title", { ascending: true });

  if (error || tagsres.error) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      posts: data,
      tags: tagsres.data,
    },
  };
};

export default Home;
