import { CommonDto } from 'src/dto/common.dto';

export type SimpleHistoryDateDto = {
    time: number;
    high: number;
    low: number;
    open: number;
    close: number;
    volume: number;
};

export class KunaHistoryDto extends CommonDto<KunaHistoryDto> {
    public t: number[];

    public h: number[];

    public l: number[];

    public o: number[];

    public c: number[];

    public v: number[];

    public s: string | 'ok';

    public getSpecificTime(time: number): SimpleHistoryDateDto {
        const index = this.t.findIndex((t) => t === time);

        if (index < 0) {
            throw new Error('Index not found');
        }

        return {
            time: this.t[index],
            high: this.h[index],
            low: this.l[index],
            open: this.o[index],
            close: this.c[index],
            volume: this.v[index],
        };
    }
}
