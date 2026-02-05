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
    const isValid = trimmedPassword === AUTH_CONFIG.password;
    
    // Debug logging to help troubleshoot
    console.log('Password verification:', {
        inputLength: trimmedPassword.length,
        expectedLength: AUTH_CONFIG.password.length,
        isValid: isValid
    });
    
    return isValid;
}

// Exportar para uso en otros archivos
window.AUTH_CONFIG = AUTH_CONFIG;
window.verifyOfficerPassword = verifyOfficerPassword;
