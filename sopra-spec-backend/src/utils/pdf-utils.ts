// Shared constants
export const PDF_CONSTANTS = {
  PAGE_WIDTH: 595.28, // A4 width
  PAGE_HEIGHT: 841.89, // A4 height
  MARGIN: 50,
  GREY_HEADER_HEIGHT: 0.95 * 72,
  LOGO_HEIGHT: 300,
  LOGO2_HEIGHT: 2.02 * 72,
} as const;

export const PDF_COLORS = {
  GREY_HEADER: '#f2f2f2',
  TEXT_SECONDARY: '#323f4a',
  BLACK: 'black',
} as const;

export const formatValue = (value: string | null | undefined): string => {
  if (!value || typeof value !== 'string') {
    return String(value || 'Unknown');
  }
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Area type formatting
export const AREA_TYPE_MAP: Record<string, string> = {
  'roof': 'Roofs',
  'internal_area': 'Internal Areas',
  'balcony': 'Balconies & Planter Boxes',
  'wall': 'Walls',
  'car_park': 'Car Parks, Plaza Decks & Plant Rooms',
  'foundation': 'Foundations',
  'other': 'Other Areas',
  'planter_box': 'Balconies & Planter Boxes',
  'civil_work': 'Civil Works',
};

export const formatAreaTypeName = (areaType: string): string => {
  return AREA_TYPE_MAP[areaType.toLowerCase()] || formatValue(areaType);
};

// Helper functions for handling raw database values with safe fallbacks
export const getProjectValue = (value: any, fallback: string): string => {
  return value || fallback;
};

export const getFormattedDate = (dateValue: any): string => {
  if (!dateValue) return new Date().toLocaleDateString();
  if (typeof dateValue === 'string') {
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? new Date().toLocaleDateString() : date.toLocaleDateString();
  }
  return new Date().toLocaleDateString();
};

// Group project areas by type utility
export const groupProjectAreasByType = (projectAreas: any[]): Record<string, any[]> => {
  const grouped: Record<string, any[]> = {};

  projectAreas.forEach((area) => {
    const areaType = area.areaType || area.area_type || 'Other';
    if (!grouped[areaType]) {
      grouped[areaType] = [];
    }
    grouped[areaType].push(area);
  });

  // Sort each group by combination
  Object.keys(grouped).forEach((key) => {
    grouped[key].sort((a, b) => (a.combination || 1) - (b.combination || 1));
  });

  return grouped;
};

// Group layers by combination utility
export const groupLayersByCombination = (
  layers: any[], 
  targetCombination?: number
): Array<{
  combination: number;
  products: Array<{ name: string; layer: string | null; distributor: string | null }>;
}> => {
  if (!layers) return [];

  const grouped = new Map<number, Array<any>>();

  layers.forEach((layer) => {
    const combo = layer.combination || 1;

    // If targetCombination is specified, only include that combination
    if (targetCombination && combo !== targetCombination) return;

    if (!grouped.has(combo)) {
      grouped.set(combo, []);
    }
    grouped.get(combo)?.push(layer.product);
  });

  return Array.from(grouped.entries())
    .map(([combination, products]) => ({
      combination,
      products: products.filter((p) => p && p.name),
    }))
    .sort((a, b) => a.combination - b.combination);
};