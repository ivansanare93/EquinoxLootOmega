// Configuración de autenticación para oficiales
// NO COMPARTIR ESTE ARCHIVO PÚBLICAMENTE

const AUTH_CONFIG = {
    // Contraseña codificada en Base64 para ofuscar (no es encriptación real)
    encodedPassword: "Aquinoex", // "Equinox2026" en Base64
    maxAttempts: 3,
    sessionKey: 'officer_authenticated'
};

// Función para verificar contraseña
function verifyOfficerPassword(inputPassword) {
    const actualPassword = atob(AUTH_CONFIG.encodedPassword);
    return inputPassword === actualPassword;
}

// Exportar para uso en otros archivos
window.AUTH_CONFIG = AUTH_CONFIG;
window.verifyOfficerPassword = verifyOfficerPassword;
