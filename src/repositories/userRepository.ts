import { RowDataPacket } from "mysql2";
import db from "../config/db";
import Persona from "../Dto/PersonaDto";

class UserRepository{
    static async loginUser(numeroId:string, fechanac:string){
        const [ rows ] = await db.query<RowDataPacket[]>('SELECT * FROM  WHERE numeroId = ?',
            [numeroId,fechanac]);
            if (rows.length > 0) {
                const user = rows[0] as Persona;
                return user
            }
    }

    static async perfilUsuario(id:string): Promise<Persona[]>{
        try{
            const [ rows ] = await db.query(
                `SELECT 
                    tipo_id.nombre AS 'Tipo de identificación',
                    p.numeroid AS 'Número de identificación',
                	 p.apellido1 AS 'Primer apellido',
                    p.apellido2 AS 'Segundo apellido',
                    p.nombre1 AS 'Primer nombre',
                    p.nombre2 AS 'Segundo nombre',
                    p.fechanac AS 'Fecha de nacimiento',
                    sexo.nombre AS 'Sexo biológico',
                    p.direccion AS 'Dirección de residencia',
                    p.tel_movil AS 'Número de celular',
                    p.email AS 'Correo electrónico'
                FROM 
                    gen_m_persona p
                LEFT JOIN 
                    gen_p_listaopcion tipo_id ON p.id_tipoid = tipo_id.id
                LEFT JOIN 
                    gen_p_listaopcion sexo ON p.id_sexobiologico = sexo.id;
                `
            )
            return rows as Persona[];
        }catch(error){
            console.error('Error fetching products:', error);
            throw new Error('Could not fetch products from the database');
        }
        
    }
}

export default UserRepository;
