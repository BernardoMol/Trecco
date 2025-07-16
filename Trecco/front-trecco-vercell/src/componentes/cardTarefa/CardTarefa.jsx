import './CardTarefa.css';
import { useState } from 'react';

export default function CardTarefa({ idTarefa, numero, data, conteudo, onEditar, onDeletar }) {
    const [hover, setHover] = useState(false);
    const [editando, setEditando] = useState(false);
    const [conteudoEditado, setConteudoEditado] = useState(conteudo);

    const handleSalvar = () => {
        onEditar({ idTarefa: idTarefa, conteudoTarefa: conteudoEditado}); // número pode ser o idTarefa real
        setEditando(false);
    };

    const handleCancelar = () => {
        setConteudoEditado(conteudo);
        setEditando(false);
    };

    return (
        <div
            className="wrapper_tarefa"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className="container_tarefa">
                <div className="cabeçalho_tarefa">
                    <h2 className="numeroTarefa">Tarefa N° {numero}</h2>
                    <h4 className="dataTarefa">Criada em: {data}</h4>
                </div>

                {editando ? (
                    <div>
                        <textarea
                            value={conteudoEditado}
                            onChange={(e) => setConteudoEditado(e.target.value)}
                        />
                        <button onClick={handleSalvar}>Salvar</button>
                        <button onClick={handleCancelar}>Cancelar</button>
                    </div>
                ) : (
                    <h4 className="ConteúdoTarefa">{conteudo}</h4>
                )}
            </div>

            {hover && (
                <div className="botoes_tarefa">
                    <button className="botao_editar" onClick={() => setEditando(true)}>✏️</button>
                    <button className="botao_deletar" onClick={onDeletar}>❌</button>
                </div>
            )}
        </div>
    );
}


// import './CardTarefa.css';
// import { useState } from 'react';

// export default function CardTarefa({ numero, data, conteudo, onEditar, onDeletar }) {
//     const [hover, setHover] = useState(false);

//     return (
//         <div
//             className="wrapper_tarefa"
//             onMouseEnter={() => setHover(true)}
//             onMouseLeave={() => setHover(false)}
//         >
//             <div className="container_tarefa">
//                 <div className="cabeçalho_tarefa">
//                     <h2 className="numeroTarefa">Tarefa N° {numero}</h2>
//                     <h4 className="dataTarefa">Criada em: {data}</h4>
//                 </div>
//                 <h4 className="ConteúdoTarefa">{conteudo}</h4>
//             </div>

//             {hover && (
//                 <div className="botoes_tarefa">
//                     <button className="botao_editar" onClick={onEditar}>✏️</button>
//                     <button className="botao_deletar" onClick={onDeletar}>❌</button>
//                 </div>
//             )}
//         </div>
//     );
// }
