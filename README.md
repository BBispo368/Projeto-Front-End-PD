catálogo premium simples — html, css e js

esse projeto foi feito como um trabalho de certificação, pra mostrar que eu sei montar um app completo sem framework

### o que tem aqui
- site de uma página só
- produtos puxados da Fake Store API
- filtro por categoria + busca
- modal de detalhes do produto
- carrinho que abre na lateral
- tema claro e escuro com dourado
- persistência do carrinho e do tema no navegador

### como funciona
- `index.html` carrega a aplicação básica e as fontes
- `src/main.js` tem todo o estado do app, a chamada da api e a renderização dinâmica do conteúdo
- `src/styles.css` define o visual premium, a responsividade e o tema claro/escuro

### o que eu implementei
- carregamento da lista de produtos da Fake Store API
- filtros por categoria e pesquisa com debounce
- grid com 5 colunas em desktop e ajustes responsivos
- botão de adicionar ao carrinho com ícone
- carrinho com quantidade, remoção e total atualizado
- tema claro/branco com dourado e tema escuro preto com dourado
- persistência via `localStorage` para manter carrinho e tema apos fechar a pagina

### explicando os arquivos
- `index.html` — só monta a base do app, importa css e js e deixa o `div#app` vazio
- `src/main.js` — roda todo o app em javascript puro, sem react
  - `state` guarda tudo que o app precisa: produtos, categorias, carrinho, tema
  - funçoes como `loadCart`, `saveCart`, `toggleTheme` e `render` fazem a aplicação funcionar
  - uso `innerHTML` pra renderizar o conteúdo e depois vinculo eventos nos botões
- `src/styles.css` — controla o tema e o estilo de cada elemento
  - variáveis de css definem cores do tema claro e do tema escuro
  - grid responsivo, botões premium e cart drawer lateral
  - layout centralizado em ~80% da tela e 5 produtos por linha em desktop

### rodando o projeto
```bash
npm install
npm run dev
```

abre o endereço que aparece no terminal, normalmente `http://127.0.0.1:4173` ou `http://localhost:5173`

### api usada
- Fake Store API: https://fakestoreapi.com
