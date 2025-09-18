import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseServer";

const BUCKET_NAME = "menu-images";

function normalizeDrinkType(rawType) {
  const defaultType = {
    "ร้อน": { checked: false, price: 0 },
    "เย็น": { checked: false, price: 0 },
    "ปั่น": { checked: false, price: 0 },
  };

  if (!rawType || typeof rawType !== "object") return defaultType;

  return ["ร้อน", "เย็น", "ปั่น"].reduce((acc, key) => {
    acc[key] = {
      checked: rawType[key]?.checked || false,
      price: Number(rawType[key]?.price) || 0,
    };
    return acc;
  }, {});
}

async function ensureBucketExists(bucketName) {
  try {
    const { data: buckets, error: listErr } = await supabaseAdmin.storage.listBuckets();
    if (listErr) throw listErr;

    const exists = buckets.some((b) => b.name === bucketName);
    if (exists) return true;

    const { data, error: createErr } = await supabaseAdmin.storage.createBucket(bucketName, {
      public: true,
    });
    if (createErr) throw createErr;
    return true;
  } catch (err) {
    console.error("Error checking/creating bucket:", err);
    return false;
  }
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("menus")
    .select("*")
    .order("menu_name", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const ownerID = formData.get("OwnerID") || "";
    const MenuID = formData.get("code");
    const MenuName = formData.get("name");
    const CategoryMenu = formData.get("category");
    const TypeRaw = formData.get("type") ? JSON.parse(formData.get("type")) : null;
    const Type = CategoryMenu === "เครื่องดื่ม" ? normalizeDrinkType(TypeRaw) : TypeRaw;
    const Price = parseFloat(formData.get("price") || 0);
    const MenuDetail = formData.get("desc");
    const file = formData.get("image");

    let imageUrl = null;

    if (file && file.size) {
      const bucketReady = await ensureBucketExists(BUCKET_NAME);
      if (!bucketReady) {
        return NextResponse.json(
          { error: `ไม่สามารถสร้าง bucket "${BUCKET_NAME}"` },
          { status: 500 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const safeFileName = file.name
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9.\-_]/g, "_");

      const fileName = `menus/${Date.now()}-${safeFileName}`;

      const { error: upErr } = await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .upload(fileName, buffer, { contentType: file.type });

      if (upErr) throw upErr;

      const { data: publicData } = supabaseAdmin.storage.from(BUCKET_NAME).getPublicUrl(fileName);
      imageUrl = publicData?.publicUrl || null;
    }

    const newMenu = {
      owner_id: ownerID,
      menu_id: MenuID,
      menu_name: MenuName,
      category_menu: CategoryMenu,
      type: Type,
      price: Price,
      menu_detail: MenuDetail,
      image_path: imageUrl
    };

    const { data, error } = await supabaseAdmin
      .from("menus")
      .insert([newMenu])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message || "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const formData = await req.formData();
    const originalCode = formData.get("originalCode");
    const MenuID = formData.get("code");
    const MenuName = formData.get("name");
    const CategoryMenu = formData.get("category");
    const TypeRaw = formData.get("type") ? JSON.parse(formData.get("type")) : null;
    const Type = CategoryMenu === "เครื่องดื่ม" ? normalizeDrinkType(TypeRaw) : TypeRaw;
    const Price = parseFloat(formData.get("price") || 0);
    const MenuDetail = formData.get("desc");
    const file = formData.get("image");

    const { data: existing, error: e1 } = await supabaseAdmin
      .from("menus")
      .select("*")
      .eq("menu_id", originalCode)
      .limit(1)
      .single();
    if (e1) throw e1;

    let imageUrl = existing.image_path;

    if (file && file.size) {
      const bucketReady = await ensureBucketExists(BUCKET_NAME);
      if (!bucketReady) {
        return NextResponse.json(
          { error: `ไม่สามารถสร้าง bucket "${BUCKET_NAME}"` },
          { status: 500 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const safeFileName = file.name
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9.\-_]/g, "_");

      const fileName = `menus/${Date.now()}-${safeFileName}`;

      const { error: upErr } = await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .upload(fileName, buffer, { contentType: file.type });

      if (upErr) throw upErr;

      const { data: publicData } = supabaseAdmin.storage.from(BUCKET_NAME).getPublicUrl(fileName);
      imageUrl = publicData?.publicUrl || null;
    }

    const { data, error } = await supabaseAdmin
      .from("menus")
      .update({
        menu_id: MenuID,
        menu_name: MenuName,
        category_menu: CategoryMenu,
        type: Type,
        price: Price,
        menu_detail: MenuDetail,
        image_path: imageUrl
      })
      .eq("menu_id", originalCode)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message || "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    if (!code) return NextResponse.json({ error: "code required" }, { status: 400 });

    const { data, error } = await supabaseAdmin.from("menus").delete().eq("menu_id", code).select();
    if (error) throw error;
    return NextResponse.json({ success: true, deleted: data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
