import { scanImagesFromFolder, groupImagesByMonth } from "@/lib/gallery";
import { Badge } from "@/components/ui/badge";
import GalleryGrid from "@/components/gallery-grid";

export default function GalleryPage() {
    const photos = scanImagesFromFolder("gallery");
    const groupedPhotos = groupImagesByMonth(photos);

    // Build groups for client component
    const groups = Array.from(groupedPhotos.entries()).map(([label, images]) => ({
        label,
        emoji: "📸",
        images: images.map((img) => ({
            src: img.src,
            filename: img.filename,
            dateFormatted: img.dateFormatted,
        })),
    }));

    // Flat list for lightbox navigation
    const allImages = photos.map((img) => ({
        src: img.src,
        filename: img.filename,
        dateFormatted: img.dateFormatted,
    }));

    return (
        <main className="min-h-screen px-6 py-12 md:py-20">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight text-purple-800 mb-4">
                        Photo Gallery 📸
                    </h1>
                    <p className="text-xl text-purple-400">
                        Snapshots of Manu&apos;s adventures, smiles, and everything in between!
                    </p>
                    {photos.length > 0 && (
                        <div className="flex justify-center gap-3 mt-4">
                            <Badge className="text-sm px-3 py-1 bg-purple-100 text-purple-700 border-purple-200">
                                {photos.length} photo{photos.length !== 1 ? "s" : ""}
                            </Badge>
                        </div>
                    )}
                </div>

                {photos.length > 0 ? (
                    <GalleryGrid groups={groups} allImages={allImages} />
                ) : (
                    <div className="gallery-empty">
                        <div className="gallery-empty-icon">📷</div>
                        <h3>No photos yet!</h3>
                        <p>
                            Drop photos into the <code>public/gallery/</code> folder.
                            Name them like <code>IMG_20190614_220013.jpg</code> and
                            dates will be extracted automatically!
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
