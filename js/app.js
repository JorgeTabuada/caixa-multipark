// Aplicação principal
document.addEventListener('DOMContentLoaded', function() {
    // Configurar data atual
    const currentDateElement = document.getElementById('current-date');
    if (currentDateElement) {
        const today = new Date();
        currentDateElement.textContent = today.toLocaleDateString('pt-PT');
    }
    
    // Navegação por abas
    const tabs = document.querySelectorAll('.nav-tab');
    const contentSections = document.querySelectorAll('.content-section');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            changeTab(this);
        });
    });
    
    // Função para mudar de aba
    window.changeTab = function(tabElement) {
        // Remover classe ativa de todas as abas
        tabs.forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Adicionar classe ativa à aba clicada
        tabElement.classList.add('active');
        
        // Ocultar todas as seções de conteúdo
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Mostrar a seção correspondente à aba
        const tabId = tabElement.getAttribute('data-tab');
        const targetSection = document.getElementById(`${tabId}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    };
    
    console.log('✅ App principal carregado!');
});