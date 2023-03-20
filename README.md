## Instalación para desarrollo

### Prerequisitos

- Haber seguido la guía de instalación del FET-CL: https://www.notion.so/Instalaci-n-del-CLI-del-Software-FET-3d6bcf3e04ae4e0f8576bb0bfb906c2e?pvs=4

### Instalación

1. Clone el repositorio del componente en GitHub:

```bash
git clone https://github.com/Trabajo-de-Titulacion/planificacion-academica-fis-backend.git
```

1. Dentro del directorio del proyecto, cambie su rama actual a la rama de un integrante, en este caso a:

```bash
git checkout development-alejandro-llanganate
```

1. En el directorio principal del proyecto cree un archivo `.env` y configure dentro del mismo las siguientes variables de entorno:

```bash
SPA_PORT=300
PREFIX=api

# Database
SPA_DB_DATABASE=
SPA_DB_USERNAME=
SPA_DB_PASSWORD=
SPA_DB_PORT=
SPA_DB_HOST=

# Auth
JWT_SECRET=

# Mailing
MAIL_HOST=outlook
MAIL_PORT=5042
MAIL_USER=user@example.com
MAIL_PASSWORD=password
```


> 📖 **Nota:** Si se desea utilizar la funcionalidad de envío de mails del componente "Manejo de datos ingresados por el usuario y validación/aprobación de horarios generados” es necesario que cree una cuenta en Gmail, Outlook u otro y configure sus credenciales en “Mailing”. Actualmente está funcionalidad está desactivada pero puede ser comprendida en el [componente](https://bibdigital.epn.edu.ec/bitstream/15000/23393/1/CD%2012813.pdf) de la integrante [Diana López](https://bibdigital.epn.edu.ec/bitstream/15000/23393/1/CD%2012813.pdf).

