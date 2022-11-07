import { NextPage } from "next";
import Head from "next/head";
import DashboardLayout from "../../components/Layout/DashboardLayout";

const Pages: NextPage = () => {
  return (
    <>
      <Head>
        <title>Pages | TajulTonim</title>
      </Head>
      <DashboardLayout pageId="pages">
        <div className="">comming soon...</div>
      </DashboardLayout>
    </>
  );
};

export default Pages;
