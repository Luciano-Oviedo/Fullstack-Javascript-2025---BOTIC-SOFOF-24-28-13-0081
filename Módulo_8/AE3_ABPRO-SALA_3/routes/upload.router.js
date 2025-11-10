import express from "express";
import { validacionMiddleware } from "../middlewares/validacion.middleware.js";
import { subirArchivos } from "../controllers/update.controller.js";

export const uploadRouter = express.Router();

uploadRouter.route('/')
    .post(validacionMiddleware, subirArchivos);