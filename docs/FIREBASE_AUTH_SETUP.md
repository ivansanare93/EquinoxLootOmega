# Firebase Authentication Setup - Equinox Loot Manager

## 📋 Descripción General

El sistema de autenticación del Loot Manager ha sido migrado de un sistema de contraseña en texto plano a **Firebase Authentication**, proporcionando mayor seguridad y gestión centralizada de credenciales.

## 🔐 Cómo Funciona el Nuevo Sistema

### Arquitectura de Autenticación

1. **Email Hardcodeado**: El email `oficiales@equinox.com` está configurado en el código
2. **Contraseña Dinámica**: La contraseña se verifica contra Firebase Authentication
3. **Sin Contraseñas en el Código**: No hay contraseñas almacenadas en el repositorio
4. **Sesión Persistente**: Firebase mantiene la sesión activa entre recargas de página

### Flujo de Autenticación

```
1. Usuario accede a LarancioOrtegaLoot.html
   ↓
2. Sistema verifica si hay sesión activa de Firebase
   ↓
3. Si NO está autenticado → Muestra modal de contraseña
   ↓
4. Usuario introduce la contraseña
   ↓
5. Sistema intenta autenticar con Firebase usando:
   - Email: oficiales@equinox.com
   - Password: [contraseña ingresada]
   ↓
6. Firebase valida credenciales
   ↓
7. Si es correcta → Acceso concedido
   Si es incorrecta → Muestra error (máx 3 intentos)
```

### Características de Seguridad

✅ **Sin contraseñas en texto plano**: No hay contraseñas almacenadas en el código fuente  
✅ **Autenticación centralizada**: Gestionada por Firebase Authentication  
✅ **Sesión persistente**: No requiere re-autenticación en cada recarga  
✅ **Límite de intentos**: Máximo 3 intentos fallidos antes de redirigir  
✅ **Logs seguros**: Los errores de autenticación no exponen información sensible  

## 🔧 Gestión de Contraseñas

### Cómo Cambiar la Contraseña

Para cambiar la contraseña de acceso al Loot Manager:

