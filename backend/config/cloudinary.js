const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dev2r1wlo',
    api_key: process.env.CLOUDINARY_API_KEY || '293134459292177',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'KhKutqWEAS2dcAEeI7VxeuXjjBE'
});

module.exports = cloudinary;
