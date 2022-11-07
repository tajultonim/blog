import Header from "../Header";
import { FC, ReactNode } from "react";

const PostLayout: FC<{
  children: ReactNode;
  Sidebar: ReactNode;
  Rightbar: ReactNode;
}> = ({ children, Sidebar, Rightbar }) => {
  return (
    <>
      <Header fixed={true} />
      <div className="flex w-full justify-center mt-12">
        <div className="container grid lg:grid-cols-12 grid-cols-7 gap-2  h-10 max-w-5xl mx-2">
          <div className=" hidden sm:block left-sidebar lg:col-span-1 col-span-1 ">
            {Sidebar}
          </div>
          <main className="mb-4 mt-2 lg:col-span-8 sm:col-span-6 col-span-7 ">
            {children}
          </main>
          <div className=" right-sidebar lg:col-span-3 hidden lg:block ">
            {Rightbar}
          </div>
        </div>
      </div>
    </>
  );
};

export default PostLayout;
