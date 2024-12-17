import axios from 'axios';
import xml2js from 'xml2js';
import { FeedResponse, ReleaseResponse } from 'src/domain/shared/types';
import { formateTimeToIso } from 'src/shared/utils';

export class GithubService {
  public async getRepositoryLatestRelease(
    owner: string,
    repo: string,
  ): Promise<ReleaseResponse | null> {
    const url = `https://github.com/${owner}/${repo}/releases.atom`;
    const response = await axios.get(url);
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(response.data);
    const release: FeedResponse = result.feed.entry?.[0];

    if (!release) {
      return null;
    }

    const latestRelease = {
      version: release.title?.[0] || 'No title',
      url: release.link?.[0].$.href || '',
      notes: release.summary?.[0] || release.content?.[0]?._ || undefined,
      date: release.updated?.[0] ? formateTimeToIso(release.updated[0]) : undefined,
    };

    return latestRelease;
  }
}
