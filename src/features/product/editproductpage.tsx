import React, { useEffect, useState } from "react";
import TableModule from "../../app/components/tablemodule";
import Buttons from "../../app/components/buttons";
import Options from '../../app/components/options';
import { useLocation, useNavigate } from "react-router-dom";
import cookie from '../../app/static/images/cookie.png';
import Agent from '../../app/api/agent';
import { AxiosResponse } from "axios";
import Modal from "../../app/components/modal";

//TODO: Agregar modal de confirmación, luego redireccionar a la lista de productos

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

    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState<boolean>(false);
    const [isEditedProductModalOpen, setIsEditedProductModalOpen] = useState<boolean>(false);

    const location = useLocation();
    const product = location.state;

    const navigate = useNavigate();

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
    }, [originalData, unique_id, productName, price, stock, categoryName, brandName, specieName]);
    
    const updateProduct = () => {
        Agent.Products.updateProduct({
            unique_id: unique_id,
            product_name: productName,
            price: price,
            stock: stock,
            categoryName: categoryName,
            brandName: brandName,
            specieName: specieName
        }, originalData.unique_id).then((response : AxiosResponse) => {
            console.log("Producto actualizado");
            if(response.status === 200){
                console.log("Producto actualizado");
                toggleConfirmationModal();
                toggleEditedProductModal();
            }else if(response.status === 400){
                console.log("Error al actualizar el producto");
            }
        }).catch((error) => {
            console.log("Error al actualizar el producto", error);
        });
    };

    const handleNavigate = () => {
        navigate('/products');
    };

    const toggleConfirmationModal = () => {
        setIsConfirmationModalOpen(!isConfirmationModalOpen);
    };

    const toggleEditedProductModal = () => {
        setIsEditedProductModalOpen(!isEditedProductModalOpen);
    };


    return (
        <div className="max-h-screen bg-white flex-auto flex h-1/2">
            <div className="container mx-auto mt-6 ml-52">
                {TableModule.title({title: "Editar producto"})}
                {TableModule.inputFilter({
                    label: "Código",
                    valueFilter: unique_id,
                    setOnChangeFilter: setId
                })}
                {TableModule.inputFilter({
                    label: "Nombre",
                    valueFilter: productName,
                    setOnChangeFilter: setName,
                })}
                {TableModule.inputFilter({
                    label: "Precio",
                    valueFilter: price,
                    setOnChangeFilter: setPrice,
                })}
                {TableModule.inputFilter({
                    label: "Stock",
                    valueFilter: stock,
                    setOnChangeFilter: setStock,
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
                        isProductModified ?
                            <Buttons.TurquoiseButton text="Editar" onClick={toggleConfirmationModal}/>
                            : 
                            <Buttons.GrayButton text="Editar" onClick={null} />
                    }
                    <Buttons.FuchsiaButton text="Cancelar" onClick={handleNavigate} />
                </div>
            </div>
            {isConfirmationModalOpen && (
                <Modal
                    title={`¿Estás seguro de que deseas editar el producto '${productName}' de '${brandName}'?`}
                    confirmAction={() => updateProduct()} 
                    confirmation="Editar"
                    confirmCancel={toggleConfirmationModal}
                    activateCancel={true}
                    activateConfirm={true}
                />
            )}
            {isEditedProductModalOpen && (
                <Modal
                    title={`Producto '${productName}' editado con éxito`}
                    confirmation="Aceptar"
                    confirmAction={() => {toggleEditedProductModal(); handleNavigate();}}
                    activateCancel={false}
                    activateConfirm={true}
                />
            )}
            <div className="container mx-auto mt-20">
                <img src={cookie} alt="cookie" className="h-auto w-auto opacity-10" />
            </div>
        </div>
    );
}

export default EditProductPage;