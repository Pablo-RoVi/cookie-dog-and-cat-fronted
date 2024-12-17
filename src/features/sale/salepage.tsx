import React, { useState } from "react";
import "../../app/static/styles/index.css";
import TableModule from "../../app/components/tablemodule";
import Buttons from "../../app/components/buttons";
import { useNavigate } from "react-router-dom";
import Modal from "../../app/components/modal";
import ConfirmAdminLogged from "../../app/components/confirmadmin";
import Functions from "../../app/components/functions";


const headers = ["Código", "Producto(s)", "Precio Total", "Medio de pago", "Trabajador(a)","Acciones"];

const SalePage = () => {

    const toggleConfirmationModal = () => {
        setIsConfirmationModalOpen(!isConfirmationModalOpen);
      };

    const toggleConfirmAdminLogged = () => {
        setIsConfirmationAdminLogged(!isConfirmationAdminLogged);
      };

      const toggleChangedStateModal = () => {
        setIsChangedStateModal(!isChangedStateModal);
      };

    const navigate = useNavigate();

    const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
        useState<boolean>(false);
    const [isChangedStateModal, setIsChangedStateModal] =
        useState<boolean>(false);
    const [isConfirmationAdminLogged, setIsConfirmationAdminLogged] =
        useState<boolean>(false);

    
    const [products, setProducts] = useState([
        {
          id: 1,
          name: "Cachitos",
          brand: "Cookie Dog + Cat",
          category: "Comida Natural",
          species: "Perro",
          price: 2000,
          quantity: 1,
        },
        {
          id: 2,
          name: "Bolsas de paseo",
          brand: "PetSafe",
          category: "Paseo",
          species: "-",
          price: 6000,
          quantity: 3,
        },
        {
          id: 3,
          name: "Churu de Pollo",
          brand: "Purina!",
          category: "Alimento",
          species: "Gato",
          price: 50000,
          quantity: 10,
        },
      ]);
    const [sales, setSales] = useState([
      {
        id: 954252,
        Total_quantity: 5,
        Total: 2000,
        Date: "12/12/2022",
        Payment_method: "MasterCard",
        UserId: 1,
        products : products
      },
    ]);

    const [employees] = useState([
        { id: 1, name: "Camila Tessini", is_active: false },
        { id: 2, name: "Carlos Martínez", is_active: true },
        { id: 3, name: "Ana López", is_active: true },
      ]);
  
  const handleNavigate = (path: string, state?: any) => {
    navigate(path, state ? { state } : undefined);
  };

    return (
      <div className="max-h-screen bg-white">
        <div className="container mx-auto px-4 py-6">
          {/* Título */}
          <h1 className="text-4xl font-bold text-[#6FC9D1] mb-6">Ventas</h1>
  
         
  
          {/* Tabla y botón del carrito */}
          <div className="relative">
            {TableModule.table({
              headers: headers,
              data: sales.map((sale) => [
                sale.id,
                sale.products.map((product) => product.name).join(", "),
                sale.Total,
                sale.Payment_method,
                sale.products.map((product) => product.name).join(", "),
                <div className="flex justify-center items-center ml-4 mr-4 space-x-4">
                 {employees[1].is_active && (
                  <Buttons.EditButton
                    onClick={() => handleNavigate("/edit-sale")}/> )}
                  <Buttons.DetailButton
                    onClick={() => handleNavigate("/detail-sale")} data={sale}/>
                 {employees[1].is_active && (
                  <Buttons.DeleteButton
                    onClick={() =>{
                        toggleConfirmationModal();
                    }
                    
                    }/>
                 )}
                 
              </div>,
              ]),
            })}
        {isConfirmationModalOpen &&
          !isConfirmationAdminLogged && (
            <Modal
              title="¿Desea eliminar la venta?"
              confirmAction={setIsConfirmationAdminLogged}
              confirmation="Eliminar"
              confirmCancel={toggleConfirmationModal}
              activateCancel={true}
              activateConfirm={true}
            />
          )}
        {isConfirmationAdminLogged && (
          <ConfirmAdminLogged
            confirmation="Confirmar"
            confirmAction={() => {
                toggleConfirmationModal();
                toggleChangedStateModal();
            }}
            confirmCancel={() => {
              toggleConfirmAdminLogged();
              toggleConfirmationModal();
            }}
            activateCancel={true}
            activateConfirm={true}
          />
        )}          
        {isChangedStateModal && !isConfirmationAdminLogged && (
          <Modal
            title={"Venta eliminada con éxito"}
            confirmation="Aceptar"
            confirmAction={() => {
              toggleChangedStateModal();
              Functions.refreshPage();
            }}
            activateCancel={false}
            activateConfirm={true}
          />
        )}        
          </div>
        
        </div>
      </div>
    );
  };
export default SalePage;