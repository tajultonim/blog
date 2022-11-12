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

    if (
      !body.content ||
      !body.title ||
      !body.slug ||
      !body.description ||
      !body.id
    ) {
      console.log(body);
      return res.status(400).json({ message: "Bad request!" });
    }

    let token = req.cookies["access_token"] as string;
    let verres = await verifier(token);
    if (verres.status != "success" || !verres.payload?.claims?.admin) {
      return res.status(401).json({ message: "Invalid token!" });
    }

    const { data, error } = await supabase
      .from("pages")
      .update({
        draft_content: body.content,
        draft_title: body.title.replace(/(\r\n|\n|\r)/gm, ""),
        draft_slug: body.slug,
        draft_description: body.description.replace(/(\r\n|\n|\r)/gm, ""),
        edited_at: new Date().toISOString(),
        hasdraft: true,
      })
      .eq("id", body.id)
      .select("id,slug")
      .single();

    if (error || !data) {
      console.log(error);
      return res
        .status(500)
        .json({ status: "error", code: 500, message: "Something went wrong!" });
    }

    try {
      await res.revalidate("/p/" + data.slug);
    } catch (error) {
      console.log(error);
    }

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Page draft saved successfully",
      data,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ code: 500, status: "error", message: "Something went wrong!" });
  }
}
