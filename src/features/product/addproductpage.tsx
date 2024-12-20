import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TableModule from "../../app/components/tablemodule";
import Buttons from "../../app/components/buttons";
import Options from '../../app/components/options';
import cookie from '../../app/static/images/cookie.png';
import Agent from '../../app/api/agent';
import Modal from '../../app/components/modal';
import { AxiosResponse } from "axios";
import { Brand } from '../../app/models/brand';
import Functions from "../../app/components/functions";
import ConfirmAdminLogged from "../../app/components/confirmadmin";

const AddProductPage = () => {
    const [unique_id, setId] = useState<string>("");
    const [productName, setName] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [stock, setStock] = useState<string>("");
    const [categoryName, setCategoryName] = useState<string>("");
    const [brandName, setBrandName] = useState<string>("");
    const [specieName, setEspecieName] = useState<string>("");

    const [isFormCompleted, setIsFormCompleted] = useState<boolean>(false);

    const [isConfirmationProductModalOpen, setIsConfirmationProductModalOpen] = useState<boolean>(false);
    const [isAddedProductModalOpen, setIsAddedProductModalOpen] = useState<boolean>(false);

    const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);

    const [isConfirmationAdminLogged, setIsConfirmationAdminLogged] = useState<boolean>(false);

    const [toAddProduct,setToAddProduct] = useState<boolean>(false);
    const [toAddBrand,setToAddBrand] = useState<boolean>(false);

    const [brands,setBrands] = useState([]);

    const [newBrandName, setNewBrandName] = useState<string>("");
    const [isBrandAdded, setIsBrandAdded] = useState<boolean>(false);
    const [isConfirmationBrandModalOpen, setIsConfirmationBrandModalOpen] = useState<boolean>(false);
    const [isAddedBrandModalOpen, setIsAddedBrandModalOpen] = useState<boolean>(false);

    const [errorMessage,setErrorMessage] = useState<string>("");

    const toggleConfirmationProductModal = () => {
        setIsConfirmationProductModalOpen(!isConfirmationProductModalOpen);
    };

    const toggleAddedProductModal = () => {
        setIsAddedProductModalOpen(!isAddedProductModalOpen);
    };

    const toggleConfirmationBrandModal = () => {
        setIsConfirmationBrandModalOpen(!isConfirmationBrandModalOpen);
    };

    const toggleAddedBrandModal = () => {
        setIsAddedBrandModalOpen(!isAddedBrandModalOpen);
    };

    const toggleErrorModal = () => {
        setIsErrorModalOpen(!isErrorModalOpen);
    };

    const toggleConfirmAdminLogged = () => {
        setIsConfirmationAdminLogged(!isConfirmationAdminLogged);
    };
    
    const navigate = useNavigate();

    useEffect(() => {
       if(newBrandName !== "") {
            setIsBrandAdded(true);
        } else {
            setIsBrandAdded(false);
        }
    }, [newBrandName]);


    useEffect(() => {
        if (productName && price && stock && categoryName && brandName && specieName) {
            setIsFormCompleted(true);
        } else {
            setIsFormCompleted(false);
        }
    }, [productName, price, stock, categoryName, brandName, specieName]);

    useEffect(() => {
        Agent.Brand.list().then((response) => {
            setBrands(response.data.map((brand : Brand) => ({
                value: brand.brand_name,
                label: brand.brand_name
            })));
        })
    },[]);
    
    const addProduct = () => {
        Agent.Product.add({
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
                toggleAddedProductModal();
                console.log("Producto agregado con éxito");
            }else if(response.status === 400){
                console.log("Error al agregar el producto");
            }
        })
        .catch((error) => {
            console.log("error", error.response.data);
            let errorMessages = [];
            if(error.response && error.response.data && error.response.data.errors){
                const errors = error.response.data.errors;

                for(const key in errors){
                    if (errors.hasOwnProperty(key)) { 
                        if (Array.isArray(errors[key])) 
                        {  
                            errors[key].forEach((msg) => { errorMessages.push(`${key}: ${msg}`);}); 
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
        });
    };

    const addBrand = () => {
        Agent.Brand.add({
            brandName: newBrandName
        }).then((response : AxiosResponse) => {
            console.log("response", response);
            if(response.status === 204){
                toggleAddedBrandModal();
                console.log("Marca agregada con éxito");
            }else if(response.status === 400){
                console.log("Error al agregar la marca");
            }
        })
        .catch((error) => {
            console.log("error", error.response.data);
            let errorMessages = [];
            if(error.response && error.response.data && error.response.data.errors){
                const errors = error.response.data.errors;

                for(const key in errors){
                    if (errors.hasOwnProperty(key)) { 
                        if (Array.isArray(errors[key])) 
                        {  
                            errors[key].forEach((msg) => { errorMessages.push(`${key}: ${msg}`);}); 
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
        });
    };

    const handleNavigate = () => {
        navigate('/products');
    };

    return (
        <div className="max-h-screen bg-white flex-auto flex h-1/2">
            <div className="container mx-auto mt-6 ml-52">
                {TableModule.title({title: "Añadir producto"})}
                {TableModule.inputFilter({
                    label: "Código",
                    valueFilter: unique_id,
                    setOnChangeFilter: setId,
                    placeholder: "Código del producto",
                    errorInput: !Functions.verifyProductCode(unique_id) && unique_id !== "",
                    errorMessage: "El código debe ser numérico y de 8 a 15 dígitos",
                })}
                {TableModule.inputFilter({
                    label: "Nombre",
                    valueFilter: productName,
                    setOnChangeFilter: setName,
                    placeholder: "Nombre del producto",
                    errorInput: !Functions.verifyProductName(productName) && productName !== "",
                    errorMessage: "El nombre debe tener entre 3 y 100 caracteres del abecedario español",
                })}
                {TableModule.inputFilter({
                    label: "Precio",
                    valueFilter: price,
                    setOnChangeFilter: setPrice,
                    placeholder: "Precio",
                    errorInput: !Functions.verifyProductPrice(price) && price !== "",
                    errorMessage: "El precio debe ser un número mayor a 0, de máximo de 9 dígitos con o sin puntos",
                })}
                {TableModule.inputFilter({
                    label: "Stock",
                    valueFilter: stock,
                    setOnChangeFilter: setStock,
                    placeholder: "Stock",
                    errorInput: !Functions.verifyProductStock(stock) && stock !== "",
                    errorMessage: "El stock debe ser un número mayor a 0, de máximo de 9 dígitos",
                })}
                {TableModule.selectFilter({
                    label: "Categoría",
                    valueFilter: categoryName,
                    setOnChangeFilter: setCategoryName,
                    options: Options.categoryOptions,
                    firstValue: "SIN ELECCIÓN",
                })}
                {TableModule.selectFilter({
                    label: "Marca",
                    valueFilter: brandName,
                    setOnChangeFilter: setBrandName,
                    options: brands,
                    firstValue: "SIN ELECCIÓN",
                })}
                {TableModule.selectFilter({
                    label: "Especie",
                    valueFilter: specieName,
                    setOnChangeFilter: setEspecieName,
                    options: Options.specieOptions,
                    firstValue: "SIN ELECCIÓN",
                })}
                <div className="flex items-center space-x-4">
                    {
                        isFormCompleted ? 
                            <Buttons.TurquoiseButton text="Añadir" onClick={() => toggleConfirmationProductModal()} />
                            :
                            <Buttons.GrayButton text="Añadir" onClick={null} />
                    }
                    <Buttons.FuchsiaButton text="Cancelar" onClick={() => handleNavigate()} />
                </div>
            </div>
            {isConfirmationProductModalOpen && (
                <Modal
                    title={`¿Estás seguro de que deseas agregar el producto '${productName}' de '${brandName}'?`}
                    confirmAction={() => {setToAddProduct(true);toggleConfirmAdminLogged(); toggleConfirmationProductModal();}} 
                    confirmation="Añadir"
                    confirmCancel={() => toggleConfirmationProductModal()}
                    activateCancel={true}
                    activateConfirm={true}
                />
            )}
            {isAddedProductModalOpen && (
                <Modal
                    title={`Producto '${productName}' agregado con éxito`}
                    confirmation="Aceptar"
                    confirmAction={() => {toggleAddedProductModal(); Functions.refreshPage()}}
                    activateCancel={false}
                    activateConfirm={true}
                />
            )}
            {isErrorModalOpen && (
                <Modal
                    title={`Corrija los siguientes errores:\n ${errorMessage}`}
                    confirmation="Aceptar"
                    confirmAction={() => {
                        toggleErrorModal()
                        if(toAddProduct){
                            setToAddProduct(false);
                        }else if(toAddBrand){
                            setToAddBrand(false);
                        }
                    }}
                    activateCancel={false}
                    activateConfirm={true}
                />
            )}
            <div className="container mx-auto mt-20">
                <img src={cookie} alt="cookie" className="h-auto w-auto opacity-10" />
            </div>
            <div className="container mx-auto mt-6 mr-52">
                {TableModule.title({title: "Añadir marca"})}
                {TableModule.inputFilter({
                    label: "Nombre",
                    valueFilter: newBrandName,
                    setOnChangeFilter: setNewBrandName,
                    placeholder: "Nombre de la marca",
                    errorInput: !Functions.verifyBrandName(newBrandName) && newBrandName !== "",
                    errorMessage: "El nombre de la marca debe tener entre 3 y 30 caracteres del abecedario español",
                })}

                <div className="flex items-center space-x-4">
                    {isBrandAdded ? (
                        <Buttons.TurquoiseButton
                        text="Añadir"
                        onClick={() => toggleConfirmationBrandModal()}
                        />
                    ) : (
                        <Buttons.GrayButton text="Añadir" onClick={null} />
                    )}
                    <Buttons.FuchsiaButton text="Cancelar" onClick={() => handleNavigate()} />
                </div> 
            </div>
            {isConfirmationBrandModalOpen && (
                <Modal
                    title={`¿Estás seguro de que deseas agregar la marca '${newBrandName}'?`}
                    confirmAction={() =>{setToAddBrand(true);toggleConfirmAdminLogged();toggleConfirmationBrandModal();}} 
                    confirmation="Añadir"
                    confirmCancel={() => toggleConfirmationBrandModal()}
                    activateCancel={true}
                    activateConfirm={true}
                />
            )}
            {isConfirmationAdminLogged && (
                <ConfirmAdminLogged
                    confirmation="Confirmar"
                    confirmAction={() => {
                        if (toAddProduct) {
                            addProduct();
                        }else if(toAddBrand){
                            addBrand();
                        }
                    }}
                    confirmCancel={() => {
                        toggleConfirmAdminLogged();
                        setToAddProduct(false);
                        setToAddBrand(false);
                    }}
                    activateCancel={true}
                    activateConfirm={true}
                />
            )}
            {isAddedBrandModalOpen && (
                <Modal
                    title={`Marca '${newBrandName}' agregada con éxito`}
                    confirmation="Aceptar"
                    confirmAction={() => {toggleAddedBrandModal(); Functions.refreshPage();}}
                    activateCancel={false}
                    activateConfirm={true}
                />
                )
            }
        </div>
    );
}

export default AddProductPage;