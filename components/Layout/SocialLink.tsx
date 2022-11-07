import { FC } from "react";
import Link from "next/link";

const SocialLink: FC<{
  Icon: any;
  dest: string;
  name: string;
}> = ({ Icon, dest, name }) => {
  return (
    <Link href={dest} target="_blank" aria-label={name} rel="nofollow">
      <div className=" group hover:bg-slate-200 h-7 w-7 rounded-sm flex justify-center items-center">
        <Icon className=" fill-gray-700 group-hover:fill-blue-500 h-5 w-5" />
      </div>
    </Link>
  );
};

export default SocialLink;
