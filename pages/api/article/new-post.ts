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

    if (!body.content || !body.title || !body.cover) {
      console.log(body);

      return res.status(400).json({ message: "Bad request!" });
    }

    let token = req.cookies["access_token"] as string;
    let verres = await verifier(token);
    if (verres.status != "success") {
      return res.status(401).json({ message: "Invalid token!" });
    }

    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          content: body.content,
          draft_content: null,
          draft_title: null,
          draft_cover: null,
          draft_slug: null,
          draft_description: null,
          title: body.title.replace(/(\r\n|\n|\r)/gm, ""),
          slug:
            body.slug ||
            body.title
              .toLowerCase()
              .replace(/[^\w]/g, " ")
              .replace(/\s\s+/g, " ")
              .trim()
              .replace(/ /g, "-"),
          cover: body.cover,
          description:
            body.description ||
            body.content.slice(0, 200).replace(/(\r\n|\n|\r)/gm, ""),
          author_id: verres.payload?.claims?.id,
          word: body.content.split(" ").length,
          published_at: new Date().toISOString(),
          edited_at: new Date().toISOString(),
          ispublished: true,
          hasdraft: false,
        },
      ])
      .select("id");

    if (error || !data[0]) {
      console.log(error);
      return res
        .status(500)
        .json({ status: "error", code: 500, message: "Something went wrong!" });
    }
    if (body.tags.length) {
      let tres = await supabase.from("posts_tags").upsert(
        body.tags.slice(0,4).map((id: string) => {
          return { post_id: data[0].id, tag_id: id };
        })
      );
      if (tres.error) {
        console.log(tres.error);
      }
    }
    console.log(data);
    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Post published successfully",
      data,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ code: 500, status: "error", message: "Something went wrong!" });
  }
}
