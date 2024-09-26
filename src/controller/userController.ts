import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import UserRepository from '../repositories/loginRepository';

class UserController{
    // inicion de sesión de las personas
    static async login(req: Request, res: Response) {
        const { tipoId, numeroId, fechanac } = req.body;
        
        try {
            const user = await UserRepository.loginUser(tipoId as string, numeroId as string, fechanac as string);
    
            if (!user) {
                return res.status(401).json({ message: 'Usuario no registrado' });
            }
    
            const token = jwt.sign({ numeroId }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRES });
    
            return res.status(200).json({
                message: 'Usuario autenticado',
                token: token
            });
        } catch (error) {
            return res.status(500).json({ error: (error as Error).message });
        }
    }

    // mostrar el perfil del usuario
    static async perfilUsuario(req: Request, res: Response) {
        try {
            if (!req.userId) {
                return res.status(400).json({ message: 'El ID del usuario no está disponible.' });
            }
    
            const user = await UserRepository.perfilUsuario(req.userId);  // `userId` es en realidad el `numeroId`
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
    
            return res.status(200).json(user);
        } catch (error) {
            console.error('Error al mostrar el perfil:', error);
            return res.status(500).json({ message: 'Error al mostrar el perfil' });
        }
    }

    // Para optener todas la ordenes del usuario logueado
    static async allOrdenes(req:Request,res:Response){
        try {
            // Verificar que `userId` esté disponible
            if (!req.userId) {
                return res.status(400).json({ message: 'El ID del usuario no está disponible.' });
            }

            // Obtener todas las órdenes de ese usuario
            const orders = await UserRepository.allOrden(req.userId);
            if (!orders.length) {
                return res.status(404).json({ message: 'No se encontraron órdenes para este usuario.' });
            }

            return res.status(200).json(orders);
        } catch (error) {
            console.error('Error al obtener las órdenes del usuario:', error);
            return res.status(500).json({ message: 'Error al obtener las órdenes del usuario.' });
        }
    }

    // funcion para ver el detalle de una orden seleccionada 
    static async detalleOrden(req:Request, res:Response){
        try {
            // Verificar que `userId` esté disponible
            if (!req.userId) {
                return res.status(400).json({ message: 'El ID del usuario no está disponible.' });
            }

            const { orderId } = req.params;  // Obtenemos el ID de la orden desde los parámetros de la URL
            console.log('userId:', req.userId);
            console.log('orderId:', orderId);
            // Obtener los detalles de la orden de ese usuario
            const orderDetails = await UserRepository.infoOrden(req.userId, orderId);
            if (!orderDetails.length) {
                return res.status(404).json({ message: 'No se encontraron detalles para esta orden o la orden no pertenece al usuario.' });
            }

            return res.status(200).json(orderDetails);
        } catch (error) {
            console.error('Error al obtener los detalles de la orden:', error);
            return res.status(500).json({ message: 'Error al obtener los detalles de la orden.' });
        }
    }

    // funcion para obtener las ordener por numero de orden
    static async ordenBynumero(req: Request, res: Response) {
        try {
            const { orderId } = req.params;  // Extraer el `orderId` de los parámetros de la URL

            console.log('Buscando detalles de la orden con orderId:', orderId);

            // Consultar los detalles de la orden por `orderId`
            const orderDetails = await UserRepository.getOrderByOrderId(orderId);

            if (!orderDetails.length) {
                return res.status(404).json({ message: 'No se encontraron detalles para esta orden.' });
            }

            return res.status(200).json(orderDetails);
        } catch (error) {
            console.error('Error al obtener los detalles de la orden:', error);
            return res.status(500).json({ message: 'Error al obtener los detalles de la orden.' });
        }
    }

    // Se realiza la consulta por un rango de fecha
    static async consultaRangoFecha(req: Request, res: Response) {
        try {
            const { fechaInicio, fechaFin } = req.query;  // Extraemos las fechas del query

            // Verificamos que ambas fechas estén presentes
            if (!fechaInicio || !fechaFin) {
                return res.status(400).json({ message: 'Se deben proporcionar las fechas de inicio y fin.' });
            }

            console.log('Rango de fechas:', fechaInicio, fechaFin);

            // Llamamos al repositorio para obtener las órdenes dentro del rango de fechas
            const orders = await UserRepository.consultaRangoFecha(fechaInicio as string, fechaFin as string);

            if (!orders.length) {
                return res.status(404).json({ message: 'No se encontraron órdenes dentro del rango de fechas.' });
            }

            return res.status(200).json(orders);
        } catch (error) {
            console.error('Error al obtener órdenes por rango de fechas:', error);
            return res.status(500).json({ message: 'Error al obtener órdenes por rango de fechas.' });
        }
    }
}

export default UserController;
    