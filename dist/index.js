"use strict";

// node_modules/@hono/node-server/dist/constants-BLSFu_RU.mjs
var X_ALREADY_SENT = "x-hono-already-sent";

// node_modules/@hono/node-server/dist/index.mjs
var import_node_http = require("node:http");
var import_node_http2 = require("node:http2");
var import_node_stream = require("node:stream");

// node_modules/hono/dist/helper/websocket/index.js
var defineWebSocketHelper = (handler) => {
  return ((...args) => {
    if (typeof args[0] === "function") {
      const [createEvents, options] = args;
      return async function upgradeWebSocket2(c, next) {
        const events = await createEvents(c);
        const result = await handler(c, events, options);
        if (result) {
          return result;
        }
        await next();
      };
    } else {
      const [c, events, options] = args;
      return (async () => {
        const upgraded = await handler(c, events, options);
        if (!upgraded) {
          throw new Error("Failed to upgrade WebSocket");
        }
        return upgraded;
      })();
    }
  });
};

// node_modules/@hono/node-server/dist/index.mjs
var RequestError = class extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "RequestError";
  }
};
var nonJoinedHeaders = /* @__PURE__ */ new Set([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "server",
  "user-agent"
]);
var validHeaderName = /^[!#$%&'*+\-.^_`|~\dA-Za-z]+$/;
var isHttpWhitespace = (code) => code === 9 || code === 10 || code === 13 || code === 32;
var normalizeHeaderValue = (value) => {
  if (!isHttpWhitespace(value.charCodeAt(0)) && !isHttpWhitespace(value.charCodeAt(value.length - 1))) return value;
  let start = 0;
  let end = value.length;
  while (start < end && isHttpWhitespace(value.charCodeAt(start))) start++;
  while (end > start && isHttpWhitespace(value.charCodeAt(end - 1))) end--;
  return value.slice(start, end);
};
var forbiddenHeaderValue = /[\0\r\n]/;
var GlobalHeaders = globalThis.Headers;
var materializeHeaders = (rawHeaders, HeadersCtor = GlobalHeaders) => {
  const headers = new HeadersCtor();
  for (let i = 0; i < rawHeaders.length; i += 2) {
    const name = rawHeaders[i];
    if (!name.startsWith(":")) headers.append(name, rawHeaders[i + 1]);
  }
  return headers;
};
var RequestHeaders = class {
  #incoming;
  #rawHeaders;
  #headers;
  #invalidValue;
  constructor(incoming) {
    this.#incoming = incoming;
    if (incoming instanceof import_node_http2.Http2ServerRequest) this.#rawHeaders = incoming.rawHeaders.slice();
  }
  get #lazyRawHeaders() {
    return this.#rawHeaders ??= this.#incoming.rawHeaders.slice();
  }
  get #native() {
    if (!this.#headers) {
      this.#headers = materializeHeaders(this.#lazyRawHeaders);
      this.#rawHeaders = void 0;
    }
    return this.#headers;
  }
  #normalizedName(name) {
    if (typeof name !== "string") return;
    if (!validHeaderName.test(name)) throw new TypeError(`Invalid header name: ${name}`);
    return name.toLowerCase();
  }
  #lookupHttp1(lowerName) {
    const headers = this.#incoming instanceof import_node_http2.Http2ServerRequest ? void 0 : this.#incoming.headers;
    if (!headers || nonJoinedHeaders.has(lowerName) || lowerName === "set-cookie" || lowerName === "__proto__") return;
    if (!Object.hasOwn(headers, lowerName)) return null;
    const rawValue = headers[lowerName];
    if (typeof rawValue === "string") {
      const value = normalizeHeaderValue(rawValue);
      return forbiddenHeaderValue.test(value) ? void 0 : value;
    }
  }
  #lookup(rawHeaders, lowerName) {
    const separator = lowerName === "cookie" ? "; " : ", ";
    let value = null;
    for (let i = 0; i < rawHeaders.length; i += 2) {
      const rawName = rawHeaders[i];
      if (rawName.length === lowerName.length && rawName.toLowerCase() === lowerName) {
        const rawValue = normalizeHeaderValue(rawHeaders[i + 1]);
        if (forbiddenHeaderValue.test(rawValue)) {
          this.#invalidValue = true;
          return;
        }
        value = value === null ? rawValue : value + separator + rawValue;
      }
    }
    return value;
  }
  append(name, value) {
    this.#native.append(name, value);
  }
  delete(name) {
    this.#native.delete(name);
  }
  get(name) {
    const lowerName = this.#normalizedName(name);
    if (lowerName && !this.#headers && !this.#invalidValue) {
      const http1Value = this.#lookupHttp1(lowerName);
      if (http1Value !== void 0) return http1Value;
      const value = this.#lookup(this.#lazyRawHeaders, lowerName);
      if (value !== void 0) return value;
    }
    return this.#native.get(name);
  }
  has(name) {
    const lowerName = this.#normalizedName(name);
    if (lowerName && !this.#headers && !this.#invalidValue) {
      const http1Value = this.#lookupHttp1(lowerName);
      if (http1Value !== void 0) return http1Value !== null;
      const value = this.#lookup(this.#lazyRawHeaders, lowerName);
      if (value !== void 0) return value !== null;
    }
    return this.#native.has(name);
  }
  set(name, value) {
    this.#native.set(name, value);
  }
  getSetCookie() {
    return this.#native.getSetCookie();
  }
  keys() {
    return this.#native.keys();
  }
  values() {
    return this.#native.values();
  }
  entries() {
    return this.#native.entries();
  }
  forEach(callback, thisArg) {
    this.#native.forEach((value, key) => {
      callback.call(thisArg, value, key, this);
    });
  }
  [Symbol.iterator]() {
    return this.entries();
  }
};
Object.defineProperty(RequestHeaders.prototype, /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom"), { value: function(depth, options, inspectFn) {
  return `Headers (lightweight) ${inspectFn(Object.fromEntries(this), {
    ...options,
    depth: depth == null ? null : depth - 1
  })}`;
} });
Object.setPrototypeOf(RequestHeaders.prototype, GlobalHeaders.prototype);
var newHeadersFromIncoming = (incoming) => globalThis.Headers === GlobalHeaders ? new RequestHeaders(incoming) : materializeHeaders(incoming.rawHeaders, globalThis.Headers);
var reValidRequestUrl = /^\/[!#$&-;=?-\[\]_a-z~]*$/;
var reDotSegment = /\/\.\.?(?:[/?#]|$)/;
var reValidHost = /^[a-z0-9._-]+(?::(?:[1-5]\d{3,4}|[6-9]\d{3}))?$/;
var buildUrl = (scheme, host, incomingUrl) => {
  const url = `${scheme}://${host}${incomingUrl}`;
  if (!reValidHost.test(host)) {
    const urlObj = new URL(url);
    if (urlObj.hostname.length !== host.length && urlObj.hostname !== (host.includes(":") ? host.replace(/:\d+$/, "") : host).toLowerCase()) throw new RequestError("Invalid host header");
    return urlObj.href;
  } else if (incomingUrl.length === 0) return url + "/";
  else {
    if (incomingUrl.charCodeAt(0) !== 47) throw new RequestError("Invalid URL");
    if (!reValidRequestUrl.test(incomingUrl) || reDotSegment.test(incomingUrl)) return new URL(url).href;
    return url;
  }
};
var toRequestError = (e) => {
  if (e instanceof RequestError) return e;
  return new RequestError(e.message, { cause: e });
};
var GlobalRequest = global.Request;
var Request$1 = class extends GlobalRequest {
  constructor(input, options) {
    if (typeof input === "object" && getRequestCache in input) {
      const hasReplacementBody = options !== void 0 && "body" in options && options.body != null;
      if (input[bodyConsumedDirectlyKey] && !hasReplacementBody) throw new TypeError("Cannot construct a Request with a Request object that has already been used.");
      input = input[getRequestCache]();
    }
    if (typeof options?.body?.getReader !== "undefined") options.duplex ??= "half";
    super(input, options);
  }
};
var wrapBodyStream = /* @__PURE__ */ Symbol("wrapBodyStream");
var byteExactEncodings = /* @__PURE__ */ new Set([
  "latin1",
  "binary",
  "hex",
  "base64",
  "base64url"
]);
var isByteExactEncoding = (encoding) => encoding === null || byteExactEncodings.has(encoding);
var bodyBufferedBeforeDisconnectKey = /* @__PURE__ */ Symbol("bodyBufferedBeforeDisconnect");
var bodyBufferedLengthBeforeDisconnectKey = /* @__PURE__ */ Symbol("bodyBufferedLengthBeforeDisconnect");
var toBufferChunk = (chunk, encoding) => Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding ?? "utf8");
var isRecoverableDisconnectedIncoming = (incoming) => !(incoming instanceof import_node_http2.Http2ServerRequest) && !!incoming.complete && !!incoming.readableAborted && typeof incoming.read === "function" && isByteExactEncoding(incoming.readableEncoding);
var recordBodyBufferedBeforeDisconnect = (incoming) => {
  if (incoming.readableDidRead || !isRecoverableDisconnectedIncoming(incoming)) return;
  const incomingWithRecovery = incoming;
  incomingWithRecovery[bodyBufferedLengthBeforeDisconnectKey] ??= incoming.readableLength;
};
var readBodyBufferedBeforeDisconnect = (incoming, chunks) => {
  if (incoming.readableDidRead && !chunks || !isRecoverableDisconnectedIncoming(incoming)) return;
  const incomingWithRecovery = incoming;
  if (incomingWithRecovery[bodyBufferedBeforeDisconnectKey] !== void 0) return incomingWithRecovery[bodyBufferedBeforeDisconnectKey];
  let result;
  const errored = incoming.errored;
  if (errored && errored.code !== "ECONNRESET") result = errored;
  else if (incomingWithRecovery[bodyBufferedLengthBeforeDisconnectKey] !== void 0 && incoming.readableLength !== incomingWithRecovery[bodyBufferedLengthBeforeDisconnectKey]) result = newBodyUnusableError();
  else {
    const bodyChunks = chunks ?? [];
    const chunk = incoming.read();
    if (chunk !== null) bodyChunks.push(toBufferChunk(chunk, incoming.readableEncoding));
    const buffer = bodyChunks.length === 1 ? bodyChunks[0] : Buffer.concat(bodyChunks);
    result = buffer;
    const contentLength = incoming.headers["content-length"];
    if (typeof contentLength === "string" && /^\d+$/.test(contentLength)) {
      const expectedLength = Number(contentLength);
      if (Number.isSafeInteger(expectedLength) && buffer.length !== expectedLength) result = newBodyUnusableError();
    }
  }
  incomingWithRecovery[bodyBufferedBeforeDisconnectKey] = result;
  return result;
};
var enqueueBufferedBody = (controller, buffered) => {
  if (buffered instanceof Error) {
    controller.error(buffered);
    return;
  }
  if (buffered.length > 0) controller.enqueue(buffered);
  controller.close();
};
var newRequestFromIncoming = (method, url, headers, incoming, abortController) => {
  const init = {
    method,
    headers,
    signal: abortController.signal
  };
  if (method === "TRACE") {
    init.method = "GET";
    const req = new Request$1(url, init);
    Object.defineProperty(req, "method", { get() {
      return "TRACE";
    } });
    return req;
  }
  if (!(method === "GET" || method === "HEAD")) if ("rawBody" in incoming && incoming.rawBody instanceof Buffer) init.body = new ReadableStream({ start(controller) {
    controller.enqueue(incoming.rawBody);
    controller.close();
  } });
  else if (incoming[wrapBodyStream]) {
    let reader;
    init.body = new ReadableStream({ async pull(controller) {
      try {
        if (!reader) {
          const buffered = readBodyBufferedBeforeDisconnect(incoming);
          if (buffered !== void 0) {
            enqueueBufferedBody(controller, buffered);
            return;
          }
        }
        reader ||= import_node_stream.Readable.toWeb(incoming).getReader();
        const { done, value } = await reader.read();
        if (done) controller.close();
        else controller.enqueue(value);
      } catch (error) {
        controller.error(error);
      }
    } });
  } else {
    const buffered = readBodyBufferedBeforeDisconnect(incoming);
    if (buffered !== void 0) init.body = new ReadableStream({ start(controller) {
      enqueueBufferedBody(controller, buffered);
    } });
    else init.body = import_node_stream.Readable.toWeb(incoming);
  }
  return new Request$1(url, init);
};
var getRequestCache = /* @__PURE__ */ Symbol("getRequestCache");
var requestCache = /* @__PURE__ */ Symbol("requestCache");
var incomingKey = /* @__PURE__ */ Symbol("incomingKey");
var urlKey = /* @__PURE__ */ Symbol("urlKey");
var methodKey = /* @__PURE__ */ Symbol("methodKey");
var headersKey = /* @__PURE__ */ Symbol("headersKey");
var abortControllerKey = /* @__PURE__ */ Symbol("abortControllerKey");
var getAbortController = /* @__PURE__ */ Symbol("getAbortController");
var abortRequest = /* @__PURE__ */ Symbol("abortRequest");
var bodyBufferKey = /* @__PURE__ */ Symbol("bodyBuffer");
var bodyReadPromiseKey = /* @__PURE__ */ Symbol("bodyReadPromise");
var bodyConsumedDirectlyKey = /* @__PURE__ */ Symbol("bodyConsumedDirectly");
var bodyLockReaderKey = /* @__PURE__ */ Symbol("bodyLockReader");
var abortReasonKey = /* @__PURE__ */ Symbol("abortReason");
var newBodyUnusableError = () => {
  return /* @__PURE__ */ new TypeError("Body is unusable");
};
var rejectBodyUnusable = () => {
  return Promise.reject(newBodyUnusableError());
};
var textDecoder = new TextDecoder();
var consumeBodyDirectOnce = (request) => {
  if (request[bodyConsumedDirectlyKey]) return rejectBodyUnusable();
  request[bodyConsumedDirectlyKey] = true;
};
var toArrayBuffer = (buf) => {
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
};
var contentType = (request) => {
  return (request[headersKey] ||= newHeadersFromIncoming(request[incomingKey])).get("content-type") || "";
};
var methodTokenRegExp = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
var normalizeIncomingMethod = (method) => {
  if (typeof method !== "string" || method.length === 0) return "GET";
  switch (method) {
    case "DELETE":
    case "GET":
    case "HEAD":
    case "OPTIONS":
    case "PATCH":
    case "POST":
    case "PUT":
    case "QUERY":
      return method;
  }
  const upper = method.toUpperCase();
  switch (upper) {
    case "DELETE":
    case "GET":
    case "HEAD":
    case "OPTIONS":
    case "POST":
    case "PUT":
      return upper;
    default:
      return method;
  }
};
var validateDirectReadMethod = (method) => {
  if (!methodTokenRegExp.test(method)) return /* @__PURE__ */ new TypeError(`'${method}' is not a valid HTTP method.`);
  const normalized = method.toUpperCase();
  if (normalized === "CONNECT" || normalized === "TRACK" || normalized === "TRACE" && method !== "TRACE") return /* @__PURE__ */ new TypeError(`'${method}' HTTP method is unsupported.`);
};
var readBodyWithFastPath = (request, method, fromBuffer) => {
  if (request[bodyConsumedDirectlyKey]) return rejectBodyUnusable();
  const methodName = request.method;
  if (methodName === "GET" || methodName === "HEAD") return request[getRequestCache]()[method]();
  const methodValidationError = validateDirectReadMethod(methodName);
  if (methodValidationError) return Promise.reject(methodValidationError);
  if (request[requestCache]) {
    if (methodName !== "TRACE") return request[requestCache][method]();
  }
  const alreadyUsedError = consumeBodyDirectOnce(request);
  if (alreadyUsedError) return alreadyUsedError;
  const raw2 = readRawBodyIfAvailable(request);
  if (raw2) {
    const result = Promise.resolve(fromBuffer(raw2, request));
    request[bodyBufferKey] = void 0;
    return result;
  }
  return readBodyDirect(request).then((buf) => {
    const result = fromBuffer(buf, request);
    request[bodyBufferKey] = void 0;
    return result;
  });
};
var readRawBodyIfAvailable = (request) => {
  const incoming = request[incomingKey];
  if ("rawBody" in incoming && incoming.rawBody instanceof Buffer) return incoming.rawBody;
};
var normalizeAbortError = (request, incoming) => {
  if (incoming.errored) return incoming.errored;
  const reason = request[abortReasonKey];
  if (reason !== void 0) return reason instanceof Error ? reason : new Error(String(reason));
  return /* @__PURE__ */ new Error("Client connection prematurely closed.");
};
var readBodyDirect = (request) => {
  if (request[bodyBufferKey]) return Promise.resolve(request[bodyBufferKey]);
  if (request[bodyReadPromiseKey]) return request[bodyReadPromiseKey];
  const incoming = request[incomingKey];
  if (incoming.readableDidRead) return rejectBodyUnusable();
  const buffered = readBodyBufferedBeforeDisconnect(incoming);
  if (buffered !== void 0) {
    if (buffered instanceof Error) return Promise.reject(buffered);
    request[bodyBufferKey] = buffered;
    return Promise.resolve(buffered);
  }
  const promise = new Promise((resolve, reject) => {
    const chunks = [];
    let settled = false;
    const finish = (callback) => {
      if (settled) return;
      settled = true;
      cleanup();
      callback();
    };
    const recoverCompleteBodyAfterDisconnect = (error) => {
      const streamError = incoming.errored ?? error;
      if (!isRecoverableDisconnectedIncoming(incoming) || streamError && streamError.code !== "ECONNRESET") return false;
      finish(() => {
        const recovered = readBodyBufferedBeforeDisconnect(incoming, chunks);
        if (recovered instanceof Error) reject(recovered);
        else if (recovered === void 0) reject(error ?? normalizeAbortError(request, incoming));
        else {
          request[bodyBufferKey] = recovered;
          resolve(recovered);
        }
      });
      return true;
    };
    const onData = (chunk) => {
      chunks.push(toBufferChunk(chunk, incoming.readableEncoding));
    };
    const onEnd = () => {
      finish(() => {
        const buffer = chunks.length === 1 ? chunks[0] : Buffer.concat(chunks);
        request[bodyBufferKey] = buffer;
        resolve(buffer);
      });
    };
    const onError = (error) => {
      if (recoverCompleteBodyAfterDisconnect(error)) return;
      finish(() => {
        reject(error);
      });
    };
    const onClose = () => {
      if (incoming.readableEnded) {
        onEnd();
        return;
      }
      if (recoverCompleteBodyAfterDisconnect()) return;
      finish(() => {
        reject(normalizeAbortError(request, incoming));
      });
    };
    const cleanup = () => {
      incoming.off("data", onData);
      incoming.off("end", onEnd);
      incoming.off("error", onError);
      incoming.off("close", onClose);
      request[bodyReadPromiseKey] = void 0;
    };
    incoming.on("data", onData);
    incoming.on("end", onEnd);
    incoming.on("error", onError);
    incoming.on("close", onClose);
    queueMicrotask(() => {
      if (settled) return;
      if (incoming.readableEnded) onEnd();
      else if (incoming.errored) onError(incoming.errored);
      else if (incoming.destroyed) onClose();
    });
  });
  request[bodyReadPromiseKey] = promise;
  return promise;
};
var requestPrototype = {
  get method() {
    return this[methodKey];
  },
  get url() {
    return this[urlKey];
  },
  get headers() {
    return this[headersKey] ||= newHeadersFromIncoming(this[incomingKey]);
  },
  [abortRequest](reason) {
    if (this[abortReasonKey] === void 0) this[abortReasonKey] = reason;
    const abortController = this[abortControllerKey];
    if (abortController && !abortController.signal.aborted) abortController.abort(reason);
  },
  [getAbortController]() {
    this[abortControllerKey] ||= new AbortController();
    if (this[abortReasonKey] !== void 0 && !this[abortControllerKey].signal.aborted) this[abortControllerKey].abort(this[abortReasonKey]);
    return this[abortControllerKey];
  },
  [getRequestCache]() {
    const abortController = this[getAbortController]();
    if (this[requestCache]) return this[requestCache];
    const method = this.method;
    if (this[bodyConsumedDirectlyKey] && !(method === "GET" || method === "HEAD")) {
      this[bodyBufferKey] = void 0;
      const init = {
        method: method === "TRACE" ? "GET" : method,
        headers: this.headers,
        signal: abortController.signal
      };
      if (method !== "TRACE") {
        init.body = new ReadableStream({ start(c) {
          c.close();
        } });
        init.duplex = "half";
      }
      const req = new Request$1(this[urlKey], init);
      if (method === "TRACE") Object.defineProperty(req, "method", { get() {
        return "TRACE";
      } });
      return this[requestCache] = req;
    }
    return this[requestCache] = newRequestFromIncoming(this.method, this[urlKey], this.headers, this[incomingKey], abortController);
  },
  get body() {
    if (!this[bodyConsumedDirectlyKey]) return this[getRequestCache]().body;
    const request = this[getRequestCache]();
    if (!this[bodyLockReaderKey] && request.body) this[bodyLockReaderKey] = request.body.getReader();
    return request.body;
  },
  get bodyUsed() {
    if (this[bodyConsumedDirectlyKey]) return true;
    if (this[requestCache]) return this[requestCache].bodyUsed;
    return false;
  }
};
Object.defineProperty(requestPrototype, "signal", { get() {
  return this[getAbortController]().signal;
} });
[
  "cache",
  "credentials",
  "destination",
  "integrity",
  "mode",
  "redirect",
  "referrer",
  "referrerPolicy",
  "keepalive"
].forEach((k) => {
  Object.defineProperty(requestPrototype, k, { get() {
    return this[getRequestCache]()[k];
  } });
});
["clone", "formData"].forEach((k) => {
  Object.defineProperty(requestPrototype, k, { value: function() {
    if (this[bodyConsumedDirectlyKey]) {
      if (k === "clone") throw newBodyUnusableError();
      return rejectBodyUnusable();
    }
    return this[getRequestCache]()[k]();
  } });
});
Object.defineProperty(requestPrototype, "text", { value: function() {
  return readBodyWithFastPath(this, "text", (buf) => textDecoder.decode(buf));
} });
Object.defineProperty(requestPrototype, "arrayBuffer", { value: function() {
  return readBodyWithFastPath(this, "arrayBuffer", (buf) => toArrayBuffer(buf));
} });
Object.defineProperty(requestPrototype, "blob", { value: function() {
  return readBodyWithFastPath(this, "blob", (buf, request) => {
    const type = contentType(request);
    const init = type ? { headers: { "content-type": type } } : void 0;
    return new Response(buf, init).blob();
  });
} });
Object.defineProperty(requestPrototype, "json", { value: function() {
  if (this[bodyConsumedDirectlyKey]) return rejectBodyUnusable();
  return this.text().then(JSON.parse);
} });
Object.defineProperty(requestPrototype, /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom"), { value: function(depth, options, inspectFn) {
  return `Request (lightweight) ${inspectFn({
    method: this.method,
    url: this.url,
    headers: this.headers,
    nativeRequest: this[requestCache]
  }, {
    ...options,
    depth: depth == null ? null : depth - 1
  })}`;
} });
Object.setPrototypeOf(requestPrototype, Request$1.prototype);
var newRequest = (incoming, defaultHostname) => {
  const req = Object.create(requestPrototype);
  req[incomingKey] = incoming;
  req[methodKey] = normalizeIncomingMethod(incoming.method);
  const incomingUrl = incoming.url || "";
  if (incomingUrl[0] !== "/" && (incomingUrl.startsWith("http://") || incomingUrl.startsWith("https://"))) {
    if (incoming instanceof import_node_http2.Http2ServerRequest) throw new RequestError("Absolute URL for :path is not allowed in HTTP/2");
    try {
      req[urlKey] = new URL(incomingUrl).href;
    } catch (e) {
      throw new RequestError("Invalid absolute URL", { cause: e });
    }
    return req;
  }
  const host = (incoming instanceof import_node_http2.Http2ServerRequest ? incoming.authority : incoming.headers.host) || defaultHostname;
  if (!host) throw new RequestError("Missing host header");
  let scheme;
  if (incoming instanceof import_node_http2.Http2ServerRequest) {
    scheme = incoming.scheme;
    if (!(scheme === "http" || scheme === "https")) throw new RequestError("Unsupported scheme");
  } else scheme = incoming.socket && incoming.socket.encrypted ? "https" : "http";
  try {
    req[urlKey] = buildUrl(scheme, host, incomingUrl);
  } catch (e) {
    if (e instanceof RequestError) throw e;
    else throw new RequestError("Invalid URL", { cause: e });
  }
  return req;
};
var defaultContentType = "text/plain; charset=UTF-8";
var responseCache = /* @__PURE__ */ Symbol("responseCache");
var getResponseCache = /* @__PURE__ */ Symbol("getResponseCache");
var cacheKey = /* @__PURE__ */ Symbol("cache");
var GlobalResponse = global.Response;
var Response$1 = class Response$12 {
  #body;
  #init;
  [getResponseCache]() {
    const cache = this[cacheKey];
    const liveHeaders = cache && cache[2] instanceof Headers ? cache[2] : void 0;
    delete this[cacheKey];
    return this[responseCache] ||= new GlobalResponse(this.#body, liveHeaders ? {
      status: this.#init?.status,
      statusText: this.#init?.statusText,
      headers: liveHeaders
    } : this.#init);
  }
  constructor(body, init) {
    let headers;
    this.#body = body;
    if (init instanceof GlobalResponse) {
      const cachedGlobalResponse = init[responseCache];
      if (cachedGlobalResponse) {
        this.#init = cachedGlobalResponse;
        this[getResponseCache]();
        return;
      }
      this.#init = init instanceof Response$12 ? init.#init : init;
      headers = new Headers(init.headers);
    } else this.#init = init;
    if (body == null || typeof body === "string" || typeof body?.getReader !== "undefined" || body instanceof Blob || body instanceof Uint8Array) this[cacheKey] = [
      init?.status || 200,
      body ?? null,
      headers || init?.headers
    ];
  }
  get headers() {
    const cache = this[cacheKey];
    if (cache) {
      if (!(cache[2] instanceof Headers)) cache[2] = new Headers(cache[2] || (cache[1] === null ? void 0 : { "content-type": defaultContentType }));
      return cache[2];
    }
    return this[getResponseCache]().headers;
  }
  get status() {
    return this[cacheKey]?.[0] ?? this[getResponseCache]().status;
  }
  get ok() {
    const status = this.status;
    return status >= 200 && status < 300;
  }
};
[
  "body",
  "bodyUsed",
  "redirected",
  "statusText",
  "trailers",
  "type",
  "url"
].forEach((k) => {
  Object.defineProperty(Response$1.prototype, k, { get() {
    return this[getResponseCache]()[k];
  } });
});
[
  "arrayBuffer",
  "blob",
  "clone",
  "formData",
  "json",
  "text"
].forEach((k) => {
  Object.defineProperty(Response$1.prototype, k, { value: function() {
    return this[getResponseCache]()[k]();
  } });
});
Object.defineProperty(Response$1.prototype, /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom"), { value: function(depth, options, inspectFn) {
  return `Response (lightweight) ${inspectFn({
    status: this.status,
    headers: this.headers,
    ok: this.ok,
    nativeResponse: this[responseCache]
  }, {
    ...options,
    depth: depth == null ? null : depth - 1
  })}`;
} });
Object.setPrototypeOf(Response$1, GlobalResponse);
Object.setPrototypeOf(Response$1.prototype, GlobalResponse.prototype);
var validRedirectUrl = /^https?:\/\/[!#-;=?-[\]_a-z~A-Z]+$/;
var parseRedirectUrl = (url) => {
  if (url instanceof URL) return url.href;
  if (validRedirectUrl.test(url)) return url;
  return new URL(url).href;
};
var validRedirectStatuses = /* @__PURE__ */ new Set([
  301,
  302,
  303,
  307,
  308
]);
Object.defineProperty(Response$1, "redirect", {
  value: function redirect(url, status = 302) {
    if (!validRedirectStatuses.has(status)) throw new RangeError("Invalid status code");
    return new Response$1(null, {
      status,
      headers: { location: parseRedirectUrl(url) }
    });
  },
  writable: true,
  configurable: true
});
Object.defineProperty(Response$1, "json", {
  value: function json(data, init) {
    const body = JSON.stringify(data);
    if (body === void 0) throw new TypeError("The data is not JSON serializable");
    const initHeaders = init?.headers;
    let headers;
    if (initHeaders) {
      headers = new Headers(initHeaders);
      if (!headers.has("content-type")) headers.set("content-type", "application/json");
    } else headers = { "content-type": "application/json" };
    return new Response$1(body, {
      status: init?.status ?? 200,
      statusText: init?.statusText,
      headers
    });
  },
  writable: true,
  configurable: true
});
async function readWithoutBlocking(readPromise) {
  return Promise.race([readPromise, Promise.resolve().then(() => Promise.resolve(void 0))]);
}
function writeFromReadableStreamDefaultReader(reader, writable, currentReadPromise) {
  const cancel = (error) => {
    reader.cancel(error).catch(() => {
    });
  };
  writable.on("close", cancel);
  writable.on("error", cancel);
  (currentReadPromise ?? reader.read()).then(flow, handleStreamError);
  return reader.closed.finally(() => {
    writable.off("close", cancel);
    writable.off("error", cancel);
  });
  function handleStreamError(error) {
    if (error) writable.destroy(error);
  }
  function onDrain() {
    reader.read().then(flow, handleStreamError);
  }
  function flow({ done, value }) {
    try {
      if (done) writable.end();
      else if (!writable.write(value)) writable.once("drain", onDrain);
      else return reader.read().then(flow, handleStreamError);
    } catch (e) {
      handleStreamError(e);
    }
  }
}
function writeFromReadableStream(stream, writable) {
  if (stream.locked) throw new TypeError("ReadableStream is locked.");
  else if (writable.destroyed) return;
  return writeFromReadableStreamDefaultReader(stream.getReader(), writable);
}
var buildOutgoingHttpHeaders = (headers, defaultContentType2) => {
  const res = {};
  if (!(headers instanceof Headers)) headers = new Headers(headers ?? void 0);
  if (headers.has("set-cookie")) {
    const cookies = [];
    for (const [k, v] of headers) if (k === "set-cookie") cookies.push(v);
    else res[k] = v;
    if (cookies.length > 0) res["set-cookie"] = cookies;
  } else for (const [k, v] of headers) res[k] = v;
  if (defaultContentType2) res["content-type"] ??= defaultContentType2;
  return res;
};
var outgoingEnded = /* @__PURE__ */ Symbol("outgoingEnded");
var incomingDraining = /* @__PURE__ */ Symbol("incomingDraining");
var DRAIN_TIMEOUT_MS = 500;
var MAX_DRAIN_BYTES = 64 * 1024 * 1024;
var drainIncoming = (incoming) => {
  const incomingWithDrainState = incoming;
  if (incoming.destroyed || incomingWithDrainState[incomingDraining]) return;
  incomingWithDrainState[incomingDraining] = true;
  if (incoming instanceof import_node_http2.Http2ServerRequest) {
    try {
      incoming.stream?.close?.(import_node_http2.constants.NGHTTP2_NO_ERROR);
    } catch {
    }
    return;
  }
  let bytesRead = 0;
  const cleanup = () => {
    clearTimeout(timer);
    incoming.off("data", onData);
    incoming.off("end", cleanup);
    incoming.off("error", cleanup);
  };
  const forceClose = () => {
    cleanup();
    const socket = incoming.socket;
    if (socket && !socket.destroyed) {
      if (typeof socket.destroySoon === "function") socket.destroySoon();
      else if (typeof socket.destroy === "function") socket.destroy();
    }
  };
  const timer = setTimeout(forceClose, DRAIN_TIMEOUT_MS);
  timer.unref?.();
  const onData = (chunk) => {
    bytesRead += chunk.length;
    if (bytesRead > MAX_DRAIN_BYTES) forceClose();
  };
  incoming.on("data", onData);
  incoming.on("end", cleanup);
  incoming.on("error", cleanup);
  incoming.resume();
};
var makeCloseHandler = (req, incoming, outgoing, needsBodyCleanup) => () => {
  if (incoming.errored) {
    recordBodyBufferedBeforeDisconnect(incoming);
    req[abortRequest](incoming.errored.toString());
  } else if (!outgoing.writableFinished) {
    recordBodyBufferedBeforeDisconnect(incoming);
    req[abortRequest]("Client connection prematurely closed.");
  }
  if (needsBodyCleanup && !incoming.readableEnded) setTimeout(() => {
    if (!incoming.readableEnded) setTimeout(() => {
      drainIncoming(incoming);
    });
  });
};
var isImmediateCacheableResponse = (res) => {
  if (!(cacheKey in res)) return false;
  const body = res[cacheKey][1];
  return body === null || typeof body === "string" || body instanceof Uint8Array;
};
var handleRequestError = () => new Response(null, { status: 400 });
var handleFetchError = (e) => new Response(null, { status: e instanceof Error && (e.name === "TimeoutError" || e.constructor.name === "TimeoutError") ? 504 : 500 });
var handleResponseError = (e, outgoing) => {
  const err = e instanceof Error ? e : new Error("unknown error", { cause: e });
  if (err.code === "ERR_STREAM_PREMATURE_CLOSE") console.info("The user aborted a request.");
  else {
    console.error(e);
    if (!outgoing.headersSent) outgoing.writeHead(500, { "Content-Type": "text/plain" });
    outgoing.end(`Error: ${err.message}`);
    outgoing.destroy(err);
  }
};
var flushHeaders = (outgoing) => {
  if ("flushHeaders" in outgoing && outgoing.writable) outgoing.flushHeaders();
};
var responseViaCache = async (res, outgoing) => {
  let [status, body, header] = res[cacheKey];
  if (!header) {
    if (body === null) {
      outgoing.writeHead(status);
      outgoing.end();
    } else if (typeof body === "string") {
      outgoing.writeHead(status, {
        "Content-Type": defaultContentType,
        "Content-Length": Buffer.byteLength(body)
      });
      outgoing.end(body);
    } else if (body instanceof Uint8Array) {
      outgoing.writeHead(status, {
        "Content-Type": defaultContentType,
        "Content-Length": body.byteLength
      });
      outgoing.end(body);
    } else if (body instanceof Blob) {
      outgoing.writeHead(status, {
        "Content-Type": defaultContentType,
        "Content-Length": body.size
      });
      outgoing.end(new Uint8Array(await body.arrayBuffer()));
    } else {
      outgoing.writeHead(status, { "Content-Type": defaultContentType });
      flushHeaders(outgoing);
      await writeFromReadableStream(body, outgoing)?.catch((e) => handleResponseError(e, outgoing));
    }
    outgoing[outgoingEnded]?.();
    return;
  }
  let hasContentLength = false;
  if (header instanceof Headers) {
    hasContentLength = header.has("content-length");
    header = buildOutgoingHttpHeaders(header, body === null ? void 0 : defaultContentType);
  } else if (Array.isArray(header)) {
    const headerObj = new Headers(header);
    hasContentLength = headerObj.has("content-length");
    header = buildOutgoingHttpHeaders(headerObj, body === null ? void 0 : defaultContentType);
  } else for (const key in header) if (key.length === 14 && key.toLowerCase() === "content-length") {
    hasContentLength = true;
    break;
  }
  if (!hasContentLength) {
    if (typeof body === "string") header["Content-Length"] = Buffer.byteLength(body);
    else if (body instanceof Uint8Array) header["Content-Length"] = body.byteLength;
    else if (body instanceof Blob) header["Content-Length"] = body.size;
  }
  outgoing.writeHead(status, header);
  if (body == null) outgoing.end();
  else if (typeof body === "string" || body instanceof Uint8Array) outgoing.end(body);
  else if (body instanceof Blob) outgoing.end(new Uint8Array(await body.arrayBuffer()));
  else {
    flushHeaders(outgoing);
    await writeFromReadableStream(body, outgoing)?.catch((e) => handleResponseError(e, outgoing));
  }
  outgoing[outgoingEnded]?.();
};
var isPromise = (res) => typeof res.then === "function";
var responseViaResponseObject = async (res, outgoing, options = {}) => {
  if (isPromise(res)) if (options.errorHandler) try {
    res = await res;
  } catch (err) {
    const errRes = await options.errorHandler(err);
    if (!errRes) return;
    res = errRes;
  }
  else res = await res.catch(handleFetchError);
  if (cacheKey in res) return responseViaCache(res, outgoing);
  const resHeaderRecord = buildOutgoingHttpHeaders(res.headers, res.body === null ? void 0 : defaultContentType);
  if (res.body) {
    const reader = res.body.getReader();
    const values = [];
    let done = false;
    let currentReadPromise = void 0;
    if (resHeaderRecord["transfer-encoding"] !== "chunked") {
      let maxReadCount = 2;
      for (let i = 0; i < maxReadCount; i++) {
        currentReadPromise ||= reader.read();
        const chunk = await readWithoutBlocking(currentReadPromise).catch((e) => {
          console.error(e);
          done = true;
        });
        if (!chunk) {
          if (i === 1) {
            await new Promise((resolve) => setTimeout(resolve));
            maxReadCount = 3;
            continue;
          }
          break;
        }
        currentReadPromise = void 0;
        if (chunk.value) values.push(chunk.value);
        if (chunk.done) {
          done = true;
          break;
        }
      }
      if (done && !("content-length" in resHeaderRecord)) resHeaderRecord["content-length"] = values.reduce((acc, value) => acc + value.length, 0);
    }
    outgoing.writeHead(res.status, resHeaderRecord);
    values.forEach((value) => {
      outgoing.write(value);
    });
    if (done) outgoing.end();
    else {
      if (values.length === 0) flushHeaders(outgoing);
      await writeFromReadableStreamDefaultReader(reader, outgoing, currentReadPromise);
    }
  } else if (resHeaderRecord[X_ALREADY_SENT]) {
  } else {
    outgoing.writeHead(res.status, resHeaderRecord);
    outgoing.end();
  }
  outgoing[outgoingEnded]?.();
};
var getRequestListener = (fetchCallback, options = {}) => {
  const autoCleanupIncoming = options.autoCleanupIncoming ?? true;
  if (options.overrideGlobalObjects !== false && global.Request !== Request$1) {
    Object.defineProperty(global, "Request", { value: Request$1 });
    Object.defineProperty(global, "Response", { value: Response$1 });
  }
  return async (incoming, outgoing) => {
    let res, req;
    let needsBodyCleanup = false;
    let closeHandlerAttached = false;
    const ensureCloseHandler = () => {
      if (!req || closeHandlerAttached) return;
      closeHandlerAttached = true;
      outgoing.on("close", makeCloseHandler(req, incoming, outgoing, needsBodyCleanup));
    };
    try {
      req = newRequest(incoming, options.hostname);
      needsBodyCleanup = autoCleanupIncoming && !(incoming.method === "GET" || incoming.method === "HEAD");
      if (needsBodyCleanup) {
        incoming[wrapBodyStream] = true;
        if (incoming instanceof import_node_http2.Http2ServerRequest) outgoing[outgoingEnded] = () => {
          if (!incoming.readableEnded) setTimeout(() => {
            if (!incoming.readableEnded) setTimeout(() => {
              incoming.destroy();
              outgoing.destroy();
            });
          });
        };
      }
      res = fetchCallback(req, {
        incoming,
        outgoing
      });
      if (!isPromise(res) && isImmediateCacheableResponse(res)) {
        if (needsBodyCleanup && !incoming.readableEnded) outgoing.once("finish", () => {
          if (!incoming.readableEnded) drainIncoming(incoming);
        });
        return responseViaCache(res, outgoing);
      }
      ensureCloseHandler();
    } catch (e) {
      if (!res) if (options.errorHandler) {
        ensureCloseHandler();
        res = await options.errorHandler(req ? e : toRequestError(e));
        if (!res) return;
      } else if (!req) res = handleRequestError();
      else res = handleFetchError(e);
      else return handleResponseError(e, outgoing);
    }
    try {
      return await responseViaResponseObject(res, outgoing, options);
    } catch (e) {
      return handleResponseError(e, outgoing);
    }
  };
};
var CloseEvent = globalThis.CloseEvent ?? class extends Event {
  #eventInitDict;
  constructor(type, eventInitDict = {}) {
    super(type, eventInitDict);
    this.#eventInitDict = eventInitDict;
  }
  get wasClean() {
    return this.#eventInitDict.wasClean ?? false;
  }
  get code() {
    return this.#eventInitDict.code ?? 0;
  }
  get reason() {
    return this.#eventInitDict.reason ?? "";
  }
};
var ErrorEvent = globalThis.ErrorEvent ?? class extends Event {
  #eventInitDict;
  constructor(type, eventInitDict = {}) {
    super(type, eventInitDict);
    this.#eventInitDict = eventInitDict;
  }
  get message() {
    return this.#eventInitDict.message ?? "";
  }
  get filename() {
    return this.#eventInitDict.filename ?? "";
  }
  get lineno() {
    return this.#eventInitDict.lineno ?? 0;
  }
  get colno() {
    return this.#eventInitDict.colno ?? 0;
  }
  get error() {
    return this.#eventInitDict.error ?? null;
  }
};
var generateConnectionSymbol = () => /* @__PURE__ */ Symbol("connection");
var CONNECTION_SYMBOL_KEY = /* @__PURE__ */ Symbol("CONNECTION_SYMBOL_KEY");
var WAIT_FOR_WEBSOCKET_SYMBOL = /* @__PURE__ */ Symbol("WAIT_FOR_WEBSOCKET_SYMBOL");
var responseHeadersToSkip = /* @__PURE__ */ new Set([
  "connection",
  "content-length",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "sec-websocket-accept",
  "sec-websocket-extensions",
  "sec-websocket-protocol"
]);
var appendResponseHeaders = (headers, responseHeaders) => {
  if (!responseHeaders) return;
  responseHeaders.forEach((value, key) => {
    if (responseHeadersToSkip.has(key.toLowerCase())) return;
    headers.push(`${key}: ${value}`);
  });
};
var rejectUpgradeRequest = (socket, status, responseHeaders) => {
  const responseLines = ["Connection: close", "Content-Length: 0"];
  appendResponseHeaders(responseLines, responseHeaders);
  socket.end(`HTTP/1.1 ${status.toString()} ${import_node_http.STATUS_CODES[status] ?? ""}\r
${responseLines.join("\r\n")}\r
\r
`);
};
var createUpgradeRequest = (request) => {
  const protocol = request.socket.encrypted ? "https" : "http";
  const url = new URL(request.url ?? "/", `${protocol}://${request.headers.host ?? "localhost"}`);
  const headers = new Headers();
  for (const key in request.headers) {
    const value = request.headers[key];
    if (!value) continue;
    headers.append(key, Array.isArray(value) ? value[0] : value);
  }
  return new Request(url, { headers });
};
var setupWebSocket = (options) => {
  const { server, fetchCallback, wss } = options;
  const waiterMap = /* @__PURE__ */ new Map();
  wss.on("connection", (ws, request) => {
    const waiter = waiterMap.get(request);
    if (waiter) {
      waiter.resolve(ws);
      waiterMap.delete(request);
    }
  });
  const rejectWaiter = (request) => {
    const waiter = waiterMap.get(request);
    if (waiter) {
      waiterMap.delete(request);
      waiter.reject(/* @__PURE__ */ new Error("WebSocket handshake aborted"));
    }
  };
  const waitForWebSocket = (request, connectionSymbol) => {
    return new Promise((resolve, reject) => {
      waiterMap.set(request, {
        resolve,
        reject,
        connectionSymbol
      });
    });
  };
  server.on("upgrade", async (request, socket, head) => {
    if (request.headers.upgrade?.toLowerCase() !== "websocket") return;
    const env = {
      incoming: request,
      outgoing: void 0,
      wss,
      [WAIT_FOR_WEBSOCKET_SYMBOL]: waitForWebSocket
    };
    let status = 400;
    let responseHeaders;
    try {
      const response = await fetchCallback(createUpgradeRequest(request), env);
      if (response instanceof Response) {
        status = response.status;
        responseHeaders = response.headers;
      }
    } catch {
      if (server.listenerCount("upgrade") === 1) rejectUpgradeRequest(socket, 500);
      return;
    }
    const waiter = waiterMap.get(request);
    if (!waiter || waiter.connectionSymbol !== env[CONNECTION_SYMBOL_KEY]) {
      rejectWaiter(request);
      if (server.listenerCount("upgrade") === 1) rejectUpgradeRequest(socket, status, responseHeaders);
      return;
    }
    const addResponseHeaders = (headers) => {
      appendResponseHeaders(headers, responseHeaders);
    };
    const reclaimWaiterOnClose = () => rejectWaiter(request);
    socket.once("close", reclaimWaiterOnClose);
    wss.on("headers", addResponseHeaders);
    try {
      wss.handleUpgrade(request, socket, head, (ws) => {
        socket.off("close", reclaimWaiterOnClose);
        wss.emit("connection", ws, request);
      });
    } finally {
      wss.off("headers", addResponseHeaders);
    }
  });
  server.on("close", () => {
    wss.close();
  });
};
var upgradeWebSocket = defineWebSocketHelper(async (c, events, options) => {
  if (c.req.header("upgrade")?.toLowerCase() !== "websocket") return;
  const env = c.env;
  const waitForWebSocket = env[WAIT_FOR_WEBSOCKET_SYMBOL];
  if (!waitForWebSocket || !env.incoming) return new Response(null, { status: 500 });
  const connectionSymbol = generateConnectionSymbol();
  env[CONNECTION_SYMBOL_KEY] = connectionSymbol;
  (async () => {
    let ws;
    try {
      ws = await waitForWebSocket(env.incoming, connectionSymbol);
    } catch {
      return;
    }
    const messagesReceivedInStarting = [];
    const bufferMessage = (data, isBinary) => {
      messagesReceivedInStarting.push([data, isBinary]);
    };
    ws.on("message", bufferMessage);
    const ctx = {
      binaryType: "arraybuffer",
      close(code, reason) {
        ws.close(code, reason);
      },
      protocol: ws.protocol,
      raw: ws,
      get readyState() {
        return ws.readyState;
      },
      send(source, opts) {
        ws.send(source, { compress: opts?.compress });
      },
      url: new URL(c.req.url)
    };
    try {
      events?.onOpen?.(new Event("open"), ctx);
    } catch (e) {
      (options?.onError ?? console.error)(e);
    }
    const handleMessage = (data, isBinary) => {
      const datas = Array.isArray(data) ? data : [data];
      for (const data2 of datas) try {
        events?.onMessage?.(new MessageEvent("message", { data: isBinary ? data2 instanceof ArrayBuffer ? data2 : data2.buffer.slice(data2.byteOffset, data2.byteOffset + data2.byteLength) : typeof data2 === "string" ? data2 : Buffer.from(data2).toString("utf-8") }), ctx);
      } catch (e) {
        (options?.onError ?? console.error)(e);
      }
    };
    ws.off("message", bufferMessage);
    for (const message of messagesReceivedInStarting) handleMessage(...message);
    ws.on("message", (data, isBinary) => {
      handleMessage(data, isBinary);
    });
    ws.on("close", (code, reason) => {
      try {
        events?.onClose?.(new CloseEvent("close", {
          code,
          reason: reason.toString()
        }), ctx);
      } catch (e) {
        (options?.onError ?? console.error)(e);
      }
    });
    ws.on("error", (error) => {
      try {
        events?.onError?.(new ErrorEvent("error", { error }), ctx);
      } catch (e) {
        (options?.onError ?? console.error)(e);
      }
    });
  })();
  return new Response();
});
var createAdaptorServer = (options) => {
  const fetchCallback = options.fetch;
  const requestListener = getRequestListener(fetchCallback, {
    hostname: options.hostname,
    overrideGlobalObjects: options.overrideGlobalObjects,
    autoCleanupIncoming: options.autoCleanupIncoming
  });
  const server = (options.createServer || import_node_http.createServer)(options.serverOptions || {}, requestListener);
  if (options.websocket && options.websocket.server) {
    if (options.websocket.server.options.noServer !== true) throw new Error("WebSocket server must be created with { noServer: true } option");
    setupWebSocket({
      server,
      fetchCallback,
      wss: options.websocket.server
    });
  }
  return server;
};

// node_modules/hono/dist/compose.js
var compose = (middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context.error = err;
            res = await onError(err, context);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
  };
};

