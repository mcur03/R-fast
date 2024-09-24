type TipoId = 'cc' | 'ti' | 'ce' | 'rc' | 'PA' | 'AS' | 'MS' | 'NU' | 'NV' | 'SC' | 'NIT' | 'CD' | 'PE' | 'RE' | 'PT' | 'DE';

class Persona{
    private _tipoId: TipoId;
    private _numeroId: string;
    private _apellido1: string;
    private _apellido2:string;
    private _nombre1: string;
    private _nombre2: string;
    private _fechanac: string;
    private _sexobiologico: string;
    private _direccion: string;
    private _telmovil: string;
    private _email: string

    constructor(
        tipoId: TipoId,
        numeroId: string,
        apellido1: string,
        apellido2: string,
        nombre1: string,
        nombre2: string,
        fechanac: string,
        sexobiologico: string,
        direccion: string,
        telmovil: string,
        email: string
    ){
        this._tipoId = tipoId;
        this._numeroId = numeroId;
        this._apellido1 = apellido1;
        this._apellido2 = apellido2;
        this._nombre1 = nombre1;
        this._nombre2 = nombre2;
        this._fechanac = fechanac;
        this._sexobiologico = sexobiologico;
        this._direccion = direccion;
        this._telmovil = telmovil;
        this._email = email
    }

    get tipoId(){
        return this._tipoId;
    }
    get numeroId(){
        return this._numeroId;
    }
    get apellido1(){
        return this._apellido1;
    }
    get apellido2(){
        return this._apellido2;
    }
    get nombre1(){
        return this._nombre1;
    }
    get nombre2(){
        return this._nombre2;
    }
    get fechanac(){
        return this._fechanac;
    }
    get sexobiologico(){
        return this._sexobiologico;
    }
    get direccion(){
        return this._direccion;
    }
    get telmovil(){
        return this._telmovil;
    }
    get email(){
        return this._email;
    }


    set tipoId(tipoId:TipoId){
        this._tipoId = tipoId;
    }
    set numeroId(numeroId:string){
        this._numeroId = numeroId;
    }
    set apellido1(apellido1){
        this._apellido1 = apellido1;
    }
    set apellido2(apellido2:string){
        this._apellido2 = apellido2;
    }
    set nombre1(nombre1:string){
        this._nombre1 = nombre1;
    }
    set nombre2(nombre2:string){
        this._nombre2 = nombre2;
    }
    set fechanac(fechanac:string){
        this._fechanac = fechanac;
    }
    set sexobiologico(sexobiologico:string){
        this._sexobiologico = sexobiologico;
    }
    set direccion(direccion:string){
        this._direccion = direccion;
    }
    set telmovil(telmovil:string){
        this._telmovil = telmovil;
    }
    set email(email:string){
        this._email = email;
    }
}

export default Persona;