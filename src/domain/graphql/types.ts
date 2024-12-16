import { GraphQLResolveInfo } from 'graphql';
import { UserEntity } from '../modules/user/types/entity';
import { CountryEntity } from '../modules/utils/types/entity';
import { SecurityEntity } from '../modules/security/types/entity';
import { PreferenceEntity } from '../modules/preference/types/entity';
import { ResolverContext } from '../shared/types/common/graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Country = {
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  phoneCode: Scalars['String']['output'];
  shortName: Scalars['String']['output'];
};

export type Mutation = {
  updatePreference?: Maybe<Preference>;
  updateProfile?: Maybe<User>;
  updateSecurity?: Maybe<Security>;
};


export type MutationUpdatePreferenceArgs = {
  input: UpdatePreferenceInput;
};


export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};


export type MutationUpdateSecurityArgs = {
  input: UpdateSecurityInput;
};

export type Preference = {
  id: Scalars['ID']['output'];
  loginEmailAlert: Scalars['Boolean']['output'];
  releaseAlert: Scalars['Boolean']['output'];
  updatedAt: Scalars['String']['output'];
};

export type Query = {
  countries?: Maybe<Array<Maybe<Country>>>;
  preference?: Maybe<Preference>;
  profile?: Maybe<User>;
  security?: Maybe<Security>;
};

export type Security = {
  id: Scalars['ID']['output'];
  twoFactorAuth: Scalars['Boolean']['output'];
  updatedAt: Scalars['String']['output'];
};

export type UpdatePreferenceInput = {
  loginEmailAlert: Scalars['Boolean']['input'];
  releaseAlert: Scalars['Boolean']['input'];
};

export type UpdateProfileInput = {
  contactCountryId?: InputMaybe<Scalars['String']['input']>;
  contactNumber?: InputMaybe<Scalars['String']['input']>;
  dob?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSecurityInput = {
  twoFactorAuth: Scalars['Boolean']['input'];
};

export type User = {
  contactCountry?: Maybe<Country>;
  contactNumber?: Maybe<Scalars['String']['output']>;
  dob?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isEmailVerified: Scalars['Boolean']['output'];
  name?: Maybe<Scalars['String']['output']>;
  profileImageId?: Maybe<Scalars['String']['output']>;
  profileImageUrl?: Maybe<Scalars['String']['output']>;
  username: Scalars['String']['output'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Country: ResolverTypeWrapper<CountryEntity>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Preference: ResolverTypeWrapper<PreferenceEntity>;
  Query: ResolverTypeWrapper<{}>;
  Security: ResolverTypeWrapper<SecurityEntity>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UpdatePreferenceInput: UpdatePreferenceInput;
  UpdateProfileInput: UpdateProfileInput;
  UpdateSecurityInput: UpdateSecurityInput;
  User: ResolverTypeWrapper<UserEntity>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  Country: CountryEntity;
  ID: Scalars['ID']['output'];
  Mutation: {};
  Preference: PreferenceEntity;
  Query: {};
  Security: SecurityEntity;
  String: Scalars['String']['output'];
  UpdatePreferenceInput: UpdatePreferenceInput;
  UpdateProfileInput: UpdateProfileInput;
  UpdateSecurityInput: UpdateSecurityInput;
  User: UserEntity;
};

export type AuthDirectiveArgs = { };

export type AuthDirectiveResolver<Result, Parent, ContextType = ResolverContext, Args = AuthDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type PrismaValidateDirectiveArgs = {
  model: Scalars['String']['input'];
  operation: Scalars['String']['input'];
};

export type PrismaValidateDirectiveResolver<Result, Parent, ContextType = ResolverContext, Args = PrismaValidateDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ValidateDirectiveArgs = {
  schema: Scalars['String']['input'];
};

export type ValidateDirectiveResolver<Result, Parent, ContextType = ResolverContext, Args = ValidateDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type CountryResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['Country'] = ResolversParentTypes['Country']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phoneCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  shortName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  updatePreference?: Resolver<Maybe<ResolversTypes['Preference']>, ParentType, ContextType, RequireFields<MutationUpdatePreferenceArgs, 'input'>>;
  updateProfile?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationUpdateProfileArgs, 'input'>>;
  updateSecurity?: Resolver<Maybe<ResolversTypes['Security']>, ParentType, ContextType, RequireFields<MutationUpdateSecurityArgs, 'input'>>;
};

export type PreferenceResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['Preference'] = ResolversParentTypes['Preference']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  loginEmailAlert?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  releaseAlert?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  countries?: Resolver<Maybe<Array<Maybe<ResolversTypes['Country']>>>, ParentType, ContextType>;
  preference?: Resolver<Maybe<ResolversTypes['Preference']>, ParentType, ContextType>;
  profile?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  security?: Resolver<Maybe<ResolversTypes['Security']>, ParentType, ContextType>;
};

export type SecurityResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['Security'] = ResolversParentTypes['Security']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  twoFactorAuth?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  contactCountry?: Resolver<Maybe<ResolversTypes['Country']>, ParentType, ContextType>;
  contactNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dob?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isEmailVerified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  profileImageId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  profileImageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = ResolverContext> = {
  Country?: CountryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Preference?: PreferenceResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Security?: SecurityResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = ResolverContext> = {
  auth?: AuthDirectiveResolver<any, any, ContextType>;
  prismaValidate?: PrismaValidateDirectiveResolver<any, any, ContextType>;
  validate?: ValidateDirectiveResolver<any, any, ContextType>;
};