// node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();

// node_modules/hono/dist/utils/buffer.js
var bufferToFormData = (arrayBuffer, contentType2) => {
  const response = new Response(arrayBuffer, {
    headers: {
      // Normalize the media type (case-insensitive) while keeping parameters like the boundary
      "Content-Type": contentType2.replace(/^[^;]+/, (mediaType) => mediaType.toLowerCase())
    }
  });
  return response.formData();
};

// node_modules/hono/dist/utils/body.js
var MAX_NESTING_DEPTH = 32;
var MAX_NESTED_OBJECTS = 1e4;
var isRawRequest = (request) => "headers" in request;
var parseBody = async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = isRawRequest(request) ? request.headers : request.raw.headers;
  const contentType2 = headers.get("Content-Type");
  const mediaType = contentType2?.split(";")[0].trim().toLowerCase();
  if (mediaType === "multipart/form-data" || mediaType === "application/x-www-form-urlencoded") {
    return parseFormData(request, { all, dot });
  }
  return {};
};
async function parseFormData(request, options) {
  if (!isRawRequest(request) && request.bodyCache.formData) {
    return convertFormDataToBodyData(
      await request.bodyCache.formData,
      options
    );
  }
  const headers = isRawRequest(request) ? request.headers : request.raw.headers;
  const arrayBuffer = await request.arrayBuffer();
  const formDataPromise = bufferToFormData(arrayBuffer, headers.get("Content-Type") || "");
  if (!isRawRequest(request)) {
    request.bodyCache.formData = formDataPromise;
  }
  const formData = await formDataPromise;
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  const nestingState = { count: 0 };
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value, nestingState);
        delete form[key];
      }
    });
  }
  return form;
}
var handleParsingAllValues = (form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      ;
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
};
var handleParsingNestedValues = (form, key, value, state) => {
  if (/(?:^|\.)__proto__\./.test(key)) {
    return;
  }
  let nestedForm = form;
  const keys = key.split(".", MAX_NESTING_DEPTH + 2);
  if (keys.length > MAX_NESTING_DEPTH + 1) {
    throwNestingLimitExceeded();
  }
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        if (state.count++ >= MAX_NESTED_OBJECTS) {
          throwNestingLimitExceeded();
        }
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
};
var throwNestingLimitExceeded = () => {
  throw new Error("Nesting limit exceeded");
};

