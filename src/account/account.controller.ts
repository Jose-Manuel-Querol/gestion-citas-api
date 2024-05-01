import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { SendgridService } from '../shared/sendgrid.service';
import { JwtAccountGuard } from './account-auth/account-guards/account.jwt.guard';
import { Serialize } from '../shared/serialize.interceptor';
import { AccountDto } from './dtos/account.dto';
import { UpdateAccountDto } from './dtos/update-account.dto';
import { SignUpAccountDto } from './dtos/signup-account.dto';
import { Account } from './account.entity';
import { LocalAccountGuard } from './account-auth/account-guards/account.guard';
import { ChangePasswordDto } from './dtos/change_password.dto';
import { VerificationValidatedToken } from './dtos/verification_validated_token.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { generateFiveDigitNumber } from '../shared/shared-functions';
import { ValidateTokenDto } from './dtos/validate-token.dto';
import { RecoverPasswordDto } from './dtos/recover-password.dto';
import { RolesGuard } from './account-auth/account-guards/roles.guard';
import { Roles } from '../shared/roles.decorator';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('account')
export class AccountController {
  constructor(
    private accountService: AccountService,
    private sendgridService: SendgridService,
  ) {}

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get()
  async getAllAccounts(): Promise<Account[]> {
    return await this.accountService.getAll();
  }

  @ApiExcludeEndpoint()
  @Serialize(AccountDto)
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get('by-email')
  async getAllByEmail(@Query('email') email: string): Promise<Account[]> {
    return await this.accountService.getByEmail(email);
  }

  @ApiExcludeEndpoint()
  @Serialize(AccountDto)
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get('/:id')
  async getOneAccount(@Param('id') accountId: string): Promise<Account> {
    const account = await this.accountService.getById(parseInt(accountId));
    return account;
  }

  @ApiExcludeEndpoint()
  @Serialize(AccountDto)
  @Post('/signup-admin')
  async signupAdmin(@Body() body: SignUpAccountDto) {
    const account = await this.accountService.signupAccount(body, 'Admin');
    return account;
  }

  @ApiExcludeEndpoint()
  @Serialize(AccountDto)
  @Post('/signup-agent')
  async signupAgent(@Body() body: SignUpAccountDto) {
    const account = await this.accountService.signupAccount(body, 'Agent');
    return account;
  }

  @ApiExcludeEndpoint()
  @UseGuards(LocalAccountGuard)
  @Post('/login')
  async loginAccount(@Request() req: any) {
    return await this.accountService.jwtValidationAccount(req.user);
  }

  @ApiExcludeEndpoint()
  @Put('/:id')
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Serialize(AccountDto)
  async updateAccount(
    @Param('id') accountId: string,
    @Body() body: UpdateAccountDto,
  ) {
    const account = await this.accountService.updateAccount(
      parseInt(accountId),
      body,
    );

    return account;
  }

  @ApiExcludeEndpoint()
  @Get('/generate-token/:id')
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Serialize(AccountDto)
  async generateApiToken(@Param('id') accountId: string) {
    const account = await this.accountService.generateToken(
      parseInt(accountId),
    );

    return account;
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard)
  @Serialize(AccountDto)
  @Put('/change-password/:id')
  async changePasswordAccount(
    @Param('id') accountId: string,
    @Body() body: ChangePasswordDto,
  ) {
    const account = await this.accountService.updatePassword(
      parseInt(accountId),
      body.password,
      body.newPassword,
    );

    const mail = {
      to: account.email,
      subject: 'Cambio de contraseña',
      from: 'josequerol611@gmail.com',
      text: 'Cambio de contraseña',
      html: `
              <div style="width:100%; position:relative; font-family:sans-serif; padding-bottom:40px">
              <div style="width:100%; position:relative; padding-bottom:40px"></div>
                  <div style="position:relative; margin:auto; width:600px; padding:20px">
                    <center>
                      <h3 style="font-weight:100; color:black; text-align:center;">Su contraseña ha sido cambiada</h3>
                      <hr style="border:1px solid black; width:80%; margin:5px auto; display:block;">
                      <br>
                      <p style="color:black;">Si usted no fue quien cambió la contraseña le sugerimos que ingrese a la aplicación y seleccione la opción ¿Olvidó su contraseña? para poder recuperar su cuenta.</p>
                    </center>
                  </div>
                </div>
              `,
    };
    await this.sendgridService.send(mail);

    return account;
  }

