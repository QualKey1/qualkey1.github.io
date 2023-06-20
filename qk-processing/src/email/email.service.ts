import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { SettingsService } from "../settings/settings.service";
import { UserRepository } from "../user/user.repository";

/**
 * Service responsible for sending emails to users
 */
@Injectable()
export class EmailService {
  private NO_REPLY_EMAIL = "no-reply@qualkey.org";
  private INFO_EMAIL = "info@qualkey.org";

  constructor(
        private readonly mailService: MailerService,
        private readonly settings: SettingsService,
        private readonly config: ConfigService,
        private readonly userRepository: UserRepository,
  ) {}

  public async sendWelcomeUserEmail(
    recipientEmail: string,
    fullName: string,
    temporaryPass: string,
    institution: string,
  ): Promise<void> {
    await this.sendEmailTemplate(
      [recipientEmail],
      this.NO_REPLY_EMAIL,
      "sendWelcomeUserEmail",
      "Welcome to Qualkey",
      {
        fullName: fullName,
        institution: institution,
        loginUrl: this.config.get("FRONTEND_URL"),
        email: recipientEmail,
        temporaryPass: temporaryPass,
        unsubscribeLink: this.config.get("FRONTEND_URL")+`/unsubscribe?email=${recipientEmail}`,
      },
    );
  }

  public async sendWelcomeUserAdminEmail(
    recipientEmail: string,
    fullName: string,
    temporaryPass: string,
  ): Promise<void> {
    await this.sendEmailTemplate(
      [recipientEmail],
      this.NO_REPLY_EMAIL,
      "sendWelcomeAdminEmail",
      "Welcome to Qualkey",
      {
        fullName: fullName,
        email: recipientEmail,
        temporaryPass: temporaryPass,
      },
    );
  }

  public async sendWelcomeRepresentativeEmail(
    recipientEmail: string,
    fullName: string,
    temporaryPass: string,
    institution: string,
  ): Promise<void> {
    await this.sendEmailTemplate(
      [recipientEmail],
      this.NO_REPLY_EMAIL,
      "sendWelcomeRepresentativeEmail",
      "Welcome to Qualkey",
      {
        fullName: fullName,
        institution: institution,
        loginUrl: this.config.get("FRONTEND_URL"),
        email: recipientEmail,
        temporaryPass: temporaryPass,
        unsubscribeLink: this.config.get("FRONTEND_URL")+"/unsubscribe?email="+recipientEmail,
      },
    );
  }

  public async sendReviewUploadEmail(recipientEmail: string, fullName: string): Promise<void> {
    await this.sendEmailTemplate(
      [recipientEmail],
      this.NO_REPLY_EMAIL,
      "sendReviewUploadEmail",
      "Approval required for qualification upload",
      {
        fullName: fullName,
        loginUrl: this.config.get("FRONTEND_URL"),
        unsubscribeLink: this.config.get("FRONTEND_URL")+"/unsubscribe?email="+recipientEmail,
      },
    );
  }

  public async sendReviewWithdrawalEmail(recipientEmail: string, fullName: string, credentialUuid: string): Promise<void> {
    await this.sendEmailTemplate(
      [recipientEmail],
      this.NO_REPLY_EMAIL,
      "sendReviewWithdrawalEmail",
      "Approval required for qualification withdrawal",
      {
        fullName: fullName,
        loginUrl: this.config.get("FRONTEND_URL"),
        qualificationLink: this.config.get("FRONTEND_URL")+"/dashboard/"+credentialUuid,
        unsubscribeLink: this.config.get("FRONTEND_URL")+"/unsubscribe?email="+recipientEmail,
      },
    );
  }

  public async sendWithdrawalApprovedEmail(recipientEmail: string, fullName: string, credentialUuid: string): Promise<void> {
    await this.sendEmailTemplate(
      [recipientEmail],
      this.NO_REPLY_EMAIL,
      "sendWithdrawalApprovedEmail",
      "Approval granted and qualification withdrawn",
      {
        fullName: fullName,
        loginUrl: this.config.get("FRONTEND_URL"),
        qualificationLink: this.config.get("FRONTEND_URL")+"/dashboard/"+credentialUuid,
        unsubscribeLink: this.config.get("FRONTEND_URL")+"/unsubscribe?email="+recipientEmail,
      },
    );
  }

