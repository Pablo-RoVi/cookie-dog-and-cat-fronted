import React, { useEffect, useState } from "react";
import { Product } from "../../app/models/product";
import { useLocation, useNavigate } from "react-router-dom";
import TableModule from "../../app/components/tablemodule";
import Buttons from "../../app/components/buttons";
import Options from '../../app/components/options';
import cookie from '../../app/static/images/cookie.png';
import Agent from '../../app/api/agent';
import Modal from '../../app/components/modal';
import { AxiosResponse } from "axios";


const defaultProduct: Product = {
    unique_id: "",
    product_name: "",
    price: "",
    stock: "",
    categoryName: "",
    brandName: "",
    specieName: "",
};

//TODO: Agregar modal de confirmación, luego redireccionar a la lista de productos

const AddProductPage = () => {
    const [unique_id, setId] = useState<string>("");
    const [productName, setName] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [stock, setStock] = useState<string>("");
    const [categoryName, setCategoryName] = useState<string>("");
    const [brandName, setBrandName] = useState<string>("");
    const [specieName, setEspecieName] = useState<string>("");

    const [isFormCompleted, setIsFormCompleted] = useState<boolean>(false);

    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState<boolean>(false);
    const [isAddedProductModalOpen, setIsAddedProductModalOpen] = useState<boolean>(false);

    const toggleConfirmationModal = () => {
        setIsConfirmationModalOpen(!isConfirmationModalOpen);
    };

    const toggleAddedProductModal = () => {
        setIsAddedProductModalOpen(!isAddedProductModalOpen);
    };
    
    const navigate = useNavigate();

    useEffect(() => {
        if (productName && price && stock && categoryName && brandName && specieName) {
            setIsFormCompleted(true);
        } else {
            setIsFormCompleted(false);
        }
    }, [productName, price, stock, categoryName, brandName, specieName]);
    

    const addProduct = () => {
        Agent.Products.addProduct({
            unique_id: unique_id,
            product_name: productName,
            price: price,
            stock: stock,
            categoryName: categoryName,
            brandName: brandName,
            specieName: specieName
        }).then((response : AxiosResponse) => {
            console.log("response", response);
            if(response.status === 200){
                toggleConfirmationModal();
                toggleAddedProductModal();
                console.log("Producto agregado con éxito");
            }else if(response.status === 400){
                console.log("Error al agregar el producto");
                console.error(response.statusText);
            }
        })
        .catch((error) => {
          console.log("error", error);});
    };

    const handleNavigate = () => {
        navigate('/products');
    };


    return (
        <div className="max-h-screen bg-white flex-auto flex h-1/2">
            <div className="container mx-auto mt-6 ml-52 max-w-[30%]">
                {TableModule.title({title: "Añadir producto"})}
                {TableModule.inputFilter({
                    label: "Código",
                    valueFilter: unique_id,
                    setOnChangeFilter: setId,
                    placeholder: "Código del producto",
                })}
                {TableModule.inputFilter({
                    label: "Nombre",
                    valueFilter: productName,
                    setOnChangeFilter: setName,
                    placeholder: "Nombre del producto",
                })}
                {TableModule.inputFilter({
                    label: "Precio",
                    valueFilter: price,
                    setOnChangeFilter: setPrice,
                    placeholder: "Precio",
                })}
                {TableModule.inputFilter({
                    label: "Stock",
                    valueFilter: stock,
                    setOnChangeFilter: setStock,
                    placeholder: "Stock",
                })}
                {TableModule.selectFilter({
                    label: "Categoría",
                    valueFilter: categoryName,
                    setOnChangeFilter: setCategoryName,
                    options: Options.categoryOptions,
                })}
                {TableModule.selectFilter({
                    label: "Marca",
                    valueFilter: brandName,
                    setOnChangeFilter: setBrandName,
                    options: Options.brandOptions,
                })}
                {TableModule.selectFilter({
                    label: "Especie",
                    valueFilter: specieName,
                    setOnChangeFilter: setEspecieName,
                    options: Options.specieOptions,
                })}
                <div className="flex items-center space-x-4">
                    {
                        isFormCompleted ? 
                            <Buttons.TurquoiseButton text="Añadir" onClick={toggleConfirmationModal} />
                            :
                            <Buttons.GrayButton text="Añadir" onClick={null} />
                    }
                    <Buttons.FuchsiaButton text="Cancelar" onClick={handleNavigate} />
                </div>
            </div>
            {isConfirmationModalOpen && (
                <Modal
                    title={`¿Estás seguro de que deseas agregar el producto '${productName}' de '${brandName}'?`}
                    confirmAction={() => addProduct()} 
                    confirmation="Añadir"
                    confirmCancel={toggleConfirmationModal}
                    activateCancel={true}
                    activateConfirm={true}
                />
            )}
            {isAddedProductModalOpen && (
                <Modal
                    title={`Producto '${productName}' agregado con éxito`}
                    confirmation="Aceptar"
                    confirmAction={() => {toggleAddedProductModal(); handleNavigate();}}
                    activateCancel={false}
                    activateConfirm={true}
                />
            )}
            <div className="container mx-auto mr-52 ml-40">
                <img src={cookie} alt="cookie" className="h-auto w-auto opacity-10" />
            </div>
        </div>
    );
}

export default AddProductPage;