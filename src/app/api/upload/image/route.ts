import { NextResponse } from "next/server";
import { uploadToImgbb } from "@/lib/imgbb";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { success: false, message: "Please select an image file to upload." },
        { status: 400 }
      );
    }

    const folder = formData.get("folder");
    const nameOption = typeof folder === "string" && folder.trim() ? folder.trim() : undefined;

    const result = await uploadToImgbb(file, { name: nameOption });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      imageUrl: result.url,
      displayUrl: result.displayUrl,
      deleteUrl: result.deleteUrl,
    });
  } catch (error) {
    console.error("API /api/upload/image handler error:", error);
    return NextResponse.json(
      { success: false, message: "Server error occurred during image upload." },
      { status: 500 }
    );
  }
}