  public async sendWithdrawalApprovedToInitiatorEmail(recipientEmail: string, fullName: string, credentialUuid: string): Promise<void> {
    await this.sendEmailTemplate(
      [recipientEmail],
      this.NO_REPLY_EMAIL,
      "sendWithdrawalApprovedToInitiatorEmail",
      "Approval granted and qualification withdrawn",
      {
        fullName: fullName,
        loginUrl: this.config.get("FRONTEND_URL"),
        qualificationLink: this.config.get("FRONTEND_URL")+"/dashboard/"+credentialUuid,
        unsubscribeLink: this.config.get("FRONTEND_URL")+"/unsubscribe?email="+recipientEmail,
      },
    );
  }

  public async sendWithdrawalRejectedEmail(recipientEmail: string, fullName: string, credentialUuid: string): Promise<void> {
    await this.sendEmailTemplate(
      [recipientEmail],
      this.NO_REPLY_EMAIL,
      "sendWithdrawalRejectedEmail",
      "Request to withdraw qualification declined",
      {
        fullName: fullName,
        loginUrl: this.config.get("FRONTEND_URL"),
        qualificationLink: this.config.get("FRONTEND_URL")+"/dashboard/"+credentialUuid,
        unsubscribeLink: this.config.get("FRONTEND_URL")+"/unsubscribe?email="+recipientEmail,
      },
    );
  }

  public async sendWithdrawalRejectedToInitiatorEmail(recipientEmail: string, fullName: string, credentialUuid: string): Promise<void> {
    await this.sendEmailTemplate(
      [recipientEmail],
      this.NO_REPLY_EMAIL,
      "sendWithdrawalRejectedToInitiatorEmail",
      "Request to withdraw qualification declined",
      {
        fullName: fullName,
        loginUrl: this.config.get("FRONTEND_URL"),
        qualificationLink: this.config.get("FRONTEND_URL")+"/dashboard/"+credentialUuid,
        unsubscribeLink: this.config.get("FRONTEND_URL")+"/unsubscribe?email="+recipientEmail,
      },
    );
  }

  public async sendOtpEmail(recipientEmail: string, otp: string, fullName: string): Promise<void> {
    await this.sendEmailTemplate(
      [recipientEmail],
      this.NO_REPLY_EMAIL,
      "sendOtpEmail",
      "One time password",
      {
        otp: otp,
        fullName: fullName,
        unsubscribeLink: this.config.get("FRONTEND_URL")+"/unsubscribe?email="+recipientEmail,
      },
    );
  }

  public async sendForgotPasswordEmail(recipientEmail: string, newPassword: string, fullName: string): Promise<void> {
    await this.sendEmailTemplate(
      [recipientEmail],
      this.NO_REPLY_EMAIL,
      "sendForgotPasswordEmail",
      "Forgot password",
      {
        newPassword: newPassword,
        fullName: fullName,
        unsubscribeLink: this.config.get("FRONTEND_URL")+"/unsubscribe?email="+recipientEmail,
      },
    );
  }

  public async sendUploadApprovedToInitiator(recipientEmail: string, fullName: string): Promise<void> {
    await this.sendEmailTemplate(
      [recipientEmail],
      this.NO_REPLY_EMAIL,
      "sendUploadApprovedToInitiator",
      "Qualification upload fully approved",
      {
        fullName: fullName,
        loginUrl: this.config.get("FRONTEND_URL"),
        unsubscribeLink: this.config.get("FRONTEND_URL")+"/unsubscribe?email="+recipientEmail,
      },
    );
  }

  public async sendUploadApprovedToApprover(recipientEmail: string, fullName: string): Promise<void> {
    await this.sendEmailTemplate(
      [recipientEmail],
      this.NO_REPLY_EMAIL,
      "sendUploadApproved",
      "Qualification upload fully approved",
      {
        fullName: fullName,
        loginUrl: this.config.get("FRONTEND_URL"),
        unsubscribeLink: this.config.get("FRONTEND_URL")+"/unsubscribe?email="+recipientEmail,
      },
    );
  }

  public async sendUploadRejected(recipientEmail: string, fullName: string): Promise<void> {
    await this.sendEmailTemplate(
      [recipientEmail],
      this.NO_REPLY_EMAIL,
      "sendUploadRejected",
      "Qualification upload rejected",
      {
        fullName: fullName,
        loginUrl: this.config.get("FRONTEND_URL"),
        unsubscribeLink: this.config.get("FRONTEND_URL")+"/unsubscribe?email="+recipientEmail,
      },
    );
  }

