# Guia de Criação de Questões — Desvio Padrão

## Formato Padrão (JSON)

Cada questão deve seguir exatamente esta estrutura:

```json
{
  "id": "NOVO_ID",
  "materia": "Nome Exato da Matéria",
  "assunto": "Número e Nome do Tópico",
  "enunciado": "Texto completo do enunciado da questão, descrevendo o caso ou situação jurídica.",
  "alternativas": [
    "A) Texto da primeira alternativa.",
    "B) Texto da segunda alternativa.",
    "C) Texto da terceira alternativa.",
    "D) Texto da quarta alternativa.",
    "E) Texto da quinta alternativa."
  ],
  "indiceCorreto": 0,
  "explicacao": "A) Correta. Explicação detalhada de por que esta alternativa está correta, com fundamentação legal/doutrinária/jurisprudencial."
}
```

### Regras:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `string` | Identificador único. Usar números sequenciais como string (ex.: `"202"`). |
| `materia` | `string` | Nome exato da matéria (conforme lista abaixo). **Acentos e caracteres especiais devem ser preservados.** |
| `assunto` | `string` | Número e nome do tópico conforme listado abaixo (ex.: `"14. Nulidades"`). Deve corresponder exatamente ao subtópico desejado. |
| `enunciado` | `string` | Enunciado completo da questão. Deve conter um caso concreto ou situação hipotética, seguido do comando (`assinale a alternativa correta` / `assinale a alternativa incorreta`). |
| `alternativas` | `array de strings` | Sempre **5 alternativas** (A a E). Cada string deve começar com `A)`, `B)`, `C)`, `D)` ou `E)`. |
| `indiceCorreto` | `number` | Índice da alternativa correta (0 = A, 1 = B, 2 = C, 3 = D, 4 = E). |
| `explicacao` | `string` | Explicação completa. Deve começar repetindo a alternativa correta (ex.: `"A) Correta."` ou `"E) Incorreta."`), seguida da fundamentação. |

### Observações:

- O JSON deve ser **válido**: usar aspas duplas `"..."` em todas as strings, não usar aspas simples.
- Se o texto conter aspas duplas, escapá-las com `\"`.
- O arquivo final deve ser um **array** de questões: `[ { ... }, { ... } ]`.
- O campo `assunto` não é obrigatório, mas é altamente recomendado para filtrar questões por tópico.

---

## Matérias e Tópicos

### 1. Direito Constitucional

1. (Neo)Constitucionalismo
2. Constituição: Conceito, Constitucionalização Simbólica, Classificações, Elementos e Histórico
3. Hermenêutica: Mutação X reforma. Regras x princípios. "derrotabilidade". Postulados Normativos. Criação judicial do direito. Estrutura da Constituição
4. Poder Constituinte
5. Eficácia e Aplicabilidade das Normas Constitucionais
6. Controle de Constitucionalidade
7. Princípios Fundamentais
8. Direitos e Garantias Fundamentais
9. Direitos Sociais
10. Nacionalidade
11. Direitos Políticos e Partidos Políticos
12. Divisão Espacial do Poder — Organização do Estado
13. Separação de "Poderes"— Teoria Geral
14. Poder Legislativo
15. Poder Executivo
16. Poder Judiciário
17. Funções Essenciais à Justiça
18. Defesa do Estado e das Instituições Democráticas
19. Ordem Social
20. Ordem econômica e financeira

### 2. Direito Administrativo

1. Gênese e Evolução do Direito Administrativo
2. Fontes, Interpretação e Integração do Direito Administrativo
3. Princípios do Direito Administrativo
4. Organização Administrativa: Administração Pública, Concessões e Terceiro Setor
5. Órgãos Públicos
6. Autarquias
7. Agências Reguladoras
8. Empresas Estatais: Empresas Públicas e Sociedades de Economia Mista
9. Fundações Estatais
10. Consórcios Públicos
11. Concessão e Permissão de Serviços Públicos
12. Terceiro Setor
13. Serviços Públicos
14. Poderes Administrativos
15. Ato Administrativo
16. Processo Administrativo
17. Licitação
18. Contratos Administrativos
19. Intervenção do Estado na Ordem Econômica
20. Intervenção do Estado na Propriedade
21. Desapropriação
22. Bens Públicos
23. Agentes Públicos
24. Responsabilidade Civil do Estado
25. Controle da Administração Pública

