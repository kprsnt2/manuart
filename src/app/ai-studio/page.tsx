import ArtStudio from "@/components/art-studio";
import { scanImagesFromFolder } from "@/lib/gallery";

export const metadata = {
    title: "AI Art Studio — Manu's World 🎨",
    description: "AI-powered art tools: get stories, reviews, and suggestions for Manu's drawings!",
};

export default function ArtStudioPage() {
    const drawings = scanImagesFromFolder("drawings").map(img => ({
        src: img.src,
        filename: img.filename,
        dateFormatted: img.dateFormatted
    }));
    return <ArtStudio drawings={drawings} />;
}
