import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from './role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dtos/create_role.dto';

@Injectable()
export class RoleService {
  constructor(@InjectRepository(Role) private repo: Repository<Role>) {}

  async getAll(): Promise<Role[]> {
    const roles = await this.repo.find();
    return roles;
  }

  async getByName(roleName: string): Promise<Role> {
    const role = await this.repo.findOne({ where: { roleName } });

    if (!role) {
      throw new NotFoundException('El role no existe');
    }

    return role;
  }

  async getById(roleId: number): Promise<Role> {
    const role = await this.repo.findOne({ where: { roleId } });

    if (!role) {
      throw new NotFoundException('El role no existe');
    }

    return role;
  }

  async create(body: CreateRoleDto): Promise<Role> {
    const role = this.repo.create({
      description: body.description,
      roleName: body.roleName,
    });

    await this.repo.save(role);
    return role;
  }
}
