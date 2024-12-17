import { ReleaseInfo, Repository } from '@prisma/client';
import { CommitResponse } from './dto';

export type RepositoryEntity = Repository;
export type ReleaseInfoEntity = ReleaseInfo;
export type CommitEntity = CommitResponse;
