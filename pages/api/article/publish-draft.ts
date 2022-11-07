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
      .eq("author_id", verres.payload.claims.id)
      .eq("id", body.id)
      .single();

    let opost = opres.data;
    if (opost.author_id != verres.payload?.claims?.id) {
      return res.status(401).json({ message: "Not authorized!" });
    }
    let np = {
      title: opost.draft_title.replace(/(\r\n|\n|\r)/gm, ""),
      content: opost.draft_content,
      cover: opost.draft_cover,
      slug: opost.draft_slug,
      description: opost.draft_description.replace(/(\r\n|\n|\r)/gm, ""),
      draft_content: null,
      draft_title: null,
      draft_cover: null,
      draft_slug: null,
      draft_description: null,
      edited_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
      hasdraft: false,
      ispublished: true,
    };
    let npres = await supabase
      .from("posts")
      .update(np)
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
      message: "Draft published successfully",
      data: npres.data,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ code: 500, status: "error", message: "Something went wrong!" });
  }
}
