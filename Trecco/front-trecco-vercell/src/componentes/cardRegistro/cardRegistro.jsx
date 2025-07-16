import './cardRegistro.css';
import { Link } from 'react-router-dom';
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


export default function CardRegistro() {
    // console.log('🔁 CardLogin renderizado');
    const navigate = useNavigate();

    const [identificadorUsuario, setIdentificadorUsuario] = useState('');
    const [emailUsuario, setemailUsuario] = useState('');
    const [senhaUsuario, setSenhaUsuario] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    
    
    
    async function Cadastrar(){
        
        console.log('Login com:', identificadorUsuario, emailUsuario,senhaUsuario);
        event.preventDefault();

        setError('');
        setSuccess('');
        setLoading(true);

        if (!identificadorUsuario || !emailUsuario || !senhaUsuario ) {
            setError('Por favor, preencha seu email/nome de usuário e a senha.');
            setLoading(false);
            return;
        }

        try{
            // Agora é um endpoint que usa um FORMULÁRIO
            // Crio o formulario e coloco os campos nele
            const formData = new FormData();
            formData.append('NomeUsuario', identificadorUsuario);
            formData.append('EmailUsuario', emailUsuario);
            formData.append('SenhaUsuario', senhaUsuario);
            // formData.append('ArquivoImagem', file); // file = um File do input type="file"

            const resposta = await AcessarAPI(   
                // '/Auth/login', // passo a ROTA da requisição
                '/ControllerUsuarios/Usuario_adicionar',
                {   // agora passo o CONTEÚDO da requisição
                    method: 'POST', 
                    body: formData // sem headers manualmente
                }
            );
            if (resposta) {
                localStorage.setItem('dadosUsuario', JSON.stringify(resposta));
                console.log('DADOS CADASTRADO:')
                console.log(localStorage.getItem('dadosUsuario'))
                console.log('Respsota Cadastro:')
                console.log(resposta)

                await AcessarAPI(   
                    '/Email/enviar_email',
                    {
                        method: 'POST', 
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            Para: emailUsuario,
                            Assunto: "Bem vindo ao Trecco",
                            Corpo: "Bem vindo ao Trecco, obrigado por se cadastrar!!!",
                        }),
                    }
                );

                navigate('/usuario');
            }
            // AO CADASTRAR MEU ENDPOINT JA RETORNA OS DADOS DO USUARIO, ENTAO NAO PRECISOD DAR GET INDIVIDUAL
            // O QUE É BOM, PORQUE ELE PRECISA DE AUTORIZAÇÃO
            // if (resposta) {
            //     console.log('Respsota Cadastro:')
            //     console.log(resposta)

            //     const dadosUsuario = await AcessarAPI(   
            //     `/ControllerUsuarios/Usuario_Buscar_identificador/${identificadorUsuario}`,  // passo a ROTA da requisição
            //         {   // agora passo o CONTEÚDO da requisição
            //             method: 'GET', 
            //             headers: {
            //             'Content-Type': 'application/json',
            //             'Authorization': `Bearer ${localStorage.getItem('token')}`
            //             }
            //         }
            //     )

            //     localStorage.setItem('dadosUsuario', JSON.stringify(dadosUsuario));
            //     console.log('DADOS CADASTRADO:')
            //     console.log(localStorage.getItem('dadosUsuario'))
            // }

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
        <article>
            <div className='container_card'>
                <div className="banner__bem__vindo">Se organize com o Trecco!</div>
                <div className='container__input'>
                    <h2 className="titulo_container">Cadastre-se!</h2>
                    <form>
                        <CampoDeDigitacao
                            tipo='text'
                            placeHolder='Nome'
                            id='nome'
                            value={identificadorUsuario}
                            setValue={setIdentificadorUsuario}
                            label='Nome'
                        />
                        <CampoDeDigitacao
                            tipo='text'
                            placeHolder='Email'
                            id='email'
                            value={emailUsuario}
                            setValue={setemailUsuario}
                            label='E-mail'
                        />
                        <CampoDeDigitacao
                            tipo='password'
                            placeHolder='Senha'
                            id='password'
                            value={senhaUsuario}
                            setValue={setSenhaUsuario}
                            label='Senha'
                        />
                        <Botao
                            id='cadastrar'
                            texto= {'Cadastrar'}
                            tipo='submit' // botão do formulário
                            funcao={Cadastrar}
                        />
                    </form>
                </div>
            </div>
        </article>
    );
}
