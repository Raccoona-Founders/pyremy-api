import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import Axios, { AxiosInstance } from 'axios';
import Config from 'src/config';
import { OptMethods } from 'src/optimisation/opt-methods.enum';
import { PortfolioDto } from 'src/dto/portfolio.dto';


@Injectable()
export class PyremyService {
    public client: AxiosInstance;

    public constructor() {
        this.client = Axios.create({
            baseURL: Config.PyremyURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    public async checkConnection(): Promise<any> {
        try {
            await this.client.get('/test');

            return true;
        } catch (error) {
            console.error(error.message);

            return false;
        }
    }


    public async portfolio(
        currencies: string[],
        risk: number = 5,
        method: OptMethods = OptMethods.Markowitz,
    ): Promise<PortfolioDto> {
        const requestData = {
            currencies: _.map(currencies, (c: string) => {
                return {
                    name: c.toUpperCase(),
                };
            }),
            risk_aversion_coeff: risk,
        };

        const { data } = await this.client.post('/portfolios', requestData, {
            params: {
                method: method,
            },
        });

        return new PortfolioDto(data);
    }
}
