import * as vscode from "vscode";

function getDividerToken(): string {
  const config = vscode.workspace.getConfiguration("printDivider");
  return config.get("token", "-") || "-"; // Default is '-' if not set
}

export function activate(context: vscode.ExtensionContext) {
  console.log('"Print Divider" extension is now active!');

  // Command to configure the divider
  let configureDividerCommand = vscode.commands.registerCommand(
    "print-divider.configureDivider",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor found!");
        return;
      }

      // Ask user for the token
      const token =
        (await vscode.window.showInputBox({
          prompt: "Enter the token for the divider (e.g., -, =, *)",
          value: getDividerToken(), // Use the current global token as default
        })) || "-";

      await vscode.workspace
        .getConfiguration("printDivider")
        .update("token", token, vscode.ConfigurationTarget.Global);

      // Show confirmation
      vscode.window.showInformationMessage(`Divider token set to "${token}".`);
    }
  );

  // Command to insert the divider at the current cursor position
  let insertDividerCommand = vscode.commands.registerCommand(
    "print-divider.insertDivider",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor found!");
        return;
      }

      const printWidth = 80;

      const token = getDividerToken();
      const divider = token.repeat(printWidth).slice(0, printWidth);

      // Generate the language-specific print statement
      const languageId = editor.document.languageId;
      let printStatement: string;

      switch (languageId) {
        case "java":
          printStatement = `System.out.println("${divider}");`;
          break;
        case "python":
          printStatement = `print("${divider}")`;
          break;
        case "javascript":
        case "typescript":
          printStatement = `console.log("${divider}");`;
          break;
        case "c":
        case "cpp":
          printStatement = `printf("${divider}\\n");`;
          break;
        case "csharp":
          printStatement = `Console.WriteLine("${divider}");`;
          break;
        case "php":
          printStatement = `echo "${divider}\\n";`;
          break;
        case "ruby":
          printStatement = `puts "${divider}"`;
          break;
        case "swift":
          printStatement = `print("${divider}")`;
          break;
        case "go":
          printStatement = `fmt.Println("${divider}")`;
          break;
        case "rust":
          printStatement = `println!("${divider}");`;
          break;
        default:
          printStatement = divider; // Fallback to the raw divider if language is unknown
      }

      // Insert the print statement at the current cursor position
      editor.edit((editBuilder) => {
        editBuilder.insert(editor.selection.active, printStatement);
      });
    }
  );

  // Register commands
  context.subscriptions.push(configureDividerCommand);
  context.subscriptions.push(insertDividerCommand);

  console.log("Print Divider is ready to use!");
}
