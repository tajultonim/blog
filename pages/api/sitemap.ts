import type { NextApiRequest, NextApiResponse } from "next";
import supabase from "../../supabase/init";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Content-Type", "text/xml");
  res.setHeader("Cache-Control", "s-maxage=600");
  res.statusCode = 200;
  let postres = await supabase
    .from("posts")
    .select("slug,edited_at,created_at")
    .eq("ispublished", true);
  let tagres = await supabase.from("tags").select("created_at,title");
  let pageres = await supabase
    .from("pages")
    .select("slug,edited_at,created_at")
    .eq("ispublished", true);
  let xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"><url><loc>https://${
    process.env.SITE_URL
  }</loc><lastmod>${new Date().toISOString()}</lastmod></url>`;
  postres.data?.forEach((post) => {
    xml += `
    <url>
        <loc>https://${process.env.SITE_URL + "/post/" + post.slug}</loc>
        <lastmod>${
          post.edited_at
            ? new Date(post.edited_at).toISOString()
            : new Date(post.created_at).toISOString()
        }</lastmod>
    </url>`;
  });

  tagres.data?.forEach((tag) => {
    xml += `
    <url>
        <loc>https://${process.env.SITE_URL + "/t/" + tag.title}</loc>
        <lastmod>${new Date(tag.created_at).toISOString()}</lastmod>
    </url>`;
  });

  pageres.data?.forEach((page) => {
    xml += `
    <url>
        <loc>https://${process.env.SITE_URL + "/p/" + page.slug}</loc>
        <lastmod>${
          page.edited_at
            ? new Date(page.edited_at).toISOString()
            : new Date(page.created_at).toISOString()
        }</lastmod>
    </url>`;
  });
  xml += `</urlset>`;

  res.end(xml);
}
