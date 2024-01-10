// Small vinyl-stream wrapper -aka Gulp plugin- for prettier.
// Supports autofixing of files.

const { relative } = require('path')
const { Transform } = require('stream')

const DEFAULT_OPTIONS = {
  failAfterError: false,
  prettier: {
    useCache: true,
    fix: true,
  },
}

function prettierWrapper(options = {}) {
  options = { ...DEFAULT_OPTIONS, ...options }
  options.prettier = { ...DEFAULT_OPTIONS.prettier, ...options.prettier }

  const prettier = require('prettier')
  const unformattedFiles = []

  async function transform(file, encoding, callback) {
    if (!file.isBuffer() || !file.contents || !file.contents.length) {
      return
    }

    const config = await prettier.resolveConfig(file.path, options.prettier)
    const fileOptions = { ...config, ...options.prettier, filepath: file.path }
    const contents = file.contents.toString('utf8')

    try {
      if (options.prettier.fix) {
        const formattedCode = await prettier.format(contents, fileOptions)

        if (formattedCode !== contents) {
          file.isPrettier = true
          file.contents = Buffer.from(formattedCode)

          return callback(null, file)
        }
      } else {
        const isFormatted = await prettier.check(contents, fileOptions)

        if (!isFormatted) {
          const filename = relative(process.cwd(), file.path).replace(/\\/g, '/')
          unformattedFiles.push(filename)
        }
      }
    } catch (error) {
      return callback(error)
    }

    return callback()
  }

  function flush(callback) {
    if (unformattedFiles.length > 0) {
      const header = 'Code style issues found in the following file(s). Forgot to run Prettier?'
      const body = unformattedFiles.join('\n')
      const message = `\n${header}\n${body}\n`

      if (options.failAfterError) {
        return callback(new Error(message))
      } else {
        console.log(message)
      }
    }

    return callback()
  }

  return new Transform({
    transform,
    flush,
    readableObjectMode: true,
    writableObjectMode: true,
  })
}

module.exports = prettierWrapper
