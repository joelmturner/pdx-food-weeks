import { getImage } from "astro:assets";

export function checkImageBrightness(imageElement: HTMLImageElement): boolean {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return false;

    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;
    ctx.drawImage(imageElement, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let totalBrightness = 0;
    const pixelCount = data.length / 4; // RGBA values per pixel

    // Sample pixels (every 4th pixel to improve performance)
    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Calculate relative luminance using the formula: 0.299R + 0.587G + 0.114B
      const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      totalBrightness += brightness;
    }

    const averageBrightness = totalBrightness / (pixelCount / 4);
    // If average brightness is less than 0.5, the image is considered dark
    return averageBrightness < 0.5;
  } catch (error) {
    console.error("Error checking image brightness:", error);
    return false;
  }
}
