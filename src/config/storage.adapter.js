import { envs } from './envs.js';
import { S3Client } from "@aws-sdk/client-s3"
import { Upload } from '@aws-sdk/lib-storage';
import { Readable } from 'stream';


export class StorageAdapter {

    static _instance;
    s3Client;

    region = envs.REGION;
    access_key_id = envs.ACCESS_KEY_ID;
    secret_access_key = envs.SECRET_ACCESS_KEY;

    bucket_name;

    constructor(options) {
        this.s3Client = new S3Client({
            region: this.region,
            credentials: {
                accessKeyId: this.access_key_id,
                secretAccessKey: this.secret_access_key
            }
        })
        this.bucket_name = options.bucket_name;
    }

    static get instance() {
        if (!StorageAdapter._instance) {
            throw 'StorageAdapter is not initialized';
        }

        return StorageAdapter._instance;
    }

    static initStorage(options) {
        StorageAdapter._instance = new StorageAdapter(options);
    }


    async uploadFile(pdf_file, folder_name, file_name) {
        const pdfStream = new Readable();
        pdfStream._read = () => { };
        pdfStream.push(pdf_file);
        pdfStream.push(null);

        const uploadParams = {
            Bucket: this.bucket_name,
            Key: `${folder_name}/${file_name}`,
            Body: pdfStream,
            ContentType: 'application/pdf',
        };

        try {

            const parallelUploads3 = new Upload({
                client: this.s3Client,
                params: uploadParams,
                leavePartsOnError: false, // Optional
            });

            parallelUploads3.on('httpUploadProgress', (progress) => {});
            const data = await parallelUploads3.done();
            //console.log('Archivo subido exitosamente:', data);

            const fileUrl = `https://${this.bucket_name}.s3.${this.region}.amazonaws.com/${folder_name}/${file_name}`;

            return fileUrl;
        } catch (err) {
            console.error('Error al subir el archivo:', err);
            throw err;
        }

    }





}