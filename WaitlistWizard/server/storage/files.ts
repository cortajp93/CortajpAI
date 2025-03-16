import fs from "fs";
import path from "path";
import sharp from "sharp";

// Ensure upload directories exist
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const PROCESSED_DIR = path.join(UPLOAD_DIR, "processed");

// Create directories if they don't exist
[UPLOAD_DIR, PROCESSED_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

export async function saveUploadedFile(file: Express.Multer.File): Promise<string> {
  const fileName = `${Date.now()}-${file.originalname}`;
  const filePath = path.join(UPLOAD_DIR, fileName);
  
  // Move the uploaded file to our upload directory
  fs.renameSync(file.path, filePath);
  
  return `/uploads/${fileName}`;
}

export async function processImage(
  originalPath: string,
  prompt: string,
  maskData?: string
): Promise<string> {
  const image = sharp(path.join(process.cwd(), originalPath.slice(1)));
  
  // Apply "AI-like" filter effects
  await image
    .modulate({
      brightness: 1.1,
      saturation: 1.2,
    })
    .blur(0.5);

  // If mask data is provided, simulate inpainting
  if (maskData) {
    // For now, just apply a different effect to simulate inpainting
    // In production, this would call the actual AI model
    await image.tint({ r: 255, g: 255, b: 255 });
  }

  const processedFileName = `processed-${path.basename(originalPath)}`;
  const processedPath = path.join(PROCESSED_DIR, processedFileName);
  
  await image.toFile(processedPath);
  
  return `/uploads/processed/${processedFileName}`;
}
