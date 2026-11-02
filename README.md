# Kallocaína: Comunicação Proibida

Jogo de dedução social online, inspirado no romance *Kallocaína*, de Karin Boye. Cada jogador joga no próprio aparelho e entra na sessão pelo "Número do registro" (um código de 5 caracteres).

Dois modos:

- **Clássico**, com 5 jogadores: Leo Kall (o químico do Estado), emissor, dois intermediários e receptor.
- **Delator**, com 6 jogadores: Leo, emissor, três intermediários (um deles é o delator, que trabalha em segredo para o Estado) e receptor.

## Arquivos

- `index.html`: estrutura da página.
- `styles.css`: todo o visual.
- `script.js`: toda a lógica do jogo (regras, telas, sons, bots da sessão de exemplo, banco de palavras).
- `config.js`: endereço e chave pública do Supabase.
- `supabase-db.js`: camada que faz o jogo falar com o Supabase. Imita a interface `doc(path).get/set/update/delete/onSnapshot` e `collection(path).get/onSnapshot`.
- `musica.mp3` (menu) e `subpulse.mp3` (durante a partida): precisam ficar na mesma pasta do `index.html`.

O jogo nasceu como um único arquivo HTML dentro de um artefato do Claude e foi separado depois, sem mudar o conteúdo.

## Banco de dados (Supabase)

Tudo fica numa tabela só, `public.docs`, com as colunas `path` (texto, chave) e `data` (json). Os caminhos seguem o formato `rooms/{CODIGO}` e `rooms/{CODIGO}/players/{id}`. A função `merge_doc` faz a atualização parcial (junta o json novo com o que já existe) e o Realtime fica ligado na tabela. O login é anônimo: cada jogador ganha uma identidade sem criar conta.

Pendências do banco:

- A segurança é por sala e por jogador (regras já aplicadas no Supabase): só quem está na sala mexe nela, cada jogador altera apenas os próprios dados e o anfitrião pode alterar os dos outros jogadores.
- A conexão real com o Supabase ainda não foi testada. A lógica foi testada só com um Supabase simulado.
- O `supabase-js` é carregado de uma CDN, na versão 2.49.4. Se a chave nova (`sb_publishable_...`) der erro de autenticação, tentar uma versão mais recente.

## Regras que foram decididas de propósito (não mudar sem querer)

- **Frase do emissor:** exatamente 12 palavras no Clássico e 16 no Delator. Palavras de até 2 letras ("de", "e", "a", "os") não contam: ficam fixas e ninguém pode trocá-las nem extraí-las.
- **Intermediários:** trocam exatamente 2 palavras, de uma única palavra, e não podem trocar palavras fixas nem palavras que Leo já viu (travadas).
- **Leo no Clássico:** 3 interrogatórios, 2 palavras extraídas em cada, 1 palpite por interrogatório.
- **Leo no Delator:** 4 etapas: 3 interrogatórios e uma etapa de denúncia (a que vem depois da troca do delator; Leo não interroga o delator, só recebe as 2 palavras que ele entrega). Pode dar 1 palpite em cada etapa.
- **Olho da Polícia:** uma vez por rodada, a partir do segundo interrogatório; revela uma palavra que foi trocada (a original e a nova).
- **Palpite certo de Leo:** antes da última etapa, o Estado vence na hora. Na última etapa, a rodada espera o receptor.
- **Última etapa:** se Leo e o receptor acertam, é **empate**. Só Leo acerta ou o receptor erra: o Estado vence. Só o receptor acerta: os cidadãos-soldados vencem. Delator como receptor entrega a decodificação: o Estado vence.
- **Pontos:** cidadãos-soldados +2 se o receptor acerta e Leo não; +1 para cada cidadão-soldado por palpite errado de Leo; empate: +1 para cada cidadão-soldado e +2 para Leo (e para o delator); Estado vence: +5 para Leo (e para o delator); no modo Delator, +1 para quem vota certo no delator.
- **Dificuldade:** a sessão é aberta com Fácil, Médio, Difícil ou Muito difícil. São 180 palavras no total (45, 45, 48 e 42), no objeto `BANKS` do `script.js`.
- **Tom:** os textos seguem o vocabulário do livro (Estado Mundial, Cidade Química n.º 4, cidadãos-soldados, Polícia, kallocaína). A kallocaína é uma representação lúdica no jogo, e o delator é uma criação do jogo, inspirada no clima de vigilância do livro.

## Sessão de exemplo

Partida guiada contra o computador, sem sala real e sem Supabase (usa um banco em memória dentro da página). Tem os dois modos e todos os papéis. Fica no botão "Sessão de exemplo", na tela de entrar numa sessão. A tela inicial tem um botão "Sessão de exemplo" que funciona mesmo sem conexão com o banco (nesse caso "Abrir nova sessão" e "Entrar em uma sessão" ficam desabilitados).

O código de "Jogar com IA (Claude)" também existe, mas só funciona dentro de um artefato do Claude (usa a capacidade `sample`); fora dele o botão não aparece.

## Ainda não testado

- Partidas completas com pessoas de verdade em aparelhos diferentes.
- Equilíbrio entre Leo e cidadãos-soldados, e entre os níveis de dificuldade (a pontuação é a mesma em todos).
- Quantos empates acontecem na prática.

## Como rodar

Basta servir a pasta como site estático (por exemplo, GitHub Pages). O áudio só toca depois do primeiro toque na tela, por regra dos navegadores.
