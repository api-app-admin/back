import fastify from 'fastify'

import { getGraphqlServer } from './graphql'

const app = async () => {
  const { graphql } = await getGraphqlServer()
  await graphql.start()
  const server = fastify()
  server.register(graphql.createHandler({path: '/'}))
  const PORT = process.env.PORT || 4000
  server.listen(PORT, '0.0.0.0', (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Graphql server at ${address}${graphql.graphqlPath}`)
  })
}

app()

export { app }
