import  supabase from '../config/supabase-client';
import { Product, SystemSpecification, SpecificationResult, SystemSelection } from '../types/selection-type';

export class DatabaseService {
  /**
   * Find a matching system specification based on user selections
   */
  static async findSystemSpecification(selection: SystemSelection): Promise<SpecificationResult> {
    try {
      const { data, error } = await supabase
        .from('selection_rules')
        .select('system_specification')
        .eq('system', selection.system)
        .eq('roof_type', selection.buildType)
        .eq('substrate_type', selection.substrate)
        .eq('membrane_type', selection.membraneType)
        .eq('insulation_required', selection.insulationRequired)
        .eq('exposure_type', selection.exposureType)
        .eq('installation_method', selection.installationMethod)
        .single();

      if (error) {
        console.error('Database error:', error);
        return {
          success: false,
          error: `No matching system found for the selected criteria: ${error.message}`
        };
      }

      if (!data || !data.system_specification) {
        return {
          success: false,
          error: 'No matching system specification found for the selected criteria'
        };
      }

      // Get product details for all products in the specification
      const specification = data.system_specification as SystemSpecification;
      const productCodes = specification.products.map((p: any) => p.product_code);
      const products = await this.getProductsByCodes(productCodes);

      return {
        success: true,
        specification: specification,
        products: products
      };
    } catch (error) {
      console.error('Unexpected error:', error);
      return { 
        success: false, 
        error: 'An unexpected error occurred while finding system specification' 
      };
    }
  }

  /**
   * Get product details by product codes
   */
  static async getProductsByCodes(codes: string[]): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('code', codes);

      if (error) {
        console.error('Error fetching products:', error);
        return [];
      }

      return (data as Product[]) || [];
    } catch (error) {
      console.error('Unexpected error fetching products:', error);
      return [];
    }
  }
}