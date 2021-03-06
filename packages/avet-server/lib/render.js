const { join } = require('path');
const { createElement } = require('react');
const { renderToString, renderToStaticMarkup } = require('react-dom/server');
const generateETag = require('etag');
const { Router } = require('avet-shared/lib/router');
const { defaultHead } = require('avet-shared/lib/head');
const Head = require('avet-shared/lib/head').default;
const App = require('avet-shared/lib/app').default;
const ErrorDebug = require('avet-shared/lib/error-debug').default;
const { flushChunks } = require('avet-shared/lib/dynamic');
const xssFilters = require('xss-filters');
const { getHttpClient } = require('avet-shared/lib/httpclient');

const {
  isResSent,
  resolvePath,
  requireModule,
  loadGetInitialProps,
  getAvailableChunks,
} = require('avet-utils');

const sendfile = require('./sendfile');

function renderToHTML(ctx, opts) {
  return doRender(ctx, opts);
}

function renderErrorToHTML(err, ctx, opts) {
  return doRender(ctx, Object.assign({}, opts, { err, page: '_error' }));
}

async function renderScript(ctx, page, opts) {
  try {
    const path = join(opts.dir, opts.dist, 'bundles', 'page', page);
    const realPath = await resolvePath(path);
    await serveStatic(ctx, realPath, ctx.app.config.app.staticOptions);
  } catch (err) {
    if (ctx.logger) {
      ctx.logger.error(err);
    } else {
      console.error(err);
    }

    if (err.code === 'ENOENT') {
      renderScriptError(ctx, page, err, {}, opts);
    }
  }
}

async function renderScriptError(ctx, page, error, customFields = {}, { dev }) {
  // Asks CDNs and others to not to cache the errored page
  ctx.set('Cache-Control', 'no-store, must-revalidate');
  // prevent XSS attacks by filtering the page before printing it.
  page = xssFilters.uriInSingleQuotedAttr(page);

  if (error.code === 'ENOENT') {
    ctx.type = 'text/javascript';
    ctx.body = `
      window.__APP_REGISTER_PAGE('${page}', function() {
        var error;
        error = new Error('Page does not exist: ${page}');
        error.statusCode = 404;

        return { error: error };
      });
    `;
    return;
  }

  ctx.type = 'text/javascript';

  const errorJson = Object.assign({}, serializeError(dev, error), customFields);

  ctx.body = `
    window.__APP_REGISTER_PAGE('${page}', function() {
      var error = ${JSON.stringify(errorJson)};
      return { error: error };
    });
  `;
}

function sendHTML(ctx, html, { dev }) {
  if (isResSent(ctx.res)) return;

  const etag = generateETag(html);

  if (ctx.fresh) {
    ctx.status = 304;
    return;
  }

  if (dev) {
    // In dev, we should not cache pages for any reason.
    // That's why we do this.
    ctx.set('Cache-Control', 'no-store, must-revalidate');
  }

  ctx.set('ETag', etag);
  ctx.type = 'text/html';
  ctx.length = Buffer.byteLength(html);
  ctx.body = ctx.method === 'HEAD' ? null : html;
}

function sendJSON(ctx, obj) {
  if (isResSent(ctx.res)) return;

  const json = JSON.stringify(obj);
  ctx.type = 'application/json';
  ctx.length = Buffer.byteLength(json);
  ctx.body = ctx.method === 'HEAD' ? null : json;
}

async function serveStatic(ctx, path, options) {
  await sendfile(ctx, path, options);
}

async function doRender(
  ctx,
  {
    err,
    page,
    buildId,
    buildStats,
    hotReloader,
    assetPrefix,
    availableChunks,
    dir = process.cwd(),
    dist,
    dev = false,
    staticMarkup = false,
    avetExport = false,
  }
) {
  page = page || ctx.request.path;

  await ensurePage(page, { dir, hotReloader });

  let [ Component, Document ] = await Promise.all([
    requireModule(join(dir, dist, 'dist', 'page', page)),
    requireModule(join(dir, dist, 'dist', 'page', '_document')),
  ]);

  Component = Component.default || Component;
  Document = Document.default || Document;

  const asPath = ctx.url;
  const _ctx = {
    ctx,
    asPath,
    httpclient: getHttpClient(ctx),
    pathname: ctx.path,
    query: ctx.query,
    err,
  };

  const props = await loadGetInitialProps(Component, _ctx);

  if (isResSent(ctx.res)) return;

  const renderPage = () => {
    const app = createElement(App, {
      props,
      Component,
      router: new Router(ctx.path, ctx.query),
    });

    const render = staticMarkup ? renderToStaticMarkup : renderToString;

    let html;
    let head;
    let errorHtml = '';
    try {
      if (err && dev) {
        errorHtml = render(createElement(ErrorDebug, { error: err }));
      } else if (err) {
        errorHtml = render(app);
      } else {
        html = render(app);
      }
    } finally {
      head = Head.rewind() || defaultHead();
    }

    const chunks = loadChunks({ dev, dir, dist, availableChunks });

    return { html, head, errorHtml, chunks };
  };

  const docProps = await loadGetInitialProps(
    Document,
    Object.assign({}, _ctx, { renderPage })
  );

  // While developing, we should not cache any assets.
  // So, we use a different buildId for each page load.
  // With that we can ensure, we have unique URL for assets per every page load.
  // So, it'll prevent issues like this: https://git.io/vHLtb
  const devBuildId = Date.now();

  if (isResSent(ctx.res)) return;

  if (!Document.prototype) {
    throw new Error('_document.js is not exporting a React element');
  }

  const doc = createElement(
    Document,
    Object.assign(
      {},
      {
        __APP_DATA__: {
          props,
          pathname: ctx.path,
          query: ctx.query,
          buildId: dev ? devBuildId : buildId,
          buildStats,
          assetPrefix,
          avetExport,
          err: err ? serializeError(dev, err) : null,
        },
        dev,
        dir,
        staticMarkup,
      },
      docProps
    )
  );

  return `<!DOCTYPE html>${renderToStaticMarkup(doc)}`;
}

function errorToJSON(err) {
  const { name, message, stack } = err;
  const json = { name, message, stack };

  if (err.module) {
    const { rawRequest } = err.module;
    json.module = { rawRequest };
  }

  return json;
}

function serializeError(dev, err) {
  if (dev) {
    return errorToJSON(err);
  }

  return { message: '500 - Internal Server Error.' };
}

async function ensurePage(page, { hotReloader }) {
  if (!hotReloader) return;
  if (page === '_error' || page === '_document') return;

  await hotReloader.ensurePage(page);
}

function loadChunks({ dev, dir, dist, availableChunks }) {
  const flushedChunks = flushChunks();
  const response = {
    names: [],
    filenames: [],
  };

  if (dev) {
    availableChunks = getAvailableChunks(dir, dist);
  }

  for (const chunk of flushedChunks) {
    const filename = availableChunks[chunk];
    if (filename) {
      response.names.push(chunk);
      response.filenames.push(filename);
    }
  }

  return response;
}

module.exports = {
  renderToHTML,
  renderErrorToHTML,
  renderScript,
  renderScriptError,
  sendHTML,
  sendJSON,
  serveStatic,
};
