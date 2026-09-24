# JSX TODO Comments

A lightweight VS Code extension designed to highlight TODO-like comments inside JSX/TSX blocks such as:

```tsx
{/* TODO: formulario para crear un todo */}
```

This is inspired by the idea behind Better Comments, but built for JSX/TSX and similar comment styles that Better Comments does not highlight automatically.

## Features

- Highlights TODO, FIXME, BUG, and HACK markers inside JSX comment blocks
- Keeps the surrounding JSX braces `{}` untouched
- Applies a bold orange color by default
- Works in JavaScript and TypeScript files, including React JSX/TSX

## Example

```tsx
return (
  <div>
    {/* TODO: formulario para crear un todo */}
    <h1>Rest Todos Page</h1>
  </div>
);
```

## Configuration

You can customize the pattern and color in your VS Code settings:

```json
"jsxTodoComments.pattern": "TODO|FIXME|BUG|HACK",
"jsxTodoComments.color": "#FF8C00"
```

## Why this extension exists

Better Comments is great for regular comments, but it does not treat JSX comments like `{/* ... */}` as standard language comments. This extension fills that gap for React and TypeScript/JavaScript projects that use JSX comments for TODO tracking.

## Support

If you enjoy this extension and want to support its development, you can donate here:

https://buymeacoffee.com/escobarmatj

## License

MIT
