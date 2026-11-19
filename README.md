# BioFront

Base inicial do projeto usando apenas React, Vite e Tailwind CSS.

## Como executar

```bash
npm install
npm run dev
```

Para validar a versão de produção:

```bash
npm run build
```

## Estrutura do frontend

```text
src/
├── components/   # Componentes reutilizáveis, cabeçalho, autenticação e cards
├── data/         # Dados de demonstração e mídia padrão
├── lib/          # Persistência local da sessão, usuários, projetos e vagas
├── pages/        # AuthPage, HomePage, OngProfilePage, ProjectDetailsPage e OngPage
├── App.jsx       # Navegação entre páginas e autenticação compartilhada
└── index.css     # Estilos globais
```

## Funcionalidades do protótipo

- A página inicial segue o layout da `Pagina Padrão` do Figma.
- Pessoas sem sessão começam pela tela de cadastro e podem alternar para a tela de login; após autenticar, entram na página principal.
- Cada projeto da página inicial abre uma página própria com descrição, origem, data, localização, causa e ONG responsável.
- A página principal usa uma grade responsiva de cards menores, com filtros e busca em uma estética branca e verde.
- Localização e causa usam catálogos compartilhados entre cadastro de ONG, projetos, perfil público e filtros.
- Cada perfil de ONG cadastrado aparece na seção `ONGs publicadas` da página principal.
- O primeiro carregamento cria contas e projetos de demonstração sem substituir dados já criados no navegador.
- A página pública da ONG reúne foto, descrição, história, localização, contato e as vagas publicadas por ela.
- O dono da ONG pode editar o perfil, criar projetos/eventos e publicar/editar vagas dentro de cada projeto.
- A hierarquia administrativa é `ONG → Projeto/Evento → Vagas`.
- Vagas criadas no formato antigo do protótipo são migradas automaticamente para um projeto com uma vaga inicial.
- Dados de teste identificados como `Sonic` e `Sonic Frontier 2` são removidos uma única vez durante a atualização do protótipo.
- O cadastro permite escolher entre `Pessoa / Voluntário` e `Perfil de ONG`.
- Cada perfil de ONG possui seus próprios dados e suas vagas ficam isoladas por conta.
- Perfis de pessoa podem navegar pelos projetos, mas não acessam a administração de uma ONG.
- Os cards usam imagens públicas do Unsplash carregadas diretamente no navegador.
- Cadastro, login, sessão e logout funcionam localmente com `localStorage`.

A autenticação atual é apenas para prototipação e não substitui um backend com banco de dados, hash seguro de senhas e controle de sessão em produção.

## Contas de demonstração

As contas abaixo são apenas para testar o protótipo localmente:

| ONG | E-mail | Senha |
| --- | --- | --- |
| Instituto Sementes do Amanhã | `sementes@biofront.demo` | `BioFront123` |
| Rede Mãos Abertas | `maosabertas@biofront.demo` | `BioFront123` |
| Projeto Recomeço | `recomeco@biofront.demo` | `BioFront123` |
