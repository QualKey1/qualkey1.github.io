import { User, Upload } from "@prisma/client";

export class UploadSucceededEvent {
  upload: Upload;
  representatives: User[];
}