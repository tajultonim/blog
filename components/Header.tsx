import { FC } from "react";
import Image from "next/legacy/image";
import { BsSearch } from "react-icons/bs";
import Link from "next/link";

const Header: FC<{ fixed?: boolean }> = ({ fixed }) => {
  return (
    <>
      <header
        className={`bg-white z-10 flex w-full h-14 py-1 items-center justify-center px-1 border-b ${
          fixed ? "fixed top-0" : ""
        }`}
      >
        <div className="w-full h-full max-w-6xl justify-between items-center">
          <div className=" header-left-element flex h-full py-1">
            <Link href="/">
              <div className=" relative w-16 h-9 ml-2 mr-2">
                <Image
                  alt="tt"
                  src="/icon.svg"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </Link>
            <div className=" w-1/2 max-w-sm relative flex items-center rounded-md">
              <input
                type="text"
                id="voice-search"
                className="border pr-10 h-9 rounded-md border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-blue-500"
                placeholder="Search"
              />
              <button
                type="button"
                aria-label="search"
                className="flex h-[calc(2.25rem-3px)] hover:bg-slate-200 rounded-r-md absolute inset-y-0 right-0 items-center pr-3 pl-3 mt-[3px] mr-[1px]"
              >
                <BsSearch />
              </button>
            </div>
          </div>
          <div className=" header-right-element"></div>
        </div>
      </header>
    </>
  );
};

export default Header;
