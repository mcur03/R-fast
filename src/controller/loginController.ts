import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import UserRepository from '../repositories/userRepository';

class UserController{
    // inicion de sesión de las personas
    static async login(req:Request, res:Response){
            const { numeroId, fechanac } = req.body;
        try {
            const user = await UserRepository.loginUser( numeroId, fechanac )

        if(!user){
            return res.status(401).json({message: 'Usuario no registrado'});
        }

        const token = jwt.sign({  numeroId, fechanac }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRES})

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
}

export default UserController;
    
