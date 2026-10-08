import { createClient } from "@supabase/supabase-js";

const url = "https://jabfasxmxdsvlojfubfi.supabase.co";
const key = "sb_publishable_eBRhK811V-uMyyNboYMOLQ_Km32uLDW";

const supabase = createClient(url, key);

export default async function uploadFile(file) {
    const fileName = Date.now() + "_" + file.name;

    const { error } = await supabase.storage
        .from("images")
        .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
        });

    // Supabase puts the problem in "error", so we check it
    if (error) {
        console.log("Upload error:", error);
        throw error;
    }

    return supabase.storage.from("images").getPublicUrl(fileName).data
        .publicUrl;
}