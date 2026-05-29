import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Validates a Keycloak token and returns user info.
   * In production this verifies against Keycloak's JWKS endpoint.
   */
  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  /**
   * Exchange Keycloak token for session info
   */
  async login(keycloakToken: string) {
    const keycloakUrl = this.configService.get('KEYCLOAK_BASE_URL');
    const realm = this.configService.get('KEYCLOAK_REALM');

    // In production: verify token with Keycloak userinfo endpoint
    // For now, decode and find/create user
    const decoded = this.jwtService.decode(keycloakToken) as Record<string, any>;
    if (!decoded?.sub) {
      throw new UnauthorizedException('Token inválido');
    }

    let user = await this.usersService.findByKeycloakId(decoded.sub);
    if (!user) {
      user = await this.usersService.create({
        name: decoded.name || decoded.preferred_username || 'Usuário',
        email: decoded.email,
        keycloakId: decoded.sub,
      });
    }

    return {
      user,
      accessToken: keycloakToken,
    };
  }

  async getProfile(userId: string) {
    return this.usersService.findOne(userId);
  }
}
