// Variáveis globais
let currentModel = 'general';
let isProcessing = false;
let chatHistory = [];
let currentChatId = Date.now();

// Elementos do DOM
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const modelCards = document.querySelectorAll('.model-card');
const themeToggle = document.getElementById('theme-toggle');
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsBtn = document.querySelector('.close-button');
const saveSettingsBtn = document.getElementById('save-settings');
const newChatBtn = document.getElementById('new-chat-btn');
const clearHistoryBtn = document.getElementById('clear-history');
const exportDataBtn = document.getElementById('export-data');
const fontSizeSlider = document.getElementById('font-size');

// Modelos de IA simulados
const aiModels = {
    general: {
        name: 'Assistente Geral',
        description: 'Modelo de IA para respostas gerais e conversação',
        icon: 'fas fa-brain',
        responses: [
            "Entendi sua pergunta. Com base nas informações disponíveis, posso dizer que...",
            "Essa é uma ótima questão! Vou explicar de forma detalhada...",
            "Interessante! A minha análise sobre isso é...",
            "Com certeza! Aqui está a resposta para sua pergunta...",
            "Ótima pergunta! Vou compartilhar o que sei sobre isso..."
        ]
    },
    translator: {
        name: 'Tradutor',
        description: 'Tradução entre idiomas',
        icon: 'fas fa-language',
        responses: [
            "Tradução para o idioma solicitado: ",
            "Aqui está a tradução do seu texto: ",
            "Convertendo para o idioma desejado: ",
            "Tradução concluída: ",
            "Seu texto traduzido: "
        ]
    },
    summarizer: {
        name: 'Resumidor',
        description: 'Resumo de textos longos',
        icon: 'fas fa-file-alt',
        responses: [
            "Resumo do texto fornecido: ",
            "Aqui está um resumo conciso do conteúdo: ",
            "Pontos principais do texto: ",
            "Resumo simplificado: ",
            "Em resumo, o texto trata sobre: "
        ]
    },
    sentiment: {
        name: 'Análise de Sentimento',
        description: 'Análise emocional de textos',
        icon: 'fas fa-smile',
        responses: [
            "Análise de sentimento: O texto expressa principalmente emoções ",
            "Sentimento detectado: ",
            "Análise emocional: O tom do texto é ",
            "O sentimento predominante no texto é ",
            "Após análise, o sentimento identificado é "
        ]
    },
    coder: {
        name: 'Programador',
        description: 'Ajuda com código e programação',
        icon: 'fas fa-code',
        responses: [
            "Aqui está uma solução para o seu problema de programação: ",
            "Vou te ajudar com esse código. Uma abordagem seria: ",
            "Este é um exemplo de código que resolve seu problema: ",
            "Para implementar essa funcionalidade, você pode usar: ",
            "Sugiro o seguinte código para resolver sua questão: "
        ]
    },
    creative: {
        name: 'Criativo',
        description: 'Geração de conteúdo criativo',
        icon: 'fas fa-paint-brush',
        responses: [
            "Com base no seu pedido, criei algo criativo: ",
            "Aqui está minha criação inspirada na sua solicitação: ",
            "Deixando minha criatividade fluir: ",
            "Criei algo especial para você: ",
            "Minha interpretação criativa do seu pedido: "
        ]
    }
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Carregar configurações salvas
    loadSettings();
    
    // Adicionar eventos
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Auto-resize do textarea
    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto';
        userInput.style.height = Math.min(userInput.scrollHeight, 120) + 'px';
    });
    
    // Eventos dos modelos
    modelCards.forEach(card => {
        card.addEventListener('click', () => {
            const model = card.getAttribute('data-model');
            selectModel(model);
        });
    });
    
    // Eventos de tema
    themeToggle.addEventListener('click', toggleTheme);
    
    // Eventos do modal de configurações
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('active');
    });
    
    closeSettingsBtn.addEventListener('click', () => {
        settingsModal.classList.remove('active');
    });
    
    saveSettingsBtn.addEventListener('click', saveSettings);
    
    // Eventos de histórico
    newChatBtn.addEventListener('click', startNewChat);
    clearHistoryBtn.addEventListener('click', clearHistory);
    exportDataBtn.addEventListener('click', exportData);
    
    // Evento de tamanho de fonte
    fontSizeSlider.addEventListener('input', (e) => {
        document.documentElement.style.setProperty('--font-size', `${e.target.value}px`);
    });
    
    // Fechar modal ao clicar fora
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.remove('active');
        }
    });
});

// Função para enviar mensagem
function sendMessage() {
    const message = userInput.value.trim();
    
    if (!message || isProcessing) return;
    
    // Adicionar mensagem do usuário ao chat
    addMessageToChat('user', message);
    
    // Limpar input
    userInput.value = '';
    userInput.style.height = 'auto';
    
    // Salvar no histórico
    saveMessageToHistory('user', message);
    
    // Mostrar indicador de digitação
    showTypingIndicator();
    
    // Simular processamento
    isProcessing = true;
    sendBtn.disabled = true;
    
    // Gerar resposta após um tempo
    setTimeout(() => {
        removeTypingIndicator();
        generateAIResponse(message);
        isProcessing = false;
        sendBtn.disabled = false;
    }, 1500);
}

