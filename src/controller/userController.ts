import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import UserRepository from '../repositories/loginRepository';

class UserController{
    // inicion de sesión de las personas
    static async login(req:Request, res:Response){
            const { tipoId, numeroId, fechanac } = req.body;
        try {
            const user = await UserRepository.loginUser( tipoId, numeroId, fechanac )

        if(!user){
            return res.status(401).json({message: 'Usuario no registrado'});
        }

        const token = jwt.sign({  tipoId, numeroId, fechanac }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRES})

        return res.status(200).json({
            message: 'Usuario autenticado',
            token: token
        }); 
        } catch (error) {
            return res.status(500).json({error: (error as Error).message})
        }
    }

    // mostrar el perfil del usuario
    static async perfilUsuario(req:Request, res:Response){
        const { id } = req.params;
        try {
            const user = await UserRepository.perfilUsuario(id);

            return res.status(200).json(user);
        } catch (error) {
            console.error('Error al mostrar el perfil');
            return res.status(500).json({message: 'Error al mostrar el perfil'})
        }
    }

    // mostrar las ordenes que tiene el usuario
    static async mostrarOrdenes(req:Request, res:Response){
        const { id } = req.params;
        
        try {
            const user = await UserRepository.ordenLaboratorio(id);
            return res.status(200).json(user);
        } catch (error) {
            console.error('error al mosrar las oredenes', error);
            return res.status(500).json({message: 'error al mostrar las ordenes', error});
        }
    }

    static async infoOrden(req:Request, res:Response){
        try {
            const idPersona = req.params.idPersona;
            const idResul = req.params.idResul;
            const info = await UserRepository.infoOrden(idPersona, idResul);
            return res.status(200).json(info);
        } catch (error) {
            console.error('Error al obtener la informacion de la orden');
            return res.status(500).json({message: 'Error al obtener la informacion de la orden'})
        }
    }
}

export default UserController;
    