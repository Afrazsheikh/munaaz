/**
 * MUNAAZ CINEMATIC HERO SEQUENCE CONFIGURATION
 * 39 HD Tailored Fashion Image Frames
 */

export interface SceneMetadata {
  id: string;
  name: string;
  subtitle: string;
  startFrame: number;
  endFrame: number;
}

export const CINEMATIC_SCENES: SceneMetadata[] = [
  {
    id: 'scene-01',
    name: 'SCENE 01: OPENING SILHOUETTE',
    subtitle: '100% European Flax & Fine Sartorial Tailoring',
    startFrame: 0,
    endFrame: 6,
  },
  {
    id: 'scene-02',
    name: 'SCENE 02: DECONSTRUCTED WEAVE',
    subtitle: 'Sensual Textures & Muted Earth Tones',
    startFrame: 7,
    endFrame: 13,
  },
  {
    id: 'scene-03',
    name: 'SCENE 03: SARTORIAL MOVEMENT',
    subtitle: 'Fluid Proportions & Double-Pleated Drape',
    startFrame: 14,
    endFrame: 20,
  },
  {
    id: 'scene-04',
    name: 'SCENE 04: MACRO CRAFTSMANSHIP',
    subtitle: 'Hand-Stitched Gussets & Mother-of-Pearl Detail',
    startFrame: 21,
    endFrame: 27,
  },
  {
    id: 'scene-05',
    name: 'SCENE 05: FASHION CAMPAIGN',
    subtitle: 'Haute Parfumerie & High-Fashion Editorial',
    startFrame: 28,
    endFrame: 34,
  },
  {
    id: 'scene-06',
    name: 'SCENE 06: THE ATELIER SIGNATURE',
    subtitle: 'Timeless Luxury Designed to Be Remembered',
    startFrame: 35,
    endFrame: 38,
  },
];

// 39 Frame Paths (1.jpeg through 39.jpeg)
export const CINEMATIC_FRAMES: string[] = Array.from({ length: 39 }, (_, i) => `/tailored/${i + 1}.jpeg`);

/**
 * Preloads the initial key frames (1-3) in parallel for instant hero load
 */
export const preloadInitialFrames = async (count = 3): Promise<HTMLImageElement[]> => {
  const initialPaths = CINEMATIC_FRAMES.slice(0, count);
  const promises = initialPaths.map((path) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new window.Image();
      img.src = path;
      img.onload = () => {
        if ('decode' in img && typeof img.decode === 'function') {
          img.decode().then(() => resolve(img)).catch(() => resolve(img));
        } else {
          resolve(img);
        }
      };
      img.onerror = () => reject(new Error(`Failed to load frame: ${path}`));
    });
  });

  try {
    return await Promise.all(promises);
  } catch (err) {
    console.warn('Notice loading initial frames:', err);
    return [];
  }
};

/**
 * Progressively loads remaining frames in background chunks to optimize performance
 */
export const loadFrameProgressive = (
  path: string
): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.src = path;
    img.onload = () => {
      if ('decode' in img && typeof img.decode === 'function') {
        img.decode().then(() => resolve(img)).catch(() => resolve(img));
      } else {
        resolve(img);
      }
    };
    img.onerror = () => reject(new Error(`Failed to load frame: ${path}`));
  });
};
