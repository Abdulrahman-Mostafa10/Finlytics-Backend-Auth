import crypto from "crypto";
import sgMail from "@sendgrid/mail";
import {UserVerificationRepository} from "../../repositories/user-verification.repository";
import {CreateVerificationChallengeUseCase} from "./create-verification-challenge.usecase";

// Config
import {config} from "../../../../config/config";

function log(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  if (data) {
    console.log(`[${timestamp}] ${message}`, data);
  } else {
    console.log(`[${timestamp}] ${message}`);
  }
}

export class SendVerificationCodeUseCase {
  constructor(
    private readonly userVerificationRepository: UserVerificationRepository,
    private readonly createVerificationChallengeUseCase: CreateVerificationChallengeUseCase
  ) {}

  async execute(input: {email: string}): Promise<{
    message: string;
    challengeToken: string;
    expiresIn: number;
  }> {
    let {email} = input;
    email = email.toLowerCase();
    log("Validating email input", {email});

    // Generate 6-digit numeric verification code
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    log("Generated verification code", {verificationCode});

    // Create JWT challenge
    log("Creating verification challenge");
    const challenge = await this.createVerificationChallengeUseCase.execute({
      email,
      verificationCode,
    });
    log("Verification challenge created", {challengeId: challenge.challengeId});

    // Set expiration time (15 minutes from now)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    log("Searching for existing verification record");
    const existingVerification = await this.userVerificationRepository.getOne({
      email,
      isDeleted: false,
    });

    if (existingVerification) {
      log("Existing verification found, updating", {
        id: existingVerification.id,
      });
      await this.userVerificationRepository.updateOne(
        {id: existingVerification.id},
        {
          $set: {
            verificationCode,
            isVerified: false,
            expiresAt,
            challengeId: challenge.challengeId,
          },
        }
      );
    } else {
      log("No existing verification found, creating new record");
      await this.userVerificationRepository.createOne({
        email,
        verificationCode,
        expiresAt,
        challengeId: challenge.challengeId,
      });
    }

    log("Preparing to send email with SendGrid");

    sgMail.setApiKey(config.sendgrid.apiKey!);


    try {
      await sgMail.send({
        to: email,
        from: config.sendgrid.senderEmail!,
        subject: "Verify your email - Financial Advisor",
        text: `Your verification code is: ${verificationCode}. This code expires in 15 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Email Verification Challenge</h2>
            <p>Please use the following verification code to complete your registration:</p>
            
            <div style="background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
              <h1 style="color: #333; font-size: 32px; margin: 0; letter-spacing: 4px;">${verificationCode}</h1>
            </div>
            
            <p><strong>Security Challenge Information:</strong></p>
            <ul>
              <li>This is a secure verification challenge</li>
              <li>Code expires in 15 minutes</li>
              <li>One-time use only</li>
              <li>Challenge ID: ${challenge.challengeId}</li>
            </ul>
            
            <p style="color: #666; font-size: 12px;">
              If you didn't request this verification, please ignore this email.
            </p>
          </div>
        `,
      });
      log("Email sent successfully");
    } catch (err) {
      log("Error sending email", err);
      throw err;
    }

    return {
      message: "Verification challenge sent successfully.",
      challengeToken: challenge.challengeToken,
      expiresIn: challenge.expiresIn,
    };
  }
}
