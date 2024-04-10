import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dtos/create_role.dto';
import { Role } from './role.entity';

@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get()
  getAllRoles(): Promise<Role[]> {
    return this.roleService.getAll();
  }

  @Post('create')
  async createRole(@Body() body: CreateRoleDto): Promise<Role> {
    const role = await this.roleService.create(body);
    return role;
  }
}
