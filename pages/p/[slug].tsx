import { NextPage, GetStaticPaths, GetStaticProps } from "next";
import supabase from "../../supabase/init";
import Header from "../../components/Header";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import atomDark from "react-syntax-highlighter/dist/cjs/styles/prism/atom-dark";
import { RiFileCopy2Fill } from "react-icons/ri";
import Head from "next/head";
const theme: any = atomDark;

interface PageType {
  slug: string;
  title: string;
  description: string;
  content: string;
  published_at: string;
}

const Page: NextPage<{ page: PageType }> = ({ page }) => {
  return (
    <>
      <Header fixed={true} />
      <Head>
        <title>{`${page.title} - TajulTonim`}</title>
      </Head>
      <div className="flex w-full justify-center mt-14 ">
        <div className="container max-w-4xl mx-2 ">
          <main className="mt-2 mb-2 w-full bg-white rounded-lg  p-16 py-10">
            <h1 className="text-5xl font-black">{page.title}</h1>
            <p className="mb-2 mt-1 text-sm">
              Last Update:{" "}
              {new Intl.DateTimeFormat("en-GB").format(
                new Date(page.published_at)
              )}
            </p>
            <div className="preview text-lg flex flex-col gap-2">
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
                {page.content}
              </ReactMarkdown>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    let { data, error } = await supabase
      .from("pages")
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
      .from("pages")
      .select("title,description,content,slug,published_at")
      .eq("slug", context.params?.slug)
      .eq("ispublished", true)
      .single();

    if (error || !data) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        page: data,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default Page;
