import { Injectable } from "@nestjs/common";

@Injectable()
export class PasswordGenerator {
  public static generate(length: number, hasNumbers: boolean, hasSymbols: boolean): string {
    const alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const integers = "0123456789";
    const exCharacters = "!@#$%^&*_-=+";

    let chars = alpha;
    if (hasNumbers) {
      chars += integers;
    }
    if (hasSymbols) {
      chars += exCharacters;
    }

    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return password;
  }
}