// Função para adicionar mensagem ao chat
function addMessageToChat(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    
    const avatarDiv = document.createElement('div');
    avatarDiv.classList.add('message-avatar');
    
    if (sender === 'user') {
        avatarDiv.innerHTML = '<i class="fas fa-user"></i>';
    } else {
        avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';
    }
    
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    
    const messageText = document.createElement('p');
    messageText.textContent = message;
    
    contentDiv.appendChild(messageText);
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    
    chatMessages.appendChild(messageDiv);
    
    // Rolar para o final
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Função para mostrar indicador de digitação
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('message', 'ai-message', 'typing-message');
    typingDiv.id = 'typing-indicator';
    
    const avatarDiv = document.createElement('div');
    avatarDiv.classList.add('message-avatar');
    avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';
    
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('typing-indicator');
    contentDiv.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    
    typingDiv.appendChild(avatarDiv);
    typingDiv.appendChild(contentDiv);
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Função para remover indicador de digitação
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Função para gerar resposta da IA
function generateAIResponse(userMessage) {
    const model = aiModels[currentModel];
    const responses = model.responses;
    
    // Selecionar uma resposta aleatória
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Gerar conteúdo específico para cada modelo
    let aiResponse = randomResponse;
    
    switch(currentModel) {
        case 'general':
            aiResponse += generateGeneralResponse(userMessage);
            break;
        case 'translator':
            aiResponse += generateTranslationResponse(userMessage);
            break;
        case 'summarizer':
            aiResponse += generateSummaryResponse(userMessage);
            break;
        case 'sentiment':
            aiResponse += generateSentimentResponse(userMessage);
            break;
        case 'coder':
            aiResponse += generateCodeResponse(userMessage);
            break;
        case 'creative':
            aiResponse += generateCreativeResponse(userMessage);
            break;
    }
    
    // Adicionar resposta ao chat
    addMessageToChat('ai', aiResponse);
    
    // Salvar no histórico
    saveMessageToHistory('ai', aiResponse);
}

// Funções para gerar respostas específicas de cada modelo
function generateGeneralResponse(message) {
    const responses = [
        "esta é uma resposta simulada para demonstrar o funcionamento do chat. Em uma implementação real, esta resposta seria gerada por uma API de IA.",
        "como este é um projeto de demonstração, estou fornecendo uma resposta genérica. Em um ambiente real, eu processaria sua pergunta e forneceria uma resposta personalizada.",
        "este é apenas um exemplo de como o chat funcionaria. Em uma aplicação real, as respostas seriam geradas por modelos de linguagem avançados."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

function generateTranslationResponse(message) {
    const languages = ['inglês', 'espanhol', 'francês', 'alemão', 'italiano'];
    const randomLanguage = languages[Math.floor(Math.random() * languages.length)];
    
    return `"${message}" traduzido para ${randomLanguage}. Esta é uma tradução simulada para demonstração.`;
}

function generateSummaryResponse(message) {
    const words = message.split(' ');
    const summaryLength = Math.min(5, Math.floor(words.length / 3));
    const summaryWords = words.slice(0, summaryLength).join(' ');
    
    return `${summaryWords}... [Resumo simulado para demonstração]`;
}

function generateSentimentResponse(message) {
    const sentiments = ['positivo', 'negativo', 'neutro', 'animado', 'preocupado'];
    const randomSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    
    return `${randomSentiment}. Esta é uma análise de sentimento simulada para demonstração.`;
}

function generateCodeResponse(message) {
    const codeExamples = [
        "```javascript\nfunction exemplo() {\n  console.log('Exemplo de código');\n}\n```",
        "```python\ndef exemplo():\n  print('Exemplo de código')\n```",
        "```html\n<div>Exemplo de código</div>\n```"
    ];
    
    const randomCode = codeExamples[Math.floor(Math.random() * codeExamples.length)];
    
    return randomCode + "\n\nEste é um exemplo de código simulado para demonstração.";
}

function generateCreativeResponse(message) {
    const creativeResponses = [
        "Era uma vez... [História criativa simulada para demonstração]",
        "Num lugar distante... [Conto criativo simulado para demonstração]",
        "Imagine um mundo onde... [Narrativa criativa simulada para demonstração]"
    ];
    
    return creativeResponses[Math.floor(Math.random() * creativeResponses.length)];
}

// Função para selecionar modelo
function selectModel(model) {
    currentModel = model;
    
    // Atualizar UI
    modelCards.forEach(card => {
        card.classList.remove('active');
    });
    
    document.querySelector(`[data-model="${model}"]`).classList.add('active');
    
    // Atualizar informações do modelo no cabeçalho
    const modelInfo = aiModels[model];
    document.querySelector('.active-model-info h2').textContent = modelInfo.name;
    document.querySelector('.active-model-info p').textContent = modelInfo.description;
    document.querySelector('.active-model-info .model-icon i').className = modelInfo.icon;
    
    // Adicionar mensagem de mudança de modelo
    addMessageToChat('ai', `Agora estou usando o modelo ${modelInfo.name}. ${modelInfo.description}`);
}

// Função para alternar tema
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    
    // Atualizar ícone
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
    
    // Salvar preferência
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

// Função para carregar configurações
function loadSettings() {
    // Carregar tema
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.querySelector('i').className = 'fas fa-sun';
    }
    
    // Carregar tamanho da fonte
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
        fontSizeSlider.value = savedFontSize;
        document.documentElement.style.setProperty('--font-size', `${savedFontSize}px`);
    }
    
    // Carregar histórico de conversas
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
        try {
            chatHistory = JSON.parse(savedHistory);
        } catch (e) {
            console.error('Erro ao carregar histórico:', e);
            chatHistory = [];
        }
    }
}