1. **Accede a Firebase Console**
   - Ve a [Firebase Console](https://console.firebase.google.com/)
   - Selecciona el proyecto: `basedatos-57052`

2. **Navega a Authentication**
   - En el menú lateral, selecciona "Authentication"
   - Ve a la pestaña "Users"

3. **Localiza el Usuario**
   - Busca el usuario: `oficiales@equinox.com`
   - Haz clic en los tres puntos (⋮) al lado derecho

4. **Cambia la Contraseña**
   - Selecciona "Reset password" o "Change password"
   - Introduce la nueva contraseña
   - Confirma el cambio

5. **Notifica al Equipo**
   - Informa a los oficiales sobre la nueva contraseña
   - Actualiza cualquier documentación interna

### Requisitos de Contraseña

Firebase Authentication tiene requisitos mínimos de seguridad:
- Mínimo 6 caracteres
- Se recomienda usar combinación de letras, números y símbolos
- Evitar contraseñas obvias o fáciles de adivinar

## 👥 Gestión de Usuarios Oficiales

### Agregar Nuevos Usuarios Oficiales

Si en el futuro necesitas dar acceso a más oficiales:

#### Opción 1: Usuario Adicional con Email Único

1. **Crear nuevo usuario en Firebase**
   - Firebase Console → Authentication → Add user
   - Email: `oficial.[nombre]@equinox.com`
   - Establecer contraseña

2. **Modificar el código** (requiere desarrollo)
   - Actualizar `LarancioOrtegaLoot.html`
   - Cambiar de un solo email a un array de emails permitidos
   - Ejemplo:
   ```javascript
   const ALLOWED_OFFICER_EMAILS = [
       'oficiales@equinox.com',
       'oficial.ivan@equinox.com',
       'oficial.maria@equinox.com'
   ];
   ```

#### Opción 2: Cuenta Compartida (Actual)

Continuar usando la cuenta `oficiales@equinox.com` compartida entre todos los oficiales:
- ✅ Más simple, no requiere cambios en el código
- ✅ Todos los oficiales usan la misma contraseña
- ⚠️ Si un oficial deja el equipo, hay que cambiar la contraseña
- ⚠️ No hay trazabilidad individual

### Recomendaciones de Seguridad

- **Rotación de contraseña**: Cambiar la contraseña cada 3-6 meses
- **Acceso limitado**: Solo compartir con oficiales activos
- **Comunicación segura**: Usar canales privados para compartir credenciales
- **Auditoría**: Revisar periódicamente los logs de acceso en Firebase Console

## 📊 Comparación con el Sistema Anterior

### Sistema Anterior (Texto Plano)

❌ Contraseña hardcodeada en `auth-config.js`  
❌ Visible en el repositorio de código  
❌ Difícil de cambiar (requiere commit y deploy)  
❌ Riesgo de exposición en historial de Git  
❌ Sin gestión centralizada  

### Sistema Actual (Firebase Auth)

✅ Sin contraseñas en el código fuente  
✅ Gestión centralizada en Firebase Console  
✅ Cambio de contraseña instantáneo (sin redeploy)  
✅ Sesión persistente con Firebase  
✅ Logs de autenticación disponibles  
✅ Escalable para múltiples usuarios  

## 🛠️ Solución de Problemas

### "Error de autenticación: auth/user-not-found"

**Causa**: El usuario `oficiales@equinox.com` no existe en Firebase Authentication  
**Solución**:
1. Ve a Firebase Console → Authentication
2. Crea el usuario manualmente con email `oficiales@equinox.com`
3. Establece la contraseña

### "Error de autenticación: auth/wrong-password"

**Causa**: La contraseña ingresada es incorrecta  
**Solución**:
1. Verifica que estás usando la contraseña correcta
2. No incluyas comillas ni espacios adicionales
3. Si olvidaste la contraseña, restablécela desde Firebase Console

### "Error de autenticación: auth/too-many-requests"

**Causa**: Demasiados intentos fallidos desde la misma IP  
**Solución**:
1. Espera 15-30 minutos antes de intentar nuevamente
2. O restablece la contraseña desde Firebase Console

### "Firebase configuration error"

**Causa**: El archivo `firebase-config.js` no existe o tiene errores  
**Solución**:
1. Verifica que `client/firebase-config.js` existe
2. Copia `firebase-config.js.example` si es necesario
3. Asegúrate de que las credenciales de Firebase son correctas

## 📝 Notas Técnicas

### Archivos Modificados

- `client/LarancioOrtegaLoot.html`: Sistema de autenticación actualizado
- `client/auth-config.js`: **ELIMINADO** (ya no necesario)

### Funciones Globales Disponibles

```javascript
// Verificar contraseña con Firebase Auth
window.verifyOfficerPassword(password)
// Retorna: Promise<boolean>

// Verificar si hay sesión activa
window.isOfficerAuthenticated()
// Retorna: boolean

// Acceso a Firebase Auth
window.firebaseAuth
// Tipo: firebase.auth.Auth
```

### Configuración AUTH_CONFIG

```javascript
const AUTH_CONFIG = {
    maxAttempts: 3,           // Intentos máximos antes de redirigir
    sessionKey: 'officer_authenticated'  // Key de sessionStorage
};
```

## 🔄 Migración Completada

### Cambios Implementados

✅ Importación de módulos Firebase Auth  
✅ Inicialización de Firebase Authentication  
✅ Función global `verifyOfficerPassword`  
✅ Función global `isOfficerAuthenticated`  
✅ Actualización del flujo de autenticación  
✅ Eliminación de `auth-config.js`  
✅ Documentación creada  

### Compatibilidad

- ✅ Mantiene la misma UX (experiencia de usuario)
- ✅ Modal de contraseña idéntico visualmente
- ✅ Mismo límite de 3 intentos
- ✅ Redirección a `index.html` en caso de fallo
- ✅ Sesión persistente entre recargas

## 📚 Recursos Adicionales

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)

---

**Última actualización**: Febrero 2026  
**Versión del sistema**: 2.0 (Firebase Auth)
