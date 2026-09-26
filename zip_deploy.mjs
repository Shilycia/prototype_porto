import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createDeployZip() {
  const output = fs.createWriteStream(path.join(__dirname, 'deploy.zip'));
  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });

  output.on('close', function() {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
  });

  archive.on('error', function(err) {
    throw err;
  });

  archive.pipe(output);

  // Function to filter out node_modules, .git, dist, etc.
  const ignore = ['node_modules/**', 'dist/**', '.git/**', '.github/**', 'deploy.zip', 'zip_deploy.js', 'portfolio-mobile/**'];

  // Add landing
  archive.glob('**/*', { 
    cwd: path.join(__dirname, 'landing'),
    ignore: ignore,
    dot: true
  }, { prefix: 'landing' });

  // Add portfolio-api as fortofolio_api
  archive.glob('**/*', { 
    cwd: path.join(__dirname, 'portfolio-api'),
    ignore: ignore,
    dot: true
  }, { prefix: 'fortofolio_api' });

  // Add portfolio-web as fortofolio_web
  archive.glob('**/*', { 
    cwd: path.join(__dirname, 'portfolio-web'),
    ignore: ignore,
    dot: true
  }, { prefix: 'fortofolio_web' });

  await archive.finalize();
}

createDeployZip();
