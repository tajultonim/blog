import { NextPage, GetStaticProps, GetStaticPaths } from "next";
import PostLayout from "../../components/Layout/PostLayout";
import Image from "next/legacy/image";
import supabase from "../../supabase/init";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import atomDark from "react-syntax-highlighter/dist/cjs/styles/prism/atom-dark";
import Link from "next/link";
import Head from "next/head";
import {
  RiMoreFill,
  RiFileCopy2Fill,
  RiBookmarkLine,
  RiBookmarkFill,
} from "react-icons/ri";
const theme: any = atomDark;
import { useEffect, useState } from "react";
const keyword_extractor = require("keyword-extractor");

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
  published_at: string;
  author: {
    name: string;
    display_profile: string;
    username: string;
    twitter: string;
    facebook: string;
  };
  tags: { title: string; color: string }[];
}

const Post: NextPage<Props> = ({ post }) => {
  const [isSharebaropen, setIsSharebaropen] = useState(false);
  const [marked, setMarked] = useState(false);
  let SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

  useEffect(() => {
    let bmarked = JSON.stringify(localStorage.getItem("marked") || "[]");
    setMarked(bmarked.includes(post.slug));
  }, [post.slug]);

  return (
    <>
      <Head>
        <title>{`${post.title} - TajulTonim`}</title>
        <meta
          name="description"
          content={post.description.replace(/(\r\n|\n|\r)/gm, "")}
        />
        <link
          rel="canonical"
          href={"https://" + SITE_URL + "/post/" + post.slug}
        />
        <meta
          name="keywords"
          content={keyword_extractor
            .extract(post.description, {
              language: "english",
              remove_digits: true,
              return_changed_case: true,
              remove_duplicates: true,
            })
            .join(", ")}
        />

        {/* twitter */}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta
          name="twitter:description"
          content={post.description.replace(/(\r\n|\n|\r)/gm, "")}
        />
        <meta name="twitter:image" content={post.cover} />
        <meta name="twitter:creator" content={"@" + post.author.twitter} />
        <meta name="twitter:site" content="@tajultonim" />

        {/* facebook */}
        <meta property="og:title" content={post.title} />
        <meta
          property="og:description"
          content={post.description.replace(/(\r\n|\n|\r)/gm, "")}
        />
        <meta property="og:image" content={post.cover} />
        <meta property="og:image:secure_url" content={post.cover} />
        <meta
          property="og:url"
          content={"https://" + SITE_URL + "/p/" + post.slug}
        />
        <meta property="og:type" content="article" />
        <meta property="og:image:alt" content={post.title} />
        <meta
          property="article:published_time"
          content={new Date(post.created_at).toISOString()}
        />
        <meta property="article:author" content={post.author.facebook} />
        <meta property="og:site_name" content="TajulTonim Blog" />
        <meta property="fb:app_id" content="531198521796306" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.title,
              about: post.description,
              image: [post.cover],
              datePublished: new Date(post.created_at).toISOString(),
              dateModified: new Date(post.published_at).toISOString(),
              author: [
                {
                  "@type": "Person",
                  name: post.author.name,
                  url: `https://${SITE_URL}/author/${post.author.username}`,
                },
              ],
              publisher: [
                {
                  name: "TajulTonim blog",
                  url: SITE_URL,
                },
              ],
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `https://${SITE_URL}/post/${post.slug}`,
              },
              logo: {
                "@type": "ImageObject",
                url: `https://${SITE_URL}/favicon.ico`,
              },
            }),
          }}
        ></script>
      </Head>

      <PostLayout
        Sidebar={
          <>
            <div className=" h-full w-full relative flex justify-center">
              <div className="fixed top-32 z-10">
                {marked ? (
                  <RiBookmarkFill
                    onClick={() => {
                      let omarked: Array<string> = JSON.parse(
                        localStorage.getItem("marked") || "[]"
                      );
                      let nmarked: Array<string>;
                      if (omarked.includes(post.slug)) {
                        setMarked(false);
                        console.log(marked);

                        nmarked = omarked.filter((s) => s !== post.slug);
                      } else {
                        setMarked(true);
                        nmarked = [...omarked, post.slug];
                      }
                      localStorage.setItem("marked", JSON.stringify(nmarked));
                    }}
                    className="h-9 w-9 cursor-pointer rounded-full hover:bg-gray-200 text-blue-700 border-2 p-[6px] border-blue-700 "
                  />
                ) : (
                  <RiBookmarkLine
                    onClick={() => {
                      let omarked: Array<string> = JSON.parse(
                        localStorage.getItem("marked") || "[]"
                      );
                      let nmarked: Array<string>;
                      if (omarked.includes(post.slug)) {
                        setMarked(false);
                        nmarked = omarked.filter((s) => s !== post.slug);
                      } else {
                        setMarked(true);
                        nmarked = [...omarked, post.slug];
                      }
                      localStorage.setItem("marked", JSON.stringify(nmarked));
                    }}
                    className="text-gray-500 h-9 w-9 cursor-pointer rounded-full hover:bg-gray-200 hover:text-blue-700 p-2 "
                  />
                )}
                <div className="">
                  <RiMoreFill
                    onClick={() => {
                      setIsSharebaropen(!isSharebaropen);
                    }}
                    className="mt-2 text-gray-500 h-9 w-9 cursor-pointer rounded-full hover:bg-gray-200 hover:text-green-600 p-2 "
                  />
                  <div
                    className={`fixed ml-10 w-60 -mt-2 bg-white border shadow rounded-md p-2 ${
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
                      legacyBehavior
                      rel="nofollow noindex"
                      href={`https://twitter.com/intent/tweet?text="${encodeURIComponent(
                        post.title
                      )}" by @${encodeURIComponent(
                        post.author.twitter
                      )} %23TajulsBlog ${
                        "https://" + SITE_URL + "/post/" + post.slug
                      }`}
                    >
                      <a>
                        <div className="flex p-1 py-2 text-gray-900 cursor-pointer hover:text-blue-800 items-center w-48 justify-between">
                          <p className="">Share to Twitter</p>
                        </div>
                      </a>
                    </Link>
                    <Link
                      target="_blank"
                      rel="nofollow noindex"
                      href={`https://www.facebook.com/sharer.php?u=${encodeURIComponent(
                        "https://" + SITE_URL + "/post/" + post.slug
                      )}`}
                    >
                      <div className="flex p-1 py-2 text-gray-900 cursor-pointer hover:text-blue-800 items-center w-48 justify-between">
                        <p className="">Share to Facebook</p>
                      </div>
                    </Link>
                    <Link
                      href={`https://www.reddit.com/submit?url=${encodeURIComponent(
                        "https://" + SITE_URL + "/post/" + post.slug
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
                        "https://" + SITE_URL + "/post/" + post.slug
                      )}`}
                    >
                      <div className="flex p-1 py-2 text-gray-900 cursor-pointer hover:text-blue-800 items-center w-48 justify-between">
                        <p className="">Share to LinkedIn</p>
                      </div>
                    </Link>
                    <Link
                      href={`https://news.ycombinator.com/submitlink?u=${encodeURIComponent(
                        "https://" + SITE_URL + "/post/" + post.slug
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
                          url: "https://" + SITE_URL + "/post/" + post.slug,
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
                objectFit="cover"
                layout="fill"
                alt=""
                priority={true}
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
                <p className=" text-xs" suppressHydrationWarning={true}>
                  {"posted on " +
                    new Intl.DateTimeFormat("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }).format(new Date(post.created_at).getTime())}
                </p>
              </div>
            </div>

            <h1 className="w-full -mt-5 font-black p-3 pl-0  min-h-20 text-3xl xl:text-4xl outline-none">
              {post.title}
            </h1>

            <div className=" flex gap-1 -mt-2 mb-3">
              {post.tags.map((t) => (
                <Link key={t.title} href={"/t/" + t.title}>
                  <style>{`
                     .tag-${t.title}:hover{
                         background-color: ${t.color}26;
                         border-color: ${t.color}CC;
                     }
                  `}</style>
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

            <div className="preview">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <div className=" code-block relative">
                        <RiFileCopy2Fill
                          className="absolute top-4 right-2 text-white opacity-25 hover:opacity-75 cursor-pointer active:opacity-50"
                          onClick={async () => {
                            await navigator.clipboard.writeText(
                              String(children)
                                .replace(/  \n\n/gi, "\n")
                                .replace(/\n$/, "")
                                .trim()
                            );
                          }}
                        />
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
                        <div className=" absolute right-2 bottom-3 text-white opacity-75 text-xs">
                          {match[1]}
                        </div>
                      </div>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                  table(props) {
                    return (
                      <div className=" my-2 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-md rounded">
                        <table>{props.children}</table>
                      </div>
                    );
                  },
                }}
              >
                {post.content}
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
    let { data, error } = await supabase
      .from("posts")
      .select("slug")
      .eq("ispublished", true);
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
        "title,description,content,slug,cover,author(name,display_profile,username,twitter,facebook),created_at,published_at,word,tags(title,color)"
      )
      .eq("slug", context.params?.slug)
      .eq("ispublished", true);

    if (error || !data?.length) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        post: data[0],
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
