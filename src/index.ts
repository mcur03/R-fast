import app from "./app";
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT;

//Realizar la conexión a la base de datos
app.listen(PORT, ()=>{
    console.log('servidor conectado al puerto', PORT);
}).on('error',(err:any)=>{
    console.error('Error al nonectar a la base de datos');
})