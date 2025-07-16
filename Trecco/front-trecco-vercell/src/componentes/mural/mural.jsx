
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
        
    return (

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
    );
}
