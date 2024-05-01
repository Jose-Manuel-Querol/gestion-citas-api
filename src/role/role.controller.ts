import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dtos/create_role.dto';
import { Role } from './role.entity';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @ApiExcludeEndpoint()
  @Get()
  getAllRoles(): Promise<Role[]> {
    return this.roleService.getAll();
  }

  @ApiExcludeEndpoint()
  @Post('create')
  async createRole(@Body() body: CreateRoleDto): Promise<Role> {
    const role = await this.roleService.create(body);
    return role;
  }
}
