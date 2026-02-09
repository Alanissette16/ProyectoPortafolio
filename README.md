# FOREING - Portafolio de Programadores

![Logo Foreing](src/img/logopremiun.png)

> **Plataforma profesional para gestión de portafolios y asesorías de programadores**  
> Proyecto académico desarrollado en React + TypeScript + Spring Boot

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/Alanissette16/ProyectoPortafolio)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4-6DB33F?logo=springboot)](https://spring.io/projects/spring-boot)

---

## Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Uso](#uso)
- [Roles y Permisos](#roles-y-permisos)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Documentación](#documentación)
- [Equipo](#equipo)
- [Licencia](#licencia)

---

## Descripción

**FOREING** es una plataforma web completa que conecta programadores con personas interesadas en recibir asesorías técnicas. El sistema permite a los programadores mostrar su portafolio profesional, gestionar sus proyectos y atender solicitudes de asesorías de forma eficiente.

### Objetivos del Proyecto

- Crear un sistema multiusuario con gestión de roles
- Implementar CRUD completo para portafolios y proyectos
- Facilitar el agendamiento de asesorías técnicas
- Proporcionar notificaciones automáticas por email
- Garantizar seguridad mediante autenticación JWT

---

## Características

### Para Administradores
- Dashboard con métricas del sistema
- Gestión completa de usuarios y programadores
- Configuración de horarios de disponibilidad
- Panel de diagnóstico del sistema

### Para Programadores
- Gestión de perfil profesional con foto y redes sociales
- Portafolio personalizado con proyectos clasificados (académicos/laborales)
- Bandeja de asesorías con aprobación/rechazo
- Notificaciones automáticas a solicitantes

### Para Usuarios Externos
- Directorio público de programadores disponibles
- Visualización detallada de portafolios y proyectos
- Solicitud de asesorías con selección de fecha/hora
- Seguimiento del estado de solicitudes

---

## Tecnologías

### Frontend
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)
![DaisyUI](https://img.shields.io/badge/DaisyUI-4-5A0FC8?style=for-the-badge&logo=daisyui)

- **React 19** - Biblioteca UI con componentes funcionales
- **TypeScript 5.6** - Tipado estático para JavaScript
- **Vite 7.2** - Build tool rápido y moderno
- **TailwindCSS + DaisyUI** - Estilos utility-first con componentes
- **Framer Motion** - Animaciones fluidas
- **React Router 7** - Enrutamiento SPA

### Backend
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4-6DB33F?style=for-the-badge&logo=springboot)
![Java](https://img.shields.io/badge/Java-21-007396?style=for-the-badge&logo=openjdk)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens)

- **Spring Boot 3.4** - Framework backend empresarial
- **Spring Security + JWT** - Autenticación y autorización
- **Spring Data JPA** - Persistencia de datos
- **PostgreSQL 16** - Base de datos relacional
- **Validation API** - Validación de datos

---

## Instalación

### Prerrequisitos

- **Node.js** 20+ y npm
- **Java** 21+
- **PostgreSQL** 16+
- **Git**

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Alanissette16/ProyectoPortafolio.git
cd ProyectoPortafolio
```

### 2. Configurar Frontend

```bash
# Instalar dependencias
npm install

# Crear archivo de variables de entorno
cp .env.example .env

# Configurar la URL del backend en .env
VITE_API_URL=http://localhost:8080/api
```

### 3. Configurar Backend

```bash
cd ../Backend-Portafolio

# Configurar base de datos en src/main/resources/application.yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/portafolio_db
    username: tu_usuario
    password: tu_contraseña
```

### 4. Ejecutar el Proyecto

#### Backend (Spring Boot)
```bash
# En la carpeta Backend-Portafolio
./gradlew bootRun

# O compilar y ejecutar el JAR
./gradlew build
java -jar build/libs/proyecto-portafolio-0.0.1.jar
```

#### Frontend (React)
```bash
# En la carpeta ProyectoPortafolio
npm run dev

# Para producción
npm run build
npm run preview
```

La aplicación estará disponible en:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8080

---

## Roles y Permisos

| Rol | Acceso | Rutas Disponibles |
|-----|--------|-------------------|
| **Admin** | Gestión completa del sistema | `/admin/*` |
| **Programmer** | Gestión de portafolio y asesorías | `/panel/*` |
| **External** | Visualización y solicitudes | `/`, `/programadores`, `/agendar-asesoria` |

### Credenciales de Prueba

```
Admin:
- Email: admin@foreing.com
- Password: admin123

Programmer:
- Email: programador@foreing.com
- Password: prog123

External:
- Registro libre desde /login
```

---

## Estructura del Proyecto

### Frontend
```
src/
├── components/       # Componentes reutilizables
│   ├── common/      # Componentes básicos (Logo, SEOHead, etc)
│   ├── guards/      # Protección de rutas (ProtectedRoute, RoleGuard)
│   └── layout/      # Componentes de layout (NavBar, Footer)
├── context/         # Contextos de React (Auth, Theme)
├── layouts/         # Plantillas de página (Public, Dashboard)
├── pages/          # Páginas de la aplicación
│   ├── admin/      # Panel administrativo
│   ├── auth/       # Autenticación
│   ├── programmer/ # Panel de programador
│   └── public/     # Páginas públicas
├── services/       # Lógica de comunicación con API
│   ├── api.service.ts      # Cliente HTTP
│   ├── auth.service.ts     # Autenticación
│   └── data.service.ts     # CRUD de datos
└── utils/          # Utilidades (validación, storage, etc)
```

### Backend
```
src/main/java/com/backend/proyecto/
├── Usuarios/          # Módulo de usuarios
│   ├── controllers/   # Endpoints REST
│   ├── services/      # Lógica de negocio
│   ├── entities/      # Modelos de datos
│   └── dtos/          # Objetos de transferencia
├── Proyectos/         # Módulo de proyectos
├── asesorias/         # Módulo de asesorías
├── horarios/          # Módulo de horarios
└── security/          # Configuración de seguridad JWT
```

---

## Documentación

### Código Documentado

El proyecto cuenta con **documentación completa en español** usando comentarios `//` en los archivos core:

- **Servicios** - `data.service.ts`, `auth.service.ts`, `api.service.ts`
- **Contextos** - `AuthContext.tsx`
- **Utilidades** - `photoStorage.ts`
- **Configuración** - `App.tsx`, `main.tsx`

> Ver [`documentation_summary.md`](docs/documentation_summary.md) para detalles completos

### Calidad del Código

- ESLint configurado con TypeScript
- 0 console.log en código de producción
- Build exitoso sin errores
- Variables no usadas eliminadas
- Imports optimizados

```bash
# Verificar calidad del código
npm run lint        # Linting
npx tsc --noEmit   # Type checking
npm run build      # Build de producción
```

---

## Uso

### Flujo Típico de Usuario

1. **Usuario Externo** visita la página y explora programadores
2. Selecciona un programador y solicita una asesoría
3. **Programador** recibe la solicitud en su bandeja
4. Aprueba o rechaza con un mensaje personalizado
5. Sistema envía email automático al solicitante
6. **Admin** puede ver métricas y gestionar el sistema

### Endpoints Principales

```typescript
// Autenticación
POST   /api/auth/login        // Iniciar sesión
POST   /api/auth/register     // Registrarse
GET    /api/auth/me           // Obtener perfil actual

// Usuarios
GET    /api/usuarios                    // Listar todos
GET    /api/usuarios/programadores      // Listar programadores
GET    /api/usuarios/{id}               // Obtener por ID
PUT    /api/usuarios/{id}               // Actualizar
DELETE /api/usuarios/{id}               // Eliminar

// Proyectos
GET    /api/proyectos/publicos          // Proyectos públicos
GET    /api/proyectos/programador/{id}  // Por programador
POST   /api/proyectos                    // Crear
PUT    /api/proyectos/{id}               // Actualizar
DELETE /api/proyectos/{id}               // Eliminar

// Asesorías
GET    /api/asesorias/programador       // Asesorías del programador
GET    /api/asesorias/mias              // Mis solicitudes
POST   /api/asesorias                    // Solicitar asesoría
PUT    /api/asesorias/{id}/gestionar    // Aprobar/Rechazar
```

---

## Equipo

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/Alanissette16.png" width="100px;" alt="Valeria Mantilla"/>
      <br />
      <sub><b>Valeria Mantilla</b></sub>
      <br />
      <a href="https://github.com/Alanissette16">@Alanissette16</a>
      <br />
      <sub>Frontend & UI/UX</sub>
    </td>
    <td align="center">
      <img src="https://github.com/clcmono.png" width="100px;" alt="Claudia Quevedo"/>
      <br />
      <sub><b>Claudia Quevedo</b></sub>
      <br />
      <a href="https://github.com/clcmono">@clcmono</a>
      <br />
      <sub>Backend & Database</sub>
    </td>
  </tr>
</table>

**Universidad Politécnica Salesiana**  
**Carrera:** Ingeniería en Ciencias de la Computación  
**Asignatura:** Programación para Web  
**Período:** 2024-2025

---

## Licencia

Este proyecto es de código abierto bajo la licencia MIT.

**Repositorio Principal:** [https://github.com/Alanissette16/ProyectoPortafolio](https://github.com/Alanissette16/ProyectoPortafolio)

---

## Soporte

¿Tienes preguntas o sugerencias? 

- Email: valeria.mantilla@est.ups.edu.ec
- Email: claudia.quevedo@est.ups.edu.ec
- Issues: [GitHub Issues](https://github.com/Alanissette16/ProyectoPortafolio/issues)

---

<div align="center">

**Si te gusta el proyecto, dale una estrella en GitHub**

![Universidad Politécnica Salesiana](https://upload.wikimedia.org/wikipedia/commons/b/b0/Logo_Universidad_Polit%C3%A9cnica_Salesiana_del_Ecuador.png)

Hecho con dedicación por el equipo FOREING

</div>
