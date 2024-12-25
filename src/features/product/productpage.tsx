import React, { useState, useEffect } from "react";
import "../../app/static/styles/index.css";
import Agent from "../../app/api/agent";
import buttons from "../../app/components/buttons";
import TableModule from "../../app/components/tablemodule";
import Functions from "../../app/components/functions";
import { Product } from '../../app/models/product';
import Modal from "../../app/components/modal";
import { useNavigate } from "react-router-dom";
import { AxiosResponse } from "axios";
import { useAuth } from "../../app/context/authcontext";
import ConfirmAdminLogged from "../../app/components/confirmadmin";


const headersAdmin = ["Código", "Nombre", "Precio", "Stock", "Categoria","Marca","Especie","Acciones"];

const headersEmployee = ["Código", "Nombre", "Precio", "Stock", "Categoria","Marca","Especie"];

const ProductPage = () => {

    const [products,setProducts] = useState([]);
    const [searchName, setSearchName] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedProduct, setSelectedProduct] = useState<Product>();
    const productsPerPage = 8;

    const navigate = useNavigate();

    const { userRoleId } = useAuth();

    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState<boolean>(false);
    const [isDeletedModalOpen, setIsDeletedModalOpen] = useState<boolean>(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
    const [isConfirmAdminLoggedModalOpen, setIsConfirmAdminLoggedModalOpen] = useState<boolean>(false);

    const [errorMessage, setErrorMessage] = useState<string>("");

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        const initializeData = async () => {
          try {
            const response = await Agent.Product.list();
            setProducts(response.data);
          } catch (error) {
            console.error("Error cargando lista de productos:", error);
          }
        };
    
        initializeData();
    }, []);

    const deleteProduct = (unique_id) => { if (selectedProduct) 
        {   
            if(unique_id){
                Agent.Product.delete(unique_id).then(
                    (response : AxiosResponse) => { 
                    if(response.status === 200) 
                    {                    
                        toggleDeleteModal();
                    } else if(response.status === 400)
                    {
                        console.error(response.statusText);
                    }
                }).catch(error => 
                    { 
                        console.log("error", error.response.data);
                        let errorMessages = [];
                        if(error.response && error.response.data && error.response.data.errors){
                            const errors = error.response.data.errors;

                            for(const key in errors){
                                if (errors.hasOwnProperty(key)) { 
                                    if (Array.isArray(errors[key])) 
                                    {  
                                        errors[key].forEach((msg) => { errorMessages.push(`${msg}`);}); 
                                    } else { 
                                        errorMessages.push(`${key}: ${errors[key]}`); 
                                    } 
                                }
                            }
                        }else{
                            errorMessages.push(error.response.data)
                        }
                        setErrorMessage(errorMessages.join("\n"));
                        toggleErrorModal();
                    }
                ); 
            }
        } 
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchName]);

    const filteredProducts = products.filter((product) => {
        return (
          product.product_name.toLowerCase().includes(searchName.toLowerCase())
        );
    });

    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const toggleConfirmationModal = () => {
        setIsConfirmationModalOpen(!isConfirmationModalOpen);
    };

    const toggleDeleteModal = () => {
        setIsDeletedModalOpen(!isDeletedModalOpen);
    };

    const toggleErrorModal = () => {
        setIsErrorModalOpen(!isErrorModalOpen);
    };

    const toggleConfirmAdminLoggedModal = () => {
        setIsConfirmAdminLoggedModalOpen(!isConfirmAdminLoggedModalOpen);
    };

    const handleNavigate = (path: string, state?: any) => {
        navigate(path, state ? { state } : undefined);
    };

    return (
        <div className="max-h-screen bg-white">
            <div className="container mx-auto px-4 py-6">
                {TableModule.title({ title: "Productos" })}
                {/* Filtros */}
                <div className="flex space-x-4">
                    <div className="container max-w-[20%]">
                        {TableModule.inputFilter({
                        label: "Nombre",
                        valueFilter: searchName,
                        setOnChangeFilter: setSearchName,
                        })}
                    </div>
                </div>

                {/* Tabla */}
                {TableModule.table({headers: userRoleId === 1 ? headersAdmin : headersEmployee, data: currentProducts.map((product: Product) => {
                const rows: (string | JSX.Element)[] = [
                product.unique_id,
                product.product_name,
                product.price,
                product.stock,
                product.categoryName,
                product.brandName,
                product.specieName
                ];
                if(userRoleId === 1){
                    rows.push(
                        <div className="flex justify-between items-center ml-4 mr-4">
                        {buttons.EditButton({onClick: () => { setSelectedProduct(product); handleNavigate(`/products/edit-product`,product); }})}
                        {buttons.DeleteButton({onClick: () => { setSelectedProduct(product); toggleConfirmationModal();}})}
                        </div>
                    );
                }
                return rows;
                })})}

                {isConfirmationModalOpen && (
                    <Modal title={`¿Borrar el producto '${selectedProduct.product_name}'?`} 
                    confirmAction={() => {toggleConfirmationModal(); toggleConfirmAdminLoggedModal();}}
                    confirmation="Eliminar" 
                    confirmCancel={() => toggleConfirmationModal()}
                    activateCancel={true}
                    activateConfirm={true}/>
                )}

                {isConfirmAdminLoggedModalOpen && (
                    <ConfirmAdminLogged
                        confirmation="Aceptar"
                        confirmAction={() => {toggleConfirmAdminLoggedModal();deleteProduct(selectedProduct.unique_id)}}
                        confirmCancel={() => toggleConfirmAdminLoggedModal()}
                        activateCancel={true}
                        activateConfirm={true}
                    />
                )}

                {isDeletedModalOpen && (
                    <Modal title={'Producto eliminado con éxito'} 
                    confirmation="Aceptar" 
                    confirmAction={() => {toggleDeleteModal(); Functions.refreshPage();}}
                    activateCancel={false}
                    activateConfirm={true}/>
                )}

                {isErrorModalOpen && (
                    <Modal title={`Corrija los siguientes errores: ${errorMessage}`} 
                    confirmation="Aceptar" 
                    confirmAction={() => toggleErrorModal()}
                    activateCancel={false}
                    activateConfirm={true}>
                    </Modal>
                )}

                {/* Paginación */}
                {TableModule.pagination({
                length: filteredProducts.length, 
                perPage: productsPerPage, 
                currentPage: currentPage, 
                paginate: paginate
                })}

                {/* Botón Agregar */}
                {userRoleId === 1 ?
                    buttons.TurquoiseButton({ text: "Añadir", onClick: () => handleNavigate("/products/add-product")})
                    : null
                }      
            </div>
        </div>
    );
};

export default ProductPage;