### 3. Direito Civil

1. LINDB
2. Pessoas Naturais e Jurídicas
3. Bens
4. Fatos, Atos e Negócios Jurídicos
5. Prescrição e Decadência
6. Teoria Geral das Obrigações
7. Contratos em Geral
8. Responsabilidade Civil
9. Direito das Coisas (Real)
10. Direito de Família
11. Direito das Sucessões

### 4. Processual Civil

1. INTRODUÇÃO AO DIREITO PROCESSUAL CIVIL E NORMAS FUNDAMENTAIS DO PROCESSO CIVIL
2. JURISDIÇÃO E COMPETÊNCIA
3. AÇÃO
4. PROCESSO
5. SUJEITOS PROCESSUAIS
6. LITISCONSÓRCIO
7. INTERVENÇÃO DE TERCEIROS
8. TUTELA PROVISÓRIA
9. ATOS E NEGÓCIOS JURÍDICOS PROCESSUAIS
10. PROCESSO DE CONHECIMENTO
11. PROVAS
12. SENTENÇA
13. LIQUIDAÇÃO DE SENTENÇA
14. PROCESSO DE EXECUÇÃO
15. DIVERSAS ESPÉCIES DE EXECUÇÃO
16. PROCEDIMENTOS ESPECIAIS DE JURISDIÇÃO CONTENCIOSA E VOLUNTÁRIA
17. PROCESSOS NOS TRIBUNAIS E MEIOS DE IMPUGNAÇÃO DAS DECISÕES JUDICIAIS
18. PEDIDO DE SUSPENSÃO DE SEGURANÇA
19. PROCESSO COLETIVO
20. JUIZADOS ESPECIAIS

### 5. Direito Penal Parte Geral

1. Direito penal. Conceito de direito penal. Denominações específicas do direito penal. Funções do direito penal. Bem jurídico-penal e constituição. Garantismo penal. Ciências criminais (noção conjunta do direito penal). Modelos de política criminal. Princípios penais e político-criminais.
2. Norma penal.
3. Conceito de crime.
4. Conduta.
5. Resultado.
6. Nexo de causalidade.
7. Tipicidade e Tipo penal.
8. Ilicitude (Antijuridicidade).
9. Culpabilidade.
10. Concurso de pessoas.
11. Sanção penal.
12. Condições objetivas de punibilidade e condições de procedibilidade. Escusas absolutórias.
13. Extinção da punibilidade.

### 6. Direito Penal Parte Especial

1. Crimes contra a pessoa
2. Crimes contra o patrimônio
3. Crimes contra a propriedade imaterial
4. Crimes contra a organização do trabalho
5. Crimes contra o sentimento religioso e contra o respeito aos mortos
6. Crimes contra a dignidade sexual
7. Crimes contra a família
8. Crimes contra a incolumidade pública
9. Crimes contra a paz pública
10. Crimes contra a fé pública
11. Crimes contra a administração pública
12. Crimes contra o estado democrático de direito

### 7. Direito Penal Legislação Extravagante

1. Lei n.º 8.072/1990 (Crimes Hediondos)
2. Decreto-Lei n.º 3.688/1941 (Contravenções Penais)
3. Lei n.º 11.343/2006 (Entorpecentes)
4. Lei n.º 10.826/2003 (Estatuto do Desarmamento)
5. Lei n.º 9.296/1996 (Interceptação Telefônica)
6. Lei n.º 9.455/1997 (Tortura)
7. Lei n.º 12.850/2013 (Lei do Crime Organizado)
8. Lei n.º 9.503/1997 (Código de Trânsito Brasileiro)
9. Lei n.º 11.340/2006 (Maria da Penha)
10. Lei n.º 13.869/2019 (Abuso de Autoridade)
11. Lei n.º 9.613/1998 (Lavagem de Dinheiro)
12. Estatuto da Criança e do Adolescente
13. Lei n.º 13.260/2016 (Terrorismo)
14. Lei n.º 8.078/1990 (Crimes contra o Consumidor)
15. Lei n.º 2.889/1956 (Crime de Genocídio)
16. Lei n.º 8.137/1990 (Crimes contra a Ordem Tributária, Econômica e as Relações de Consumo)
17. Lei n.º 9.605/1998 (Crimes Ambientais)
18. Lei n.º 7.492/1986 (Sistema Financeiro)
19. Lei n.º 7.716/1989 (Crimes Resultantes de Preconceito de Raça ou de Cor)

