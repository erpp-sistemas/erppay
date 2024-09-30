import { prisma } from '../data/sqlserver/index.js';
import { edoCtaCuautitlanIzcalliPredio } from '../templates/edoCta.js';
import { PdfCreate } from '../config/pdf-create.adapter.js';


export class EdoCtaService {

    static edo_cta_obj = {
        1: {
            fnGenerateEdoCta: edoCtaCuautitlanIzcalliPredio,
            concept: 'Pago predial'
        },
        2: {
            fnGenerateEdoCta: edoCtaCuautitlanIzcalliPredio,
            concept: 'Pago derechos de agua'
        }
    }

    static async getInfoAccount(account) {
        const data_db = await prisma.contribuyente.findUnique({
            where: {
                cuenta: account
            },
            include: {
                adeudo_contribuyente: true,
                domicilio_contribuyente: true,
                cat_tipo_predio: true,
                cat_tipo_uso_suelo: true,
                valor_catastral_contribuyente: true,
                contacto_contribuyente: true,
                plaza: true
            }
        })
        return data_db;
    }


    static async generatePdf(plaza, account, owner, debtArr, clave_cat, address_obj, value_cat_obj, tipo_predio, tipo_uso_suelo) {
        const { id_plaza, logo } = plaza;
        const obj = this.edo_cta_obj[id_plaza];
        const fnEdoCta = obj.fnGenerateEdoCta;
        const content = fnEdoCta(logo, account, owner, debtArr, address_obj, clave_cat, value_cat_obj, tipo_predio, tipo_uso_suelo);
        try {
            const pdf = await PdfCreate.createPdf(content);
            return pdf;
        } catch (error) {
            console.log(error)
        }
    }

    static createLinkWaopay(plaza, owner, debt_arr, contact) {
        const { id_plaza } = plaza;
        const obj = this.edo_cta_obj[id_plaza];
        const concept = obj.concept
        const total = debt_arr.reduce((acc, debt) => acc + Number(debt.sub_total), 0);
        const fecha_corte = debt_arr[0].fecha_corte;
        const reference = debt_arr[0].reference;
        const whatsapp = contact[0].numero_celular;
        
        const data = {
            client_name: owner,
            client_lastname: "",
            email: 'antonio.ticante12@gmail.com',
            whatsapp: whatsapp,
            reference: reference,
            concepts: [
                {
                    id: "NA",
                    title: concept,
                    qty: "1",
                    price: total
                }
            ],
            subtotal: total,
            shipping_status: "0",
            shipping_amount: "0",
            total: total,
            currency: "MXN",
            expiration: `${fecha_corte.toString().split('T')[0]} 12:00:00`
        }

        return data;
    }


    static async insertResponseWaopay(data) {
        try {
            const insert = await prisma.pago_waopay.create({ data });
            return insert;
        } catch (error) {
            console.error(error);
        }
    }



}