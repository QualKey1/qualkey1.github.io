import { AuthGuard } from "@nestjs/passport";

/**
 * Class which verifies the Json Web Token of the sender of the incoming api request
 */
export class JwtGuard extends AuthGuard("jwt") {
  constructor() {
    super();
  }
}