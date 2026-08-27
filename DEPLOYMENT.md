# Guía de Despliegue: Magis AI Academy en Vercel 🚀

Esta guía te llevará paso a paso desde tu carpeta local hasta tener el sitio en vivo con una base de datos funcionando.

## Requisitos Previos
1. Una cuenta en [Vercel](https://vercel.com).
2. Una cuenta en [GitHub](https://github.com) (o GitLab/Bitbucket).
3. Tener instalado [Git](https://git-scm.com/) en tu computadora.

---

## Paso 1: Subir el Código a GitHub
Vercel funciona mejor cuando está conectado a un repositorio de Git para despliegues automáticos.

1. Abre una terminal en la carpeta `Fast Mode`.
2. Inicializa el repositorio y sube los archivos:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Magis AI Academy"
   ```
3. Crea un nuevo repositorio en GitHub (ej. `magis-landing`).
4. Sigue las instrucciones de GitHub para vincular tu repositorio local y hacer el `push`:
   ```bash
   git remote add origin https://github.com/TU_USUARIO/magis-landing.git
   git branch -M main
   git push -u origin main
   ```

---

## Paso 2: Importar el Proyecto en Vercel
1. Ve a tu [Vercel Dashboard](https://vercel.com/dashboard).
2. Haz clic en **"Add New..."** → **"Project"**.
3. Selecciona el repositorio `magis-landing` que acabas de subir.
4. En **"Project Settings"**, Vercel debería detectar automáticamente que es un sitio estático con una carpeta `/api`.
5. Haz clic en **"Deploy"**.

> [!NOTE]
> En este punto, el frontend cargará, pero el formulario de registro dará error porque falta la base de datos.

---

## Paso 3: Configurar Supabase
Para que el registro funcione, necesitamos configurar la base de datos en Supabase.

1. Ve a [Supabase](https://supabase.com) y crea un nuevo proyecto (o usa uno existente).
2. Ve al **SQL Editor** en Supabase y ejecuta este comando para crear la tabla si aún no existe:
   ```sql
   CREATE TABLE IF NOT EXISTS leads (
     id SERIAL PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) NOT NULL,
     whatsapp VARCHAR(50),
     interest VARCHAR(255),
     data_auth BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   );
   ```
3. Ve a **Project Settings** → **API** en tu dashboard de Supabase.
4. Copia la `Project URL` y la `Project API Key` (la que dice `anon`, `public`).
5. Vuelve al dashboard de Vercel de tu proyecto, ve a **Settings** → **Environment Variables**.
6. Agrega dos variables:
   - `SUPABASE_URL`: (Pega aquí la URL de tu proyecto)
   - `SUPABASE_ANON_KEY`: (Pega aquí tu clave anon)

---

## Paso 4: Redesplegar para activar la Base de Datos
Las variables de entorno solo se activan en un despliegue nuevo.

1. Ve a la pestaña **"Deployments"**.
2. Selecciona el despliegue más reciente (o haz clic en los tres puntos `...`).
3. Elige **"Redeploy"**.

---

## Paso 5: Verificación Final
1. Abre la URL que te dio Vercel (ej. `magis-academy-abc.vercel.app`).
2. Ve a la sección de registro.
3. Completa el formulario con datos de prueba (incluyendo el nuevo campo de WhatsApp).
4. Haz clic en **"Reservar Mi Lugar Ahora"**.
5. Si ves el mensaje **"¡Inscripción Exitosa!"**, ¡felicidades! Tu base de datos y tu API están funcionando.

---

## Paso 6: Configurar tu Propio Dominio (`magis-io.ai`)
Si ya tienes un dominio principal y quieres usarlo para esta landing page, tienes dos opciones principales:

### Opción A: Usar un Subdominio (Recomendado)
Es la forma más limpia y sencilla. Ejemplo: `academy.magis-io.ai`.

1. En el dashboard de tu proyecto en Vercel, ve a **Settings** → **Domains**.
2. Haz clic en **"Add"**.
3. Escribe el subdominio que desees, por ejemplo: `academy.magis-io.ai`.
4. Vercel te dará unos registros DNS (tipo **CNAME**).
5. Ve al panel de control de tu dominio (Cloudflare, GoDaddy, etc.) y agrega ese registro CNAME:
   - **Name**: `academy`
   - **Value**: `cname.vercel-dns.com`
6. Una vez que los DNS se propaguen (puede tomar unos minutos), tu landing page estará disponible en ese subdominio.

### Opción B: Usar una Subruta (Más avanzado)
Si quieres que sea `magis-io.ai/academy`, el proceso depende de dónde esté alojada tu página principal:

- **Si tu sitio principal también está en Vercel**: Puedes usar "Rewrites" en el archivo `vercel.json` de tu proyecto principal para redirigir `/academy` a la URL de la landing page.
- **Si tu sitio principal está en otro hosting**: Deberás configurar un "Reverse Proxy" (en Nginx o Apache) para que las peticiones a `/academy` apunten a la URL de Vercel.

---

## 🛠️ Solución de Problemas (FAQ)

> [!IMPORTANT]
> **Error "Internal Server Error" en el registro:**
> Asegúrate de haber agregado correctamente las variables `SUPABASE_URL` y `SUPABASE_ANON_KEY` en la configuración de Vercel y haber hecho un "Redeploy". Sin ellas, la función no puede comunicarse con tu base de datos.

> [!TIP]
> **Ver los datos registrados:**
> Puedes ver los leads registrados yendo directamente al **Table Editor** en tu dashboard de Supabase y seleccionando la tabla `leads`.

---

© 2026 Magis AI Academy — Éxito en tu lanzamiento.
