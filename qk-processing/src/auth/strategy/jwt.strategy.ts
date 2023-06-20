import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Role, User } from "@prisma/client";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

import { PrismaService } from "../../prisma/prisma.service";
import { AuthService } from "../auth.service";

type JwtPayload = {
  sub: string,
  email: string,
  role: Role
}

/**
 * Helps validating and authenticating the user by Json Web Token
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(config: ConfigService, private prisma: PrismaService, private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request):string => {
        return request?.cookies["jwt"];
      }]),
      secretOrKey: config.get<string>("JWT_SECRET"),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { uuid: payload.sub } });
    
    delete user.password;
    return user;
  }
}