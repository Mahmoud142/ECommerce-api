const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a buffer directly to Cloudinary using a write stream.
 * 
 * @param {Buffer} buffer - The file buffer (e.g. req.file.buffer or sharp output).
 * @param {Object} options - Cloudinary upload configurations (folder, public_id, transformation, etc).
 * @returns {Promise<Object>} - Promise resolving to the Cloudinary API response.
 */
const uploadStream = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
    
    // Write buffer contents to the stream and finish
    stream.end(buffer);
  });
};

module.exports = {
  cloudinary,
  uploadStream,
};
