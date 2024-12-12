import React, { useEffect, useState } from "react";
import { Product } from "../../app/models/product";
import { useLocation, useNavigate } from "react-router-dom";
import TableModule from "../../app/components/tablemodule";
import Buttons from "../../app/components/buttons";
import Options from '../../app/components/options';
import cookie from '../../app/static/images/cookie.png';


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
    const [unique_id, setId] = useState<number>(0);
    const [productName, setName] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [stock, setStock] = useState<string>("");
    const [categoryName, setCategoryName] = useState<string>("");
    const [brandName, setBrandName] = useState<string>("");
    const [specieName, setEspecieName] = useState<string>("");
    const location = useLocation();
    const navigate = useNavigate();
    const product = location.state;

    
    useEffect(() => {
        if (product) {
            setId(product.unique_id);
            setName(product.product_name);
            setPrice(product.price);
            setStock(product.stock);
            setCategoryName(product.categoryName);
            setBrandName(product.brandName);
            setEspecieName(product.specieName);
        }
    }, [product]);

    /*
    if (!user) {
        return <div>Usuario no encontrado</div>;
    }
    */

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
                    <Buttons.TurquoiseButton text="Añadir" onClick={handleNavigate} />
                    <Buttons.FuchsiaButton text="Cancelar" onClick={handleNavigate} />
                </div>
            </div>
            <div className="container mx-auto mt-20">
                <img src={cookie} alt="cookie" className="h-auto w-auto opacity-10" />
            </div>
        </div>
    );
}

export default AddProductPage;