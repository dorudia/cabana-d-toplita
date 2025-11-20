import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL, // sau folosește cloud_name, api_key, api_secret
});

export async function getGalleryImages(folderName) {
  try {
    // Listăm toate resursele din folder
    const { resources } = await cloudinary.search
      .expression(`folder:${folderName}/*`)
      .sort_by("public_id", "asc")
      .max_results(500)
      .execute();

    // Transformăm în URL-uri publice
    const imageUrls = resources.map((res) => res.secure_url);

    console.log("Image URLs:", imageUrls);
    return imageUrls;
  } catch (error) {
    console.error("Error fetching Cloudinary images:", error);
    return [];
  }
}
