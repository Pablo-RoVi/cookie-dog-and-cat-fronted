import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Buttons from '../../app/components/buttons';
import Options from '../../app/components/options';
import cookie from '../../app/static/images/cookie.png';
import TableModule from '../../app/components/tablemodule';
import Modal from '../../app/components/modal';
import Agent from "../../app/api/agent";

const EditUserPage = () => {
    const [id, setId] = useState<number>(0);
    const [name, setName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [rut, setRut] = useState<string>("");
    const [nickName, setNickName] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
    const [isConfirmationUserModalOpen, setIsConfirmationUserModalOpen] = useState<boolean>(false);
    const[isChangedUserModal, setIsChangedUserModal] = useState<boolean>(false);
    const [isConfirmationPasswordModalOpen, setIsConfirmationPasswordModalOpen] = useState<boolean>(false);
    const[isChangedPasswordModal, setIsChangedPasswordModal] = useState<boolean>(false);
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state;

    const confirmText = isConfirmationUserModalOpen ? "¿Desea editar al usuario?" : "¿Desea editar la contraseña?";
    const changedText = isChangedUserModal ? "Usuario editado con éxito" : "Contraseña editada con éxito"; 

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

    const handleNavigate = () => {
        navigate('/users');
    };
    
    const toggleConfirmationUserModal = () => {
        setIsConfirmationUserModalOpen(!isConfirmationUserModalOpen);
    };
  
    const toggleChangedUserModal = () => {
        setIsChangedUserModal(!isChangedUserModal);
    };

    const toggleConfirmationPasswordModal = () => {
        setIsConfirmationPasswordModalOpen(!isConfirmationPasswordModalOpen);
    };

    const toggleChangedPasswordModal = () => {
        setIsChangedPasswordModal(!isChangedPasswordModal);
    };

    const editUser = () => {
        Agent.Users.updateUser({
            id: id,
            name: name,
            last_name: lastName,
            role_name: role,
        })
        .then(() => {
            toggleConfirmationUserModal();
            toggleChangedUserModal();
            setNickName(`${name.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}${lastName.slice(1).toLowerCase()}`);
        })
        .catch((error) => {});
    };

    const editPassword = () => {
        if (newPassword !== confirmNewPassword) {
            console.log("Las contraseñas no coinciden");
            return;
        }
        Agent.Users.changePasswordAdmin({
            nick_name: nickName,
            newPassword: newPassword,
            confirmPassword: confirmNewPassword,
        })
        .then(() => {
            toggleConfirmationPasswordModal();
            toggleChangedPasswordModal();
        })
        .catch((error) => {});
    };

    return (
        <div className="max-h-screen bg-white flex-auto flex h-1/2">
            {/* Edit User */}
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
                    <Buttons.TurquoiseButton text="Editar" onClick={toggleConfirmationUserModal} />
                    <Buttons.FuchsiaButton text="Cancelar" onClick={handleNavigate} />
                </div>
            </div>
            
            {/* Confirmation User Modal */}
            {isConfirmationUserModalOpen && (
                <Modal title={confirmText} 
                confirmAction={() => editUser()} 
                confirmation="Editar"
                confirmCancel={toggleConfirmationUserModal}
                activateCancel={true}
                activateConfirm={true}/>
            )}
            {isChangedUserModal && (
                <Modal title={changedText}
                confirmation="Aceptar" 
                confirmAction={() => {toggleChangedUserModal()}}
                activateCancel={false}
                activateConfirm={true}/>
            )}
            
            <div className="container mx-auto mt-20">
                <img src={cookie} alt="cookie" className="h-auto w-auto opacity-10" />
            </div>

            {/* Edit Password */}
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
                    <Buttons.TurquoiseButton text="Editar" onClick={toggleConfirmationPasswordModal} />
                    <Buttons.FuchsiaButton text="Cancelar" onClick={handleNavigate} />
                </div>
            </div>
            
            {/* Confirmation Password Modal */}
            {isConfirmationPasswordModalOpen && (
                <Modal title={confirmText} 
                confirmAction={() => editPassword()} 
                confirmation="Editar"
                confirmCancel={toggleConfirmationPasswordModal}
                activateCancel={true}
                activateConfirm={true}/>
            )}
            {isChangedPasswordModal && (
                <Modal title={changedText}
                confirmation="Aceptar" 
                confirmAction={() => {toggleChangedPasswordModal()}}
                activateCancel={false}
                activateConfirm={true}/>
            )}
        </div>
    );
};

export default EditUserPage;
