import fs from 'fs';
import path from 'path';
import { run } from "@mermaid-js/mermaid-cli"
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

async function main(output_type, output_folder, only_diagrams) {
    const initialFolderPath = "./diagrams"
    const files = fs.readdirSync(initialFolderPath).map(fileName => {
        return path.join(initialFolderPath, fileName);
    });
    var regex = /\.(md|mmd)$/;
    const markdown_files = files.filter((file) => { return regex.test(file)})
    console.log(markdown_files);
    checkAndCreateFolder(output_folder)
    markdown_files.forEach(async (file) => {
        // await run(
        //     file, `${output_folder}/${file.split("/").pop().split(".")[0]}`.${output_type}`
        // )
        if (only_diagrams === true){
            await run(
                file, `${output_folder}/${file.split("/").pop().split(".")[0]}.${output_type}`, {puppeteerConfig: {}, quiet:false, parseMMDOptions:{backgroundColor: "transparent", viewport: {width:1080, height:920, deviceScaleFactor: 2}}}
            )
        } else {
            await run(
                file, `${output_folder}/${file.split("/").pop()}`, {puppeteerConfig: {}, outputFormat: output_type, quiet:false, parseMMDOptions:{backgroundColor: "transparent", viewport: {width:1080, height:920, deviceScaleFactor: 2}}}
            )
        }
    });
}

function checkAndCreateFolder(folderPath) {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(`Folder "${folderPath}" created.`);
    } else {
        console.log(`Folder "${folderPath}" already exists.`);
    }
}

const argv = yargs(hideBin(process.argv))
    .option('output-type', {
        describe: 'Type of output',
        default: "png",
        type: 'string'
    })
    .option('output-folder', {
        describe: 'Where the files should be stored, if the directory does not exist, it will get created.',
        default: 'out', 
        type: 'string'
    })
    .option('only-diagrams', {
        describe: 'This option makes the mermaid api only render the diagrams and not creating a markdown with the whole context next to the diagram.',
        default: true,
        type: 'boolean'
    })

    .example('npm run build -- --output-type=svg')
    .example('npm run build -- --output-type=svg --output-folder=output')
    .example('npm run build -- --output-type=png')
    .example('npm run build -- --output-type=png --output-folder=output')
    .example('npm run build -- --output-type=pdf')
    .example('npm run build -- --output-type=pdf --output-folder=output')
    .argv;
await main(argv.output_type, argv.output_folder, argv.only_diagrams);