import PDFDocument from 'pdfkit';
import { generateQRCode, generateQRCodeURL } from '../utils/qrCodeUtils.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to add the front side of the ID card to the PDF
const addIdCardFront = (doc, userData, idCardData) => {
  // Set font and text styles
  doc.fontSize(14).text('COMBINE Foundation', 50, 50, { align: 'center', width: 500 });
  
  // Add a decorative line
  doc.moveTo(50, 80).lineTo(550, 80).stroke();
  
  // Add profile image placeholder or actual image if available
  // For now, we'll add a placeholder rectangle for the profile image
  doc.roundedRect(100, 100, 150, 150, 10);
  doc.strokeColor('#000').stroke();
  
  // Add profile image (if available)
  if (userData.profileImage) {
    try {
      // If it's a URL, PDFKit will handle it. If it's a local path, it will work too.
      doc.image(userData.profileImage, 105, 105, { width: 170, height: 170 });
    } catch (error) {
      // If image fails to load, keep the rectangle as placeholder
      console.log('Failed to load profile image:', error);
      // Add a text placeholder
      doc.fontSize(10).fillColor('#777').text('Profile Photo', 140, 185, { width: 90, align: 'center' });
    }
  } else {
    // Add a text placeholder if no profile image exists
    doc.fontSize(10).fillColor('#777').text('Profile Photo', 140, 185, { width: 90, align: 'center' });
  }
  
  // Add name
  doc.fontSize(20).fillColor('#000').text(userData.name, 280, 120, { width: 250 });
  
  // Add expertise/title
  if (userData.expertise && Array.isArray(userData.expertise) && userData.expertise.length > 0) {
    doc.fontSize(14).fillColor('#555').text(`Expertise: ${userData.expertise.join(', ')}`, 280, 150, { width: 250 });
  } else if (userData.education) {
    doc.fontSize(14).fillColor('#555').text(`Title: ${userData.education}`, 280, 150, { width: 250 });
  } else {
    doc.fontSize(14).fillColor('#555').text(`Role: ${userData.role}`, 280, 150, { width: 250 });
  }
  
  // Add ID number
  doc.fontSize(14).fillColor('#000').text(`ID: ${idCardData.idNumber}`, 280, 180, { width: 250 });
  
  // Add joining date
  doc.fontSize(14).fillColor('#555').text(`Joining Date: ${new Date(userData.createdAt).toLocaleDateString()}`, 280, 210, { width: 250 });
  
  // Add phone number
  doc.fontSize(14).fillColor('#555').text(`Phone: ${userData.phone || 'N/A'}`, 280, 240, { width: 250 });
  
  // Add another decorative line
  doc.moveTo(50, 280).lineTo(550, 280).stroke();
};

// Function to add the back side of the ID card to the PDF
const addIdCardBack = (doc, userData, idCardData) => {
  // Add "ID Card Information" heading
  doc.fontSize(18).fillColor('#0066CC').text('ID CARD INFORMATION', 50, 50, { align: 'center', width: 500 });
  
  // Add QR code with label
  doc.fontSize(12).fillColor('#000').text('QR Code - Verify ID:', 50, 100, { width: 200 });
  if (idCardData.qrCode) {
    try {
      doc.image(idCardData.qrCode, 250, 85, { width: 120, height: 120 });
    } catch (error) {
      console.log('Failed to load QR code image:', error);
      // Add QR code placeholder if image fails
      doc.rect(250, 85, 120, 120).stroke();
      doc.fontSize(10).fillColor('#000').text('QR Code', 265, 135, { align: 'center', width: 120 });
    }
  } else {
    // Add QR code placeholder if no QR code exists
    doc.rect(250, 85, 120, 120).stroke();
    doc.fontSize(10).fillColor('#000').text('QR Code', 265, 135, { align: 'center', width: 120 });
  }
  
  // Add name again
  doc.fontSize(14).fillColor('#000').text(`Name: ${userData.name}`, 50, 220, { width: 500 });
  
  // Add valid from date
  doc.fontSize(14).fillColor('#555').text(`Valid From: ${new Date(idCardData.validFrom).toLocaleDateString()}`, 50, 250, { width: 500 });
  
  // Add valid thru date
  doc.fontSize(14).fillColor('#555').text(`Valid Thru: ${new Date(idCardData.validThru).toLocaleDateString()}`, 50, 280, { width: 500 });
  
  // Add CNIC if available
  if (userData.cnic) {
    doc.fontSize(14).fillColor('#555').text(`CNIC: ${userData.cnic}`, 50, 310, { width: 500 });
  }
  
  // Add emergency contact information
  doc.fontSize(12).fillColor('#000').text('In case of emergency, please contact COMBINE Foundation:', 50, 350, { width: 500 });
  doc.fontSize(12).fillColor('#000').text('Emergency Contact: +92-300-1234567', 50, 370, { width: 500 });
  
  // Add footer
  doc.moveTo(50, 440).lineTo(550, 440).stroke({ width: 0.5 });
  doc.fontSize(10).fillColor('#555').text('COMBINE Foundation - Empowering Communities Through Education', 50, 450, { align: 'center', width: 500 });
  doc.fontSize(9).fillColor('#777').text('This ID card is valid only with signature of authorized person and official seal', 50, 465, { align: 'center', width: 500 });
};

// Function to generate the complete ID card PDF
export const generateIdCardPDF = async (userData, idCardData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 30 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Add front side
      addIdCardFront(doc, userData, idCardData);
      
      // Add a new page for the back side
      doc.addPage();
      addIdCardBack(doc, userData, idCardData);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};