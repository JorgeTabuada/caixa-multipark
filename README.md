# 🚗 Caixa Multipark

Sistema web para gestão e validação de caixa de entregas de estacionamento. Integra dados do Odoo, Back Office e folhas de caixa dos condutores para validação automática e geração de relatórios.

## 📊 Funcionalidades

- **Importação de Ficheiros Excel** - Suporte para Odoo, Back Office e Caixa
- **Comparação Automática** - Deteta inconsistências entre sistemas
- **Validação por Condutor** - Interface para validação manual
- **Dashboard Interativo** - Estatísticas em tempo real
- **Exportação para Excel** - Relatórios completos
- **Sistema de Debug** - Logs detalhados para resolução de problemas

## 🚀 Como Usar

### 1. Abrir a Aplicação
```
https://jorgetabuada.github.io/caixa-multipark/
```

### 2. Fluxo de Trabalho
1. **Importar** ficheiros Odoo e Back Office (aba "Importação")
2. **Comparar** dados entre sistemas (aba "Comparação")
3. **Resolver** inconsistências se existirem
4. **Importar** ficheiro de caixa (aba "Validação")
5. **Validar** entregas por condutor
6. **Ver** dashboard com estatísticas (aba "Dashboard")
7. **Exportar** relatório final (aba "Exportação")

### 3. Formatos de Ficheiro Suportados
- **Odoo**: Ficheiros Excel com colunas como `imma`, `price`, `parking_name`
- **Back Office**: Ficheiros Excel com colunas como `licensePlate`, `alocation`, `bookingPrice`
- **Caixa**: Ficheiros Excel com dados de entregas dos condutores

## 🔧 Para Programadores

### Estrutura do Projeto
```
/
├── index.html          # Página principal
├── login.html           # Página de login
├── css/
│   └── styles.css       # Estilos principais
└── js/
    ├── app.js              # Aplicação principal
    ├── fileProcessor-debug.js  # Processamento de ficheiros (DEBUG)
    ├── comparator.js       # Comparação entre sistemas
    └── utils.js            # Funções utilitárias
```

### Sistema de Debug
O `fileProcessor-debug.js` inclui logs detalhados:

```javascript
// Ver estado dos dados
window.fileProcessor.debugData()

// Ver colunas de um ficheiro
window.fileProcessor.showColumns('odoo')
window.fileProcessor.showColumns('backoffice')
```

### Deteção Flexível de Colunas
O sistema deteta automaticamente colunas com nomes variados:
- **Matrícula**: `imma`, `licensePlate`, `matricula`, `placa`
- **Preço**: `price`, `booking_price`, `valor`, `preco`
- **Marca**: `parking_name`, `parkBrand`, `marca`

## 🐛 Resolução de Problemas

### Problema: Ficheiros não são lidos
1. Abre a **Consola do Browser** (F12)
2. Procura por mensagens como:
   ```
   🔍 Colunas disponíveis no Odoo: ["col1", "col2", ...]
   ❌ Não foi possível encontrar coluna de matrícula
   ```
3. Verifica se as colunas do ficheiro têm nomes reconhecíveis
4. Se necessário, renomeia as colunas no Excel antes de importar

### Logs úteis
- `🔵 Ficheiro Odoo selecionado` - Ficheiro carregado
- `📊 Workbook carregado` - Excel processado
- `🎯 Correspondência encontrada` - Coluna mapeada com sucesso
- `✅ Dados processados` - Dados transformados

## 📞 Contacto

Para problemas ou sugestões, abre uma **Issue** no GitHub.

---

**Última atualização**: Sistema de debug melhorado e deteção flexível de colunas 🚀