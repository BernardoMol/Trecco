import './CriandoTarefa.css'
import { useState, useRef } from 'react';
import avatarDefault from '../../assets/avatarDefault.png';
import { useNavigate } from 'react-router-dom';
import {AcessarAPI} from '../../acessarAPI'

export default function CriandoTarefa() {

    const navigate = useNavigate();
    const [conteudo, setConteudo] = useState('');
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event){
        event.preventDefault();
        const dados = JSON.parse(localStorage.getItem('dadosUsuario'));
        const token = localStorage.getItem('token')
        setLoading(true);

        try {
            const resposta = await AcessarAPI('/ControllerTarefas/Tarefa_adicionar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    UsuarioId: dados.usuarioId,
                    ConteudoTarefa: conteudo,
                }),
            });

            console.log('Resposta da API:', resposta);

            if (resposta.message === 'ADICIONADO') {
                setSuccess('Tarefa criada com sucesso!');

                // ✅ Agora atualiza os dados do usuário
                const dadosAtualizados = await AcessarAPI(   
                    // `/ControllerUsuarios/Usuario_Buscar_Id/${dados.usuarioId}`,
                    `/ControllerUsuarios/Usuario_Buscar_identificador/${dados.emailUsuario}`,  // passo a ROTA da requisição
                    {   // agora passo o CONTEÚDO da requisição
                        method: 'GET', 
                        headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${ token }`
                        }
                    }
                )
                // localStorage.removeItem('dadosUsuario');
                localStorage.setItem('dadosUsuario', JSON.stringify(dadosAtualizados));
                console.log('Dados atualizados:', dadosAtualizados);
                navigate("/usuario");
            }
        } catch (networkError) {
            console.error('Erro ao criar tarefa:', networkError);
            setError('Não foi possível conectar ao servidor.');
        } finally {
            setLoading(false);
        }
    }

    const handleCancelar = () => {
        navigate("/usuario");
    };

    return(
        <div className='container_pagina_tarefa'>
            <div className="banner__Tarefa">Crie sua nova tarefa!</div>
            <div className='container_tarefa'>

            <form className="form-tarefa" onSubmit={(e) => handleSubmit(e)}>
                <textarea
                id='tarefa'
                placeholder="Descreva sua tarefa..."
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
                required
                disabled={loading}
                className='caixa-de-digitação'
                />

                <div className="botoes-form">
                    <button type="submit" disabled={loading} className="enviar-btn">
                        {loading ? 'Enviando...' : 'Enviar'}
                    </button>
                    <button type="button" onClick={handleCancelar} className="cancelar-btn" disabled={loading}>
                        Cancelar
                    </button>
                </div>
            </form>

            </div>
        </div>
    );
}