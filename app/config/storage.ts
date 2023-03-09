import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import { allowedFileExtensions, NotSupportedMediaTypeException } from "../exceptions/NotSupportedMediaTypeException.js";

dotenv.config({ path: "./config/app.env"});

/**
 * Max image size in bytes
 */
const envMaxImageSize = parseInt(process.env.MAX_IMAGE_SIZE as string || "");
const maxImageSize = Number.isInteger(envMaxImageSize) ? envMaxImageSize : 1000000;

/**
 * Recipe images
 */
export const uploadRecipeImages = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const dir = process.env.DIR_RECIPES ?? "uploads/images/recipes";

            cb(null, dir);
        },
        filename: function(req, file, cb) {
            const ext = path.extname(file.originalname).toLowerCase();
            const uniqueName = "recipe-" + Date.now() + "-" + Math.round(Math.random() * 1E9);

            cb(null, uniqueName + ext);
        }
    }),
    fileFilter: function(req, file, cb) {
        const ext = path.extname(file.originalname).toLocaleLowerCase();

        if(!allowedFileExtensions.includes(ext)) {
            return cb(new NotSupportedMediaTypeException());
        }

        cb(null, true);
    },
    limits: {
        fileSize: maxImageSize
    }
});