### 8. Direito Processual Penal

1. Introdução ao processo penal. Sistemas processuais. Princípios processuais penais e constitucionais.
2. Lei processual penal.
3. Sujeitos do processo. Juiz das garantias.
4. Comunicação dos atos processuais.
5. Inquérito policial.
6. Ação penal.
7. Ação civil.
8. Questões e processos incidentes.
9. Prova penal.
10. Jurisdição e competência.
11. Júri.
12. Procedimentos comum e especial.
13. Prisão processual.
14. Nulidades.
15. Sentença penal.
16. Recursos criminais.
17. Meios autônomos de impugnação de decisões.

### 9. Direito Tributário

1. Noções Introdutórias: Fontes Formais Primárias. Conceitos fundamentais: Tributo. Competência tributária. Tributos vinculados e não vinculados. Tributos destinados e não destinados. Tributos restituíveis e tributos não restituíveis. Impostos. Taxas. Imunidades tributárias. Obrigação tributária e crédito tributário. Fato gerador. Contribuinte e responsável. Cadeia produtiva, tributação monofásica e tributação plurifásica
2. Fontes do Direito Tributário
3. Sistema Tributário e Discriminação de Competências
4. Princípios do Direito Tributário
5. Imunidades Tributárias
6. Legislação Tributária
7. Obrigação Tributária
8. Crédito Tributário
9. Garantias e Privilégios do Crédito Tributário
10. Administração Tributária
11. Impostos de Competência da União Federal
12. Impostos de Competência dos Estados e do Distrito Federal
13. Impostos de Competência dos Municípios e do Distrito Federal
14. Imposto sobre Bens e Serviços (IBS): Competência Compartilhada entre as Entidades Federativas
15. Contribuições Especiais
16. Repartição das Receitas Tributárias
17. Processo Administrativo Fiscal Federal
18. Simples Nacional
19. Processo Judicial Fiscal e Ações Antiexacionais
20. Reforma Tributária: O que Mudou
21. Reforma Tributária: (In)existência de Violação ao Princípio Federativo

### 10. Direito Financeiro

1. A Atividade Financeira do Estado e o Direito Financeiro
2. Orçamento Público
3. Teoria dos Ingressos Públicos – Receita Pública
4. Despesas Públicas
5. Crédito Público
6. Controle da Atividade Financeira do Estado

### 11. Direito do Consumidor

1. Introdução e contextualização do CDC
2. Princípios
3. Relação jurídica de consumo
4. Responsabilidade civil do fornecedor
5. Proteção contratual e cláusulas abusivas
6. Oferta e publicidade no CDC
7. Banco de dados e cadastro de consumidores
8. Desconsideração da personalidade jurídica
9. Aspectos processuais

### 12. Direito Ambiental

