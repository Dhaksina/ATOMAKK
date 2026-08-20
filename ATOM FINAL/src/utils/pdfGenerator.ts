import { jsPDF } from 'jspdf';
import { Product } from '../db/mockData';

// Helper to convert image URL to base64 Data URL
const loadImageBase64 = (url: string): Promise<string | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } else {
          resolve(null);
        }
      } catch (e) {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
};

export const generateProductPDF = async (product: Product) => {
  // Create landscape A4 PDF (297mm x 210mm)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 297;
  const pageHeight = 210;

  // 1. Solid Yellow Background Area on Left (Clean fill with NO border line!)
  doc.setDrawColor(248, 189, 28);
  doc.setFillColor(248, 189, 28);
  doc.rect(0, 0, 60, 198, 'F');
  doc.triangle(60, 0, 135, 0, 60, 198, 'F');

  // 2. Atom Logo & Brand Name (Top Left)
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.5);
  (doc as any).ellipse(20, 16, 9, 3.5, 'S', 0);
  (doc as any).ellipse(20, 16, 9, 3.5, 'S', 60);
  (doc as any).ellipse(20, 16, 9, 3.5, 'S', 120);
  doc.setFillColor(30, 41, 59);
  doc.circle(20, 16, 1.8, 'F');

  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('ATOMAKK', 34, 18);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Instruments', 34, 22.5);

  // 3. Header Title & Model Badge
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('LOW TEMPERATURE', 12, 36);
  doc.text('CALIBRATOR', 12, 44);

  // Model Badge (ATM-100 or Product ID)
  const modelName = product.id.toLowerCase().includes('dpi-1000') ? 'ATM-100' : product.id.toUpperCase();
  doc.setFillColor(17, 24, 39); // Dark box
  doc.roundedRect(12, 48, 30, 7, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text(modelName, 16, 53);

  // 4. Description Paragraph
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  const descText = product.longDescription || 
    'Low Temperature Calibrator is a high-precision, portable and easy-to-use instrument designed for accurate calibration of temperature sensors, temperature related Instruments and gauges in the low temperature range. It is ideal for industrial, laboratory and field applications where reliability and stability are essential.';
  
  const splitDesc = doc.splitTextToSize(descText, 80);
  doc.text(splitDesc, 12, 61);

  // 5. Key Features
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text('KEY FEATURES', 12, 85);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  let featuresList: string[] = [];
  if (product.features && product.features.length > 0) {
    const raw = Array.isArray(product.features) ? product.features : [product.features];
    raw.forEach(f => {
      if (typeof f !== 'string') return;
      const str = f.trim();
      if (!str) return;
      if (str.includes('High-accuracy current simulation') && str.includes('Suitable for AC/DC calibration')) {
        featuresList.push(
          'High-accuracy current simulation',
          'Suitable for AC/DC calibration',
          'Rugged portable design',
          'Ideal for laboratory and field testing'
        );
      } else if (str.includes('\n') || str.includes('•') || str.includes(';')) {
        str.split(/[\n•;]+/).map(s => s.trim()).filter(Boolean).forEach(s => featuresList.push(s));
      } else {
        featuresList.push(str);
      }
    });
  }
  
  if (featuresList.length === 0) {
    featuresList = [
      'Wide temperature range for low temperature calibration',
      'High stability and uniformity',
      'Digital temperature controller with high accuracy',
      'Portable, compact and durable design',
      'Easy to operate and maintain',
      'Suitable for RTD, Thermocouples and other temperature related instruments',
      'Over temperature protection for safe operation'
    ];
  }

  let currentY = 91;
  featuresList.forEach(feat => {
    doc.setFillColor(17, 24, 39);
    doc.circle(13.5, currentY - 1, 0.8, 'F');
    const splitFeat = doc.splitTextToSize(feat, 75);
    doc.text(splitFeat, 16, currentY);
    currentY += splitFeat.length * 4.8;
  });

  // 6. Center Product Image (Drawn on top of background)
  const imageSrc = product.photo || '/images/products/dpi-1000-m.png';
  const base64Img = await loadImageBase64(imageSrc);

  if (base64Img) {
    try {
      doc.addImage(base64Img, 'PNG', 92, 40, 95, 115);
    } catch (e) {
      console.warn('Image render warning', e);
    }
  }

  // 7. Right Column: NABL Certificate Badge (Top Right)
  doc.setFillColor(248, 189, 28);
  doc.roundedRect(200, 12, 82, 8, 3, 3, 'F');
  doc.setTextColor(17, 24, 39);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('NABL Calibration Certificate Include', 206, 17.5);

  // 8. Specification Tag & Range
  doc.setFillColor(248, 189, 28);
  doc.roundedRect(200, 26, 36, 6, 1.5, 1.5, 'F');
  doc.setTextColor(17, 24, 39);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('SPECIFICATION', 203, 30.2);

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  const rangeVal = product.specs['Temperature Range'] || '-25.0~100 deg C';
  doc.text(rangeVal, 200, 39);

  // 9. Specifications Table
  const tableX = 200;
  let tableY = 44;

  doc.setFillColor(17, 24, 39);
  doc.rect(tableX, tableY, 82, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('SPECIFICATIONS', tableX + 3, tableY + 4.2);

  tableY += 6;
  doc.setFillColor(248, 189, 28);
  doc.rect(tableX, tableY, 36, 5, 'F');
  doc.rect(tableX + 36, tableY, 46, 5, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(tableX, tableY, 82, 5, 'S');

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('PARAMETER', tableX + 2, tableY + 3.6);
  doc.text('DETAILS', tableX + 38, tableY + 3.6);

  tableY += 5;
  const defaultSpecs = [
    { param: 'Model', details: modelName },
    { param: 'Accuracy', details: product.specs['Accuracy'] || '±0.15°C' },
    { param: 'Stability', details: product.specs['Stability'] || '±0.03°C' },
    { param: 'Uniformity', details: product.specs['Uniformity'] || '±0.07°C' },
    { param: 'Display Resolution', details: product.specs['Resolution'] || '0.1°C' },
    { param: 'Controller', details: 'Digital PID Controller' },
    { param: 'Sensor Type', details: 'RTD' },
    { param: 'Display', details: '4 Digit LED Display' },
    { param: 'Power Supply', details: product.specs['Power Supply'] || '230 VAC, 50 Hz' },
    { param: 'Power Consumption', details: '250W (Approx.)' },
    { param: 'Dimension (L x W x H)', details: '218 x 111 x204 mm' },
    { param: 'Weight', details: product.specs['Weight'] || '8.5 kg' },
    { param: 'Insert Hole Depth', details: product.specs['Well Depth'] || '150 mm' }
  ];

  defaultSpecs.forEach((row, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(245, 247, 250);
      doc.rect(tableX, tableY, 82, 5.2, 'F');
    }
    doc.setDrawColor(220, 220, 220);
    doc.rect(tableX, tableY, 36, 5.2, 'S');
    doc.rect(tableX + 36, tableY, 46, 5.2, 'S');
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.text(row.param, tableX + 2, tableY + 3.6);
    doc.setFont('helvetica', 'normal');
    doc.text(row.details, tableX + 38, tableY + 3.6);
    tableY += 5.2;
  });

  // 10. Footer Contact Bar
  doc.setFillColor(17, 24, 39);
  doc.rect(0, 198, pageWidth, 12, 'F');
  doc.setFillColor(248, 189, 28);
  doc.rect(0, 197.2, pageWidth, 0.8, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(248, 189, 28);
  doc.text('ATOMAKK', 130, 204.5);
  doc.setTextColor(255, 255, 255);
  doc.text('+91 9789877567', 150, 204.5);
  doc.text('info@atomakk.com', 190, 204.5);
  doc.text('www.atomakkindia.com', 238, 204.5);

  // Save the PDF
  const filename = `${product.name.replace(/[^a-zA-Z0-9]/g, '_')}_Datasheet.pdf`;
  doc.save(filename);
};
