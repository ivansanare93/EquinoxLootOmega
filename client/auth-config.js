// Configuración de autenticación para oficiales
// NO COMPARTIR ESTE ARCHIVO PÚBLICAMENTE

const AUTH_CONFIG = {
    // Contraseña en texto plano
    password: "Aquinoex",
    maxAttempts: 3,
    sessionKey: 'officer_authenticated'
};

// Función para verificar contraseña
function verifyOfficerPassword(inputPassword) {
    // Trim whitespace to handle accidental spaces
    const trimmedPassword = inputPassword ? inputPassword.trim() : '';
    return trimmedPassword === AUTH_CONFIG.password;
}

// Exportar para uso en otros archivos
window.AUTH_CONFIG = AUTH_CONFIG;
window.verifyOfficerPassword = verifyOfficerPassword;
