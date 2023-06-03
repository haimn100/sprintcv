import { promises } from 'fs';
import path from 'path';
import fs from 'fs';


export const sleep = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const rootPath = path.dirname(path.resolve(process.cwd(), 'package.json'));

const resourceFolder = path.resolve(rootPath, 'resources');


async function saveTextToFile(text: string, filename: string) {
    try {
        await promises.writeFile(filename, text);
        console.log(`Text saved to ${filename} successfully.`);
    } catch (error) {
        console.error(`Error saving text to ${filename}:`, error);
    }
}

export async function saveCookies(provider: string, cookies: any) {
    await saveTextToFile(JSON.stringify(cookies), `${resourceFolder}/${provider}-cookies.json`);
}

export async function getCookies(provider: string): Promise<any> {
    const fileName = `${resourceFolder}/${provider}-cookies.json`;
    try {
        const cookies = await promises.readFile(fileName, 'utf8');
        return JSON.parse(cookies);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            console.log('File does not exist.', fileName);
        } else {
            console.error('Error occurred while reading the file:', error);
        }
    }
    return null;
}

export function getFileSize(filePath: string) {
    try {
        const stats = fs.statSync(filePath);
        return stats.size;
    } catch (err) {
        console.error('Error getting file size:', err);
        return null;
    }
}

export function getStringByteSize(str: string) {
    const buffer = Buffer.from(str, 'utf8');
    return buffer.byteLength;
}

export function getResumeFilePath(): string {
    return path.resolve(__dirname, '../../../service/resources/resume.pdf');
}