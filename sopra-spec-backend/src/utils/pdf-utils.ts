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

// Project info transformation
export interface TransformedProjectInfo {
  id: string;
  name: string;
  architect: string;
  builder: string;
  installer: string;
  consultant: string;
  preparedBy: string;
  location: string;
  date: string;
  notes: string;
  thumbnail: string;
  ownerId: string;
}

export const transformProjectInfo = (project: any): TransformedProjectInfo => ({
  id: project.id,
  name: project.name || 'Project',
  architect: project.architect || 'Architects',
  builder: project.builder || 'Builder',
  installer: project.installer || 'Installer',
  consultant: project.consultant || 'Consultant',
  preparedBy: project.prepared_by || 'Technical Team',
  location: project.location || 'Location',
  date: project.date || new Date().toLocaleDateString(),
  notes: project.notes || '',
  thumbnail: project.thumbnail || '',
  ownerId: project.owner_id || '',
});

// System stack data interface
export interface SystemStackData {
  id: string;
  distributor: string;
  area_type: string;
  substrate?: string;
  material?: string;
  insulated?: boolean;
  exposure?: string;
  attachment?: string;
  roof_subtype?: string;
  foundation_subtype?: string;
  civil_work_subtype?: string;
  system_stack_layer?: Array<{
    combination: number;
    product: {
      id: string;
      name: string;
      layer?: string;
      distributor?: string;
    };
  }>;
}

export const transformSystemStackData = (systemStack: any): SystemStackData => ({
  id: systemStack.id,
  distributor: systemStack.distributor,
  area_type: systemStack.area_type,
  substrate: systemStack.substrate,
  material: systemStack.material,
  insulated: systemStack.insulated,
  exposure: systemStack.exposure,
  attachment: systemStack.attachment,
  roof_subtype: systemStack.roof_subtype,
  foundation_subtype: systemStack.foundation_subtype,
  civil_work_subtype: systemStack.civil_work_subtype,
  system_stack_layer: systemStack.system_stack_layer,
});

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