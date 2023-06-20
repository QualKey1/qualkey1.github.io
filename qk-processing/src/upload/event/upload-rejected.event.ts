import { Upload, User } from "@prisma/client";

export class UploadRejectedEvent {
  upload: Upload;
  rejectedBy: User;
  representatives: User[];
}