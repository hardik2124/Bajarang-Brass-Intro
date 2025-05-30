const cloudinary = require('cloudinary').v2

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    try {

        const options = { folder };
        if (height) options.height = height;

        options.quality = quality || "auto:best";
        options.resource_type = "auto";
        options.fetch_format = "auto";
        options.use_filename = true;

        return await cloudinary.uploader.upload(file.tempFilePath, options);

    } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        throw new Error("Image upload failed");
    }
};