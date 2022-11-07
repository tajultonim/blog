import { FC } from "react";
import Link from "next/link";

const SidebarOption: FC<{
  Icon?: any;
  title: string;
  dest: string;
}> = ({ Icon, title, dest }) => {
  return (
    <Link href={dest}>
      <div className=" group flex w-full items-center hover:bg-slate-200 rounded-sm py-1.5 pl-2">
        {Icon && <Icon />}
        <p className="  ml-1 text-gray-700">{title}</p>
      </div>
    </Link>
  );
};

export default SidebarOption;
