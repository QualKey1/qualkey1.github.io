import { Institution, Upload, User } from "@prisma/client";

export class UploadApprovedEvent {
  upload: Upload;
  representatives: User[];
  approvedBy: User;
  institution: Institution;
}