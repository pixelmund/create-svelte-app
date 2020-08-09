declare module '@sapper/app' {
  import type { Writable } from 'svelte/store';

  interface Session {
    your_session: string;
  }

  interface Page {
    path: string;
    query: {
      [key: string]: string;
    };
    params: {
      [key: string]: string;
    };
  }

  interface Redirect {
    statusCode: number;
    location: string;
  }

  interface gotoOpts {
    replaceState: boolean;
  }
  function goto(href: string, opts?: gotoOpts): Promise<unknown>;
  function prefetch(
    href: string
  ): Promise<{ redirect?: Redirect; data?: unknown }>;
  function prefetchRoutes(pathnames: string[]): Promise<unknown>;
  function start(opts: { target: Node }): Promise<unknown>;
  const stores: () => { session: Writable<Session>; page: Writable<Page> };

  export { goto, prefetch, prefetchRoutes, start, stores };
}

declare module '@sapper/server' {
  import { RequestHandler } from 'express';

  interface MiddlewareOptions {
    session?: (req: Express.Request, res: Express.Response) => unknown;
    ignore?: unknown;
  }

  function middleware(opts?: MiddlewareOptions): RequestHandler;

  export { middleware };
}

declare module '@sapper/service-worker' {
  const timestamp: number;
  const files: string[];
  const shell: string[];
  const routes: { pattern: RegExp }[];

  export { timestamp, files, files as assets, shell, routes };
}
