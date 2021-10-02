import { NonEmptyArray } from 'type-graphql';
import { prismaResolvers } from './prismaResolvers';

import { AuthResolvers } from './auth';

export const resolvers: NonEmptyArray<Function> = [...prismaResolvers, AuthResolvers];
