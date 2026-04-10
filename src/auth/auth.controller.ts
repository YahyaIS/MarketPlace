import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { AuthProtected } from './decorators/auth-protected.decorator';
import { ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto, @Request() req) {
    return this.authService.register(dto, req);
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDto })
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user, req);
  }

  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth('refresh-token')
  @HttpCode(HttpStatus.OK)
  @Post('refreshToken')
  refresh(@Request() req) {
    const { id, email, role, sessionId } = req.user;
    return this.authService.refresh(sessionId, id, email, role);
  }

  @AuthProtected()
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Request() req) {
    return this.authService.logout(req.user.sessionId);
  }
}
