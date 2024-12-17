import { components } from '@octokit/openapi-types';
import { Octokit } from '@octokit/rest';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'src/domain/shared/utils';

export class OctokitService {
  private readonly octokit: Octokit;

  constructor(accessToken: string) {
    this.octokit = new Octokit({ auth: accessToken });
  }

  private async getUserEmails(): Promise<components['schemas']['email'][]> {
    const response = await this.octokit.rest.users.listEmailsForAuthenticatedUser();
    return response.data;
  }

  public async getPrimaryVerifiedEmail(): Promise<string | null> {
    const emails = await this.getUserEmails();
    const primaryVerifiedEmail = emails.find((email) => {
      return email.primary && email.verified;
    });

    return primaryVerifiedEmail?.email || null;
  }

  public async getRecentTenRepositoryCommits(
    owner: string,
    repo: string,
  ): Promise<components['schemas']['commit'][]> {
    const response = await this.octokit.rest.repos.listCommits({
      owner,
      repo,
      per_page: DEFAULT_PAGE_SIZE,
      page: DEFAULT_PAGE,
    });
    return response.data;
  }

  public async getRepositoryByOwnerAndName(
    owner: string,
    repo: string,
  ): Promise<components['schemas']['full-repository']> {
    const response = await this.octokit.rest.repos.get({
      owner,
      repo,
    });
    return response.data;
  }

  public async getRepositoryReleasesByOwnerAndName(
    owner: string,
    repo: string,
  ): Promise<components['schemas']['release'][]> {
    const response = await this.octokit.rest.repos.listReleases({
      owner,
      repo,
    });
    return response.data;
  }
}
