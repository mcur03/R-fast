import { RowDataPacket } from "mysql2";
import db from "../config/db";
import Persona from "../Dto/PersonaDto";

class UserRepository{
    // Optener la informacion del usuario que ha iniciado sesión 
    static async loginUser(tipoId:string, numeroId:string, fechanac:string){
        const [ rows ] = await db.query<RowDataPacket[]>(`
                SELECT 
    gen_p_lista_opcion.nombre AS categoria,
    gen_m_persona.numero_identificacion,
    gen_m_persona.fecha_nacimiento
FROM 
    gen_m_persona
JOIN 
    gen_p_lista_opcion 
ON 
    gen_m_persona.tipo_identificacion = gen_p_lista_opcion.id
WHERE 
    gen_p_lista_opcion.nombre = ? 
    AND gen_m_persona.numero_identificacion = ?
    AND gen_m_persona.fecha_nacimiento = ?;
            `, [tipoId,numeroId,fechanac]);
            console.log(rows);
            if (rows.length > 0) {
                const user = rows[0] as Persona;
                return user
            }
    }

    // Para obtener la informacion del perfil
    static async perfilUsuario(idUsuarioSesion: string): Promise<Persona[]> {
        try {
            const [rows] = await db.query(
                `
                    SELECT 
                        p.id,
                        tipo_id.nombre AS 'Tipo de identificación',
                        p.numero_identificacion AS 'Número de identificación',
                        p.apellido1 AS 'Primer apellido',
                        p.apellido2 AS 'Segundo apellido',
                        p.nombre1 AS 'Primer nombre',
                        p.nombre2 AS 'Segundo nombre',
                        p.fecha_nacimiento AS 'Fecha de nacimiento',
                        sexo.nombre AS 'Sexo biológico',
                        p.direccion AS 'Dirección de residencia',
                        p.telefono_movil AS 'Número de celular',
                        p.email AS 'Correo electrónico'
                    FROM 
                        gen_m_persona p
                    LEFT JOIN 
                        gen_p_lista_opcion tipo_id ON p.tipo_identificacion = tipo_id.id
                    LEFT JOIN 
                        gen_p_lista_opcion sexo ON p.sexo_biologico = sexo.id
                    WHERE 
                        numero_identificacion = ?;
                `,
                [idUsuarioSesion]
            );
            return rows as Persona[];
        }catch(error){
            console.error('Error al mostrar el perfil:', error);
            throw new Error('Error al mostrar el perfil');
        }
        
    }

    // obtener todas las ordenes del paciente 
    static async allOrden(numeroId: string){
        try {
            const [rows] = await db.query<RowDataPacket[]>(`
                SELECT 
                	concat(gen_m_persona.nombre1, ' ',gen_m_persona.nombre2,' ', gen_m_persona.apellido1,' ',gen_m_persona.apellido1) as Nombre,
                    lab_m_orden.fecha AS Fecha_Orden,
                    gen_p_documento.codigo_alfa AS Codigo_Documento,
                    lab_m_orden.orden AS Numero_Orden
                FROM 
                    lab_m_orden
                JOIN 
                    fac_m_tarjetero ON lab_m_orden.id_historia = fac_m_tarjetero.id
                JOIN 
                    gen_m_persona ON fac_m_tarjetero.id_persona = gen_m_persona.id
                JOIN 
                    gen_p_documento ON lab_m_orden.id_documento = gen_p_documento.id
                WHERE 
                    gen_m_persona.numero_identificacion = ?; 
            `,[numeroId]);
            return rows;
        } catch (error) {
            console.error('error al mostrar las ordenes', error);
            throw new Error('error al mostrar las ordenes');
        }
    }

