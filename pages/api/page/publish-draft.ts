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
    if (verres.status != "success" || !verres.payload?.claims?.admin) {
      return res.status(401).json({ message: "Invalid token!" });
    }

    let opage = await supabase
      .from("pages")
      .select("*")
      .eq("id", body.id)
      .single();

    if (opage.error || !opage.data) {
      console.log(opage.error);
      return res
        .status(500)
        .json({ status: "error", code: 500, message: "Something went wrong!" });
    }

    let npage = {
      draft_slug: null,
      draft_title: null,
      draft_description: null,
      draft_content: null,
      slug: opage.data.draft_slug,
      title: opage.data.draft_title,
      description: opage.data.draft_description,
      content: opage.data.draft_content,
      edited_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
      hasdraft: false,
      ispublished: true,
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

    try {
      await res.revalidate("/p/" + opage.data.slug);
    } catch (error) {
      console.log(error);
    }

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Page published successfully",
      data,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ code: 500, status: "error", message: "Something went wrong!" });
  }
}
