import { Controller, Get, Body, Patch, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { mapUser } from './user.mapper';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthProtected } from 'src/auth/decorators/auth-protected.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @AuthProtected()
  @Get('me')
  async me(@CurrentUser('id') userId: number) {
    const user = await this.usersService.findOne(
      { id: userId },
      { includeCounts: true },
    );

    return user ? mapUser(user) : null;
  }

  @AuthProtected()
  @Patch('me')
  async updateMe(@Request() req, @Body() dto: UpdateProfileDto) {
    const user = await this.usersService.updateProfile(req.user.id, dto);
    return mapUser(user);
  }
}
