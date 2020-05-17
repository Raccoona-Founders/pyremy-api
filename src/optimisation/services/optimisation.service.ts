import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { PortfolioDto, KunaHistoryDto } from 'src/dto';
import { OptimisationModel } from '../models';


@Injectable()
export class OptimisationService {
    public constructor(
        @InjectModel(OptimisationModel) private readonly optModel: ReturnModelType<typeof OptimisationModel>,
    ) {
    }

    public async getByUUID(uuid: string): Promise<OptimisationModel | undefined> {
        return await this.optModel.findOne({ uuid: uuid }).exec();
    }

    public check(
        startBalance: number = 10000,
        currencies: string[],
        portfolio: PortfolioDto,
        chart: Record<string, KunaHistoryDto>,
        weeks: number,
    ): any {
        const lasts = portfolio.getReturnsBy(weeks);

        const percent = 0.0025;

        let endBalance = startBalance;
        let lastPrices = [];

        let balances = _.times(currencies.length, () => 0);

        const list = lasts.values.map((i: any, index: number) => {
            const prices = fetchPrices(currencies, chart, i.t / 1000);
            lastPrices = prices;

            if (index !== 0) {
                // Sell crypto currencies
                endBalance = prices.reduce((b: number, p: number, j: number) => {
                    return b + balances[j] * (p * (1 - percent));
                }, 0);
            }

            // Buy crypto currencies
            balances = prices.map((p: number, j: number) => {
                return +((endBalance * i.w[j]) / (p * (1 + percent))).toFixed(6);
            });

            return {
                date: i.d,
                balances: balances.join(' | '),
                weight: i.w.map((v: number) => (v * 100).toFixed(1)).join(' | '),
                endBalance: endBalance.toFixed(2),
                prices: prices.join(' | '),
            };
        });

        return {
            list: list,
            lastPrices: lastPrices,
            startBalance: startBalance,
            endBalance: endBalance,

            percent: (((endBalance - startBalance) / endBalance) * 100).toFixed(2),
        };
    }
}


function fetchPrices(currencies: string[], chart: Record<string, KunaHistoryDto>, time: number) {
    return currencies.map((cur: string) => {
        const price = chart[cur].getSpecificTime(time);

        return (price.open + price.close) / 2;
    });
}
