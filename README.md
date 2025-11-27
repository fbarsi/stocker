# 📦 Stocker

**Stocker** es una solución integral para la gestión de inventario móvil, diseñada para modernizar y agilizar el control de stock en comercios y depósitos. Permite a los vendedores y gerentes administrar sucursales, productos y movimientos de mercadería en tiempo real, reemplazando los métodos tradicionales por un sistema dinámico, seguro y fácil de usar.

## 🚀 **Características Principales**

### 🔐 **Gestión de Acceso y Roles**

  * **Autenticación Segura:** Registro e inicio de sesión con tokens JWT.
  * **Roles de Usuario:** Diferenciación entre **Managers** (creadores de empresas y sucursales) y **Empleados** (invitados a gestionar stock).

### 🏢 **Gestión Empresarial**

  * **Multi-Sucursal:** Creación y administración de múltiples sucursales (ej: Casa Central, Depósito Norte).
  * **Sistema de Invitaciones:** Los Managers pueden invitar empleados a unirse a su empresa mediante correo electrónico.

### 📦 **Control de Inventario Avanzado**

  * **Catálogo Global:** Gestión centralizada de artículos (SKU, nombre, unidades por bulto).
  * **Movimientos de Stock:** Registro rápido de **Entradas**, **Ventas** y **Ajustes** manuales.
  * **Visualización Clara:** Listado de stock actual con desglose por bultos y unidades sueltas.

### 📲 **Funcionalidades "Smart"**

  * **Escáner de Código de Barras:** Uso de la cámara del dispositivo para identificar productos rápidamente y registrar movimientos sin búsquedas manuales.
  * **Notificaciones Push:** Alertas automáticas a los gerentes cuando el stock de un producto desciende por debajo del umbral crítico (Stock Bajo).

## 🛠️ **Tecnologías Utilizadas**

Este proyecto utiliza un stack moderno basado en el ecosistema de **React Native** con **Expo**.

  * **Core:** [React Native](https://reactnative.dev/), [Expo SDK 52](https://expo.dev/), [TypeScript](https://www.typescriptlang.org/).
  * **Navegación:** [React Navigation](https://reactnavigation.org/) (Stack & Bottom Tabs).
  * **Gestión de Estado y Datos:** [TanStack Query (React Query)](https://tanstack.com/query/latest) para sincronización con el servidor y caché.
  * **Estilos:** [Styled Components](https://styled-components.com/) y hojas de estilo nativas.
  * **Hardware del Dispositivo:**
      * `expo-camera`: Para el escaneo de códigos de barras.
      * `expo-notifications`: Para la recepción de alertas push.
      * `expo-location` & `react-native-maps`: Para la geolocalización de sucursales.
  * **UI/UX:** Fuentes personalizadas (Google Fonts Montserrat), Iconos vectoriales.

## 📦 **Instalación y Uso**

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

1.  **Clonar el repositorio**

    ```bash
    git clone https://github.com/fbarsi/stocker.git
    cd stocker
    ```

2.  **Instalar dependencias**

    ```bash
    npm install
    ```

3.  **Configuración de Entorno**
    Asegúrate de tener el archivo `google-services.json` en la raíz del proyecto (requerido para mapas y notificaciones en Android).

4.  **Ejecutar la aplicación**
    Para aprovechar las funcionalidades nativas (cámara, mapas), se recomienda ejecutar la versión de desarrollo precompilada:

    ```bash
    # Para Android
    npx expo run:android

    # Para iOS (requiere macOS)
    npx expo run:ios
    ```

    *Alternativamente, para desarrollo ligero sin módulos nativos nuevos:*

    ```bash
    npx expo start
    ```

## 📂 **Estructura del Proyecto**

```bash
stocker/
├── api/                    # Cliente HTTP y definiciones de endpoints (Auth, Management, Products)
├── app/                    # Pantallas y navegación principal
│   ├── auth/               # Stack de Autenticación (Login, Register)
│   ├── tabs/               # Navegación principal por pestañas
│   │   ├── screens/        # Pantallas de la aplicación
│   │   │   ├── inventory/  # Pantallas específicas de control de stock
│   │   │   ├── manager/    # Pantallas de administración (Crear empresa, sucursales, invitaciones)
│   │   │   ├── scanner.tsx # Lógica de cámara y escaneo
│   │   │   └── ...         # Home, Products, etc.
│   │   └── index.tsx       # Configuración del Tab Navigator
│   └── root.tsx            # Componente raíz y lógica de inicialización (Fuentes, Auth Check)
├── assets/                 # Recursos estáticos (Imágenes, Iconos)
├── components/             # Componentes UI reutilizables (Botones, Modales, Inputs)
├── shared/                 # Lógica compartida transversal
│   ├── context/            # Contextos de React (Auth, Theme)
│   ├── hooks/              # Hooks personalizados (usePushNotifications)
│   └── interfaces/         # Tipos y definiciones TypeScript
└── utils/                  # Utilidades, constantes y estilos globales
```

## 📸 **Capturas de Pantalla**

| Login & Registro | Inicio & Dashboard |
|:---:|:---:|
| ![alt text](assets\iniciosesion.png) | ![alt text](assets\Dashboard.png) |
| *Acceso seguro y creación de cuentas.* | *Panel principal con accesos rápidos.* |

| Inventario & Scanner | Gestión de Sucursales |
|:---:|:---:|
| ![alt text](assets\escaner.png) | ![alt text](assets\sucursales.png) |
| *Listado de productos y escáner.* | *Geolocalización y alta de sucursales.* |

## 🙋‍♂️ **Autores**

Este proyecto fue desarrollado como trabajo final de carrera por:

  * **Barsi, Franco Gabriel**
  * **Romanoli, José Alberto**
  * **Alvarez, Yamil**
  * **Milesi, Agustín Exequiel**

## 📄 **Licencia**

Este proyecto está bajo la licencia [MIT](https://www.google.com/search?q=LICENSE).