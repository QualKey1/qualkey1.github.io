import { NotFoundException } from "@nestjs/common";

export class UploadNotFoundException extends NotFoundException {
  constructor(uuid: string) {
    super(`Upload with uuid ${uuid} not found.`);
  }
}