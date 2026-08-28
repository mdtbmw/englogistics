/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Compresses an image file in the browser using HTML5 Canvas
 * and returns an optimized Base64 Data URI string.
 * This stores images directly in Firestore documents without requiring Firebase Storage buckets.
 */
export async function compressImageToBase64(
  file: File,
  maxWidth = 1200,
  maxHeight = 800,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context could not be initialized.'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Creates structured semantic HTML figure markup for in-article embedding
 */
export function createInArticleImageHtml(
  dataUriOrUrl: string,
  altText: string,
  caption?: string,
  layout: 'full' | 'left' | 'right' = 'full'
): string {
  const layoutClass =
    layout === 'left'
      ? 'blog-figure-left'
      : layout === 'right'
      ? 'blog-figure-right'
      : 'blog-figure-full';

  return `
<figure class="blog-figure ${layoutClass}">
  <img src="${dataUriOrUrl}" alt="${altText.replace(/"/g, '&quot;')}" loading="lazy" class="blog-in-article-img" />
  ${caption ? `<figcaption class="blog-figcaption">${caption}</figcaption>` : ''}
</figure>
`.trim();
}