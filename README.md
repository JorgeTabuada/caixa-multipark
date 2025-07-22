# 🚗 Caixa Multipark

Sistema completo de gestão de caixa e validação de entregas para a Multipark.

## 🚀 Funcionalidades

- ✅ **Importação de Ficheiros Excel** (Odoo, Back Office, Caixa)
- 🔍 **Comparação Automática** entre sistemas
- ✔️ **Validação de Entregas** por condutor
- 📊 **Dashboard** com estatísticas em tempo real
- 📤 **Exportação** para Excel com múltiplos templates
- 🔐 **Autenticação** segura com Supabase
- 💾 **Armazenamento** persistente de dados

## 🛠️ Configuração Rápida

### 1. Clonar o Repositório
```bash
git clone https://github.com/JorgeTabuada/caixa-multipark.git
cd caixa-multipark
```

### 2. Configurar Supabase

1. Vai a [supabase.com](https://supabase.com) e cria um projeto
2. Copia a URL e chave da API
3. Executa o schema em `docs/supabase-schema.sql`
4. Atualiza as credenciais em `js/supabase-integration.js`

### 3. Servir a Aplicação

```bash
# Usar qualquer servidor local, por exemplo:
python -m http.server 8000
# ou
npx serve .
# ou
php -S localhost:8000
```

### 4. Aceder à Aplicação

Abre `http://localhost:8000` no browser.

**Utilizadores de teste:**
- `admin@multipark.com` / `admin123`
- `user@multipark.com` / `user123`

## 📂 Estrutura do Projeto

```
├── index.html              # Aplicação principal
├── login.html              # Página de login
├── css/
│   ├── styles.css          # Estilos principais
│   └── additional-styles.css # Estilos complementares
├── js/
│   ├── app.js              # Inicialização
│   ├── supabase-integration.js # API Supabase
│   ├── fileProcessor.js    # Processamento de ficheiros
│   ├── comparator.js       # Comparação de dados
│   ├── validator.js        # Validação de entregas
│   ├── dashboard-supabase.js # Dashboard integrado
│   ├── exporter.js         # Exportação básica
│   ├── advanced-exporter.js # Exportação avançada
│   ├── utils.js            # Utilitários
│   ├── notifications.js    # Sistema de notificações
│   └── validation-system.js # Sistema de validação
└── docs/
    └── supabase-schema.sql # Schema da base de dados
```

## 🎯 Como Usar

### 1. Importação
1. Faz login na aplicação
2. Vai ao tab "Importação de Arquivos"
3. Carrega os ficheiros Odoo e Back Office
4. Clica "Processar Arquivos"

### 2. Comparação
1. Revê as inconsistências encontradas
2. Resolve os problemas usando os botões "Resolver"
3. Clica "Validar e Avançar"

### 3. Validação de Caixa
1. Carrega o ficheiro de caixa
2. Seleciona um condutor
3. Valida cada entrega individualmente
4. Clica "Encerrar Caixa"

### 4. Dashboard e Exportação
1. Vê as estatísticas no dashboard
2. Exporta relatórios em Excel
3. Consulta histórico de exportações

## 🔧 Configuração Avançada

### Variáveis de Ambiente (Supabase)

Edita `js/supabase-integration.js`:

```javascript
const SUPABASE_URL = 'https://teu-projeto.supabase.co';
const SUPABASE_ANON_KEY = 'tua-chave-aqui';
```

### Personalização de Templates

Os templates de exportação podem ser personalizados em `js/advanced-exporter.js`.

## 🐛 Resolução de Problemas

### Erro de CORS
Se tiveres problemas de CORS, usa um servidor local apropriado em vez de abrir o ficheiro diretamente.

### Problemas de Autenticação
Certifica-te que as credenciais do Supabase estão corretas e que o RLS está configurado.

### Ficheiros não Carregam
Verifica se os ficheiros Excel estão no formato correto (.xlsx).

## 📝 Contribuir

1. Faz fork do projeto
2. Cria uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit as mudanças (`git commit -am 'Adicionar nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abre um Pull Request

## 📄 Licença

Este projeto está sob licença MIT. Vê o ficheiro [LICENSE](LICENSE) para detalhes.

## 🤝 Suporte

Para suporte, abre uma issue no GitHub ou contacta a equipa de desenvolvimento.

---

Feito com ❤️ para a Multipark