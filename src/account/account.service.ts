import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { SignUpAccountDto } from './dtos/signup-account.dto';
import { RoleService } from '../role/role.service';
import { AgentService } from '../agent/agent.service';
const scrypt = promisify(_scrypt);

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private repo: Repository<Account>,
    private jwtService: JwtService,
    private roleService: RoleService,
    private agentService: AgentService,
  ) {}

  async getAll(): Promise<Account[]> {
    const account = await this.repo.find({ relations: { role: true } });

    if (!account) {
      return null;
    }

    return account;
  }

  async getByEmail(email: string) {
    const account = await this.repo.find({
      where: { email },
      relations: { role: true },
    });

    if (!account) {
      return null;
    }

    return account;
  }

  async getById(accountId: number): Promise<Account> {
    const account = await this.repo.findOne({
      where: { accountId },
      relations: { role: true },
    });
    if (!account) {
      throw new NotFoundException('La cuenta no fue encontrada');
    }
    return account;
  }

  async hashPassword(password: string) {
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    return result;
  }

  async signupAccount(body: SignUpAccountDto, roleName: string) {
    const accountsByEmail = await this.getByEmail(body.email);

    if (accountsByEmail.length) {
      throw new BadRequestException(
        'Error, el correo electrónico pertenece a otra cuenta',
      );
    }

    /*if (body.password !== body.confirmPassword) {
      throw new BadRequestException(
        'Error, las contraseñas que ingresó no son las mismas',
      );
    }*/
    const role = await this.roleService.getByName(roleName);

    const hash = await this.hashPassword(body.password);
    const account = this.repo.create({
      email: body.email,
      password: hash,
      role,
    });
    if (roleName === 'Agent') {
      const agent = await this.agentService.getByEmail(body.email);
      account.agent = agent;
    }
    await this.repo.save(account);

    return await this.getById(account.accountId);
  }

  async loginAccount(loginString: string, password: string) {
    const [accountByEmail] = await this.getByEmail(loginString);
    if (!accountByEmail) {
      throw new BadRequestException('El correo no existe');
    }

    const [salt, storedHash] = accountByEmail.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException(
        'El correo electrónico o la contraseña son incorrectos',
      );
    }

    return accountByEmail;
  }

  async jwtValidationAccount(account: Account) {
    const payload = { sub: account.accountId };
    if (account.role.roleName === 'Agent') {
      const agent = await this.agentService.getAgentByAccountId(
        account.accountId,
      );
      return {
        access_token: this.jwtService.sign(payload),
        accountId: account.accountId,
        role: account.role,
        agentId: agent.agentId,
      };
    } else {
      return {
        access_token: this.jwtService.sign(payload),
        accountId: account.accountId,
        role: account.role,
      };
    }
  }

  async updateAccount(
    accountId: number,
    attrs: Partial<Account>,
  ): Promise<Account> {
    const account = await this.getById(accountId);
    Object.assign(account, attrs);
    return await this.repo.save(account);
  }

  async generateToken(accountId: number): Promise<Account> {
    const account = await this.getById(accountId);
    let apiToken = randomBytes(48).toString('hex');
    let foundToken = await this.getAccountByToken(apiToken);
    while (foundToken) {
      apiToken = randomBytes(48).toString('hex');
      foundToken = await this.getAccountByToken(apiToken);
    }
    account.apiToken = apiToken;
    return await this.repo.save(account);
  }

  async getAccountByToken(apiToken: string): Promise<Account> {
    return await this.repo.findOne({ where: { apiToken } });
  }

  async forgotPassword(
    email: string,
    resetPasswordToken: string,
    verificationTokenExpiration: Date,
  ): Promise<Account> {
    const [account] = await this.getByEmail(email);
    if (!account) {
      throw new NotFoundException('El usuario no existe');
    }

    account.resetPasswordToken = resetPasswordToken;
    account.verificationTokenExpiration = verificationTokenExpiration;
    return this.repo.save(account);
  }

  async recoverPassword(
    accountId: number,
    newPassword: string,
  ): Promise<Account> {
    const account = await this.getById(accountId);
    if (!account) {
      throw new NotFoundException('El usuario no existe');
    }
    const newHash = await this.hashPassword(newPassword);
    account.password = newHash;
    await this.repo.save(account);

    const foundAccount = await this.getById(accountId);
    return foundAccount;
  }

  async validateRecoverToken(
    accountId: number,
    token: string,
  ): Promise<boolean> {
    const updatedAccount = await this.repo.findOne({ where: { accountId } });
    if (!updatedAccount) {
      throw new NotFoundException('La cuenta no existe.');
    }
    if (updatedAccount.resetPasswordToken === token) {
      return true;
    } else {
      return false;
    }
  }

  async updatePassword(
    accountId: number,
    password: string,
    newPassword: string,
  ) {
    const account = await this.getById(accountId);

    if (!account) {
      throw new NotFoundException('La cuenta no existe');
    }
    const [salt, storedHash] = account.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('La contraseña es incorrecta');
    }

    const newHash = await this.hashPassword(newPassword);

    account.password = newHash;
    await this.repo.save(account);
    return account;
  }

  async delete(accountId: number) {
    const deletedAccount = await this.getById(accountId);
    return this.repo.remove(deletedAccount);
  }
}
