/**
 * Data Transfer Object of the OneTimePassword Response
 */
export class OtpResponseDto {
  constructor(
        private otpUuid: string,
        private validUntil: Date,
        private canBeResentAt: Date,
  ) {
  }
}
