marked.use({
  gfm: true,
  breaks: true,
  highlight: function(code, language) {
    if (language && hljs.getLanguage(language)) {
      try {
        return hljs.highlight(code, { language }).value;
      } catch (err) {
        console.error('Highlight error:', err);
      }
    }
    return code;
  }
});

let selectedText = "";
let lastTimestamp = 0;
let chatHistory = [];

document.addEventListener('DOMContentLoaded', async () => {
  const result = await chrome.storage.local.get(['selectedText', 'timestamp']);
  if (result.selectedText && result.timestamp > lastTimestamp) {
    selectedText = result.selectedText;
    lastTimestamp = result.timestamp;
    updateSelectedText(selectedText);
  }

  chrome.storage.local.onChanged.addListener((changes) => {
    if (changes.selectedText && changes.timestamp) {
      const newTimestamp = changes.timestamp.newValue;
      if (newTimestamp > lastTimestamp) {
        selectedText = changes.selectedText.newValue;
        lastTimestamp = newTimestamp;
        updateSelectedTextAndClearChat(selectedText);
      }
    }
  });

  setupChatInterface();
});

function updateSelectedTextAndClearChat(text) {
  document.getElementById('selectedText').textContent = text;
  
  const chatContainer = document.getElementById('chatContainer');
  chatContainer.innerHTML = '';
  
  const promptInput = document.getElementById('prompt');
  if (promptInput) {
    promptInput.value = '';
  }

  chatHistory = [];

  addMessage('system', 'New text has been selected. You can start a new conversation about this text.');
}

function updateSelectedText(text) {
  document.getElementById('selectedText').textContent = text;
}

function setupChatInterface() {
  const promptInput = document.getElementById('prompt');
  const submitButton = document.getElementById('submit');

  submitButton.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) return;

    addMessage('user', prompt);
    promptInput.value = '';

    const loadingMessage = showLoadingIndicator();

    try {
      const response = await askChatGPT(prompt, selectedText);
      loadingMessage.remove();
      addMessage('assistant', response);
    } catch (error) {
      loadingMessage.remove();
      addMessage('system', 'Error: Could not get response from ChatGPT');
      console.error('Error:', error);
    }
  });

  promptInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitButton.click();
    }
  });
}

function showLoadingIndicator() {
  const chatContainer = document.getElementById('chatContainer');
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'message loading-message';
  loadingDiv.innerHTML = `
    ChatGPT is thinking
    <div class="typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;
  chatContainer.appendChild(loadingDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  return loadingDiv;
}

function addMessage(role, content) {
  const chatContainer = document.getElementById('chatContainer');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${role}-message`;

  try {
    if (role === 'system') {
      messageDiv.textContent = content;
    } else if (role === 'user') {
      messageDiv.textContent = content;
      chatHistory.push({ role: 'user', content });
    } else {
      const htmlContent = marked.parse(content, {
        highlight: function(code, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(code, { language: lang }).value;
            } catch (err) {
              console.error('Highlight error:', err);
            }
          }
          return code;
        }
      });
      messageDiv.innerHTML = htmlContent;
      chatHistory.push({ role: 'assistant', content });

      messageDiv.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
    }
  } catch (error) {
    console.error('Message parsing error:', error);
    messageDiv.textContent = content;
  }
  
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function askChatGPT(prompt, context) {
  try {
    const result = await chrome.storage.local.get(['openaiApiKey']);
    if (!result.openaiApiKey) {
      throw new Error('API key not found. Please set it in the extension options.');
    }

    const messages = [
      { role: 'system', content: 'You are a helpful assistant. You will help the user understand and analyze the provided text context.' },
      { role: 'user', content: `Here is the text I want to discuss:\n\n${context}` }
    ];

    const recentHistory = chatHistory.slice(-20);
    messages.push(...recentHistory);

    messages.push({ role: 'user', content: prompt });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${result.openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get response from ChatGPT');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error in askChatGPT:', error);
    throw error;
  }
}

