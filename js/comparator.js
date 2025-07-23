// Comparador entre Odoo e Back Office
document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface de comparação
    const odooCountElement = document.getElementById('odoo-count');
    const backofficeCountElement = document.getElementById('backoffice-count');
    const inconsistencyCountElement = document.getElementById('inconsistency-count');
    const missingCountElement = document.getElementById('missing-count');
    const comparisonTable = document.getElementById('comparison-table');
    const validateComparisonBtn = document.getElementById('validate-comparison-btn');
    
    // Botões de filtro
    const showAllBtn = document.getElementById('show-all-btn');
    const showMissingBtn = document.getElementById('show-missing-btn');
    const showInconsistentBtn = document.getElementById('show-inconsistent-btn');
    
    // Variáveis para armazenar resultados da comparação
    let comparisonResults = {
        all: [],
        inconsistent: [],
        missing: [],
        valid: []
    };
    
    // Função para normalizar valores antes da comparação
    function normalizeValue(value) {
        if (value === null || value === undefined || value === 'N/A') {
            return '';
        }
        
        // Converter para string e remover formatação
        let normalized = String(value).trim();
        
        // Remover símbolo de euro e espaços
        normalized = normalized.replace(/€/g, '').trim();
        
        // Converter para número se possível
        if (!isNaN(normalized)) {
            return Number(normalized);
        }
        
        // Converter texto para minúsculas
        return normalized.toLowerCase();
    }
    
    // Função principal de comparação
    window.compareOdooBackOffice = function(odooData, backOfficeData) {
        console.log('🔄 Iniciando comparação entre Odoo e Back Office...');
        
        // Limpar resultados anteriores
        comparisonResults = {
            all: [],
            inconsistent: [],
            missing: [],
            valid: []
        };
        
        // Atualizar contadores
        if (odooCountElement) odooCountElement.textContent = odooData.length;
        if (backofficeCountElement) backofficeCountElement.textContent = backOfficeData.length;
        
        // Criar mapa de registos do Odoo por matrícula (insensível a maiúsculas/minúsculas)
        const odooMap = new Map();
        odooData.forEach(record => {
            if (record.licensePlate) {
                // Normalizar matrícula: remover espaços, traços, pontos e outros caracteres especiais
                const normalizedPlate = String(record.licensePlate).replace(/[\s\-\.\,\/\\\(\)\[\]\{\}\+\*\?\^\$\|]/g, '').toLowerCase();
                odooMap.set(normalizedPlate, record);
            }
        });
        
        // Criar mapa de registos do Back Office por matrícula (insensível a maiúsculas/minúsculas)
        const backOfficeMap = new Map();
        backOfficeData.forEach(record => {
            if (record.licensePlate) {
                // Normalizar matrícula: remover espaços, traços, pontos e outros caracteres especiais
                const normalizedPlate = String(record.licensePlate).replace(/[\s\-\.\,\/\\\(\)\[\]\{\}\+\*\?\^\$\|]/g, '').toLowerCase();
                backOfficeMap.set(normalizedPlate, record);
            }
        });
        
        // Verificar registos do Back Office
        backOfficeData.forEach(boRecord => {
            if (!boRecord.licensePlate) return;
            
            const licensePlate = boRecord.licensePlate;
            // Normalizar matrícula: remover espaços, traços, pontos e outros caracteres especiais
            const normalizedPlate = String(licensePlate).replace(/[\s\-\.\,\/\\\(\)\[\]\{\}\+\*\?\^\$\|]/g, '').toLowerCase();
            const odooRecord = odooMap.get(normalizedPlate);
            
            if (!odooRecord) {
                // Registo presente no Back Office mas ausente no Odoo
                comparisonResults.missing.push({
                    source: 'backoffice',
                    licensePlate: licensePlate,
                    alocation: boRecord.alocation || 'N/A',
                    bookingPriceBO: boRecord.bookingPrice || 0,
                    bookingPriceOdoo: 'N/A',
                    parkBrand: boRecord.parkBrand || 'N/A',
                    status: 'missing_in_odoo',
                    boRecord: boRecord,
                    odooRecord: null,
                    resolution: null
                });
            } else {
                // Registo presente em ambos, verificar inconsistências
                const inconsistencies = [];
                
                // Verificar apenas preço de booking (conforme solicitado)
                if (normalizeValue(boRecord.bookingPrice) !== normalizeValue(odooRecord.bookingPrice)) {
                    inconsistencies.push('bookingPrice');
                }
                
                if (inconsistencies.length > 0) {
                    // Registo com inconsistências
                    comparisonResults.inconsistent.push({
                        source: 'both',
                        licensePlate: licensePlate,
                        alocation: boRecord.alocation || 'N/A',
                        bookingPriceBO: boRecord.bookingPrice || 0,
                        bookingPriceOdoo: odooRecord.bookingPrice || 0,
                        parkBrand: boRecord.parkBrand || 'N/A',
                        parkBrandOdoo: odooRecord.parkBrand || 'N/A',
                        status: 'inconsistent',
                        inconsistencies: inconsistencies,
                        boRecord: boRecord,
                        odooRecord: odooRecord,
                        resolution: null
                    });
                } else {
                    // Registo sem inconsistências
                    comparisonResults.valid.push({
                        source: 'both',
                        licensePlate: licensePlate,
                        alocation: boRecord.alocation || 'N/A',
                        bookingPriceBO: boRecord.bookingPrice || 0,
                        bookingPriceOdoo: odooRecord.bookingPrice || 0,
                        parkBrand: boRecord.parkBrand || 'N/A',
                        status: 'valid',
                        boRecord: boRecord,
                        odooRecord: odooRecord,
                        resolution: 'valid'
                    });
                }
            }
        });
        
        // Verificar registos do Odoo ausentes no Back Office
        odooData.forEach(odooRecord => {
            if (!odooRecord.licensePlate) return;
            
            const licensePlate = odooRecord.licensePlate;
            // Normalizar matrícula: remover espaços, traços, pontos e outros caracteres especiais
            const normalizedPlate = String(licensePlate).replace(/[\s\-\.\,\/\\\(\)\[\]\{\}\+\*\?\^\$\|]/g, '').toLowerCase();
            const boRecord = backOfficeMap.get(normalizedPlate);
            
            if (!boRecord) {
                // Registo presente no Odoo mas ausente no Back Office
                comparisonResults.missing.push({
                    source: 'odoo',
                    licensePlate: licensePlate,
                    alocation: 'N/A',
                    bookingPriceBO: 'N/A',
                    bookingPriceOdoo: odooRecord.bookingPrice || 0,
                    parkBrand: odooRecord.parkBrand || 'N/A',
                    status: 'missing_in_backoffice',
                    boRecord: null,
                    odooRecord: odooRecord,
                    resolution: null
                });
            }
        });
        
        // Combinar todos os resultados
        comparisonResults.all = [
            ...comparisonResults.valid,
            ...comparisonResults.inconsistent,
            ...comparisonResults.missing
        ];
        
        // Atualizar contadores
        if (inconsistencyCountElement) inconsistencyCountElement.textContent = comparisonResults.inconsistent.length;
        if (missingCountElement) missingCountElement.textContent = comparisonResults.missing.length;
        
        // Renderizar tabela com todos os registos
        renderComparisonTable(comparisonResults.all);
        
        // Habilitar botão de validação se não houver problemas ou se todos os problemas tiverem resolução
        updateValidateButton();
        
        console.log('✅ Comparação concluída:', {
            total: comparisonResults.all.length,
            valid: comparisonResults.valid.length,
            inconsistent: comparisonResults.inconsistent.length,
            missing: comparisonResults.missing.length
        });
    };
    
    // Função para renderizar a tabela de comparação
    function renderComparisonTable(records) {
        if (!comparisonTable) return;
        
        const tbody = comparisonTable.querySelector('tbody');
        if (!tbody) return;
        
        // Limpar tabela
        tbody.innerHTML = '';
        
        if (records.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="7" class="text-center">Nenhum registo encontrado.</td>';
            tbody.appendChild(row);
            return;
        }
        
        // Adicionar cada registo à tabela
        records.forEach(record => {
            const row = document.createElement('tr');
            
            // Adicionar classe de status
            if (record.status === 'inconsistent') {
                row.classList.add('status-error');
            } else if (record.status.includes('missing')) {
                row.classList.add('status-warning');
            } else if (record.status === 'valid') {
                row.classList.add('status-success');
            }
            
            // Criar células
            row.innerHTML = `
                <td>${record.licensePlate}</td>
                <td>${record.alocation}</td>
                <td>${record.bookingPriceBO} €</td>
                <td>${record.bookingPriceOdoo} €</td>
                <td>${record.parkBrand}</td>
                <td>${getStatusText(record.status)}</td>
                <td>
                    <button class="btn btn-secondary btn-sm view-details" data-license="${record.licensePlate}">Detalhes</button>
                    ${record.status !== 'valid' ? `<button class="btn btn-primary btn-sm resolve-issue" data-license="${record.licensePlate}">Resolver</button>` : ''}
                </td>
            `;
            
            tbody.appendChild(row);
        });
        
        // Adicionar eventos aos botões
        addTableButtonEvents();
    }
    
    // Função para adicionar eventos aos botões da tabela
    function addTableButtonEvents() {
        // Botões de detalhes
        document.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', function() {
                const licensePlate = this.getAttribute('data-license');
                console.log('Ver detalhes para:', licensePlate);
                // Implementar modal de detalhes se necessário
            });
        });
        
        // Botões de resolução
        document.querySelectorAll('.resolve-issue').forEach(button => {
            button.addEventListener('click', function() {
                const licensePlate = this.getAttribute('data-license');
                console.log('Resolver problema para:', licensePlate);
                // Implementar modal de resolução se necessário
            });
        });
    }
    
    // Função para atualizar botão de validação
    function updateValidateButton() {
        if (!validateComparisonBtn) return;
        
        const allResolved = comparisonResults.inconsistent.length === 0 && 
                           comparisonResults.missing.length === 0;
        
        validateComparisonBtn.disabled = !allResolved;
        
        if (allResolved) {
            console.log('✅ Todos os problemas resolvidos! Botão de validação habilitado.');
        }
    }
    
    // Função para obter texto de status
    function getStatusText(status) {
        switch (status) {
            case 'valid':
                return 'Válido';
            case 'inconsistent':
                return 'Inconsistente';
            case 'missing_in_odoo':
                return 'Ausente no Odoo';
            case 'missing_in_backoffice':
                return 'Ausente no Back Office';
            default:
                return status;
        }
    }
    
    // Eventos para botões de filtro
    if (showAllBtn) {
        showAllBtn.addEventListener('click', function() {
            renderComparisonTable(comparisonResults.all);
            // Atualizar botões ativos
            document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    }
    
    if (showMissingBtn) {
        showMissingBtn.addEventListener('click', function() {
            renderComparisonTable(comparisonResults.missing);
            // Atualizar botões ativos
            document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    }
    
    if (showInconsistentBtn) {
        showInconsistentBtn.addEventListener('click', function() {
            renderComparisonTable(comparisonResults.inconsistent);
            // Atualizar botões ativos
            document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    }
    
    // Evento para botão de validação
    if (validateComparisonBtn) {
        validateComparisonBtn.addEventListener('click', function() {
            console.log('✅ Avançando para validação de caixa...');
            
            // Atualizar dados do fileProcessor com as resoluções
            if (window.fileProcessor) {
                window.fileProcessor.setOdooData(
                    comparisonResults.all.map(r => r.odooRecord).filter(Boolean)
                );
                window.fileProcessor.setBackOfficeData(
                    comparisonResults.all.map(r => r.boRecord).filter(Boolean)
                );
            }
            
            // Mudar para a aba de validação de caixa
            const validateTab = document.querySelector('.nav-tab[data-tab="validate"]');
            if (validateTab && window.changeTab) {
                window.changeTab(validateTab);
            }
        });
    }
    
    // Exportar resultados para uso global
    window.comparator = {
        getResults: () => comparisonResults
    };
    
    console.log('✅ Comparator carregado!');
});