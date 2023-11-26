import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useUser } from '../components/UserContext'; // Importa o hook useUser
import './CadastroFormStyle.css';

const LoginScreen = () => {
  const history = useHistory();
  const { loginUser } = useUser(); // Obtém a função loginUser do contexto

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');

  const handleLogin = () => {
    // Lógica de autenticação (pode ser ajustada conforme a lógica real de autenticação no seu aplicativo)
    if (email === 'a@.com' && senha === '123') {
      // Lógica bem-sucedida de login
      console.log('Login bem-sucedido!');
      setMensagemErro(''); // Limpa a mensagem de erro se estiver presente
      let nickname = "nick"
      // Salva os dados do usuário no contexto
      loginUser({ email, senha, nickname });

      

      // Redireciona para a página /play após o login bem-sucedido
      history.push('/play');
    } else {
      // Mensagem de erro para login falhado
      setMensagemErro('Credenciais inválidas. Verifique seu e-mail e senha.');
    }
  };

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
          <label>Senha:</label>
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
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginScreen;
