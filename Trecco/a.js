// function fizzBuzz(numero, regras){

//     for(i=1; i<=numero; i++){
//         mensagem = ''
//         regras.forEach(regra => {
//             if(i % regra.divisor === 0){
//                 mensagem += regra.palavra ;
//             }            
//         });
//         if(mensagem == '')
//         {
//             console.log(i)
//         }
//         else{
//             console.log(mensagem)
//         }
//     }

//     console.log('')
// }

// const regras = [
//     { divisor: 3, palavra: 'Fizz' },
//     { divisor: 5, palavra: 'Buzz' },
//     { divisor: 7, palavra: 'Rizz' },    
// ]

// console.log('Exibindo FizzBuzz')
// fizzBuzz(105, regras)


function glossario(texto) {

  if (texto == ''){
    return console.log("Texto vazio.");
  
  }
  else{
    
    // passando para minúsculo, tratando acento e tirando pontuação
    const palavras = texto.toLowerCase().match(/[a-zà-ú]+/g) || [];
    
    const contagemPalavras = new Map();
        for (let palavra of palavras) {
            let contagemAtual = contagemPalavras.get(palavra) || 0; // contando repetições
            contagemPalavras.set(palavra, contagemAtual + 1); // atribuindo chave como palavra e valor como contagem
    }

    // ordem alfabética
    let palavrasOrdenadas = Array.from(contagemPalavras.keys()).sort((a, b) =>
        a.localeCompare(b, 'pt-BR')
    );

    console.log("--- Glossário ---");
    for (let palavra of palavrasOrdenadas) {
        console.log(`${palavra}: ${contagemPalavras.get(palavra)}`);
    }

  }  

}


const textoDaProva = 
    `Alice estava começando a ficar muito entediada de estar sentada ao lado de sua irmã na margem do rio, 
    e não ter nada para fazer: uma vez ou duas ela havia olhado para o livro que sua irmã estava lendo, 
    mas não havia figuras ou diálogos nele, "e para que serve um livro," pensou Alice, "sem figuras ou diálogos?"`;

// const textoVazio = ``

glossario(textoDaProva);
// glossario(textoVazio);