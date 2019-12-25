# Rust WASM Image Viewer

This project serves as an example of how to use Rust language compiled into wasm to read and operate on images openned in internet browser.

I haven't figured out yet how to work outh github.io hosting just yet. So you'll have to build the project on your machine for demonstartion. I promise I'll get to it asap.

## Building

The command lines on the file named compile is used to compile the rust into wasm and move the reuslting static files to a servable directory. You can either use it as is, or copy and modify the commands to your likings.

## Running

Although the resulting files are 100% running on the client side. Due to cross-origin security issues, almost all browsers require that you serve the contents of the project from a webserver. I use Nginx with added the wasm mime type to Nginx configuration, by adding the line to the suitable config file (mime.types in my case).
```
type application/wasm                      wasm;
```
Another simpler route will be using Python and python simpeHTTPServer however you'll have to figure out the configuration.

Then open `http://localhost:8000` to view the example.