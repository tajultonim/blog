import { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/legacy/image";
import DashboardLayout from "../../../components/Layout/DashboardLayout";
import supabase from "../../../supabase/init";
import { FaEdit } from "react-icons/fa";
import Link from "next/link";

interface Props {
  pages: PageType[];
}

interface PageType {
  id: string;
  title: string;
  description: string;
}

const Pages: NextPage<Props> = ({ pages }) => {
  return (
    <>
      <Head>
        <title>Pages | TajulTonim</title>
      </Head>
      <DashboardLayout pageId="pages">
        <div className=" flex w-full justify-end">
          <Link href="/admin/pages/new">
            <button className=" bg-blue-500 text-white rounded p-2 mt-4 hover:bg-blue-400">
              Create New
            </button>
          </Link>
        </div>
        <div className=" mt-2 grid gap-2">
          {pages.map((p) => (
            <Page
              key={p.id}
              title={p.title}
              description={p.description}
              id={p.id}
            />
          ))}
        </div>
      </DashboardLayout>
    </>
  );
};

const Page = ({ title, description, id }: PageType) => {
  return (
    <>
      <div className=" mt-2 flex overflow-hidden w-full bg-white rounded p-2 hover:shadow-sm hover:bg-blue-50 cursor-pointer relative group">
        <div className="flex gap-3">
          <p className=" text-5xl p-2 bg-blue-100 h-16 w-16 rounded text-center">
            {title.slice(0, 1)}
          </p>
          <div className=" flex flex-col justify-center">
            <p className=" text-lg font-semibold">{title}</p>
            <p className=" -mt-1">{description}</p>
          </div>
        </div>
        <Link href={"/admin/pages/edit/" + id}>
          <FaEdit className="absolute z-10 top-2 right-2 text-gray-400 opacity-0 group-hover:opacity-100 duration-100 hover:text-gray-700" />
        </Link>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  let { data, error } = await supabase
    .from("pages")
    .select("title,description,id")
    .order("title", { ascending: true });
  return {
    props: {
      pages: data || [],
    },
  };
};

export default Pages;
