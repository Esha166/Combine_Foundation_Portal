import qr from 'qr-image';
import { createWriteStream } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a utility function to generate QR code as data URL
export const generateQRCode = (data, size = 200) => {
  return new Promise((resolve, reject) => {
    try {
      const qr_svg = qr.image(data);
      const buffers = [];
      
      qr_svg.on('data', (chunk) => {
        buffers.push(chunk);
      });
      
      qr_svg.on('end', () => {
        const buffer = Buffer.concat(buffers);
        const base64 = buffer.toString('base64');
        const dataURL = `data:image/png;base64,${base64}`;
        resolve(dataURL);
      });
      
      qr_svg.on('error', (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Alternative function to generate QR code URL using external service
export const generateQRCodeURL = (data) => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;
};