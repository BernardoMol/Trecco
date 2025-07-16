import './Recuperar_senha.css';
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import {AcessarAPI} from '../../acessarAPI'

function CampoDeDigitacao({ tipo, placeHolder, id, value, setValue, label }) {
    return (
        <div>
            <label htmlFor={id} className="campo__label"><strong>{label}</strong></label>
            <input
                className='login-input'
                type={tipo}
                placeholder={placeHolder}
                required
                id={id}
                value={value}
                onChange={(evento) => setValue(evento.target.value)}
            />
        </div>
    );
}

function Botao({ id, texto, funcao, tipo = "button" }) {
    return (
        <div className='container_botao'>
            <button
                type={tipo}
                className='botao'
                id={id}
                onClick={funcao}
            >
                {texto}
            </button>
        </div>
    );
}


export default function CardRecuperarSenha() {
    // console.log('🔁 CardLogin renderizado');

    const [emailUsuario, setemailUsuario] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');    
    
    async function RecuperarSenha(){
        
        console.log('Login com:', emailUsuario);
        event.preventDefault();

        setError('');
        setSuccess('');
        setLoading(true);

        if (!emailUsuario) {
            setError('Por favor, preencha seu email.');
            setLoading(false);
            return;
        }

        try{ 

            console.log("Enviando email")
            await AcessarAPI(   
                '/Email/enviar_email',
                {
                    method: 'POST', 
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                    Para: emailUsuario,
                    Assunto: "TRECCO - recuperar senha",
                    Corpo: "Olá, redefina sua senha:",
                    }),
                }
            );
        }
        catch(networkError){
            console.error('Erro de rede ao tentar CADASTRAR:', networkError);
            setError('Não foi possível conectar ao servidor. Verifique sua conexão ou tente mais tarde.');
        }
        finally {
            setLoading(false);
        }        
    }
        
    return (
        <article className='container_geral'>
            <div className='container_card_e_banner'>
                <div className="banner__bem__vindo">Recuperar Senha</div>
                <div className='container__input'>
                    <h2 className="titulo_container">Informe seu e-mail</h2>
                    <form>
                        <CampoDeDigitacao
                            tipo='text'
                            placeHolder='Email'
                            id='email'
                            value={emailUsuario}
                            setValue={setemailUsuario}
                            label='E-mail'
                        />
                        <Botao
                            id='cadastrar'
                            texto= {'Enviar Email'}
                            tipo='submit' // botão do formulário
                            funcao={RecuperarSenha}
                        />
                    </form>
                </div>
            </div>
        </article>
    );
}




