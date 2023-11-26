import React, { useState } from 'react';
import './CadastroFormStyle.css';
import  LanguageStrings from './utils/strings';


const CadastroForm = () => {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');
  const strings = LanguageStrings()
  
  const handleCadastro = () => {
    // Verifica se todos os campos estão preenchidos e o email tem o formato correto
    if (email && nickname && senha && email.includes('@') && email.includes('.com')) {
      // Lógica para lidar com os dados do formulário (por exemplo, enviar para o servidor)
      console.log('Email:', email);
      console.log('Nickname:', nickname);
      console.log('Senha:', senha);
      setMensagemErro(''); // Limpa a mensagem de erro se estiver presente
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