  public async sendShareCredentials(
    recipientEmail: string,
    temporaryPass: string,
    fullNameSharedTo: string,
    fullName: string,
    expiresAt: Date,
    shareUuid: string,
  ): Promise<void> {

    const dateNow = new Date();
    const dateDiffInHours = Math.round((expiresAt.getTime() - dateNow.getTime()) / 36e5);
    let dateString = dateDiffInHours + " hours";

    if (dateDiffInHours > 48) {
      dateString = Math.round(dateDiffInHours / 24) + " days";
    }

    if (dateDiffInHours > 365) {
      dateString = "never";
    }

    await this.sendEmailTemplate(
      [recipientEmail],
      this.NO_REPLY_EMAIL,
      "sendShareCredentials",
      "Credentials shared",
      {
        fullNameSharedTo: fullNameSharedTo,
        fullName: fullName,
        expiresIn: dateString,
        sharedCredentialsLink: this.config.get("FRONTEND_URL")+`/share/${shareUuid}`,
        temporaryPass: temporaryPass,
        unsubscribeLink: this.config.get("FRONTEND_URL")+"/unsubscribe?email="+recipientEmail,
      },
    );
  }

  public async sendShareOneCredential(
    recipientEmail: string,
    did: string,
    fullNameSharedTo: string,
    fullName: string,
  ): Promise<void> {
    await this.sendEmailTemplate(
      [recipientEmail],
      this.NO_REPLY_EMAIL,
      "sendPublicShareCredentials",
      "Credentials shared",
      {
        fullNameSharedTo: fullNameSharedTo,
        fullName: fullName,
        publicShareLink: this.config.get("FRONTEND_URL")+`/${did}`,
        unsubscribeLink: this.config.get("FRONTEND_URL")+"/unsubscribe?email="+recipientEmail,
      },
    );
  }

  public async sendCredentialsChangedStudent(recipientEmail: string, fullName: string, institutionName: string, credentialUuid: string): Promise<void> {
    await this.sendEmailTemplate(
      [recipientEmail],
      this.NO_REPLY_EMAIL,
      "sendCredentialsChangedStudent",
      "Your qualification was updated",
      {
        fullName: fullName,
        loginUrl: this.config.get("FRONTEND_URL"),
        institutionName: institutionName,
        qualificationLink: this.config.get("FRONTEND_URL")+"/dashboard/"+credentialUuid,
        unsubscribeLink: this.config.get("FRONTEND_URL")+"/unsubscribe?email="+recipientEmail,
      },
    );
  }

  public async sendCredentialsWithdrawnStudent(recipientEmail: string, fullName: string, institutionName: string): Promise<void> {
    await this.sendEmailTemplate(
      [recipientEmail],
      this.NO_REPLY_EMAIL,
      "sendCredentialsWithdrawnStudent",
      "Your qualification was withdrawn",
      {
        fullName: fullName,
        loginUrl: this.config.get("FRONTEND_URL"),
        institutionName: institutionName,
        unsubscribeLink: this.config.get("FRONTEND_URL")+"/unsubscribe?email="+recipientEmail,
      },
    );
  }

  public async sendCredentialsUploaded(recipientEmail: string, fullName: string, credentialUuid: string): Promise<void> {
    await this.sendEmailTemplate(
      [recipientEmail],
      this.NO_REPLY_EMAIL,
      "sendCredentialsUploaded",
      "Congratulations! A new qualification was uploaded",
      {
        fullName: fullName,
        loginUrl: this.config.get("FRONTEND_URL"),
        qualificationLink: this.config.get("FRONTEND_URL")+"/dashboard/"+credentialUuid,
        unsubscribeLink: this.config.get("FRONTEND_URL")+"/unsubscribe?email="+recipientEmail,
      },
    );
  }

  public async sendCredentialsManipulated(recipientEmail: string, fullName: string, institutionName: string, credentialUuid: string): Promise<void> {
    await this.sendEmailTemplate(
      [recipientEmail],
      this.NO_REPLY_EMAIL,
      "sendCredentialsManipulated",
      "WARNING: Potential data integrity issue",
      {
        fullName: fullName,
        loginUrl: this.config.get("FRONTEND_URL"),
        institutionName: institutionName,
        qualificationLink: this.config.get("FRONTEND_URL")+"/dashboard/"+credentialUuid,
        unsubscribeLink: this.config.get("FRONTEND_URL")+"/unsubscribe?email="+recipientEmail,
      },
    );
  }

