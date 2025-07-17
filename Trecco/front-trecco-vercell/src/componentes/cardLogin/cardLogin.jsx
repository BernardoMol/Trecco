import './cardLogin.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import { AcessarAPI } from '../../acessarAPI';

function CampoDeDigitacao({ tipo, placeHolder, id, value, setValue }) {
    return (
        <input
            className='login-input'
            type={tipo}
            placeholder={placeHolder}
            required
            id={id}
            value={value}
            onChange={(evento) => setValue(evento.target.value)}
        />
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

export default function CardLogin() {
    const navigate = useNavigate();

    const [identificadorUsuario, setIdentificadorUsuario] = useState('');
    const [senhaUsuario, setSenhaUsuario] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function BuscarMeuPerfil() {
        try {
            const resposta = await AcessarAPI(
                '/ControllerUsuarios/Usuario_Buscar_MeuPerfil',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            console.log('Perfil carregado:', resposta);
            return resposta;

        } catch (error) {
            console.error('Erro ao buscar perfil:', error);
            throw error;
        }
    }

    async function EfetuarLogin(event) {
        event.preventDefault();

        setError('');
        setLoading(true);

        if (!identificadorUsuario || !senhaUsuario) {
            setError('Por favor, preencha seu email/nome de usuário e a senha.');
            setLoading(false);
            return;
        }

        try {
            const resposta = await AcessarAPI(
                '/Auth/login',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        Email: identificadorUsuario,
                        Senha: senhaUsuario,
                    })
                }
            );

            if (resposta?.token) {
                localStorage.setItem('token', resposta.token);
                console.log('Token armazenado:', resposta.token);

                const dadosUsuario = await BuscarMeuPerfil();
                localStorage.setItem('dadosUsuario', JSON.stringify(dadosUsuario));
                console.log('Dados do usuário:', dadosUsuario);

                navigate('/usuario');
            } else {
                setError('Credenciais inválidas. Tente novamente.');
            }

        } catch (networkError) {
            console.error('Erro ao tentar fazer login:', networkError);
            setError('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    }

    function Registrar() {
        navigate('/registrar');
    }

    return (
        <article>
            <div className='container_card'>
                <div className="banner__bem__vindo">Bem Vindo ao Trecco!</div>
                <div className='container__input'>
                    <h2 className="titulo_container">Faça seu login!</h2>
                    <form onSubmit={EfetuarLogin}>
                        <CampoDeDigitacao
                            tipo='text'
                            placeHolder='Digite seu Nome ou E-mail'
                            id='user'
                            value={identificadorUsuario}
                            setValue={setIdentificadorUsuario}
                        />
                        <CampoDeDigitacao
                            tipo='password'
                            placeHolder='Digite sua senha'
                            id='password'
                            value={senhaUsuario}
                            setValue={setSenhaUsuario}
                        />
                        <Botao
                            id='login'
                            texto={loading ? 'Entrando...' : 'Entrar'}
                            tipo='submit'
                        />
                        <Botao
                            id='register'
                            texto='Registrar'
                            funcao={Registrar}
                            tipo='button'
                        />
                        {error && <p className="erro">{error}</p>}
                        <div>
                            <Link to='/recuperar_senha' className="login-link">
                                <p className="login-forgot">Esqueceu sua senha?</p>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </article>
    );
}


// import './cardLogin.css';
// import { Link } from 'react-router-dom';
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";

// import {AcessarAPI} from '../../acessarAPI'

// function CampoDeDigitacao({ tipo, placeHolder, id, value, setValue }) {
//     return (
//         <input
//             className='login-input'
//             type={tipo}
//             placeholder={placeHolder}
//             required
//             id={id}
//             value={value}
//             onChange={(evento) => setValue(evento.target.value)}
//         />
//     );
// }

// function Botao({ id, texto, funcao, tipo = "button" }) {
//     return (
//         <div className='container_botao'>
//             <button
//                 type={tipo}
//                 className='botao'
//                 id={id}
//                 onClick={funcao}
//             >
//                 {texto}
//             </button>
//         </div>
//     );
// }


// export default function CardLogin() {
//     // console.log('🔁 CardLogin renderizado');
//     const navigate = useNavigate();

//     const [identificadorUsuario, setIdentificadorUsuario] = useState('');
//     const [senhaUsuario, setSenhaUsuario] = useState('');
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [success, setSuccess] = useState('');

    
    
    
//     async function EfetuarLogin(){
        
//         console.log('Login com:', identificadorUsuario, senhaUsuario);
//         event.preventDefault();

//         setError('');
//         setSuccess('');
//         setLoading(true);

//         if (!identificadorUsuario || !senhaUsuario) {
//             setError('Por favor, preencha seu email/nome de usuário e a senha.');
//             setLoading(false);
//             return;
//         }

//         try{
//             // Tento logae e pego o token
//             const resposta = await AcessarAPI(   
//                 '/Auth/login', // passo a ROTA da requisição
//                 {   // agora passo o CONTEÚDO da requisição
//                     method: 'POST', 
//                     headers: {
//                     'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({
//                         Email: identificadorUsuario,
//                         Senha: senhaUsuario,
//                     }),
//                 }

//             );
//             // dando certo, guardo o token e pego os dados do usuario
//             if (resposta) {
//                 localStorage.setItem('token', resposta.token);
//                 console.log('Token')
//                 console.log(localStorage.getItem('token'))

//                 const dadosUsuario = await AcessarAPI(   
//                 `/ControllerUsuarios/Usuario_Buscar_identificador/${identificadorUsuario}`,  // passo a ROTA da requisição
//                     {   // agora passo o CONTEÚDO da requisição
//                         method: 'GET', 
//                         headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `Bearer ${localStorage.getItem('token')}`
//                         }
//                     }
//                 )

//                 localStorage.setItem('dadosUsuario', JSON.stringify(dadosUsuario));
//                 console.log('Resposta')
//                 console.log(localStorage.getItem('dadosUsuario'))
//                 navigate('/usuario');
//             }


//         }
//         catch(networkError){
//             console.error('Erro de rede ao tentar fazer login:', networkError);
//             setError('Não foi possível conectar ao servidor. Verifique sua conexão ou tente mais tarde.');
//         }
//         finally {
//             setLoading(false);
//         }        
//     }
        

//     function Registrar() {
//         navigate('/registrar');
//     }


//     return (
//         <article>
//             <div className='container_card'>
//                 <div className="banner__bem__vindo">Bem Vindo ao Trecco!</div>
//                 <div className='container__input'>
//                     <h2 className="titulo_container">Faça seu login!</h2>
//                     <form>
//                         <CampoDeDigitacao
//                             tipo='text'
//                             placeHolder='Digite seu Nome ou E-mail'
//                             id='user'
//                             value={identificadorUsuario}
//                             setValue={setIdentificadorUsuario}
//                         />
//                         <CampoDeDigitacao
//                             tipo='password'
//                             placeHolder='Digite sua senha'
//                             id='password'
//                             value={senhaUsuario}
//                             setValue={setSenhaUsuario}
//                         />
//                         <Botao
//                             id='login'
//                             texto= {loading ? 'Entrando...' : 'Entrar'}
//                             tipo='submit' // botão do formulário
//                             funcao={EfetuarLogin}
//                         />
//                         <Botao
//                             id='register'
//                             texto='Registrar'
//                             funcao={Registrar}
//                             tipo='button' // botão fora do escopo do form
//                         />
//                         <div>
//                             <Link to='/recuperar_senha' className="login-link">
//                                 <p className="login-forgot">
//                                     Esqueceu sua senha?
//                                 </p>
//                             </Link>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </article>
//     );
// }
