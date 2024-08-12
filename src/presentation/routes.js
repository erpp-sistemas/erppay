import { Router } from 'express';
import { EdoCtaRoutes } from './edocta/routes.js';


export class AppRoutes {


    static get routes() {
        const router = Router();

        router.use('/api/edo-cta', EdoCtaRoutes.routes)

        return router;
    }

}