const fs = require('fs');
const fsp = require('fs').promises;
const path = require("path")
const sharp = require('sharp');

const srcDir = __dirname.replace('/.dev', '/.src');
const distDir = __dirname.replace('/.dev', '');

/*
Recursively List All the Files in a Directory Using Node.js
https://gist.github.com/kethinov/6658166
*/
const walk = async (dir, filelist = []) => {
    const files = await fsp.readdir(dir);

    for (file of files) {
        const filepath = path.join(dir, file);
        const stat = await fsp.stat(filepath);

        if (stat.isDirectory()) {
            filelist = await walk(filepath, filelist);
        } else {
            filelist.push(filepath);
        }
    }

    return filelist;
}


/*
Images du slider
- coté le plus court 500px
- mozJPEG et Webp
*/
walk(srcDir + "/assets/images/slider").then((res) => {
    for (image of res) {
        const fileBasename = path.basename(image, path.extname(image));
        const outputPath = path.dirname(image).replace(srcDir, distDir);
        fs.mkdirSync(outputPath, { recursive: true })

        const arrayOfImageSizes = [640, 1280, 1920]
        for (imageSize of arrayOfImageSizes) {
            sharp(image)
                .resize({ width: imageSize, })
                .webp({ effort: 6, })
                .toFile(`${outputPath}/${fileBasename}-${imageSize}w.webp`)
            sharp(image)
                .resize({ width: imageSize, })
                .jpeg({ mozjpeg: true, })
                .toFile(`${outputPath}/${fileBasename}-${imageSize}w.jpg`)
        }
    }
})


/*
Images de la galeries
- coté le plus court 500px
- mozJPEG
*/
walk(srcDir + "/assets/images/gallery").then((res) => {
    for (image of res) {
        const fileBasename = path.basename(image, path.extname(image));
        const outputPath = path.dirname(image).replace(srcDir, distDir);
        fs.mkdirSync(outputPath, { recursive: true })

        // la balise picture ne fonctionne pas dans la galerie donc pas de webp ?
        sharp(image)
            .resize(500, 500, { fit: 'outside', })
            .webp({ effort: 6, })
            .toFile(`${outputPath}/${fileBasename}.webp`)
        }
})


/*
Autres images
- coté le plus court 500px
- mozJPEG et Webp
*/
const arrayOfAssets = [`${srcDir}/assets/images/camera.png`, `${srcDir}/assets/images/nina.png`]
for (image of arrayOfAssets) {
    const fileBasename = path.basename(image, path.extname(image));
    const outputPath = path.dirname(image).replace(srcDir, distDir);
    fs.mkdirSync(outputPath, { recursive: true })

    sharp(image)
        .resize(500, 500, { fit: 'outside', })
        .jpeg({ mozjpeg: true, })
        .toFile(`${outputPath}/${fileBasename}.jpg`)
    sharp(image)
        .resize(500, 500, { fit: 'outside', })
        .webp({ effort: 6, })
        .toFile(`${outputPath}/${fileBasename}.webp`)
}