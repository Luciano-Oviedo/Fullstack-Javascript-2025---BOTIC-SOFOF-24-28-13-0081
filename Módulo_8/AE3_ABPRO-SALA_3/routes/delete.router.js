import { Router } from "express";
import { eliminarArchivos } from "../controllers/delete.controller.js";

export const deleteRouter =  Router();

deleteRouter.route('/:filename')
    .delete(eliminarArchivos);