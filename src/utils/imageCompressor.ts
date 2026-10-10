/**
 * Utility to compress and resize images on client-side before storage
 * Prevents QuotaExceededError in LocalStorage while keeping images sharp
 */

export const compressImageFile = (
  file: File,
  maxDimension = 900,
  quality = 0.8
): Promise<string> => {
  return new Promise((resolve) => {
    // If not an image, resolve empty
    if (!file.type.startsWith('image/')) {
      resolve('');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        resolve('');
        return;
      }

      const img = new Image();
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // If image is already small, return it directly
        if (width <= maxDimension && height <= maxDimension && file.size < 150 * 1024) {
          resolve(dataUrl);
          return;
        }

        // Scale down keeping aspect ratio
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        // Smooth image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to web-optimized JPEG
        try {
          const optimized = canvas.toDataURL('image/jpeg', quality);
          resolve(optimized);
        } catch {
          resolve(dataUrl);
        }
      };

      img.onerror = () => {
        resolve(dataUrl);
      };

      img.src = dataUrl;
    };

    reader.onerror = () => {
      resolve('');
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Remove legacy / obsolete cache keys to free up browser storage space
 */
export const cleanupLegacyStorageKeys = () => {
  if (typeof window === 'undefined' || !window.localStorage) return;

  const legacyKeys = [
    'vietphuc_costumes_v1',
    'vietphuc_custom_costumes_v1',
    'vietphuc_custom_costumes_v2',
    'vietphuc_custom_outfits_v1',
    'vietphuc_custom_outfits_v2',
    'vietphuc_cultural_rules_v1',
    'vietphuc_cultural_rules_v2',
    'cophuc_remix_outfits_v1',
  ];

  for (const k of legacyKeys) {
    try {
      localStorage.removeItem(k);
    } catch {
      // Ignore
    }
  }
};

/**
 * Safely store data in LocalStorage without throwing QuotaExceededError
 */
export const safeSetLocalStorage = <T>(
  key: string,
  data: T,
  lightweightFallback?: (item: T) => any
): boolean => {
  if (typeof window === 'undefined' || !window.localStorage) return false;

  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (err) {
    // 1. Clean up legacy keys
    cleanupLegacyStorageKeys();

    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch {
      // 2. Try lightweight version if provided
      if (lightweightFallback) {
        try {
          const compact = lightweightFallback(data);
          localStorage.setItem(key, JSON.stringify(compact));
          return true;
        } catch {
          // Fall through
        }
      }

      // 3. Graceful degradation: server has authoritative copy
      console.warn(`[Storage] LocalStorage quota reached for "${key}". Data safely preserved on server.`);
      return false;
    }
  }
};