// Função para salvar configurações
function saveSettings() {
    // Salvar tema
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    
    // Salvar tamanho da fonte
    localStorage.setItem('fontSize', fontSizeSlider.value);
    
    // Salvar outras configurações
    const language = document.getElementById('language').value;
    const responseLength = document.getElementById('response-length').value;
    
    localStorage.setItem('language', language);
    localStorage.setItem('responseLength', responseLength);
    
    // Fechar modal
    settingsModal.classList.remove('active');
    
    // Mostrar confirmação
    addMessageToChat('ai', 'Configurações salvas com sucesso!');
}

// Função para iniciar novo chat
function startNewChat() {
    // Limpar mensagens
    chatMessages.innerHTML = '';
    
    // Adicionar mensagem de boas-vindas
    addMessageToChat('ai', 'Olá! Sou o AI Chat Multi-Funções. Como posso ajudar você hoje? Você pode escolher diferentes modelos de IA na barra lateral para tarefas específicas.');
    
    // Atualizar ID do chat
    currentChatId = Date.now();
}

// Função para salvar mensagem no histórico
function saveMessageToHistory(sender, message) {
    // Encontrar ou criar entrada para o chat atual
    let chatEntry = chatHistory.find(chat => chat.id === currentChatId);
    
    if (!chatEntry) {
        chatEntry = {
            id: currentChatId,
            title: generateChatTitle(message),
            messages: [],
            timestamp: new Date().toISOString()
        };
        chatHistory.unshift(chatEntry);
    }
    
    // Adicionar mensagem
    chatEntry.messages.push({
        sender,
        message,
        timestamp: new Date().toISOString()
    });
    
    // Limitar tamanho do histórico
    if (chatHistory.length > 20) {
        chatHistory = chatHistory.slice(0, 20);
    }
    
    // Salvar no localStorage
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    
    // Atualizar UI do histórico
    updateChatHistoryUI();
}

// Função para gerar título do chat
function generateChatTitle(message) {
    const words = message.split(' ');
    const titleWords = words.slice(0, 4).join(' ');
    return titleWords.length > 30 ? titleWords.substring(0, 30) + '...' : titleWords;
}

// Função para atualizar UI do histórico
function updateChatHistoryUI() {
    const historyList = document.querySelector('.history-list');
    historyList.innerHTML = '';
    
    chatHistory.slice(0, 5).forEach(chat => {
        const historyItem = document.createElement('div');
        historyItem.classList.add('history-item');
        historyItem.innerHTML = `
            <i class="fas fa-comment"></i>
            <span>${chat.title}</span>
        `;
        
        historyItem.addEventListener('click', () => {
            loadChat(chat.id);
        });
        
        historyList.appendChild(historyItem);
    });
}

// Função para carregar chat
function loadChat(chatId) {
    const chat = chatHistory.find(c => c.id === chatId);
    if (!chat) return;
    
    // Limpar mensagens
    chatMessages.innerHTML = '';
    
    // Carregar mensagens
    chat.messages.forEach(msg => {
        addMessageToChat(msg.sender, msg.message);
    });
    
    // Atualizar ID atual
    currentChatId = chatId;
}

// Função para limpar histórico
function clearHistory() {
    if (confirm('Tem certeza de que deseja limpar todo o histórico de conversas?')) {
        chatHistory = [];
        localStorage.removeItem('chatHistory');
        updateChatHistoryUI();
        startNewChat();
        
        addMessageToChat('ai', 'Histórico de conversas limpo com sucesso!');
    }
}

// Função para exportar dados
function exportData() {
    const data = {
        chatHistory,
        settings: {
            theme: localStorage.getItem('theme'),
            fontSize: localStorage.getItem('fontSize'),
            language: localStorage.getItem('language'),
            responseLength: localStorage.getItem('responseLength')
        },
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `ai-chat-data-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    addMessageToChat('ai', 'Dados exportados com sucesso!');
}
