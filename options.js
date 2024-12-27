document.addEventListener('DOMContentLoaded', async () => {
  const apiKeyInput = document.getElementById('apiKey');
  const toggleVisibilityButton = document.getElementById('toggleVisibility');

  const result = await chrome.storage.local.get(['openaiApiKey']);
  if (result.openaiApiKey) {
    apiKeyInput.value = result.openaiApiKey;
  }

  toggleVisibilityButton.addEventListener('click', () => {
    const icon = toggleVisibilityButton.querySelector('.material-icons');

    if (apiKeyInput.type === 'password') {
      apiKeyInput.type = 'text';
      icon.textContent = 'visibility_off';
    } else {
      apiKeyInput.type = 'password';
      icon.textContent = 'visibility';
    }
  });

  document.getElementById('save').addEventListener('click', async () => {
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
      showStatus('Please enter an API key', false);
      return;
    }

    try {
      await chrome.storage.local.set({ openaiApiKey: apiKey });
      showStatus('API key saved successfully!', true);

      apiKeyInput.type = 'password';
      toggleVisibilityButton.querySelector('.material-icons').textContent = 'visibility';
    } catch (error) {
      showStatus('Failed to save API key', false);
      console.error('Error saving API key:', error);
    }
  });

  document.getElementById('clear').addEventListener('click', async () => {
    try {
      await chrome.storage.local.remove('openaiApiKey');
      apiKeyInput.value = '';
      showStatus('API key cleared successfully!', true);

      apiKeyInput.type = 'password';
      toggleVisibilityButton.querySelector('.material-icons').textContent = 'visibility';
    } catch (error) {
      showStatus('Failed to clear API key', false);
      console.error('Error clearing API key:', error);
    }
  });
});

function showStatus(message, isSuccess) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = `status ${isSuccess ? 'success' : 'error'}`;
  status.style.display = 'block';

  setTimeout(() => {
    status.style.display = 'none';
  }, 3000);
}

