import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const BUCKET = "duddallos_products";
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function GET() {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list("/", { limit: 100, sortBy: { column: "name", order: "asc" } });
    
    if (error) throw error;

    const images = (data || []).map((file) => {
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(file.name);
      return { 
        name: file.name, 
        url: urlData.publicUrl,
        size: file.metadata?.size ? `${Math.round(file.metadata.size / 1024)} KB` : undefined,
      };
    });

    return NextResponse.json(images);
  } catch (err) {
    const error = err instanceof Error ? err : new Error("Ett fel uppstod vid hämtning");
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "Ingen fil hittades" }, { status: 400 });
    
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: `Otillåten filtyp: ${file.type}` }, { status: 400 });
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Filen är för stor (max 5MB)" }, { status: 400 });
    }

    const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.-]/g, "")}`;
    const arrayBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(uniqueName, arrayBuffer, { 
        contentType: file.type,
        upsert: false,
        cacheControl: "3600"
      });
    
    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(uniqueName);

    return NextResponse.json({ 
      name: uniqueName, 
      url: urlData.publicUrl,
      size: `${Math.round(file.size / 1024)} KB`
    });
  } catch (err) {
    const error = err instanceof Error ? err : new Error("Uppladdning misslyckades");
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { name } = await request.json();
    if (!name) return NextResponse.json({ error: "Filnamn saknas" }, { status: 400 });

    const { error } = await supabase.storage.from(BUCKET).remove([name]);
    if (error) throw error;

    return NextResponse.json({ message: "Bilden raderades framgångsrikt" });
  } catch (err) {
    const error = err instanceof Error ? err : new Error("Radering misslyckades");
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}