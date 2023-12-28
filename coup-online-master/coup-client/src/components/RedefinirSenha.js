import { useState, useEffect } from 'react';

import { connectSocket } from './utils/socket_utils.js';

export default function RedefinirSenha() {
    const [ novaSenha, setNovaSenha] = useState(null);
    const [ novaSenhaCopy, setNovaSenhaCopy] = useState(null);
    const [ menssagemErro, setMenssagemErro] = useState(null);
    const [ socket, setSocket] = useState(null);
    const [ data, setData ] = useState(null);
    
    // window.location.pathname.split('/')[2]
    useEffect(() => {
        if(socket) {
            socket.emit('redefinir-senha', data);
        }
    }, [ socket ]);

    function handleRedefinirSenha() {
        if(!novaSenha || !novaSenhaCopy) {
            setMenssagemErro('Por favor, preencha os campos');
            return;
        } else if(novaSenha !== novaSenhaCopy) {
            setMenssagemErro('Senhas diferentes!')
            return;
        }

        setData({
            userId: window.location.pathname.split('/')[2],
            password: novaSenha
        });

        connectSocket()
        .then( data => setSocket(data))
        .catch(err => setMenssagemErro(err));
    }

    return (
        <>
        <div className="login-container">
        <form>
            <div className="form-group">
            <label>Nova Senha:</label>
            <input
                type="password"
                onChange={(e) => setNovaSenha(e.target.value.trim())}
            />
            <br />
            <label>Digite A Senha Novamente:</label>
            <input
                type="password"
                onChange={(e) => setNovaSenhaCopy(e.target.value.trim())}
            />
            </div>
            {
                menssagemErro && <p style={{ color: 'red' }}>{menssagemErro}</p>
            }
            <div className="form-group">
            <button
                type="button"
                className="custom-button"
                onClick={handleRedefinirSenha}
            >
                Salvar
            </button>
            </div>
        </form>
        </div>
        </>
    )
}