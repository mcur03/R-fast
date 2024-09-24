create database senasoft;
use senasoft;

-- 1 Table: gen_p_listaopcion
CREATE TABLE gen_p_listaopcion (
    id INT PRIMARY KEY  NOT NULL AUTO_INCREMENT,
    variable VARCHAR(50) NOT NULL,
    descripcion VARCHAR(100) NOT NULL,
    valor SMALLINT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    abreviacion VARCHAR(10) NOT NULL,
    habilita BOOLEAN DEFAULT TRUE NOT NULL
) COMMENT='Variable de grupo de opciones';


-- 2 Table: gen_m_persona
CREATE TABLE gen_m_persona (
    id INT NOT NULL AUTO_INCREMENT,
    id_tipoid INT NOT NULL,
    numeroid VARCHAR(20) NOT NULL,
    apellido1 VARCHAR(20) NOT NULL,
    apellido2 VARCHAR(20) NOT NULL,
    nombre1 VARCHAR(20) NOT NULL,
    nombre2 VARCHAR(20) NOT NULL,
    fechanac DATE,
    id_sexobiologico INT,
    direccion VARCHAR(250),
    tel_movil VARCHAR(10),
    email VARCHAR(250),
    PRIMARY KEY (id),
    FOREIGN KEY(id_tipoid) REFERENCES gen_p_listaopcion(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_sexobiologico) REFERENCES gen_p_listaopcion(id) ON UPDATE CASCADE ON DELETE CASCADE
) COMMENT='Identificador para personas';



-- 3 Table: gen_p_eps
CREATE TABLE gen_p_eps (
    id INT NOT NULL AUTO_INCREMENT,
    codigo VARCHAR(8) NOT NULL,
    razonsocial VARCHAR(250) NOT NULL,
    nit VARCHAR(20),
    habilita BOOLEAN DEFAULT TRUE NOT NULL,
    PRIMARY KEY (id)
) COMMENT='Identificador de la empresa de seguridad social';


-- 4 Table: fac_p_nivel
CREATE TABLE fac_p_nivel (
    id INT NOT NULL AUTO_INCREMENT,
    id_eps INT NOT NULL,
    nivel VARCHAR(4) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    id_regimen INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(id_regimen) REFERENCES gen_p_listaopcion(id) ON UPDATE CASCADE ON DELETE CASCADE
) COMMENT='Identificador del nivel de recuperación';


-- 5 Table: fac_m_tarjetero

CREATE TABLE fac_m_tarjetero (
    id INT NOT NULL AUTO_INCREMENT,
    historia VARCHAR(20) NOT NULL,
    id_persona INT NOT NULL,
    id_regimen INT NOT NULL,
    id_eps INT,
    id_nivel INT,
    PRIMARY KEY (id),
    FOREIGN KEY(id_persona) REFERENCES gen_m_persona(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_regimen) REFERENCES gen_p_listaopcion(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_eps) REFERENCES gen_p_eps(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_nivel) REFERENCES fac_p_nivel(id) ON UPDATE CASCADE ON DELETE CASCADE
) COMMENT='Identificador de historias clínicas';


-- 6 Table: fac_p_profesional
CREATE TABLE fac_p_profesional (
    id INT NOT NULL AUTO_INCREMENT,
    codigo VARCHAR(4) NOT NULL,
    id_persona INT,
    registro_medico VARCHAR(20),
    id_tipo_prof INT,
    PRIMARY KEY (id),
    FOREIGN KEY(id_persona) REFERENCES gen_m_persona(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_tipo_prof) REFERENCES gen_p_listaopcion(id) ON UPDATE CASCADE ON DELETE CASCADE
) COMMENT='Identificador para el profesional';


-- 7 Table: gen_p_documento
CREATE TABLE gen_p_documento (
    id INT NOT NULL AUTO_INCREMENT,
    codigo VARCHAR(4) NOT NULL,
    nombre VARCHAR(254) NOT NULL,
    habilita BOOLEAN DEFAULT TRUE NOT NULL,
    PRIMARY KEY (id)
) COMMENT='Identificador del documento';


