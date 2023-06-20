import { NotFoundException } from "@nestjs/common";

export class ActionNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Action with id ${id} not found.`);
  }
}