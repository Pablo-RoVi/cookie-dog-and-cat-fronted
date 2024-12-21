import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Agent from "../../app/api/agent";
import Buttons from "../../app/components/buttons";
import TableModule from "../../app/components/tablemodule";
import Modal from "../../app/components/modal";
import ConfirmAdminLogged from "../../app/components/confirmadmin";
import Functions from "../../app/components/functions";
import { Sale } from "../../app/models/sale";

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
  const [users, setUsers] = useState<user[]>([]);
  const [nickNameFilter, setNickNameFilter] = useState<string>("");
  const [selectedSale, setSelectedSale] = useState(null);

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
        const userOptions: user[] = (await Agent.User.list()).data.map(
          (user: any) => ({
            label: `${user.name} ${user.last_name}`,
            value: user.nick_name,
          })
        );
        setSales(sales);
        setUsers(userOptions);
        console.log(sales);
      } catch (error) {
        console.error("Error fetching sales:", error);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [sales, nickNameFilter]);

  const filteredSales = sales.filter((sale: Sale) => {
    if (nickNameFilter === "") return true;
    return sale.nickName === nickNameFilter;
  });

  const currentSales = filteredSales.slice(indexOfFirstSale, indexOfLastSale);

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
        const newSales = sales.filter((sale: Sale) => sale.id !== id);
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
        {TableModule.title({ title: "Empleados" })}
        {/* Filtros */}
        <div className="flex space-x-4">
          <div className="container max-w-[20%]">
            {TableModule.selectFilter({
              label: "Nombre del empleado",
              valueFilter: nickNameFilter,
              setOnChangeFilter: setNickNameFilter,
              options: users,
              firstValue: "SIN ELECCIÓN",
            })}
          </div>
        </div>

        {/* Tabla */}
        {TableModule.table({
          headers: headers,
          data: currentSales.map((sale: Sale) => [
            sale.id,
            "",
            "",
            "",
            "",
            <>
              <div className="flex justify-between items-center ml-4 mr-4">
                {Buttons.EditButton({
                  onClick: () => {
                    setSelectedSale(sale);
                    handleNavigate(`/products/edit-product`, sale);
                  },
                })}
                {Buttons.DetailButton({
                  data: sale,
                  onClick: () => {
                    setSelectedSale(sale);
                    handleNavigate(`/products/edit-product`, sale);
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
