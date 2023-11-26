import React, { useState } from 'react';
import './CadastroFormStyle.css';

const UserProfile = () => {
  const [email, setEmail] = useState('usuario@example.com');
  const [nickname, setNickname] = useState('Usuario123');
  const [quantidadePartidas, setQuantidadePartidas] = useState(20);
  const [quantidadeVitorias, setQuantidadeVitorias] = useState(15);

  return (
    <div className="user-profile-container">
      <h2>Perfil do Usuário</h2>
      <div className="profile-info">
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Nickname:</strong> {nickname}</p>
        <p><strong>Partidas Jogadas:</strong> {quantidadePartidas}</p>
        <p><strong>Vitórias:</strong> {quantidadeVitorias}</p>
      </div>
    </div>
  );
};

export default UserProfile;
