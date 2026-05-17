# Gym Admin - Aplicación Móvil de Administración

Aplicación móvil completa para la administración de tu gimnasio con React Native y Expo.

## Características

- **Login de Administrador**: Sistema de autenticación seguro
- **Gestión de Clientes**: Registro, visualización y eliminación de clientes
- **Gestión de Promociones**: Crear, editar y eliminar promociones
- **Reportes e Ingresos**: Visualización de pagos y estadísticas
- **Alertas**: Notificaciones de membresías por vencer y vencidas
- **Base de Datos SQLite**: Almacenamiento local persistente

## Instalación

1. Instalar Node.js si no lo tienes: https://nodejs.org/

2. Instalar las dependencias:
```bash
npm install
```

3. Iniciar la aplicación:
```bash
npm start
```

4. Escanear el código QR con la app Expo Go en tu teléfono o presiona 'a' para Android / 'i' para iOS

## Credenciales por Defecto

- **Usuario**: admin
- **Contraseña**: admin123

## Promociones Predefinidas

- Gym Mensual: 100 Bs (1 mes)
- Promocional 2 meses: 150 Bs (2 meses)
- Por sesión: 10 Bs (1 sesión)

## Estructura del Proyecto

```
gym/
├── App.js                      # Archivo principal
├── package.json                # Dependencias
├── app.json                    # Configuración de Expo
├── babel.config.js             # Configuración de Babel
├── assets/
│   └── icon.png                # Logo de la app
├── src/
│   ├── database/
│   │   └── database.js         # Configuración SQLite
│   ├── navigation/
│   │   └── AppNavigator.js     # Navegación principal
│   └── screens/
│       ├── LoginScreen.js      # Pantalla de login
│       ├── HomeScreen.js       # Pantalla principal
│       ├── ClientesScreen.js   # Lista de clientes
│       ├── RegistroClienteScreen.js  # Registro de clientes
│       ├── PromocionesScreen.js      # Gestión de promociones
│       ├── ReportesScreen.js   # Reportes e ingresos
│       └── AlertasScreen.js    # Alertas de membresías
```

## Uso

1. Inicia sesión con las credenciales por defecto
2. En la pantalla principal verás estadísticas generales
3. Usa el menú inferior para navegar entre las diferentes secciones:
   - **Inicio**: Resumen y acciones rápidas
   - **Clientes**: Ver y gestionar clientes
   - **Promociones**: Crear y editar promociones
   - **Reportes**: Ver ingresos y pagos
   - **Alertas**: Ver membresías por vencer

## Datos Guardados

Todos los datos se guardan localmente en la base de datos SQLite del dispositivo, incluyendo:
- Administradores
- Clientes
- Promociones
- Pagos

## Tecnologías

- React Native
- Expo
- Expo SQLite
- React Navigation
- JavaScript
