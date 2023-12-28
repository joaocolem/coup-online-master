import { useEffect, useState }from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import { connectSocket } from './utils/socket_utils.js';

function RecuperarSenha() {
    const [email, setEmail] = useState(null);
    const [currentlEmail, setCurrentEmail] = useState(null);
    const [mensagemErro, setMenssagemErro] = useState(null);
    const [socket, setSocket] = useState(null);
    const [recaptcha, setRecaptcha] = useState(null);
    const [emailSent, setEmailSent] = useState(false);

    function handleRecuperarSenha() {
        if(email === currentlEmail) return;

        if(!recaptcha) return;

        if(!email || !email.includes('.com')) {
            setMenssagemErro('Insira um email valido!');
            return;
        }

        connectSocket()
        .then( data => setSocket(data))
        .catch(err => setMenssagemErro(err));
        
        setCurrentEmail(email);
        setEmailSent(true);
    }

    useEffect(() => {
        if(socket) {
            socket.emit('recuperar-senha', email);
            setSocket(null);
        }
    }, [socket])

    return (
        <>
            <div className="login-container">
            <h2>Recuperar Senha</h2>
            { emailSent ? <p style={{ color: 'green' }}>Email enviado ! Check a sua caixa de email.</p> : <p>Enviaremos um email de recuperação para o email abaixo:</p> }
            { !emailSent
                &&
                <form>
                    <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        onChange={(e) => setEmail(e.target.value.trim())}
                    />
                    </div>
                    {
                        mensagemErro && <p style={{ color: 'red' }}>{mensagemErro}</p>
                    }
                    <div className="form-group">
                    <ReCAPTCHA
                        sitekey={process.env.REACT_APP_RECAPTCHA_SERVER_KEY}
                        onChange={(res)=> setRecaptcha(res)}
                    />
                    <button
                        type="button"
                        className="custom-button"
                        onClick={handleRecuperarSenha}
                    >
                        Enviar
                    </button>
                    </div>
                </form> 
            }
            </div>
        </>
    );
}

export default RecuperarSenha; 