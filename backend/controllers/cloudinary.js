const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (buffer, folder = 'blogs') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

const extractPublicId = (url) => {
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  const [public_id] = filename.split('.');
  const folder = parts[parts.length - 2];
  return `${folder}/${public_id}`;
};

const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl) return;
    const public_id = extractPublicId(imageUrl);
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.error('Cloudinary deletion failed:', error);
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
};
