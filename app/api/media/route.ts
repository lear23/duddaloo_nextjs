import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
// import { getAuthUserFromRequest } from "@/lib/auth"; // ← Comentado para pruebas

const BUCKET = "duddallos_products";
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// ✅ LISTAR IMÁGENES
export async function GET() {
  try {
    console.log("🔍 [GET] Bucket:", BUCKET);
    
    // 👇 Cambiado: path "/" + limit explícito
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list("/", { limit: 100, sortBy: { column: "name", order: "asc" } });
    
    console.log("📦 [GET] Supabase response:", { 
      error: error?.message, 
      count: data?.length,
      first: data?.[0]?.name 
    });

    if (error) throw error;

    const images = (data || []).map((file) => {
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(file.name);
      return { 
        name: file.name, 
        url: urlData.publicUrl,
        size: file.metadata?.size ? `${Math.round(file.metadata.size / 1024)} KB` : undefined,
      };
    });

    console.log("✅ [GET] Returning", images.length, "images");
    return NextResponse.json(images);
  } catch (err: any) {
    console.error("❌ GET /api/media error:", err);
    return NextResponse.json({ error: err.message || "Failed to list images" }, { status: 500 });
  }
}

// ✅ SUBIR IMAGEN
export async function POST(request: NextRequest) {
  try {
    // 👇 Comentado para pruebas - descomentar cuando tengas auth funcionando
    // const user = getAuthUserFromRequest(request);
    // if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "No file found" }, { status: 400 });
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: `Tipo no permitido: ${file.type}` }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: `Archivo muy grande: ${(file.size/1024/1024).toFixed(1)}MB` }, { status: 400 });
    }

    const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.-]/g, "")}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    console.log("📤 [POST] Uploading:", uniqueName);

    const { error: uploadError, data: uploadData } = await supabase.storage
      .from(BUCKET)
      .upload(uniqueName, buffer, { 
        contentType: file.type,
        upsert: false,
        cacheControl: "3600"
      });
    
    if (uploadError) {
      console.error("❌ Upload error:", uploadError);
      throw uploadError;
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(uniqueName);

    console.log("✅ [POST] Uploaded:", uniqueName);
    return NextResponse.json({ 
      name: uniqueName, 
      url: urlData.publicUrl,
      size: `${Math.round(file.size / 1024)} KB`
    });
  } catch (err: any) {
    console.error("❌ POST /api/media error:", err);
    return NextResponse.json({ error: err.message || "Failed to upload image" }, { status: 500 });
  }
}

// ✅ BORRAR IMAGEN
export async function DELETE(request: NextRequest) {
  try {
    // 👇 Comentado para pruebas
    // const user = getAuthUserFromRequest(request);
    // if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name } = await request.json();
    if (!name) return NextResponse.json({ error: "File name required" }, { status: 400 });

    console.log("🗑️ [DELETE] Removing:", name);

    const { error } = await supabase.storage.from(BUCKET).remove([name]);
    if (error) throw error;

    console.log("✅ [DELETE] Removed:", name);
    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (err: any) {
    console.error("❌ DELETE /api/media error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete image" }, { status: 500 });
  }
}