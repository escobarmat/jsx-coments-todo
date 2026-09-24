import * as vscode from 'vscode';

const SUPPORTED_LANGUAGES = new Set([
  'javascript',
  'javascriptreact',
  'typescript',
  'typescriptreact',
]);

function getPattern(): RegExp {
  const config = vscode.workspace.getConfiguration('jsxTodoComments');
  const pattern = config.get<string>('pattern', 'TODO|FIXME|BUG|HACK');

  return new RegExp(`\\{\\s*\\/\\*\\s*((?:${pattern})\\b[^*]*)\\*\\/\\s*\\}`, 'gi');
}

export function activate(context: vscode.ExtensionContext) {
  const decoration = vscode.window.createTextEditorDecorationType({
    color: vscode.workspace.getConfiguration('jsxTodoComments').get<string>('color', '#FF8C00'),
    fontWeight: 'bold',
  });

  const updateDecorations = (editor?: vscode.TextEditor) => {
    if (!editor) {
      return;
    }

    if (!SUPPORTED_LANGUAGES.has(editor.document.languageId)) {
      editor.setDecorations(decoration, []);
      return;
    }

    const text = editor.document.getText();
    const ranges: vscode.Range[] = [];
    const regex = getPattern();

    for (const match of text.matchAll(regex)) {
      const matchStart = match.index ?? 0;
      const commentStart = matchStart + match[0].indexOf('/*');
      const commentEnd = matchStart + match[0].indexOf('*/') + 2;
      ranges.push(new vscode.Range(
        editor.document.positionAt(commentStart),
        editor.document.positionAt(commentEnd),
      ));
    }

    editor.setDecorations(decoration, ranges);
  };

  const trigger = () => {
    const editor = vscode.window.activeTextEditor;
    updateDecorations(editor);
  };

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(trigger),
    vscode.window.onDidChangeTextEditorSelection(trigger),
    vscode.workspace.onDidChangeTextDocument((event) => {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document === event.document) {
        updateDecorations(editor);
      }
    }),
    vscode.workspace.onDidChangeConfiguration(() => {
      const editor = vscode.window.activeTextEditor;
      updateDecorations(editor);
    }),
  );

  trigger();
}

export function deactivate() {
  // no-op
}
