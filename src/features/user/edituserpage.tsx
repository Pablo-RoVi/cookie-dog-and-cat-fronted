import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Buttons from '../../app/components/buttons';

const EditUserPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state;

    if (!user) {
        return <div>Usuario no encontrado</div>;
    }

    const handleNavigate = () => {
        navigate('/users');
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-4">Editar Usuario</h1>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>RUT:</strong> {user.rut}</p>
            <p><strong>Nombre:</strong> {user.name}</p>
            <p><strong>Apellido:</strong> {user.last_name}</p>
            <p><strong>Rol:</strong> {user.role.role_name}</p>
            <p><strong>Nombre de Usuario:</strong> {user.nick_name}</p>
            <Buttons.FuchsiaButton text="Cancelar" onClick={handleNavigate} />
        </div>
    );
};
export default EditUserPage;
