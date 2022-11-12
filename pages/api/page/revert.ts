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
    if (verres.status != "success" || !verres.payload?.claims?.admin) {
      return res.status(401).json({ message: "Invalid token!" });
    }

    let opage = await supabase
      .from("pages")
      .select("slug,title,description,content")
      .eq("id", body.id)
      .single();

    if (opage.error || !opage.data) {
      console.log(opage.error);
      return res
        .status(500)
        .json({ status: "error", code: 500, message: "Something went wrong!" });
    }

    let npage = {
      draft_slug: opage.data.slug,
      draft_title: opage.data.title,
      draft_description: opage.data.description,
      draft_content: opage.data.content,
      edited_at: new Date().toISOString(),
      hasdraft: true,
    };

    const { data, error } = await supabase
      .from("pages")
      .update(npage)
      .eq("id", body.id)
      .select("*")
      .single();

    if (error || !data) {
      console.log(error);
      return res
        .status(500)
        .json({ status: "error", code: 500, message: "Something went wrong!" });
    }

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Page reverted successfully",
      data,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ code: 500, status: "error", message: "Something went wrong!" });
  }
}
