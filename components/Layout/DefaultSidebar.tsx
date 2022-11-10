import { FC } from "react";
import SidebarOption from "./SidebarOption";
import SocialLink from "./SocialLink";
import {
  FcHome,
  FcSupport,
  FcAbout,
  FcVoicePresentation,
  FcPrivacy,
} from "react-icons/fc";

import {
  FaTwitter,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

interface TagType {
  id: string;
  title: string;
  description: string;
  cover: string;
  color: string;
}

const Sidebar: FC<{ tags?: TagType[] }> = ({ tags }) => {
  return (
    <>
      <SidebarOption Icon={FcHome} title="Home" dest="/" />
      <SidebarOption Icon={FcAbout} title="About" dest="/about" />
      <SidebarOption
        Icon={FcVoicePresentation}
        title="Contact"
        dest="/contact"
      />
      <SidebarOption Icon={FcPrivacy} title="Privacy Policy" dest="/privacy" />
      <SidebarOption Icon={FcSupport} title="Report" dest="/report" />
      <div className=" flex w-full justify-around mt-2">
        <SocialLink
          name="Twitter"
          Icon={FaTwitter}
          dest="https://twitter.com/tajultonim"
        />
        <SocialLink
          name="Facebook"
          Icon={FaFacebook}
          dest="https://facebook.com/tajultonim"
        />
        <SocialLink
          name="Github"
          Icon={FaGithub}
          dest="https://github.com/tajultonim"
        />
        <SocialLink
          name="Instagram"
          Icon={FaInstagram}
          dest="https://instagram.com/tajultonim"
        />
        <SocialLink
          name="Whatsapp"
          Icon={FaWhatsapp}
          dest="https://wa.me/8801878613436"
        />
      </div>
      <div className=" mt-2 mb-1 font-semibold">Popular Tags</div>
      <div className="overflow-y-scroll scrollbar scrollbar-track-gray-50 scrollbar-w-thin scrollbar-thumb-gray-300 h-[30rem]">
        {tags ? (
          tags
            .map((t) => t.title)
            .map((tag) => (
              <SidebarOption key={tag} title={"#" + tag} dest={"/t/" + tag} />
            ))
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Sidebar;