1. Meio Ambiente e Direito Ambiental.
2. Princípios do Direito Ambiental.
3. Constituição Federal e Meio Ambiente.
4. Competência Ambiental Comum na Lei Complementar 140/2011
5. Sistema Nacional do Meio Ambiente.
6. Instrumentos da Política Nacional do Meio Ambiente: Novos Procedimentos Administrativos. Zoneamento Ambiental. Zoneamento Ambiental e Zonas Industriais. Estudo Prévio de Impacto Ambiental. Licenciamento Ambiental. Auditoria Ambiental. Das Infrações Administrativas Ambientais. Financiamento e Meio Ambiente
7. Responsabilidade Civil, Reparação do Dano Ecológico e Meios Processuais para a Defesa Ambiental
8. Recursos Hídricos e Segurança de Barragens
9. Aspectos Jurídicos da Poluição: Conceito de "Poluição". Poluição Atmosférica – Aspectos Penais. Poluição Atmosférica – Aspectos Administrativos e Civis. Poluição por Resíduos Sólidos. Nova Lei de Diretrizes Nacionais para o Saneamento Básico. Poluição por Resíduos e Rejeitos Perigosos. Proteção do Solo e Áreas Contaminadas. Poluição por Agrotóxicos. Poluição Sonora (Ruído). Exploração Mineral.
10. Áreas de Preservação Permanente – Florestas, Lei do Bioma Mata Atlântica e Fauna
11. Sistema Nacional de Unidades de Conservação da Natureza
12. Segurança Nuclear e Rejeitos Radioativos
13. Proteção da Zona Costeira – Aspectos Jurídicos
14. O Patrimônio Cultural Brasileiro: O Patrimônio Cultural Brasileiro. Registro de Bens Culturais de Natureza Imaterial. Tombamento
15. Engenharia Genética e Meio Ambiente
16. Energias Renováveis: Direito à Iluminação e Direito à Energia Solar
17. Desastres e Emergências Ambientais
18. Acesso ao Patrimônio Genético
19. Os Índios e o Direito Ambiental Brasileiro e Internacional
20. Comércio Internacional, Mercosul e Direito Ambiental Internacional

### 13. Direitos Humanos

1. TEORIA GERAL DOS DIREITOS HUMANOS. A CONCEPÇÃO EVOLUTIVA DO CONCEITO DE HOMEM DE FÁBIO KONDER COMPARATO. ANTECEDENTES HISTÓRICOS. DIREITOS HUMANOS E AS TEORIAS DO DIREITO: Jusnaturalismo, Positivismo, Realismo, Fundamentação moral.
2. ASPECTOS TERMINOLÓGICOS. Os "conceitos" de Direitos Humanos. Direitos do homem ou Direitos Humanos. Liberdades públicas. Direitos subjetivos e direitos públicos subjetivos. Direitos fundamentais e a distinção aos Direitos Humanos
3. DUPLA FUNDAMENTALIDADE DOS DIREITOS HUMANOS/FUNDAMENTAIS. DIMENSÕES DE ABERTURA. CARACTERÍSTICAS DOS DIREITOS HUMANOS. Fundamentalidade. Abstratividade. Moralidade. Prioridade. Inalienabilidade. Irrenunciabilidade e imprescritibilidade. Indivisibilidade. Interdependência. Historicidade. Aplicabilidade imediata. Vedação ao retrocesso. Relatividade. Universalidade
4. A POLÊMICA SOBRE AS GERAÇÕES DOS DIREITOS HUMANOS. EFICÁCIA EXTERNA OU HORIZONTAL DOS DIREITOS FUNDAMENTAIS (DRITTWIRKUNG). A TEORIA DOS QUATRO STATUS DE JELLINEK. DEVERES FUNDAMENTAIS. LIMITES DOS DIREITOS HUMANOS
5. DIREITOS HUMANOS NAS EMPRESAS
6. SISTEMA GLOBAL DE PROTEÇÃO DOS DIREITO HUMANOS. A INTERNACIONALIZAÇÃO DA PROTEÇÃO DOS DIREITOS HUMANOS. O SISTEMA GLOBAL OU ONUSIANO DE PROTEÇÃO DOS DIREITOS HUMANOS. A Declaração Universal dos Direitos Humanos. Os Pactos de Direitos Humanos de 1966
7. OS SISTEMAS REGIONAIS INTERAMERICANOS DE PROTEÇÃO AOS DIREITOS HUMANOS. A Carta da OEA (Carta de Bogotá) Declaração Americana de Direitos e Deveres do Homem. Convenção Americana de Direitos. Protocolo Adicional à Convenção Americana Sobre Direitos Humanos em Matéria de Direitos Econômicos, Sociais e Culturais (Protocolo de San Salvador)
8. O SISTEMA EUROPEU DE PROTEÇÃO DOS DIREITOS HUMANOS
9. O SISTEMA AFRICANO DE PROTEÇÃO AOS DIREITOS HUMANOS
10. OS DIREITOS HUMANOS NO MERCOSUL
11. PROCESSO INTERNACIONAL DOS DIREITOS HUMANOS. Conceito. Classificação dos mecanismos de apuração. Justiciabilidade. Os Sistemas Interamericanos de Direitos Humanos
12. DIREITOS HUMANOS E A CONSTITUIÇÃO DE
13. O COMBATE À TORTURA
14. O COMBATE À DISCRIMINAÇÃO
15. O COMBATE AO TRÁFICO DE PESSOAS
16. PROTEÇÃO AOS POVOS INDÍGENAS

