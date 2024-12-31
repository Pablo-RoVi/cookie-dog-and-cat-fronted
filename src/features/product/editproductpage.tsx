import React, { useEffect, useState } from "react";
import TableModule from "../../app/components/tablemodule";
import Buttons from "../../app/components/buttons";
import Options from "../../app/components/options";
import { useLocation, useNavigate } from "react-router-dom";
import cookie from "../../app/static/images/cookie.png";
import Agent from "../../app/api/agent";
import { AxiosResponse } from "axios";
import Modal from "../../app/components/modal";
import Functions from "../../app/components/functions";
import ConfirmAdminLogged from "../../app/components/confirmadmin";
import { Brand } from "../../app/models/brand";

const EditProductPage = () => {
  const [unique_id, setId] = useState<string>("");
  const [productName, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [categoryName, setCategoryName] = useState<string>("");
  const [brandName, setBrandName] = useState<string>("");
  const [specieName, setEspecieName] = useState<string>("");

  const [originalData, setOriginalData] = useState<any>(null);
  const [isProductModified, setIsProductModified] = useState<boolean>(false);

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
    useState<boolean>(false);
  const [isEditedProductModalOpen, setIsEditedProductModalOpen] =
    useState<boolean>(false);

  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);

  const [isConfirmationAdminLogged, setIsConfirmAdminLogged] =
    useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const [brands, setBrands] = useState([]);

  const location = useLocation();
  const product = location.state;

  const navigate = useNavigate();

  const formattedErrorTitle = "Corrija los siguientes errores:\n";

  useEffect(() => {
    if (product) {
      const productData = {
        unique_id: product.unique_id,
        product_name: product.product_name,
        price: product.price,
        stock: product.stock,
        categoryName: product.categoryName,
        brandName: product.brandName,
        specieName: product.specieName,
      };

      setOriginalData(productData);
      setId(product.unique_id);
      setName(product.product_name);
      setPrice(product.price);
      setStock(product.stock);
      setCategoryName(product.categoryName);
      setBrandName(product.brandName);
      setEspecieName(product.specieName);
    }
  }, [product]);

  useEffect(() => {
    if (originalData) {
      setIsProductModified(
        unique_id !== originalData.unique_id ||
          productName !== originalData.product_name ||
          price !== originalData.price ||
          stock !== originalData.stock ||
          categoryName !== originalData.categoryName ||
          brandName !== originalData.brandName ||
          specieName !== originalData.specieName
      );
    }
  }, [
    originalData,
    unique_id,
    productName,
    price,
    stock,
    categoryName,
    brandName,
    specieName,
  ]);

  useEffect(() => {
    Agent.Brand.list().then((response) => {
      setBrands(
        response.data.map((brand: Brand) => ({
          value: brand.brand_name,
          label: brand.brand_name,
        }))
      );
    });
  }, []);

  const updateProduct = () => {
    Agent.Product.update(
      {
        unique_id: unique_id,
        product_name: productName,
        price: price,
        stock: stock,
        categoryName: categoryName,
        brandName: brandName,
        specieName: specieName,
      },
      originalData.unique_id
    )
      .then((response: AxiosResponse) => {
        console.log("Producto actualizado");
        if (response.status === 200) {
          console.log("Producto actualizado");
          toggleConfirmationModal();
          toggleEditedProductModal();
        } else if (response.status === 400) {
          console.log("Error al actualizar el producto");
        }
      })
      .catch((error) => {
        console.log("error", error.response.data);
        let errorMessages = [];
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          const errors = error.response.data.errors;

          for (const key in errors) {
            if (errors.hasOwnProperty(key)) {
              if (Array.isArray(errors[key])) {
                errors[key].forEach((msg) => {
                  errorMessages.push(`${msg}`);
                });
              } else {
                errorMessages.push(`${key}: ${errors[key]}`);
              }
            }
          }
        } else {
          errorMessages.push(error.response.data);
        }
        setErrorMessage(errorMessages.join("\n"));
        toggleErrorModal();
      });
  };

  const handleNavigate = () => {
    navigate("/products");
  };

  const toggleConfirmationModal = () => {
    setIsConfirmationModalOpen(!isConfirmationModalOpen);
  };

  const toggleEditedProductModal = () => {
    setIsEditedProductModalOpen(!isEditedProductModalOpen);
  };

  const toggleErrorModal = () => {
    setIsErrorModalOpen(!isErrorModalOpen);
  };

  const toggleConfirmAdminLogged = () => {
    setIsConfirmAdminLogged(!isConfirmationAdminLogged);
  };

  return (
    <div className="max-h-screen bg-white flex-auto flex h-1/2">
      <div className="container mx-auto mt-6 ml-52">
        {TableModule.title({ title: "Editar producto" })}
        {TableModule.inputFilter({
          id: "unique_id",
          label: "Código",
          valueFilter: unique_id,
          setOnChangeFilter: setId,
          placeholder: "Código del producto",
          errorInput:
            !Functions.verifyProductCode(unique_id) && unique_id !== "",
          errorMessage: "El código debe ser numérico y de 8 a 15 dígitos",
        })}
        {TableModule.inputFilter({
          id: "productName",
          label: "Nombre",
          valueFilter: productName,
          setOnChangeFilter: setName,
          placeholder: "Nombre del producto",
          errorInput:
            !Functions.verifyProductName(productName) && productName !== "",
          errorMessage:
            "El nombre debe tener entre 3 y 100 caracteres del abecedario español",
        })}
        {TableModule.inputFilter({
          id: "price",
          label: "Precio",
          valueFilter: price,
          setOnChangeFilter: setPrice,
          placeholder: "Precio",
          errorInput: !Functions.verifyProductPrice(price) && price !== "",
          errorMessage:
            "El precio debe ser un número mayor a 0, de máximo de 9 dígitos con o sin puntos",
        })}
        {TableModule.inputFilter({
          id: "stock",
          label: "Stock",
          valueFilter: stock,
          setOnChangeFilter: setStock,
          placeholder: "Stock",
          errorInput: !Functions.verifyProductStock(stock) && stock !== "",
          errorMessage:
            "El stock debe ser un número mayor a 0, de máximo de 9 dígitos",
        })}
        {TableModule.selectFilter({
          id: "categoryName",
          label: "Categoría",
          valueFilter: categoryName,
          setOnChangeFilter: setCategoryName,
          options: Options.categoryOptions,
          firstValue: "SIN ELECCIÓN",
        })}
        {TableModule.selectFilter({
          id: "brandName",
          label: "Marca",
          valueFilter: brandName,
          setOnChangeFilter: setBrandName,
          options: brands,
          firstValue: "SIN ELECCIÓN",
        })}
        {TableModule.selectFilter({
          id: "specieName",
          label: "Especie",
          valueFilter: specieName,
          setOnChangeFilter: setEspecieName,
          options: Options.specieOptions,
          firstValue: "SIN ELECCIÓN",
        })}
        <div className="flex items-center space-x-4">
          {isProductModified ? (
            <Buttons.TurquoiseButton
              text="Editar"
              onClick={() => toggleConfirmationModal()}
            />
          ) : (
            <Buttons.GrayButton text="Editar" onClick={null} />
          )}
          <Buttons.FuchsiaButton
            text="Cancelar"
            onClick={() => handleNavigate()}
          />
        </div>
      </div>
      {isConfirmationModalOpen && (
        <Modal
          title={`¿Estás seguro de que deseas editar el producto '${productName}' de '${brandName}'?`}
          confirmAction={() => toggleConfirmAdminLogged()}
          confirmation="Editar"
          confirmCancel={() => toggleConfirmationModal()}
          activateCancel={true}
          activateConfirm={true}
        />
      )}
      {isConfirmationAdminLogged && (
        <ConfirmAdminLogged
          confirmation="Confirmar"
          confirmAction={() => {
            updateProduct();
          }}
          confirmCancel={() => {
            toggleConfirmAdminLogged();
            toggleConfirmationModal();
          }}
          activateCancel={true}
          activateConfirm={true}
        />
      )}
      {isEditedProductModalOpen && (
        <Modal
          title={`Producto '${productName}' editado con éxito`}
          confirmation="Aceptar"
          confirmAction={() => {
            toggleEditedProductModal();
            handleNavigate();
          }}
          activateCancel={false}
          activateConfirm={true}
        />
      )}
      {isErrorModalOpen && (
        <Modal
          title={`${formattedErrorTitle}${errorMessage}`}
          confirmation="Aceptar"
          confirmAction={() => toggleErrorModal()}
          activateCancel={false}
          activateConfirm={true}
        />
      )}
      <div className="container mx-auto mt-20">
        <img src={cookie} alt="cookie" className="h-auto w-auto opacity-10" />
      </div>
    </div>
  );
};

export default EditProductPage;
