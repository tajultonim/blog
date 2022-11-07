import { decodeJwt } from "jose";
import cookie from "cookie";

type Session = {
  id: string;
  created_at: string;
  username: string;
  name: string;
  display_profile?: string;
  bio?: string;
  website_url?: string;
  location?: string;
  email: string;
  facebook?: string;
  twitter?: string;
  github?: string;
  instagram?: string;
  whatsapp?: string;
  learning?: string;
  working_on?: string;
  skills?: string;
  work?: string;
  education?: string;
  color?: string;
  admin?: boolean;
};

const getSession = (cookieStr: string) => {
  let session = decodeJwt(cookie.parse(document.cookie)["access_token"])
    .claims as Session;
  return session;
};

export default getSession;
