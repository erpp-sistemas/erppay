import 'dotenv/config';
import pkg from 'env-var';
const { get } = pkg;


export const envs = {
    PORT: get('PORT').required().asPortNumber(),
    ACCESS_KEY_ID:get('ACCESS_KEY_ID').required().asString(),
    SECRET_ACCESS_KEY: get('SECRET_ACCESS_KEY').required().asString(),
    REGION: get('REGION').required().asString(),
}