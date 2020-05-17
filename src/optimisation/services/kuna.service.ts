import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { KunaApiV3Client } from 'kuna-sdk';
import moment from 'moment';
import { KunaHistoryDto } from '../../dto';


@Injectable()
export class KunaService {
    public kunaClient: KunaApiV3Client;

    public constructor() {
        this.kunaClient = new KunaApiV3Client();
    }

    public async fetchTradeHistory(currency: string, days: number = 1): Promise<KunaHistoryDto> {
        const to = moment();
        const from = to.clone().subtract(days, 'days');

        const data = await this.kunaClient.chart().history(
            (currency + 'uah').toLowerCase(),
            '1D',
            from.unix(),
            to.unix(),
        );

        return new KunaHistoryDto(data);
    }

    public async fetchList(currencies: string[], days: number = 1): Promise<Record<string, KunaHistoryDto>> {
        const response = {};

        for (let c of currencies) {
            response[c] = await this.fetchTradeHistory(c, days);
        }

        return response;
    }
}
