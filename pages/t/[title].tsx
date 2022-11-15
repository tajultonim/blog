import { NextPage, GetStaticProps, GetStaticPaths } from "next";
import supabase from "../../supabase/init";
import Layout from "../../components/Layout";
import { FC } from "react";
import Link from "next/link";
import Image from "next/legacy/image";
import Head from "next/head";

interface TagType {
  title: string;
  description: string;
  cover: string;
  color: string;
  posts: PostType[];
}

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

type RelativeTimeFormatUnit = any;

const TagPage: NextPage<{ data: TagType }> = ({ data }) => {
  let SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
  let ptsarr = data.posts.map((p) => p.tags).flat(1);
  ptsarr = ptsarr.filter(function (item, pos) {
    return ptsarr.indexOf(item) == pos;
  });

  let stylestr = "";
  ptsarr.forEach((t) => {
    stylestr += `.tag-${t.title}:hover{
    background-color: ${t.color}26;
    border-color: ${t.color}CC;
  }
  `;
  });

  return (
    <>
      <Head>
        <title>{`${data.title} - TajulTonim`}</title>
        <link
          rel="canonical"
          href={"https://" + SITE_URL + "/t/" + data.title}
        />
      </Head>
      <style>{stylestr}</style>
      <Layout
        TopBar={
          <TopBar
            description={data.description}
            cover={data.cover}
            title={data.title}
            color={data.color}
          />
        }
      >
        <div className=" flex flex-col gap-3">
          {data.posts.map((p) => (
            <Post key={p.slug} data={p} />
          ))}
        </div>
      </Layout>
    </>
  );
};

const TopBar: FC<{
  title: string;
  color: string;
  cover: string;
  description: string;
}> = ({ title, color, cover, description }) => {
  return (
    <div
      className="shadow justify-between items-center mt-2 flex w-full bg-white rounded-lg border-t-[15px] py-3 px-5"
      style={{ borderTopColor: color }}
    >
      <div className=" flex-1">
        <h1 className=" text-2xl font-bold">
          <span className=" text-gray-500 mr-1">#</span>
          {title}
        </h1>
        <p className=" ml-4 mr-6">{description}</p>
      </div>
      <div className="relative h-10 w-10">
        <Image
          priority={false}
          quality={50}
          alt={title}
          layout="fill"
          objectFit="contain"
          src={cover}
        />
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    let { data, error } = await supabase.from("tags").select("title");
    let paths = data?.map((d) => {
      return { params: d };
    });
    if (error || !paths) {
      console.log(error);
      throw new Error(error?.message);
    }
    return {
      paths: paths,
      fallback: "blocking",
    };
  } catch (error) {
    return {
      paths: [],
      fallback: "blocking",
    };
  }
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
            {" "}
            <Link href={"/author/" + data.author.username}>
              <div className="relative w-6 h-6 ">
                <Image
                  alt={data.author.name}
                  src={data.author.display_profile}
                  layout="fill"
                  objectFit="cover"
                  className=" rounded-full"
                  quality={100}
                />
              </div>{" "}
            </Link>
            <div className=" pl-2 py-1 flex-1 flex flex-col justify-between ">
              <Link href={"/author/" + data.author.username}>
                <h3 className=" hover:text-blue-700 text-gray-900 text-sm font-semibold">
                  {data.author.name}
                </h3>
              </Link>

              <div
                className=" text-gray-900 -mt-[2px] text-xs"
                suppressHydrationWarning={true}
              >
                {postedAt}
              </div>
            </div>
          </div>
          <Link href={"/post/" + data.slug}>
            <div className=" text-3xl font-bold -mt-1 mb-1 pl-8">
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

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    let { data, error } = await supabase
      .from("tags")
      .select(
        "title,description,cover,color,posts(title,slug,created_at,word,tags(title,color),author(name,display_profile,username))"
      )
      .eq("title", context.params?.title);
    if (error || !data) {
      console.log(error);
      throw new Error(error?.message);
    }
    return {
      props: {
        data: data ? data[0] : {},
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default TagPage;
