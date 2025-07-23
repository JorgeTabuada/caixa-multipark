// Utilitários gerais para a aplicação

// Função para formatar moeda
function formatCurrency(value) {
    const numValue = parseFloat(value) || 0;
    return numValue.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });
}

// Função para formatar data
function formatDate(date, format = 'full') {
    if (!date) return 'N/A';
    
    try {
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) return date.toString();
        
        if (format === 'short') {
            return dateObj.toLocaleDateString('pt-PT');
        } else {
            return dateObj.toLocaleDateString('pt-PT') + ' ' + dateObj.toLocaleTimeString('pt-PT', {hour: '2-digit', minute: '2-digit'});
        }
    } catch (error) {
        console.warn('Erro ao formatar data:', error);
        return date.toString();
    }
}

// Função para normalizar matrícula
function normalizeLicensePlate(plate) {
    if (!plate) return '';
    return String(plate).replace(/[\s\-\.\,\/\\\(\)\[\]\{\}\+\*\?\^\$\|]/g, '').toLowerCase();
}

// Função para mostrar notificações
function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Adicionar estilos dinâmicos se não existirem
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                padding: 16px;
                max-width: 400px;
                z-index: 10000;
                border-left: 4px solid #007bff;
                animation: slideIn 0.3s ease;
            }
            .notification-success { border-left-color: #4CAF50; }
            .notification-warning { border-left-color: #ffc107; }
            .notification-error { border-left-color: #dc3545; }
            .notification-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .notification-close {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #999;
                margin-left: 10px;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Adicionar ao body
    document.body.appendChild(notification);
    
    // Botão de fechar
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Funções de conveniência para notificações
function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'error');
}

function showWarning(message) {
    showNotification(message, 'warning');
}

// Função para mostrar loading
function showLoading(message = 'A carregar...') {
    const existingLoader = document.getElementById('global-loader');
    if (existingLoader) existingLoader.remove();
    
    const loader = document.createElement('div');
    loader.id = 'global-loader';
    loader.innerHTML = `
        <div class="loader-overlay">
            <div class="loader-content">
                <div class="spinner"></div>
                <p>${message}</p>
            </div>
        </div>
    `;
    
    // Adicionar estilos se não existirem
    if (!document.getElementById('loader-styles')) {
        const styles = document.createElement('style');
        styles.id = 'loader-styles';
        styles.textContent = `
            .loader-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            }
            .loader-content {
                background: white;
                padding: 30px;
                border-radius: 10px;
                text-align: center;
            }
            .spinner {
                border: 4px solid #f3f3f3;
                border-top: 4px solid #007bff;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin: 0 auto 15px;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(loader);
}

// Função para esconder loading
function hideLoading() {
    const loader = document.getElementById('global-loader');
    if (loader) loader.remove();
}

// Função para debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Exportar funções globalmente
window.formatCurrency = formatCurrency;
window.formatDate = formatDate;
window.normalizeLicensePlate = normalizeLicensePlate;
window.showNotification = showNotification;
window.showSuccess = showSuccess;
window.showError = showError;
window.showWarning = showWarning;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.debounce = debounce;

console.log('✅ Utilitários carregados!');