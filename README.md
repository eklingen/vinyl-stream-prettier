# Small vinyl-stream wrapper -aka Gulp plugin- for prettier

Run prettier within your streams. Supports automatic fixing of files. Also has a fast method for more speed, and a slow method for more control.

> _NOTE:_ No tests have been written yet!

## Installation

`yarn install`. Or `npm install`. Or just copy the files to your own project.

## Usage

```javascript
const prettierWrapper = require("@eklingen/vinyl-stream-prettier");
stream.pipe(prettierWrapper());
```

This package assumes a configuration dotfile where prettier can find it.

## Options

You have the following options:

### `failAfterError`

This will determine wether to fail or not. Useful in a pre-commit hook, for example.

```javascript
prettierWrapper({
  failAfterError: true,
});
```

### `prettier`

These options are passed verbatim to prettier. See the ["prettier"](https://www.npmjs.com/packages/prettier) documentation for more details.

```javascript
prettierWrapper({
  prettier: {
    fix: false,
  },
});
```

## Dependencies

This package requires ["prettier"](https://www.npmjs.com/package/prettier).

---

Copyright (c) 2023 Elco Klingen. MIT License.
