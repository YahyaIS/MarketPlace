import {
  Controller,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller({ path: 'sessions', version: '1' })
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  /**
   * GET /sessions
   * Returns all active sessions for the current user
   */
  @Get()
  findAll(@Request() req) {
    return this.sessionsService.findAllByUser(req.user.id);
  }

  /**
   * DELETE /sessions/:id
   * Revoke a specific session (logout from one device)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async revoke(@Param('id', ParseIntPipe) sessionId: number, @Request() req) {
    // Ensure the session belongs to the current user
    const session = await this.sessionsService.findById(sessionId);
    if (!session || session.userId !== req.user.id) {
      throw new ForbiddenException('Session not found');
    }

    await this.sessionsService.revoke(sessionId);
    return { message: 'Session revoked' };
  }

  /**
   * DELETE /sessions
   * Revoke all sessions (logout from all devices)
   */
  @Delete()
  @HttpCode(HttpStatus.OK)
  async revokeAll(@Request() req) {
    await this.sessionsService.revokeAll(req.user.id);
    return { message: 'All sessions revoked' };
  }
}
