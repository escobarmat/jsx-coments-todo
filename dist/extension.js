"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const SUPPORTED_LANGUAGES = new Set([
    'javascript',
    'javascriptreact',
    'typescript',
    'typescriptreact',
]);
function getPattern() {
    const config = vscode.workspace.getConfiguration('jsxTodoComments');
    const pattern = config.get('pattern', 'TODO|FIXME|BUG|HACK');
    return new RegExp(`\\{\\s*\\/\\*\\s*((?:${pattern})\\b[^*]*)\\*\\/\\s*\\}`, 'gi');
}
function activate(context) {
    const decoration = vscode.window.createTextEditorDecorationType({
        color: vscode.workspace.getConfiguration('jsxTodoComments').get('color', '#FF8C00'),
        fontWeight: 'bold',
    });
    const updateDecorations = (editor) => {
        if (!editor) {
            return;
        }
        if (!SUPPORTED_LANGUAGES.has(editor.document.languageId)) {
            editor.setDecorations(decoration, []);
            return;
        }
        const text = editor.document.getText();
        const ranges = [];
        const regex = getPattern();
        for (const match of text.matchAll(regex)) {
            const matchStart = match.index ?? 0;
            const commentStart = matchStart + match[0].indexOf('/*');
            const commentEnd = matchStart + match[0].indexOf('*/') + 2;
            ranges.push(new vscode.Range(editor.document.positionAt(commentStart), editor.document.positionAt(commentEnd)));
        }
        editor.setDecorations(decoration, ranges);
    };
    const trigger = () => {
        const editor = vscode.window.activeTextEditor;
        updateDecorations(editor);
    };
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(trigger), vscode.window.onDidChangeTextEditorSelection(trigger), vscode.workspace.onDidChangeTextDocument((event) => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document === event.document) {
            updateDecorations(editor);
        }
    }), vscode.workspace.onDidChangeConfiguration(() => {
        const editor = vscode.window.activeTextEditor;
        updateDecorations(editor);
    }));
    trigger();
}
function deactivate() {
    // no-op
}
