const translateRole = (role: string) => {
  const roleTranslation = {
    Admin: "Administrador",
    Employee: "Empleado",
  };
  return roleTranslation[role] || role;
};

const verifyName = (name: string): boolean => {
  const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]{3,20}$/;
  return nameRegex.test(name) && name !== "";
};

const verifyRut = (rut: string): boolean => {
  const rutRegex = /^[0-9]{7,8}[-|‐]{1}[0-9kK]{1}$/;
  return rutRegex.test(rut) && rut !== "";
};

const verifyPasswords = (
  password: string,
  confirmPassword: string
): boolean => {
  return (
    password === confirmPassword
  );
};

const verifyPassword = (
  password: string
): number => {
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;
  const largeRegex = /.{8,}/;

  if (!passwordRegex.test(password)) {
    return 0;
  }

  if (!largeRegex.test(password)) {
    return 1;
  }

  return 2;
}


//Product validations
const verifyProductCode = (code: string): boolean => {
  const productCodeRegex = /^[0-9]{8,15}$/;
  return productCodeRegex.test(code) && code !== "";
}

const verifyProductPrice = (price: string): boolean => {
  const priceRegex = /^([0-9]{1,3}(.[0-9]{3}){0,2}|[0-9]{1,9})$/;
  return priceRegex.test(price) && price !== "";
}

const verifyProductName = (name: string): boolean => {
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s\d,.-]{3,100}$/;
  return nameRegex.test(name) && name !== "";
}

const verifyProductStock = (stock: string): boolean => {
  const stockRegex = /^[0-9]{1,9}$/;
  return stockRegex.test(stock) && stock !== "";
}

//Brand validations
const verifyBrandName = (name: string): boolean => {
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s\d,.-]{3,30}$/;
  return nameRegex.test(name) && name !== "";
}

const Functions = {
  translateRole,
  verifyName,
  verifyRut,
  verifyPassword,
  verifyPasswords,
  verifyProductCode,
  verifyProductName,
  verifyProductPrice,
  verifyProductStock,
  verifyBrandName,
};

export default Functions;
