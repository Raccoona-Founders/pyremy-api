import _ from 'lodash';
import moment from 'moment';
import { CommonDto } from 'src/dto/common.dto';

export class PortfolioDto extends CommonDto<PortfolioDto> {
    public currentWeights: Record<string, number>;

    public returns: Record<string, number>;

    public stats: {
        annual_return: number;
        annual_volatility: number;
        cagr: number;
        calmar_ratio: number;
        cum_returns_final: number;
        kurtosis: number;
        max_drawdown: number;
        omega_ratio: number;
        sharpe_ratio: number;
        skew: number;
        sortino_ratio: number;
        stability_of_timeseries: number;
        tail_ratio: number;
    };

    public weights: Record<string, Record<string, number>>;

    public constructor(data: Partial<PortfolioDto>) {
        super(data);
    }

    public getCoinWeightHistory(coin: string): Record<string, number> {
        return _.get(this.weights, coin.toUpperCase() + '_w', {});
    }

    public getReturnsBy(weeks: number, rebalanceFee: number = 0): any {
        let dates = Object.keys(this.returns);
        let values = Object.values(this.returns);
        const length = values.length;

        if (weeks < length) {
            values = values.slice(length - weeks, length);
            dates = dates.slice(length - weeks, length);
        }

        const coinKeys = Object.keys(this.currentWeights).map((c: string) => c.toUpperCase() + '_w');

        return {
            values: values.map((v: number, indx: number) => {
                const date = dates[indx];

                return {
                    d: moment(+date).format('DD MMM, YYYY'),
                    v: v,
                    w: coinKeys.map((coinKey) => _.get(this.weights, `${coinKey}.${date}`)),
                };
            }),
            stats: {
                annual: values.reduce((cn: number, v: number) => {
                    return (cn * (1 - rebalanceFee)) * v;
                }, 1),
            },
        };
    }

    public getDateList(): any[] {
        return _.map(this.returns, (value: number, date: string) => {
            return {
                date: moment(+date).format('DD MMM, YYYY'),
                value: value,
            };
        });
    }
}

