def gossario(texto: str):
    caracteres = "abcdefghijklmnopqrstuvwxyzàáâãéêíóôõúç"
    texto_minusculo = texto.lower()
    
    texto_limpo = ""
    for char in texto_minusculo:
        if char in caracteres:
            texto_limpo += char  # Mantém o caractere se for uma letra
        else:
            texto_limpo += " "  # Troca qualquer outro caractere por um espaço

    # Agora que o texto está limpo, usamos split() para obter a lista de palavras
    palavras = texto_limpo.split()

    # 2. SUBSTITUINDO O 'Counter': Contagem manual com um dicionário
    
    contagem_palavras = {}
    for palavra in palavras:
        # Pega a contagem atual (ou 0 se a palavra for nova) e adiciona 1
        contagem_palavras[palavra] = contagem_palavras.get(palavra, 0) + 1

    # 3. Ordenação e exibição (esta parte não precisa de imports)
    
    # Pega as palavras únicas (as chaves do dicionário) e as ordena
    palavras_ordenadas = sorted(contagem_palavras.keys())
    
    print("--- Glossário do Texto (Sem Imports) ---")
    for palavra in palavras_ordenadas:
        print(f"{palavra}: {contagem_palavras[palavra]}")


# --- Exemplo de Uso ---
texto_exemplo = """
Alice estava começando a ficar muito entediada de estar sentada ao lado de sua irmã na margem do rio, e não ter nada para fazer: uma vez ou duas ela havia olhado para o livro que sua irmã estava lendo, mas não havia figuras ou diálogos nele, "e para que serve um livro," pensou Alice, "sem figuras ou diálogos?"
"""

gossario(texto_exemplo)