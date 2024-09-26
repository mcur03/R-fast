import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config();



interface DecodedToken {
    numeroId: string;
    iat: number;
    exp: number;
}


export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        // Decodificar el token y extraer `numeroId` en lugar de `id`
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { numeroId: string };
        req.userId = decoded.numeroId; // Añade `numeroId` como `userId` en el objeto req
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Token inválido.' });
    }
};



export function validateToken(req:Request, res:Response, netx:NextFunction){
    const token = req.header('Authorization')?.split(' ')[1];

    if(!token){
        return res.status(401).json({message: 'Acceso denegado '});
    }
    try{
        jwt.verify(token as string, process.env.JWT_SECRET as string, (err)=>{
            if(err){
                console.error('Acceso denegado, token caducado o incorrecto', err.message);
                return res.status(401).json({message:'Acceso denegado, token caducado o incorrecto'})
            }else{
                console.log('autenticado');
                netx();
            }
        });
    }catch(error){
        console.error(error);
        return res.status(401).json({message: 'token invalido', error})
    }
}