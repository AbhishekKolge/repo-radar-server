import { Octokit } from 'octokit';
import { EmailResponse } from 'src/domain/shared/types';

export class OctokitService {
  private readonly octokit: Octokit;

  constructor(accessToken: string) {
    this.octokit = new Octokit({ auth: accessToken });
  }

  private async getUserEmails(): Promise<EmailResponse[]> {
    const response = await this.octokit.rest.users.listEmailsForAuthenticatedUser();
    return response.data as EmailResponse[];
  }

  public async getPrimaryVerifiedEmail(): Promise<string | null> {
    const emails = await this.getUserEmails();
    const primaryVerifiedEmail = emails.find((email) => {
      return email.primary && email.verified;
    });

    return primaryVerifiedEmail?.email || null;
  }
}
