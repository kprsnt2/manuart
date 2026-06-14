import fs from 'fs';
import path from 'path';

export interface GalleryImage {
  src: string;
  filename: string;
  date: Date | null;
  dateFormatted: string;
}

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic'];

/**
 * Extracts date from filenames like:
 * - IMG_20190614_220013_1.jpg   -> June 14, 2019
 * - IMG-20190525-WA0003.jpg     -> May 25, 2019
 * - IMG20190721093801.jpg       -> July 21, 2019
 * - VID_20190406_204908.gif     -> April 6, 2019
 * - PAINTING_20200301_xyz.jpg   -> March 1, 2020
 * 
 * Looks for YYYYMMDD pattern after any separator (_, -, or nothing).
 */
function extractDateFromFilename(filename: string): Date | null {
  // 1. Try to match YYYY followed by 2 digits and 2 digits (8 digits total, optionally separated by _ or -)
  const match8 = filename.match(/(?:^|[_\-]|[A-Za-z])(\d{4})[_\-]?(\d{2})[_\-]?(\d{2})/);
  if (match8) {
    const year = parseInt(match8[1]);
    const part1 = parseInt(match8[2]);
    const part2 = parseInt(match8[3]);
    if (year >= 2015 && year <= 2030) {
      // Case A: YYYYMMDD (part1 is month 1-12, part2 is day 1-31)
      if (part1 >= 1 && part1 <= 12 && part2 >= 1 && part2 <= 31) {
        return new Date(year, part1 - 1, part2);
      }
      // Case B: YYYYDDMM (part1 is day 13-31, part2 is month 1-12)
      if (part1 > 12 && part1 <= 31 && part2 >= 1 && part2 <= 12) {
        return new Date(year, part2 - 1, part1);
      }
    }
  }

  // 2. Try to match YYYY followed by 1 digit and 2 digits (7 digits total, e.g. 2021401 -> 2021-04-01)
  const match7 = filename.match(/(?:^|[_\-]|[A-Za-z])(\d{4})[_\-]?(\d{1})[_\-]?(\d{2})/);
  if (match7) {
    const year = parseInt(match7[1]);
    const month = parseInt(match7[2]) - 1; // JS month is 0-indexed
    const day = parseInt(match7[3]);
    if (year >= 2015 && year <= 2030 && month >= 0 && month <= 11 && day >= 1 && day <= 31) {
      return new Date(year, month, day);
    }
  }

  return null;
}

/**
 * Scans a directory inside public/ for image files.
 * Extracts dates from filenames and returns sorted (newest first).
 */
export function scanImagesFromFolder(folderName: string): GalleryImage[] {
  const publicDir = path.join(process.cwd(), 'public', folderName);
  
  if (!fs.existsSync(publicDir)) {
    return [];
  }

  const files = fs.readdirSync(publicDir);
  
  const images: GalleryImage[] = files
    .filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return IMAGE_EXTENSIONS.includes(ext) && !file.startsWith('.');
    })
    .map((file) => {
      const date = extractDateFromFilename(file);
      return {
        src: `/${folderName}/${file}`,
        filename: file,
        date,
        dateFormatted: date
          ? date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : '',
      };
    });

  // Sort by date (newest first), files without dates go to the end
  images.sort((a, b) => {
    if (a.date && b.date) return b.date.getTime() - a.date.getTime();
    if (a.date) return -1;
    if (b.date) return 1;
    return a.filename.localeCompare(b.filename);
  });

  return images;
}

/**
 * Groups images by year-month for a timeline-style display
 */
export function groupImagesByMonth(images: GalleryImage[]): Map<string, GalleryImage[]> {
  const groups = new Map<string, GalleryImage[]>();
  
  images.forEach((img) => {
    const key = img.date
      ? img.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
      : 'Undated';
    
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(img);
  });

  return groups;
}
