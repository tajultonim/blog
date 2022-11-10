import type { NextApiRequest, NextApiResponse } from "next";
import verifier from "../../../jwt/jwtverifier";
import supabase from "../../../supabase/init";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let body = JSON.parse(req.body);
    if (req.method != "DELETE") {
      return res
        .status(403)
        .json({ code: 403, status: "error", message: "Method not allowed!" });
    }
    if (!body.id) {
      return res.status(400).json({ message: "Bad request!" });
    }

    let token = req.cookies["access_token"] as string;
    let verres = await verifier(token);
    if (verres.status != "success" || !verres.payload?.claims?.id) {
      return res.status(401).json({ message: "Invalid token!" });
    }

    const delrel = await supabase
      .from("posts_tags")
      .delete()
      .eq("post_id", body.id);

    const { data, error } = await supabase
      .from("posts")
      .delete()
      .eq("author_id", verres.payload?.claims.id)
      .eq("id", body.id);
    if (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: "error", code: 500, message: "Something went wrong!" });
    }

    let revalidateres = await fetch(
      "https://" +
        process.env.VERCEL_URL +
        "/api/revalidate?token=" +
        process.env.SITE_SECRET_TOKEN +
        "&path=" +
        encodeURIComponent("/post/" + body.slug)
    ).then((r) => r.json());

    if (!revalidateres.revalidated) {
      return res.status(201).json({
        status: "success",
        code: 200,
        message: "Success with revalidation error!",
      });
    }

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Draft deleted successfully",
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ code: 500, status: "error", message: "Something went wrong!" });
  }
}
