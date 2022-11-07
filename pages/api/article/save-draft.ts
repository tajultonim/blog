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

    if (!body.content || !body.title || !body.cover || !body.id) {
      return res.status(400).json({ message: "Bad request!" });
    }

    let token = req.cookies["access_token"] as string;
    let verres = await verifier(token);
    if (verres.status != "success" || !verres.payload?.claims?.id) {
      return res.status(401).json({ message: "Invalid token!" });
    }
    let npres = await supabase
      .from("posts")
      .update({
        draft_content: body.content,
        draft_title: body.title.replace(/(\r\n|\n|\r)/gm, ""),
        draft_cover: body.cover,
        draft_slug:
          body.slug ||
          body.title
            .toLowercase()
            .replace(/[^\w]/g, " ")
            .replace(/\s\s+/g, " ")
            .trim()
            .replace(/" "/g, "-"),
        draft_description: body.description || body.content.slice(0, 200).replace(/(\r\n|\n|\r)/gm, ""),
        edited_at: new Date().toISOString(),
        hasdraft: true,
      })
      .eq("id", body.id)
      .eq("author_id", verres.payload.claims.id)
      .select();

    if (npres.error) {
      // console.log("nperr", npres);
      return res
        .status(500)
        .json({ status: "error", code: 500, message: "Something went wrong!" });
    }
    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Draft saved successfully",
      data: npres.data,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ code: 500, status: "error", message: "Something went wrong!" });
  }
}
