import * as vscode from 'vscode';

const SUPPORTED_LANGUAGES = new Set([
  'javascript',
  'javascriptreact',
  'typescript',
  'typescriptreact',
]);

const DEFAULT_RULES = [
  { tag: 'TODO', color: '#FFB000', fontWeight: 'bold' },
  { tag: 'FIXME', color: '#FF4D4F', fontWeight: 'bold' },
  { tag: 'BUG', color: '#FF2D2D', fontWeight: 'bold' },
  { tag: 'HACK', color: '#FFD93D', fontWeight: 'bold' },
  { tag: 'NOTE', color: '#4DA3FF', fontWeight: 'normal' },
];

function getRules(): Array<{ tag: string; color: string; fontWeight: string }> {
  const config = vscode.workspace.getConfiguration('jsxTodoComments');
  const custom = config.get<Record<string, string>>('colors', {});

  return DEFAULT_RULES.map((rule) => ({
    ...rule,
    color: custom[rule.tag] ?? rule.color,
  }));
}

function getPattern(): RegExp {
  const rules = getRules();
  const tags = rules.map((rule) => rule.tag).join('|');
  return new RegExp(`\\{\\s*\\/\\*\\s*((?:${tags})\\b[^*]*)\\*\\/\\s*\\}`, 'gi');
}

export function activate(context: vscode.ExtensionContext) {
  const updateDecorations = (editor?: vscode.TextEditor) => {
    if (!editor) {
      return;
    }

    if (!SUPPORTED_LANGUAGES.has(editor.document.languageId)) {
      return;
    }

    const text = editor.document.getText();
    const rules = getRules();

    for (const rule of rules) {
      const decoration = vscode.window.createTextEditorDecorationType({
        color: rule.color,
        fontWeight: rule.fontWeight,
      });

      const ranges: vscode.Range[] = [];
      const regex = new RegExp(`\\{\\s*\\/\\*\\s*(${rule.tag})\\b[^*]*\\*\\/\\s*\\}`, 'gi');

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
      context.subscriptions.push(decoration);
    }
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
