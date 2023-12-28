import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useUser } from '../components/UserContext'; // Importa o hook useUser
import ReCAPTCHA from 'react-google-recaptcha';

import './CadastroFormStyle.css';
import  LanguageStrings from './utils/strings';
import { connectSocket } from './utils/socket_utils.js';

const LoginScreen = () => {
  const history = useHistory();
  const { loginUser } = useUser(); // Obtém a função loginUser do contexto
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState({});
  const [recaptcha, setRecaptcha] = useState(null);
  const strings = LanguageStrings();

  useEffect(() => {
    if(socket) {
      socket.emit('request-login', user);

      socket.on('login-ok', (dbData) => {
        setMensagemSucesso('Logado com sucesso!')
        loginUser(dbData);
        history.push('/play');
      });

      socket.on('login-not-ok', () => {
        setMensagemErro('Login invalido!');
      });

      socket.on('no-login', () => {
        setMensagemErro('Nao existe nenhum login com essas informacoes!');
      });

    }

    setSocket(null);
  }, [socket]);

  const handleLogin = () => {
    if(!recaptcha) {
      setMensagemErro("Complete a verificacao!");
      return;
    }
    
    connectSocket().then(data => setSocket(data));
    setUser({email, senha});
  };

  const handleReCaptcha = function(response) {
    setRecaptcha(response);
  }

  const handleRecuperarSenha = function() {
    history.push('/recuperarSenha');
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>{strings.password}</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>
        {
          mensagemSucesso ? <p style={{ color: 'green' }}>{mensagemSucesso}</p> : mensagemErro && <p style={{ color: 'red' }}>{mensagemErro}</p>
        }
          <ReCAPTCHA
            sitekey={process.env.REACT_APP_RECAPTCHA_SERVER_KEY}
            onChange={handleReCaptcha}
          />
        <div className="form-group">
          <button
            type="button"
            className="custom-button"
            onClick={handleLogin}
          >
            Login
          </button>
          <div className="forgot-password">
            <a href="" onClick={handleRecuperarSenha}>Forgot Password?</a>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginScreen;
