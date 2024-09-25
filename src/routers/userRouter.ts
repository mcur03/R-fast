import { Router } from "express";
import UserController from "../controller/userController";
import { validateToken } from '../middleware/userMiddleware';

const router = Router();

router.get('/perfil/:id', validateToken, UserController.perfilUsuario);
router.get('/login', UserController.login);
router.get('/ordenes/:id', validateToken, UserController.mostrarOrdenes);
router.get('/infoOrden/:idP/:idR', UserController.infoOrden);

export default router;