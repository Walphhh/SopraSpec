import PDFDocument = require('pdfkit');
import { Response } from 'express';
import {
  PDF_CONSTANTS,
  PDF_COLORS,
  formatAreaTypeName,
  formatValue,
  getProjectValue,
  getFormattedDate,
  groupProjectAreasByType,
  groupLayersByCombination,
  registerFonts,
  getFont,
} from '../utils/pdf-utils';

export class PDFGeneratorService {
  private doc: PDFKit.PDFDocument;
  private pageWidth: number = PDF_CONSTANTS.PAGE_WIDTH;
  private pageHeight: number = PDF_CONSTANTS.PAGE_HEIGHT;
  private margin: number = PDF_CONSTANTS.MARGIN;
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

    // Register Calibri fonts (with Helvetica fallback)
    registerFonts(this.doc);
  }

  async generateSystemSpecification(
    projectInfo: any, // Raw project data from database
    projectAreas: any[], // Enhanced project areas with system stack data
    res: Response
  ): Promise<void> {
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="specification-${projectInfo.id}.pdf"`
    );

    // Pipe the PDF to response
    this.doc.pipe(res);

    // Generate PDF content
    this.addIntroPages(projectInfo);
    this.addAppendixPage(projectAreas);
    this.addSystemDetails(projectAreas);
    this.addFooter();

    // Finalize PDF
    this.doc.end();
  }

  async generateSingleAreaPDF(
    projectInfo: any, // Raw project data from database
    projectArea: any, // Single project area with system stack data
    res: Response
  ): Promise<void> {
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="area-specification-${projectArea.id}.pdf"`
    );

    // Pipe the PDF to response
    this.doc.pipe(res);

    // Generate PDF content for single area
    this.addIntroPages(projectInfo);
    this.addAppendixPage([projectArea]); // Pass single area as array
    this.addSystemDetails([projectArea]); // Pass single area as array
    this.addFooter();

    // Finalize PDF
    this.doc.end();
  }

  private addIntroPages(projectInfo: any): void {
    // Use raw database values with safe fallbacks (database uses snake_case)
    const name = getProjectValue(projectInfo.name, 'Project');
    const location = getProjectValue(projectInfo.location, 'Location');
    const architect = getProjectValue(projectInfo.architect, 'Architects');
    const builder = getProjectValue(projectInfo.builder, 'Builder');
    const preparedBy = getProjectValue(projectInfo.prepared_by, 'Technical Team');
    const date = getFormattedDate(projectInfo.date);

    // Page 1
    this.doc.fontSize(10).font(getFont('regular')).text('bayset.com.au', { align: 'right' });
    this.doc.moveDown(5);
    this.doc.fontSize(32).font(getFont('bold')).text('Project', { align: 'left' });
    this.doc.fontSize(32).font(getFont('bold')).text('Specification', { align: 'left' });
    this.doc.moveDown(1);

    this.doc.image('src/assets/images/logo.png', 0, this.doc.y, {
      width: this.pageWidth,
      height: PDF_CONSTANTS.LOGO_HEIGHT,
    });
    let y = this.doc.y + PDF_CONSTANTS.LOGO_HEIGHT + 20;
    const details = [
      { label: 'Project', value: name || 'Project' },
      { label: 'Date', value: date || new Date().toLocaleDateString() },
      { label: 'Location', value: location || 'Location' },
      { label: 'Architect', value: architect || 'Architects' },
      { label: 'Builder', value: builder || 'Builder' },
      { label: 'Prepared by', value: preparedBy || 'Technical Team' },
    ];

    details.forEach((detail) => {
      this.doc.fontSize(10)
        .font(getFont('regular'))
        .text(detail.label, this.margin, y, { width: 150, continued: false });
      this.doc.fontSize(10)
        .font(getFont('bold'))
        .text(detail.value, this.margin + 100, y, { width: 300 });
      y += 20;
    });

    this.doc.addPage();
    // Page 2
    this.addGreyHeader();
    this.doc.moveDown(4);
    this.doc.image('src/assets/images/logo2.jpg', this.margin, this.doc.y, {
      width: this.pageWidth - 2 * this.margin,
      height: PDF_CONSTANTS.LOGO2_HEIGHT,
      align: 'center',
    });
    let textY = this.doc.y + PDF_CONSTANTS.LOGO2_HEIGHT + 20;
    this.doc.fontSize(14).font(getFont('bold')).text('About SOPREMA', this.margin, textY);
    this.doc.fillColor('#323f4a');

    // Move y below the title
    this.doc.fontSize(10).font(getFont('regular')).text(
      'Founded in 1908 in Strasbourg, France, SOPREMA is a multinational manufacturer specialising in the production of innovative products for waterproofing, insulation, soundproofing and vegetated solutions, in response to the specific challenges within the construction industry for the roofing, building envelope, and civil engineering sectors.',
      this.margin,
      this.doc.y + 5,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font(getFont('regular')).text(
      'With over 100 years of expertise, SOPREMA has earned its place as a world leader of the waterproofing industry, and the availability of its technical team. Each year, hundreds of construction professionals – architects, contractors, installers, building owners, and consultants – choose SOPREMA for the quality of its products and its personalised service.',
      this.margin,
      this.doc.y + 5,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font(getFont('regular')).text(
      'SOPREMA is more than a manufacturer: it is also a partner!',
      this.margin,
      this.doc.y + 5,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fillColor('black');
    let y2 = this.doc.y + 20;
    this.doc.fontSize(14).font(getFont('bold')).text('Spirit of Innovation', this.margin, y2);
    this.doc.fillColor('#323f4a');
    this.doc.fontSize(10).font(getFont('regular')).text(
      'SOPREMA is recognised as a pioneer for its initiatives to develop new products that meet customer needs and make their work more efficient.',
      this.margin,
      this.doc.y + 5,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font(getFont('regular')).text(
      'Innovation at SOPREMA also means active participation in the development of new industry standards. SOPREMA’s research and development centres are located in Europe and North America, where dedicated professionals work to develop and improve the products, all while keeping SOPREMA’s R&D sustainable development policy at the forefront.',
      this.margin,
      this.doc.y + 5,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    let y3 = this.doc.y + 20;
    this.doc.fillColor('black');
    this.doc.fontSize(14).font(getFont('bold')).text('Comprehensive Service', this.margin, y3);
    this.doc.fillColor('#323f4a');
    this.doc.fontSize(10).font(getFont('regular')).text(
      'Recognised for the expertise and availability of its technical team: our local technical representatives work with and support construction professionals on their projects, from design to build.',
      this.margin,
      this.doc.y + 5,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font(getFont('regular')).text(
      'In additional to providing great technical support and service to customers, SOPREMA provides continuous training to installers.',
      this.margin,
      this.doc.y + 5,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.addPage();
    // Page 3
    this.addGreyHeader();
    this.doc.fontSize(14).font(getFont('bold')).text('Scope', this.margin, PDF_CONSTANTS.GREY_HEADER_HEIGHT + 20);
    this.doc.fillColor(PDF_COLORS.TEXT_SECONDARY);
    this.doc.fontSize(10).font(getFont('regular')).text(
      'Supply and install waterproofing membranes or protective coating systems aimed at protecting the clients building from the effects of water ingress and carbonation.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font(getFont('regular')).text(
      'All systems are backed by full manufacturer’s warranties and are to be installed by trained applicators.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font(getFont('regular')).text(
      'Approved applicators are to have significant training and experience in Construction Waterproofing and/or Wall and Floor Tiling, as required for the application.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font(getFont('regular')).text(
      'When required, Bayset representatives (potentially in conjunction with the appropriate manufacturer), will carry out on-site inspections to ensure systems have been installed in accordance with the manufacturer’s data sheets and recommendations. ',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    let y4 = this.doc.y + 20;
    this.doc.fillColor('black');
    this.doc.fontSize(14).font(getFont('bold')).text('Standards & Codes', this.margin, y4);
    this.doc.fillColor('#323f4a');
    this.doc.fontSize(10).font(getFont('regular')).text(
      'Waterproofing, Protective Coating and Tiling works are to be carried out by licensed applicators, accredited by Bayset Specialist Trade Supplies. SOPREMA systems are to be carried out by SOPREMA approved applicators only.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font(getFont('regular')).text(
      'The Building Code of Australia shall be always observed.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font(getFont('regular')).text(
      'Manufactures Data sheets and recommendations must be read before any work is commenced.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font(getFont('regular')).text(
      'All relevant Australian Standards including but not limited to those listed below must be adhered to at all times.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font(getFont('regular')).text(
      'AS/NZ 4858 Wet Area Membranes Materials',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font(getFont('regular')).text(
      'AS 3740 Waterproofing of Domestic Wet Areas',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font(getFont('regular')).text(
      'AS 4654.1 Waterproofing Membrane systems for exterior use Above Ground Part 1 Materials',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font(getFont('regular')).text(
      'AS 4654.2 Waterproofing Membrane systems for exterior use Above Ground Part 2 Design and Installation',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font(getFont('regular')).text(
      'AS 3958.1 Guide to the installation of ceramic tiles',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font(getFont('regular')).text(
      'BS 8102 Code of Practice for Protection of Below Ground Structures Against Water from the ground',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font(getFont('italic')).text(
      'Note: British Standard is used for our below ground systems as no current Australian Standard has been published',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.addPage();
    // Page 4
    this.addGreyHeader();
    this.doc.fontSize(14).font(getFont('bold')).text('Product & Application Requirements', this.margin, PDF_CONSTANTS.GREY_HEADER_HEIGHT + 20);
    this.doc.fillColor(PDF_COLORS.TEXT_SECONDARY);
    this.doc.fontSize(10).font(getFont('regular')).text(
      'Substitutions of waterproofing membranes, protective coatings or tile adhesive or their systems are not permitted.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font(getFont('regular')).text(
      'All work performed under the requirements of the specification shall be in strict accordance with manufacturer’s product data sheets.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font(getFont('regular')).text(
      'It is the contractor’s responsibility to ensure all persons under the contractor’s control are fully aware of all requirements.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font(getFont('regular')).text(
      'All climactic restrictions for application including ambient and surface temperatures nominated in the manufacturer’s product data sheets shall be strictly adhered to.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font(getFont('regular')).text(
      'All contractors/sub-contractors must perform their own due diligence in regards to extent of areas quoted and suitability of membrane specified as changes regularly occur during the design phase.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    let y5 = this.doc.y + 20;
    this.doc.fillColor('black');
    this.doc.fontSize(14).font(getFont('bold')).text('Special Details', this.margin, y5);
    this.doc.fillColor('#323f4a');
    this.doc.fontSize(10).font(getFont('regular')).text(
      'Where a standard detail does not exist or cannot be applied, an approved alternative must be obtained from Bayset Specialist Trade Supplies before proceeding with the installation.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    let y6 = this.doc.y + 20;
    this.doc.fillColor('black');
    this.doc.fontSize(14).font(getFont('bold')).text('Acceptance of Substrate', this.margin, y6);
    this.doc.fillColor('#323f4a');
    this.doc.fontSize(10).font(getFont('regular')).text(
      'Surface examination and preparation must be completed in accordance to membrane’s Technical Data Sheets.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font(getFont('regular')).text(
      'Be sure plumbing, carpentry and all other works have been duly completed.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font(getFont('regular')).text(
      'Before waterproofing work begins, the owner\'s representative and waterproofing foreman will inspect and approve deck conditions (including slopes and wood grounds) as well as flashings at parapets, roof drains, plumbing vents, ventilation outlets and other construction joints. If necessary, a non-conformity notice should be issued to the contractor, so that required corrections can be carried out. The start of waterproofing work will be considered as acceptance of conditions for work completion.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font(getFont('regular')).text(
      'All surfaces shall be dry, clean, smooth and free from sharp objects, laitance, oils, grease or any foreign materials which may inhibit or reduce adhesion. Falls across all horizontal surfaces should achieve 1:80 or 1:100 to the nearest drainage point within each segregated area, as per Australian Standards.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font(getFont('regular')).text(
      'No materials shall be installed during rain or snowfall.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.fontSize(10).font(getFont('regular')).text(
      'When a new membrane is to be adhered to substrate, an adhesion test is recommended.',
      this.margin,
      this.doc.y + 10,
      { align: 'justify', lineGap: 1, width: this.pageWidth - 2 * this.margin }
    );
    this.doc.addPage();
  }

  private addGreyHeader(): void {
    this.doc
      .rect(0, 0, this.pageWidth, PDF_CONSTANTS.GREY_HEADER_HEIGHT)
      .fill(PDF_COLORS.GREY_HEADER);
    this.doc.fillColor(PDF_COLORS.BLACK);
  }

  private addAppendixPage(projectAreas: any[]): void {
    this.addGreyHeader();
    this.doc.fontSize(14).font(getFont('bold')).text('In this document', this.margin, PDF_CONSTANTS.GREY_HEADER_HEIGHT + 20);
    this.doc.moveDown(1);

    // Group project areas by area_type
    const groupedAreas = groupProjectAreasByType(projectAreas);

    // Iterate through each area type
    Object.keys(groupedAreas).forEach((areaType, sectionIndex) => {
      const areas = groupedAreas[areaType];

      // Check if we need a new page
      this.addNewPageIfNeeded(100 + areas.length * 60);

      // Section header (e.g., "1. ROOFS")
      this.doc.fillColor(PDF_COLORS.BLACK);
      this.doc
        .fontSize(12)
        .font(getFont('bold'))
        .text(`${sectionIndex + 1}. ${formatAreaTypeName(areaType).toUpperCase()}`, this.margin + 20, this.doc.y);

      this.doc.moveDown(0.5);

      // List each project area under this type
      areas.forEach((area) => {
        this.addNewPageIfNeeded(50);

        // Area name with combination (e.g., "Exposed Roofs")
        const areaName = area.name || 'Unnamed Area';
        const combination = area.combination || 1;

        this.doc
          .fontSize(11)
          .font(getFont('regular'))
          .text(
            `${areaName} - Combination ${combination}`,
            this.margin + 40,
            this.doc.y + 5
          );

        this.doc.moveDown(0.8);
      });

      this.doc.moveDown(0.5);
    });

    this.doc.fillColor(PDF_COLORS.BLACK);
    this.doc.addPage();
  }

  private addSystemDetails(projectAreas: any[]): void {
    this.addGreyHeader();
    this.doc.moveDown(2);
    this.doc.fillColor(PDF_COLORS.BLACK);

    // Group project areas by area type
    const groupedAreas = groupProjectAreasByType(projectAreas);
    const areaTypeKeys = Object.keys(groupedAreas);

    // Display each area type and its project areas with system details
    areaTypeKeys.forEach((areaType, areaTypeIndex) => {
      const areas = groupedAreas[areaType];

      // Add separator line between different area types (except for first one)
      if (areaTypeIndex > 0) {
        this.addNewPageIfNeeded(50);
        this.drawSeparatorLine();
      }

      // Area type header
      this.doc
        .fontSize(14)
        .font(getFont('bold'))
        .text(`${formatAreaTypeName(areaType).toUpperCase()}`, this.margin, this.doc.y + 20);

      this.doc.moveDown(0.5);
      this.drawSeparatorLine();
      this.doc.moveDown(0.5);


      // Display each project area under this type
      areas.forEach((area: any, areaIndex: number) => {
        this.addNewPageIfNeeded(200);

        // Add separator line between different project areas within same type (except for first one)
        if (areaIndex > 0) {
          this.drawSeparatorLine();
        }

        // Project area header
        this.doc.fillColor(PDF_COLORS.BLACK);
        this.doc
          .fontSize(12)
          .font(getFont('bold'))
          .text(`${area.name}`, this.margin + 20, this.doc.y);
        this.doc.moveDown(0.3);

        // System stack details
        if (area.system_stack) {
          const systemStack = area.system_stack;

          // System layers
          if (systemStack.system_stack_layer && systemStack.system_stack_layer.length > 0) {
            // Group layers by combination
            const layersByCombination = groupLayersByCombination(systemStack.system_stack_layer, area.combination);

            layersByCombination.forEach((combo) => {
              this.addNewPageIfNeeded(50 + combo.products.length * 20);

              if (layersByCombination.length > 1) {
                this.doc
                  .fontSize(10)
                  .font(getFont('bold'))
                  .text(`Combination ${combo.combination}:`, this.margin + 20, this.doc.y);
                this.doc.moveDown(0.2);
              }
              combo.products.forEach((product) => {
                this.addNewPageIfNeeded(20);
                const currentY = this.doc.y;
                const layer = product.layer ? `${formatValue(product.layer)}: ` : '';
                this.doc.fontSize(10)
                  .font(getFont('bold'))
                  .text(layer, this.margin + 20, currentY, { width: 80, continued: false })
                  .lineGap(1);
                this.doc.fontSize(10)
                  .font(getFont('italic'))
                  .text(product.name, this.margin + 120, currentY, { width: 300 })
                  .lineGap(1);
                this.doc.moveDown(0.5);
              });
            });
          }
        }
      });
      this.doc.moveDown(0.5);
    });
    this.doc.addPage();
  }

  private addFooter(): void {
    // Check if we need a new page for footer (footer needs ~80 points of space)
    const footerHeight = 80;
    this.addNewPageIfNeeded(footerHeight);

    // Add some spacing before footer
    this.doc.moveDown(2);

    // Use current Y position instead of fixed position from bottom
    const startY = this.doc.y;

    this.doc
      .fontSize(12)
      .font(getFont('bold'))
      .text('SOPREMA\'s Project References, Technical Data and Details', this.margin, startY);

    // --- Project References ---
    this.doc
      .fontSize(10)
      .font(getFont('regular'))
      .text('Project References can be viewed at:', this.margin, startY + 20);

    this.doc
      .fillColor('blue')
      .fontSize(10)
      .font(getFont('regular'))
      .text('https://soprema.com.au/projects/', this.margin + 200, startY + 20, {
        link: 'https://soprema.com.au/projects/',
        underline: true
      })
      .fillColor('black');

    // --- Technical Data Sheets ---
    this.doc
      .fontSize(10)
      .font(getFont('regular'))
      .text('Technical Data Sheets can be obtained at:', this.margin, startY + 35);

    this.doc
      .fillColor('blue')
      .fontSize(10)
      .font(getFont('regular'))
      .text('https://soprema.com.au/tds-download', this.margin + 200, startY + 35, {
        link: 'https://soprema.com.au/tds-download',
        underline: true
      })
      .fillColor('black');

    // --- Technical Details ---
    this.doc
      .fontSize(10)
      .font(getFont('regular'))
      .text('Technical Details can be obtained at:', this.margin, startY + 50);

    this.doc
      .fillColor('blue')
      .fontSize(10)
      .font(getFont('regular'))
      .text('https://soprema.com.au/details-download', this.margin + 200, startY + 50, {
        link: 'https://soprema.com.au/details-download',
        underline: true
      })
      .fillColor('black');
    let y = this.doc.y + 30;
    this.doc
      .fontSize(12)
      .font(getFont('bold'))
      .text('SOPREMA’s Technical Support', this.margin, y);
    this.doc
      .fontSize(10)
      .font(getFont('regular'))
      .text(
        'SOPREMA has earned its place among the leaders of the waterproofing industry in the world, thanks to the expertise and availability of its technical team. SOPREMA Australia technical representatives support construction professionals in their projects from design through to completion.',
        this.margin,
        y + 20,
      );
    y = this.doc.y + 20;
    this.doc
      .fontSize(10)
      .font(getFont('regular'))
      .text(
        'Local technical advice from SOPREMA includes:',
        this.margin,
        y,
      );
    this.doc
      .fontSize(10)
      .font(getFont('regular'))
      .text(
        'Project review and advice on waterproofing solutions',
        this.margin,
        y + 20,
      );
    this.doc
      .fontSize(10)
      .font(getFont('regular'))
      .text(
        'Waterproofing details review for your projects',
        this.margin,
        y + 35,
      );
    this.doc
      .fontSize(10)
      .font(getFont('regular'))
      .text(
        'Waterproofing membranes and photovoltaic panel layout assistance',
        this.margin,
        y + 50,
      );
    this.doc
      .fontSize(10)
      .font(getFont('regular'))
      .text(
        'Wind load calculations',
        this.margin,
        y + 65,
      );
    this.doc
      .fontSize(10)
      .font(getFont('regular'))
      .text(
        'Condensation risk analysis',
        this.margin,
        y + 80,
      );
    this.doc
      .fontSize(10)
      .font(getFont('regular'))
      .text(
        'Approved waterproofing contactors list',
        this.margin,
        y + 95,
      );
    this.doc
      .fontSize(10)
      .font(getFont('regular'))
      .text(
        'Onsite quality assurance',
        this.margin,
        y + 110,
      );
    this.doc
      .fontSize(10)
      .font(getFont('regular'))
      .text(
        'CPD and ongoing training',
        this.margin,
        y + 125,
      );
  }

  private drawSeparatorLine(): void {
    // Add some spacing before the line
    this.doc.moveDown(0.3);
    
    const currentY = this.doc.y;
    const lineWidth = 0.5;
    const lineColor =  PDF_COLORS.BLACK;
    
    // Save current state
    this.doc.save();
    
    // Draw the line
    this.doc
      .strokeColor(lineColor)
      .lineWidth(lineWidth)
      .moveTo(this.margin, currentY)
      .lineTo(this.pageWidth - this.margin, currentY)
      .stroke();
    
    // Restore state and add spacing after
    this.doc.restore();
    this.doc.moveDown(0.3);
  }

  private addNewPageIfNeeded(requiredSpace: number): void {
    if (this.doc.y + requiredSpace > this.pageHeight - this.margin) {
      this.doc.addPage();
    }
  }
}
