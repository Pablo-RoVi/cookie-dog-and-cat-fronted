import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TableModule from "../../app/components/tablemodule";
import Buttons from "../../app/components/buttons";
import Agent from "../../app/api/agent";
import colors from "../../app/static/colors";
import Modal from "../../app/components/modal";
import ConfirmAdminLogged from "../../app/components/confirmadmin";
import { AxiosResponse } from "axios";

const headersShopping = [
  "Producto",
  "Marca",
  "Categoría",
  "Especie",
  "Precio Unitario",
  "Cantidad",
];

const AddSalesPage = () => {
  const [saleId, setSaleId] = useState<number>(0);
  const [saleNickName, setSaleNickName] = useState<string>("");
  const [salePaymentMethod, setSalePaymentMethod] = useState<string>("");
  const [saleProducts, setSaleProducts] = useState([]);
  const [saleTotalPrice, setSaleTotalPrice] = useState<number>(0);

  const [userOptions, setUserOptions] = useState([]);
  const [paymentMethodOptions, setPaymentMethodOptions] = useState([]);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isAdminConfirmModalOpen, setIsAdminConfirmModalOpen] =
    useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const [isSaleModified, setIsSaleModified] = useState<boolean>(false);

  const [originalData, setOriginalData] = useState<any>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const sale = location.state;

  useEffect(() => {
    const initializeData = async () => {
      try {
        setOriginalData(sale);
        setSaleId(sale.saleId);
        setSaleNickName(sale.nickName);
        setSalePaymentMethod(sale.paymentMethod);
        setSaleProducts(sale.products);
        setSaleTotalPrice(sale.totalPrice);

        const responsePaymentMethods = await Agent.Sale.getPaymentMethods();
        const paymentMethods = responsePaymentMethods.data.map(
          (paymentMethod) => ({
            value: paymentMethod,
            label: paymentMethod,
          })
        );
        setPaymentMethodOptions(paymentMethods);

        const responseUsers = await Agent.User.list();
        const users = responseUsers.data.map((user) => ({
          value: user.nick_name,
          label: user.nick_name,
          isActive: user.is_active,
        }));
        setUserOptions(users.filter((user) => user.isActive));
      } catch (error) {
        console.error("Error cargando datos iniciales:", error);
      }
    };

    initializeData();
  }, [sale]);

  useEffect(() => {
    if (originalData) {
      setIsSaleModified(
        (saleNickName !== originalData.nickName && saleNickName !== "") ||
          (salePaymentMethod !== originalData.paymentMethod &&
            salePaymentMethod !== "")
      );
    }
  }, [saleNickName, salePaymentMethod, originalData, userOptions]);

  const toggleSuccessModal = () => {
    setIsSuccessModalOpen(!isSuccessModalOpen);
  };

  const toggleErrorModal = () => {
    setIsErrorModalOpen(!isErrorModalOpen);
  };

  const toggleConfirmModal = () => {
    setIsConfirmModalOpen(!isConfirmModalOpen);
  };

  const toggleAdminConfirmModal = () => {
    setIsAdminConfirmModalOpen(!isAdminConfirmModalOpen);
  };

  const editSale = () => {
    if (
      (saleNickName === "" || salePaymentMethod === "") &&
      (saleNickName === originalData.nick_name ||
        salePaymentMethod === originalData.paymentMethod)
    ) {
      setErrorMessage("Debe completar los campos requeridos");
      toggleErrorModal();
      return;
    }
    try {
      const form = {
        saleId: saleId,
        nickName: saleNickName,
        paymentMethod: salePaymentMethod,
      };
      Agent.Sale.edit(form, saleId.toString())
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            toggleSuccessModal();
          } else if (response.status === 400) {
            setErrorMessage("Error al editar la venta");
            toggleErrorModal();
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
    } catch (error) {
      console.log("error", error.response.data);
      let errorMessages = [];
      if (error.response && error.response.data && error.response.data.errors) {
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
    }
  };

  return (
    <div className="max-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        {/* Título */}
        {TableModule.title({ title: "Editar venta" })}

        {/* Formulario */}
        <div className="flex space-x-4">
          <div className="container max-w-[20%]">
            {TableModule.inputFilter({
              id: "saleId",
              label: "Código",
              valueFilter: saleId,
              isDisabled: true,
            })}
          </div>

          <div className="container max-w-[20%]">
            {TableModule.selectFilter({
              id: "saleNickName",
              label: "Nombre de usuario",
              valueFilter: saleNickName,
              setOnChangeFilter: setSaleNickName,
              options: userOptions,
              firstValue: saleNickName,
            })}
          </div>

          <div className="container max-w-[20%]">
            {TableModule.selectFilter({
              id: "salePaymentMethod",
              label: "Método de pago",
              valueFilter: salePaymentMethod,
              setOnChangeFilter: setSalePaymentMethod,
              options: paymentMethodOptions,
              firstValue: salePaymentMethod,
            })}
          </div>
        </div>

        {/* Tabla y botón del carrito */}
        <div className="relative">
          <div className="flex justify-between items-center mb-4">
            <h2
              className="text-xl font-semibold"
              style={{
                color: colors.turquoise,
              }}
            >
              Producto(s)
            </h2>
          </div>

          {TableModule.table({
            headers: headersShopping,
            data: saleProducts.map((product) => [
              product.product_name,
              product.brandName,
              product.categoryName,
              product.specieName,
              `$${product.price}`,
              product.quantity,
            ]),
          })}
        </div>

        {/* Modales de  confirmación, éxito y error*/}

        {isConfirmModalOpen && (
          <Modal
            title={`¿Estás seguro de editar la venta ${saleId}?`}
            activateConfirm={true}
            confirmation="Confirmar"
            confirmAction={() => {
              toggleConfirmModal();
              toggleAdminConfirmModal();
            }}
            activateCancel={true}
            confirmCancel={() => toggleConfirmModal()}
          />
        )}

        {isAdminConfirmModalOpen && (
          <ConfirmAdminLogged
            confirmation="Confirmar"
            confirmAction={() => {
              toggleAdminConfirmModal();
              editSale();
            }}
            confirmCancel={() => toggleAdminConfirmModal()}
            activateCancel={true}
            activateConfirm={true}
          />
        )}

        {isSuccessModalOpen && (
          <Modal
            title="Venta editada con éxito"
            activateConfirm={true}
            confirmation="Aceptar"
            confirmAction={() => {
              toggleSuccessModal();
              navigate("/sales");
            }}
          />
        )}

        {isErrorModalOpen && (
          <Modal
            title={`Corrija los siguientes errores: ${errorMessage}`}
            activateConfirm={true}
            confirmation="Aceptar"
            confirmAction={() => toggleErrorModal()}
          />
        )}

        {/* Total y botones */}
        <div className="mt-8">
          <div className="text-right mb-4">
            <span
              className="text-xl font-semibold"
              style={{
                color: colors.turquoise,
              }}
            >
              Total producto(s):{" "}
              <span className="text-black">
                ${saleTotalPrice.toLocaleString()}
              </span>
            </span>
          </div>
          <div className="flex justify-end space-x-4">
            {isSaleModified ? (
              <Buttons.TurquoiseButton
                text="Editar"
                onClick={() => toggleConfirmModal()}
              />
            ) : (
              <Buttons.GrayButton text="Editar" onClick={() => null} />
            )}
            <Buttons.FuchsiaButton
              text="Cancelar"
              onClick={() => navigate("/sales")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSalesPage;
