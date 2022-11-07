import { NextPage } from "next";
import Head from "next/head";
import DashboardLayout from "../../components/Layout/DashboardLayout";

const Dashboard: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dashboard | TajulTonim</title>
      </Head>
      <DashboardLayout pageId="dashboard">
        <div className="">comming soon...</div>
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
