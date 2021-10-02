import { shield, not } from 'graphql-shield'

import * as rules from './rules'

export const permissions = shield(
  {
    Query: {
      role: rules.isAdmin,
      roles: rules.isAdmin,
      user: rules.isAdmin,
      users: rules.isAdmin,
      me: rules.isAuthenticated,
    },
    Mutation: {
      createRole: rules.isAdmin,
      updateRole: rules.isAdmin,
      createUser: rules.isAdmin,
      updateUser: rules.isAdmin,
      signIn: not(rules.isAuthenticated),
      signUp: not(rules.isAuthenticated),
    },
  },
  {
    allowExternalErrors: true,
  }
)
