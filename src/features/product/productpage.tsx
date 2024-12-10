import React, { useState, useEffect } from "react";
import "../../app/static/styles/index.css";
import Agent from "../../app/api/agent";
import colors from "../../app/static/colors";
import buttons from "../../app/components/buttons";
import TableModule from "../../app/components/tablemodule";
import { Product } from '../../app/models/product';
import Modal from "../../app/components/modal";
import { useNavigate } from "react-router-dom";
import { AxiosResponse } from "axios";


const headers = ["Código", "Nombre", "Precio", "Stock", "Categoria","Marca","Especie","Acciones"];

const ProductPage = () => {

    const [products,setProducts] = useState([]);
    const [searchName, setSearchName] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedProduct, setSelectedProduct] = useState<Product>();
    const productsPerPage = 8;
    const navigate = useNavigate();

    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState<boolean>(false);
    const [isDeletedModal, setIsDeletedModal] = useState<boolean>(false);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        Agent.Products.list().then((response) => {
          setProducts(response);
        });
    }, []);


    const deleteProduct = (unique_id) => { if (selectedProduct) 
        {   
            if(unique_id){
                toggleConfirmationModal();
                Agent.Products.deleteProduct(unique_id).then(
                    (response : AxiosResponse) => { 
                    if(response.status === 200) 
                    {                    
                        toggleDeletedModal();
                    } else if(response.status === 400)
                    {
                        console.error(response.statusText);
                    }
                }).catch(error => 
                    { 
                        console.error("Error al eliminar el producto:", error); 
                }); 
            }
            else{
                console.log("No tengo id");
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

    const toggleConfirmationModal = () => {
        setIsConfirmationModalOpen(!isConfirmationModalOpen);
    };

    const toggleDeletedModal = () => {
        setIsDeletedModal(!isDeletedModal);
    };

    const refreshPage = () => {
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-6">
                <h1 className="text-2xl font-bold mb-4" style={{color: colors.turquoise}}>Productos</h1>
                {/* Filtros */}
                <div className="flex space-x-4 mb-6">
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg shadow-sm w-1/3"
                    />
                </div>

                {/* Tabla */}
                {TableModule.table({headers: headers, data: products.map((product: Product) => [
                product.unique_id,
                product.product_name,
                product.price,
                product.stock,
                product.categoryName,
                product.brandName,
                product.specieName,
                <>
                    <div className="flex justify-between items-center ml-4 mr-4">
                    {buttons.editButton({onClick: () => { setSelectedProduct(product); navigate(`/products/edit-product/${product.unique_id}`) }})}
                    {buttons.deleteButton({onClick: () => { setSelectedProduct(product); toggleConfirmationModal();}})}
                    </div>
                </>
                ])})}

                {isConfirmationModalOpen && (
                    <Modal title={`¿Borrar el producto ${selectedProduct.product_name}?`} 
                    confirmAction={() => deleteProduct(selectedProduct.unique_id)} 
                    confirmation="Eliminar" 
                    confirmCancel={toggleConfirmationModal}
                    activateCancel={true}
                    activateConfirm={true}/>
                )}

                {isDeletedModal && (
                    <Modal title={'Producto eliminado con éxito'} 
                    confirmation="Aceptar" 
                    confirmAction={() => {toggleDeletedModal(); refreshPage();}}
                    activateCancel={false}
                    activateConfirm={true}/>
                )}

                {/* Paginación */}
                {TableModule.pagination({
                length: filteredProducts.length, 
                perPage: productsPerPage, 
                currentPage: currentPage, 
                paginate: paginate
                })}

                {/* Botón Agregar */}
                {buttons.turquoiseButton({ text: "Añadir", onClick: () => navigate("/products/add-product") })}
            </div>
        </div>
    );
};

export default ProductPage;