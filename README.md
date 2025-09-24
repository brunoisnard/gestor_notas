

📝 Descrição
Este é um sistema web simples, projetado para rodar localmente, que tem como objetivo principal o registro e acompanhamento de notas fiscais. Foi desenvolvido para auxiliar pequenos departamentos, como o setor de TI, a gerenciar prazos de pagamento de fornecedores de forma visual e intuitiva.

O sistema utiliza um código de cores para alertar sobre a proximidade dos vencimentos, facilitando a identificação de notas que exigem atenção imediata e ajudando a evitar atrasos e multas.

✨ Funcionalidades Principais
Alertas Visuais de Vencimento: As notas mudam de cor automaticamente com base na proximidade da data de vencimento:

🟩 Verde: Vencimento distante.

🟨 Laranja: Vencimento próximo (alerta).

🟥 Vermelho: Vencido ou vence hoje.

Gerenciamento de Status: Funcionalidade para "Dar Baixa" em notas, marcando-as como pagas.

Cadastro e Edição: Formulários intuitivos para adicionar novas notas fiscais e editar informações existentes.

Filtros Dinâmicos: Um poderoso sistema de filtragem que permite buscar notas por:

Termo de busca (fornecedor, nº da nota, técnico, etc.).

Período de vencimento (data de início e fim).

Visualização de notas pendentes ou todas (incluindo as pagas).

Campos Personalizados: Inclui campos relevantes para o setor de TI, como "Técnico Responsável" e "Número do Pedido".

💻 Tecnologias Utilizadas
Frontend:

HTML5

CSS3

JavaScript (ES6+)

Backend:

PHP 7.4+

Banco de Dados:

MariaDB / MySQL

Ambiente de Desenvolvimento:

XAMPP (Servidor Apache)

🚀 Como Executar o Projeto Localmente
Siga os passos abaixo para configurar e rodar a aplicação no seu computador.

Pré-requisitos
Ter o XAMPP instalado (ou outro ambiente com Apache, PHP e MySQL).

Passos de Instalação
Clone ou baixe o repositório:

Bash

git clone https://github.com/seu-usuario/seu-repositorio.git
Ou baixe o arquivo ZIP e extraia-o.

Mova os arquivos do projeto:

Mova a pasta do projeto para dentro do diretório htdocs da sua instalação do XAMPP. (Ex: C:/xampp/htdocs/gestor_notas)

Configure o Banco de Dados:

Inicie os módulos Apache e MySQL no Painel de Controle do XAMPP.

Abra o navegador e acesse http://localhost/phpmyadmin/.

Clique em "Novo" para criar um banco de dados e nomeie-o como gestao_financeira.

Selecione o banco gestao_financeira, vá para a aba "SQL" e execute o script abaixo para criar a tabela:

SQL

CREATE TABLE `notas_fiscais` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `numero_nota` VARCHAR(50) NOT NULL,
  `fornecedor` VARCHAR(255) NOT NULL,
  `valor` DECIMAL(10, 2) NOT NULL,
  `data_emissao` DATE NOT NULL,
  `data_vencimento` DATE NOT NULL,
  `numero_lancamento` VARCHAR(50) DEFAULT NULL,
  `numero_pedido` VARCHAR(50) DEFAULT NULL,
  `tecnico_responsavel` VARCHAR(255) DEFAULT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'Pendente',
  `data_criacao` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
Acesse a Aplicação:

Abra o seu navegador e acesse http://localhost/nome-da-pasta-do-projeto/. (Ex: http://localhost/gestor_notas/).

Pronto! O sistema já deve estar funcionando.

📄 Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

Desenvolvido para o Setor de TI .
