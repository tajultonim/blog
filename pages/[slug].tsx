import { NextPage, GetStaticProps, GetStaticPaths } from "next";
import PostLayout from "../components/Layout/PostLayout";
import Image from "next/legacy/image";
import supabase from "../supabase/init";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import atomDark from "react-syntax-highlighter/dist/cjs/styles/prism/atom-dark";
import Link from "next/link";
import Head from "next/head";
import { RiMoreFill, RiFileCopy2Fill } from "react-icons/ri";
const theme: any = atomDark;
import { useEffect, useState } from "react";

interface Props {
  post: PostType;
}

interface PostType {
  title: string;
  slug: string;
  description: string;
  content: string;
  cover: string;
  word: number;
  created_at: string;
  author: {
    name: string;
    display_profile: string;
    username: string;
    twitter: string;
  };
}

const Post: NextPage<Props> = ({ post }) => {
  const [isSharebaropen, setIsSharebaropen] = useState(false);
  const [pageUrl, setPageUrl] = useState(
    process.env.VERCEL_URL ? process.env.VERCEL_URL + "/" + post.slug : ""
  );
  let secs = Math.round(
    (new Date().getTime() - new Date(post.created_at).getTime()) / 1000
  );
  let dur: any = "seconds";
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

  useEffect(() => {
    setPageUrl(location.href);
  }, []);

  return (
    <>
      <Head>
        <title>{`${post.title} - TajulTonim`}</title>
        <meta
          name="description"
          content={post.description.replace(/(\r\n|\n|\r)/gm, "")}
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={post.title} />
        <meta
          name="twitter:description"
          content={post.description.replace(/(\r\n|\n|\r)/gm, "")}
        />
        <meta name="twitter:image" content={post.cover} />
        <meta property="og:title" content={post.title} />
        <meta
          property="og:description"
          content={post.description.replace(/(\r\n|\n|\r)/gm, "")}
        />
        <meta property="og:image" content={post.cover} />
        <meta property="og:url" content={pageUrl} />
      </Head>
      <PostLayout
        Sidebar={
          <>
            <div className=" h-full w-full relative flex justify-center">
              <div className=" fixed top-32 z-10">
                <RiMoreFill
                  onClick={() => {
                    setIsSharebaropen(!isSharebaropen);
                  }}
                  className="text-gray-500 h-9 w-9 cursor-pointer rounded-full hover:bg-gray-200 hover:text-green-500 p-2 "
                />
                <div
                  className={`fixed left-20 w-60 -mt-2 bg-white border shadow rounded-md p-2 ${
                    isSharebaropen ? "" : "hidden"
                  }`}
                >
                  <div
                    onClick={async () => {
                      await navigator.clipboard.writeText(location.href);
                    }}
                    className="  flex p-1 py-2 text-gray-700 cursor-pointer hover:text-blue-800 font-bold items-center w-full justify-between"
                  >
                    <p className="">Copy link</p> <RiFileCopy2Fill />
                  </div>
                  {/* <p className=" text-sm text-center bg-blue-100 text-black p-1 rounded">
                    Link copied
                  </p> */}
                  <Link
                    target="_blank"
                    rel="nofollow noindex"
                    href={`https://twitter.com/intent/tweet?text="${encodeURIComponent(
                      post.title
                    )}" by @${encodeURIComponent(
                      post.author.twitter
                    )} %23TajulsBlog ${pageUrl}`}
                  >
                    <div className="flex p-1 py-2 text-gray-900 cursor-pointer hover:text-blue-800 items-center w-48 justify-between">
                      <p className="">Share to Twitter</p>
                    </div>
                  </Link>
                  <Link
                    target="_blank"
                    rel="nofollow noindex"
                    href={`https://www.facebook.com/sharer.php?u=${encodeURIComponent(
                      pageUrl
                    )}`}
                  >
                    <div className="flex p-1 py-2 text-gray-900 cursor-pointer hover:text-blue-800 items-center w-48 justify-between">
                      <p className="">Share to Facebook</p>
                    </div>
                  </Link>
                  <Link
                    href={`https://www.reddit.com/submit?url=${encodeURIComponent(
                      pageUrl
                    )}&title=${encodeURIComponent(
                      '"' + post.title + '" by ' + post.author.name
                    )}`}
                  >
                    <div className="flex p-1 py-2 text-gray-900 cursor-pointer hover:text-blue-800 items-center w-48 justify-between">
                      <p className="">Share to Reddit</p>
                    </div>
                  </Link>
                  <Link
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      pageUrl
                    )}`}
                  >
                    <div className="flex p-1 py-2 text-gray-900 cursor-pointer hover:text-blue-800 items-center w-48 justify-between">
                      <p className="">Share to LinkedIn</p>
                    </div>
                  </Link>
                  <Link
                    href={`https://news.ycombinator.com/submitlink?u=${encodeURIComponent(
                      pageUrl
                    )}&t=${encodeURIComponent(
                      '"' + post.title + '" by ' + post.author.name
                    )}`}
                  >
                    <div className="flex p-1 py-2 text-gray-900 cursor-pointer hover:text-blue-800 items-center w-48 justify-between">
                      <p className="">Share to Hacker News</p>
                    </div>
                  </Link>

                  <div
                    onClick={() => {
                      navigator.share({
                        url: pageUrl,
                        title: post.title,
                        text: "Read " + post.title + "by" + post.author.name,
                      });
                    }}
                    className="flex p-1 py-2 text-gray-900 cursor-pointer hover:text-blue-800 items-center w-48 justify-between"
                  >
                    <p className="">Share post via...</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        }
        Rightbar={<></>}
      >
        <div className=" bg-white rounded-lg mt-2">
          {post.cover && (
            <div className="relative w-full min-w-full aspect-video bg-black rounded-t-lg">
              <Image
                src={post.cover}
                className=" rounded-t-lg z-0"
                objectFit="contain"
                layout="fill"
                alt=""
              />
            </div>
          )}
          <div className=" sm:px-10 px-3">
            <div className="flex my-4 items-center">
              <Link href="/author/tajultonim">
                <div className=" relative h-8 w-8 rounded-full ">
                  <Image
                    src={post.author.display_profile}
                    layout="fill"
                    alt={post.author.name}
                    className="rounded-full"
                  />
                </div>
              </Link>

              <div className=" ml-2">
                <Link href="/author/tajultonim">
                  <p className=" text-sm w-full font-semibold">
                    {post.author.name}
                  </p>
                </Link>
                <p className=" text-xs">{"posted " + postedAt}</p>
              </div>
            </div>
            <h1 className="w-full -mt-3 font-black p-3 pl-0  min-h-20 text-3xl xl:text-4xl outline-none">
              {post.title}
            </h1>

            <div className="preview">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        language={match[1]}
                        style={theme}
                        PreTag="div"
                        {...props}
                      >
                        {String(children)
                          .replace(/  \n\n/gi, "\n")
                          .replace(/\n$/, "")
                          .trim()}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {post.content.replace(/\n/gi, "  \n\n").trim()}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </PostLayout>
    </>
  );
};

export default Post;

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    let { data, error } = await supabase.from("posts").select("slug");
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

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    let { data, error } = await supabase
      .from("posts")
      .select(
        "title,description,content,slug,cover,author(name,display_profile,username,twitter),created_at,word"
      )
      .eq("slug", context.params?.slug);
    if (error || !data) {
      console.log(error);
      throw new Error(error?.message);
    }
    return {
      props: {
        post: data ? data[0] : {},
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
