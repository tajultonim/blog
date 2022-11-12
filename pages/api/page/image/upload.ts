import type { NextApiRequest, NextApiResponse } from "next";
import verifier from "../../../../jwt/jwtverifier";
import { UploadApiOptions, v2 as cloudinary } from "cloudinary";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method != "POST") {
      return res.status(403).json({ message: "Method not allowed!" });
    }
    if (!req.body.file) {
      return res.status(400).json({ message: "Bad request!" });
    }
    let token = req.cookies["access_token"] as string;
    let verres = await verifier(token);
    if (verres.status != "success" || !verres.payload?.claims?.admin) {
      return res.status(401).json({ message: "Invalid token!" });
    }

    console.log(req.body);

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    cloudinary.config({
      secure: true,
    });

    const options: UploadApiOptions = {
      upload_preset: "pageimg",
    };

    const result = await cloudinary.uploader.upload(req.body.file, options);
    //console.log(result);

    return res
      .status(200)
      .json({ code: 200, status: "success", url: result.secure_url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong!" });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
