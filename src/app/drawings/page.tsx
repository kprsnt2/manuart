import { scanImagesFromFolder, groupImagesByMonth } from "@/lib/gallery";
import { Badge } from "@/components/ui/badge";
import GalleryGrid from "@/components/gallery-grid";

/** Calculate Manu's age at a given date */
function manuAgeAt(date: Date): number {
    const birthday = new Date(2019, 2, 25); // March 25, 2019
    let age = date.getFullYear() - birthday.getFullYear();
    const monthDiff = date.getMonth() - birthday.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && date.getDate() < birthday.getDate())) {
        age--;
    }
    return Math.max(0, age);
}

export default function DrawingsPage() {
    const drawings = scanImagesFromFolder("drawings");
    const groupedDrawings = groupImagesByMonth(drawings);

    // Build groups for client component
    const groups = Array.from(groupedDrawings.entries()).map(([label, images]) => ({
        label,
        emoji: "🖌️",
        images: images.map((img) => ({
            src: img.src,
            filename: img.filename,
            dateFormatted: img.dateFormatted,
            badge: img.date ? `Age ${manuAgeAt(img.date)}` : undefined,
        })),
    }));

    // Flat list for lightbox navigation
    const allImages = drawings.map((img) => ({
        src: img.src,
        filename: img.filename,
        dateFormatted: img.dateFormatted,
        badge: img.date ? `Age ${manuAgeAt(img.date)}` : undefined,
    }));

    return (
        <main className="min-h-screen px-6 py-12 md:py-20">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight text-purple-800 mb-4">
                        Manu&apos;s Drawings 🎨
                    </h1>
                    <p className="text-xl text-purple-400">
                        Masterpieces by the one and only artist — Manu! 🖌️
                    </p>
                    {drawings.length > 0 && (
                        <div className="flex justify-center gap-3 mt-4">
                            <Badge className="text-sm px-3 py-1 bg-purple-100 text-purple-700 border-purple-200">
                                {drawings.length} drawing{drawings.length !== 1 ? "s" : ""}
                            </Badge>
                        </div>
                    )}
                </div>

                {drawings.length > 0 ? (
                    <GalleryGrid groups={groups} allImages={allImages} />
                ) : (
                    <div className="gallery-empty">
                        <div className="gallery-empty-icon">🎨</div>
                        <h3>No drawings yet!</h3>
                        <p>
                            Drop Manu&apos;s artwork into the <code>public/drawings/</code> folder.
                            Name them like <code>IMG_20190614_220013.jpg</code> and
                            dates will be extracted automatically!
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
