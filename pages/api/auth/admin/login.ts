import type { NextApiRequest, NextApiResponse } from "next";
import supabase from "../../../../supabase/init";
const bcrypt = require("bcrypt");
import { serialize } from "cookie";
import * as jose from "jose";


export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method != "POST") {
    return res.status(405).send("Method not allowed");
  }
  let email = req.body.email;
  let password = req.body.password;

  let { data, error } = await supabase
    .from("author")
    .select("*")
    .eq("email", email);

  if (error) {
    return res.status(500).send("Something went wrong");
  }

  if (!data?.length) {
    return res.status(401).json({
      status: "error",
      message: "Invalid email password combination!",
    });
  }

  let userpasshash = data![0].password;

  let claims = data![0];
  delete claims["password"];

  const privateKey = await jose.importJWK(
    JSON.parse(process.env.JWT_PRIVATE_KEY as string),
    "RS256"
  );
  const access_token = await new jose.SignJWT({
    type: "access_token",
    claims,
  })
    .setProtectedHeader({
      typ: "JWT",
      alg: "RS256",
    })
    .setSubject(claims.id)
    .setExpirationTime(Date.now() / 1000 + 60 * 60 * 24 * 30)
    .setIssuedAt()
    .sign(privateKey);

  await bcrypt.compare(
    password,
    userpasshash,
    function (err: any, result: boolean) {
      if (err) {
        return res.status(500).send("Something went wrong");
      }
      if (result) {
        res.setHeader(
          "Set-Cookie",
          serialize("access_token", access_token, { path: "/" })
        );
        res.status(200).json({ status: "success" });
      } else {
        return res.status(401).json({
          status: "error",
          message: "Invalid email password combination!",
        });
      }
    }
  );
}
