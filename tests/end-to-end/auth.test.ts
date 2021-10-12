import 'reflect-metadata'
import { createTestClient, ApolloServerTestClient } from 'apollo-server-integration-testing-fastify'

import { Error, RoleName } from '@generated/type-graphql'
import { PrismaClient } from '@prisma/client'

import { createApolloServer } from '../../src/graphql'
import { userData, rolesData } from '../../prisma/seedData'

let client: ApolloServerTestClient

const rolesQuery = `{
  roles {
    name
  }
}`

const meQuery = `query Query {
  me {
    id
    createdAt
    updatedAt
    email
    firstName
    lastName
    surName
    roles {
      id
      name
      description
    }
  }
}`

const signInMutation = `mutation SignInMutation($signInInput: SignIpInput!) {
  signIn(input: $signInInput) {
    token
    user {
      id
      createdAt
      updatedAt
      email
      firstName
      lastName
      surName
      roles {
        id
        name
        description
      }
    }
  }
}`

const signUpMutation = `mutation SignUpMutation($input: SignUpInput!) {
  signUp(input: $input) {
    token
    user {
      id
      createdAt
      updatedAt
      email
      firstName
      lastName
      surName
      roles {
        id
        name
        description
      }
    }
  }
}`

beforeAll(async () => {
  const { apolloServer } = await createApolloServer()
  client = await createTestClient({
    apolloServer,
  })
})

