import { NextPage, GetStaticPaths, GetStaticProps } from "next";
import supabase from "../../supabase/init";
import Header from "../../components/Header";
import atomDark from "react-syntax-highlighter/dist/cjs/styles/prism/atom-dark";
import { HiLocationMarker } from "react-icons/hi";
import {
  RiCake2Fill,
  RiExternalLinkLine,
  RiFacebookCircleFill,
  RiTwitterFill,
  RiGithubFill,
  RiInstagramFill,
  RiWhatsappFill,
} from "react-icons/ri";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
const theme: any = atomDark;

const Page: NextPage<{ data: any }> = ({ data }) => {
  let SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
  return (
    <>
      <Header fixed={true} />
      <Head>
        <title>{`${data.name} - TajulTonim`}</title>
        <link
          rel="canonical"
          href={"https://" + SITE_URL + "/author/" + data.username}
        />
      </Head>
      <div className="flex flex-col w-full items-center mt-14 ">
        <div
          className=" w-full h-28"
          style={{ backgroundColor: data.color }}
        ></div>
        <div className="container max-w-4xl mx-2 -mt-12 ">
          <main className=" mt-2 mb-2 w-full bg-white rounded-lg py-10 shadow">
            <div className=" flex flex-col items-center">
              <div
                className="relative h-[7rem] w-[7rem]  rounded-full -mt-24 border-[6px] flex justify-center items-center"
                style={{ borderColor: data.color, background: data.color }}
              >
                <Image
                  layout="fill"
                  className="rounded-full"
                  alt={data.name}
                  src={data.display_profile}
                />
              </div>
              <h1 className="text-2xl my-3 mt-5 font-black">{data.name}</h1>
              <div className=" flex w-full justify-center align-center">
              <div className=" w-full mt-2">{data.bio}</div>
              <div className=" w-full my-2 flex gap-3">
                {data.location && (
                  <PCard str={data.location} Icon={HiLocationMarker} />
                )}
                {data.created_at && (
                  <PCard
                    str={
                      "Joined on " +
                      new Intl.DateTimeFormat("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }).format(new Date(data.created_at))
                    }
                    Icon={RiCake2Fill}
                  />
                )}
                {data.website_url && (
                  <Link
                    target="_blank"
                    href={data.website_url}
                  >
                    <div className=" h-5 flex text-xs items-center text-gray-600 hover:text-blue-600">
                      <RiExternalLinkLine className=" w-4 h-4" />
                      <p className=" ml-2"> {data.website_url}</p>
                    </div>
                  </Link>
                )}
                </div><div className=" w-full flex gap-3 mb-8">
                <div className=" flex gap-1">
                  {data.facebook && (
                    <SocialCard
                      url={"https://facebook.com/" + data.facebook}
                      Icon={RiFacebookCircleFill}
                    />
                  )}
                  {data.twitter && (
                    <SocialCard
                      url={"https://twitter.com/" + data.twitter}
                      Icon={RiTwitterFill}
                    />
                  )}
                  {data.github && (
                    <SocialCard
                      url={"https://github.com/" + data.twitter}
                      Icon={RiGithubFill}
                    />
                  )}
                  {data.instagram && (
                    <SocialCard
                      url={"https://instagram.com/" + data.twitter}
                      Icon={RiInstagramFill}
                    />
                  )}
                  {data.whatsapp && (
                    <SocialCard
                      url={"https://wa.me/" + data.whatsapp}
                      Icon={RiWhatsappFill}
                    />
                  )}
                </div>
                  </div>
              </div>
            </div>
            <div className=" border-t px-36 pt-6 flex justify-around  gap-2">
              {data.work && (
                <div className=" flex flex-col items-center">
                  <p className=" font-semibold text-xs text-gray-600">Work</p>
                  <p className=" text-xs ">{data.work}</p>
                </div>
              )}
              {data.education && (
                <div className=" flex flex-col items-center">
                  <p className=" font-semibold text-xs text-gray-600">
                    Education
                  </p>
                  <p className=" text-xs ">{data.education}</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

const SocialCard = ({ url, Icon }: { url: string; Icon: any }) => {
  return (
    <Link href={url} target="_blank">
      <Icon className="h-5 w-5 hover:text-blue-500 text-gray-600" />
    </Link>
  );
};

const PCard = ({ str, Icon }: { str: string; Icon: any }) => {
  return (
    <div className=" flex text-xs items-center text-gray-600">
      <Icon className=" w-5 h-5" />
      <p className=" ml-1"> {str}</p>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    let { data, error } = await supabase.from("author").select("username");

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
      .from("author")
      .select("*")
      .eq("username", context.params?.username)
      .single();

    if (error || !data) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        data: data,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default Page;
