// // utils/uploadToS3.js
// const {
//     S3Client,
//     PutObjectCommand,
//     DeleteObjectCommand,
//   } = require('@aws-sdk/client-s3');
//   const path = require('path');
//   const { v4: uuidv4 } = require('uuid');
  
//   const s3 = new S3Client({
//     region: process.env.AWS_REGION, // 👈 standard env name
//     credentials: {
//       accessKeyId: process.env.AWS_ACCESS_KEY_ID,     // 👈 standard env name
//       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // 👈 standard env name
//     },
//   });
  
//   const bucket = process.env.AWS_S3_BUCKET;
//   const publicBase = process.env.AWS_PUBLIC_BASE || `https://${bucket}.s3.amazonaws.com`; 
//   // If using CloudFront, set AWS_PUBLIC_BASE=https://cdn.example.com
  
//   async function putObject({ buffer, contentType, ext, prefix = '' }) {
//     const key = `${prefix}${uuidv4()}${ext || ''}`;
//     const cmd = new PutObjectCommand({
//       Bucket: bucket,
//       Key: key,
//       Body: buffer,
//       ContentType: contentType,
//     });
//     const out = await s3.send(cmd);
//     if (out.$metadata.httpStatusCode !== 200) {
//       throw new Error('S3 upload failed');
//     }
//     return { key, url: `${publicBase}/${key}` };
//   }
  
//   exports.uploadImageToS3 = async (file, prefix = 'images/') => {
//     if (!file) throw new Error('Image file is missing');
//     const ext = path.extname(file.originalname) || '';
//     const contentType = file.mimetype || 'application/octet-stream';
//     return putObject({ buffer: file.buffer, contentType, ext, prefix });
//   };
  
//   exports.uploadPdfToS3 = async (file, prefix = 'pdfs/') => {
//     if (!file) throw new Error('PDF file is missing');
//     return putObject({ buffer: file.buffer, contentType: 'application/pdf', ext: '.pdf', prefix });
//   };
  
//   exports.deleteObjectFromS3 = async (objectUrl) => {
//     // supports both direct S3 URLs and CloudFront
//     const key = objectUrl.split('/').slice(3).join('/'); // after domain/bucket/
//     const cmd = new DeleteObjectCommand({ Bucket: bucket, Key: key });
//     await s3.send(cmd);
//   };
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path'); // 👈 missing earlier
const { v4: uuidv4 } = require('uuid');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const bucket = process.env.AWS_S3_BUCKET;
const publicBase = process.env.AWS_PUBLIC_BASE || `https://${bucket}.s3.amazonaws.com`;

const extFromMime = (mime) => {
  if (!mime) return '';
  const map = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'image/svg+xml': '.svg',
    'application/pdf': '.pdf',
  };
  return map[mime] || '';
};

const safe = (s) => (s || '').toString().replace(/[^a-z0-9-_]/gi, '_').toLowerCase();

async function put({ buffer, contentType, key }) {
  const cmd = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000, immutable",
  });

  const out = await s3.send(cmd);
  if (out.$metadata.httpStatusCode !== 200) throw new Error('S3 upload failed');
  return { url: `${publicBase}/${key}`, key };
}


exports.uploadImageToS3 = async (file, customName, { overwrite = false, prefix = 'images/' } = {}) => {
  if (!file) throw new Error('Image file is missing');

  const originalExt = path.extname(file.originalname || '') || extFromMime(file.mimetype);
  const base = safe(customName) || safe(path.basename(file.originalname || 'image', originalExt)) || 'image';
  const filename = overwrite ? `${base}${originalExt}` : `${base}-${uuidv4()}${originalExt}`;
  const key = `${prefix}${filename}`;

  return put({ buffer: file.buffer, contentType: file.mimetype || 'application/octet-stream', key });
};

exports.deleteObjectFromS3 = async (objectUrl) => {
  const key = objectUrl.split('/').slice(3).join('/');
  const cmd = new DeleteObjectCommand({ Bucket: bucket, Key: key });
  await s3.send(cmd);
};
