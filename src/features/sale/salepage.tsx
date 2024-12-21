import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Agent from "../../app/api/agent";
import Buttons from "../../app/components/buttons";
import TableModule from "../../app/components/tablemodule";
import Modal from "../../app/components/modal";
import Functions from "../../app/components/functions";

const headers = [
  "Código",
  "Producto(s)",
  "Precio Total",
  "Medio de Pago",
  "Trabajador(a)",
  "Acciones",
];

type user = {
  label: string;
  value: number;
};

const SalePage = () => {
  const [sales, setSales] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [nickNameFilter, setNickNameFilter] = useState<string>("");
  const [selectedSale, setSelectedSale] = useState(null);
  const [products, setProducts] = useState([]);

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
    useState<boolean>(false);
  const [isDeletedModalOpen, setIsDeletedModalOpen] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const navigate = useNavigate();
  const salesPerPage = 8;

  const indexOfLastSale = currentPage * salesPerPage;
  const indexOfFirstSale = indexOfLastSale - salesPerPage;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const sales = (await Agent.Sale.list()).data;
        setSales(sales);

        const responseUsers = await Agent.User.list();
        const users = responseUsers.data.map((user) => ({
          value: user.nickName,
          label: `${user.name} ${user.last_name}`,
        }));
        setUserOptions(users);

        const responseProducts = await Agent.Product.list();

        const products = responseProducts.data.map((product) => ({
          value: product.unique_id,
          label: product.product_name,
        }));
        setProducts(products);
      } catch (error) {
        console.error("Error fetching sales:", error);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [sales, nickNameFilter]);

  const filteredSales = sales.filter((sale) => {
    if (nickNameFilter === "SIN ELECCIÓN") {
      return true;
    }

    return (
      sale.userFullName.toLowerCase().includes(nickNameFilter.toLowerCase()) ||
      nickNameFilter === ""
    );
  });

  const currentSales = filteredSales.slice(indexOfFirstSale, indexOfLastSale);

  const getProductLabel = (id: number) => {
    const foundProduct = products.find((p) => p.value === id.toString());
    return foundProduct ? foundProduct.label : "Producto no encontrado";
  };

  const handleNavigate = (path: string, state?: any) => {
    navigate(path, state ? { state } : undefined);
  };

  const toggleConfirmationModal = () => {
    setIsConfirmationModalOpen(!isConfirmationModalOpen);
  };

  const toggleDeleteModal = () => {
    setIsDeletedModalOpen(!isDeletedModalOpen);
  };

  const deleteSale = async (id: number) => {
    try {
      toggleConfirmationModal();
      if (selectedSale) {
        await Agent.Sale.delete(id.toString());
        const newSales = sales.filter((sale) => sale.id !== id);
        setSales(newSales);
        toggleDeleteModal();
      }
    } catch (error) {
      console.error("Error deleting sale:", error);
    }
  };

  return (
    <div className="max-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        {TableModule.title({ title: "Ventas" })}
        {/* Filtros */}
        <div className="flex space-x-4">
          <div className="container max-w-[20%]">
            {TableModule.selectFilter({
              label: "Nombre del empleado",
              valueFilter: nickNameFilter,
              setOnChangeFilter: setNickNameFilter,
              options: userOptions,
              firstValue: "SIN ELECCIÓN",
            })}
          </div>
        </div>

        {/* Tabla */}
        {TableModule.table({
          headers: headers,
          data: currentSales.map((sale) => [
            sale.saleId,
            sale.saleProducts.map((product) =>
              getProductLabel(product.productId)
            ),
            sale.totalPrice,
            sale.paymentMethod,
            sale.userFullName,
            <>
              <div className="flex justify-between items-center ml-4 mr-4">
                {Buttons.EditButton({
                  onClick: () => {
                    setSelectedSale(sale);
                    handleNavigate(`/edit-sale`, sale);
                  },
                })}
                {Buttons.DetailButton({
                  data: sale,
                  onClick: () => {
                    setSelectedSale(sale);
                    handleNavigate(`/detail-sale`, sale);
                  },
                })}
                {Buttons.DeleteButton({
                  onClick: () => {
                    setSelectedSale(sale);
                    toggleConfirmationModal();
                  },
                })}
              </div>
            </>,
          ]),
        })}

        {isConfirmationModalOpen && (
          <Modal
            title={`¿Borrar la venta ${selectedSale.id}?`}
            confirmAction={() => deleteSale(selectedSale.id)}
            confirmation="Eliminar"
            confirmCancel={toggleConfirmationModal}
            activateCancel={true}
            activateConfirm={true}
          />
        )}

        {isDeletedModalOpen && (
          <Modal
            title={"Venta eliminada con éxito"}
            confirmation="Aceptar"
            confirmAction={() => {
              toggleDeleteModal();
              Functions.refreshPage();
            }}
            activateCancel={false}
            activateConfirm={true}
          />
        )}

        {/* Paginación */}
        {TableModule.pagination({
          length: filteredSales.length,
          perPage: salesPerPage,
          currentPage: currentPage,
          paginate: paginate,
        })}

        {/* Botón Agregar */}
        <Buttons.TurquoiseButton
          text="Añadir"
          onClick={() => handleNavigate("/add-sale")}
        />
      </div>
    </div>
  );
};

export default SalePage;
