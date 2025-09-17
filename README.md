# DevLingo

Translate selected text inside VS Code using Microsoft Translator.

## Features

- Select text in the editor and run **DevLingo: Translator** from the command palette.
- Automatically translates from English into Spanish.
- Replaces the selected text with the translated version.

## Usage

1. Select any text in the editor.
2. Run the command: `DevLingo: Translator`.
3. The translated text replaces your selection.

## Requirements

- Internet connection
- A valid Microsoft Translator subscription key & region

## Extension Settings

Currently, target languages are fixed to Spanish (`es`).  
Future versions will support custom languages.

## Known Issues

- Translation may fail if your API key is invalid or expired.
- Large selections may take longer to translate.

## Release Notes

### 0.0.1
- Initial release: text selection + translation.
