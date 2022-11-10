import { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/legacy/image";
import DashboardLayout from "../../../components/Layout/DashboardLayout";
import supabase from "../../../supabase/init";
import { FaEdit } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/router";

interface Props {
  tags: TagType[];
}

interface TagType {
  id: string;
  title: string;
  description: string;
  cover: string;
  color: string;
}

const Tags: NextPage<Props> = ({ tags }) => {
  return (
    <>
      <Head>
        <title>Tags | TajulTonim</title>
      </Head>
      <DashboardLayout pageId="tags">
        <div className=" flex w-full justify-end">
          <Link href="/admin/tags/new">
            <button className=" bg-blue-500 text-white rounded p-2 mt-4 hover:bg-blue-400">
              Create New
            </button>
          </Link>
        </div>
        <div className=" mt-2 grid gap-2">
          {tags.map((t) => (
            <Tag
              key={t.id}
              title={t.title}
              cover={t.cover}
              description={t.description}
              id={t.id}
              color={t.color}
            />
          ))}
        </div>
      </DashboardLayout>
    </>
  );
};

const Tag = ({ title, description, cover, id, color }: TagType) => {
  return (
    <>
      <div className=" mt-2 flex overflow-hidden w-full bg-white rounded items-center p-2 hover:shadow-sm hover:bg-blue-50 cursor-pointer relative group">
        <Link href={"/admin/tags/edit/" + id}>
          <FaEdit className="absolute z-10 top-2 right-2 text-gray-400 opacity-0 group-hover:opacity-100 duration-100 hover:text-gray-700" />
        </Link>
        <div className="relative h-20 aspect-square">
          <Image
            alt=""
            className="rounded"
            src={cover}
            layout="fill"
            objectFit="contain"
          />
        </div>
        <div className=" pl-2 flex-1 ">
          <div className=" line-clamp-1 font-semibold">
            <span style={{ color: color }}>#</span>
            {title}
          </div>
          <div className=" line-clamp-[2] text-sm ">{description}</div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  let { data, error } = await supabase
    .from("tags")
    .select("title,description,id,cover,color")
    .order("title", { ascending: true });
  return {
    props: {
      tags: data,
    },
  };
};

export default Tags;
