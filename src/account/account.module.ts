import { forwardRef, Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { SendgridService } from '../shared/sendgrid.service';
import { AccountJwtStrategy } from './account-auth/account.jwt.strategy';
import { AccountLocalStrategy } from './account-auth/account.local.strategy';
import { RoleModule } from '../role/role.module';
import { AgentModule } from '../agent/agent.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `${process.env.NODE_ENV}.env` }),
    TypeOrmModule.forFeature([Account]),
    PassportModule.register({ property: 'user' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_ACCOUNT'),
      }),
      inject: [ConfigService],
    }),
    RoleModule,
    forwardRef(() => AgentModule),
  ],
  controllers: [AccountController],
  providers: [
    AccountService,
    SendgridService,
    AccountJwtStrategy,
    AccountLocalStrategy,
  ],
  exports: [AccountService],
})
export class AccountModule {}
