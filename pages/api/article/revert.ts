import type { NextApiRequest, NextApiResponse } from "next";
import verifier from "../../../jwt/jwtverifier";
import supabase from "../../../supabase/init";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let body = JSON.parse(req.body);
    if (req.method != "PATCH") {
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

    let opres = await supabase
      .from("posts")
      .select("*")
      .eq("id", body.id)
      .single();

    let opost = opres.data;

    let np = {
      draft_content: opost.content,
      draft_title: opost.title.replace(/(\r\n|\n|\r)/gm, ""),
      draft_cover: opost.cover,
      draft_slug: opost.slug,
      draft_description: opost.description.replace(/(\r\n|\n|\r)/gm, ""),
      updated_at: new Date().toISOString(),
      hasdraft: false,
    };
    let npres = await supabase
      .from("posts")
      .update(np)
      .eq("author_id", verres.payload.claims.id)
      .eq("id", body.id)
      .select();

    if (opres.error || npres.error) {
      console.log("operr", opres.error, "nperr", npres);
      return res
        .status(500)
        .json({ status: "error", code: 500, message: "Something went wrong!" });
    }
    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Draft reverted successfully",
      data: npres.data,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ code: 500, status: "error", message: "Something went wrong!" });
  }
}
