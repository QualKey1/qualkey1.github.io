export class HederaCredentialInfoDto {
  constructor(
        public readonly did: string,
        public readonly hash: string,
        public readonly link: string,
        public readonly timestamp: Date,
  ) {
  }
}