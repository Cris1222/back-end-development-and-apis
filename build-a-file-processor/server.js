const http = require("http");
const fs = require('fs');
const crypto = require('crypto');
const os = require("os");
const path = require("path")
// 1. Crea los flujos de lectura y escritura
const readStream = fs.createReadStream('assets/poem.txt');
const writeStream = fs.createWriteStream('assets/stream-output.txt');

// 2. Conecta la salida de la lectura directamente a la entrada de la escritura
readStream.pipe(writeStream);