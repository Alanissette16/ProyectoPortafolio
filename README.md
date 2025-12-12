# INFORME DEL PROYECTO – PORTAFOLIO 

## 1. Logo de la Carrera y del Proyecto

**Logo Institucional**
![Logo Institucional](https://upload.wikimedia.org/wikipedia/commons/b/b0/Logo_Universidad_Polit%C3%A9cnica_Salesiana_del_Ecuador.png)
**Logo Foreing**
![Logo Foreing](src/img/logopremiun.png)
---

## 2. Integrantes
- **Valeria Mantilla** - [Alanissette16](https://github.com/Alanissette16)

- **Claudia Quevedo** - [clcmono](https://github.com/clcmono)

**Repositorio Principal:** [https://github.com/Alanissette16/PROYECTOWEB](https://github.com/Alanissette16/PROYECTOWEB)

---

## 3. Tecnologías Utilizadas

![React](https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg)
![TypeScript](https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg)
![Firebase](https://1000logos.net/wp-content/uploads/2024/05/Firebase-Logo.png)
![EmailJS](https://www.emclient.com/assets/img/landing/emailjs_logo.png?v=638225293560000000)

* **React 19** - Framework principal para la interfaz de usuario
* **Firebase** - Plataforma backend como servicio (Authentication, Firestore, Storage, Hosting)
* **EmailJS** - Servicio para envío automático de correos electrónicos
* **TypeScript** - Lenguaje de programación con tipado estático

### Stack Complementario

![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![DaisyUI](https://img.shields.io/badge/DaisyUI-5A0FC8?style=for-the-badge&logo=daisyui&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

---

## 4. Descripción del Proyecto

El proyecto FOREING es una aplicación web multiusuario para gestionar portafolios profesionales de programadores. Permite crear y administrar perfiles, proyectos y solicitudes de asesorías, conectando a administradores, programadores y usuarios externos en una sola plataforma. La aplicación se centra en la gestión de portafolios y el agendamiento de asesorías, ofreciendo una experiencia intuitiva y segura con autenticación de Google y almacenamiento en la nube.

---

## 5. Roles y Funcionalidades
Descripción de cada rol y su función:

### Administrador
- Gestión de usuarios programadores (crear, editar, eliminar perfiles)
- Configuración de horarios de disponibilidad para asesorías
- Acceso a dashboard con métricas del sistema
- Gestión de especialidades y perfiles profesionales
- Control administrativo completo de la plataforma

### Programador
- Gestión de perfil profesional personal (foto, biografía, especialidades, redes sociales)
- Administración de portafolio individual con proyectos diferenciados
- CRUD completo de proyectos clasificados en académicos y laborales
- Bandeja de asesorías para revisar, aprobar o rechazar solicitudes
- Envío automático de notificaciones por correo a solicitantes

### Usuario externo
- Exploración pública del directorio de programadores
- Visualización detallada de portafolios y proyectos individuales
- Solicitud de asesorías con selección de programador, fecha y hora
- Seguimiento del estado de solicitudes enviadas
- Recepción de confirmaciones por correo electrónico

---

## 6. Módulos y Pantallas del Sistema

### Pantallas Públicas
* **Home (/)** - Página principal con navegación y acceso a agendar asesorías
* **Programadores (/programadores)** - Directorio público de programadores registrados
* **Portafolio Público (/portafolio/:id)** - Vista detallada de portafolio individual
* **Proyectos (/proyectos)** - Galería de proyectos públicos
* **Agendar Asesoría (/agendar-asesoria)** - Formulario de solicitud de asesorías
* **Mis Solicitudes (/mis-solicitudes)** - Seguimiento de asesorías del usuario

### Pantallas de Autenticación
* **Login (/login)** - Autenticación mediante Google OAuth

### Panel Administrativo (/admin)
* **Dashboard Admin (/admin)** - Resumen con estadísticas del sistema
* **Gestión de Programadores (/admin/programadores)** - CRUD de perfiles de programadores
* **Gestión de Proyectos (/admin/proyectos)** - Administración de proyectos
* **Configuración de Horarios (/admin/horarios)** - Definición de disponibilidad

### Panel de Programador (/panel)
* **Dashboard Programador (/panel)** - Vista general personal
* **Editor de Perfil (/panel/perfil)** - Gestión de información personal
* **Editor de Portafolio (/panel/portafolio)** - Configuración del portafolio
* **Gestión de Proyectos (/panel/proyectos)** - CRUD de proyectos propios
* **Bandeja de Asesorías (/panel/asesorias)** - Gestión de solicitudes recibidas

---

## 7. Flujos Principales del Usuario

### Flujo de Autenticación
El usuario accede a la página de login y selecciona "Continuar con Google". Firebase Authentication procesa la solicitud OAuth, crea el perfil en Firestore si no existe previamente, y redirige al usuario al dashboard correspondiente según su rol asignado en el sistema.

### Flujo de Gestión de Programadores (Administrador)
El administrador ingresa al panel administrativo y accede a la sección de gestión de programadores. Completa el formulario con datos personales, especialidad, foto de perfil y enlaces de redes sociales. Al guardar, la información se almacena en la colección "users" de Firestore con el rol "programmer" asignado.

### Flujo de Creación de Proyectos (Programador)
El programador accede a su panel personal y selecciona la opción de gestión de proyectos. Elige la categoría (académico o laboral), ingresa título, descripción, tecnologías utilizadas y enlaces a repositorios o demos. Los datos se guardan en la colección "projects" de Firestore con referencia al ID del programador.

### Flujo de Solicitud de Asesoría (Usuario Externo)
El usuario externo navega por el directorio de programadores y selecciona uno disponible. Completa el formulario con datos de contacto, selecciona fecha y hora disponible, y agrega un mensaje opcional. La solicitud se registra en la colección "advisories" de Firestore con estado "pendiente".

### Flujo de Gestión de Asesorías (Programador)
El programador revisa su bandeja de asesorías, filtra las solicitudes por estado y selecciona aprobar o rechazar cada una. Al cambiar el estado, se actualiza el registro en Firestore y se envía automáticamente una notificación por correo electrónico al solicitante mediante EmailJS.

---

## 8. Fragmentos Técnicos Importantes

### Envío de Notificaciones por Correo

``
// Envío de confirmación de asesoría
await sendRequesterStatusEmail({
  requesterEmail: advisoryData.requesterEmail,
  requesterName: advisoryData.requesterName,
  programmerName: contact.programmerName,
  status: 'aprobada',
  date: advisoryData.slot?.date,
  time: advisoryData.slot?.time,
  responseMessage: 'Confirmada'
})
``

### Guardado en Firestore

`
// Solicitud de asesoría
await addDoc(collection(db, 'advisories'), {
  programmerId: selectedProgrammer,
  requesterName: formData.name,
  requesterEmail: formData.email,
  slot: { date: selectedDate, time: selectedTime },
  note: formData.message,
  status: 'pendiente',
  createdAt: serverTimestamp()
})
`

### Autenticación con Google

`
// login con Google OAuth
const result = await signInWithPopup(auth, googleProvider)
const user = result.user
await saveUserToFirestore(user)
return user
`

### Consulta Filtrada por Rol

`	
// Consulta de programadores
const q = query(
  collection(db, 'users'),
  where('role', '==', 'programmer')
)
const snapshot = await getDocs(q)
`

---

## 9. Conclusiones

### Logros del Proyecto

En el proyecto se implementó un sistema multiusuario con tres roles definidos, utilizando React y Firebase. También incluye una interfaz adaptable que funciona bien tanto en teléfonos móviles como en computadoras. Se logró cumplir con la autenticación, el manejo de la base de datos y el envío de notificaciones por correo electrónico con Google.

### Aprendizajes Obtenidos

En este proyecto ampliamos y fortalecimos nuestros conocimientos al decidir utilizar React. Al inicio estábamos acostumbradas a trabajar con Angular, pero al usar React notamos que es más sencillo y práctico, ya que sus componentes integran HTML y TypeScript en un solo archivo. A diferencia de Angular, donde cada componente genera varios archivos (como HTML, TS y CSS), en React la estructura es más ligera y fácil de manejar.

Además, al implementar Firebase como base de datos, aprendimos a gestionarlo correctamente. Pudimos registrar usuarios, modificar sus roles, visualizar sus correos y también eliminar o deshabilitar cuentas cuando fue necesario. Finalmente, incorporamos la API de EmailJS, que nos permitió enviar correos electrónicos desde la aplicación web utilizando únicamente JavaScript, de forma rápida y gratuita.

### Mejoras Futuras

Como posibles mejoras para futuras versiones del sistema, se podrían implementar notificaciones push en tiempo real y un ayudante IA que conteste las dudas de los usuarios.
