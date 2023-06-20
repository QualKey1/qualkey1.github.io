import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { User } from "@prisma/client";
import { Request, Response } from "express";

import { SettingsService } from "../settings/settings.service";
import { AuthService } from "./auth.service";
import { GetUser } from "./decorator";
import {
  AuthCheckCredentialsRequestDto, AuthOtpRequestDto,
  AuthRequestDto, ForgotPasswordRequestDto,
  OtpRequestDto,
  OtpResponseDto,
  ResetPasswordRequestDto,
} from "./dto";
import { JwtGuard } from "./guard";
import { OtpService } from "./otp.service";

const rateLimitForOtp = 15;
/**
 * This is the API gateway for authentication, all authentication requests come here
 */
@Controller("auth")
export class AuthController {
  constructor(
      private authService: AuthService,
      private otpService: OtpService,
      private systemSettings: SettingsService,
  ) {}

  /**
   * Send OneTimePassword endpoint
   */
  @Throttle(1, rateLimitForOtp)
  @Post("otp")
  otp(@Body() dto: OtpRequestDto): Promise<OtpResponseDto> {
    return this.otpService.sendOtp(dto.email, rateLimitForOtp);
  }

  /**
   * Register endpoint
   */
  @HttpCode(HttpStatus.OK)
  @Post("register")
  register(@Body() dto: AuthRequestDto): Promise<{ uuid: string, email: string, createdAt: Date }> {
    return this.authService.register(dto);
  }

  /**
   * Login with otp endpoint
   */
  @HttpCode(HttpStatus.OK)
  @Post("login-otp")
  async authWithOtp(@Body() dto: AuthOtpRequestDto, @Res({ passthrough: true }) response: Response): Promise<string> {
    if ("true" === await this.systemSettings.get("otp.enabled")) await this.otpService.checkOtp(dto.otp, dto.otpUuid);
    return this.authService.loginOtp(dto, response);
  }

  /**
   * Login endpoint
   */
  @HttpCode(HttpStatus.OK)
  @Post("login")
  async login(@Body() dto: AuthRequestDto, @Res({ passthrough: true }) response: Response ): Promise<string> {
    if ("true" === await this.systemSettings.get("otp.enabled")) await this.otpService.checkOtp(dto.otp, dto.otpUuid);
    return this.authService.login(dto, response);
  }

  /**
   * Check credentials endpoint
   */
  @HttpCode(HttpStatus.OK)
  @Post("check")
  async checkCredentials(@Body() dto: AuthCheckCredentialsRequestDto): Promise<void> {
    await this.authService.checkCredentials(dto);
  }

  /**
   * Logout endpoint
   */
  @HttpCode(HttpStatus.OK)
  @Post("logout")
  async logout(@Res({ passthrough: true }) response: Response): Promise<string> {
    return this.authService.logout(response);
  }

  /**
   * Check if user has JWT
   */
  @HttpCode(HttpStatus.OK)
  @Get("verify")
  async checkJwt(@Req() request: Request): Promise<string> {
    return this.authService.checkJwt(request);
  }

  /**
   * Reset password endpoint
   */
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @Post("password-reset")
  async resetPassword(
      @GetUser() user: User,
      @Body() dto: ResetPasswordRequestDto,
      @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.authService.resetPassword(dto, user.email, response);
  }

  /**
   * Forgot password endpoint
   */
  @HttpCode(HttpStatus.OK)
  @Post("password-forgot")
  async forgotPassword(@Body() dto: ForgotPasswordRequestDto): Promise<void> {
    await this.authService.forgotPassword(dto);
  }
}