import cloudinary from '../config/cloudinary.js'

/**
 * Sube un archivo de imagen a Cloudinary en la carpeta especificada.
 *
 * @param {Express.Multer.File} file - Archivo a subir.
 * @param {string} folder - Carpeta destino en Cloudinary.
 *
 * @returns {Promise<string>} URL segura de la imagen subida.
 *
 * @throws {Error} Lanza error si la subida falla.
 */
export const uploadToCloudinary = async (file, folder) => {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: 'image'
          },
          (error, result) => {
            if (error) {
              reject(new Error(error.message))
            } else {
              resolve(result)
            }
          }
        )
        .end(file.buffer)
    })

    return result.secure_url
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    throw new Error('Failed to upload image to Cloudinary')
  }
}

/**
 * Elimina una imagen de Cloudinary a partir de su URL.
 *
 * @param {string} imageUrl - URL completa de la imagen en Cloudinary.
 *
 * @throws {Error} Lanza error si la eliminación falla.
 */
export const deleteFromCloudinary = async (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== 'string') {
    return
  }

  try {
    const parts = imageUrl.split('/')
    const lastPart = parts[parts.length - 1]
    const [publicId, extension] = lastPart.split('.')
    const fullPublicId = `${parts[parts.length - 2]}/${publicId}`

    await cloudinary.uploader.destroy(fullPublicId)
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
    throw new Error('Failed to delete image from Cloudinary')
  }
}
