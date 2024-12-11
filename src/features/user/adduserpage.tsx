import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../app/models/user';
import cookie from '../../app/static/images/cookie.png';
import TableModule from '../../app/components/tablemodule';
import Buttons from '../../app/components/buttons';
import Options from '../../app/components/options';

const defaultUser: User = {
    id: 0,
    name: "",
    last_name: "",
    rut: "",
    nick_name: "",
    is_active: false,
    role: {
        id: 0,
        role_name: "",
    },
};

const AddUserPage = () => {

    const [id, setId] = useState<number>(0);
    const [name, setName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [rut, setRut] = useState<string>("");
    const [nickName, setNickName] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/users');
    };

    return (
        <div className="max-h-screen bg-white flex-auto flex h-1/2">
            <div className="container mx-auto mt-6 ml-52 max-w-[30%]">
                {TableModule.title({title: "Registrar nuevo empleado"})}
                {TableModule.inputFilter({
                    label: "Nombres",
                    valueFilter: name,
                    setOnChangeFilter: setName,
                })}
                {TableModule.inputFilter({
                    label: "Apellidos",
                    valueFilter: lastName,
                    setOnChangeFilter: setLastName,
                })}
                {TableModule.inputFilter({
                    label: "RUT",
                    valueFilter: rut,
                    setOnChangeFilter: setRut,
                })}
                {TableModule.inputFilter({
                    label: "Nombre de usuario",
                    valueFilter: nickName,
                    isDisabled: true,
                })}
                {TableModule.selectFilter({
                    label: "Rol",
                    valueFilter: role,
                    setOnChangeFilter: setRole,
                    options: Options.roleOptions,
                })}
                {TableModule.inputFilter({
                    label: "Contraseña",
                    valueFilter: newPassword,
                    setOnChangeFilter: setNewPassword,
                })}
                {TableModule.inputFilter({
                    label: "Confirmar contraseña",
                    valueFilter: confirmNewPassword,
                    setOnChangeFilter: setConfirmNewPassword,
                })}
                <div className="flex items-center space-x-4">
                    <Buttons.TurquoiseButton text="Editar" onClick={handleNavigate} />
                    <Buttons.FuchsiaButton text="Cancelar" onClick={handleNavigate} />
                </div>
            </div>
            <div className="container mx-auto mr-52 ml-40">
                <img src={cookie} alt="cookie" className="h-auto w-auto opacity-10" />
            </div>
        </div>
    );
};
export default AddUserPage;