// node_modules/hono/dist/utils/url.js
var splitPath = (path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
};
var splitRoutingPath = (routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
};
var extractGroupsFromPath = (path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return { groups, path };
};
var replaceGroupMarks = (paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
};
var patternCache = {};
var getPattern = (label, next) => {
  if (label === "*") {
    return "*";
  }
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey2 = `${label}#${next}`;
    if (!patternCache[cacheKey2]) {
      if (match2[2]) {
        patternCache[cacheKey2] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey2, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)] : [label, match2[1], new RegExp(`^${match2[2]}$`)];
      } else {
        patternCache[cacheKey2] = [label, match2[1], true];
      }
    }
    return patternCache[cacheKey2];
  }
  return null;
};
var tryDecode = (str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
};
var tryDecodeURI = (str) => tryDecode(str, decodeURI);
var getPath = (request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const hashIndex = url.indexOf("#", i);
      const end = queryIndex === -1 ? hashIndex === -1 ? void 0 : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
      const path = url.slice(start, end);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63 || charCode === 35) {
      break;
    }
  }
  return url.slice(start, i);
};
var getPathNoStrict = (request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
};
var mergePath = (base, sub, ...rest2) => {
  if (rest2.length) {
    sub = mergePath(sub, ...rest2);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
};
var checkOptionalParameter = (path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (segment.charCodeAt(segment.length - 1) === 63) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.slice(0, -1);
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
};
var tryDecodeURIComponent = (str) => str.indexOf("%") !== -1 ? tryDecode(str, decodeURIComponent_) : str;
var _decodeURI = (value) => {
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return tryDecodeURIComponent(value);
};
var _getQueryParam = (url, key, multiple) => {
  const hashIndex = url.indexOf("#", 8);
  if (hashIndex !== -1) {
    url = url.slice(0, hashIndex);
  }
  let encoded;
  if (!multiple && key && key.indexOf("%") === -1 && key.indexOf("+") === -1) {
    let keyIndex2 = url.indexOf("?", 8);
    if (keyIndex2 === -1) {
      return void 0;
    }
    if (!url.startsWith(key, keyIndex2 + 1)) {
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = /* @__PURE__ */ Object.create(null);
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
};
var getQueryParam = _getQueryParam;
var getQueryParams = (url, key) => {
  return _getQueryParam(url, key, true);
};
var decodeURIComponent_ = decodeURIComponent;

// node_modules/hono/dist/request.js
var HonoRequest = class {
  /**
   * `.raw` can get the raw Request object.
   *
   * @see {@link https://hono.dev/docs/api/request#raw}
   *
   * @example
   * ```ts
   * // For Cloudflare Workers
   * app.post('/', async (c) => {
   *   const metadata = c.req.raw.cf?.hostMetadata?
   *   ...
   * })
   * ```
   */
  raw;
  #validatedData;
  // Short name of validatedData
  #matchResult;
  routeIndex = 0;
  /**
   * `.path` can get the pathname of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#path}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const pathname = c.req.path // `/about/me`
   * })
   * ```
   */
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex]?.[1][key];
    const param = this.#getParamValue(paramKey);
    return param && tryDecodeURIComponent(param);
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex]?.[1] ?? {});
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== void 0) {
        decoded[key] = tryDecodeURIComponent(value);
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? void 0;
    }
    const headerData = /* @__PURE__ */ Object.create(null);
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return parseBody(this, options);
  }
  #cachedBody = (key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    for (const anyCachedKey in bodyCache) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw2[key]();
  };
  /**
   * `.json()` can parse Request body of type `application/json`
   *
   * @see {@link https://hono.dev/docs/api/request#json}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.json()
   * })
   * ```
   */
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  /**
   * `.text()` can parse Request body of type `text/plain`
   *
   * @see {@link https://hono.dev/docs/api/request#text}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.text()
   * })
   * ```
   */
  text() {
    return this.#cachedBody("text");
  }
  /**
   * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
   *
   * @see {@link https://hono.dev/docs/api/request#arraybuffer}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.arrayBuffer()
   * })
   * ```
   */
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  /**
   * `.bytes()` parses the request body as a `Uint8Array`.
   *
   * @see {@link https://hono.dev/docs/api/request#bytes}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.bytes()
   * })
   * ```
   */
  bytes() {
    return this.#cachedBody("arrayBuffer").then((buffer) => new Uint8Array(buffer));
  }
  /**
   * Parses the request body as a `Blob`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.blob();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#blob
   */
  blob() {
    return this.#cachedBody("blob");
  }
  /**
   * Parses the request body as `FormData`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.formData();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#formdata
   */
  formData() {
    return this.#cachedBody("formData");
  }
  /**
   * Adds validated data to the request.
   *
   * @param target - The target of the validation.
   * @param data - The validated data to add.
   */
  addValidatedData(target, data) {
    ;
    (this.#validatedData ??= {})[target] = data;
  }
  valid(target) {
    return this.#validatedData?.[target];
  }
  /**
   * `.url()` can get the request url strings.
   *
   * @see {@link https://hono.dev/docs/api/request#url}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const url = c.req.url // `http://localhost:8787/about/me`
   *   ...
   * })
   * ```
   */
  get url() {
    return this.raw.url;
  }
  /**
   * `.method()` can get the method name of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#method}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const method = c.req.method // `GET`
   * })
   * ```
   */
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  /**
   * `.matchedRoutes()` can return a matched route in the handler
   *
   * @deprecated
   *
   * Use matchedRoutes helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#matchedroutes}
   *
   * @example
   * ```ts
   * app.use('*', async function logger(c, next) {
   *   await next()
   *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
   *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
   *     console.log(
   *       method,
   *       ' ',
   *       path,
   *       ' '.repeat(Math.max(10 - path.length, 0)),
   *       name,
   *       i === c.req.routeIndex ? '<- respond from here' : ''
   *     )
   *   })
   * })
   * ```
   */
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  /**
   * `routePath()` can retrieve the path registered within the handler
   *
   * @deprecated
   *
   * Use routePath helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#routepath}
   *
   * @example
   * ```ts
   * app.get('/posts/:id', (c) => {
   *   return c.json({ path: c.req.routePath })
   * })
   * ```
   */
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = (value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
};
var resolveCallback = async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
};

