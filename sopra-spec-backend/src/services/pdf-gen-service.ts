import PDFDocument from 'pdfkit';
import { Response } from 'express';

interface SystemStackData {
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

interface ProjectInfo {
  project_name?: string;
  location?: string;
  architect?: string;
  builder?: string;
  prepared_by?: string;
  date?: string;
}

export class PDFGeneratorService {
  private doc: PDFKit.PDFDocument;
  private pageWidth: number = 595.28; // A4 width
  private pageHeight: number = 841.89; // A4 height
  private margin: number = 50;
  private contentWidth: number;

  constructor() {
    this.doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: this.margin,
        bottom: this.margin,
        left: this.margin,
        right: this.margin,
      },
    });
    this.contentWidth = this.pageWidth - 2 * this.margin;
  }

  async generateSystemSpecification(
    systemStack: SystemStackData,
    projectInfo: ProjectInfo,
    res: Response
  ): Promise<void> {
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="specification-${systemStack.id}.pdf"`
    );

    // Pipe the PDF to response
    this.doc.pipe(res);

    // Generate PDF content
    this.addIntroPages(projectInfo);
    this.addSystemDetails(systemStack);
    this.addProductLayers(systemStack);
    this.addFooter();

    // Finalize PDF
    this.doc.end();
  }
  private addIntroPages(projectInfo: ProjectInfo): void {
    const { project_name, location, architect, builder, prepared_by, date } =
      projectInfo;
    // Page 1
    this.doc.fontSize(10).font('Helvetica').text('bayset.com.au', { align: 'right' });
    this.doc.moveDown(5);
    this.doc.fontSize(32).font('Helvetica-Bold').text('Project', { align: 'left' });
    this.doc.fontSize(32).font('Helvetica-Bold').text('Specification', { align: 'left' });
    this.doc.moveDown(1);
    const imageHeight = 300;
    this.doc.image('src/assets/images/logo.png', 0, this.doc.y, {
      width: this.pageWidth,
      height: 300,  // adjust height as needed
    });
    let y = this.doc.y + imageHeight + 20;
    const details = [
      { label: 'Project', value: project_name || 'Project' },
      { label: 'Date', value: date || new Date().toLocaleDateString() },
      { label: 'Location', value: location || 'Location' },
      { label: 'Architect', value: architect || 'Architects' },
      { label: 'Builder', value: builder || 'Builder' },
      { label: 'Prepared by', value: prepared_by || 'Technical Team' },
    ];

    details.forEach((detail) => {
      this.doc.fontSize(10)
        .font('Helvetica')
        .text(detail.label, this.margin, y, { width: 150, continued: false });
      this.doc.fontSize(10)
        .font('Helvetica-Bold')
        .text(detail.value, this.margin + 100, y, { width: 300 });
      y += 20;
    });

    this.doc.addPage();
    // Page 2
    // Draw grey rectangle at top
    this.doc
      .rect(0, 0, this.pageWidth, 0.95 * 72) // x, y, width, height
      .fill('#f2f2f2'); // light grey color
    this.doc.fillColor('black');
    this.doc.moveDown(4);
    this.doc.image('src/assets/images/logo2.jpg', this.margin, this.doc.y, {
      width: this.pageWidth - 2 * this.margin,   // full width minus margins
      height: 2.02 * 72,  // adjust height as needed
      align: 'center',
    });
    // Start text **just below the logo**
    let textY = this.doc.y + 2.02 * 72 + 20;
    this.doc.fontSize(14).font('Helvetica-Bold').text('About SOPREMA', this.margin, textY);
    this.doc.fillColor('#323f4a');

    // Move y below the title
    this.doc.fontSize(10).font('Helvetica').text(
      'Founded in 1908 in Strasbourg, France, SOPREMA is a multinational manufacturer specialising in the production of innovative products for waterproofing, insulation, soundproofing and vegetated solutions, in response to the specific challenges within the construction industry for the roofing, building envelope, and civil engineering sectors.',
      this.margin,
      this.doc.y + 5,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font('Helvetica').text(
      'With over 100 years of expertise, SOPREMA has earned its place as a world leader of the waterproofing industry, and the availability of its technical team. Each year, hundreds of construction professionals – architects, contractors, installers, building owners, and consultants – choose SOPREMA for the quality of its products and its personalised service.',
      this.margin,
      this.doc.y + 5,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font('Helvetica').text(
      'SOPREMA is more than a manufacturer: it is also a partner!',
      this.margin,
      this.doc.y + 5,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fillColor('black');
    let y2 = this.doc.y + 20;
    this.doc.fontSize(14).font('Helvetica-Bold').text('Spirit of Innovation', this.margin, y2);
    this.doc.fillColor('#323f4a');
    this.doc.fontSize(10).font('Helvetica').text(
      'SOPREMA is recognised as a pioneer for its initiatives to develop new products that meet customer needs and make their work more efficient.',
      this.margin,
      this.doc.y + 5,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font('Helvetica').text(
      'Innovation at SOPREMA also means active participation in the development of new industry standards. SOPREMA’s research and development centres are located in Europe and North America, where dedicated professionals work to develop and improve the products, all while keeping SOPREMA’s R&D sustainable development policy at the forefront.',
      this.margin,
      this.doc.y + 5,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    let y3 = this.doc.y + 20;
    this.doc.fillColor('black');
    this.doc.fontSize(14).font('Helvetica-Bold').text('Comprehensive Service', this.margin, y3);
    this.doc.fillColor('#323f4a');
    this.doc.fontSize(10).font('Helvetica').text(
      'Recognised for the expertise and availability of its technical team: our local technical representatives work with and support construction professionals on their projects, from design to build.',
      this.margin,
      this.doc.y + 5,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font('Helvetica').text(
      'In additional to providing great technical support and service to customers, SOPREMA provides continuous training to installers.',
      this.margin,
      this.doc.y + 5,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.addPage();
    // Page 3
    // Draw grey rectangle at top
    this.doc
      .rect(0, 0, this.pageWidth, 0.95 * 72) // x, y, width, height
      .fill('#f2f2f2'); // light grey color
    this.doc.fillColor('black');
    this.doc.fontSize(14).font('Helvetica-Bold').text('Scope', this.margin, 0.95 * 72 + 20);
    this.doc.fillColor('#323f4a');
    this.doc.fontSize(10).font('Helvetica').text(
      'Supply and install waterproofing membranes or protective coating systems aimed at protecting the clients building from the effects of water ingress and carbonation.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font('Helvetica').text(
      'All systems are backed by full manufacturer’s warranties and are to be installed by trained applicators.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font('Helvetica').text(
      'Approved applicators are to have significant training and experience in Construction Waterproofing and/or Wall and Floor Tiling, as required for the application.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font('Helvetica').text(
      'When required, Bayset representatives (potentially in conjunction with the appropriate manufacturer), will carry out on-site inspections to ensure systems have been installed in accordance with the manufacturer’s data sheets and recommendations. ',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    let y4 = this.doc.y + 20;
    this.doc.fillColor('black');
    this.doc.fontSize(14).font('Helvetica-Bold').text('Standards & Codes', this.margin, y4);
    this.doc.fillColor('#323f4a');
    this.doc.fontSize(10).font('Helvetica').text(
      'Waterproofing, Protective Coating and Tiling works are to be carried out by licensed applicators, accredited by Bayset Specialist Trade Supplies. SOPREMA systems are to be carried out by SOPREMA approved applicators only.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font('Helvetica').text(
      'The Building Code of Australia shall be always observed.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font('Helvetica').text(
      'Manufactures Data sheets and recommendations must be read before any work is commenced.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font('Helvetica').text(
      'All relevant Australian Standards including but not limited to those listed below must be adhered to at all times.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font('Helvetica').text(
      'AS/NZ 4858 Wet Area Membranes Materials',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font('Helvetica').text(
      'AS 3740 Waterproofing of Domestic Wet Areas',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font('Helvetica').text(
      'AS 4654.1 Waterproofing Membrane systems for exterior use Above Ground Part 1 Materials',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font('Helvetica').text(
      'AS 4654.2 Waterproofing Membrane systems for exterior use Above Ground Part 2 Design and Installation',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font('Helvetica').text(
      'AS 3958.1 Guide to the installation of ceramic tiles',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font('Helvetica').text(
      'BS 8102 Code of Practice for Protection of Below Ground Structures Against Water from the ground',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font('Helvetica-Oblique').text(
      'Note: British Standard is used for our below ground systems as no current Australian Standard has been published',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.addPage();
    // Page 4
    // Draw grey rectangle at top
    this.doc
      .rect(0, 0, this.pageWidth, 0.95 * 72) // x, y, width, height
      .fill('#f2f2f2'); // light grey color
    this.doc.fillColor('black');
    this.doc.fontSize(14).font('Helvetica-Bold').text('Product & Application Requirements', this.margin, 0.95 * 72 + 20);
    this.doc.fillColor('#323f4a');
    this.doc.fontSize(10).font('Helvetica').text(
      'Substitutions of waterproofing membranes, protective coatings or tile adhesive or their systems are not permitted.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font('Helvetica').text(
      'All work performed under the requirements of the specification shall be in strict accordance with manufacturer’s product data sheets.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font('Helvetica').text(
      'It is the contractor’s responsibility to ensure all persons under the contractor’s control are fully aware of all requirements.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font('Helvetica').text(
      'All climactic restrictions for application including ambient and surface temperatures nominated in the manufacturer’s product data sheets shall be strictly adhered to.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font('Helvetica').text(
      'All contractors/sub-contractors must perform their own due diligence in regards to extent of areas quoted and suitability of membrane specified as changes regularly occur during the design phase.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    let y5 = this.doc.y + 20;
    this.doc.fillColor('black');
    this.doc.fontSize(14).font('Helvetica-Bold').text('Special Details', this.margin, y5);
    this.doc.fillColor('#323f4a');
    this.doc.fontSize(10).font('Helvetica').text(
      'Where a standard detail does not exist or cannot be applied, an approved alternative must be obtained from Bayset Specialist Trade Supplies before proceeding with the installation.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    let y6 = this.doc.y + 20;
    this.doc.fillColor('black');
    this.doc.fontSize(14).font('Helvetica-Bold').text('Acceptance of Substrate', this.margin, y6);
    this.doc.fillColor('#323f4a');
    this.doc.fontSize(10).font('Helvetica').text(
      'Surface examination and preparation must be completed in accordance to membrane’s Technical Data Sheets.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font('Helvetica').text(
      'Be sure plumbing, carpentry and all other works have been duly completed.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font('Helvetica').text(
      'Before waterproofing work begins, the owner\'s representative and waterproofing foreman will inspect and approve deck conditions (including slopes and wood grounds) as well as flashings at parapets, roof drains, plumbing vents, ventilation outlets and other construction joints. If necessary, a non-conformity notice should be issued to the contractor, so that required corrections can be carried out. The start of waterproofing work will be considered as acceptance of conditions for work completion.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font('Helvetica').text(
      'All surfaces shall be dry, clean, smooth and free from sharp objects, laitance, oils, grease or any foreign materials which may inhibit or reduce adhesion. Falls across all horizontal surfaces should achieve 1:80 or 1:100 to the nearest drainage point within each segregated area, as per Australian Standards',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font('Helvetica').text(
      'No materials shall be installed during rain or snowfall.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font('Helvetica').text(
      'When a new membrane is to be adhered to substrate, an adhesion test is recommended.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.addPage();
  }

  private addSystemDetails(systemStack: SystemStackData): void {
    this.addNewPageIfNeeded(200);

    // System title based on area_type
    const systemTitle = this.getSystemTitle(systemStack);

    this.doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .text(systemTitle, { underline: true });

    this.doc.moveDown(1);

    // System specifications
    const specs = this.buildSystemSpecs(systemStack);

    this.doc.fontSize(11).font('Helvetica-Bold');

    specs.forEach((spec) => {
      this.addNewPageIfNeeded(60);

      this.doc
        .font('Helvetica-Bold')
        .text(`${spec.label}:`, this.margin, this.doc.y, { continued: true });

      this.doc
        .font('Helvetica')
        .text(` ${spec.value}`, { width: this.contentWidth - 150 });

      this.doc.moveDown(0.5);
    });

    this.doc.moveDown(1);
  }

  private addProductLayers(systemStack: SystemStackData): void {
    if (!systemStack.system_stack_layer || systemStack.system_stack_layer.length === 0) {
      return;
    }

    this.addNewPageIfNeeded(150);

    this.doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('System Components', { underline: true });

    this.doc.moveDown(0.5);

    // Group by combination
    const combinations = this.groupByCombination(systemStack.system_stack_layer);

    combinations.forEach((combo, index) => {
      this.addNewPageIfNeeded(100);

      if (combinations.length > 1) {
        this.doc
          .fontSize(12)
          .font('Helvetica-Bold')
          .text(`Combination ${combo.combination}:`);
        this.doc.moveDown(0.3);
      }

      combo.products.forEach((product, prodIndex) => {
        this.addNewPageIfNeeded(40);

        const bulletPoint = `${prodIndex + 1}. `;
        const layer = product.layer ? `[${product.layer}] ` : '';

        this.doc
          .fontSize(10)
          .font('Helvetica-Bold')
          .text(bulletPoint, this.margin, this.doc.y, { continued: true });

        this.doc
          .font('Helvetica')
          .text(`${layer}${product.name}`, { width: this.contentWidth - 30 });
      });

      this.doc.moveDown(1);
    });
  }

  private addFooter(): void {
    const footerY = this.pageHeight - this.margin - 50;

    this.doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('SOPREMA Technical Support', this.margin, footerY);

    this.doc
      .fontSize(9)
      .font('Helvetica')
      .text('For technical advice and support:', this.margin, footerY + 15);

    this.doc.text('Email: info@bayset.com.au', this.margin, footerY + 30);
    this.doc.text('Web: www.bayset.com.au', this.margin, footerY + 45);
  }

  private getSystemTitle(systemStack: SystemStackData): string {
    const areaType = systemStack.area_type || 'System';
    const subtype =
      systemStack.roof_subtype ||
      systemStack.foundation_subtype ||
      systemStack.civil_work_subtype ||
      '';

    const formatted = areaType.charAt(0).toUpperCase() + areaType.slice(1).replace(/_/g, ' ');
    const subtypeFormatted = subtype ? ` - ${subtype.replace(/_/g, ' ')}` : '';

    return `${formatted}${subtypeFormatted}`;
  }

  private buildSystemSpecs(systemStack: SystemStackData): Array<{ label: string; value: string }> {
    const specs: Array<{ label: string; value: string }> = [];

    if (systemStack.substrate) {
      specs.push({
        label: 'Substrate',
        value: this.formatValue(systemStack.substrate),
      });
    }

    if (systemStack.material) {
      specs.push({
        label: 'Material',
        value: this.formatValue(systemStack.material),
      });
    }

    if (systemStack.insulated !== undefined) {
      specs.push({
        label: 'Insulated',
        value: systemStack.insulated ? 'Yes' : 'No',
      });
    }

    if (systemStack.exposure) {
      specs.push({
        label: 'Exposure',
        value: this.formatValue(systemStack.exposure),
      });
    }

    if (systemStack.attachment) {
      specs.push({
        label: 'Attachment',
        value: this.formatValue(systemStack.attachment),
      });
    }

    specs.push({
      label: 'Warranty Period',
      value: '20 Years',
    });

    return specs;
  }

  private groupByCombination(layers: SystemStackData['system_stack_layer']): Array<{
    combination: number;
    products: Array<{ name: string; layer: string | null; distributor: string | null }>;
  }> {
    if (!layers) return [];

    const grouped = new Map<number, Array<any>>();

    layers.forEach((layer) => {
      const combo = layer.combination || 1;
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
  }

  private formatValue(value: string | null | undefined): string {
    if (!value || typeof value !== 'string') {
      return String(value || 'Unknown');
    }
    return value
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private addNewPageIfNeeded(requiredSpace: number): void {
    if (this.doc.y + requiredSpace > this.pageHeight - this.margin) {
      this.doc.addPage();
    }
  }
}