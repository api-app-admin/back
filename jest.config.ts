import { InitialOptionsTsJest } from 'ts-jest/dist/types'

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  transform: {
    '\\.(gql|graphql)$': '@jagi/jest-transform-graphql',
  },
} as InitialOptionsTsJest
