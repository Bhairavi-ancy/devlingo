
const path = require("path");
const vscode = require("vscode");
const dotEnv = require('dotenv');
dotEnv.config({
  path: path.join(__dirname, ".env"), 
  quiet: true,
});

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    let disposable = vscode.commands.registerCommand("devLingo.helloWorld", async function () {
        // vscode.window.showInformationMessage("DevLingo: Translating text...");

        console.log("processenv : ", process.env)
        
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("No active editor found!");
            return;
        }

        const selection = editor.selection;
        const text = editor.document.getText(selection);
        if (!text) {
            vscode.window.showErrorMessage("Please select some text to translate.");
            return;
        }

        // 🌐 Microsoft Translator endpoint
        const url =
            "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=es";

        const translatorKey = process.env.TRANSLATOR_KEY;
        if (!translatorKey) {
            // vscode.window.showErrorMessage("Translator key not found in environment variables.");
            return;
        }

        const options = {
            method: "POST",
            headers: {
                "Ocp-Apim-Subscription-Key": translatorKey,
                "Ocp-Apim-Subscription-Region": "centralindia",
                "Content-Type": "application/json"
            },
            body: JSON.stringify([{ text }])
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();

            console.log("Translation API response:", JSON.stringify(result, null, 2));

            // ✅ Extract translations
            let translatedText = "";
            if (Array.isArray(result) && result[0]?.translations) {
                translatedText = result[0].translations
                    .map(t => `${t.text}`)
                    .join(" | ");
            } else {
                translatedText = "Translation failed.";
            }

            // Replace selection with translated text
            editor.edit(editBuilder => {
                editBuilder.replace(selection, translatedText);
            });

            vscode.window.showInformationMessage("Translation successful!");
        } catch (error) {
            console.error("Translation failed:", error);
            vscode.window.showErrorMessage("Failed to translate text. Check console for details.", error);
        }
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
