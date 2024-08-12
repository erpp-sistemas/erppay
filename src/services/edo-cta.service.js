import { prisma } from '../data/sqlserver/index.js';
import { edoCtaCuautitlanIzcalliPredio } from '../templates/edoCta.js';
import { PdfCreate } from '../config/pdf-create.adapter.js';


export class EdoCtaService {

    edo_cta_obj = {
        1: edoCtaCuautitlanIzcalliPredio
    }

    static async getInfoAccount(account) {
        const data = await prisma.contribuyente.findUnique({
            where: {
                cuenta: account
            },
            include: {
                adeudo_contribuyente: true,
                domicilio_contribuyente: true,
                cat_tipo_predio: true,
                cat_tipo_uso_suelo: true,
                valor_catastral_contribuyente: true,
                plaza: true
            }
        })
        return data;
    }


    static async generatePdf(place_id, account, owner, debtArr, clave_cat, address_obj, value_cat_obj, tipo_predio, tipo_uso_suelo) {
        //const fnGenerateEdoCta = edo_cta_obj[place_id];
        const content = edoCtaCuautitlanIzcalliPredio(account, owner, debtArr, address_obj, clave_cat, value_cat_obj, tipo_predio, tipo_uso_suelo);
        
        try {
            //const pdf = await PdfCreate.createPdf('https://www.ser0.mx');
            const pdf = await PdfCreate.createPdf(content);
            return pdf;
        } catch (error) {
            console.log(error)
        }


    }



}