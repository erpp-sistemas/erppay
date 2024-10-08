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
                            {
                                key: "1",
                                value: "Menu principal"
                            },
                            {
                                key: "2",
                                value: "Salir"
                            }
                        ]
                    })
                })
        })
    }

    getResponseWaopay = async (req, res) => {
        const { status, whatsapp } = req.body;
        console.log(status);
        console.log(whatsapp);
        EdoCtaService.insertResponseWaopay(req.body)
            .then(async data => {
                if (status === "paid") {
                    await this.sendMessage(whatsapp);
                }
                res.status(200).json({ message: 'Data insert success' })
            }).catch(error => res.status(400).json({ message: 'Error on insert data' }))
    }


    sendMessage = async (phone_number) => {
        try {
            const response = await axios.post(
                'https://app.mercately.com/retailers/api/v1/whatsapp/send_notification_by_id',
                {
                    phone_number: phone_number,
                    internal_id: '56de6d07-e340-4e6a-8331-9b41e41c724a',
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


}