import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/src/lib/prisma";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resumeId = Number(id);

    if (!Number.isInteger(resumeId)) {
      return new Response("Invalid resume ID", {
        status: 400,
      });
    }

    const resume = await prisma.resume.findUnique({
      where: {
        id: resumeId,
      },
    });

    if (!resume || !resume.isVisible) {
      return new Response("Resume not found", {
        status: 404,
      });
    }

    if (!resume.assetId) {
      return new Response("Resume asset is not available", {
        status: 404,
      });
    }

    console.log("RESUME ASSET ID:", resume.assetId);

    const timestamp = Math.floor(Date.now() / 1000);

    const paramsToSign = {
      asset_id: resume.assetId,
      timestamp,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!
    );

    const cloudName =
      process.env.CLOUDINARY_CLOUD_NAME;

    const apiKey =
      process.env.CLOUDINARY_API_KEY;

    const downloadUrl =
      `https://api.cloudinary.com/v1_1/${cloudName}/asset/download` +
      `?asset_id=${encodeURIComponent(resume.assetId)}` +
      `&timestamp=${timestamp}` +
      `&api_key=${encodeURIComponent(apiKey!)}` +
      `&signature=${signature}`;

    console.log("DOWNLOAD URL CREATED");

    const response = await fetch(downloadUrl);

    console.log(
      "CLOUDINARY RESPONSE:",
      response.status,
      response.statusText
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "CLOUDINARY ERROR:",
        errorText
      );

      return new Response(
        "Failed to fetch resume file",
        {
          status: 502,
        }
      );
    }

    const contentType =
      response.headers.get("content-type") ||
      "application/octet-stream";

    const filename =
      resume.title.toLowerCase().endsWith(".pdf")
        ? resume.title
        : `${resume.title}.pdf`;

    return new Response(response.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch (error) {
    console.error(
      "Resume delivery error:",
      error
    );

    return new Response(
      "Failed to load resume",
      {
        status: 500,
      }
    );
  }
}