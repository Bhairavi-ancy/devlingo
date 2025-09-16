const vscode = require("vscode");
// const fetch = require("node-fetch"); // ✅ required for Node environment
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    // vscode.window.showInformationMessage("DevLingo extension activated! 🚀");

    let disposable = vscode.commands.registerCommand("devLingo.helloWorld", async function () {
        vscode.window.showInformationMessage("DevLingo: Translating text...");

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

        const options = {
            method: "POST",
            headers: {
                "Ocp-Apim-Subscription-Key": "2sVx7NJF7DbAfC41qajzM0ppklSYcAQ18vonrE5AEnC4vfFTUftZJQQJ99BIACGhslBXJ3w3AAAbACOG6KDd",
                "Ocp-Apim-Subscription-Region": "centralindia",
                "Content-Type": "application/json"
            },
            body: JSON.stringify([{ text }]) // ✅ stringify the request body
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
            vscode.window.showErrorMessage("Failed to translate text. Check console for details.",error);
        }
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
