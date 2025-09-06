import * as fs from "fs";
import * as path from "path";
import pdfParse from "pdf-parse";

export async function parseResume(includeImage: boolean = false): Promise<{
  text: string;
  image: string | null;
}> {
  const textPath = path.join(process.cwd(), "data", "cv.pdf");
  let resumeText = "";

  if (fs.existsSync(textPath)) {
    const dataBuffer = fs.readFileSync(textPath);
    const data = await pdfParse(dataBuffer);
    resumeText = data.text;
  }

  let imageData: string | null = null;
  if (includeImage) {
    const imgPath = path.join(process.cwd(), "data", "resume_image.jpg");
    if (fs.existsSync(imgPath)) {
      const imageBuffer = fs.readFileSync(imgPath);
      imageData = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;
    }
  }

  return { text: resumeText, image: imageData };
}
