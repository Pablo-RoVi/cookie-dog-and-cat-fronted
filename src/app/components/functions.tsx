const translateRole = (role: string) => {
  const roleTranslation = {
    Admin: "Administrador",
    Employee: "Empleado",
  };
  return roleTranslation[role] || role;
};

const verifyName = (name: string): boolean => {
  const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]+$/;
  return nameRegex.test(name) && name !== "";
};

const verifyRut = (rut: string): boolean => {
  const rutRegex = /^[0-9]+[-|‐]{1}[0-9kK]{1}$/;
  return rutRegex.test(rut) && rut !== "";
};

const verifyPasswords = (
  password: string,
  confirmPassword: string
): boolean => {
  const passwordRegex = /^[a-zA-Z0-9]{8,}$/;
  return (
    password === confirmPassword && 
    password !== "" && confirmPassword !== "" &&
    passwordRegex.test(password)
  );
};

const refreshPage = () => {
  window.location.reload();
};

const Functions = {
  translateRole,
  verifyName,
  verifyRut,
  verifyPasswords,
  refreshPage,
};

export default Functions;
