import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Formato Inválido' })
  readonly email: string;
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}