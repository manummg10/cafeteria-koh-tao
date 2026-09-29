# Koh Tao · Desarrollo y despliegue

## Arquitectura

- **Web pública** (`/`): carta y tartas especiales. Cualquiera puede verla.
- **Login del panel** (ruta interna sin enlaces desde la web: `VITE_RUTA_PANEL` en Netlify, por defecto `/panel-control-interno`): correo y contraseña. Cada acceso correcto envía un email de aviso (fecha, IP, navegador). Tras 5 intentos fallidos la cuenta se bloquea 15 minutos y también se avisa por email.
- **Panel** (`<ruta>/dashboard`): carta, tartas y reservas. El backend exige el rol `Admin` en todas las operaciones de escritura y en las reservas.
- **Sesión**: JWT en una cookie `HttpOnly` + `Secure` + `SameSite=Strict`. El JavaScript nunca tiene acceso al token.
- **Producción** (igual que TAI Oposicion App): frontend en **Netlify**, que reenvía `/api/*` al backend en **Render** (Docker). Base de datos MySQL en **Aiven** con SSL. Web y API comparten dominio, así que no hace falta CORS.

## Desarrollo local

### 1. Secretos (User Secrets, fuera del repositorio)

La clave JWT y la conexión ya están configuradas en este equipo. Faltan la cuenta del propietario y, opcionalmente, el SMTP:

```bash
cd KohTaoBack
dotnet user-secrets set "AdminSeed:Email" "propietario@correo.com"
dotnet user-secrets set "AdminSeed:Password" "una-contraseña-de-12+-caracteres"
# Opcional, para recibir los emails de aviso:
dotnet user-secrets set "Smtp:Host" "smtp.gmail.com"
dotnet user-secrets set "Smtp:Usuario" "cuenta@gmail.com"
dotnet user-secrets set "Smtp:Password" "contraseña-de-aplicación"
dotnet user-secrets set "Smtp:Remitente" "cuenta@gmail.com"
```

Si tu servidor local es **MariaDB** (XAMPP), indica la versión: `dotnet user-secrets set "Database:ServerVersion" "10.4.32-mariadb"`.

### 2. Base de datos (migraciones)

**Si ya tienes la BD `kohtao_db` con datos** (creada a mano), primero márcala como "baseline" para no perder datos. Ejecuta esto una sola vez en HeidiSQL:

```sql
CREATE TABLE IF NOT EXISTS `__EFMigrationsHistory` (
  `MigrationId` varchar(150) NOT NULL,
  `ProductVersion` varchar(32) NOT NULL,
  PRIMARY KEY (`MigrationId`)
);
INSERT INTO `__EFMigrationsHistory` VALUES ('20260929075215_Baseline', '9.0.20');
```

Después, tanto para una BD existente como para una nueva:

```bash
dotnet ef database update
```

Cualquier cambio futuro de esquema: `dotnet ef migrations add NombreDelCambio` y después `dotnet ef database update`. Nunca a mano.

### 3. Arrancar

```bash
cd KohTaoBack && dotnet run --launch-profile http    # API en http://localhost:5041
cd KohTaoFront && npm run dev                        # Web en http://localhost:5173 (proxy /api → 5041)
```

## Producción (Netlify + Render + Aiven)

### 1. Base de datos en Aiven
En tu servicio MySQL de Aiven (puede ser el mismo que usa TAI), crea una base de datos nueva, `kohtao_db`, y copia el host, el puerto, el usuario y la contraseña.

### 2. Backend en Render
Render → **New → Blueprint** → repositorio `cafeteria-koh-tao`. Render lee `render.yaml` y te pide:
- `ConnectionStrings__DefaultConnection`: `Server=<host>;Port=<puerto>;Database=kohtao_db;User=avnadmin;Password=<pass>;SslMode=Required`
- `AdminSeed__Password`: la contraseña del propietario (12 caracteres o más).
- `Smtp__Password`: tu API key de Resend.

En el primer arranque se aplican las migraciones y se crea la cuenta `manummg10@gmail.com`. **Después borra `AdminSeed__Password`** en Render (Environment).
La clave JWT la genera Render automáticamente.

Si el servicio no se llama `kohtao-api`, cambia la URL en `netlify.toml`.

### 3. Frontend en Netlify
Netlify → **Add new site → Import from GitHub** → el mismo repositorio. `netlify.toml` ya define la carpeta, el build, el proxy de `/api` y las rutas de React.

### 4. Datos iniciales
Importa `backups/datos_para_produccion.sql` en la base de datos de Aiven con HeidiSQL (Archivo → Ejecutar SQL). Contiene la carta, las tartas y las reservas actuales, y está fuera de git.

### Notas
- En el plan gratuito, Render se duerme cuando no hay tráfico: la primera petición tarda entre 30 y 50 segundos.
- Mientras Resend use el remitente de pruebas `onboarding@resend.dev`, solo envía al correo con el que registraste la cuenta. Para enviar desde tu dominio, verifícalo en Resend y cambia `Smtp__Remitente`.
