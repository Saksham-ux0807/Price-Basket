import { setupServer } from 'msw/node'
import type { RequestHandler } from 'msw'
import { handlers } from './handlers'

/**
 * MSW server instance for use in Vitest tests.
 * Start/stop lifecycle is managed in setupTests.ts or individual test files.
 *
 * Uses the default (empty) handlers array since the platform adapters use
 * simulated data and make no real HTTP calls.
 */
export const server = setupServer(...handlers)

/**
 * Create a test-scoped MSW server with specific handlers.
 *
 * Useful in integration tests that want to intercept real HTTP calls, e.g.
 * when the adapters are replaced with actual API calls in the future.
 *
 * @example
 * ```ts
 * import { blinkitHandlers } from './handlers'
 * const server = createServer(blinkitHandlers)
 * beforeAll(() => server.listen())
 * afterEach(() => server.resetHandlers())
 * afterAll(() => server.close())
 * ```
 */
export function createServer(customHandlers: RequestHandler[]) {
  return setupServer(...customHandlers)
}
