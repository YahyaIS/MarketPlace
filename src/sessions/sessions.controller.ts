import {
  Controller,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  Request,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { AuthProtected } from 'src/auth/decorators/auth-protected.decorator';

@AuthProtected()
@Controller({ path: 'sessions', version: '1' })
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  @Get()
  findAll(@Request() req) {
    return this.sessionsService.findAllByUser(req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async revoke(@Param('id', ParseIntPipe) sessionId: number, @Request() req) {
    const session = await this.sessionsService.findById(sessionId);
    if (!session || session.userId !== req.user.id) {
      throw new ForbiddenException('Session not found');
    }

    await this.sessionsService.revoke(sessionId);
    return { message: 'Session revoked' };
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async revokeAll(@Request() req) {
    await this.sessionsService.revokeAll(req.user.id);
    return { message: 'All sessions revoked' };
  }
}