### 14. Direito da Criança e do Adolescente

1. Disposições Preliminares
2. Direito à Vida e à Saúde
3. Direitos Fundamentais
4. Direito à Liberdade, ao Respeito e à Dignidade
5. Convivência Familiar e Comunitária
6. Prevenção e Medidas de Proteção
7. Adoção, Guarda e Tutela
8. Cultura, Educação, Esporte, Trabalho (art. 53 ao 69)
9. Política de Atendimento e Entidades de Atendimento (art. 86 ao 97)
10. Atos Infracionais
11. Medidas para os Pais e Conselho Tutelar
12. Justiça da Infância e Juventude
13. Sinase

### 15. Direito Urbanístico

1. CAPÍTULO 1 - INTRODUÇÃO AO DIREITO URBANÍSTICO
2. CAPÍTULO 2 - DA POLÍTICA URBANA
3. CAPÍTULO 3 - DA FUNÇÃO SOCIAL DA PROPRIEDADE
4. CAPÍTULO 4 - ESTATUTO DA CIDADE
5. CAPÍTULO 5 - DIREITO À MORADIA
6. CAPÍTULO 6 - REGULAÇÃO FUNDIÁRIA DE INTERESSE SOCIAL
7. CAPÍTULO 7 - DIREITO REGISTRAL IMOBILIÁRIO
8. CAPÍTULO 8 - PARCELAMENTO DO SOLO URBANO
9. CAPÍTULO 9 - ÁREA DE PRESERVAÇÃO PERMANENTE
10. CAPÍTULO 10 - TRÍPLICE RESPONSABILIZAÇÃO
11. CAPÍTULO 11 - AÇÕES REAIS E AÇÕES POSSESSÓRIAS
12. CAPÍTULO 12 - LEI DA MOBILIDADE URBANA (LEI N.º 12.587)
13. CAPÍTULO 13 - DESAPROPRIAÇÃO
14. CAPÍTULO 14 - PROTEÇÃO CONSTITUCIONAL AO PATRIMÔNIO CULTURAL
15. CAPÍTULO 15 - ESTATUTO DA METRÓPOLE (LEI N.º 13.089/2015)
16. CAPÍTULO 16 - TUTELA DA ORDEM JURÍDICO-URBANÍSTICA
17. CAPÍTULO 17 - MECANISMOS EXTRAJUDICIAIS DE SOLUÇÃO DE CONFLITOS
18. CAPÍTULO 18 - REGULARIZAÇÃO FUNDIÁRIA URBANA – LEI N.º 13.465/2017
19. CAPÍTULO 19 - CONCESSÃO DE USO ESPECIAL PARA FINS DE MORADIA

### 16. Direito Eleitoral

1. Direitos Políticos
2. Direito Eleitoral
3. Princípios de Direito Eleitoral
4. Justiça Eleitoral
5. Ministério Público Eleitoral
6. Partidos políticos
7. Sistemas eleitorais
8. Alistamento eleitoral
9. Elegibilidade
10. Inelegibilidade
11. Processo eleitoral
12. Convenção partidária
13. Registro de candidatura
14. Campanha eleitoral
15. Financiamento de campanha eleitoral e prestação de contas
16. Pesquisa eleitoral
17. Propaganda eleitoral
18. Eleições, voto e proclamação dos resultados
19. Diplomação
20. Invalidade: nulidade e anulabilidade de votos
21. Ilícitos eleitorais e responsabilidade eleitoral
22. Perda de mandato eletivo, invalidação de votos e eleição suplementar
23. Ações eleitorais: procedimento do art. 22 da LC nº 64/90
24. Ação de Impugnação de Mandato Eletivo (AIME)
25. Recurso Contra Expedição de Diploma (RCED)
26. Execução eleitoral
27. Ação rescisória

