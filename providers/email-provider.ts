export interface EmailOptions {
  to: string;
  subject: string;
  template: "WELCOME" | "INTERVIEW_REQUEST" | "INTERVIEW_REMINDER" | "AI_INTERVIEW_COMPLETED" | "CANDIDATE_READY_FOR_HR" | "PASSWORD_RESET";
  data: Record<string, any>;
}

export interface EmailProvider {
  sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId: string }>;
}

export class MockEmailProvider implements EmailProvider {
  async sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId: string }> {
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    console.log(`[EmailProvider] Sent ${options.template} to ${options.to} (Subject: "${options.subject}") [ID: ${messageId}]`);
    return { success: true, messageId };
  }
}

let emailInstance: EmailProvider | null = null;

export function getEmailProvider(): EmailProvider {
  if (!emailInstance) {
    emailInstance = new MockEmailProvider();
  }
  return emailInstance;
}
