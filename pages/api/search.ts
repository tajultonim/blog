import type { NextApiRequest, NextApiResponse } from "next";
import verifier from "../../jwt/jwtverifier";
import supabase from "../../supabase/init";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method != "GET") {
      return res
        .status(403)
        .json({ code: 403, status: "error", message: "Method not allowed!" });
    }

    if (!req.query.q) {
      return res.status(400).json({ message: "Bad request!" });
    }

    let { data, error } =
      req.query.type == "posts"
        ? await supabase
            .from("posts")
            .select(
              "title,slug,created_at,word,tags(title,color),author(name,display_profile,username)"
            )
            .textSearch("title", `'${req.query.q as string}'`)
        : await supabase
            .from("tags")
            .select("title,color")
            .textSearch("title", req.query.q as string);

    if (error) {
      return res
        .status(500)
        .json({ status: "error", code: 500, message: "Something went wrong!" });
    }

    res.setHeader("Cache-Control", "s-maxage=86400");

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Search fetched successfully",
      data,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ code: 500, status: "error", message: "Something went wrong!" });
  }
}