  @ApiExcludeEndpoint()
  @Serialize(AccountDto)
  @Put('/recover-password/:id')
  async recoverPasswordAccount(
    @Param('id') accountId: string,
    @Body() body: RecoverPasswordDto,
  ): Promise<Account> {
    const account = await this.accountService.getById(parseInt(accountId));

    const now = new Date();
    const expirationTime = new Date(account.verificationTokenExpiration);
    const elapsedMinutes =
      (now.getTime() - expirationTime.getTime()) / (1000 * 60);

    if (elapsedMinutes >= 30) {
      throw new UnauthorizedException('El enlace ya no es válido');
    }

    await this.accountService.recoverPassword(
      parseInt(accountId),
      body.newPassword,
    );

    const mail = {
      to: account.email,
      subject: 'Cambio de contraseña',
      from: 'josequerol611@gmail.com',
      text: 'Cambio de contraseña',
      html: `
              <div style="width:100%; position:relative; font-family:sans-serif; padding-bottom:40px">
              <div style="width:100%; position:relative; padding-bottom:40px"></div>
                  <div style="position:relative; margin:auto; width:600px; padding:20px">
                    <center>
                      <h3 style="font-weight:100; color:black; text-align:center;">Su contraseña ha sido cambiada</h3>
                      <hr style="border:1px solid black; width:80%; margin:5px auto; display:block;">
                      <br>
                      <p style="color:black;">Si usted no fue quien cambió la contraseña le sugerimos que ingrese a la aplicación y seleccione la opción ¿Olvidó su contraseña? para poder recuperar su cuenta.</p>
                    </center>
                  </div>
                </div>
              `,
    };
    await this.sendgridService.send(mail);

    return account;
  }

  @ApiExcludeEndpoint()
  @Put('/validate-recover-token/:id')
  async validateUserRecoverToken(
    @Param('id') accountId: string,
    @Body() body: ValidateTokenDto,
  ): Promise<VerificationValidatedToken> {
    const account = await this.accountService.getById(parseInt(accountId));
    const now = new Date();
    const expirationTime = new Date(account.verificationTokenExpiration);
    const elapsedMinutes =
      (now.getTime() - expirationTime.getTime()) / (1000 * 60);

    if (elapsedMinutes >= 5) {
      throw new UnauthorizedException('El enlace ya no es válido');
    }
    const validation = await this.accountService.validateRecoverToken(
      parseInt(accountId),
      body.resetPasswordToken,
    );

    return { validated: validation };
  }

  @ApiExcludeEndpoint()
  @Serialize(AccountDto)
  @Post('/forgot-password')
  async forgotPasswordAccount(@Body() body: ForgotPasswordDto) {
    const resetPasswordToken = generateFiveDigitNumber().toString();
    const verificationTokenExpiration = new Date(Date.now() + 30 * 60 * 1000);
    const account = await this.accountService.forgotPassword(
      body.email,
      resetPasswordToken,
      verificationTokenExpiration,
    );

    const mail = {
      to: body.email,
      subject: 'Recuperar contraseña',
      from: 'josequerol611@gmail.com',
      text: 'Recuperar contraseña',
      html: `
              <div style="width:100%; position:relative; font-family:sans-serif; padding-bottom:40px">
              <div style="width:100%; position:relative; padding-bottom:40px"></div>
                <div style="position:relative; margin:auto; width:600px; padding:20px">
                  <center>
                      <h3 style="font-weight:100; color:black; text-align:center;">Ha solicitado recuperar su contraseña</h3>
                      <hr style="border:1px solid black; width:80%; margin:5px auto; display:block;">
                      <br>
                      <p style="color:black;">Ingrese el siguiente código en la aplicación para recuperar su contraseña: ${resetPasswordToken} </p>
                      <br>
                      <p style="color:black;">Este código sólo será válido por 30 minutos</p>
                    </center>
                  </div>
                </div>
              `,
    };
    await this.sendgridService.send(mail);

    return account;
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard)
  @Serialize(AccountDto)
  @Delete('/:id')
  async deleteAccount(@Param('id') accountId: string) {
    return await this.accountService.delete(parseInt(accountId));
  }
}
