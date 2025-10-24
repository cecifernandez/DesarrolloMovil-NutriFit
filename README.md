## NutriFit App

Aplicación móvil desarrollada con **Ionic + Angular** para ayudar a los usuarios a gestionar sus rutinas, ejercicios y objetivos personales.

---

## Tecnologías utilizadas

- Ionic Framework
- Angular
- Firebase Authentication
- Firestore
- AngularFire (compat)
- SCSS
- Zod (validación de modelos)

---

## Estructura del proyecto

| Carpeta | Descripción |
|--------|-------------|
| `pages/onboarding` | Pantalla de bienvenida, sobre vos, objetivos y rutinas |
| `pages/auth` | Login, registro, recuperación de contraseña |
| `pages/main` | Home, rutinas, perfil |
| `services` | Lógica de negocio y conexión con Firebase |
| `guards` | Protección de rutas públicas y privadas |
| `models` | Tipado y validación de formularios |
| `interfaces` | Estructura de datos del usuario |

---

## Autenticación y navegación

- `authGuard`: Protege rutas privadas como `/home`, `/profile`, `/routines`.
- `noAuthGuard`: Redirige usuarios logueados fuera de rutas públicas como `/login`, `/register`, `/welcome`.
- Redirección automática desde componentes si el usuario ya está autenticado.

---

## Documentación

- [Especificación Funcional (EF) && Manual de Usuario](https://drive.google.com/drive/folders/10-oEw0xkYUBimuLQgGaJLV9i0FtZl1A5?usp=sharing)
- [Notion del proyecto]
- [Tablero tipo Kanban](https://www.notion.so/26cf7be4b45780e1b64ef9e8926a4fb1?v=280f7be4b457805bbf4e000c8f3d6ea8&source=copy_link)
- [Seguimiento de tareas](https://www.notion.so/284f7be4b4578028bc6fc4cd4130a029?v=280f7be4b457805bbf4e000c8f3d6ea8&source=copy_link)

---

## Contribuyentes

- Maria Cecilia Fernandez
- Diana Rodriguez
- Geronimo Olivelli
- Naiara Feinsilber

---

> Este proyecto fue desarrollado como parte de las materias **Desarrollo Móvil** && **PP2**.  
> ¡Gracias por visitar el repo! 💚
