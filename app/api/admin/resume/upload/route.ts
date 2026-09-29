import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json(
        {
          success: false,
          message: "No file provided",
        },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        {
          success: false,
          message: "Unsupported resume type. PDF, DOC, or DOCX only.",
        },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return Response.json(
        {
          success: false,
          message: "Resume size must be less than 10 MB",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
  .upload_stream(
    {
      folder: "merdo-zone/resumes",
      resource_type: "raw",
      use_filename: true,
      unique_filename: false,
      filename_override: file.name,
    },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        )
        .end(buffer);
    });

    return Response.json({
  success: true,
  url: result.secure_url,
  publicId: result.public_id,
  assetId: result.asset_id,
});
  } catch (error) {
    console.error("Cloudinary resume upload error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to upload resume",
      },
      { status: 500 }
    );
  }
}