-- 8 Table: fac_p_cups


CREATE TABLE fac_p_cups (
    id INT NOT NULL AUTO_INCREMENT,
    codigo VARCHAR(8) NOT NULL,
    nombre VARCHAR(500) NOT NULL,
    habilita BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (id)
) COMMENT='Identificador para tecnología en salud';


-- 9 Crear tabla lab_p_grupos
CREATE TABLE lab_p_grupos (
    id INT NOT NULL AUTO_INCREMENT,
    codigo VARCHAR(2) NOT NULL,
    nombre VARCHAR(60) NOT NULL,
    habilita BOOLEAN DEFAULT TRUE NOT NULL,
    PRIMARY KEY (id)
);

-- 10 Crear tabla lab_p_procedimientos
CREATE TABLE lab_p_procedimientos (
    id INT NOT NULL AUTO_INCREMENT,
    id_cups INT NOT NULL,
    id_grupo_laboratorio INT NOT NULL,
    metodo VARCHAR(60) DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(id_cups) REFERENCES fac_p_cups(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_grupo_laboratorio) REFERENCES lab_p_grupos(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- 11 Crear tabla lab_p_pruebas
CREATE TABLE lab_p_pruebas (
    id INT NOT NULL AUTO_INCREMENT,
    id_procedimiento INT NOT NULL,
    codigo_prueba VARCHAR(6) NOT NULL,
    nombre_prueba VARCHAR(200) NOT NULL,
    id_tipo_resultado INT NOT NULL,
    unidad VARCHAR(20) NOT NULL,
    habilita BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (id),
    FOREIGN KEY(id_procedimiento) REFERENCES lab_p_procedimientos(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_tipo_resultado) REFERENCES gen_p_listaopcion(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- 12 Crear tabla lab_p_pruebas_opciones
CREATE TABLE lab_p_pruebas_opciones (
    id INT NOT NULL AUTO_INCREMENT,
    id_prueba INT NOT NULL,
    opcion VARCHAR(250) NOT NULL,
    valor_ref_min_f DECIMAL(15,2) DEFAULT NULL,
    valor_ref_max_f DECIMAL(15,2) DEFAULT NULL,
    valor_ref_min_m DECIMAL(15,2) DEFAULT NULL,
    valor_ref_max_m DECIMAL(15,2) DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(id_prueba) REFERENCES lab_p_pruebas(id) ON UPDATE CASCADE ON DELETE CASCADE
);
select * from lab_p_pruebas_opciones;

-- 13 Crear tabla lab_m_orden
CREATE TABLE lab_m_orden(
	id INT  AUTO_INCREMENT  PRIMARY KEY NOT NULL,
    id_documento INT NOT NULL,
    orden INT,
    fecha DATE,
    id_historia INT,
    id_profecional_ordena INT,
    profecional_externo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY(id_documento) REFERENCES gen_p_documento(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_historia) REFERENCES fac_m_tarjetero(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_profecional_ordena) REFERENCES fac_p_profesional(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- 14 Crear tabla lab_m_orden_resultados

CREATE TABLE lab_m_orden_resultados (
    id INT NOT NULL AUTO_INCREMENT,
    fecha TIMESTAMP NULL DEFAULT NULL,
    id_orden INT NOT NULL,
    id_procedimiento INT NOT NULL,
    id_prueba INT NOT NULL,
    id_pruebaopcion INT DEFAULT NULL,
    res_opcion VARCHAR(250) DEFAULT NULL,
    res_numerico DECIMAL(16,4) DEFAULT NULL,
    res_texto VARCHAR(60) DEFAULT NULL,
    res_memo VARCHAR(2500) DEFAULT NULL,
    num_procesamientos INT,
    PRIMARY KEY (id),
    FOREIGN KEY(id_orden) REFERENCES lab_m_orden(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_procedimiento) REFERENCES lab_p_procedimientos(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_prueba) REFERENCES lab_p_pruebas(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_pruebaopcion ) REFERENCES lab_p_pruebas_opciones(id) ON UPDATE CASCADE ON DELETE CASCADE
);















