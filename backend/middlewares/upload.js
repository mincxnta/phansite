import multer from 'multer'

const MIMETYPES = ['image/png', 'image/jpg', 'image/jpeg']

/**
 * Función para filtrar archivos subidos por Multer.
 * Permite solo imágenes PNG, JPG y JPEG.
 *
 * @param {Express.Multer.File} file Archivo subido.
 * @param {(error: Error|null, acceptFile: boolean) => void} cb Callback para aceptar o rechazar el archivo.
 */
const fileFilter = (req, file, cb) => {
  if (MIMETYPES.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only PNG, JPG, and JPEG are allowed.'))
  }
}

/**
 * Middleware para el manejo de subida de archivos con Multer.
 * - Almacena archivos en memoria.
 * - Limita tamaño máximo a 10 MB.
 * - Filtra tipos permitidos con `fileFilter`.
 */
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter
})
