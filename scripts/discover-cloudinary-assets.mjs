import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function listFolder(folder, resourceType = "image") {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`  ${folder}  (${resourceType})`);
  console.log("=".repeat(60));

  let nextCursor = undefined;
  let total = 0;

  do {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: folder,
      max_results: 100,
      resource_type: resourceType,
      next_cursor: nextCursor,
    });

    for (const r of result.resources) {
      const dims =
        r.width && r.height ? `${r.width}x${r.height}` : "no-dims";
      const sizeMB = (r.bytes / 1024 / 1024).toFixed(2);
      console.log(`  ${r.public_id}.${r.format}  (${dims}, ${sizeMB}MB)`);
      total++;
    }

    nextCursor = result.next_cursor;
  } while (nextCursor);

  console.log(`  --- ${total} asset(s) ---`);
}

try {
  // First list all top-level folders to find where assets live
  console.log("\n=== ALL FOLDERS ===");
  const folders = await cloudinary.api.root_folders();
  for (const f of folders.folders) {
    console.log(`  ${f.name} (${f.path})`);
    // List subfolders
    try {
      const subs = await cloudinary.api.sub_folders(f.path);
      for (const s of subs.folders) {
        console.log(`    └─ ${s.name} (${s.path})`);
        try {
          const subsubs = await cloudinary.api.sub_folders(s.path);
          for (const ss of subsubs.folders) {
            console.log(`       └─ ${ss.name} (${ss.path})`);
          }
        } catch {}
      }
    } catch {}
  }

  // Then list assets in known locations
  await listFolder("Pratham/Images", "image");
  await listFolder("Pratham/Images/Thumbnails", "image");
  await listFolder("Pratham/Videos", "video");

  // List ALL images and videos (paginated)
  console.log("\n=== ALL IMAGES ===");
  let imgCursor = undefined;
  let imgTotal = 0;
  do {
    const res = await cloudinary.api.resources({ type: "upload", max_results: 100, resource_type: "image", next_cursor: imgCursor });
    for (const r of res.resources) {
      const sizeMB = (r.bytes / 1024 / 1024).toFixed(2);
      console.log(`  ${r.public_id}.${r.format}  (${r.width}x${r.height}, ${sizeMB}MB, folder: "${r.folder || "root"}")`);
      imgTotal++;
    }
    imgCursor = res.next_cursor;
  } while (imgCursor);
  console.log(`  --- ${imgTotal} image(s) total ---`);

  console.log("\n=== ALL VIDEOS ===");
  let vidCursor = undefined;
  let vidTotal = 0;
  do {
    const res = await cloudinary.api.resources({ type: "upload", max_results: 100, resource_type: "video", next_cursor: vidCursor });
    for (const r of res.resources) {
      const sizeMB = (r.bytes / 1024 / 1024).toFixed(2);
      const dims = r.width && r.height ? `${r.width}x${r.height}` : "no-dims";
      console.log(`  ${r.public_id}.${r.format}  (${dims}, ${sizeMB}MB, folder: "${r.folder || "root"}")`);
      vidTotal++;
    }
    vidCursor = res.next_cursor;
  } while (vidCursor);
  console.log(`  --- ${vidTotal} video(s) total ---`);
} catch (err) {
  console.error("\nError:", err.message || err);
  console.error("Full error:", JSON.stringify(err, null, 2));
  if (err.error?.http_code === 401 || err.error?.http_code === 403) {
    console.error(
      "\nAuth failed. Try different credentials.",
    );
  }
  process.exit(1);
}
