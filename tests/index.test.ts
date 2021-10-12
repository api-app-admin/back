import { startServer } from '../src/server'

describe('Server', () => {
  test('Should be GraphQL Playground', async () => {
    const server = await startServer(true)

    const res = await server.inject({
      method: 'GET',
      url: '/',
      headers: {
        accept: 'text/html',
      },
    })
    await server.close()
    expect(res.statusCode).toBe(200)
    expect(res.body.includes('GraphQL Playground')).toBe(true)
  })
  test('Should be Apollo Server landing page', async () => {
    process.env.NODE_ENV = 'production';
    const server = await startServer(true)

    const res = await server.inject({
      method: 'GET',
      url: '/',
      headers: {
        accept: 'text/html',
      },
    })
    await server.close()
    expect(res.statusCode).toBe(200)
    expect(res.body.includes('Apollo Server')).toBe(true)
  })  
})
