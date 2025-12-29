import { NodeIO } from '@gltf-transform/core';
import { textureCompress } from '@gltf-transform/functions';
import sharp from 'sharp';

const io = new NodeIO();

// TODO: 다른 파일에 WebP 적용 시 아래 경로 수정 필요
const FILE_PATH = '../public/samples/glb/apt-54m.glb';

console.log(`Reading ${FILE_PATH}...`);
const document = await io.read(FILE_PATH);

// Fix MIME types
for (const texture of document.getRoot().listTextures()) {
    const image = texture.getImage();
    if (image) {
        const magic = image.slice(0, 8);
        const isPNG = magic[0] === 0x89 && magic[1] === 0x50 && magic[2] === 0x4E && magic[3] === 0x47;
        if (isPNG) {
            texture.setMimeType('image/png');
            console.log('Fixed MIME type to image/png');
        }
    }
}

console.log('Compressing to WebP...');
await document.transform(
    textureCompress({
        encoder: sharp,
        targetFormat: 'webp',
        quality: 75,
    })
);

console.log(`Writing ${FILE_PATH}...`);
await io.write(FILE_PATH, document);
console.log('Done!');
