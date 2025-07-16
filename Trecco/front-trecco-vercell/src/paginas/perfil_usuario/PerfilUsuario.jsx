import './PerfilUsuario.css';
import { useState, useRef, useEffect } from 'react';
import avatarDefault from '../../assets/avatarDefault.png';
import { useNavigate } from 'react-router-dom';
import { AcessarAPI } from '../../acessarAPI';
import CardTarefa from '../../componentes/cardTarefa/CardTarefa';

function Sidebar({ foto, abrirExploradorDeArquivos, lidarComArquivoSelecionado, fileInputRef, dadosUsuario }) {
    const navigate = useNavigate();

    const NovaTarefa = () => navigate('/criar_tarefa');

    const Sair = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <aside className='container_sidebar'>
            <div className='container_foto' onClick={abrirExploradorDeArquivos}>
                <img src={foto} alt="Foto de perfil" className="foto_perfil" />
            </div>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={lidarComArquivoSelecionado}
                accept="image/*"
            />
            <div className='container_informações'>
                <p>{dadosUsuario?.nomeUsuario}</p>
                <p>{dadosUsuario?.emailUsuario}</p>
            </div>
            <div className='container_botao_tarefa'>
                <button className='botao' onClick={NovaTarefa}>Criar Tarefa</button>
            </div>
            <div className='container_botao_sair'>
                <button className='botao' onClick={Sair}>Sair</button>
            </div>
        </aside>
    );
}

function Mural({ dadosUsuario, onEditarTarefa, onDeletarTarefa }) {
    return (
        <div className='container_mural'>
            <div className='container_lista_de_reclamações'>
                {Array.isArray(dadosUsuario?.tarefas) && dadosUsuario.tarefas.map((tarefa, index) => (
                    <CardTarefa
                        key={tarefa.idTarefa}
                        idTarefa={tarefa.idTarefa}   // ← Aqui o ID real
                        numero={index + 1}
                        data={tarefa.dataCriacaoTarefa}
                        conteudo={tarefa.conteudoTarefa}
                        onEditar={onEditarTarefa}
                        onDeletar={() => onDeletarTarefa(tarefa)}
                    />
                ))}
            </div>
        </div>
    );
}

export default function PerfilUsuario() {
    const [profileImageUrl, setProfileImageUrl] = useState(avatarDefault);
    const fileInputRef = useRef(null);
    const authToken = localStorage.getItem('token');
    const dadosUsuarioStorage = JSON.parse(localStorage.getItem('dadosUsuario'));
    const [dadosUsuario, setDadosUsuario] = useState(dadosUsuarioStorage);

    const TrocarImagem = () => fileInputRef.current?.click();

    const HandleImagemSelecionada = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProfileImageUrl(reader.result);
            reader.readAsDataURL(file);
            uploadProfileImage(file);
        }
    };

    const uploadProfileImage = async (file) => {
        try {
            const formData = new FormData();
            formData.append('arquivoImagem', file);
            const patch = [{ op: 'replace', path: '/ImagemUsuario', value: 'Imagem Atualizada' }];
            formData.append('patchOperations', JSON.stringify(patch));

            await AcessarAPI(`/ControllerUsuarios/Usuario_Alterar/${dadosUsuario.usuarioId}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${authToken}` },
                body: formData,
            });

            await BuscarDadosUsuario();

        } catch (e) {
            console.error("Erro ao fazer upload da imagem:", e);
        }
    };

    const DeletarTarefa = async (tarefa) => {
        try {
            await AcessarAPI(`/ControllerTarefas/Tarefa_Deletar/${tarefa.idTarefa}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` },
            });

            await BuscarDadosUsuario();

        } catch (error) {
            console.error('Erro ao deletar tarefa:', error);
        }
    };

    const EditarTarefa = async (tarefaEditada) => {
        // console.log('TAREFA EDITADA')
        // console.log(tarefaEditada.idTarefa)
        try {
            await AcessarAPI(`/ControllerTarefas/Tarefa_Alterar_Toda/${tarefaEditada.idTarefa}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ConteudoTarefa: tarefaEditada.conteudoTarefa,
                    UsuarioId: dadosUsuario.usuarioId
                })
            });
            console.log('atualizei')

            await BuscarDadosUsuario();

        } catch (error) {
            console.error('Erro ao editar tarefa:', error);
        }
    };

    const BuscarDadosUsuario = async () => {
        try {
            // const resposta = await AcessarAPI(`/ControllerUsuarios/Usuario_Buscar_Id/${dadosUsuario.usuarioId}`, {
            const resposta = await AcessarAPI(`/ControllerUsuarios/Usuario_Buscar_identificador/${dadosUsuario.emailUsuario}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${authToken}` },
            });

            const usuario = Array.isArray(resposta) ? resposta[0] : resposta;

            if (!usuario) {
                console.error('Resposta inválida:', resposta);
                return;
            }

            setDadosUsuario(usuario);
            localStorage.setItem('dadosUsuario', JSON.stringify(usuario));

        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
        }
    };
        console.log(dadosUsuario)
    return (
        <div className='container_pagina'>
            <Sidebar
                foto={dadosUsuario?.imagemUsuario || profileImageUrl}
                abrirExploradorDeArquivos={TrocarImagem}
                lidarComArquivoSelecionado={HandleImagemSelecionada}
                fileInputRef={fileInputRef}
                dadosUsuario={dadosUsuario}
            />
            <Mural
                dadosUsuario={dadosUsuario}
                onEditarTarefa={EditarTarefa}
                onDeletarTarefa={DeletarTarefa}
            />
        </div>
    );
}
