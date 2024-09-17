import puppeteer from 'puppeteer';

export class PdfCreate {

    static async createPdf(content) {

        let browser;

        try {
            browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                timeout: 60000, // Aumentar el timeout a 60 segundos
            });

            const page = await browser.newPage();
            await page.setContent(content, {
                waitUntil: 'networkidle0',
            });

            const pdf = await page.pdf({
                format: 'letter',    
                landscape: true,     
                printBackground: true
            });

            return pdf
        } catch (error) {
            console.error('Error generando el PDF:', error);
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }

}