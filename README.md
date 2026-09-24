# JSX TODO Comments

Colorize task and issue markers inside React JSX and TSX comments:

```tsx
{/* TODO: add the create-todo form */}
```

This extension is inspired by [Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments), but is focused on JSX comment blocks such as `{/* ... */}`. It keeps the JSX braces untouched and highlights the comment delimiters and text.

## Features

- Supports JavaScript, JSX, TypeScript, and TSX.
- Highlights `TODO`, `FIXME`, `BUG`, `HACK`, and `NOTE`.
- Uses a different default color for each marker.
- Updates as you edit and switch between files.
- Customizes colors through standard VS Code settings.
- Does not alter your source code.

## Supported syntax

```tsx
export function TodoList() {
  return (
    <section>
      {/* TODO: add filtering */}
      {/* FIXME: handle an empty response */}
      {/* BUG: this item can be duplicated */}
      {/* HACK: temporary API fallback */}
      {/* NOTE: revisit after the redesign */}
    </section>
  );
}
```

The extension colors `/* ... */` and its content, but leaves the JSX wrapper `{}` in the editor's normal syntax color.

## Configuration

Open VS Code settings JSON and customize any supported marker:

```json
{
  "jsxTodoComments.colors": {
    "TODO": "#FFB000",
    "FIXME": "#FF4D4F",
    "BUG": "#FF2D2D",
    "HACK": "#FFD93D",
    "NOTE": "#4DA3FF"
  }
}
```

Only the supported markers listed above are recognized. Colors accept any CSS color value supported by VS Code, such as hexadecimal values or named colors.

## Why this extension exists

Regular JavaScript comments and JSX comments are represented differently by the editor's language grammar. As a result, comment-highlighting extensions built for `// ...` and `/* ... */` may not recognize the complete JSX form `{/* ... */}`. JSX TODO Comments adds that missing, focused behavior for React projects.

## Feedback and support

Report bugs or request improvements in the [GitHub issue tracker](https://github.com/escobarmat/jsx-coments-todo/issues).

If this extension helps your workflow, you can support its development at [Buy Me a Coffee](https://buymeacoffee.com/escobarmatj).

## License

[MIT](LICENSE)
