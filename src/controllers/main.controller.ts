import { Controller, Get, Inject, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import _ from 'lodash';
import { OptMethods, PyremyService } from 'src/optimisation';

/**
 * Class MainController
 * For health readiness and liveness check and other internal propose
 */
@Controller()
export class MainController {
    public constructor(
        @Inject(PyremyService) private readonly pyremyService: PyremyService,
    ) {
    }

    @Get()
    public async home(): Promise<object> {
        return {
            isAlive: true,
        };
    }

    @Get('status')
    public async status(): Promise<object> {
        const pyremyConnection = await this.pyremyService.checkConnection();

        return {
            pyremyConnection: pyremyConnection,
            isAlive: true,
        };
    }

    @Get('optimise')
    public async optimise(@Query() query: any, @Res() res: Response): Promise<object> {
        const currencies = _.get(query, 'currencies', '').split(',');
        if (!currencies || currencies.length < 2) {
            res.status(400).send({
                error: 'Need set currencies',
            });

            return;
        }

        let risk = +_.get(query, 'risk', 5);
        if (!Number.isInteger(risk) || risk > 10 || risk < 0) {
            risk = 5;
        }

        let method = _.get(query, 'method', OptMethods.Markowitz);
        if (![OptMethods.Markowitz, OptMethods.Weighted].includes(method)) {
            method = OptMethods.Markowitz;
        }

        try {
            const data = await this.pyremyService.portfolio(currencies, risk, method);

            res.status(200).send({
                values: data.currentWeights,
                lasts: data.getReturnsBy(4, 0.02),
                params: { currencies, risk, method },
                // return: data.getDateList(),
            });
        } catch (error) {
            res.status(400).send({
                error: error.message,
            });
        }
    }
}
