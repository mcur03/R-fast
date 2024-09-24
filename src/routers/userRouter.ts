import { Router } from "express";
import UserController from "../controller/loginController";


const router = Router();

router.get('/perfil', UserController.perfilUsuario)

export default router;