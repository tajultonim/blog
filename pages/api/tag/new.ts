import type { NextApiRequest, NextApiResponse } from "next";
import verifier from "../../../jwt/jwtverifier";
import supabase from "../../../supabase/init";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let body = JSON.parse(req.body);
    if (req.method != "POST") {
      return res
        .status(403)
        .json({ code: 403, status: "error", message: "Method not allowed!" });
    }

    if (!body.title || !body.description || !body.cover || !body.color) {
      return res.status(400).json({ message: "Bad request!" });
    }

    let token = req.cookies["access_token"] as string;
    let verres = await verifier(token);
    if (verres.status != "success" || !verres.payload?.claims?.admin) {
      return res.status(401).json({ message: "Invalid token!" });
    }

    const { data, error } = await supabase.from("tags").insert([
      {
        title: body.title
          .toLowerCase()
          .replace(/[^\w]/g, " ")
          .replace(/\s\s+/g, " ")
          .trim()
          .replace(/" "/g, "-"),
        cover: body.cover,
        description: body.description,
        color: body.color,
      },
    ]);
    if (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: "error", code: 500, message: "Something went wrong!" });
    }
    console.log(data);
    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Tag created successfully",
      data,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ code: 500, status: "error", message: "Something went wrong!" });
  }
}
