import { Controller, Get } from '@nestjs/common';

/**
 * Class MainController
 * For health readiness and liveness check and other internal propose
 */
@Controller()
export class MainController {
    public constructor() {
    }

    @Get('liveness')
    public async livenessCheck(): Promise<object> {
        return {
            isAlive: true,
        };
    }

    @Get('readiness')
    public async readinessCheck(): Promise<object> {
        return {
            isAlive: true,
        };
    }
}