describe('Auth', () => {
  test('Should be ADMIN role user', async () => {
    const signInResult = await client.mutate({
      mutation: signInMutation,
      variables: { signInInput: { email: userData[0].email, password: 'AdminAdmin' } },
    })
    const adminSignIn = signInResult.json().data.signIn
    expect(typeof adminSignIn.token).toBe('string')
    const matchAdmin = {
      id: userData[0].id,
      email: userData[0].email,
      firstName: null,
      lastName: null,
      surName: null,
      roles: [
        {
          id: rolesData[1].id,
          name: rolesData[1].name,
          description: null,
        },
      ],
    }
    expect(adminSignIn.user).toMatchObject(matchAdmin)

    client.setOptions({
      requestOptions: {
        headers: { Authorization: `Bearer ${adminSignIn.token}` },
      },
    })
    const meQueryResult = await client.query({ query: meQuery })
    client.setOptions({
      requestOptions: {
        headers: {},
      },
    })
    const adminMe = meQueryResult.json().data.me
    expect(adminMe).toMatchObject(matchAdmin)
  })
  test('Should be USER role user', async () => {
    const userSignInResult = await client.mutate({
      mutation: signInMutation,
      variables: { signInInput: { email: userData[1].email, password: 'UserUser' } },
    })
    const userSignIn = userSignInResult.json().data.signIn
    expect(typeof userSignIn.token).toBe('string')
    const matchUser = {
      id: userData[1].id,
      email: userData[1].email,
      firstName: null,
      lastName: null,
      surName: null,
      roles: [
        {
          id: rolesData[0].id,
          name: rolesData[0].name,
          description: null,
        },
      ],
    }
    expect(userSignIn.user).toMatchObject(matchUser)

    client.setOptions({
      requestOptions: {
        headers: { Authorization: `Bearer ${userSignIn.token}` },
      },
    })
    const meQueryResult = await client.query({ query: meQuery })
    client.setOptions({
      requestOptions: {
        headers: {},
      },
    })
    const userMe = meQueryResult.json().data.me
    expect(userMe).toMatchObject(matchUser)
  })
  test('Should be a me request error if user do not have authorization', async () => {
    client.setOptions({
      requestOptions: {
        headers: {},
      },
    })
    const meQueryResult = await client.query({ query: meQuery })
    const errors = meQueryResult.json().errors as Array<{ extensions: { code: Error } }>
    const authError = errors.find(({ extensions }) => extensions.code === Error.NOT_AUTHORIZED)
    expect(!!authError).toBe(true)
  })
  test('Should be a me request error if user do bad authorization token', async () => {
    client.setOptions({
      requestOptions: {
        headers: { Authorization: `Bearer badToken` },
      },
    })
    const meQueryResult = await client.query({ query: meQuery })
    const errors = meQueryResult.json().errors as Array<{ extensions: { code: Error } }>
    const authError = errors.find(({ extensions }) => extensions.code === Error.NOT_AUTHORIZED)
    expect(!!authError).toBe(true)
  })
  test('Should be a me request error if user do bad authorization token', async () => {
    client.setOptions({
      requestOptions: {
        headers: { Authorization: `Bearer badToken` },
      },
    })
    const meQueryResult = await client.query({ query: meQuery })
    const errors = meQueryResult.json().errors as Array<{ extensions: { code: Error } }>
    const authError = errors.find(({ extensions }) => extensions.code === Error.NOT_AUTHORIZED)
    expect(!!authError).toBe(true)
  })
  test('Should be a me request error, if the user is not in the database', async () => {
    const MISSING_USER_TOKEN =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjZWNmZTZhOC1jOTE3LTRlOTctOGQzNi1mMjEwNDQ0NzgxODAiLCJpYXQiOjE2MzQ0NjM4NjJ9.exLv2mK0Y1KAFT7WsO6kk-iCy3UAm9v_w3xUu-sDwGE'
    client.setOptions({
      requestOptions: {
        headers: { Authorization: `Bearer ${MISSING_USER_TOKEN}` },
      },
    })
    const meQueryResult = await client.query({ query: meQuery })
    const errors = meQueryResult.json().errors as Array<{ extensions: { code: Error } }>
    const authError = errors.find(({ extensions }) => extensions.code === Error.NOT_AUTHORIZED)
    expect(!!authError).toBe(true)
  })
  test('Required to be a user with the ADMIN role to access the role request', async () => {
    const signInResult = await client.mutate({
      mutation: signInMutation,
      variables: { signInInput: { email: userData[0].email, password: 'AdminAdmin' } },
    })
    const adminSignIn = signInResult.json().data.signIn
    client.setOptions({
      requestOptions: {
        headers: { Authorization: `Bearer ${adminSignIn.token}` },
      },
    })
    const rolesQueryResult = await client.query({ query: rolesQuery })
    const roles = rolesQueryResult.json().data.roles as Array<{ name: RoleName }>
    expect(roles.length).toEqual(2)
  })
  test('Required to be a user with the not ADMIN role to bad access the role request', async () => {
    client.setOptions({
      requestOptions: {
        headers: {},
      },
    })
    const rolesQueryResult = await client.query({ query: rolesQuery })
    const errors = rolesQueryResult.json().errors as Array<{ extensions: { code: Error } }>
    const error = errors.find(({ extensions }) => extensions.code === Error.NOT_ADMIN)
    expect(!!error).toBe(true)
  })
  test('Should be signUp mutation', async () => {
    const input = {
      email: 'test@test.test',
      password: 'testPassword',
    }
    const signUpResult = await client.mutate({
      mutation: signUpMutation,
      variables: { input },
    })
    const signUpData = signUpResult.json().data.signUp
    expect(typeof signUpData.token).toBe('string')
    expect(signUpData.user).toMatchObject({
      email: input.email,
      roles: [
        {
          name: RoleName.USER,
        },
      ],
    })
    const badSignUpResult = await client.mutate({
      mutation: signUpMutation,
      variables: { input },
    })
    const errors = badSignUpResult.json().errors as Array<{ extensions: { code: Error } }>
    const error = errors.find(({ extensions }) => extensions.code === Error.EMAIL_ALREADY_USED)
    expect(!!error).toBe(true)
    const prisma = new PrismaClient()
    await prisma.user.delete({
      where: {
        email: input.email,
      },
    })
  })
  test('There should be an error if there is no user with the specified mail in the database', async () => {
    const signInResult = await client.mutate({
      mutation: signInMutation,
      variables: { signInInput: { email: 'bad@email.com', password: 'badPassword' } },
    })
    const errors = signInResult.json().errors as Array<{ extensions: { code: Error } }>
    const error = errors.find(({ extensions }) => extensions.code === Error.USER_NOT_FOUND)
    expect(!!error).toBe(true)
  })
  test('There must be an error if the password is wrong', async () => {
    const userSignInResult = await client.mutate({
      mutation: signInMutation,
      variables: { signInInput: { email: userData[1].email, password: 'badPassword' } },
    })
    const errors = userSignInResult.json().errors as Array<{ extensions: { code: Error } }>
    const error = errors.find(({ extensions }) => extensions.code === Error.INVALID_PASSWORD)
    expect(!!error).toBe(true)
  })  
})
