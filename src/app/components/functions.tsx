const translateRole = (role: string) => {
    const roleTranslation = {
        Admin: "Administrador",
        Employee: "Empleado"
    };
    return roleTranslation[role] || role;
}

const refreshPage = () => {
    window.location.reload();
}

const Functions = {
    translateRole,
    refreshPage
};

export default Functions;