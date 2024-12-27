# ChatGPT Text Helper Chrome Extension

A Chrome extension that allows you to select text on any webpage and ask ChatGPT questions about it using a convenient side panel interface.

## Features

- 🔍 Text Selection Integration: Right-click any selected text to analyze it with ChatGPT
- 📌 Side Panel Interface: Dedicated panel for seamless interaction without leaving the page
- 💬 Conversation Context: Maintains chat history for continuous, context-aware discussions
- 🔄 Visual Feedback: Loading animation indicates when ChatGPT is generating responses
- 🎨 Markdown Support: Properly formatted responses with syntax highlighting for code
- 🔒 Secure API Key Management: Safely store and manage your OpenAI API key
- 🗑️ Clear History: Option to clear chat history while preserving API settings
- ⚡ Keyboard Shortcuts: Use Enter to send messages quickly

## Installation

1. Clone this repository:
```bash
git clone <repository-url>
```

2. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked"
   - Select the extension directory

## Configuration

1. Click the extension icon in Chrome's toolbar
2. Go to extension options (right-click the icon and select "Options")
3. Enter your OpenAI API key
4. Click "Save"

## Usage

1. Select any text on a webpage
2. Right-click and select "Ask ChatGPT"
3. The side panel will open with your selected text
4. Type your question in the input field
5. View ChatGPT's response in the chat interface
6. Continue the conversation with follow-up questions
   - The extension maintains context of the conversation
   - Visual indicator shows when ChatGPT is generating responses
   - Responses are formatted with Markdown support

## Directory Structure

```
extension/
├── manifest.json
├── background.js
├── content.js
├── sidepanel.html
├── sidepanel.js
├── options.html
├── options.js
├── lib/
│   ├── marked.min.js      # Markdown parser
│   ├── highlight.min.js   # Code syntax highlighter
│   └── github.min.css     # Code highlighting theme
└── icons/
    ├── default_16.png
    ├── default_32.png
    ├── default_48.png
    ├── default_128.png
    ├── highlight_16.png
    ├── highlight_32.png
    ├── highlight_48.png
    └── highlight_128.png
```

## Development

### Prerequisites

- Node.js and npm (for icon generation)
- Chrome browser
- OpenAI API key

### Files Description

- `manifest.json`: Extension configuration and permissions
- `background.js`: Handles context menu and side panel management
- `content.js`: Manages content script functionality
- `sidepanel.html/js`: Implements the side panel interface and chat functionality
- `options.html/js`: Manages API key configuration interface
- `lib/*`: Contains required third-party libraries for markdown parsing and code highlighting

## Implemented Libraries

The extension uses the following libraries (included in the `lib` directory):

- **marked.js**: For parsing Markdown in ChatGPT responses
- **highlight.js**: For syntax highlighting of code blocks
- **github.min.css**: GitHub theme for code highlighting

## Security

- API keys are stored securely in Chrome's local storage
- Keys are never exposed in the source code
- All communication with OpenAI API is done securely
- Content Security Policy (CSP) is properly configured

## Tips

- You can toggle the visibility of your API key in the options page
- Use the "Clear Storage" button to reset chat history
- The side panel can be resized for better viewing experience
- Markdown formatting in responses helps readability
- Chat context is maintained until you select new text
- Loading animation indicates active response generation

## Contributing

Feel free to submit issues and enhancement requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Acknowledgments

- [Marked](https://marked.js.org/) for Markdown parsing
- [highlight.js](https://highlightjs.org/) for code syntax highlighting
- Material Icons by Google
- OpenAI for ChatGPT API

