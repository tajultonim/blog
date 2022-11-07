import * as jose from "jose";

interface Payload extends jose.JWTPayload {
  claims?: {
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
  type?: string;
}

interface JWTVerifyRes extends jose.JWTVerifyResult {
  payload: Payload;
}

export default async function verifier(token: string) {
  try {
    const publicKey = await jose.importJWK(
      JSON.parse(process.env.JWT_PUBLIC_KEY as string),
      "RS256"
    );
    const jwtVerRes: JWTVerifyRes = await jose.jwtVerify(token, publicKey);
    return { status: "success", payload: jwtVerRes.payload };
  } catch (error: any) {
    if (error.code == "ERR_JWT_EXPIRED") {
      return { status: "expired" };
    }
    return { status: "error" };
  }
}
