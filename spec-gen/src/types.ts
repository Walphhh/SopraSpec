// System Selection Interface
export interface SystemSelection {
  system: 'bayset' | 'enduroflex' | 'allduro';
  buildType: 'new_build' | 'refurbishment';
  substrate: 'concrete' | 'timber' | 'metal';
  membraneType: 'bitumen' | 'synthetic';
  insulationRequired: boolean;
  exposureType: 'exposed' | 'protected' | 'ballasted' | 'green_roof' | 'pod_and_paver';
  installationMethod: 'self-adhered' | 'mechanically_fixed' | 'loose_laid' | 'fully_torched';
}

// Database Table Interfaces
export interface SelectionRule {
  id: string;
  system: string;
  roof_type: string;
  substrate_type: string;
  membrane_type: string;
  insulation_required: boolean;
  exposure_type: string;
  installation_method: string;
  system_specification: SystemSpecification;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  type: string;
  category: string;
  description?: string;
}

// System Specification Structure
export interface SystemSpecification {
  system_id: string;
  products: ProductLayer[];
}

export interface ProductLayer {
  layer: number;
  product_code: string;
  product_name: string;
  product_type: string;
  application_method: string;
  notes: string[];
}

// Session Data Interface
export interface SessionData {
  system?: string;
  area?: string;
  type?: string;
  substrate?: string;
  membrane?: string;
  insulation?: string | boolean;
  exposure?: string;
  installation?: string;
}

// API Response Interface
export interface SpecificationResult {
  success: boolean;
  specification?: SystemSpecification;
  products?: Product[];
  error?: string;
}