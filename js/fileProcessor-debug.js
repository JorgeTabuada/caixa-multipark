// Processador de arquivos Excel - VERSÃO DEBUG MELHORADA
document.addEventListener('DOMContentLoaded', function() {
    // Variáveis globais para armazenar os dados dos arquivos
    let odooData = null;
    let backOfficeData = null;
    let caixaData = null;

    // Referências aos elementos de upload de arquivos
    const odooFileInput = document.getElementById('odoo-file');
    const backofficeFileInput = document.getElementById('backoffice-file');
    const caixaFileInput = document.getElementById('caixa-file');
    
    // Botões de upload
    const odooUpload = document.getElementById('odoo-upload');
    const backofficeUpload = document.getElementById('backoffice-upload');
    const caixaUpload = document.getElementById('caixa-upload');
    
    // Informações dos arquivos
    const odooFileInfo = document.getElementById('odoo-file-info');
    const odooFilename = document.getElementById('odoo-filename');
    const backofficeFileInfo = document.getElementById('backoffice-file-info');
    const backofficeFilename = document.getElementById('backoffice-filename');
    const caixaFileInfo = document.getElementById('caixa-file-info');
    const caixaFilename = document.getElementById('caixa-filename');
    
    // Botão de processamento
    const processFilesBtn = document.getElementById('process-files-btn');
    
    // ===== CONFIGURAR EVENTOS DE UPLOAD =====
    
    // Configurar eventos de upload para Odoo
    if (odooUpload) {
        odooUpload.addEventListener('click', function() {
            odooFileInput.click();
        });
    }
    
    if (odooFileInput) {
        odooFileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                odooFilename.textContent = file.name;
                odooFileInfo.classList.remove('hidden');
                console.log('🔵 Ficheiro Odoo selecionado:', file.name);
                readExcelFile(file, 'odoo');
            }
        });
    }
    
    // Configurar eventos de upload para Back Office
    if (backofficeUpload) {
        backofficeUpload.addEventListener('click', function() {
            backofficeFileInput.click();
        });
    }
    
    if (backofficeFileInput) {
        backofficeFileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                backofficeFilename.textContent = file.name;
                backofficeFileInfo.classList.remove('hidden');
                console.log('🟡 Ficheiro Back Office selecionado:', file.name);
                readExcelFile(file, 'backoffice');
            }
        });
    }
    
    // Configurar eventos de upload para Caixa
    if (caixaUpload) {
        caixaUpload.addEventListener('click', function() {
            caixaFileInput.click();
        });
    }
    
    if (caixaFileInput) {
        caixaFileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                caixaFilename.textContent = file.name;
                caixaFileInfo.classList.remove('hidden');
                console.log('🟢 Ficheiro Caixa selecionado:', file.name);
                readExcelFile(file, 'caixa');
                
                // Iniciar validação de caixa se os dados forem carregados com sucesso
                setTimeout(function() {
                    if (caixaData) {
                        console.log("✅ Iniciando validação de caixa automaticamente");
                        if (window.validator && window.validator.initCaixaValidation) {
                            window.validator.initCaixaValidation(caixaData);
                        }
                    } else {
                        console.error("❌ Dados da caixa não foram carregados corretamente");
                    }
                }, 1000);
            }
        });
    }
    
    // ===== FUNÇÃO PRINCIPAL PARA LER ARQUIVO EXCEL =====
    
    function readExcelFile(file, fileType) {
        console.log(`📁 Iniciando leitura do ficheiro ${fileType}:`, file.name);
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                console.log(`📖 A processar ficheiro ${fileType}...`);
                
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                
                console.log(`📊 Workbook carregado para ${fileType}:`, {
                    sheetNames: workbook.SheetNames,
                    sheets: workbook.SheetNames.length
                });
                
                // Obter a primeira planilha
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                
                // Converter para JSON
                const jsonData = XLSX.utils.sheet_to_json(worksheet, {defval: ""});
                
                console.log(`🔍 Dados brutos do ${fileType}:`, {
                    totalRecords: jsonData.length,
                    firstRecord: jsonData[0],
                    columns: jsonData.length > 0 ? Object.keys(jsonData[0]) : []
                });
                
                if (jsonData.length === 0) {
                    console.error(`❌ Ficheiro ${fileType} está vazio!`);
                    alert(`O ficheiro ${fileType} não contém dados.`);
                    return;
                }
                
                // Processar dados conforme o tipo de arquivo
                if (fileType === 'odoo') {
                    processOdooFile(jsonData, file.name);
                } else if (fileType === 'backoffice') {
                    processBackOfficeFile(jsonData, file.name);
                } else if (fileType === 'caixa') {
                    processCaixaFile(jsonData, file.name);
                }
                
            } catch (error) {
                console.error(`❌ Erro ao processar ficheiro ${fileType}:`, error);
                alert(`Erro ao processar o ficheiro ${fileType}. Verifica se é um ficheiro Excel válido.`);
            }
        };
        
        reader.onerror = function() {
            console.error(`❌ Erro ao ler ficheiro ${fileType}`);
            alert(`Erro ao ler o ficheiro ${fileType}. Tenta novamente.`);
        };
        
        reader.readAsArrayBuffer(file);
    }
    
    // ===== PROCESSAMENTO ESPECÍFICO POR TIPO DE FICHEIRO =====
    
    function processOdooFile(jsonData, filename) {
        console.log('🔵 A processar ficheiro Odoo...');
        
        // VERSÃO MAIS FLEXÍVEL - tentar detetar automaticamente as colunas
        const firstRow = jsonData[0];
        const columns = Object.keys(firstRow);
        
        console.log('🔍 Colunas disponíveis no Odoo:', columns);
        
        // Mapear colunas baseado em padrões comuns
        const columnMapping = detectOdooColumns(columns);
        console.log('🗺️ Mapeamento de colunas Odoo:', columnMapping);
        
        if (!columnMapping.licensePlate) {
            console.error('❌ Não foi possível encontrar coluna de matrícula no Odoo');
            console.error('💡 Colunas disponíveis:', columns);
            alert('O ficheiro Odoo não tem o formato esperado. Não foi encontrada a coluna de matrícula.\n\nColunas disponíveis: ' + columns.join(', '));
            return;
        }
        
        // Transformar dados
        const transformedData = transformOdooData(jsonData, columnMapping);
        odooData = transformedData;
        
        console.log('✅ Dados do Odoo processados:', {
            totalRecords: odooData.length,
            sample: odooData.slice(0, 2)
        });
        
        // Verificar se ambos os arquivos iniciais foram carregados
        checkProcessButton();
    }
    
    function processBackOfficeFile(jsonData, filename) {
        console.log('🟡 A processar ficheiro Back Office...');
        
        const firstRow = jsonData[0];
        const columns = Object.keys(firstRow);
        
        console.log('🔍 Colunas disponíveis no Back Office:', columns);
        
        // Mapear colunas baseado em padrões comuns
        const columnMapping = detectBackOfficeColumns(columns);
        console.log('🗺️ Mapeamento de colunas Back Office:', columnMapping);
        
        if (!columnMapping.licensePlate) {
            console.error('❌ Não foi possível encontrar coluna de matrícula no Back Office');
            console.error('💡 Colunas disponíveis:', columns);
            alert('O ficheiro Back Office não tem o formato esperado. Não foi encontrada a coluna de matrícula.\n\nColunas disponíveis: ' + columns.join(', '));
            return;
        }
        
        // Transformar dados se necessário
        backOfficeData = transformBackOfficeData(jsonData, columnMapping);
        
        console.log('✅ Dados do Back Office processados:', {
            totalRecords: backOfficeData.length,
            sample: backOfficeData.slice(0, 2)
        });
        
        // Verificar se ambos os arquivos iniciais foram carregados
        checkProcessButton();
    }
    
    function processCaixaFile(jsonData, filename) {
        console.log('🟢 A processar ficheiro Caixa...');
        
        caixaData = jsonData;
        
        console.log('✅ Dados da Caixa carregados:', {
            totalRecords: caixaData.length,
            sample: caixaData.slice(0, 2)
        });
    }
    
    // ===== DETEÇÃO AUTOMÁTICA DE COLUNAS =====
    
    function detectOdooColumns(columns) {
        const mapping = {};
        
        // Possíveis nomes para matrícula
        const licensePlatePatterns = [
            'imma', 'licensePlate', 'license_plate', 'matricula', 'matrícula',
            'placa', 'plate', 'registration', 'Imma', 'IMMA'
        ];
        
        // Possíveis nomes para preço
        const pricePatterns = [
            'price', 'booking_price', 'bookingPrice', 'preco', 'preço',
            'valor', 'value', 'amount', 'Price'
        ];
        
        // Possíveis nomes para marca
        const brandPatterns = [
            'parking_name', 'parkBrand', 'park_brand', 'marca', 'brand',
            'parque', 'parking', 'park', 'Parking_name'
        ];
        
        // Possíveis nomes para data
        const datePatterns = [
            'date_start', 'bookingDate', 'booking_date', 'data_reserva',
            'start_date', 'created_date', 'Date_start'
        ];
        
        // Tentar encontrar cada coluna
        mapping.licensePlate = findColumn(columns, licensePlatePatterns);
        mapping.bookingPrice = findColumn(columns, pricePatterns);
        mapping.parkBrand = findColumn(columns, brandPatterns);
        mapping.bookingDate = findColumn(columns, datePatterns);
        
        return mapping;
    }
    
    function detectBackOfficeColumns(columns) {
        const mapping = {};
        
        // Padrões similares mas podem ter nomes diferentes
        const licensePlatePatterns = [
            'licensePlate', 'license_plate', 'matricula', 'matrícula',
            'placa', 'plate', 'registration', 'imma', 'Imma', 'IMMA'
        ];
        
        const alocationPatterns = [
            'alocation', 'alocacao', 'alocação', 'booking_id', 'id',
            'reference', 'ref', 'numero', 'number', 'Alocation'
        ];
        
        const pricePatterns = [
            'bookingPrice', 'booking_price', 'price', 'preco', 'preço',
            'valor', 'value', 'amount', 'Price'
        ];
        
        const brandPatterns = [
            'parkBrand', 'park_brand', 'parking_name', 'marca', 'brand',
            'parque', 'parking', 'park'
        ];
        
        mapping.licensePlate = findColumn(columns, licensePlatePatterns);
        mapping.alocation = findColumn(columns, alocationPatterns);
        mapping.bookingPrice = findColumn(columns, pricePatterns);
        mapping.parkBrand = findColumn(columns, brandPatterns);
        
        return mapping;
    }
    
    function findColumn(columns, patterns) {
        // Procurar correspondência exata primeiro
        for (const pattern of patterns) {
            const exactMatch = columns.find(col => col === pattern);
            if (exactMatch) {
                console.log('🎯 Correspondência exata encontrada:', pattern, '→', exactMatch);
                return exactMatch;
            }
        }
        
        // Procurar correspondência case-insensitive
        for (const pattern of patterns) {
            const caseInsensitiveMatch = columns.find(col => 
                col.toLowerCase() === pattern.toLowerCase()
            );
            if (caseInsensitiveMatch) {
                console.log('🎯 Correspondência case-insensitive:', pattern, '→', caseInsensitiveMatch);
                return caseInsensitiveMatch;
            }
        }
        
        // Procurar correspondência parcial
        for (const pattern of patterns) {
            const partialMatch = columns.find(col => 
                col.toLowerCase().includes(pattern.toLowerCase()) ||
                pattern.toLowerCase().includes(col.toLowerCase())
            );
            if (partialMatch) {
                console.log('🎯 Correspondência parcial:', pattern, '→', partialMatch);
                return partialMatch;
            }
        }
        
        console.warn('⚠️ Nenhuma correspondência encontrada para padrões:', patterns);
        return null;
    }
    
    // ===== TRANSFORMAÇÃO DE DADOS =====
    
    function transformOdooData(data, columnMapping) {
        console.log('🔄 A transformar dados do Odoo...');
        
        const transformedData = data.map((record, index) => {
            const newRecord = {};
            
            // Campos obrigatórios
            newRecord.licensePlate = normalizeLicensePlate(
                record[columnMapping.licensePlate] || ''
            );
            
            newRecord.bookingPrice = parseFloat(
                record[columnMapping.bookingPrice] || 0
            );
            
            newRecord.parkBrand = standardizeParkName(
                record[columnMapping.parkBrand] || ''
            );
            
            // Campos opcionais
            newRecord.bookingDate = columnMapping.bookingDate ? 
                formatDate(record[columnMapping.bookingDate]) : '';
            
            newRecord.share = parseFloat(record.share || 0);
            newRecord.checkIn = formatDate(record.check_in || record.date_checkin || '');
            newRecord.checkOut = formatDate(record.check_out || record.date_end || '');
            newRecord.priceOnDelivery = parseFloat(record.price_to_pay || record.priceOnDelivery || 0);
            newRecord.paymentMethod = record.payment_method || record.paymentMethod || '';
            newRecord.driver = record.driver || record.condutor || '';
            
            // Dados originais para referência
            newRecord.originalData = record;
            
            if (index < 2) {
                console.log(`📝 Registo Odoo transformado ${index + 1}:`, newRecord);
            }
            
            return newRecord;
        });
        
        console.log(`✅ Transformação do Odoo concluída: ${data.length} → ${transformedData.length} registos`);
        return transformedData;
    }
    
    function transformBackOfficeData(data, columnMapping) {
        console.log('🔄 A transformar dados do Back Office...');
        
        const transformedData = data.map((record, index) => {
            const newRecord = {};
            
            // Campos obrigatórios
            newRecord.licensePlate = normalizeLicensePlate(
                record[columnMapping.licensePlate] || ''
            );
            
            newRecord.alocation = record[columnMapping.alocation] || '';
            
            newRecord.bookingPrice = parseFloat(
                record[columnMapping.bookingPrice] || 0
            );
            
            newRecord.parkBrand = standardizeParkName(
                record[columnMapping.parkBrand] || ''
            );
            
            // Campos opcionais
            newRecord.campaign = record.campaign || '';
            newRecord.checkIn = formatDate(record.checkIn || record.check_in || '');
            newRecord.driver = record.driver || record.condutor || '';
            newRecord.campaignPay = record.campaignPay === 'true' || record.campaignPay === true;
            newRecord.hasOnlinePayment = record.hasOnlinePayment === 'true' || record.hasOnlinePayment === true;
            
            // Dados originais para referência
            newRecord.originalData = record;
            
            if (index < 2) {
                console.log(`📝 Registo Back Office transformado ${index + 1}:`, newRecord);
            }
            
            return newRecord;
        });
        
        console.log(`✅ Transformação do Back Office concluída: ${data.length} → ${transformedData.length} registos`);
        return transformedData;
    }
    
    // ===== FUNÇÕES UTILITÁRIAS =====
    
    function normalizeLicensePlate(plate) {
        if (!plate) return '';
        return String(plate).replace(/[\s\-\.\,\/\\\(\)\[\]\{\}\+\*\?\^\$\|]/g, '').toLowerCase();
    }
    
    function standardizeParkName(parkName) {
        if (!parkName) return '';
        
        const name = String(parkName).toLowerCase();
        let cleanName = name
            .replace(/\s+parking\b/g, '')
            .replace(/\s+estacionamento\b/g, '')
            .replace(/\s+park\b/g, '')
            .replace(/\s+parque\b/g, '');
            
        return cleanName.trim().toUpperCase();
    }
    
    function formatDate(dateValue) {
        if (!dateValue) return '';
        
        try {
            let dateObj;
            
            if (typeof dateValue === 'number' || !isNaN(Number(dateValue))) {
                const timestamp = typeof dateValue === 'number' ? dateValue : Number(dateValue);
                dateObj = timestamp > 10000000000 ? new Date(timestamp) : new Date(timestamp * 1000);
            } else if (typeof dateValue === 'string' && dateValue.includes('/')) {
                const cleanDateValue = dateValue.replace(/,/g, ' ');
                const parts = cleanDateValue.split(/[\/\s:]/);
                if (parts.length >= 5) {
                    const day = parseInt(parts[0], 10);
                    const month = parseInt(parts[1], 10) - 1;
                    const year = parseInt(parts[2], 10);
                    const hour = parseInt(parts[3], 10);
                    const minute = parseInt(parts[4], 10);
                    const second = parts.length >= 6 ? parseInt(parts[5], 10) : 0;
                    dateObj = new Date(year, month, day, hour, minute, second);
                } else {
                    dateObj = new Date(cleanDateValue);
                }
            } else {
                dateObj = new Date(dateValue);
            }
            
            if (isNaN(dateObj.getTime())) {
                console.warn('⚠️ Data inválida:', dateValue);
                return dateValue;
            }
            
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();
            const hours = String(dateObj.getHours()).padStart(2, '0');
            const minutes = String(dateObj.getMinutes()).padStart(2, '0');
            const seconds = String(dateObj.getSeconds()).padStart(2, '0');
            
            return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        } catch (error) {
            console.error('❌ Erro ao formatar data:', error);
            return dateValue;
        }
    }
    
    function checkProcessButton() {
        if (odooData && backOfficeData) {
            if (processFilesBtn) {
                processFilesBtn.disabled = false;
                console.log('✅ Ambos os ficheiros carregados! Botão de processamento habilitado.');
            }
        }
    }
    
    // ===== EVENTO PARA BOTÃO DE PROCESSAMENTO =====
    
    if (processFilesBtn) {
        processFilesBtn.addEventListener('click', function() {
            if (odooData && backOfficeData) {
                console.log('🚀 A iniciar comparação entre Odoo e Back Office...');
                
                // Chamar função de comparação do arquivo comparator.js
                if (window.compareOdooBackOffice) {
                    window.compareOdooBackOffice(odooData, backOfficeData);
                    
                    // Mudar para a aba de comparação
                    const compareTab = document.querySelector('.nav-tab[data-tab="compare"]');
                    if (compareTab && window.changeTab) {
                        window.changeTab(compareTab);
                    }
                } else {
                    console.error('❌ Função de comparação não encontrada!');
                }
            } else {
                console.error('❌ Dados em falta:', { 
                    odoo: !!odooData, 
                    backOffice: !!backOfficeData 
                });
                alert('Por favor, carrega os ficheiros Odoo e Back Office antes de prosseguir.');
            }
        });
    }
    
    // ===== EXPORTAR VARIÁVEIS E FUNÇÕES PARA USO GLOBAL =====
    
    window.fileProcessor = {
        odooData: () => odooData,
        backOfficeData: () => backOfficeData,
        caixaData: () => caixaData,
        setOdooData: (data) => { 
            odooData = data;
            console.log('📝 Dados do Odoo atualizados via API:', odooData?.length || 0, 'registos');
        },
        setBackOfficeData: (data) => { 
            backOfficeData = data;
            console.log('📝 Dados do Back Office atualizados via API:', backOfficeData?.length || 0, 'registos');
        },
        setCaixaData: (data) => { 
            caixaData = data;
            console.log('📝 Dados da Caixa atualizados via API:', caixaData?.length || 0, 'registos');
        },
        normalizeLicensePlate: normalizeLicensePlate,
        standardizeParkName: standardizeParkName,
        // Funções de debug
        debugData: () => {
            console.log('🔍 Estado atual dos dados:', {
                odoo: { loaded: !!odooData, count: odooData?.length || 0, sample: odooData?.[0] },
                backOffice: { loaded: !!backOfficeData, count: backOfficeData?.length || 0, sample: backOfficeData?.[0] },
                caixa: { loaded: !!caixaData, count: caixaData?.length || 0, sample: caixaData?.[0] }
            });
        },
        showColumns: (fileType) => {
            let data = null;
            if (fileType === 'odoo') data = odooData;
            else if (fileType === 'backoffice') data = backOfficeData;
            else if (fileType === 'caixa') data = caixaData;
            
            if (data && data.length > 0) {
                console.log(`📋 Colunas disponíveis em ${fileType}:`, Object.keys(data[0]));
            } else {
                console.log(`❌ Nenhum dado carregado para ${fileType}`);
            }
        }
    };
    
    console.log('✅ FileProcessor DEBUG carregado!');
    console.log('💡 Para debug, usa:');
    console.log('   - window.fileProcessor.debugData() // Ver estado dos dados');
    console.log('   - window.fileProcessor.showColumns("odoo") // Ver colunas do Odoo');
    console.log('   - window.fileProcessor.showColumns("backoffice") // Ver colunas do Back Office');
});