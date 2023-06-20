import { extname } from "path";
import stream from "stream";

import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3 } from "aws-sdk";
import { v4 as uuid } from "uuid";

@Injectable()
export class AwsS3Service {
    @Inject(ConfigService)
  public config: ConfigService;

    public async upload(file): Promise<string> {
      const filename = `${uuid()}${extname(file.originalname)}`;

      const s3 = this.getS3();
      const params = {
        Bucket: this.config.get("AWS_S3_BUCKET"),
        Key: String(filename),
        Body: file.buffer,
      };

      console.log(params, "PARAMS");

      await new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
          if (err) {
            Logger.error(err, err.stack);
            reject(err.message);
          } else {
            Logger.debug(`UPLOADED file ${filename} to S3`);
            resolve(data);
          }
        });
      });

      return filename;
    }

    public async remove(filename): Promise<void> {
      const s3 = this.getS3();

      const params = {
        Bucket: this.config.get("AWS_S3_BUCKET"),
        Key: String(filename),
      };

      await new Promise((resolve, reject) => {
        s3.deleteObject(params, (err, data) => {
          if (err) {
            Logger.error(err, err.stack);
            reject(err.message);
          } else {
            Logger.debug(`DELETED file ${filename} from S3`);
            resolve(data);
          }
        });
      });
    }

    public get(filename): stream.Readable {
      const s3 = this.getS3();

      const params = {
        Bucket: this.config.get("AWS_S3_BUCKET"),
        Key: String(filename),
      };

      return s3.getObject(params).createReadStream();
    }

    private getS3(): S3 {
      return new S3({
        accessKeyId: this.config.get("AWS_ACCESS_KEY_ID"),
        secretAccessKey: this.config.get("AWS_SECRET_ACCESS_KEY"),
      });
    }
}
