# Testing

## Strategy

- Vitest covers unit and integration tests: logic, schemas, synchronous components, and several units working together.
- Playwright covers end-to-end tests: user flows in a real Chromium against a real dev server.
- `async` Server Components are tested end-to-end only, because Vitest cannot render them.
- Every feature ships with its tests; a bug fix starts with a test that fails without the fix.

## Commands

- `npm test` runs all Vitest tests once; `npm run test:watch` reruns them on change.
- `npm test -- app/page.test.tsx` runs one file; `npm test -- --project node` (or `dom`) runs one project.
- `npm run test:e2e` runs the Playwright suite; `npm run test:e2e -- --ui` or `-- --debug` for interactive debugging.
- `npx playwright install chromium` downloads the browser once per machine.

## Where tests live

- Vitest tests sit next to the code they test as `*.test.ts` or `*.test.tsx`, in the root app and in both workspaces.
- The file extension picks the environment: `*.test.ts` runs in Node, `*.test.tsx` runs in jsdom (the two projects in `vitest.config.mts`).
- Playwright tests live in `e2e/` as `*.spec.ts`; the differing suffix keeps the two runners out of each other's files.

## Design decisions

- One root Vitest config covers the workspaces too, so `contract/` and `cli/` need no test setup of their own.
- Node is the default environment because most code here (schemas, CLI, server logic) never touches a DOM, and jsdom would hide Node-only mistakes.
- The e2e dev server uses port 3187 (override with `E2E_PORT`) and never reuses a running server, so a run always tests the current working tree.
- The e2e dev server builds into `.next-e2e` (via `NEXT_DIST_DIR`, read in `next.config.ts`), because Next.js allows only one `next dev` per build directory and would otherwise refuse to start next to `npm run dev`.
- Vitest globals are off: import `test`, `expect` and friends from `vitest`.

## Gotchas

- `next dev` rewrites `tsconfig.json` to include the types of its build directory; the `.next-e2e` entries there are intentional, and removing them makes every e2e run dirty the tree and fail lint.
- Testing Library cleans up between tests only through `vitest.setup.dom.ts`, since its automatic cleanup needs a global `afterEach`.
- A component test in a `.test.ts` file fails with `document is not defined`; rename it to `.test.tsx`.
- Use relative URLs in Playwright (`page.goto("/")`); `baseURL` carries the port.
- A failed e2e test leaves a trace in `test-results/`; open it with `npx playwright show-trace <path-to-trace.zip>`.
- The Vitest config must stay `.mts`: as `.ts` it is loaded as CommonJS and Vite warns about its ESM syntax.
