import { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/legacy/image";
import DashboardLayout from "../../../components/Layout/DashboardLayout";
import supabase from "../../../supabase/init";
import { FaEdit } from "react-icons/fa";
import Link from "next/link";

interface Props {
  posts: PostType[];
}

interface PostType {
  id: string;
  title: string;
  description: string;
  cover: string;
  created_at: string;
  author: {
    name: string;
  };
}

const Posts: NextPage<Props> = ({ posts }) => {
  return (
    <>
      <Head>
        <title>Posts | TajulTonim</title>
      </Head>
      <DashboardLayout pageId="posts">
        <div className=" flex w-full justify-end">
          <Link href="posts/new">
            <button className=" bg-blue-500 text-white rounded p-2 mt-4 hover:bg-blue-400">
              Create New
            </button>
          </Link>
        </div>
        <div className=" mt-2 grid gap-2">
          {posts.map((p) => (
            <Post
              key={p.id}
              title={p.title}
              cover={p.cover}
              description={p.description}
              id={p.id}
              created_at={p.created_at}
              author={p.author}
            />
          ))}
        </div>
      </DashboardLayout>
    </>
  );
};

const Post = ({
  title,
  description,
  cover,
  id,
  created_at,
  author,
}: PostType) => {
  return (
    <>
      <div className=" mt-2 flex overflow-hidden w-full bg-white rounded p-2 hover:shadow-sm hover:bg-blue-50 cursor-pointer relative group">
        <Link href={"/admin/posts/edit/" + id}>
          <FaEdit className="absolute z-10 top-2 right-2 text-gray-400 opacity-0 group-hover:opacity-100 duration-100 hover:text-gray-700" />
        </Link>
        <div className="relative h-20 aspect-video">
          <Image
            alt=""
            className="rounded"
            src={cover}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className=" pl-2 flex-1 ">
          <div className=" line-clamp-1 font-semibold">{title}</div>
          <div className="text-xs">
            {author.name} •{" "}
            {new Intl.DateTimeFormat("en-GB").format(new Date(created_at))}
          </div>
          <div className=" line-clamp-[2] text-sm ">{description}</div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  let { data, error } = await supabase
    .from("posts")
    .select("title,description,id,cover,author(name),created_at");
  return {
    props: {
      posts: data,
    },
  };
};

export default Posts;
