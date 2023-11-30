import React, { useState, useEffect } from 'react';
import './CadastroFormStyle.css';
import  LanguageStrings from './utils/strings';
import io from 'socket.io-client';
import axios from 'axios';

const CadastroForm = () => {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');
  const [socket, setSocket] = useState(null);
  const [cadastro, setCadastro] = useState(null);
  
  const strings = LanguageStrings()
  const baseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

  
  useEffect(() => {
    if(socket) {
      socket.emit('register', cadastro);

      socket.on('cadastrado', () =>{
        console.log('cadastrado com sucesso');
      });

      socket.on('nao-cadastrado', (res) => {
        const errorKey = res.error.constraint.split('_')[1];
        const errorMessage = `${errorKey[0].toUpperCase()}${errorKey.slice(1, -1)} ja cadastrado`;

        setMensagemErro(errorMessage);
      })
    }
  });

  const connectSocket = function() {
    axios
      .get(`${baseUrl}/createNamespace`)
      .then(function (res) {
        setSocket(io(`${baseUrl}/${res.data.namespace}`));
      })
      .catch(function (err) {
        console.log('error in creating namespace', err);
      });
  };

  const handleCadastro = () => {
    if (email && nickname && senha && email.includes('@') && email.includes('.com')) {
      connectSocket();
      setCadastro([email, senha, nickname]);
      setMensagemErro('');
    } else {
      // Define a mensagem de erro
      setMensagemErro('Preencha todos os campos corretamente.');
    }
  };

  const handleNicknameChange = (e) => {
    const newNickname = e.target.value.slice(0, 9);
    setNickname(newNickname);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div className="login-container">
      <h2>{strings.signIn}</h2>
      <form>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className="form-group">
          <label>Nickname:</label>
          <input
            type="text"
            value={nickname}
            onChange={handleNicknameChange}
          />
        </div>
        <div className="form-group">
          <label>{strings.password}:</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>
        {mensagemErro && <p style={{ color: 'red' }}>{mensagemErro}</p>}
        <div className="form-group">
          <button
            type="button"
            className="custom-button"
            onClick={handleCadastro}
          >
            {strings.registration}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CadastroForm;
