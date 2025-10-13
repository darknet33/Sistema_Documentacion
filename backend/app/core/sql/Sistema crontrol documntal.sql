-- Realizado

CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  tipo_usuario VARCHAR(255),
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP
);

-- Realizado
CREATE TABLE perfiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT,
  nombres VARCHAR(255),
  apellidos VARCHAR(255),
  telefono VARCHAR(255),
  fecha_actualizacion TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Realizado
CREATE TABLE cursos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) UNIQUE,
  nivel VARCHAR(255),
  activo BOOLEAN DEFAULT TRUE
);

-- Realizado
CREATE TABLE estudiantes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  codigo_estudiante VARCHAR(255) UNIQUE,
  nombres VARCHAR(255),
  apellidos VARCHAR(255),
  fecha_nacimiento DATE,
  curso_id INT,
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP,
  FOREIGN KEY (curso_id) REFERENCES cursos(id)
);

-- Realizado
CREATE TABLE padres_estudiantes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  perfil_id INT,
  estudiante_id INT,
  parentesco VARCHAR(255),
  estado BOOLEAN DEFAULT FALSE,
  observacion VARCHAR(255) DEFAULT 'Solicitado',
  fecha_creacion TIMESTAMP,
  FOREIGN KEY (perfil_id) REFERENCES perfiles(id),
  FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id)
);

-- Realizado
CREATE TABLE catalogo_documentos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255),
  descripcion TEXT,
  es_obligatorio BOOLEAN DEFAULT TRUE,
  activo BOOLEAN DEFAULT TRUE
);

-- Realizado
CREATE TABLE documentos_requeridos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  catalogo_documento_id INT,
  curso_id INT,
  fecha_limite DATE,
  FOREIGN KEY (catalogo_documento_id) REFERENCES catalogo_documentos(id),
  FOREIGN KEY (curso_id) REFERENCES cursos(id)
);

CREATE TABLE documentos_estudiante (
  id INT PRIMARY KEY AUTO_INCREMENT,
  estudiante_id INT,
  catalogo_documento_id INT,
  archivo_digital VARCHAR(255),
  observaciones TEXT,
  fecha_entrega DATE,
  fecha_registro_sistema TIMESTAMP,
  administrativo_id INT,
  fecha_actualizacion TIMESTAMP,
  FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id),
  FOREIGN KEY (catalogo_documento_id) REFERENCES catalogo_documentos(id),
  FOREIGN KEY (administrativo_id) REFERENCES usuarios(id)
);

CREATE TABLE estado_documentos_estudiante (
  id INT PRIMARY KEY AUTO_INCREMENT,
  estudiante_id INT,
  catalogo_documento_id INT,
  estado VARCHAR(255),
  documentos_estudiante_id INT,
  fecha_creacion TIMESTAMP,
  fecha_actualizacion TIMESTAMP,
  FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id),
  FOREIGN KEY (catalogo_documento_id) REFERENCES catalogo_documentos(id),
  FOREIGN KEY (documentos_estudiante_id) REFERENCES documentos_estudiante(id)
);

CREATE TABLE notificaciones (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_destinatario_id INT,
  estudiante_id INT,
  catalogo_documento_id INT,
  tipo_notificacion VARCHAR(255),
  asunto VARCHAR(255),
  mensaje TEXT,
  fecha_envio TIMESTAMP,
  enviada_exitosamente BOOLEAN,
  FOREIGN KEY (usuario_destinatario_id) REFERENCES usuarios(id),
  FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id),
  FOREIGN KEY (catalogo_documento_id) REFERENCES catalogo_documentos(id)
);
