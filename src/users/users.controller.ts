import {
  Controller,
  Get,
  Body,
  Patch,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { mapUser } from './user.mapper';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthProtected } from 'src/auth/decorators/auth-protected.decorator';

@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @AuthProtected()
  @Get('me')
  async me(@Request() req) {
    const user = await this.usersService.findOne(
      { id: req.user.id },
      { includeCounts: true },
    );

    return mapUser(user ?? req.user);
  }

  @AuthProtected()
  @Patch('me')
  async updateMe(@Request() req, @Body() dto: UpdateProfileDto) {
    const user = await this.usersService.updateProfile(req.user.id, dto);
    return mapUser(user);
  }
}
