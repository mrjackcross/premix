# premix

## Setup

The repo includes a pre-built JavaScript bundle for testing.

If you have Python installed, open a terminal in the repo root and run `python -m SimpleHTTPServer` to serve the files on a localhost port (:8000 by default).

Alternatively you can run the repo from within a regular *AMP setup.

## Editing

Install [Node](https://nodejs.org/)

Run `npm install` from the root.  This will install all dependencies.

Run `webpack --watch` from the root to build the JavaScript and start a watcher that will re-build if the files change.  JavaScript is bundled and output to the `public` directory.


