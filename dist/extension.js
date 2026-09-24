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
const DEFAULT_RULES = [
    { tag: 'TODO', color: '#FFB000', fontWeight: 'bold' },
    { tag: 'FIXME', color: '#FF4D4F', fontWeight: 'bold' },
    { tag: 'BUG', color: '#FF2D2D', fontWeight: 'bold' },
    { tag: 'HACK', color: '#FFD93D', fontWeight: 'bold' },
    { tag: 'NOTE', color: '#4DA3FF', fontWeight: 'normal' },
];
function getRules() {
    const config = vscode.workspace.getConfiguration('jsxTodoComments');
    const custom = config.get('colors', {});
    return DEFAULT_RULES.map((rule) => ({
        ...rule,
        color: custom[rule.tag] ?? rule.color,
    }));
}
function getPattern() {
    const rules = getRules();
    const tags = rules.map((rule) => rule.tag).join('|');
    return new RegExp(`\\{\\s*\\/\\*\\s*((?:${tags})\\b[^*]*)\\*\\/\\s*\\}`, 'gi');
}
function activate(context) {
    const updateDecorations = (editor) => {
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
            const ranges = [];
            const regex = new RegExp(`\\{\\s*\\/\\*\\s*(${rule.tag})\\b[^*]*\\*\\/\\s*\\}`, 'gi');
            for (const match of text.matchAll(regex)) {
                const matchStart = match.index ?? 0;
                const commentStart = matchStart + match[0].indexOf('/*');
                const commentEnd = matchStart + match[0].indexOf('*/') + 2;
                ranges.push(new vscode.Range(editor.document.positionAt(commentStart), editor.document.positionAt(commentEnd)));
            }
            editor.setDecorations(decoration, ranges);
            context.subscriptions.push(decoration);
        }
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