// node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = (contentType2, headers) => {
  return {
    "Content-Type": contentType2,
    ...headers
  };
};
var createResponseInstance = (body, init) => new Response(body, init);
var Context = class {
  #rawRequest;
  #req;
  /**
   * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
   *
   * @see {@link https://hono.dev/docs/api/context#env}
   *
   * @example
   * ```ts
   * // Environment object for Cloudflare Workers
   * app.get('*', async c => {
   *   const counter = c.env.COUNTER
   * })
   * ```
   */
  env = {};
  #var;
  finalized = false;
  /**
   * `.error` can get the error object from the middleware if the Handler throws an error.
   *
   * @see {@link https://hono.dev/docs/api/context#error}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   await next()
   *   if (c.error) {
   *     // do something...
   *   }
   * })
   * ```
   */
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  /**
   * Creates an instance of the Context class.
   *
   * @param req - The Request object.
   * @param options - Optional configuration options for the context.
   */
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  /**
   * `.req` is the instance of {@link HonoRequest}.
   */
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#event}
   * The FetchEvent associated with the current request.
   *
   * @throws Will throw an error if the context does not have a FetchEvent.
   */
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#executionctx}
   * The ExecutionContext associated with the current request.
   *
   * @throws Will throw an error if the context does not have an ExecutionContext.
   */
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#res}
   * The Response object for the current request.
   */
  get res() {
    return this.#res ||= createResponseInstance(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  /**
   * Sets the Response object for the current request.
   *
   * @param _res - The Response object to set.
   */
  set res(_res) {
    if (this.#res && _res) {
      _res = createResponseInstance(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  /**
   * `.render()` can create a response within a layout.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   return c.render('Hello!')
   * })
   * ```
   */
  render = (...args) => {
    this.#renderer ??= (content6) => this.html(content6);
    return this.#renderer(...args);
  };
  /**
   * Sets the layout for the response.
   *
   * @param layout - The layout to set.
   * @returns The layout function.
   */
  setLayout = (layout2) => this.#layout = layout2;
  /**
   * Gets the current layout for the response.
   *
   * @returns The current layout function.
   */
  getLayout = () => this.#layout;
  /**
   * `.setRenderer()` can set the layout in the custom middleware.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```tsx
   * app.use('*', async (c, next) => {
   *   c.setRenderer((content) => {
   *     return c.html(
   *       <html>
   *         <body>
   *           <p>{content}</p>
   *         </body>
   *       </html>
   *     )
   *   })
   *   await next()
   * })
   * ```
   */
  setRenderer = (renderer) => {
    this.#renderer = renderer;
  };
  /**
   * `.header()` can set headers.
   *
   * @see {@link https://hono.dev/docs/api/context#header}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *
   *   // Append multiple headers using the append option (e.g. Vary)
   *   c.header('Vary', 'Accept-Encoding', { append: true })
   *   c.header('Vary', 'User-Agent', { append: true })
   *
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  header = (name, value, options) => {
    if (this.finalized) {
      this.#res = createResponseInstance(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value);
    } else {
      headers.set(name, value);
    }
  };
  status = (status) => {
    this.#status = status;
  };
  /**
   * `.set()` can set the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   c.set('message', 'Hono is hot!!')
   *   await next()
   * })
   * ```
   */
  set = (key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  };
  /**
   * `.get()` can use the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   const message = c.get('message')
   *   return c.text(`The message is "${message}"`)
   * })
   * ```
   */
  get = (key) => {
    return this.#var ? this.#var.get(key) : void 0;
  };
  /**
   * `.var` can access the value of a variable.
   *
   * @see {@link https://hono.dev/docs/api/context#var}
   *
   * @example
   * ```ts
   * const result = c.var.client.oneMethod()
   * ```
   */
  // c.var.propName is a read-only
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    let responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders;
    if (typeof arg === "object" && arg.headers) {
      responseHeaders ??= new Headers();
      for (const [key, value] of new Headers(arg.headers)) {
        if (key === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      if (!responseHeaders) {
        let count = 0;
        for (const k in headers) {
          if (++count > 1 || typeof headers[k] !== "string") {
            responseHeaders = new Headers();
            break;
          }
        }
      }
      if (responseHeaders) {
        for (const k in headers) {
          const v = headers[k];
          if (typeof v === "string") {
            responseHeaders.set(k, v);
          } else {
            responseHeaders.delete(k);
            for (const v2 of v) {
              responseHeaders.append(k, v2);
            }
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return createResponseInstance(data, {
      status,
      headers: responseHeaders ?? headers
    });
  }
  newResponse = (...args) => this.#newResponse(...args);
  /**
   * `.body()` can return the HTTP response.
   * You can set headers with `.header()` and set HTTP status code with `.status`.
   * This can also be set in `.text()`, `.json()` and so on.
   *
   * @see {@link https://hono.dev/docs/api/context#body}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *   // Set HTTP status code
   *   c.status(201)
   *
   *   // Return the response body
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  body = (data, arg, headers) => this.#newResponse(data, arg, headers);
  /**
   * `.text()` can render text as `Content-Type:text/plain`.
   *
   * @see {@link https://hono.dev/docs/api/context#text}
   *
   * @example
   * ```ts
   * app.get('/say', (c) => {
   *   return c.text('Hello!')
   * })
   * ```
   */
  text = (text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
      text,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  };
  /**
   * `.json()` can render JSON as `Content-Type:application/json`.
   *
   * @see {@link https://hono.dev/docs/api/context#json}
   *
   * @example
   * ```ts
   * app.get('/api', (c) => {
   *   return c.json({ message: 'Hello!' })
   * })
   * ```
   */
  json = (object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  };
  html = (html, arg, headers) => {
    const res = (html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers));
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  };
  /**
   * `.redirect()` can Redirect, default status code is 302.
   *
   * @see {@link https://hono.dev/docs/api/context#redirect}
   *
   * @example
   * ```ts
   * app.get('/redirect', (c) => {
   *   return c.redirect('/')
   * })
   * app.get('/redirect-permanently', (c) => {
   *   return c.redirect('/', 301)
   * })
   * ```
   */
  redirect = (location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      // Multibyes should be encoded
      // eslint-disable-next-line no-control-regex
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  };
  /**
   * `.notFound()` can return the Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/context#notfound}
   *
   * @example
   * ```ts
   * app.get('/notfound', (c) => {
   *   return c.notFound()
   * })
   * ```
   */
  notFound = () => {
    this.#notFoundHandler ??= () => createResponseInstance();
    return this.#notFoundHandler(this);
  };
};

// node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch", "query"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
};

// node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// node_modules/hono/dist/hono-base.js
var notFoundHandler = (c) => {
  return c.text("404 Not Found", 404);
};
var errorHandler = (err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
};
var Hono = class _Hono {
  get;
  post;
  put;
  delete;
  options;
  patch;
  query;
  all;
  on;
  use;
  /*
    This class is like an abstract class and does not have a router.
    To use it, inherit the class and implement router in the constructor.
  */
  router;
  getPath;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new _Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  errorHandler = errorHandler;
  /**
   * `.route()` allows grouping other Hono instance in routes.
   *
   * @see {@link https://hono.dev/docs/api/routing#grouping}
   *
   * @param {string} path - base Path
   * @param {Hono} app - other Hono instance
   * @returns {Hono} routed Hono instance
   *
   * @example
   * ```ts
   * const app = new Hono()
   * const app2 = new Hono()
   *
   * app2.get("/user", (c) => c.text("user"))
   * app.route("/api", app2) // GET /api/user
   * ```
   */
  route(path, app2) {
    const subApp = this.basePath(path);
    app2.routes.map((r) => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res;
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler, r.basePath);
    });
    return this;
  }
  /**
   * `.basePath()` allows base paths to be specified.
   *
   * @see {@link https://hono.dev/docs/api/routing#base-path}
   *
   * @param {string} path - base Path
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * const api = new Hono().basePath('/api')
   * ```
   */
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  /**
   * `.onError()` handles an error and returns a customized Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#error-handling}
   *
   * @param {ErrorHandler} handler - request Handler for error
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.onError((err, c) => {
   *   console.error(`${err}`)
   *   return c.text('Custom Error Message', 500)
   * })
   * ```
   */
  onError = (handler) => {
    this.errorHandler = handler;
    return this;
  };
  /**
   * `.notFound()` allows you to customize a Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#not-found}
   *
   * @param {NotFoundHandler} handler - request handler for not-found
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.notFound((c) => {
   *   return c.text('Custom 404 Message', 404)
   * })
   * ```
   */
  notFound = (handler) => {
    this.#notFoundHandler = handler;
    return this;
  };
  /**
   * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
   *
   * @see {@link https://hono.dev/docs/api/hono#mount}
   *
   * @param {string} path - base Path
   * @param {Function} applicationHandler - other Request Handler
   * @param {MountOptions} [options] - options of `.mount()`
   * @returns {Hono} mounted Hono instance
   *
   * @example
   * ```ts
   * import { Router as IttyRouter } from 'itty-router'
   * import { Hono } from 'hono'
   * // Create itty-router application
   * const ittyRouter = IttyRouter()
   * // GET /itty-router/hello
   * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
   *
   * const app = new Hono()
   * app.mount('/itty-router', ittyRouter.handle)
   * ```
   *
   * @example
   * ```ts
   * const app = new Hono()
   * // Send the request to another application without modification.
   * app.mount('/app', anotherApp, {
   *   replaceRequest: (req) => req,
   * })
   * ```
   */
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = (request) => request;
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = this.getPath(request).slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    };
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler, baseRoutePath) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = {
      basePath: baseRoutePath !== void 0 ? mergePath(this._basePath, baseRoutePath) : this._basePath,
      path,
      method,
      handler
    };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
    }
    const path = this.getPath(request, { env });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  /**
   * `.fetch()` will be entry point of your app.
   *
   * @see {@link https://hono.dev/docs/api/hono#fetch}
   *
   * @param {Request} request - request Object of request
   * @param {Env} env - env Object
   * @param {ExecutionContext} executionCtx - context of execution
   * @returns {Response | Promise<Response>} response of request
   *
   */
  fetch = (request, ...rest2) => {
    return this.#dispatch(request, rest2[1], rest2[0], request.method);
  };
  /**
   * `.request()` is a useful method for testing.
   * You can pass a URL or pathname to send a GET request.
   * app will return a Response object.
   * ```ts
   * test('GET /hello is ok', async () => {
   *   const res = await app.request('/hello')
   *   expect(res.status).toBe(200)
   * })
   * ```
   * @see https://hono.dev/docs/api/hono#request
   */
  request = (input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  };
  /**
   * `.fire()` automatically adds a global fetch event listener.
   * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
   * @deprecated
   * Use `fire` from `hono/service-worker` instead.
   * ```ts
   * import { Hono } from 'hono'
   * import { fire } from 'hono/service-worker'
   *
   * const app = new Hono()
   * // ...
   * fire(app)
   * ```
   * @see https://hono.dev/docs/api/hono#fire
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
   * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
   */
  fire = () => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  };
};

// node_modules/hono/dist/router/utils.js
var createNullObject = () => /* @__PURE__ */ Object.create(null);

// node_modules/hono/dist/router/reg-exp-router/matcher.js
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = ((method2, path2) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path2];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path2.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  });
  this.match = match2;
  return match2(method, path);
}

