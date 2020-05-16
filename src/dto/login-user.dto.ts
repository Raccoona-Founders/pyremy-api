import { CommonDto } from './common.dto';

export class LoginUserDto extends CommonDto<LoginUserDto> {
    public readonly login: string;

    public readonly password: string;
}
