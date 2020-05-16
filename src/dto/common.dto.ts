export class CommonDto<P extends CommonDto = any> {
    public constructor(object?: Partial<P>) {
        if (object) {
            Object.assign(this, object);
        }
    }
}
