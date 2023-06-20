import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";

export class UploadFailedException extends RuntimeException {
  constructor(filename: string, reason: string) {
    super(`Upload failed for file ${filename}: ${reason}`);
  }
}