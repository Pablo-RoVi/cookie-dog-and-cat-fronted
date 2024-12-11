import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Buttons from '../../app/components/buttons';
import Options from '../../app/components/options';
import colors from '../../app/static/colors';
import cookie from '../../app/static/images/cookie.png';
import TableModule from '../../app/components/tablemodule';
import { User } from '../../app/models/user';

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

const EditUserPage = () => {
    const [roleFilter, setRoleFilter] = useState<string>("");
    const [id, setId] = useState<number>(0);
    const [name, setName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [rut, setRut] = useState<string>("");
    const [nickName, setNickName] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state;

    useEffect(() => {
        if (user) {
            setId(user.id);
            setName(user.name);
            setLastName(user.last_name);
            setRut(user.rut);
            setNickName(user.nick_name);
            setRole(user.role.role_name);
        }
    }, [user]);

    if (!user) {
        return <div>Usuario no encontrado</div>;
    }

    const handleNavigate = () => {
        navigate('/users');
    };

    return (
        <div className="max-h-screen bg-white flex-auto flex h-1/2">
            <div className="container mx-auto mt-6 ml-52">
                {TableModule.title({title: "Editar empleado"})}
                {TableModule.inputFilter({
                        label: "Código",
                        valueFilter: id.toString(),
                        isDisabled: true,
                })}
                {TableModule.inputFilter({
                    label: "Nombre",
                    valueFilter: name,
                    setOnChangeFilter: setName,
                    placeholder: "Nombre",
                })}
                {TableModule.inputFilter({
                    label: "Apellido",
                    valueFilter: lastName,
                    setOnChangeFilter: setLastName,
                    placeholder: "Apellido",
                })}
                {TableModule.inputFilter({
                    label: "RUT",
                    valueFilter: rut,
                    isDisabled: true,
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
                <div className="flex items-center space-x-4">
                    <Buttons.TurquoiseButton text="Editar" onClick={handleNavigate} />
                    <Buttons.FuchsiaButton text="Cancelar" onClick={handleNavigate} />
                </div>
            </div>
            <div className="container mx-auto mt-20">
                <img src={cookie} alt="cookie" className="h-auto w-auto opacity-10" />
            </div>
            <div className="container mx-auto mt-6 mr-52">
                {TableModule.title({title: "Editar contraseña"})}
                {TableModule.inputFilter({
                    label: "Nueva Contraseña",
                    valueFilter: newPassword,
                    setOnChangeFilter: setNewPassword,
                    placeholder: "Nueva Contraseña",
                })}
                {TableModule.inputFilter({
                    label: "Confirmar Contraseña",
                    valueFilter: confirmNewPassword,
                    setOnChangeFilter: setConfirmNewPassword,
                    placeholder: "Confirmar Contraseña",
                })}
                <div className="flex items-center space-x-4">
                    <Buttons.TurquoiseButton text="Editar" onClick={handleNavigate} />
                    <Buttons.FuchsiaButton text="Cancelar" onClick={handleNavigate} />
                </div>
            </div>
        </div>
    );
};
export default EditUserPage;
