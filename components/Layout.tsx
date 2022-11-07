import Header from "./Header";
import { FC, ReactNode } from "react";

const Layout:FC<{children:ReactNode,Sidebar:ReactNode}> = ({ children, Sidebar }) => {
  return (
    <>
      <Header />
      <div className="flex w-full justify-center">
        <div className="container grid lg:grid-cols-5 grid-cols-7 gap-2  h-10 max-w-5xl mx-2">
          <div className=" hidden sm:block left-sidebar lg:col-span-1 col-span-2 mt-1 ">
            {Sidebar}
          </div>
          <main className=" mt-2 mb-2 lg:col-span-3 sm:col-span-5 col-span-7 ">
            {children}
          </main>
          <div className=" right-sidebar lg:col-span-1 hidden lg:block "></div>
        </div>
      </div>
    </>
  );
};

export default Layout;