// node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = /* @__PURE__ */ Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return b === TAIL_WILDCARD_REG_EXP_STR ? -1 : 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
var Node = class _Node {
  // handler index of a dynamic path, or -1 for a static path terminal
  #index;
  #varIndex;
  #children = createNullObject();
  insert(tokens, index, paramMap, context, isStatic) {
    let node = this;
    for (let i = 0, len = tokens.length; i < len; i++) {
      const token = tokens[i];
      const pattern = token.length === 1 ? token === "*" ? i === len - 1 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : null : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
      let nextNode;
      if (pattern) {
        const name = pattern[1];
        let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
        if (name && pattern[2]) {
          if (regexpStr === ".*") {
            throw PATH_ERROR;
          }
          regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
          if (/\((?!\?:)/.test(regexpStr)) {
            throw PATH_ERROR;
          }
          if (regexpStr.length === 1 && regExpMetaChars.has(regexpStr)) {
            throw PATH_ERROR;
          }
        }
        nextNode = node.#children[regexpStr];
        if (!nextNode) {
          if (regexpStr !== ONLY_WILDCARD_REG_EXP_STR && regexpStr !== TAIL_WILDCARD_REG_EXP_STR) {
            for (const k in node.#children) {
              if (
                // a single-char pattern coexists with single-char literals as a literal does
                (regexpStr.length > 1 || k.length > 1) && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
              ) {
                throw PATH_ERROR;
              }
            }
          }
          nextNode = node.#children[regexpStr] = new _Node();
        }
        if (name !== "") {
          nextNode.#varIndex ??= context.varIndex++;
          paramMap.push([name, nextNode.#varIndex]);
        }
      } else {
        nextNode = node.#children[token];
        if (!nextNode) {
          for (const k in node.#children) {
            if (k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR) {
              throw PATH_ERROR;
            }
          }
          nextNode = node.#children[token] = new _Node();
        }
      }
      node = nextNode;
    }
    if (node.#index !== void 0) {
      throw PATH_ERROR;
    }
    node.#index = isStatic ? -1 : index;
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      const childStr = c.buildRegExpStr();
      return childStr === "" ? "" : (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + childStr;
    }).filter(Boolean);
    if (typeof this.#index === "number" && this.#index !== -1) {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
  #context = { varIndex: 0 };
  #root = new Node();
  #index = 0;
  // dynamic path -> [handler index, param assoc]; static paths are not registered
  paths = createNullObject();
  insert(path, isStatic) {
    if (isStatic) {
      this.#root.insert(path.split(""), 0, [], this.#context, true);
      return;
    }
    const paramAssoc = [];
    const groups = [];
    let markedPath = path;
    for (let i = 0; ; ) {
      let replaced = false;
      markedPath = markedPath.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = markedPath.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, this.#index, paramAssoc, this.#context, false);
    this.paths[path] = [this.#index++, paramAssoc];
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// node_modules/hono/dist/router/reg-exp-router/router.js
var wildcardRegExpCache = createNullObject();
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    `^${path.replace(
      /\/:[^/{}]+(?:\{\[\^\/]\+})?(?=[/{]|$)|\/?\*$|([.\\+*[^\]$()?{}|])/g,
      (match2, metaChar) => metaChar ? `\\${metaChar}` : match2 === "/*" ? TAIL_WILDCARD_REG_EXP_STR : match2 === "*" ? ONLY_WILDCARD_REG_EXP_STR : `/:${LABEL_REG_EXP_STR}`
    )}$`
  );
}
function findMiddleware(middleware, path) {
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
var RegExpRouter = class {
  name = "RegExpRouter";
  #middleware;
  #routes;
  #tries;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: createNullObject() };
    this.#routes = { [METHOD_NAME_ALL]: createNullObject() };
    this.#tries = { [METHOD_NAME_ALL]: new Trie() };
  }
  #insertPath(method, path) {
    try {
      this.#tries[method].insert(path, !/\*|\/:/.test(path));
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      this.#tries[method] = new Trie();
      for (const handlerMap of [middleware, routes]) {
        handlerMap[method] = createNullObject();
        for (const p in handlerMap[METHOD_NAME_ALL]) {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
          this.#insertPath(method, p);
        }
      }
    }
    if (path === "/*") {
      path = "*";
    }
    const methods = method === METHOD_NAME_ALL ? Object.keys(middleware) : [method];
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      for (const m of methods) {
        if (!middleware[m][path]) {
          this.#insertPath(m, path);
          middleware[m][path] = findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        }
      }
      for (const handlerMap of [middleware, routes]) {
        for (const m of methods) {
          for (const p in handlerMap[m]) {
            re.test(p) && handlerMap[m][p].push([handler, path]);
          }
        }
      }
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (const path2 of paths) {
      for (const m of methods) {
        if (!routes[m][path2]) {
          this.#insertPath(m, path2);
          routes[m][path2] = findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || [];
        }
        routes[m][path2].push([handler, path2]);
      }
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = createNullObject();
    for (const method of Object.keys(this.#routes)) {
      matchers[method] = this.#buildMatcher(method);
    }
    this.#middleware = this.#routes = this.#tries = void 0;
    wildcardRegExpCache = createNullObject();
    return matchers;
  }
  #buildMatcher(method) {
    const middleware = this.#middleware[method];
    const routes = this.#routes[method];
    const trie = this.#tries[method];
    const staticMap = createNullObject();
    const handlerData = [];
    const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
    for (const r of [middleware, routes]) {
      for (const path in r) {
        const handlers = r[path];
        const pathData = trie.paths[path];
        if (!pathData) {
          staticMap[path] = [handlers.map(([h]) => [h, createNullObject()]), emptyParam];
          continue;
        }
        handlerData[pathData[0]] = handlers.map(([h, handlerPath]) => [
          h,
          trie.paths[handlerPath][1].reduceRight((map, [key], i) => {
            map[key] = paramReplacementMap[pathData[1][i][1]];
            return map;
          }, createNullObject())
        ]);
      }
    }
    return [regexp, indexReplacementMap.map((i) => handlerData[i]), staticMap];
  }
};

// node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};

// node_modules/hono/dist/router/trie-router/node.js
var emptyParams = createNullObject();
var order = 0;
var Node2 = class _Node2 {
  #methods = [];
  #children = createNullObject();
  #patterns = [];
  #pattern;
  #params = emptyParams;
  insert(method, path, handler) {
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = /* @__PURE__ */ new Set();
    let i = 0;
    for (const p of parts) {
      const nextP = parts[++i];
      const pattern = getPattern(p, nextP) || (nextP === void 0 && p && p.indexOf("*") === p.length - 1 ? p : null);
      const isParam = Array.isArray(pattern);
      const key = isParam ? pattern[0] : pattern || p;
      const child = curNode.#children[key] ||= new _Node2();
      if (pattern && !child.#pattern) {
        child.#pattern = pattern;
        curNode.#patterns.push(child);
      }
      curNode = child;
      if (isParam) {
        possibleKeys.add(pattern[1]);
      }
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: [...possibleKeys],
        score: ++order
      }
    });
  }
  #pushHandlerSets(handlerSets, node, method, nodeParams, params) {
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      if (handlerSet) {
        handlerSet.params = createNullObject();
        handlerSets.push(handlerSet);
        for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
          const key = handlerSet.possibleKeys[i2];
          handlerSet.params[key] = params?.[key] && !i2 ? params[key] : nodeParams[key] ?? params?.[key];
        }
      }
    }
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    const len = parts.length;
    let partOffsets = null;
    for (let i = 0; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              this.#pushHandlerSets(handlerSets, nextNode.#children["*"], method, node.#params);
            }
            this.#pushHandlerSets(handlerSets, nextNode, method, node.#params);
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (const child of node.#patterns) {
          const pattern = child.#pattern;
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (typeof pattern === "string") {
            if (pattern === "*" || part.startsWith(pattern.slice(0, -1))) {
              this.#pushHandlerSets(handlerSets, child, method, node.#params);
              if (pattern === "*") {
                child.#params = params;
                tempNodes.push(child);
              }
            }
            continue;
          }
          const [, name, matcher] = pattern;
          if (!part && matcher === true) {
            continue;
          }
          if (matcher !== true) {
            if (!partOffsets) {
              partOffsets = [];
              let offset = path[0] === "/" ? 1 : 0;
              for (let p = 0; p < len; p++) {
                partOffsets[p] = offset;
                offset += parts[p].length + 1;
              }
            }
            const restPathString = path.slice(partOffsets[i]);
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              this.#pushHandlerSets(handlerSets, child, method, node.#params, params);
              if (m[0].length === restPathString.length && child.#children["*"]) {
                this.#pushHandlerSets(
                  handlerSets,
                  child.#children["*"],
                  method,
                  node.#params,
                  params
                );
              }
              for (const _ in child.#children) {
                child.#params = params;
                const componentCount = m[0].match(/\//g)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
                break;
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              this.#pushHandlerSets(handlerSets, child, method, params, node.#params);
              if (child.#children["*"]) {
                this.#pushHandlerSets(
                  handlerSets,
                  child.#children["*"],
                  method,
                  params,
                  node.#params
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      const shifted = curNodesQueue.shift();
      curNodes = shifted ? tempNodes.concat(shifted) : tempNodes;
    }
    if (handlerSets[1]) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};

// node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  name = "TrieRouter";
  #node = new Node2();
  add(method, path, handler) {
    for (const result of checkOptionalParameter(path) || [path]) {
      this.#node.insert(method, result, handler);
    }
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  /**
   * Creates an instance of the Hono class.
   *
   * @param options - Optional configuration options for the Hono instance.
   */
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// src/templates/layout.ts
var layout = (title, content6, activePage = "home") => `
<!DOCTYPE html>
<html lang="id" class="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} \u2014 NusaTech</title>
  <meta name="description" content="NusaTech \u2014 tim teknologi Jakarta yang obsesif soal kualitas. Web, mobile, cloud, AI. 9 tahun, 500+ proyek." />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <style>
    /* \u2500\u2500 Reset & Base \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: 'Geist', ui-sans-serif, system-ui, sans-serif;
      background: #fafafa;
      color: #111;
      -webkit-font-smoothing: antialiased;
    }
    code, .mono { font-family: 'Geist Mono', ui-monospace, monospace; }

    /* \u2500\u2500 Design tokens \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
    :root {
      --ink:       #0f0f0f;
      --ink-2:     #3a3a3a;
      --ink-3:     #717171;
      --surface:   #fafafa;
      --surface-2: #f3f3f0;
      --surface-3: #e8e8e4;
      --accent:    #16a34a;        /* single accent: forest green */
      --accent-dk: #15803d;
      --accent-bg: #f0fdf4;
      --radius:    6px;            /* one radius system */
      --radius-lg: 12px;
      --nav-h:     64px;
    }

    /* \u2500\u2500 Typography \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
    h1, h2, h3, h4 { color: var(--ink); letter-spacing: -0.025em; line-height: 1.1; font-weight: 800; }
    p { color: var(--ink-2); line-height: 1.65; }

    /* \u2500\u2500 Utility classes \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
    .container { max-width: 1280px; margin: 0 auto; padding: 0 2rem; }
    .container-sm { max-width: 860px; margin: 0 auto; padding: 0 2rem; }

    .accent-text { color: var(--accent); }

    /* single inline label \u2014 small mono caps, rationed: max 1 per 3 sections */
    .label {
      font-family: 'Geist Mono', monospace;
      font-size: 10.5px;
      font-weight: 500;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--ink-3);
    }

    /* \u2500\u2500 Navbar \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
    #nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      height: var(--nav-h);
      display: flex; align-items: center;
      transition: background 0.25s, border-color 0.25s, box-shadow 0.2s;
      border-bottom: 1px solid transparent;
    }
    #nav.scrolled {
      background: rgba(250,250,250,0.92);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom-color: var(--surface-3);
      box-shadow: 0 1px 0 rgba(0,0,0,0.04);
    }
    #nav .inner {
      max-width: 1280px; margin: 0 auto; padding: 0 2rem;
      width: 100%;
      display: flex; align-items: center; justify-content: space-between; gap: 2rem;
    }
    .nav-logo {
      display: flex; align-items: center; gap: 0.5rem;
      font-weight: 800; font-size: 17px; letter-spacing: -0.03em;
      color: var(--ink); text-decoration: none;
    }
    .nav-logo-mark {
      width: 28px; height: 28px; border-radius: var(--radius);
      background: var(--ink); display: flex; align-items: center; justify-content: center;
      color: #fafafa; font-size: 13px; font-weight: 900; font-family: 'Geist Mono', monospace;
      flex-shrink: 0;
    }
    .nav-links {
      display: flex; align-items: center; gap: 0.25rem; list-style: none;
    }
    .nav-links a {
      font-size: 13.5px; font-weight: 500; color: var(--ink-3);
      text-decoration: none; padding: 0.4rem 0.75rem; border-radius: var(--radius);
      transition: color 0.15s, background 0.15s;
    }
    .nav-links a:hover, .nav-links a.active {
      color: var(--ink); background: var(--surface-2);
    }
    .nav-cta {
      font-size: 13px; font-weight: 600;
      background: var(--ink); color: #fafafa;
      padding: 0.5rem 1.1rem; border-radius: var(--radius);
      text-decoration: none;
      transition: opacity 0.15s, transform 0.15s;
      white-space: nowrap;
    }
    .nav-cta:hover { opacity: 0.85; transform: translateY(-1px); }
    .nav-mobile-btn {
      display: none; background: none; border: none; cursor: pointer;
      width: 36px; height: 36px; align-items: center; justify-content: center;
      border-radius: var(--radius); transition: background 0.15s; color: var(--ink);
    }
    .nav-mobile-btn:hover { background: var(--surface-2); }
    #mobile-menu {
      display: none; position: fixed; top: var(--nav-h); left: 0; right: 0;
      background: rgba(250,250,250,0.98); backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--surface-3);
      padding: 1rem 2rem 1.5rem; z-index: 99;
      flex-direction: column; gap: 0.25rem;
    }
    #mobile-menu.open { display: flex; }
    #mobile-menu a {
      font-size: 14px; font-weight: 500; color: var(--ink-2);
      text-decoration: none; padding: 0.6rem 0; border-bottom: 1px solid var(--surface-2);
      transition: color 0.15s;
    }
    #mobile-menu a:last-child { border-bottom: none; margin-top: 0.5rem; }
    #mobile-menu a.cta-mobile {
      background: var(--ink); color: #fafafa; text-align: center;
      padding: 0.7rem; border-radius: var(--radius); border: none; margin-top: 0.5rem;
    }

    /* \u2500\u2500 Buttons \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
    .btn {
      display: inline-flex; align-items: center; gap: 0.4rem;
      font-size: 13.5px; font-weight: 600;
      padding: 0.6rem 1.25rem; border-radius: var(--radius);
      text-decoration: none; transition: opacity 0.15s, transform 0.15s, box-shadow 0.15s;
      white-space: nowrap; cursor: pointer; border: none;
    }
    .btn:active { transform: translateY(1px) scale(0.99); }
    .btn-dark { background: var(--ink); color: #fafafa; }
    .btn-dark:hover { opacity: 0.85; transform: translateY(-1px); }
    .btn-outline {
      background: transparent; color: var(--ink);
      border: 1.5px solid var(--surface-3);
    }
    .btn-outline:hover { border-color: var(--ink-3); background: var(--surface-2); }
    .btn-accent { background: var(--accent); color: #fff; }
    .btn-accent:hover { background: var(--accent-dk); transform: translateY(-1px); }

    /* \u2500\u2500 Cards \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
    .card {
      background: #fff; border: 1px solid var(--surface-3);
      border-radius: var(--radius-lg); overflow: hidden;
      transition: box-shadow 0.22s, transform 0.22s;
    }
    .card:hover {
      box-shadow: 0 8px 24px rgba(0,0,0,0.07);
      transform: translateY(-3px);
    }

    /* \u2500\u2500 Scroll reveal \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
    .reveal {
      opacity: 0; transform: translateY(20px);
      transition: opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1);
    }
    .reveal.visible { opacity: 1; transform: none; }
    .reveal-d1 { transition-delay: 0.08s; }
    .reveal-d2 { transition-delay: 0.16s; }
    .reveal-d3 { transition-delay: 0.24s; }

    /* \u2500\u2500 Marquee \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
    .marquee-outer { overflow: hidden; }
    .marquee-track {
      display: flex; gap: 3.5rem;
      animation: marquee 28s linear infinite;
      width: max-content;
    }
    @keyframes marquee {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }

    /* \u2500\u2500 Divider \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
    .divider { border: none; border-top: 1px solid var(--surface-3); }

    /* \u2500\u2500 Footer \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
    footer {
      background: var(--ink); color: rgba(255,255,255,0.5);
      padding: 4rem 0 2.5rem;
    }
    footer h4 { color: rgba(255,255,255,0.9); font-size: 13px; font-weight: 600; margin-bottom: 1rem; }
    footer a { color: rgba(255,255,255,0.5); text-decoration: none; font-size: 13px; transition: color 0.15s; }
    footer a:hover { color: rgba(255,255,255,0.9); }
    footer ul { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; }

    /* \u2500\u2500 Responsive \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
    @media (max-width: 768px) {
      .nav-links, .nav-cta { display: none; }
      .nav-mobile-btn { display: flex; }
      .container, .container-sm { padding: 0 1.25rem; }
    }

    @media (prefers-reduced-motion: reduce) {
      .reveal { opacity: 1; transform: none; transition: none; }
      .marquee-track { animation: none; }
      .card { transition: none; }
      .btn { transition: none; }
    }
  </style>
</head>
<body>

  <nav id="nav">
    <div class="inner">
      <a href="/" class="nav-logo">
        <div class="nav-logo-mark">N</div>
        NusaTech
      </a>
      <ul class="nav-links">
        <li><a href="/" class="${activePage === "home" ? "active" : ""}">Beranda</a></li>
        <li><a href="/services" class="${activePage === "services" ? "active" : ""}">Layanan</a></li>
        <li><a href="/portfolio" class="${activePage === "portfolio" ? "active" : ""}">Portfolio</a></li>
        <li><a href="/about" class="${activePage === "about" ? "active" : ""}">Tim</a></li>
        <li><a href="/contact" class="${activePage === "contact" ? "active" : ""}">Kontak</a></li>
      </ul>
      <a href="/contact" class="nav-cta">Hubungi kami</a>
      <button class="nav-mobile-btn" id="hamburger" aria-label="Menu">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect id="bar1" y="2" width="18" height="1.8" rx="0.9" fill="currentColor"/>
          <rect id="bar2" y="8.1" width="18" height="1.8" rx="0.9" fill="currentColor"/>
          <rect id="bar3" y="14.2" width="18" height="1.8" rx="0.9" fill="currentColor"/>
        </svg>
      </button>
    </div>
  </nav>

  <div id="mobile-menu">
    <a href="/">Beranda</a>
    <a href="/services">Layanan</a>
    <a href="/portfolio">Portfolio</a>
    <a href="/about">Tim</a>
    <a href="/contact">Kontak</a>
    <a href="/contact" class="cta-mobile">Hubungi kami</a>
  </div>

  <main>
    ${content6}
  </main>

  <footer>
    <div class="container">
      <div style="display:grid; grid-template-columns: 1.8fr 1fr 1fr 1.4fr; gap:3rem; padding-bottom:3rem; border-bottom:1px solid rgba(255,255,255,0.1)">
        <div>
          <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1rem">
            <div style="width:28px;height:28px;border-radius:6px;background:#fafafa;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:13px;font-family:'Geist Mono',monospace;color:#111;flex-shrink:0">N</div>
            <span style="font-weight:800;font-size:16px;color:#fafafa;letter-spacing:-0.02em">NusaTech</span>
          </div>
          <p style="font-size:13px;line-height:1.65;max-width:240px;margin-bottom:1.5rem">Tim teknologi Jakarta. 9 tahun, 500+ proyek, prinsip yang sama sejak hari pertama.</p>
          <div style="display:flex;gap:0.5rem">
            <a href="#" aria-label="LinkedIn" style="width:32px;height:32px;border-radius:6px;background:rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;font-family:'Geist Mono',monospace">in</a>
            <a href="#" aria-label="Twitter/X" style="width:32px;height:32px;border-radius:6px;background:rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;font-family:'Geist Mono',monospace">x</a>
            <a href="#" aria-label="GitHub" style="width:32px;height:32px;border-radius:6px;background:rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;font-family:'Geist Mono',monospace">gh</a>
          </div>
        </div>
        <div>
          <h4>Layanan</h4>
          <ul>
            <li><a href="/services">Web Development</a></li>
            <li><a href="/services">Mobile App</a></li>
            <li><a href="/services">Cloud & DevOps</a></li>
            <li><a href="/services">AI & Otomasi</a></li>
            <li><a href="/services">Security Audit</a></li>
          </ul>
        </div>
        <div>
          <h4>Perusahaan</h4>
          <ul>
            <li><a href="/about">Tim kami</a></li>
            <li><a href="/portfolio">Portfolio</a></li>
            <li><a href="/contact">Karir</a></li>
            <li><a href="/contact">Blog teknis</a></li>
          </ul>
        </div>
        <div>
          <h4>Kantor</h4>
          <ul>
            <li><a href="#">Jl. Wijaya I No. 37, Kebayoran Baru, Jakarta Selatan 12170</a></li>
            <li><a href="tel:+622127884491">+62 21 2788 4491</a></li>
            <li><a href="mailto:halo@nusatech.id">halo@nusatech.id</a></li>
            <li style="color:rgba(255,255,255,0.3);font-size:12px">Sen-Jum, 09.00-18.00 WIB</li>
          </ul>
        </div>
      </div>
      <div style="padding-top:2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem">
        <p style="font-size:12px;color:rgba(255,255,255,0.3)">\xA9 2024 NusaTech Solutions. Dibuat di Jakarta.</p>
        <div style="display:flex;gap:1.5rem">
          <a href="#" style="font-size:12px">Privasi</a>
          <a href="#" style="font-size:12px">Syarat</a>
        </div>
      </div>
    </div>
  </footer>

  <script>
    // Navbar scroll
    const nav = document.getElementById('nav');
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          nav.classList.toggle('scrolled', window.scrollY > 16);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Mobile menu
    const ham = document.getElementById('hamburger');
    const mob = document.getElementById('mobile-menu');
    let open = false;
    ham.addEventListener('click', () => {
      open = !open;
      mob.classList.toggle('open', open);
    });

    // Scroll reveal
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));

    // Counter
    function runCounter(el) {
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const isFloat = el.dataset.float === '1';
      const dur = 1400;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 4);
        const val = target * ease;
        el.textContent = (isFloat ? val.toFixed(1) : Math.floor(val)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-counter]').forEach(el => cio.observe(el));
  </script>
</body>
</html>
`;

// src/data/company.ts
var company = {
  name: "NusaTech Solutions",
  tagline: "Kita bikin digital, beneran.",
  description: "NusaTech bukan agensi biasa. Kita tim kecil yang obsesif soal detail \u2014 dari arsitektur backend sampai warna tombol. Sudah 9 tahun kami bantu bisnis Indonesia tumbuh lewat teknologi yang benar-benar bekerja.",
  founded: "2015",
  employees: "150+",
  projects: "500+",
  clients: "200+",
  email: "halo@nusatech.id",
  phone: "+62 21 2788 4491",
  address: "Jl. Wijaya I No. 37, Kebayoran Baru, Jakarta Selatan 12170",
  social: {
    linkedin: "https://linkedin.com/company/nusatech",
    twitter: "https://twitter.com/nusatech_id",
    instagram: "https://instagram.com/nusatech.id",
    github: "https://github.com/nusatech-id"
  }
};
var services = [
  {
    id: 1,
    icon: "\u{1F4BB}",
    title: "Web Development",
    description: "Bukan sekadar website cantik \u2014 kami bangun yang cepat, aman, dan tahan banting. Stack favorit kami: Bun, React, dan PostgreSQL. Tapi kami fleksibel sesuai kebutuhan Anda.",
    detail: "Mulai dari landing page sampai SaaS kompleks"
  },
  {
    id: 2,
    icon: "\u{1F4F1}",
    title: "Mobile App",
    description: "iOS & Android, native atau cross-platform. Kami tahu perbedaannya dan kapan harus pakai yang mana \u2014 bukan asal pilih yang murah.",
    detail: "React Native \xB7 Flutter \xB7 Swift \xB7 Kotlin"
  },
  {
    id: 3,
    icon: "\u2601\uFE0F",
    title: "Cloud & DevOps",
    description: "Deploy sekali, jalan terus. Kami setup infrastructure yang bisa tidur nyenyak \u2014 monitoring, auto-scaling, backup otomatis. AWS, GCP, atau on-premise.",
    detail: "Uptime rata-rata klien kami: 99.94%"
  },
  {
    id: 4,
    icon: "\u{1F916}",
    title: "AI & Otomasi",
    description: "AI bukan hype buat kami \u2014 kami sudah pakai sejak 2019. Dari chatbot internal sampai sistem rekomendasi produk yang beneran naikkan konversi.",
    detail: "LLM integration \xB7 Computer Vision \xB7 MLOps"
  },
  {
    id: 5,
    icon: "\u{1F512}",
    title: "Security Audit",
    description: "Penetration testing, code review, sampai compliance check. Kami temukan celah sebelum orang lain menemukannya \u2014 tanpa menghakimi kode lama Anda.",
    detail: "OWASP \xB7 ISO 27001 \xB7 PCI-DSS"
  },
  {
    id: 6,
    icon: "\u{1F4CA}",
    title: "Data & Analytics",
    description: "Ribuan baris data Anda tersimpan tapi tidak terpakai? Kami ubah jadi dashboard yang benar-benar dibaca tim Anda setiap pagi.",
    detail: "BI \xB7 Data Pipeline \xB7 Predictive Analytics"
  }
];
var team = [
  {
    id: 1,
    name: "Budi Santoso",
    role: "Co-founder & CEO",
    photo: "BS",
    bio: "Mantan engineer Tokopedia. Pindah ke dunia konsultan karena capek lihat website perusahaan Indonesia yang lambat.",
    color: "from-blue-500 to-indigo-600",
    funFact: "Koleksi mechanical keyboard: 11 buah"
  },
  {
    id: 2,
    name: "Sari Dewi",
    role: "Co-founder & CTO",
    photo: "SD",
    bio: "Lulusan ITS Surabaya, ex-Google Singapore. Balik ke Indonesia karena kangen soto ayam dan ingin bangun sesuatu yang lebih bermakna.",
    color: "from-violet-500 to-purple-600",
    funFact: "Contribute ke open source tiap Sabtu pagi"
  },
  {
    id: 3,
    name: "Ahmad Fauzi",
    role: "Head of Product Design",
    photo: "AF",
    bio: "10 tahun desain digital, 3 tahun di Grab. Percaya bahwa UX yang bagus adalah yang pengguna tidak sadari \u2014 itu berarti sudah benar.",
    color: "from-emerald-500 to-teal-600",
    funFact: "Masih pakai Figma versi desktop, anti web app"
  },
  {
    id: 4,
    name: "Rina Kusuma",
    role: "Head of Client Success",
    photo: "RK",
    bio: "Bergabung tahun 2017 sebagai staf pertama non-teknis. Sekarang pegang 40+ akun klien dan tidak pernah ada yang complain soal komunikasi.",
    color: "from-rose-500 to-pink-600",
    funFact: "Reply email dalam waktu <15 menit, selalu"
  }
];
var testimonials = [
  {
    id: 1,
    name: "Hendra Wijaya",
    company: "PT Maju Bersama Tbk",
    role: "CEO",
    text: "Jujur, awalnya saya skeptis. Sudah dua vendor sebelumnya menjanjikan hal serupa. NusaTech beda \u2014 mereka mau jujur kalau ada masalah, dan itu yang kami butuhkan.",
    rating: 5,
    avatar: "HW",
    color: "from-blue-500 to-cyan-500",
    project: "Sistem ERP & Mobile App"
  },
  {
    id: 2,
    name: "Dewi Rahayu",
    company: "Warung Pintar Digital",
    role: "Founder",
    text: "Kami UMKM, budget terbatas. Mereka tidak meremehkan. Malah kasih rekomendasi yang hemat tapi tetap solid. Platform kami handle 2000 transaksi/hari tanpa masalah.",
    rating: 5,
    avatar: "DR",
    color: "from-emerald-500 to-teal-500",
    project: "Platform E-Commerce B2B"
  },
  {
    id: 3,
    name: "Irfan Mahmud",
    company: "Koin Fintech",
    role: "VP Engineering",
    text: "Yang saya suka: mereka mau bilang 'tidak' kalau request kami tidak masuk akal secara teknis. Vendor yang cuma bilang iya itu bahaya di jangka panjang.",
    rating: 5,
    avatar: "IM",
    color: "from-violet-500 to-purple-500",
    project: "Core Banking System"
  }
];
var portfolios = [
  {
    id: 1,
    title: "KoinPay \u2014 Super App",
    category: "Fintech \xB7 Mobile & Web",
    description: "Core banking + dompet digital untuk koperasi simpan pinjam. 2,3 juta pengguna aktif, latency rata-rata <120ms. Dibangun dalam 14 bulan.",
    tech: ["React Native", "Go", "PostgreSQL", "Redis"],
    color: "from-blue-600 to-indigo-700",
    emoji: "\u{1F3E6}",
    year: "2023",
    result: "+340% transaksi digital dalam 6 bulan"
  },
  {
    id: 2,
    title: "Warung Connect",
    category: "E-Commerce \xB7 B2B",
    description: "Marketplace grosir untuk 12.000+ warung di Jabodetabek. Integrasi langsung ke sistem distributor FMCG. Order processing <2 detik.",
    tech: ["Next.js", "Bun", "MySQL", "Kafka"],
    color: "from-emerald-500 to-teal-600",
    emoji: "\u{1F6D2}",
    year: "2023",
    result: "Rp 4,2 miliar GMV di bulan ketiga"
  },
  {
    id: 3,
    title: "CerdasRetail Analytics",
    category: "Data & AI",
    description: "Prediksi stok & demand forecasting untuk jaringan minimarket 200+ gerai. Akurasi prediksi 91%, turunkan overstock 28%.",
    tech: ["Python", "FastAPI", "TensorFlow", "Metabase"],
    color: "from-purple-600 to-violet-700",
    emoji: "\u{1F4CA}",
    year: "2022",
    result: "Hemat Rp 1,8 miliar/tahun biaya inventory"
  },
  {
    id: 4,
    title: "KlinikKu \u2014 Telemedicine",
    category: "HealthTech \xB7 SaaS",
    description: "Platform konsultasi dokter online dengan rekam medis digital. BPJS-integrated. Sudah dipakai 800+ klinik di 12 provinsi.",
    tech: ["Vue.js", "Laravel", "AWS", "WebRTC"],
    color: "from-rose-500 to-pink-600",
    emoji: "\u{1FA7A}",
    year: "2022",
    result: "4,8/5 rating dari 50.000+ pasien"
  }
];

// src/pages/home.ts
var svcRows = services.slice(0, 4).map((s, i) => `
  <div style="display:flex;align-items:flex-start;gap:1.5rem;padding:1.5rem 0;border-bottom:1px solid var(--surface-3)" class="reveal reveal-d${i % 3 + 1}">
    <span class="mono" style="font-size:11px;color:var(--ink-3);padding-top:4px;min-width:24px">${String(i + 1).padStart(2, "0")}</span>
    <div style="flex:1">
      <h3 style="font-size:16px;font-weight:700;margin-bottom:0.35rem">${s.title}</h3>
      <p style="font-size:13.5px;color:var(--ink-3);line-height:1.6;max-width:520px">${s.description}</p>
    </div>
    <span style="font-size:11px;color:var(--ink-3);font-family:'Geist Mono',monospace;white-space:nowrap;padding-top:4px">${s.detail}</span>
  </div>
`).join("");
var tCards = testimonials.map((t, i) => `
  <div class="reveal reveal-d${i + 1}" style="padding:1.75rem;background:#fff;border:1px solid var(--surface-3);border-radius:var(--radius-lg)">
    <p style="font-size:14px;line-height:1.7;color:var(--ink-2);margin-bottom:1.25rem">"${t.text}"</p>
    <hr class="divider" style="margin-bottom:1.25rem">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap">
      <div style="display:flex;align-items:center;gap:0.75rem">
        <div style="width:36px;height:36px;border-radius:50%;background:var(--surface-3);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;font-family:'Geist Mono',monospace;color:var(--ink-2);flex-shrink:0">${t.avatar}</div>
        <div>
          <p style="font-size:13px;font-weight:600;color:var(--ink)">${t.name}</p>
          <p style="font-size:12px;color:var(--ink-3)">${t.role}, ${t.company}</p>
        </div>
      </div>
      <span style="font-family:'Geist Mono',monospace;font-size:10.5px;color:var(--ink-3);background:var(--surface-2);padding:0.2rem 0.6rem;border-radius:4px">${t.project}</span>
    </div>
  </div>
`).join("");
var techItems = [
  "Bun",
  "TypeScript",
  "React",
  "Next.js",
  "Go",
  "Python",
  "PostgreSQL",
  "Redis",
  "AWS",
  "Docker",
  "Kubernetes",
  "React Native",
  "Flutter",
  "TensorFlow",
  "Kafka",
  "Bun",
  "TypeScript",
  "React",
  "Next.js",
  "Go",
  "Python",
  "PostgreSQL",
  "Redis",
  "AWS",
  "Docker",
  "Kubernetes",
  "React Native",
  "Flutter",
  "TensorFlow",
  "Kafka"
].map((t) => `<span class="mono" style="font-size:12px;color:var(--ink-3);white-space:nowrap">${t}</span>`).join("");
var content = `
  <!-- \u2500\u2500 HERO \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
  <section style="min-height:100dvh;display:flex;align-items:center;padding-top:var(--nav-h);background:var(--surface)">
    <div class="container" style="padding-top:5rem;padding-bottom:5rem">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:center">

        <!-- Left -->
        <div>
          <h1 style="font-size:clamp(2.4rem,4.5vw,3.5rem);font-weight:900;line-height:1.08;letter-spacing:-0.035em;margin-bottom:1.5rem">
            Software yang<br>benar-benar<br><em style="font-style:italic;color:var(--accent)">berfungsi.</em>
          </h1>
          <p style="font-size:16px;color:var(--ink-2);max-width:420px;line-height:1.7;margin-bottom:2rem">
            Bukan portfolio kosong. Kami sudah 9 tahun bantu startup dan korporat Indonesia tumbuh lewat teknologi. 500+ proyek, 0 klien yang pergi marah.
          </p>
          <div style="display:flex;gap:0.75rem;flex-wrap:wrap">
            <a href="/contact" class="btn btn-dark">Ceritakan proyek Anda &rarr;</a>
            <a href="/portfolio" class="btn btn-outline">Lihat hasil kerja</a>
          </div>
        </div>

        <!-- Right: asymmetric stats panel -->
        <div style="background:#fff;border:1px solid var(--surface-3);border-radius:var(--radius-lg);padding:2.5rem;position:relative">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0">
            <div style="padding:1.5rem;border-right:1px solid var(--surface-3);border-bottom:1px solid var(--surface-3)">
              <p style="font-size:2.6rem;font-weight:900;letter-spacing:-0.04em;color:var(--ink)" data-counter data-target="500" data-suffix="+">0+</p>
              <p style="font-size:12px;color:var(--ink-3);margin-top:0.25rem">Proyek selesai</p>
            </div>
            <div style="padding:1.5rem;border-bottom:1px solid var(--surface-3)">
              <p style="font-size:2.6rem;font-weight:900;letter-spacing:-0.04em;color:var(--ink)" data-counter data-target="200" data-suffix="+">0+</p>
              <p style="font-size:12px;color:var(--ink-3);margin-top:0.25rem">Klien aktif</p>
            </div>
            <div style="padding:1.5rem;border-right:1px solid var(--surface-3)">
              <p style="font-size:2.6rem;font-weight:900;letter-spacing:-0.04em;color:var(--ink)" data-counter data-target="9" data-suffix=" thn">0 thn</p>
              <p style="font-size:12px;color:var(--ink-3);margin-top:0.25rem">Di industri</p>
            </div>
            <div style="padding:1.5rem">
              <p style="font-size:2.6rem;font-weight:900;letter-spacing:-0.04em;color:var(--accent)" data-counter data-target="99" data-suffix=".9%" data-float="0">0%</p>
              <p style="font-size:12px;color:var(--ink-3);margin-top:0.25rem">Uptime rata-rata</p>
            </div>
          </div>
          <!-- status badge -->
          <div style="margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid var(--surface-3);display:flex;align-items:center;gap:0.6rem">
            <span style="width:7px;height:7px;border-radius:50%;background:var(--accent);animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;flex-shrink:0"></span>
            <span style="font-size:12.5px;color:var(--ink-2)">Terbuka untuk proyek baru per Q3 2024</span>
          </div>
        </div>

      </div>
    </div>
  </section>

  <style>
    @keyframes ping {
      75%, 100% { transform: scale(1.8); opacity: 0; }
    }
    @media (max-width: 768px) {
      .hero-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
    }
  </style>

  <!-- \u2500\u2500 TECH MARQUEE \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
  <section style="padding:1.25rem 0;background:#fff;border-top:1px solid var(--surface-3);border-bottom:1px solid var(--surface-3)">
    <div class="marquee-outer">
      <div class="marquee-track">${techItems}</div>
    </div>
  </section>

  <!-- \u2500\u2500 SERVICES \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
  <section style="padding:6rem 0;background:var(--surface)">
    <div class="container">
      <div style="display:grid;grid-template-columns:280px 1fr;gap:5rem;align-items:start">

        <!-- Sticky label column -->
        <div style="position:sticky;top:calc(var(--nav-h) + 2rem)">
          <h2 style="font-size:clamp(1.6rem,2.5vw,2rem);margin-bottom:0.75rem">Yang kami kerjakan sehari-hari</h2>
          <p style="font-size:14px;color:var(--ink-3);line-height:1.65;margin-bottom:1.5rem">Bukan semua hal. Hanya yang benar-benar kami kuasai.</p>
          <a href="/services" class="btn btn-outline" style="font-size:13px">Semua layanan &rarr;</a>
        </div>

        <!-- Service rows -->
        <div>
          ${svcRows}
        </div>
      </div>
    </div>
  </section>

  <!-- \u2500\u2500 WHY US \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
  <section style="padding:6rem 0;background:#fff;border-top:1px solid var(--surface-3)">
    <div class="container">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6rem;align-items:start">

        <div class="reveal">
          <h2 style="font-size:clamp(1.8rem,3vw,2.4rem);margin-bottom:1rem;line-height:1.15">Kami bukan yang paling murah. Tapi kami <span class="accent-text">worth it.</span></h2>
          <p style="font-size:14px;color:var(--ink-2);line-height:1.7;margin-bottom:2rem">
            Ada vendor lebih murah, kami tidak akan bohong soal itu. Tapi kami yang datang ke meeting sudah baca brief, paham konteks bisnis, dan angkat telepon jam 11 malam kalau ada masalah sebelum launch.
          </p>
          <a href="/contact" class="btn btn-dark">Ngobrol gratis &rarr;</a>
        </div>

        <div style="display:flex;flex-direction:column;gap:0">
          ${[
  ["Tidak ada hidden cost", "Scope, timeline, biaya dijelaskan di awal. Perubahan selalu dikomunikasikan sebelum dikerjakan."],
  ["Kode yang bisa Anda baca", "Kami tulis dokumentasi, ikuti standar, dan pastikan tim Anda bisa maintain setelah kami selesai."],
  ["Reply dalam jam kerja", "WA dibalas dalam jam kerja. Darurat? Ada hotline yang beneran diangkat, bukan bot."],
  ["Garansi 3 bulan", "Bug-fix pasca-launch gratis 3 bulan. Tidak ada biaya tersembunyi untuk masalah yang kami buat."]
].map(([title, desc], i) => `
            <div class="reveal reveal-d${i + 1}" style="display:flex;gap:1rem;padding:1.25rem 0;border-bottom:1px solid var(--surface-3)">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="flex-shrink:0;margin-top:3px">
                <circle cx="8" cy="8" r="7.5" stroke="var(--accent)" stroke-width="1"/>
                <path d="M5 8l2 2 4-4" stroke="var(--accent)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div>
                <p style="font-size:14px;font-weight:600;color:var(--ink);margin-bottom:0.25rem">${title}</p>
                <p style="font-size:13px;color:var(--ink-3);line-height:1.6">${desc}</p>
              </div>
            </div>
          `).join("")}
        </div>

      </div>
    </div>
  </section>

  <!-- \u2500\u2500 TESTIMONIALS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
  <section style="padding:6rem 0;background:var(--surface);border-top:1px solid var(--surface-3)">
    <div class="container">
      <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:2rem;margin-bottom:3rem;flex-wrap:wrap">
        <h2 class="reveal" style="font-size:clamp(1.6rem,2.5vw,2rem)">Kata klien, bukan marketing kami</h2>
        <p class="reveal" style="font-size:13px;color:var(--ink-3)">Kami minta mereka jujur.</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem">
        ${tCards}
      </div>
    </div>
  </section>

  <!-- \u2500\u2500 CTA \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
  <section style="padding:6rem 0;background:#fff;border-top:1px solid var(--surface-3)">
    <div class="container-sm reveal">
      <div style="background:var(--ink);border-radius:var(--radius-lg);padding:4rem;text-align:center">
        <p style="font-family:'Geist Mono',monospace;font-size:10.5px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-bottom:1rem">Mulai dari obrolan</p>
        <h2 style="color:#fafafa;font-size:clamp(1.8rem,3vw,2.4rem);margin-bottom:1rem;line-height:1.15">Punya masalah teknis?<br>Kami dengerin.</h2>
        <p style="font-size:14px;color:rgba(255,255,255,0.5);margin-bottom:2rem;line-height:1.65">Tidak perlu brief sempurna. Cukup ceritakan konteksnya, kita figureout bareng.</p>
        <div style="display:flex;justify-content:center;gap:0.75rem;flex-wrap:wrap">
          <a href="/contact" class="btn" style="background:#fafafa;color:var(--ink)">Hubungi kami</a>
          <a href="/portfolio" class="btn" style="background:transparent;color:rgba(255,255,255,0.7);border:1.5px solid rgba(255,255,255,0.2)">Lihat portfolio dulu</a>
        </div>
      </div>
    </div>
  </section>

  <style>
    @media (max-width: 768px) {
      section > .container > div[style*="grid-template-columns:1fr 1fr"],
      section > .container > div[style*="grid-template-columns:280px"] {
        grid-template-columns: 1fr !important;
        gap: 2.5rem !important;
      }
      div[style*="grid-template-columns:repeat(3"] {
        grid-template-columns: 1fr !important;
      }
      div[style*="grid-template-columns:1fr 1fr"][style*="gap:0"] {
        grid-template-columns: 1fr 1fr !important;
      }
    }
  </style>
`;
var homePage = () => layout("Beranda", content, "home");

// src/pages/services.ts
var svcItems = services.map((s, i) => `
  <div class="reveal" style="padding:2rem 0;border-bottom:1px solid var(--surface-3);display:grid;grid-template-columns:48px 1fr auto;gap:1.5rem;align-items:flex-start">
    <span class="mono" style="font-size:11px;color:var(--ink-3);padding-top:5px">${String(i + 1).padStart(2, "0")}</span>
    <div>
      <h3 style="font-size:18px;font-weight:700;margin-bottom:0.5rem">${s.title}</h3>
      <p style="font-size:14px;color:var(--ink-2);line-height:1.65;max-width:560px">${s.description}</p>
      <a href="/contact" style="display:inline-flex;align-items:center;gap:0.3rem;font-size:13px;font-weight:600;color:var(--accent);text-decoration:none;margin-top:0.75rem">Diskusikan kebutuhan &rarr;</a>
    </div>
    <span class="mono" style="font-size:11px;color:var(--ink-3);white-space:nowrap;padding-top:5px;text-align:right">${s.detail}</span>
  </div>
`).join("");
var techList = [
  { name: "Bun", note: "Runtime utama" },
  { name: "TypeScript", note: "Selalu" },
  { name: "React / Next.js", note: "" },
  { name: "Go", note: "Backend high-load" },
  { name: "Python", note: "AI & data" },
  { name: "PostgreSQL", note: "DB favorit" },
  { name: "Redis", note: "" },
  { name: "AWS", note: "Cloud utama" },
  { name: "Docker + K8s", note: "" },
  { name: "React Native", note: "" },
  { name: "Flutter", note: "" },
  { name: "TensorFlow", note: "" },
  { name: "Kafka", note: "Event streaming" },
  { name: "Vue.js", note: "" },
  { name: "Laravel", note: "PHP legacy" }
];
var processSteps = [
  ["Obrolan awal", "30-60 menit. Kami dengarkan masalah Anda, bukan langsung kasih penawaran. Kalau kami bukan yang tepat, kami bilang jujur."],
  ["Scope & estimasi", "Proposal detail dalam 48 jam: lingkup, timeline, milestone, biaya. Tidak ada angka yang tiba-tiba berubah di tengah jalan."],
  ["Bangun bareng", "Sprint 2 minggu, update rutin. Akses ke repo kapan saja. Tidak perlu nunggu 3 bulan buat lihat progress."],
  ["Launch & lanjut", "Deploy, monitoring 30 hari, handover lengkap ke tim Anda. Garansi bug-fix 3 bulan setelah launch."]
];
var content2 = `
  <!-- Header -->
  <section style="padding-top:calc(var(--nav-h) + 5rem);padding-bottom:4rem;background:var(--surface)">
    <div class="container">
      <div style="max-width:600px">
        <h1 style="font-size:clamp(2.2rem,4vw,3rem);font-weight:900;letter-spacing:-0.035em;line-height:1.1;margin-bottom:1rem">
          Yang kami kerjakan sehari-hari
        </h1>
        <p style="font-size:16px;color:var(--ink-2);line-height:1.7">
          Kami tidak menawarkan semua hal. Fokus di bidang yang benar-benar kami kuasai, dan hasilnya bisa Anda lihat di portfolio.
        </p>
      </div>
    </div>
  </section>

  <!-- Service list -->
  <section style="background:#fff;border-top:1px solid var(--surface-3);padding:0 0 4rem">
    <div class="container">
      ${svcItems}
    </div>
  </section>

  <!-- Process -->
  <section style="padding:6rem 0;background:var(--surface);border-top:1px solid var(--surface-3)">
    <div class="container">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:start">
        <div class="reveal" style="position:sticky;top:calc(var(--nav-h) + 2rem)">
          <h2 style="font-size:clamp(1.6rem,2.5vw,2rem);margin-bottom:0.75rem">Proses yang tidak ada yang disembunyikan</h2>
          <p style="font-size:14px;color:var(--ink-3);line-height:1.65">Dari hari pertama sampai launch, ini yang terjadi.</p>
        </div>
        <div>
          ${processSteps.map(([title, desc], i) => `
            <div class="reveal reveal-d${i + 1}" style="display:flex;gap:1.5rem;padding:1.75rem 0;border-bottom:1px solid var(--surface-3)">
              <div style="width:32px;height:32px;border-radius:6px;background:var(--ink);color:#fafafa;display:flex;align-items:center;justify-content:center;font-family:'Geist Mono',monospace;font-size:11px;font-weight:700;flex-shrink:0">${String(i + 1).padStart(2, "0")}</div>
              <div>
                <p style="font-size:15px;font-weight:700;color:var(--ink);margin-bottom:0.35rem">${title}</p>
                <p style="font-size:13.5px;color:var(--ink-3);line-height:1.65">${desc}</p>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  </section>

  <!-- Tech -->
  <section style="padding:5rem 0;background:#fff;border-top:1px solid var(--surface-3)">
    <div class="container">
      <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:2rem;margin-bottom:2.5rem;flex-wrap:wrap">
        <h2 class="reveal" style="font-size:1.5rem">Tools yang kami pakai, bukan yang kami pelajari bulan lalu</h2>
        <p class="reveal" style="font-size:13px;color:var(--ink-3)">Dipilih berdasarkan stabilitas produksi, bukan hype.</p>
      </div>
      <div class="reveal" style="display:flex;flex-wrap:wrap;gap:0.5rem">
        ${techList.map(({ name, note }) => `
          <span title="${note}" style="background:var(--surface-2);color:var(--ink-2);padding:0.4rem 0.9rem;border-radius:var(--radius);font-size:13px;font-weight:500;cursor:default;border:1px solid var(--surface-3);transition:background 0.15s,color 0.15s" onmouseover="this.style.background='var(--accent-bg)';this.style.color='var(--accent)'" onmouseout="this.style.background='var(--surface-2)';this.style.color='var(--ink-2)'">${name}</span>
        `).join("")}
      </div>
    </div>
  </section>

  <!-- Pricing philosophy -->
  <section style="padding:5rem 0;background:var(--surface);border-top:1px solid var(--surface-3)">
    <div class="container-sm reveal">
      <div style="background:#fff;border:1px solid var(--surface-3);border-radius:var(--radius-lg);padding:3rem">
        <h2 style="font-size:1.5rem;margin-bottom:0.75rem">Soal harga, kami jujur</h2>
        <p style="font-size:14px;color:var(--ink-2);line-height:1.7;margin-bottom:2rem">
          Tidak ada daftar harga tetap, setiap proyek berbeda. Tapi kami bisa kasih estimasi jujur dalam 48 jam setelah brief diterima.
        </p>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--surface-3);border:1px solid var(--surface-3);border-radius:var(--radius);overflow:hidden;margin-bottom:2rem">
          ${[
  ["Website", "Mulai Rp 25 juta"],
  ["Mobile App", "Mulai Rp 80 juta"],
  ["Enterprise", "Sesuai scope"]
].map(([type, price]) => `
            <div style="background:#fff;padding:1.25rem 1.5rem">
              <p style="font-size:11px;color:var(--ink-3);margin-bottom:0.35rem;font-family:'Geist Mono',monospace;text-transform:uppercase;letter-spacing:0.08em">${type}</p>
              <p style="font-size:14px;font-weight:700;color:var(--ink)">${price}</p>
            </div>
          `).join("")}
        </div>
        <a href="/contact" class="btn btn-dark">Minta estimasi gratis &rarr;</a>
      </div>
    </div>
  </section>

  <style>
    @media (max-width: 768px) {
      div[style*="grid-template-columns:48px 1fr auto"] {
        grid-template-columns: 1fr !important;
        gap: 0.5rem !important;
      }
      div[style*="grid-template-columns:1fr 1fr"][style*="gap:5rem"] {
        grid-template-columns: 1fr !important;
        gap: 2.5rem !important;
      }
      div[style*="grid-template-columns:repeat(3,1fr)"] {
        grid-template-columns: 1fr !important;
      }
    }
  </style>
`;
var servicesPage = () => layout("Layanan", content2, "services");

// src/pages/portfolio.ts
var featured = portfolios[0];
var rest = portfolios.slice(1);
var content3 = `
  <!-- Header -->
  <section style="padding-top:calc(var(--nav-h) + 5rem);padding-bottom:4rem;background:var(--surface)">
    <div class="container">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:end">
        <h1 class="reveal" style="font-size:clamp(2.2rem,4vw,3rem);font-weight:900;letter-spacing:-0.035em;line-height:1.1">
          Proyek nyata,<br>hasil yang terukur
        </h1>
        <p class="reveal" style="font-size:15px;color:var(--ink-2);line-height:1.7;max-width:400px">
          Bukan mockup atau konsep. Ini proyek yang sudah jalan dan dipakai pengguna sungguhan.
        </p>
      </div>
    </div>
  </section>

  <!-- Featured project (full-width asymmetric) -->
  <section style="background:#fff;border-top:1px solid var(--surface-3);padding:4rem 0">
    <div class="container reveal">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0;border:1px solid var(--surface-3);border-radius:var(--radius-lg);overflow:hidden">
        <!-- Visual panel -->
        <div style="background:var(--ink);padding:3.5rem;display:flex;align-items:flex-end;min-height:320px;position:relative">
          <div style="position:absolute;top:2rem;right:2rem;background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.6);font-family:'Geist Mono',monospace;font-size:10.5px;padding:0.3rem 0.6rem;border-radius:4px">${featured.year}</div>
          <div>
            <p style="font-family:'Geist Mono',monospace;font-size:10.5px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:0.5rem">${featured.category.split(" \xB7 ")[0]}</p>
            <h2 style="font-size:1.75rem;color:#fafafa;margin-bottom:0.5rem">${featured.title}</h2>
          </div>
        </div>
        <!-- Content panel -->
        <div style="padding:3.5rem;background:#fff;border-left:1px solid var(--surface-3)">
          <p style="font-size:14px;color:var(--ink-2);line-height:1.7;margin-bottom:1.5rem">${featured.description}</p>
          <div style="display:flex;align-items:center;gap:0.6rem;padding:1rem;background:var(--accent-bg);border-radius:var(--radius);border:1px solid rgba(22,163,74,0.15);margin-bottom:1.5rem">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 9l3 3 7-7" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <p style="font-size:12.5px;font-weight:600;color:var(--accent)">${featured.result}</p>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:0.4rem">
            ${featured.tech.map((t) => `<span style="background:var(--surface-2);color:var(--ink-2);padding:0.25rem 0.65rem;border-radius:4px;font-size:12px;font-family:'Geist Mono',monospace;border:1px solid var(--surface-3)">${t}</span>`).join("")}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Rest of portfolio: 2-col then 3-col variation -->
  <section style="padding:2rem 0 5rem;background:#fff">
    <div class="container">
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1.25rem">
        ${rest.map((p, i) => `
          <div class="card reveal reveal-d${i + 1}" style="overflow:hidden">
            <div style="background:var(--surface-2);padding:2rem;border-bottom:1px solid var(--surface-3);display:flex;align-items:center;justify-content:space-between">
              <p style="font-family:'Geist Mono',monospace;font-size:10.5px;color:var(--ink-3)">${p.category.split(" \xB7 ")[0]}</p>
              <span style="font-family:'Geist Mono',monospace;font-size:10.5px;color:var(--ink-3)">${p.year}</span>
            </div>
            <div style="padding:1.75rem">
              <h3 style="font-size:16px;font-weight:700;margin-bottom:0.5rem">${p.title}</h3>
              <p style="font-size:13px;color:var(--ink-3);line-height:1.6;margin-bottom:1.25rem">${p.description}</p>
              <div style="display:flex;align-items:center;gap:0.5rem;padding:0.75rem;background:var(--accent-bg);border-radius:var(--radius);border:1px solid rgba(22,163,74,0.12);margin-bottom:1.25rem">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1.5 8l2.5 2.5 6.5-7" stroke="var(--accent)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <p style="font-size:11.5px;font-weight:600;color:var(--accent)">${p.result}</p>
              </div>
              <div style="display:flex;flex-wrap:wrap;gap:0.35rem">
                ${p.tech.map((t) => `<span style="background:var(--surface-2);color:var(--ink-3);padding:0.2rem 0.55rem;border-radius:4px;font-size:11px;font-family:'Geist Mono',monospace">${t}</span>`).join("")}
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  </section>

  <!-- Stats row -->
  <section style="padding:5rem 0;background:var(--ink);border-top:1px solid rgba(255,255,255,0.06)">
    <div class="container">
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0">
        ${[
  ["500", "+", "Proyek selesai"],
  ["200", "+", "Klien aktif"],
  ["99.94", "%", "Rata-rata uptime"],
  ["4.9", "/5", "Rating klien"]
].map(([num, suf, label], i) => `
          <div class="reveal reveal-d${i + 1}" style="padding:2rem;${i < 3 ? "border-right:1px solid rgba(255,255,255,0.08)" : ""}">
            <p style="font-size:2.4rem;font-weight:900;letter-spacing:-0.04em;color:#fafafa" data-counter data-target="${num}" data-suffix="${suf}">${0}${suf}</p>
            <p style="font-size:12px;color:rgba(255,255,255,0.4);margin-top:0.25rem;font-family:'Geist Mono',monospace">${label}</p>
          </div>
        `).join("")}
      </div>
    </div>
  </section>

  <!-- Industries -->
  <section style="padding:5rem 0;background:var(--surface);border-top:1px solid var(--surface-3)">
    <div class="container">
      <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:2rem;margin-bottom:2.5rem;flex-wrap:wrap">
        <h2 class="reveal" style="font-size:1.5rem">Industri yang pernah kami tangani</h2>
        <p class="reveal" style="font-size:13px;color:var(--ink-3)">Konteks yang sudah ada, bukan harus dipelajari dari nol.</p>
      </div>
      <div class="reveal" style="display:flex;flex-wrap:wrap;gap:0.5rem">
        ${["Fintech", "E-Commerce", "HealthTech", "EdTech", "Logistik", "Retail", "Manufaktur", "FMCG", "Property", "Media", "Perbankan", "Asuransi"].map((ind) => `
          <span style="background:#fff;color:var(--ink-2);padding:0.45rem 1rem;border-radius:var(--radius);font-size:13px;font-weight:500;cursor:default;border:1px solid var(--surface-3)">${ind}</span>
        `).join("")}
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section style="padding:5rem 0;background:#fff;border-top:1px solid var(--surface-3)">
    <div class="container-sm reveal" style="text-align:center">
      <h2 style="font-size:1.75rem;margin-bottom:0.75rem">Proyek Anda bisa jadi yang berikutnya</h2>
      <p style="font-size:14px;color:var(--ink-3);margin-bottom:2rem">Tidak perlu brief sempurna untuk mulai ngobrol.</p>
      <a href="/contact" class="btn btn-dark">Mulai ngobrol &rarr;</a>
    </div>
  </section>

  <style>
    @media (max-width: 768px) {
      div[style*="grid-template-columns:1fr 1fr"][style*="gap:4rem"] { grid-template-columns: 1fr !important; gap: 2rem !important; }
      div[style*="grid-template-columns:1fr 1fr"][style*="gap:0"][style*="overflow:hidden"] { grid-template-columns: 1fr !important; }
      div[style*="grid-template-columns:1fr 1fr 1fr"] { grid-template-columns: 1fr !important; }
      div[style*="grid-template-columns:repeat(4"] { grid-template-columns: repeat(2,1fr) !important; }
      div[style*="border-right:1px solid rgba(255,255,255,0.08)"] { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.08) !important; }
    }
  </style>
`;
var portfolioPage = () => layout("Portfolio", content3, "portfolio");

// src/pages/about.ts
var content4 = `
  <!-- Header -->
  <section style="padding-top:calc(var(--nav-h) + 5rem);padding-bottom:4rem;background:var(--surface)">
    <div class="container">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:end">
        <h1 class="reveal" style="font-size:clamp(2.2rem,4vw,3rem);font-weight:900;letter-spacing:-0.035em;line-height:1.1">
          Tim di balik NusaTech
        </h1>
        <p class="reveal" style="font-size:15px;color:var(--ink-2);line-height:1.7">
          Mulai dari garasi 4 orang pada 2015. Sekarang 150+, tapi prinsipnya sama: jujur, tepat waktu, dan hasilnya harus bisa diukur.
        </p>
      </div>
    </div>
  </section>

  <!-- Origin story -->
  <section style="padding:5rem 0;background:#fff;border-top:1px solid var(--surface-3)">
    <div class="container">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6rem;align-items:start">
        <div class="reveal">
          <h2 style="font-size:1.75rem;margin-bottom:1.25rem;line-height:1.2">Kenapa kami ada</h2>
          <div style="display:flex;flex-direction:column;gap:1rem">
            <p style="font-size:14px;color:var(--ink-2);line-height:1.75">
              Budi dan Sari ketemu waktu kerja di Tokopedia 2014. Keduanya frustrasi melihat proyek teknologi perusahaan Indonesia yang gagal, bukan karena teknologinya jelek, tapi karena vendor tidak mengerti bisnis dan bisnis tidak mengerti teknologi.
            </p>
            <p style="font-size:14px;color:var(--ink-2);line-height:1.75">
              Mereka keluar, sewa ruko kecil di Kebayoran, dan mulai dengan tiga prinsip: tidak ambil proyek yang tidak bisa dikerjakan dengan baik, selalu transparan soal progress, dan tidak menghilang setelah launch.
            </p>
            <p style="font-size:14px;color:var(--ink-2);line-height:1.75">
              Sembilan tahun kemudian, tim bertambah dari 4 jadi 150+, tapi orang yang pertama kali telepon ke nomor kami masih akan dapat respons dari manusia, bukan bot.
            </p>
          </div>
        </div>

        <!-- Timeline -->
        <div class="reveal">
          <div style="display:flex;flex-direction:column;gap:0">
            ${[
  ["2015", "Berdiri", "4 orang, 1 ruko, 3 laptop. Proyek pertama: website company profile Rp 8 juta."],
  ["2017", "Tumbuh", "Tim jadi 20 orang. Mulai ambil proyek mobile app dan klien enterprise pertama."],
  ["2019", "Ekspansi AI", "Buka divisi data & AI. Proyek ML pertama untuk prediksi churn pelanggan telko."],
  ["2021", "150+ Tim", "Buka kantor kedua di Surabaya. Mulai handle proyek lintas negara."],
  ["2024", "Sekarang", "500+ proyek selesai. Masih jalan dengan prinsip yang sama sejak hari pertama."]
].map(([year, title, desc], i, arr) => `
              <div style="display:flex;gap:1.25rem;padding-bottom:${i < arr.length - 1 ? "1.75rem" : "0"}">
                <div style="display:flex;flex-direction:column;align-items:center;gap:0">
                  <div style="width:10px;height:10px;border-radius:50%;background:${i === arr.length - 1 ? "var(--accent)" : "var(--ink)"};flex-shrink:0;margin-top:4px"></div>
                  ${i < arr.length - 1 ? `<div style="width:1px;flex:1;background:var(--surface-3);margin-top:4px"></div>` : ""}
                </div>
                <div style="padding-bottom:${i < arr.length - 1 ? "0" : "0"}">
                  <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:0.25rem">
                    <span style="font-size:13px;font-weight:700;color:var(--ink)">${title}</span>
                    <span style="font-family:'Geist Mono',monospace;font-size:10.5px;color:var(--ink-3)">${year}</span>
                  </div>
                  <p style="font-size:13px;color:var(--ink-3);line-height:1.6">${desc}</p>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Stats -->
  <section style="background:var(--surface);border-top:1px solid var(--surface-3);padding:4rem 0">
    <div class="container">
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:1px solid var(--surface-3);border-radius:var(--radius-lg);overflow:hidden;background:#fff">
        ${[
  ["2015", "", "Tahun berdiri"],
  ["150", "+", "Tim saat ini"],
  ["500", "+", "Proyek"],
  ["200", "+", "Klien"]
].map(([num, suf, label], i) => `
          <div class="reveal reveal-d${i + 1}" style="padding:2rem;${i < 3 ? "border-right:1px solid var(--surface-3)" : ""}">
            <p style="font-size:2.2rem;font-weight:900;letter-spacing:-0.04em;color:var(--ink)" data-counter data-target="${num}" data-suffix="${suf}">${0}${suf}</p>
            <p style="font-size:12px;color:var(--ink-3);margin-top:0.25rem">${label}</p>
          </div>
        `).join("")}
      </div>
    </div>
  </section>

  <!-- Team -->
  <section id="team" style="padding:5rem 0;background:#fff;border-top:1px solid var(--surface-3)">
    <div class="container">
      <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:2rem;margin-bottom:3rem;flex-wrap:wrap">
        <h2 class="reveal" style="font-size:1.75rem">Orang sungguhan, bukan foto stock</h2>
        <p class="reveal" style="font-size:13px;color:var(--ink-3)">Ini orang yang Anda ajak meeting, bukan nama di brosur.</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1.25rem">
        ${team.map((m, i) => `
          <div class="reveal reveal-d${i % 4 + 1}" style="border:1px solid var(--surface-3);border-radius:var(--radius-lg);overflow:hidden;background:#fff">
            <div style="background:var(--surface-2);padding:1.75rem 1.75rem 1.25rem;border-bottom:1px solid var(--surface-3)">
              <div style="width:44px;height:44px;border-radius:8px;background:var(--ink);color:#fafafa;display:flex;align-items:center;justify-content:center;font-family:'Geist Mono',monospace;font-size:11px;font-weight:700;margin-bottom:0.75rem">${m.photo}</div>
              <p style="font-size:14px;font-weight:700;color:var(--ink);margin-bottom:0.2rem">${m.name}</p>
              <p style="font-size:12px;color:var(--accent);font-weight:500">${m.role}</p>
            </div>
            <div style="padding:1.25rem 1.75rem">
              <p style="font-size:13px;color:var(--ink-3);line-height:1.6;margin-bottom:1rem">${m.bio}</p>
              <div style="display:flex;align-items:center;gap:0.5rem;padding-top:0.75rem;border-top:1px solid var(--surface-3)">
                <span style="font-size:13px">-</span>
                <p style="font-size:12px;color:var(--ink-3);font-style:italic">${m.funFact}</p>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  </section>

  <!-- Culture -->
  <section style="padding:5rem 0;background:var(--surface);border-top:1px solid var(--surface-3)">
    <div class="container">
      <div style="margin-bottom:2.5rem">
        <h2 class="reveal" style="font-size:1.75rem;margin-bottom:0.5rem">Cara kerja kami</h2>
        <p class="reveal" style="font-size:14px;color:var(--ink-3)">Tidak ada lembur paksa. Ada ping-pong (satu meja). Ini yang lebih penting:</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0;border:1px solid var(--surface-3);border-radius:var(--radius-lg);overflow:hidden">
        ${[
  ["Tulis dulu, kerjakan kemudian", "Semua keputusan teknis penting kami dokumentasikan. ADR, README, runbook, bukan cuma ada di kepala satu orang."],
  ["Tidak ada lembur paksa", "Deadline ketat? Kami negosiasikan scope, bukan minta tim kerja sampai jam 2 pagi. Burnout itu mahal."],
  ["Feedback loop cepat", "Code review dalam 24 jam, standup 15 menit, retrospective tiap sprint. Masalah ketahuan cepat, selesai juga cepat."]
].map(([title, desc], i) => `
          <div class="reveal reveal-d${i + 1}" style="padding:2rem;background:#fff;${i < 2 ? "border-right:1px solid var(--surface-3)" : ""}">
            <p style="font-family:'Geist Mono',monospace;font-size:10.5px;color:var(--accent);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.1em">${String(i + 1).padStart(2, "0")}</p>
            <p style="font-size:14px;font-weight:700;color:var(--ink);margin-bottom:0.5rem">${title}</p>
            <p style="font-size:13px;color:var(--ink-3);line-height:1.65">${desc}</p>
          </div>
        `).join("")}
      </div>
    </div>
  </section>

  <!-- Hiring CTA -->
  <section style="padding:5rem 0;background:#fff;border-top:1px solid var(--surface-3)">
    <div class="container-sm reveal">
      <div style="border:1px solid var(--surface-3);border-radius:var(--radius-lg);padding:3rem;background:var(--surface)">
        <h2 style="font-size:1.5rem;margin-bottom:0.75rem">Ingin bergabung?</h2>
        <p style="font-size:14px;color:var(--ink-2);line-height:1.7;margin-bottom:1.75rem;max-width:480px">
          Kami cari orang yang bisa berpikir mandiri, nulis kode yang bisa dibaca orang lain, dan tidak takut bilang "saya tidak tahu" lalu langsung cari jawabannya.
        </p>
        <a href="/contact" class="btn btn-dark">Kirim CV dan portfolio &rarr;</a>
      </div>
    </div>
  </section>

  <style>
    @media (max-width: 768px) {
      div[style*="grid-template-columns:1fr 1fr"][style*="gap:5rem"] { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
      div[style*="grid-template-columns:1fr 1fr"][style*="gap:6rem"] { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
      div[style*="grid-template-columns:repeat(4,1fr)"] { grid-template-columns: 1fr 1fr !important; }
      div[style*="grid-template-columns:repeat(4,1fr)"][style*="border:1px solid var(--surface-3)"] { grid-template-columns: 1fr 1fr !important; }
      div[style*="grid-template-columns:repeat(3,1fr)"][style*="border:1px solid var(--surface-3)"] { grid-template-columns: 1fr !important; }
      div[style*="border-right:1px solid var(--surface-3)"] { border-right: none !important; border-bottom: 1px solid var(--surface-3) !important; }
    }
  </style>
`;
var aboutPage = () => layout("Tim Kami", content4, "about");

// src/pages/contact.ts
var faqItems = [
  ["Apakah konsultasi pertama benar-benar gratis?", "Ya, benar-benar gratis. Kami dengarkan kebutuhan Anda, kasih opini teknis, dan kalau kami bukan yang tepat, kami bilang jujur."],
  ["Berapa lama dari brief sampai proposal?", "Maksimal 48 jam kerja setelah brief lengkap kami terima. Proyek sederhana biasanya lebih cepat."],
  ["Bisakah kami lihat source code di tengah pengerjaan?", "Tentu. Kami pakai private Git repo yang bisa Anda akses kapan saja. Tidak ada kode yang disembunyikan."],
  ["Bagaimana kalau proyek meleset dari timeline?", "Kami komunikasikan di awal, bukan di hari deadline. Dan kami jelaskan penyebabnya."],
  ["Apakah ada kontrak kerjanya?", "Ya, selalu. NDA dan perjanjian kerja yang mengatur scope, timeline, pembayaran, dan kepemilikan kode."],
  ["Kami startup kecil, apakah bisa bekerja sama?", "Bisa. Beberapa klien terbaik kami dimulai dari startup dengan budget terbatas. Kami bantu prioritisasi agar budget dipakai seefektif mungkin."]
];
var content5 = `
  <!-- Header -->
  <section style="padding-top:calc(var(--nav-h) + 5rem);padding-bottom:4rem;background:var(--surface)">
    <div class="container">
      <div style="max-width:560px">
        <h1 class="reveal" style="font-size:clamp(2.2rem,4vw,3rem);font-weight:900;letter-spacing:-0.035em;line-height:1.1;margin-bottom:1rem">
          Ngobrol dulu,<br>gratis dan tanpa<br><em style="color:var(--accent);font-style:italic">komitmen</em>
        </h1>
        <p class="reveal" style="font-size:15px;color:var(--ink-2);line-height:1.7">
          Isi form atau langsung WhatsApp kami. Biasanya kami balas dalam 2-3 jam di hari kerja.
        </p>
      </div>
    </div>
  </section>

  <!-- Contact content -->
  <section style="padding:2rem 0 5rem;background:#fff;border-top:1px solid var(--surface-3)">
    <div class="container">
      <div style="display:grid;grid-template-columns:1fr 380px;gap:4rem;align-items:start">

        <!-- Form -->
        <div class="reveal">
          <h2 style="font-size:1.25rem;font-weight:700;margin-bottom:0.4rem">Ceritakan proyek Anda</h2>
          <p style="font-size:13px;color:var(--ink-3);margin-bottom:2rem">Tidak perlu brief sempurna. Kita figureout bareng.</p>

          <form id="contactForm" novalidate style="display:flex;flex-direction:column;gap:1.25rem">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
              <div>
                <label style="display:block;font-size:12px;font-weight:600;color:var(--ink-2);margin-bottom:0.4rem;text-transform:uppercase;letter-spacing:0.06em;font-family:'Geist Mono',monospace">Nama *</label>
                <input type="text" name="name" required placeholder="Nama Anda"
                  style="width:100%;border:1.5px solid var(--surface-3);border-radius:var(--radius);padding:0.65rem 0.9rem;font-size:14px;font-family:'Geist',sans-serif;outline:none;transition:border-color 0.15s,box-shadow 0.15s;background:#fff;color:var(--ink)"
                  onfocus="this.style.borderColor='var(--ink)';this.style.boxShadow='0 0 0 3px rgba(15,15,15,0.06)'"
                  onblur="this.style.borderColor='var(--surface-3)';this.style.boxShadow='none'"/>
              </div>
              <div>
                <label style="display:block;font-size:12px;font-weight:600;color:var(--ink-2);margin-bottom:0.4rem;text-transform:uppercase;letter-spacing:0.06em;font-family:'Geist Mono',monospace">Email *</label>
                <input type="email" name="email" required placeholder="nama@perusahaan.com"
                  style="width:100%;border:1.5px solid var(--surface-3);border-radius:var(--radius);padding:0.65rem 0.9rem;font-size:14px;font-family:'Geist',sans-serif;outline:none;transition:border-color 0.15s,box-shadow 0.15s;background:#fff;color:var(--ink)"
                  onfocus="this.style.borderColor='var(--ink)';this.style.boxShadow='0 0 0 3px rgba(15,15,15,0.06)'"
                  onblur="this.style.borderColor='var(--surface-3)';this.style.boxShadow='none'"/>
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
              <div>
                <label style="display:block;font-size:12px;font-weight:600;color:var(--ink-2);margin-bottom:0.4rem;text-transform:uppercase;letter-spacing:0.06em;font-family:'Geist Mono',monospace">Perusahaan</label>
                <input type="text" name="company" placeholder="Opsional"
                  style="width:100%;border:1.5px solid var(--surface-3);border-radius:var(--radius);padding:0.65rem 0.9rem;font-size:14px;font-family:'Geist',sans-serif;outline:none;transition:border-color 0.15s,box-shadow 0.15s;background:#fff;color:var(--ink)"
                  onfocus="this.style.borderColor='var(--ink)';this.style.boxShadow='0 0 0 3px rgba(15,15,15,0.06)'"
                  onblur="this.style.borderColor='var(--surface-3)';this.style.boxShadow='none'"/>
              </div>
              <div>
                <label style="display:block;font-size:12px;font-weight:600;color:var(--ink-2);margin-bottom:0.4rem;text-transform:uppercase;letter-spacing:0.06em;font-family:'Geist Mono',monospace">No. WA</label>
                <input type="tel" name="phone" placeholder="08xx"
                  style="width:100%;border:1.5px solid var(--surface-3);border-radius:var(--radius);padding:0.65rem 0.9rem;font-size:14px;font-family:'Geist',sans-serif;outline:none;transition:border-color 0.15s,box-shadow 0.15s;background:#fff;color:var(--ink)"
                  onfocus="this.style.borderColor='var(--ink)';this.style.boxShadow='0 0 0 3px rgba(15,15,15,0.06)'"
                  onblur="this.style.borderColor='var(--surface-3)';this.style.boxShadow='none'"/>
              </div>
            </div>

            <div>
              <label style="display:block;font-size:12px;font-weight:600;color:var(--ink-2);margin-bottom:0.6rem;text-transform:uppercase;letter-spacing:0.06em;font-family:'Geist Mono',monospace">Jenis proyek</label>
              <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.4rem">
                ${["Web Development", "Mobile App", "Cloud & DevOps", "AI & Otomasi", "Security Audit", "Konsultasi"].map((s) => `
                  <label style="display:flex;align-items:center;gap:0.5rem;padding:0.6rem 0.75rem;border:1.5px solid var(--surface-3);border-radius:var(--radius);cursor:pointer;font-size:12.5px;font-weight:500;color:var(--ink-2);transition:border-color 0.15s,background 0.15s">
                    <input type="checkbox" name="services" value="${s}" style="accent-color:var(--ink);width:13px;height:13px">
                    ${s}
                  </label>
                `).join("")}
              </div>
            </div>

            <div>
              <label style="display:block;font-size:12px;font-weight:600;color:var(--ink-2);margin-bottom:0.4rem;text-transform:uppercase;letter-spacing:0.06em;font-family:'Geist Mono',monospace">Budget estimasi</label>
              <select name="budget" style="width:100%;border:1.5px solid var(--surface-3);border-radius:var(--radius);padding:0.65rem 0.9rem;font-size:14px;font-family:'Geist',sans-serif;outline:none;background:#fff;color:var(--ink-2);transition:border-color 0.15s"
                onfocus="this.style.borderColor='var(--ink)'" onblur="this.style.borderColor='var(--surface-3)'">
                <option value="">Pilih range (opsional)</option>
                <option>Di bawah Rp 30 juta</option>
                <option>Rp 30 - 100 juta</option>
                <option>Rp 100 - 300 juta</option>
                <option>Rp 300 juta - 1 miliar</option>
                <option>Di atas Rp 1 miliar</option>
                <option>Belum tahu, perlu diskusi</option>
              </select>
            </div>

            <div>
              <label style="display:block;font-size:12px;font-weight:600;color:var(--ink-2);margin-bottom:0.4rem;text-transform:uppercase;letter-spacing:0.06em;font-family:'Geist Mono',monospace">Ceritakan masalah Anda *</label>
              <textarea name="message" required rows="5"
                placeholder="Misalnya: kami punya toko offline 10 cabang dan ingin sistem kasir terintegrasi..."
                style="width:100%;border:1.5px solid var(--surface-3);border-radius:var(--radius);padding:0.65rem 0.9rem;font-size:14px;font-family:'Geist',sans-serif;outline:none;transition:border-color 0.15s,box-shadow 0.15s;background:#fff;color:var(--ink);resize:vertical;line-height:1.65"
                onfocus="this.style.borderColor='var(--ink)';this.style.boxShadow='0 0 0 3px rgba(15,15,15,0.06)'"
                onblur="this.style.borderColor='var(--surface-3)';this.style.boxShadow='none'"></textarea>
            </div>

            <div>
              <button type="submit" id="submitBtn" class="btn btn-dark" style="width:100%;justify-content:center;padding:0.8rem">
                <span id="btnText">Kirim pesan</span>
                <span id="btnArrow">&rarr;</span>
              </button>
            </div>

            <div id="formMsg" style="display:none;font-size:13.5px;padding:0.9rem 1rem;border-radius:var(--radius)"></div>
          </form>
        </div>

        <!-- Sidebar -->
        <div style="display:flex;flex-direction:column;gap:1rem" class="reveal">
          <div style="background:var(--ink);border-radius:var(--radius-lg);padding:1.75rem">
            <p style="font-size:12px;font-weight:600;color:rgba(255,255,255,0.5);margin-bottom:1rem;text-transform:uppercase;letter-spacing:0.08em;font-family:'Geist Mono',monospace">Kontak langsung</p>
            <a href="https://wa.me/622127884491" style="display:flex;align-items:center;gap:0.75rem;background:rgba(255,255,255,0.08);border-radius:var(--radius);padding:0.9rem 1rem;text-decoration:none;margin-bottom:0.5rem;transition:background 0.15s" onmouseover="this.style.background='rgba(255,255,255,0.14)'" onmouseout="this.style.background='rgba(255,255,255,0.08)'">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 1.5a6 6 0 0 0-5.19 9.02L1.5 13.5l3.07-.8A6 6 0 1 0 7.5 1.5zm0 10.8a4.8 4.8 0 0 1-2.45-.67l-.18-.1-1.82.48.49-1.78-.12-.19A4.8 4.8 0 1 1 7.5 12.3z" fill="rgba(255,255,255,0.6)"/></svg>
              <div>
                <p style="font-size:13px;font-weight:600;color:#fafafa">WhatsApp</p>
                <p style="font-size:12px;color:rgba(255,255,255,0.4)">${company.phone}</p>
              </div>
            </a>
            <a href="mailto:${company.email}" style="display:flex;align-items:center;gap:0.75rem;background:rgba(255,255,255,0.08);border-radius:var(--radius);padding:0.9rem 1rem;text-decoration:none;transition:background 0.15s" onmouseover="this.style.background='rgba(255,255,255,0.14)'" onmouseout="this.style.background='rgba(255,255,255,0.08)'">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M1.5 3.5h12v8a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-8zm0 0 6 5 6-5" stroke="rgba(255,255,255,0.6)" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <div>
                <p style="font-size:13px;font-weight:600;color:#fafafa">Email</p>
                <p style="font-size:12px;color:rgba(255,255,255,0.4)">${company.email}</p>
              </div>
            </a>
          </div>

          <div style="background:var(--surface-2);border:1px solid var(--surface-3);border-radius:var(--radius-lg);padding:1.5rem">
            <p style="font-size:12px;font-weight:600;color:var(--ink-3);margin-bottom:1rem;text-transform:uppercase;letter-spacing:0.08em;font-family:'Geist Mono',monospace">Waktu respons</p>
            <div style="display:flex;flex-direction:column;gap:0.6rem">
              ${[
  ["Form ini", "2-4 jam"],
  ["WhatsApp", "< 1 jam"],
  ["Email", "Hari yang sama"],
  ["Darurat produksi", "< 30 menit"]
].map(([ch, t]) => `
                <div style="display:flex;align-items:center;justify-content:space-between">
                  <span style="font-size:12.5px;color:var(--ink-2)">${ch}</span>
                  <span style="font-size:12px;font-weight:600;color:var(--ink);font-family:'Geist Mono',monospace">${t}</span>
                </div>
              `).join("")}
            </div>
          </div>

          <div style="background:#fff;border:1px solid var(--surface-3);border-radius:var(--radius-lg);padding:1.5rem">
            <p style="font-size:12px;font-weight:600;color:var(--ink-3);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.08em;font-family:'Geist Mono',monospace">Kantor</p>
            <p style="font-size:13px;color:var(--ink-2);line-height:1.65;margin-bottom:0.5rem">${company.address}</p>
            <p style="font-size:12px;color:var(--ink-3)">Sen-Jum, 09.00-18.00 WIB</p>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section style="padding:5rem 0;background:var(--surface);border-top:1px solid var(--surface-3)">
    <div class="container-sm">
      <h2 class="reveal" style="font-size:1.5rem;margin-bottom:2rem">Pertanyaan yang sering masuk</h2>
      <div style="display:flex;flex-direction:column;gap:0" class="reveal">
        ${faqItems.map(([q, a], i) => `
          <div style="border-bottom:1px solid var(--surface-3)">
            <button onclick="toggleFaq(this)" style="width:100%;display:flex;align-items:center;justify-content:space-between;padding:1.1rem 0;background:none;border:none;cursor:pointer;text-align:left;gap:1rem">
              <span style="font-size:14px;font-weight:600;color:var(--ink)">${q}</span>
              <svg class="faq-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" style="flex-shrink:0;transition:transform 0.2s"><path d="M4 6l4 4 4-4" stroke="var(--ink-3)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div class="faq-body" style="display:none;padding-bottom:1.1rem">
              <p style="font-size:13.5px;color:var(--ink-3);line-height:1.7">${a}</p>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  </section>

  <script>
    function toggleFaq(btn) {
      const body = btn.nextElementSibling;
      const icon = btn.querySelector('.faq-icon');
      const open = body.style.display === 'block';
      document.querySelectorAll('.faq-body').forEach(b => b.style.display = 'none');
      document.querySelectorAll('.faq-icon').forEach(ic => ic.style.transform = '');
      if (!open) {
        body.style.display = 'block';
        icon.style.transform = 'rotate(180deg)';
      }
    }

    const form = document.getElementById('contactForm');
    const btnText = document.getElementById('btnText');
    const btnArrow = document.getElementById('btnArrow');
    const submitBtn = document.getElementById('submitBtn');
    const formMsg = document.getElementById('formMsg');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      btnText.textContent = 'Mengirim...';
      btnArrow.textContent = '';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.6';
      setTimeout(() => {
        formMsg.style.display = 'block';
        formMsg.style.background = 'var(--accent-bg)';
        formMsg.style.border = '1px solid rgba(22,163,74,0.2)';
        formMsg.style.color = 'var(--accent)';
        formMsg.innerHTML = '<strong>Pesan terkirim.</strong> Kami akan balas dalam 2-4 jam di hari kerja.';
        form.reset();
        btnText.textContent = 'Kirim pesan';
        btnArrow.innerHTML = '&rarr;';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      }, 1400);
    });
  </script>

  <style>
    @media (max-width: 768px) {
      div[style*="grid-template-columns:1fr 380px"] { grid-template-columns: 1fr !important; }
      div[style*="grid-template-columns:1fr 1fr"][style*="gap:1rem"] { grid-template-columns: 1fr !important; }
      div[style*="grid-template-columns:repeat(3,1fr)"][style*="gap:0.4rem"] { grid-template-columns: 1fr 1fr !important; }
    }
  </style>
`;
var contactPage = () => layout("Kontak", content5, "contact");

// src/router.ts
var app = new Hono2();
app.get("/", (c) => c.html(homePage()));
app.get("/services", (c) => c.html(servicesPage()));
app.get("/portfolio", (c) => c.html(portfolioPage()));
app.get("/about", (c) => c.html(aboutPage()));
app.get("/contact", (c) => c.html(contactPage()));
app.post("/api/contact", async (c) => {
  const body = await c.req.json();
  console.log("\u{1F4EC} New contact form submission:", body);
  return c.json({ success: true, message: "Pesan berhasil diterima!" });
});
app.notFound(
  (c) => c.html(
    `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>404 \u2014 Halaman Tidak Ditemukan</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet"/>
  <style>* { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-gray-50 flex items-center justify-center min-h-screen text-center px-6">
  <div>
    <div class="text-8xl mb-6">\u{1F50D}</div>
    <h1 class="text-6xl font-extrabold text-gray-900 mb-4">404</h1>
    <p class="text-xl text-gray-500 mb-8">Halaman yang Anda cari tidak ditemukan.</p>
    <a href="/" class="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-8 py-3.5 rounded-xl font-bold inline-block hover:opacity-90 transition-opacity">
      \u2190 Kembali ke Beranda
    </a>
  </div>
</body>
</html>`,
    404
  )
);
var router_default = app;

// api/index.ts
module.exports = createAdaptorServer(router_default);
