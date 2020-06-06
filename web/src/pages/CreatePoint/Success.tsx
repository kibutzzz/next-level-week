import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';

;

const Success: React.FC = () => {
  return (
    <div className="success-container">
        <FiCheckCircle color="34CB79" size={64}/>
        <h1>Cadastro finalizado com sucesso!</h1>
    </div>
  );
}

export default Success;