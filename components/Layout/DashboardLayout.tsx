import { FC, PropsWithChildren, ReactNode } from "react";
import Image from "next/legacy/image";
import Link from "next/link";
import { AiFillAppstore } from "react-icons/ai";
import { IoMdAnalytics, IoMdWallet } from "react-icons/io";
import { HiChartPie } from "react-icons/hi";
import { RiPagesFill, RiSettings3Fill, RiImageFill } from "react-icons/ri";
import { FaMailBulk } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { BsFillTagFill } from "react-icons/bs";

const DashboardLayout: FC<{
  children: ReactNode;
  pageId: string;
  Header?: FC;
}> = ({ children, pageId, Header }) => {
  return (
    <>
      <div className="flex w-full justify-center">
        <div className="container grid grid-cols-5 gap-3  h-10 max-w-7xl">
          <div className="  left-sidebar col-span-1  bg-white h-full rounded-l-2xl min-h-screen">
            <Sidebar>
              <SidebarOption
                Icon={AiFillAppstore}
                title="Dashboard"
                active={pageId == "dashboard"}
                dest="/admin/dashboard"
              />
              <SidebarOption
                Icon={IoMdAnalytics}
                title="Report Annual"
                active={pageId == "report"}
                dest="/admin/report"
              />
              <SidebarOption
                Icon={HiChartPie}
                title="Posted"
                active={pageId == "posts"}
                dest="/admin/posts"
              />
              <SidebarOption
                Icon={RiPagesFill}
                title="Page"
                active={pageId == "pages"}
                dest="/admin/pages"
              />
              <SidebarOption
                Icon={RiImageFill}
                title="Images"
                active={pageId == "images"}
                dest="/admin/images"
              />
              <SidebarOption
                Icon={BsFillTagFill}
                title="Tags"
                active={pageId == "tags"}
                dest="/admin/tags"
              />
              <SidebarOption
                Icon={FaMailBulk}
                title="Newsletter"
                active={pageId == "newsletter"}
                dest="/admin/newsletter"
              />
              <SidebarOption
                Icon={IoMdWallet}
                title="Earning"
                active={pageId == "earning"}
                dest="/admin/earning"
              />
              <SidebarOption
                Icon={RiSettings3Fill}
                title="Setting"
                active={pageId == "setting"}
                dest="/admin/setting"
              />
            </Sidebar>
          </div>
          <main className=" mt-6 mb-2 md:col-span-3 col-span-4 flex flex-col px-4 max-h-screen overflow-hidden">
            <div className=" ">
              {Header && <Header />}
              {!Header && (
                <div className="searchbar w-full flex items-center">
                  <div className=" ml-10 h-5 w-[.12rem] z-10 bg-blue-500 rounded" />
                  <input
                    className=" -ml-10 w-full bg-white outline-none rounded-md p-2 pl-12"
                    placeholder="Search Article"
                  />
                  <FiSearch className=" -ml-7 cursor-pointer text-blue-500" />
                </div>
              )}
            </div>
            {children}
          </main>
          <div className=" right-sidebar  col-span-1 hidden md:block"></div>
        </div>
      </div>
    </>
  );
};

const Sidebar = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className=" w-full flex justify-center my-2">
        <div className=" relative w-16 h-9 ml-2 mr-2 ">
          <Image alt="tt" src="/icon.svg" layout="fill" objectFit="contain" />
        </div>
      </div>
      {children}
    </>
  );
};

const SidebarOption = ({
  Icon,
  title,
  active,
  dest,
}: {
  Icon: any;
  title: string;
  active: boolean;
  dest: string;
}) => {
  return (
    <>
      <Link href={dest}>
        <div className=" px-4 py-1">
          <div
            className={`flex hover:shadow-lg cursor-pointer items-center p-5 py-[0.95rem] rounded ${
              active
                ? "bg-blue-500 text-white shadow-lg"
                : " text-gray-500 hover:bg-blue-100"
            }`}
          >
            <Icon className="h-5 w-5" />
            <p className="pl-5 text-sm">{title}</p>
          </div>
        </div>
      </Link>
    </>
  );
};

export default DashboardLayout;
