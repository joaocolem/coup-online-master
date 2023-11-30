import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import './CadastroFormStyle.css';
import  LanguageStrings from './utils/strings';
import { connectSocket } from './utils/socket_utils.js';

const CadastroForm = () => {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [socket, setSocket] = useState(null);
  const [cadastro, setCadastro] = useState(null);
  
  const strings = LanguageStrings()
  const history = useHistory();

  useEffect(() => {
    if(socket) {
      socket.emit('register', cadastro);

      socket.on('cadastrado', () =>{
        const message = "Cadastrado Com Sucesso!";

        setMensagemSucesso(message);
        console.log(message);

        history.push('/login');
      });

      socket.on('nao-cadastrado', (res) => {
        const errorKey = res.error.constraint.split('_')[1];
        const errorMessage = `${errorKey[0].toUpperCase()}${errorKey.slice(1, errorKey.length)} ja cadastrado`;

        setMensagemErro(errorMessage);
      })

      setSocket(null);
    }
  }, [socket, cadastro]);


  const handleCadastro = () => {
    if (email && nickname && senha && email.includes('@') && email.includes('.com')) {
      connectSocket().then(data => setSocket(data));
      setCadastro([email, senha, nickname]);
      setMensagemErro('');
    } else {
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
        {
          mensagemSucesso ? <p style={{ color: 'green' }}>{mensagemSucesso}</p> : mensagemErro && <p style={{ color: 'red' }}>{mensagemErro}</p>
        }
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