### 17. Direito Empresarial

1. Direito Empresarial: Nomenclatura, Conceito, Origem, Evolução Histórica, Autonomia e Fontes
2. Teoria Geral do Direito Empresarial
3. Direito de Propriedade Industrial
4. Direito Societário
5. Títulos de Crédito
6. Contratos Empresariais
7. Direito Falimentar e Recuperacional
8. Microempresa e Empresa de Pequeno Porte
9. Temas Especiais: Comércio Eletrônico, Economia do Compartilhamento e Criptomoedas

### 18. Direitos Difusos e Coletivos

1. Breve histórico legislativo das ações coletivas
2. Microssistema Processual Coletivo
3. Princípios do Processo Coletivo
4. O CPC, o Processo Coletivo e o IRDR (Incidente de Resolução de Demandas Repetitivas)
5. Lei da Ação Civil Pública – Lei nº 7.347, de 24 de julho de 1985
6. Título III da Lei nº 8.078/1990 – CDC
7. Lei da Ação Popular – Lei nº 4.717, de 29 de junho de 1965
8. Comentários ao Mandado de Segurança Coletivo
9. Mandado de Segurança Coletivo – Lei nº 12.016, de 7 de agosto de 2009
10. Mandado de Injunção Coletivo – Lei nº 13.300, de 23 de junho de 2016
11. Habeas Corpus Coletivo – Art. 647-A do Código de Processo Penal

### 19. Direito Previdenciário

1. Noções Introdutórias de Direito Previdenciário
2. Previdência Social
3. Segurados, Filiação e Inscrição no Regime Geral de Previdência Social
4. Custeio do Regime Geral de Previdência Social
5. Acidente de Trabalho
6. Regras Gerais do Plano de Benefícios e Serviços do Regime Geral de Previdência Social
7. Benefícios e Serviços Previdenciários e Assistenciais em Espécie
8. Temas Finais sobre Benefícios
9. Processo Administrativo Previdenciário
10. Processo Judicial Previdenciário
11. Dos Regimes Próprios de Previdência Social – RPPS's
12. Dos RPPS's dos Estados, Distrito Federal e Municípios
13. Do Regime Próprio do Servidor Federal
14. Do Regime de Previdência Complementar
15. Dos Crimes contra a Seguridade Social

### 20. Direito do Trabalho

1. Direito Individual do Trabalho – Introdução
2. Direito Individual do Trabalho – Contrato Individual do Trabalho
3. Direitos do Trabalhador na Constituição Federal de 1988
4. Alteração, Interrupção e Suspensão do Contrato de Trabalho
5. Remuneração e Salário
6. Jornada de Trabalho
7. Aviso Prévio e Extinção do Contrato de Trabalho
8. Estabilidade e FGTS
9. Direito Público nas Relações de Trabalho
10. Normas de Proteção ao Trabalho
11. Direito Coletivo do Trabalho

### 21. Direito Processual do Trabalho

1. Teoria Geral do Direito Processual do Trabalho
2. Organização da Justiça do Trabalho
3. Competência da Justiça do Trabalho
4. Das Partes e dos Procuradores na Justiça do Trabalho
5. Dos Atos Processuais, Prazos e Nulidades
6. Da Petição Inicial, Resposta e Exceções
7. Da Audiência Trabalhista
8. Das Provas no Processo do Trabalho
9. Sentença Trabalhista e Coisa Julgada
10. Dos Recursos no Processo do Trabalho
11. Liquidação no Processo do Trabalho
12. Execução Trabalhista
13. Dos Procedimentos Especiais Trabalhistas
14. Procedimentos e Ações Civis Aplicáveis ao Processo do Trabalho

### 22. Direito e Formação Humanística

