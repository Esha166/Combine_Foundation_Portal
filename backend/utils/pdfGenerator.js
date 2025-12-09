import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to fetch image buffer from URL
const fetchImage = async (src) => {
  if (!src) return null;

  // If it's a local path (not starting with http), return it directly
  if (!src.startsWith('http')) {
    return src;
  }

  try {
    const response = await fetch(src);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
};

// Function to add the front side of the ID card to the PDF
const addIdCardFront = async (doc, userData, idCardData) => {
  const cardX = 50;
  const cardY = 50;
  const cardWidth = 350;
  const cardHeight = 500;

  // Draw Card Container (White background with border)
  doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 15)
    .fillAndStroke('#ffffff', '#d1d5db');

  // --- Header Section ---
  doc.save();
  doc.roundedRect(cardX, cardY, cardWidth, 130, 15)
    .clip();
  doc.rect(cardX, cardY, cardWidth, 130)
    .fill('#FF6900');
  doc.restore();

  // Logo (White circle background)
  const logoY = cardY + 25;
  doc.circle(cardX + cardWidth / 2, logoY + 30, 35)
    .fill('#ffffff');

  // Load Logo
  const logoPath = path.join(__dirname, '../../frontend/public/logo.png');
  if (fs.existsSync(logoPath)) {
    try {
      doc.image(logoPath, cardX + cardWidth / 2 - 25, logoY + 5, { width: 50, height: 50 });
    } catch (err) {
      console.error('Error loading logo:', err);
    }
  }

  // "COMBINE FOUNDATION" Text
  doc.fontSize(16)
    .font('Helvetica-Bold')
    .fillColor('#ffffff')
    .text('COMBINE FOUNDATION', cardX, logoY + 90, {
      width: cardWidth,
      align: 'center'
    });

  // --- Profile Image Section ---
  const photoY = cardY + 140;
  const photoSize = 110;
  const photoX = cardX + (cardWidth - photoSize) / 2;

  // Draw circle border for photo
  doc.circle(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2 + 4)
    .lineWidth(4)
    .strokeColor('#FF6900')
    .stroke();

  // Draw Profile Photo
  try {
    const profileImageBuffer = await fetchImage(userData.profileImage);
    if (profileImageBuffer) {
      doc.save();
      doc.circle(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2)
        .clip();
      doc.image(profileImageBuffer, photoX, photoY, { width: photoSize, height: photoSize });
      doc.restore();
    } else {
      // Placeholder if no image
      doc.circle(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2)
        .fill('#f3f4f6');
      doc.fontSize(32).fillColor('#FF6900').text(
        userData.name ? userData.name.charAt(0).toUpperCase() : 'U',
        cardX, photoY + 38, { width: cardWidth, align: 'center' }
      );
    }
  } catch (err) {
    console.error('Error drawing profile image:', err);
  }

  // --- User Info Section ---
  const infoY = photoY + photoSize + 25;

  // Name
  doc.fontSize(18)
    .font('Helvetica-Bold')
    .fillColor('#111827')
    .text(userData.name, cardX + 20, infoY, { width: cardWidth - 40, align: 'center' });

  // Role / Expertise
  doc.fontSize(11)
    .font('Helvetica')
    .fillColor('#6B7280')
    .text(
      (userData.expertise && userData.expertise.length > 0) ? userData.expertise.join(' & ') : (userData.role || 'Volunteer').toUpperCase(),
      cardX + 20, infoY + 25, { width: cardWidth - 40, align: 'center' }
    );

  // Divider
  doc.moveTo(cardX + 50, infoY + 50)
    .lineTo(cardX + cardWidth - 50, infoY + 50)
    .strokeColor('#e5e7eb')
    .lineWidth(1)
    .stroke();

  // Details Table
  const detailsY = infoY + 65;
  const labelX = cardX + 50;

  const addDetailRow = (label, value, y) => {
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#4B5563').text(label, labelX, y);
    doc.fontSize(10).font('Helvetica').fillColor('#111827').text(value, cardX + 50, y, {
      width: cardWidth - 100,
      align: 'right'
    });
    doc.moveTo(labelX, y + 18).lineTo(cardX + cardWidth - 50, y + 18).strokeColor('#f3f4f6').lineWidth(0.5).stroke();
  };

  addDetailRow('ID:', idCardData.idNumber || 'N/A', detailsY);
  addDetailRow('Join Date:', new Date(userData.createdAt).toLocaleDateString(), detailsY + 30);
  addDetailRow('Phone:', userData.phone || 'N/A', detailsY + 60);
};

