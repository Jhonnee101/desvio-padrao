# Especificação para Criação de Questões

## Visão Geral

Este documento define o formato aceito para questões no sistema de Questões Juridicas. Qualquer IA deve seguir esta especificação ao gerar ou organizar questões.

---

## Formato JSON Válido

```json
{
  "id": "string",
  "materia": "string",
  "assunto": "string",
  "enunciado": "string",
  "alternativas": ["string", "string", "string", "string", "string"],
  "indiceCorreto": 0,
  "explicacao": "string"
}
```

**Exemplo completo:**

```json
{
  "id": "q001",
  "materia": "Direito Penal Parte Geral",
  "assunto": "3. Conceito de crime.",
  "enunciado": "Tício, querendo matar Caio, atira contra o que pensa ser o seu inimigo deitado em uma rede. Contudo, o que estava na rede era, na verdade, um robusto espantalho colocado ali por Caio, que havia percebido a intenção de Tício. Diante do Código Penal Brasileiro, a conduta de Tício configura:",
  "alternativas": [
    "Homicídio tentado, pois houve intenção (animus necandi) e início de execução.",
    "Crime impossível, pela impropriedade absoluta do objeto.",
    "Crime impossível, pela ineficácia absoluta do meio empregado.",
    "Erro de tipo essencial vencível, respondendo Tício por homicídio culposo.",
    "Fato atípico, pois não houve perigo real à vida de qualquer pessoa."
  ],
  "indiceCorreto": 1,
  "explicacao": "Trata-se de crime impossível (art. 17 do CP). Como a intenção era matar um ser humano, mas o disparo foi efetuado contra um espantalho (objeto inanimado), há impropriedade absoluta do objeto. Não se pode matar o que não tem vida."
}
```

---

## Definição dos Campos

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | string | Não | Identificador único. Se vazio, será gerado automaticamente |
| `materia` | string | **Sim** | Nome da matéria conforme lista permitida |
| `assunto` | string | **Sim** | Subtópico da matéria |
| `enunciado` | string | **Sim** | Texto completo da pergunta |
| `alternativas` | array[5 strings] | **Sim** | Exatamente 5 alternativas (A, B, C, D, E) |
| `indiceCorreto` | number (0-4) | **Sim** | Índice da resposta correta: 0=A, 1=B, 2=C, 3=D, 4=E |
| `explicacao` | string | **Sim** | Explicação técnica do fundamento |

---

## Validações Obrigatórias

1. **materia** deve ser uma das matériasas permitidas listadas abaixo
2. **alternativas** deve ter exatamente 5 itens
3. **indiceCorreto** deve ser um número entre 0 e 4
4. Todos os campos obrigatória devem estar preenchidos (não vazios)
5. O arquivo deve ser um array de objetos: `[ {questao1}, {questao2}, ... ]`

---

## Matérias Permitidas

```
Direito Constitucional
Direito Administrativo
Direito Civil
Processual Civil
Direito Penal Parte Geral
Direito Penal Parte Especial
Direito Penal Legislação Extravagante
Direito Processual Penal
Direito Tributário
Direito Financeiro
Direito do Consumidor
Direito Ambiental
Direitos Humanos
Direito da Criança e do Adolescente
Direito Urbanístico
Direito Eleitoral
Direito Empresarial
Direitos Difusos e Coletivos
Direito Previdenciário
Direito do Trabalho
Direito Processual do Trabalho
Direito e Formação Humanística
Direito Econômico
Direito Internacional Público
Direito Internacional Privado
Criminologia
Direito Institucional do Ministério Público
Direito Institucional da Magistratura
Direito Institucional da Defensoria Pública
Direito Institucional da Advocacia Pública
Medicina Legal
Direito Agrário
```

---

## Formato do Arquivo de Saída

O arquivo final deve ser `questions.json` e conter um array JSON:

```json
[
  { "questao1" },
  { "questao2" },
  { "questao3" }
]
```

---

## Checklist de Validação

Antes de salvar, verifique:
- [ ] `materia` está na lista de permitidas
- [ ] `alternativas` tem exatamente 5 item
- [ ] `indiceCorreto` está entre 0 e 4
- [ ] Nenhum campo obrigatório está vazio
- [ ] JSON é válido (use um validador)
- [ ] Arquivo está no formato array `[...]`