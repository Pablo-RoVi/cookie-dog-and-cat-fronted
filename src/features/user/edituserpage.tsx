import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Buttons from '../../app/components/buttons';
import Options from '../../app/components/options';
import colors from '../../app/static/colors';
import TableModule from '../../app/components/tablemodule';
import { User } from '../../app/models/user';

const EditUserPage = () => {
    const [roleFilter, setRoleFilter] = useState<string>("");
    const [id, setId] = useState<number>(0);
    const [newName, setNewName] = useState<string>("");
    const [newLastName, setNewLastName] = useState<string>("");
    const [rut, setRut] = useState<string>("");
    const [nickName, setNickName] = useState<string>("");
    const [newRole, setNewRole] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state;

    useEffect(() => {
        if (user) {
            setId(user.id);
            setNewName(user.name);
            setNewLastName(user.last_name);
            setRut(user.rut);
            setNickName(user.nick_name);
            setNewRole(user.role.role_name);
        }
    }, [user]);

    if (!user) {
        return <div>Usuario no encontrado</div>;
    }

    const handleNavigate = () => {
        navigate('/users');
    };

    return (
        <div className="max-h-screen bg-white flex-auto flex space-x-4 h-1/2">
            <div className="container mx-auto px-4 py-6">
                {TableModule.title({title: "Editar empleado"})}
                {TableModule.inputFilter({
                        label: "Código",
                        valueFilter: id.toString(),
                })}
                {TableModule.inputFilter({
                    label: "Nombre",
                    valueFilter: newName,
                    onChangeFilter: setNewName,
                    placeholder: "Nombre",
                })}
                {TableModule.inputFilter({
                    label: "Apellido",
                    valueFilter: newLastName,
                    onChangeFilter: setNewLastName,
                    placeholder: "Apellido",
                })}
                {TableModule.inputFilter({
                    label: "RUT",
                    valueFilter: rut,
                })}
                {TableModule.inputFilter({
                    label: "Nombre de usuario",
                    valueFilter: nickName,
                })}
                {TableModule.selectFilter({
                    label: "Rol",
                    valueFilter: newRole,
                    onChangeFilter: setNewRole,
                    options: Options.roleOptions,
                    placeholder: "Rol",
                })}
                <div className="flex items-center space-x-4">
                    <Buttons.TurquoiseButton text="Editar" onClick={handleNavigate} />
                    <Buttons.FuchsiaButton text="Cancelar" onClick={handleNavigate} />
                </div>
            </div>
            <div className="container mx-auto px-4 py-6">
                {TableModule.title({title: "Editar Contraseña"})}
                {TableModule.inputFilter({
                    label: "Nueva Contraseña",
                    valueFilter: newPassword,
                    onChangeFilter: setNewPassword,
                    placeholder: "Nueva Contraseña",
                })}
                {TableModule.inputFilter({
                    label: "Confirmar Contraseña",
                    valueFilter: confirmNewPassword,
                    onChangeFilter: setConfirmNewPassword,
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
