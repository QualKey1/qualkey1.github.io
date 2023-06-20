import { createHash } from "crypto";

export class Hasher {
  public static hash(string: string): string {
    return createHash("sha256").update(string).digest("hex");
  }
}