1. Filosofia do Direito: Noções Iniciais de Filosofia do Direito. Evolução Histórica da Filosofia do Direito. Direito e Moral
2. Pragmatismo e Análise Econômica do Direito: Função Judicial, Pragmatismo e Análise Econômica do Direito. Economia Comportamental. Governança Corporativa e Compliance no Brasil
3. Sociologia Jurídica: Noções Iniciais de Sociologia Jurídica. Evolução da Sociologia Jurídica. Principais Temas da Sociologia Jurídica. Administração da Justiça
4. Teoria Geral do Direito e da Política: Noções Iniciais de Teoria Geral do Direito. Teoria da Norma Jurídica. Teoria do Ordenamento Jurídico. Fontes do Direito. Hermenêutica Jurídica. Direito e Política Noções Básicas de Direitos Humanos
5. Psicologia Jurídica: Noções Iniciais de Psicologia Jurídica. Assédio Sexual e Assédio Moral. Resolução de Conflitos. Psicologia dos Atores Processuais. Novos Modelos de Justiça e a Psicologia Jurídica. Comunicação Social e Comportamento do Juiz
6. Ética Jurídica: Noções Iniciais de Ética. Ética Jurídica. Estatuto Jurídico da Magistratura Nacional. Código de Ética da Magistratura
7. Direito Digital: Teoria do Direito Digital. Desafios da Persecução Penal diante da Tecnologia. Noções Gerais sobre a Lei Geral de Proteção de Dados
8. Direito da Antidiscriminação: Noções Iniciais sobre o Direito da Antidiscriminação. Legislação e Normas Antidiscriminação

### 23. Direito Econômico

1. Noções Essenciais de Direito Econômico
2. Fontes do Direito Econômico e Competência Legislativa
3. A Ordem Econômica na Constituição de 1988
4. Políticas Econômicas Constitucionais
5. As Agências Reguladoras
6. Contribuições de Intervenção no Domínio Econômico
7. Políticas Econômicas e Organização do Sistema Financeiro Nacional
8. Mercados do Sistema Financeiro
9. Regime Prudencial, Interventivo e Sancionador do SFN
10. Introdução ao Direito da Concorrência (ou Direito Antitruste)
11. Sistema Brasileiro de Defesa da Concorrência
12. Concentração Econômica e Ilícitos Concorrenciais
13. A Ordem Econômica Internacional

### 24. Direito Internacional Público

1. Teoria Geral do Direito Internacional Público
2. Fontes do Direito Internacional Público: Introdução
3. Fontes do Direito Internacional Público: Os Tratados
4. Sujeitos de Direito Internacional Público: Introdução
5. Sujeitos de Direito Internacional Público: O Estado. Imunidade de Jurisdição
6. Órgãos do Estado nas Relações Internacionais
7. Sujeitos de Direito Internacional Público: As Organizações Internacionais
8. Nacionalidade
9. Direito Migratório: A Condição Jurídica do Não Nacional
10. Responsabilidade Internacional
11. Direito Internacional Econômico
12. Direito do Comércio Internacional
13. Direito Internacional do Meio Ambiente
14. Direito Internacional do Trabalho
15. Direito Internacional Penal: O Tribunal Penal Internacional. Direito Penal Internacional: Cooperação Jurídica Internacional no Campo Penal. O Combate ao Terrorismo no Direito Internacional
16. Domínio Público Internacional e Patrimônio Comum da Humanidade
17. Solução Pacífica de Controvérsias Internacionais
18. Direito de Guerra e Neutralidade

### 25. Direito Internacional Privado

1. Direito Internacional Privado
2. Aplicação da Lei no Espaço: Conflitos de Leis no Espaço e a Norma de Direito Internacional Privado
3. Aplicação do Direito Estrangeiro e Direito Processual Civil Internacional. Competência Internacional
4. Cooperação Jurídica Internacional no Campo Cível
5. Cooperação Jurídica Internacional no Campo Cível: Homologação de Sentenças Estrangeiras
6. A Arbitragem no Direito Internacional Privado
7. Direito de Família e Direito Internacional Privado

### 26. Criminologia

