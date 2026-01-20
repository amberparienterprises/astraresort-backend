// utils/s3Images.js
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const BUCKET = process.env.S3_BUCKET;

// -------------------- URL HELPERS --------------------
function isDataUrl(str = '') {
  return /^data:image\/(png|jpe?g|webp|avif);base64,/.test(str);
}

function isHttpUrl(str = '') {
  return /^https?:\/\//i.test(str);
}

function extFromDataUrl(dataUrl) {
  const match = /^data:image\/(png|jpe?g|webp|avif);base64,/i.exec(dataUrl);
  if (!match) return 'jpg';
  return match[1] === 'jpeg' ? 'jpg' : match[1];
}

function bufferFromDataUrl(dataUrl) {
  const base64 = dataUrl.split(',')[1];
  return Buffer.from(base64, 'base64');
}

// -------------------- DATA URL UPLOADER --------------------
async function uploadDataUrlToS3(dataUrl, folder = 'blogs') {
  const ext = extFromDataUrl(dataUrl);
  const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  
  const Body = bufferFromDataUrl(dataUrl);
  const mime = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    avif: 'image/avif'
  }[ext] || 'image/jpeg';

  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body,
    ContentType: mime,
    CacheControl: 'public, max-age=31536000, immutable',
    ACL: 'public-read'
  }));

  const url = `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  return { url, key };
}

// -------------------- BUFFER UPLOADER --------------------
function extFromMime(mime) {
  if (!mime) return 'jpg';
  if (mime.includes('jpeg')) return 'jpg';
  if (mime.includes('png')) return 'png';
  if (mime.includes('webp')) return 'webp';
  if (mime.includes('avif')) return 'avif';
  return 'jpg';
}

async function uploadBufferToS3({ buffer, mime, folder = 'blogs' }) {
  const ext = extFromMime(mime);
  const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: mime || 'application/octet-stream',
    CacheControl: 'public, max-age=31536000, immutable', // 🔥 LONG-TERM CACHE
    ACL: 'public-read'
  }));

  const url = `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  return { url, key };
}

// -------------------- DELETE --------------------
async function deleteKeys(keys = []) {
  for (const key of keys.filter(Boolean)) {
    try {
      await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
    } catch (err) {
      console.error(`Failed to delete S3 object: ${key}`, err.message);
    }
  }
}

module.exports = {
  isDataUrl,
  isHttpUrl,
  uploadDataUrlToS3,
  uploadBufferToS3,
  deleteKeys
};
