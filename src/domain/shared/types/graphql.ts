// import DataLoader from 'dataloader';
// import { CompanyEntity } from 'src/modules/book/types';

export interface ResolverContext {
  // companyLoader: DataLoader<string, CompanyEntity, string>;
  user?: {
    id: string;
    isTestUser: boolean;
  };
}