1. Criminologia como Ciência
2. Nascimento da Criminologia
3. Modelos Teóricos da Criminologia
4. Escolas Sociológicas
5. História e Teorias da Pena. Prevenção do Delito
6. Modelos de reação ao crime
7. Vitimologia
8. Sistema de Justiça Criminal. Racismo. Criminalidade Feminina. Mídia e Criminalidade
9. Política Criminal

### 27. Direito Institucional do Ministério Público

*(Sem subtópicos definidos)*

### 28. Direito Institucional da Magistratura

*(Sem subtópicos definidos)*

### 29. Direito Institucional da Defensoria Pública

*(Sem subtópicos definidos)*

### 30. Direito Institucional da Advocacia Pública

*(Sem subtópicos definidos)*

### 31. Medicina Legal

1. Medicina Legal
2. Perícia e Peritos
3. Traumatologia Médico-Legal (Traumatologia Forense)
4. Lesões Corporais
5. Toxicologia Médico-Legal (Toxicologia Forense)
6. Asfixiologia Médico-Legal (Asfixiologia Forense)
7. Energias de Ordem Mista
8. Energias de Ordem Bioquímica
9. Energias de Ordem Biodinâmica
10. Tanatologia Médico-Legal
11. Lei sobre Transplante e Doação de Órgãos (Lei nº 9.434/97)
12. Sexologia Médico-Legal: Dos crimes contra a dignidade sexual; do abortamento e do infanticídio
13. História da Identificação Humana
14. Infortunística
15. Tecnologia e inovação na Medicina Legal

### 32. Direito Agrário

1. Noções Fundamentais de Posse, Detenção e Propriedade
2. Introdução ao Direito Agrário: CONCEITO DE DIREITO AGRÁRIO, NATUREZA JURÍDICA DO DIREITO AGRÁRIO, OBJETO DO DIREITO AGRÁRIO, AUTONOMIA DO DIREITO AGRÁRIO, FONTES DO DIREITO AGRÁRIO, PRINCÍPIOS GERAIS DO DIREITO AGRÁRIO.
3. Função Social da Propriedade Rural
4. Imóvel Rural
5. Aquisição do Imóvel Rural
6. Bens Públicos
7. Reforma Agrária
8. Desapropriação Agrária
9. Política Agrícola
10. Contratos Agrários
11. Empresa Agrária
12. Noções Básicas de Tributação no Direito Agrário
13. Direito Agrário e Meio Ambiente

---

## Exemplo de Questão Válida

```json
{
  "id": "202",
  "materia": "Direito Processual Penal",
  "assunto": "14. Nulidades",
  "enunciado": "No curso de uma ação penal pública por crime de corrupção, o juiz, após a audiência de instrução, proferiu decisão saneadora na qual, de ofício, declarou a nulidade da denúncia por considerar inepta sua descrição fática. O Ministério Público não foi previamente ouvido sobre a matéria. Com base nos princípios das nulidades, assinale a alternativa correta.",
  "alternativas": [
    "A) O juiz agiu corretamente, pois a nulidade da denúncia por inépcia é absoluta e pode ser declarada de ofício a qualquer tempo.",
    "B) O juiz poderia declarar a nulidade de ofício, mas deveria antes ouvir o Ministério Público, sob pena de violação do contraditório.",
    "C) A nulidade da denúncia por inépcia é relativa, dependendo de arguição pela parte, não podendo ser declarada de ofício.",
    "D) A decisão é válida, pois a inépcia da inicial é matéria de ordem pública, conhecível ex officio em qualquer momento.",
    "E) O ato do juiz configura excesso de poder, mas é mera irregularidade, não gerando nulidade."
  ],
  "indiceCorreto": 1,
  "explicacao": "B) Correta. Embora a inépcia da denúncia possa ser declarada de ofício, o juiz deve observar o contraditório, ouvindo previamente o Ministério Público para que se manifeste sobre a alegação. A violação do contraditório gera nulidade."
}
```

## Como Importar as Questões no Site

1. Fazer login como **admin** (`admin@desvio.com`)
2. Ir no painel **Admin**
3. Clicar em **"Upload JSON"**
4. Selecionar o arquivo JSON contendo o array de questões
5. As questões serão salvas automaticamente no banco de dados
