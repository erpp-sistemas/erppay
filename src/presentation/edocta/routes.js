import express from 'express';
import { EdoCtaController } from './controller.js'
import { EdoCtaMiddleware } from '../middlewares/edo-cta.js';


export class EdoCtaRoutes {


    static get routes() {

        const router = express.Router();


        const edoCtaController = new EdoCtaController();

        router.get('/message', edoCtaController.message);
        router.post('/generate-edocta', EdoCtaMiddleware.validateToken, edoCtaController.generateEdocta)
        router.post('/getlink-waopay', EdoCtaMiddleware.validateToken, edoCtaController.getLinkWaopay)


        return router;

    }


}