  public async sendCredentialsChangedRepresentative(recipientEmail: string, fullName: string, credentialUuid: string): Promise<void> {
    await this.sendEmailTemplate(
      [recipientEmail],
      this.NO_REPLY_EMAIL,
      "sendCredentialsChangedRepresentative",
      "Credentials for a qualification have been changed",
      {
        fullName: fullName,
        loginUrl: this.config.get("FRONTEND_URL"),
        qualificationLink: this.config.get("FRONTEND_URL")+"/dashboard/"+credentialUuid,
        unsubscribeLink: this.config.get("FRONTEND_URL")+"/unsubscribe?email="+recipientEmail,
      },
    );
  }

  public async sendCredentialsActivated(
    recipientEmail: string,
    fullName: string,
  ): Promise<void> {
    await this.sendEmailTemplate(
      [recipientEmail],
      this.NO_REPLY_EMAIL,
      "sendCredentialsActivated",
      "Credentials activated",
      {
        loginUrl: this.config.get("FRONTEND_URL"),
        unsubscribeLink: this.config.get("FRONTEND_URL")+"/unsubscribe?email="+recipientEmail,
        todaysDate: new Date(),
        fullName: fullName,
      },
    );
  }

  public async sendCredentialsDeleted(
    recipientEmail: string,
    fullName: string,
    qualificationName: string,
  ): Promise<void> {
    await this.sendEmailTemplate(
      [recipientEmail],
      this.NO_REPLY_EMAIL,
      "sendCredentialsDeleted",
      "Credentials deleted",
      {
        todaysDate: new Date(),
        fullName: fullName,
        qualificationName: qualificationName,
      },
    );
  }

  public async sendAccountDeleted(
    recipientEmail: string,
    fullName: string,
  ): Promise<void> {
    await this.sendEmailTemplate(
      [recipientEmail],
      this.NO_REPLY_EMAIL,
      "sendAccountDeleted",
      "Account deleted",
      { fullName: fullName },
    );
  }

  public async sendInfoEmail(
    senderEmail: string,
    subject: string,
    emailText: string,
  ): Promise<void> {
    if ("true" !== await this.settings.get("emails.enabled")) {
      Logger.debug(`${this.config.get("ENV")} mode: Email sent to ${this.INFO_EMAIL} from ${this.NO_REPLY_EMAIL}, sender email is: ${senderEmail}, subject: ${subject}, text: ${emailText}`);
      return;
    }

    try {
      await this.mailService.sendMail({
        to: [this.INFO_EMAIL],
        from: this.NO_REPLY_EMAIL,
        template: "sendInfoEmail",
        subject: subject,
        context: { text: emailText, senderEmail: senderEmail },
      });

      Logger.debug(`${this.config.get("ENV")} mode: Email sent to ${this.INFO_EMAIL} from ${this.NO_REPLY_EMAIL}, sender email is: ${senderEmail}, subject: ${subject}, text: ${emailText}`);
    } catch (e) {
      Logger.error("Sending email failed", e);
    }
  }

  private async sendEmailTemplate(recipientEmails: string[], senderEmail: string, template: string, subject: string, templateData?: Record<string, unknown>): Promise<void> {
    for (const recipientEmail of recipientEmails) {
      if (await this.isUnsubscribed(recipientEmail) && template !== "sendOtpEmail") {
        Logger.debug(`User ${recipientEmail} is unsubscribed from email notifications`);
      } else {
        if ("true" !== await this.settings.get("emails.enabled")) {
          Logger.debug(`${this.config.get("ENV")} mode: Email sent to ${recipientEmails} from ${senderEmail}, subject: ${subject}, templateData: ${JSON.stringify(templateData)}`);
          return;
        }

        try {
          await this.mailService.sendMail({
            to: recipientEmails,
            from: senderEmail,
            template: template,
            subject: subject,
            context: templateData,
          });

          Logger.debug(`${this.config.get("ENV")} mode: Email sent to ${recipientEmails} from ${senderEmail}, subject: ${subject}, templateData: ${JSON.stringify(templateData)}`);
        } catch (e) {
          Logger.error("Sending email failed", e);
        }
      }
    }
  }

  /**
     * Check if user is unsubscribed
     */
  private async isUnsubscribed(email: string): Promise<boolean> {
    const user = await this.userRepository.get(email);

    return !user.subscribedToEmails;
  }
}
