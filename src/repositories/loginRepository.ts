import db from "../config/db";

class LoginRepository{
    static async login(tipoId:string, nomeroid:string, fechanac:string){
        const user = await db.query('SELECT * FROM gen_m_persona  ')
    }
}