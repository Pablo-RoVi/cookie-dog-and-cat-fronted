import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cookie from '../../app/static/images/cookie.png';
import TableModule from '../../app/components/tablemodule';
import Functions from '../../app/components/functions';
import Buttons from '../../app/components/buttons';
import Options from '../../app/components/options';
import Modal from '../../app/components/modal';
import Agent from '../../app/api/agent';

const AddUserPage = () => {
    
    const [name, setName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [rut, setRut] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState<boolean>(false);
    const [isChangedRegisterModal, setIsChangedRegisterModal] = useState<boolean>(false);

    const [isFormCompleted, setIsFormCompleted] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (role &&
            Functions.verifyName(name + " " + lastName) && 
            Functions.verifyPasswords(newPassword, confirmNewPassword) && 
            Functions.verifyRut(rut)
        ) {
            setIsFormCompleted(true);
        } else {
            setIsFormCompleted(false);
        }
    }, [name, lastName, rut, role, newPassword, confirmNewPassword]);

    const handleNavigate = () => {
        navigate('/users');
    };

    const toggleConfimartionModal = () => {
        setIsConfirmationModalOpen(!isConfirmationModalOpen);
    };

    const toggleChangedRegisterUser = () => {
        setIsChangedRegisterModal(!isChangedRegisterModal);
    };

    const registerUser = () => {
        Agent.Users.registerUser({
            rut: rut,
            name: name,
            last_name: lastName,
            password: newPassword,
            confirmPassword: confirmNewPassword,
            roleName: role,
        }).then((response) => {
            console.log("response", response);
            toggleConfimartionModal();
            toggleChangedRegisterUser();
        })
        .catch((error) => {
          console.log("error", error);});
    };

    return (
        <div className="max-h-screen bg-white flex-auto flex h-1/2">
            <div className="container mx-auto mt-6 ml-52 max-w-[30%]">
                {TableModule.title({title: "Registrar nuevo empleado"})}
                {TableModule.inputFilter({
                    label: "Nombres",
                    valueFilter: name,
                    setOnChangeFilter: setName,
                    errorInput: !Functions.verifyName(name) && name !== "",
                    errorMessage: "Nombre inválido",
                })}
                {TableModule.inputFilter({
                    label: "Apellidos",
                    valueFilter: lastName,
                    setOnChangeFilter: setLastName,
                    errorInput: !Functions.verifyName(lastName) && lastName !== "",
                    errorMessage: "Apellido inválido",
                })}
                {TableModule.inputFilter({
                    label: "RUT",
                    valueFilter: rut,
                    setOnChangeFilter: setRut,
                    errorInput: !Functions.verifyRut(rut) && rut !== "",
                    errorMessage: "RUT inválido",
                })}
                {TableModule.inputFilter({
                    label: "Nombre de usuario",
                    valueFilter: `${name.charAt(0).toUpperCase()}${lastName.split(" ")[0].charAt(0).toUpperCase()}${lastName.split(" ")[0].slice(1).toLowerCase()}`,
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
                    isPassword: true,
                })}
                {TableModule.inputFilter({
                    label: "Confirmar contraseña",
                    valueFilter: confirmNewPassword,
                    setOnChangeFilter: setConfirmNewPassword,
                    isPassword: true,
                })}
                <div className="flex items-center space-x-4">
                    {
                        isFormCompleted ? 
                            <Buttons.TurquoiseButton text="Añadir" onClick={toggleConfimartionModal} />
                            :
                            <Buttons.GrayButton text="Añadir" onClick={null} />
                    }
                    <Buttons.FuchsiaButton text="Cancelar" onClick={handleNavigate} />
                </div>
            </div>
            {isConfirmationModalOpen && (
                <Modal
                    title={`¿Estás seguro de que deseas registrar a ${name} ${lastName} de RUT ${rut} y rol ${Functions.translateRole(role)}?`}
                    confirmAction={() => registerUser()} 
                    confirmation="Editar"
                    confirmCancel={toggleConfimartionModal}
                    activateCancel={true}
                    activateConfirm={true}
                />
            )}
            <div className="container mx-auto mr-52 ml-40">
                <img src={cookie} alt="cookie" className="h-auto w-auto opacity-10" />
            </div>
        </div>
    );
};
export default AddUserPage;
