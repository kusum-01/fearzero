import fs from 'fs';
import { createRequire } from 'module';
import mammoth from 'mammoth';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

export const extractTextFromFile = async (filePath, mimeType) => {
  const buffer = fs.readFileSync(filePath);

  if (mimeType === 'application/pdf') {
    const result = await pdfParse(buffer);
    return result.text;
  }

  if (
    mimeType === 'application/msword' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new Error('Unsupported file type for text extraction');
};
