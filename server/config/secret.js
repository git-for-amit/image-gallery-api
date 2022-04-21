import { randomBytes } from 'crypto';

let secretValue = randomBytes(64).toString('hex');
export class Secret {
    static get() {
        if (!secretValue) {
            secretValue = randomBytes(64).toString('hex');
        }
        console.log('value of secret ', secretValue);
        return secretValue;
    }
}