    // optener la informacion de las ordenes del paciente
    static async infoOrden(numeroId:string, orderId:string){
        try {
            console.log('Consultando con numeroId:', numeroId, 'y orderId:', orderId);
            const [ rows ] = await db.query<RowDataPacket[]>(
                `
                SELECT 
                    CONCAT(gen_m_persona.nombre1, ' ', gen_m_persona.nombre2, ' ', gen_m_persona.apellido1, ' ', gen_m_persona.apellido2) AS Nombre,
                    lab_m_orden.fecha AS Fecha_Orden,
                    gen_p_documento.codigo_alfa AS Codigo_Documento,
                    lab_m_orden.orden AS Numero_Orden,
                    lab_p_pruebas.codigo AS Codigo_Prueba,
                    lab_p_pruebas.nombre AS Nombre_Prueba,
                    lab_m_orden_resultados.res_opcion AS Resultado_Opcion,
                    lab_m_orden_resultados.res_numerico AS Resultado_Numerico,
                    lab_m_orden_resultados.res_texto AS Resultado_Texto,
                    lab_m_orden_resultados.res_memo AS Resultado_Memo
                FROM 
                    lab_m_orden
                JOIN 
                    fac_m_tarjetero ON lab_m_orden.id_historia = fac_m_tarjetero.id
                JOIN 
                    gen_m_persona ON fac_m_tarjetero.id_persona = gen_m_persona.id
                JOIN 
                    gen_p_documento ON lab_m_orden.id_documento = gen_p_documento.id
                JOIN 
                    lab_m_orden_resultados ON lab_m_orden.id = lab_m_orden_resultados.id_orden
                JOIN 
                    lab_p_pruebas ON lab_m_orden_resultados.id_prueba = lab_p_pruebas.id
                WHERE 
                    gen_m_persona.numero_identificacion = ? and lab_m_orden.orden = ?;
                `, [numeroId, orderId]);
                console.log('Resultado de la consulta:', rows);
                return rows;
        } catch (error) {
            console.error('Error al obtener la informacion de la base de datos');
            throw new Error('Error al obtener la informacion de la base de datos');
            
        }
    }

    static async getOrderByOrderId(orderId: string) {
        try {
            const [rows] = await db.query<RowDataPacket[]>( `
                    SELECT 
                        CONCAT(gen_m_persona.nombre1, ' ', gen_m_persona.nombre2, ' ', gen_m_persona.apellido1, ' ', gen_m_persona.apellido2) AS Nombre,
                        lab_m_orden.fecha AS Fecha_Orden,
                        gen_p_documento.codigo_alfa AS Codigo_Documento,
                        lab_m_orden.orden AS Numero_Orden
                    FROM 
                        lab_m_orden
                    JOIN 
                        fac_m_tarjetero ON lab_m_orden.id_historia = fac_m_tarjetero.id
                    JOIN 
                        gen_m_persona ON fac_m_tarjetero.id_persona = gen_m_persona.id
                    JOIN 
                        gen_p_documento ON lab_m_orden.id_documento = gen_p_documento.id
                    WHERE 
                        lab_m_orden.orden = ?;  
                `,[orderId])
            console.log('Resultado de la consulta:', rows);
            return rows;
        } catch (error) {
            console.error('Error al obtener la informacion de la base de datos');
            throw new Error('Error al obtener la informacion de la base de datos');
        }
    }

    static async consultaRangoFecha(fechaInicio: string, fechaFin: string) {
        try {
            const [rows] = await db.query<RowDataPacket[]>(
                `
                SELECT 
                    CONCAT(gen_m_persona.nombre1, ' ', gen_m_persona.nombre2, ' ', gen_m_persona.apellido1, ' ', gen_m_persona.apellido2) AS Nombre,
                    lab_m_orden.fecha AS Fecha_Orden,
                    gen_p_documento.codigo_alfa AS Codigo_Documento,
                    lab_m_orden.orden AS Numero_Orden
                FROM 
                    lab_m_orden
                JOIN 
                    fac_m_tarjetero ON lab_m_orden.id_historia = fac_m_tarjetero.id
                JOIN 
                    gen_m_persona ON fac_m_tarjetero.id_persona = gen_m_persona.id
                JOIN 
                    gen_p_documento ON lab_m_orden.id_documento = gen_p_documento.id
                WHERE 
                    gen_m_persona.id = 1
                    AND lab_m_orden.fecha BETWEEN ? AND ?;  -- Ajusta las fechas aquí
                `, [fechaInicio, fechaFin]);
            return rows;
        } catch (error) {
            console.error('Error al obtener las órdenes por rango de fechas:', error);
            throw new Error('Error al obtener las órdenes por rango de fechas.');
        }
    }
}

export default UserRepository;