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
            const { id_plaza, clave_catastral, propietario, adeudo_contribuyente, domicilio_contribuyente, cat_tipo_predio, cat_tipo_uso_suelo, valor_catastral_contribuyente } = data;
            const { tipo_predio } = cat_tipo_predio;
            const { tipo_uso_suelo } = cat_tipo_uso_suelo;
            const domicilio_contribuyente_row = domicilio_contribuyente[0];
            const valor_catastral_contribuyente_row = valor_catastral_contribuyente[0];

            EdoCtaService.generatePdf(id_plaza, account, propietario, adeudo_contribuyente, clave_catastral, domicilio_contribuyente_row, valor_catastral_contribuyente_row, tipo_predio, tipo_uso_suelo).then(pdf => {

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
            const { propietario, adeudo_contribuyente } = data;
            const obj_waopay = EdoCtaService.createLinkWaopay(propietario, adeudo_contribuyente)

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


}