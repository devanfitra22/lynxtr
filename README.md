# Lynxtr

> A small, readable markup language that turns simple Lynxtr syntax into HTML and JavaScript.

Lynxtr is designed for people who want to build web pages without writing repetitive HTML boilerplate. The syntax stays close to the way a page is described: a page, a title, text, images, buttons, inputs, video, and audio.

## Features

- JavaScript-based CLI and compiler
- Human-readable `.ltr` source files
- HTML generation without a template framework
- Built-in elements: `halaman`, `judul`, `teks`, `gambar`, `tombol`, `input`, `video`, and `audio`
- Simple event actions through JavaScript
- No Python runtime required

## Quick start

```bash
npm install
node bin/lynxtr.js build examples/hello.ltr
```

The generated website is written to `dist/index.html`.

## Example

```text
halaman "Halo Dunia" {
    judul "Selamat datang"
    teks "Ini dibuat menggunakan Lynxtr."

    tombol "Klik saya" {
        aksi "alert('Halo dari Lynxtr!')"
    }

    input "Nama kamu" {
        nama "name"
    }
}
```

Compile it with:

```bash
node bin/lynxtr.js build examples/hello.ltr
```

## Syntax

| Element | Purpose |
| --- | --- |
| `halaman` | Defines the page |
| `judul` | Adds a heading |
| `teks` | Adds a paragraph |
| `gambar` | Adds an image |
| `tombol` | Adds a button |
| `input` | Adds a text input |
| `video` | Adds a video |
| `audio` | Adds an audio player |

Blocks use `{` and `}`. Strings use double quotes.

## Project status

Lynxtr is an experimental language/runtime project. The current JavaScript edition focuses on a small, predictable core instead of trying to replace HTML, CSS, and JavaScript all at once.

## License

MIT
