import { envs } from '../../config/envs.js';
import { StorageAdapter } from '../../config/storage.adapter.js';
import { EdoCtaService } from '../../services/edo-cta.service.js';
import axios from 'axios';


export class EdoCtaController {

    storage;

    constructor() {
        this.storage = StorageAdapter.instance
    }


    message = (req, res) => {
        res.json({ message: 'Hola desde el EdoCtaController' });
    }

    generateEdocta = async (req, res) => {
        let { account } = req.body;
        EdoCtaService.getInfoAccount(account).then(data => {
            const { clave_catastral, propietario, adeudo_contribuyente, domicilio_contribuyente, cat_tipo_predio, cat_tipo_uso_suelo, valor_catastral_contribuyente, plaza } = data;
            const { tipo_predio } = cat_tipo_predio;
            const { tipo_uso_suelo } = cat_tipo_uso_suelo;
            const domicilio_contribuyente_row = domicilio_contribuyente[0];
            const valor_catastral_contribuyente_row = valor_catastral_contribuyente[0];

            EdoCtaService.generatePdf(plaza, account, propietario, adeudo_contribuyente, clave_catastral, domicilio_contribuyente_row, valor_catastral_contribuyente_row, tipo_predio, tipo_uso_suelo).then(pdf => {

                const date = new Date();
                const fecha = date.toISOString();
                this.storage.uploadFile(pdf, 'estados_cuenta', `${account}-${fecha}.pdf`)
                    .then(file_url => {
                        res.status(200).json({
                            option_name: 'Selección de numero de cuenta',
                            message: `Tu estado de cuenta se genero con éxito, lo puedes visualizar en la siguiente liga\n${file_url}`
                        })
                    }).catch(error => res.status(400).json({ error: 'Error al subir el archivo ', error }))

            }).catch(error => res.status(500).json({ error: 'Error al generar el pdf ', error }))

        }).catch(error => res.status(500).json({ error: 'Error al obtener la data ', error }))

    }


    getLinkWaopay = async (req, res) => {
        let { account } = req.body;
        EdoCtaService.getInfoAccount(account).then(data => {
            console.log(data)
            const { plaza, propietario, adeudo_contribuyente, contacto_contribuyente } = data;
            const obj_waopay = EdoCtaService.createLinkWaopay(plaza, propietario, adeudo_contribuyente, contacto_contribuyente)

            const config = {
                headers: {
                    'Authorization': `Bearer ${envs.AUTHORIZATION}`
                },
                data: obj_waopay
            };

            axios.get(envs.URL_WAOPAY, config)
                .then(data => {
                    const url = data.data.url
                    res.status(200).json({
                        option_name: 'Selección de numero de cuenta',
                        message: `Puedes ingresar a la siguiente liga para realizar tu pago\n${url}`,
                        options: [
                            
                        ]
                    })
                })
        })
    }

    getResponseWaopay = async (req, res) => {
        const { status, whatsapp } = req.body;
        console.log(status, whatsapp)
        EdoCtaService.insertResponseWaopay(req.body)
            .then(async data => {
                if (status === "paid") {
                    await this.sendMessageAfterPayIntent(whatsapp, '52ba4e24-c5f1-47ba-b251-71713e70a79f');
                } else {
                    await this.sendMessageAfterPayIntent(whatsapp, '');
                }
                res.status(200).json({ message: 'Data insert success' })
            }).catch(error => res.status(400).json({ message: 'Error on insert data' }))
    }


    sendMessageAfterPayIntent = async (phone_number, id_template) => {
        try {
            const response = await axios.post(
                'https://app.mercately.com/retailers/api/v1/whatsapp/send_notification_by_id',
                {
                    phone_number: phone_number,
                    internal_id: id_template,
                    template_params: [],
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'api-key': envs.API_KEY_MERCATELY
                    }
                }
            );
            return response;
        } catch (error) {
            console.error('Error sending notification:', error);
        }

    }


    validateAndSaveEmail = async (req, res) => {
        const { email } = req.body;
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isEmail = regex.test(email)
        if (isEmail) {
            EdoCtaService.saveEmail(req.body).then(message => {
                res.status(200).json({
                    option_name: 'Selección de numero de cuenta',
                    message: `Su factura será enviada en el emaoñ proporcionado en un lapso de 24 horas`
                })
            })
        }
    }


}