// Function to add the back side of the ID card to the PDF
const addIdCardBack = async (doc, userData, idCardData) => {
  const cardX = 450;
  const cardY = 50;
  const cardWidth = 350;
  const cardHeight = 500;

  // Draw Card Container
  doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 15)
    .fillAndStroke('#ffffff', '#d1d5db');

  const contentY = cardY + 40;

  // Heading
  doc.fontSize(16)
    .font('Helvetica-Bold')
    .fillColor('#111827')
    .text('Volunteer Information', cardX, contentY, { width: cardWidth, align: 'center' });

  // QR Code
  const qrY = contentY + 50;
  const qrSize = 120;

  // QR Container
  doc.roundedRect(cardX + (cardWidth - qrSize - 20) / 2, qrY - 10, qrSize + 20, qrSize + 20, 10)
    .fillAndStroke('#ffffff', '#e5e7eb');

  try {
    const qrBuffer = await fetchImage(idCardData.qrCode);
    if (qrBuffer) {
      doc.image(qrBuffer, cardX + (cardWidth - qrSize) / 2, qrY, { width: qrSize, height: qrSize });
    } else {
      doc.rect(cardX + (cardWidth - qrSize) / 2, qrY, qrSize, qrSize).stroke();
      doc.fontSize(9).text('QR Code', cardX, qrY + 50, { width: cardWidth, align: 'center' });
    }
  } catch (err) {
    console.error('Error drawing QR code:', err);
  }

  // Name again
  doc.fontSize(14)
    .font('Helvetica-Bold')
    .fillColor('#111827')
    .text(userData.name, cardX + 20, qrY + qrSize + 35, { width: cardWidth - 40, align: 'center' });

  // Validity Info
  const validY = qrY + qrSize + 65;
  const labelX = cardX + 70;

  doc.fontSize(10).font('Helvetica-Bold').fillColor('#4B5563').text('Valid From:', labelX, validY);
  doc.font('Helvetica').fillColor('#111827').text(new Date(idCardData.validFrom).toLocaleDateString(), labelX + 80, validY);

  doc.font('Helvetica-Bold').fillColor('#4B5563').text('Valid Thru:', labelX, validY + 25);
  doc.font('Helvetica').fillColor('#111827').text(new Date(idCardData.validThru).toLocaleDateString(), labelX + 80, validY + 25);

  // CNIC Field - ADDED
  if (userData.cnic) {
    doc.font('Helvetica-Bold').fillColor('#4B5563').text('CNIC:', labelX, validY + 50);
    doc.font('Helvetica').fillColor('#111827').text(userData.cnic, labelX + 80, validY + 50);
  }

  // Emergency Contact Box
  const emergencyY = cardY + cardHeight - 110;
  doc.roundedRect(cardX + 30, emergencyY, cardWidth - 60, 90, 10)
    .fill('#EFF6FF');

  doc.fontSize(10)
    .font('Helvetica-Bold')
    .fillColor('#1E3A8A')
    .text('In Case of Emergency', cardX + 30, emergencyY + 18, { width: cardWidth - 60, align: 'center' });

  doc.fontSize(9)
    .font('Helvetica')
    .fillColor('#1E40AF')
    .text('Please contact COMBINE FOUNDATION', cardX + 30, emergencyY + 40, { width: cardWidth - 60, align: 'center' });

  doc.fontSize(12)
    .font('Helvetica-Bold')
    .fillColor('#1E3A8A')
    .text('+92 316 378243', cardX + 30, emergencyY + 60, { width: cardWidth - 60, align: 'center' });
};

// Function to generate the complete ID card PDF
export const generateIdCardPDF = async (userData, idCardData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: [850, 600], // Custom size to fit both cards side by side
        margin: 0
      });

      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Add content
      await addIdCardFront(doc, userData, idCardData);
      await addIdCardBack(doc, userData, idCardData);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};