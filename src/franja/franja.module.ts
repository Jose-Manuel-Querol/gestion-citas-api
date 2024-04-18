import { Module } from '@nestjs/common';
import { FranjaController } from './franja.controller';
import { FranjaService } from './franja.service';
import { Franja } from './franja.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Franja])],
  controllers: [FranjaController],
  providers: [FranjaService],
  exports: [FranjaService],
})
export class FranjaModule {}
