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
var mergePath = (base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
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
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  };
  /**
   * Sets the layout for the response.
   *
   * @param layout - The layout to set.
   * @returns The layout function.
   */
  setLayout = (layout) => this.#layout = layout;
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
  fetch = (request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
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

// node_modules/hono/dist/utils/color.js
function getColorEnabled() {
  const { process: process2, Deno } = globalThis;
  const isNoColor = typeof Deno?.noColor === "boolean" ? Deno.noColor : process2 !== void 0 ? (
    // eslint-disable-next-line no-unsafe-optional-chaining
    "NO_COLOR" in process2?.env
  ) : false;
  return !isNoColor;
}
async function getColorEnabledAsync() {
  const { navigator } = globalThis;
  const cfWorkers = "cloudflare:workers";
  const isNoColor = navigator !== void 0 && navigator.userAgent === "Cloudflare-Workers" ? await (async () => {
    try {
      return "NO_COLOR" in ((await import(cfWorkers)).env ?? {});
    } catch {
      return false;
    }
  })() : !getColorEnabled();
  return !isNoColor;
}

// node_modules/hono/dist/middleware/logger/index.js
var humanize = (times) => {
  const [delimiter, separator] = [",", "."];
  const orderTimes = times.map((v) => v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + delimiter));
  return orderTimes.join(separator);
};
var time = (start) => {
  const delta = Date.now() - start;
  return humanize([delta < 1e3 ? delta + "ms" : Math.round(delta / 1e3) + "s"]);
};
var colorStatus = async (status) => {
  const colorEnabled = await getColorEnabledAsync();
  if (colorEnabled) {
    switch (status / 100 | 0) {
      case 5:
        return `\x1B[31m${status}\x1B[0m`;
      case 4:
        return `\x1B[33m${status}\x1B[0m`;
      case 3:
        return `\x1B[36m${status}\x1B[0m`;
      case 2:
        return `\x1B[32m${status}\x1B[0m`;
    }
  }
  return `${status}`;
};
async function log(fn, prefix, method, path, status = 0, elapsed) {
  const out = prefix === "<--" ? `${prefix} ${method} ${path}` : `${prefix} ${method} ${path} ${await colorStatus(status)} ${elapsed}`;
  fn(out);
}
var logger = (fn = console.log) => {
  return async function logger2(c, next) {
    const { method, url } = c.req;
    const path = url.slice(url.indexOf("/", 8));
    await log(fn, "<--", method, path);
    const start = Date.now();
    await next();
    await log(fn, "-->", method, path, c.res.status, time(start));
  };
};

// node_modules/hono/dist/middleware/secure-headers/secure-headers.js
var HEADERS_MAP = {
  crossOriginEmbedderPolicy: ["Cross-Origin-Embedder-Policy", "require-corp"],
  crossOriginResourcePolicy: ["Cross-Origin-Resource-Policy", "same-origin"],
  crossOriginOpenerPolicy: ["Cross-Origin-Opener-Policy", "same-origin"],
  originAgentCluster: ["Origin-Agent-Cluster", "?1"],
  referrerPolicy: ["Referrer-Policy", "no-referrer"],
  strictTransportSecurity: ["Strict-Transport-Security", "max-age=15552000; includeSubDomains"],
  xContentTypeOptions: ["X-Content-Type-Options", "nosniff"],
  xDnsPrefetchControl: ["X-DNS-Prefetch-Control", "off"],
  xDownloadOptions: ["X-Download-Options", "noopen"],
  xFrameOptions: ["X-Frame-Options", "SAMEORIGIN"],
  xPermittedCrossDomainPolicies: ["X-Permitted-Cross-Domain-Policies", "none"],
  xXssProtection: ["X-XSS-Protection", "0"]
};
var DEFAULT_OPTIONS = {
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: true,
  crossOriginOpenerPolicy: true,
  originAgentCluster: true,
  referrerPolicy: true,
  strictTransportSecurity: true,
  xContentTypeOptions: true,
  xDnsPrefetchControl: true,
  xDownloadOptions: true,
  xFrameOptions: true,
  xPermittedCrossDomainPolicies: true,
  xXssProtection: true,
  removePoweredBy: true,
  permissionsPolicy: {}
};
var secureHeaders = (customOptions) => {
  const options = { ...DEFAULT_OPTIONS, ...customOptions };
  const headersToSet = getFilteredHeaders(options);
  const callbacks = [];
  if (options.contentSecurityPolicy) {
    const [callback, value] = getCSPDirectives(
      options.contentSecurityPolicy,
      "Content-Security-Policy"
    );
    if (callback) {
      callbacks.push(callback);
    }
    headersToSet.push(["Content-Security-Policy", value]);
  }
  if (options.contentSecurityPolicyReportOnly) {
    const [callback, value] = getCSPDirectives(
      options.contentSecurityPolicyReportOnly,
      "Content-Security-Policy-Report-Only"
    );
    if (callback) {
      callbacks.push(callback);
    }
    headersToSet.push(["Content-Security-Policy-Report-Only", value]);
  }
  if (options.permissionsPolicy && Object.keys(options.permissionsPolicy).length > 0) {
    headersToSet.push([
      "Permissions-Policy",
      getPermissionsPolicyDirectives(options.permissionsPolicy)
    ]);
  }
  if (options.reportingEndpoints) {
    headersToSet.push(["Reporting-Endpoints", getReportingEndpoints(options.reportingEndpoints)]);
  }
  if (options.reportTo) {
    headersToSet.push(["Report-To", getReportToOptions(options.reportTo)]);
  }
  return async function secureHeaders2(ctx, next) {
    const headersToSetForReq = callbacks.length === 0 ? headersToSet : callbacks.reduce((acc, cb) => cb(ctx, acc), headersToSet);
    await next();
    setHeaders(ctx, headersToSetForReq);
    if (options?.removePoweredBy) {
      ctx.res.headers.delete("X-Powered-By");
    }
  };
};
function getFilteredHeaders(options) {
  return Object.entries(HEADERS_MAP).filter(([key]) => options[key]).map(([key, defaultValue]) => {
    const overrideValue = options[key];
    return typeof overrideValue === "string" ? [defaultValue[0], overrideValue] : defaultValue;
  });
}
function getCSPDirectives(contentSecurityPolicy, headerName) {
  const callbacks = [];
  const resultValues = [];
  for (const [directive, value] of Object.entries(contentSecurityPolicy)) {
    const valueArray = Array.isArray(value) ? value : [value];
    valueArray.forEach((value2, i) => {
      if (typeof value2 === "function") {
        const index = i * 2 + 2 + resultValues.length;
        callbacks.push((ctx, values) => {
          values[index] = value2(ctx, directive);
        });
      }
    });
    resultValues.push(
      directive.replace(
        /[A-Z]+(?![a-z])|[A-Z]/g,
        (match2, offset) => offset ? "-" + match2.toLowerCase() : match2.toLowerCase()
      ),
      ...valueArray.flatMap((value2) => [" ", value2]),
      "; "
    );
  }
  resultValues.pop();
  return callbacks.length === 0 ? [void 0, resultValues.join("")] : [
    (ctx, headersToSet) => headersToSet.map((values) => {
      if (values[0] === headerName) {
        const clone = values[1].slice();
        callbacks.forEach((cb) => {
          cb(ctx, clone);
        });
        return [values[0], clone.join("")];
      } else {
        return values;
      }
    }),
    resultValues
  ];
}
function getPermissionsPolicyDirectives(policy) {
  return Object.entries(policy).map(([directive, value]) => {
    const kebabDirective = camelToKebab(directive);
    if (typeof value === "boolean") {
      return `${kebabDirective}=${value ? "*" : "()"}`;
    }
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return `${kebabDirective}=()`;
      }
      if (value.length === 1 && value[0] === "*") {
        return `${kebabDirective}=*`;
      }
      if (value.length === 1 && value[0] === "none") {
        return `${kebabDirective}=()`;
      }
      const allowlist = value.map((item) => ["self", "src"].includes(item) ? item : `"${item}"`);
      return `${kebabDirective}=(${allowlist.join(" ")})`;
    }
    return "";
  }).filter(Boolean).join(", ");
}
function camelToKebab(str) {
  return str.replace(/([a-z\d])([A-Z])/g, "$1-$2").toLowerCase();
}
function getReportingEndpoints(reportingEndpoints = []) {
  return reportingEndpoints.map((endpoint) => `${endpoint.name}="${endpoint.url}"`).join(", ");
}
function getReportToOptions(reportTo = []) {
  return reportTo.map((option) => JSON.stringify(option)).join(", ");
}
function setHeaders(ctx, headersToSet) {
  headersToSet.forEach(([header, value]) => {
    ctx.res.headers.set(header, value);
  });
}

// node_modules/hono/dist/middleware/timing/timing.js
var getTime = () => {
  try {
    return performance.now();
  } catch {
  }
  return Date.now();
};
var timing = (config) => {
  const options = {
    total: true,
    enabled: true,
    totalDescription: "Total Response Time",
    autoEnd: true,
    crossOrigin: false,
    ...config
  };
  return async function timing2(c, next) {
    const headers = [];
    const timers = /* @__PURE__ */ new Map();
    if (c.get("metric")) {
      return await next();
    }
    c.set("metric", { headers, timers });
    if (options.total) {
      startTime(c, "total", options.totalDescription);
    }
    await next();
    if (options.total) {
      endTime(c, "total");
    }
    if (options.autoEnd) {
      timers.forEach((_, key) => {
        endTime(c, key);
      });
    }
    const enabled = typeof options.enabled === "function" ? options.enabled(c) : options.enabled;
    if (enabled) {
      c.res.headers.append("Server-Timing", headers.join(","));
      const crossOrigin = typeof options.crossOrigin === "function" ? options.crossOrigin(c) : options.crossOrigin;
      if (crossOrigin) {
        c.res.headers.append(
          "Timing-Allow-Origin",
          typeof crossOrigin === "string" ? crossOrigin : "*"
        );
      }
    }
  };
};
var setMetric = (c, name, valueDescription, description, precision) => {
  const metrics = c.get("metric");
  if (!metrics) {
    console.warn("Metrics not initialized! Please add the `timing()` middleware to this route!");
    return;
  }
  if (typeof valueDescription === "number") {
    const dur = valueDescription.toFixed(precision || 1);
    const metric = description ? `${name};dur=${dur};desc="${description}"` : `${name};dur=${dur}`;
    metrics.headers.push(metric);
  } else {
    const metric = valueDescription ? `${name};desc="${valueDescription}"` : `${name}`;
    metrics.headers.push(metric);
  }
};
var startTime = (c, name, description) => {
  const metrics = c.get("metric");
  if (!metrics) {
    console.warn("Metrics not initialized! Please add the `timing()` middleware to this route!");
    return;
  }
  metrics.timers.set(name, { description, start: getTime() });
};
var endTime = (c, name, precision) => {
  const metrics = c.get("metric");
  if (!metrics) {
    console.warn("Metrics not initialized! Please add the `timing()` middleware to this route!");
    return;
  }
  const timer = metrics.timers.get(name);
  if (!timer) {
    console.warn(`Timer "${name}" does not exist!`);
    return;
  }
  const { description, start } = timer;
  const duration = getTime() - start;
  setMetric(c, name, duration, description, precision);
  metrics.timers.delete(name);
};

// src/i18n/id.ts
var id = {
  locale: "id",
  nav: {
    home: "Beranda",
    services: "Layanan",
    portfolio: "Portfolio",
    about: "Tentang",
    contact: "Kontak",
    cta: "Hubungi Kami",
    switchLang: "EN"
  },
  footer: {
    pagesHeading: "Halaman",
    contactHeading: "Kontak",
    builtWith: "Dibangun dengan \u2600\uFE0F Bun + Hono",
    rights: "Hak cipta dilindungi."
  },
  ui: {
    learnMore: "Pelajari Lebih \u2192",
    viewAll: "Lihat Semua \u2192",
    sendMessage: "Kirim Pesan \u2726",
    sending: "Mengirim...",
    backHome: "Kembali ke Beranda",
    year: "Tahun",
    featuredProject: "\u2605 Proyek Unggulan",
    otherProjects: "Proyek Lainnya",
    readMore: "Baca Selengkapnya"
  },
  home: {
    heroBadge: "\u2600\uFE0F {founded} \u2014 Hadir untuk Indonesia",
    heroHeadline1: "Digital Solutions",
    heroHeadline2: "Kelas Dunia",
    heroDescription: "{description}",
    heroCtaPrimary: "Lihat Layanan \u2726",
    heroCtaSecondary: "Lihat Portfolio \u2192",
    servicesHeading: "Apa yang Kami Lakukan",
    servicesSubheading: "Dari product engineering sampai cloud infrastructure \u2014 kami cover semua kebutuhan digital Anda.",
    servicesCtaLabel: "Semua Layanan \u2192",
    whyHeading: "Kenapa Pilih Simptecho?",
    whySubheading: "Kami bukan body shop. Kami adalah tim engineering yang peduli dengan outcome bisnis Anda \u2014 bukan hanya output teknis.",
    whyCtaLabel: "Tentang Kami \u2192",
    whyPoints: [
      { icon: "\u26A1", title: "Delivery Cepat", body: "Metodologi Agile ketat. Sprint dua minggu. Demo tiap akhir sprint \u2014 tidak ada surprise di akhir." },
      { icon: "\u{1F512}", title: "Security First", body: "Secure SDLC dari hari pertama. Code review, SAST, dependency audit \u2014 bukan afterthought." },
      { icon: "\u{1F4C8}", title: "Scalable by Design", body: "Arsitektur dirancang untuk tumbuh. Dari 100 user ke 10 juta user tanpa rearchitecture besar." },
      { icon: "\u{1F91D}", title: "Partner, Bukan Vendor", body: "Kami duduk di sisi Anda \u2014 ikut memikirkan bisnis, bukan hanya mengerjakan tiket." }
    ],
    testimonialsHeading: "Kata Klien Kami",
    testimonialsSubheading: "Hasil bicara lebih keras dari janji. Ini yang mereka katakan.",
    ctaHeading: "Siap Memulai Proyek?",
    ctaSubheading: "Ceritakan tantangan Anda \u2014 kami siap duduk bareng dan cari solusinya.",
    ctaPrimary: "Hubungi Kami \u2726",
    ctaSecondary: "Lihat Portfolio",
    stats: [
      { label: "Proyek Selesai" },
      { label: "Klien Puas" },
      { label: "Profesional" },
      { label: "Tahun Pengalaman" }
    ]
  },
  services: {
    badge: "\u{1F6E0} Layanan Kami",
    heroHeadline1: "Solusi Lengkap",
    heroHeadline2: "untuk Tim Anda",
    heroDescription: "Dari ideasi produk hingga infrastruktur skala enterprise \u2014 satu partner untuk semua kebutuhan digital Anda.",
    processHeading: "Cara Kami Bekerja",
    processSubheading: "Proses yang terstruktur, komunikasi yang transparan.",
    steps: [
      { num: "01", title: "Discovery", body: "Workshop intensif untuk memahami bisnis, pain point, dan target outcome. Kita align sebelum satu baris kode pun ditulis." },
      { num: "02", title: "Architecture", body: "Technical design, ADR, dan pemilihan stack yang tepat. Dokumen arsitektur jadi living document sepanjang proyek." },
      { num: "03", title: "Build", body: "Sprint dua minggu. Demo tiap akhir sprint. Continuous integration dari hari pertama \u2014 tidak ada big bang release." },
      { num: "04", title: "Deploy & Scale", body: "Zero-downtime deployment, monitoring end-to-end, dan post-launch support untuk pastikan sistem stabil di production." }
    ],
    techHeading: "Tech Stack",
    techSubheading: "Kami pilih tools yang tepat untuk masalah yang tepat \u2014 bukan yang lagi hype.",
    ctaHeading: "Butuh Konsultasi Teknis?",
    ctaSubheading: "Gratis 60 menit \u2014 kami review arsitektur atau stack Anda dan kasih feedback jujur.",
    ctaPrimary: "Jadwalkan Konsultasi",
    ctaSecondary: "Lihat Portfolio"
  },
  portfolio: {
    badge: "\u{1F3C6} Portfolio",
    heroHeadline1: "Proyek yang",
    heroHeadline2: "Kami Banggakan",
    heroDescription: "Setiap proyek adalah cerita tentang tantangan nyata dan solusi yang benar-benar bekerja.",
    ctaHeading: "Proyek Anda Berikutnya?",
    ctaSubheading: "Mari jadikan proyek Anda sebagai salah satu success story yang kami banggakan.",
    ctaPrimary: "Diskusi Sekarang",
    ctaSecondary: "Lihat Layanan",
    stats: [
      { label: "Proyek Delivered" },
      { label: "Klien Puas" },
      { label: "Uptime SLA" },
      { label: "Rating Klien" }
    ]
  },
  about: {
    badge: "\u{1F3E2} Tentang Kami",
    heroHeadline1: "Kami Percaya",
    heroHeadline2: "Teknologi Mengubah Bisnis",
    heroDescription: "Sejak {founded}, kami membantu ratusan perusahaan Indonesia tumbuh lebih cepat lewat teknologi yang tepat.",
    storyHeading: "Asal Mula Simptecho",
    storyParagraphs: [
      "Didirikan tahun {founded} oleh dua engineer yang frustrasi melihat banyak proyek teknologi gagal bukan karena masalah teknis, melainkan karena komunikasi yang buruk antara tim bisnis dan tim engineering.",
      "Kami membangun Simptecho dengan satu prinsip sederhana: jadi partner, bukan vendor. Ini berarti kami ikut memikirkan bisnis Anda, bukan hanya mengerjakan requirement yang datang.",
      "Hari ini kami adalah tim {employees} profesional yang telah menyelesaikan {projects} proyek untuk {clients} klien di berbagai industri."
    ],
    timeline: [
      { year: "2015", event: "Simptecho didirikan. Tim pertama 5 orang, klien pertama 3 startup." },
      { year: "2017", event: "Ekspansi ke enterprise. Proyek pertama dengan bank nasional." },
      { year: "2019", event: "Buka divisi Cloud & DevOps. Tim tumbuh ke 50 orang." },
      { year: "2021", event: "Luncurkan AI Lab. Mulai bangun produk data-driven untuk klien." },
      { year: "2023", event: "150+ tim, 500+ proyek, hadir di 5 kota Indonesia." }
    ],
    teamHeading: "Orang-Orang di Baliknya",
    teamSubheading: "Tim kecil yang dense \u2014 sedikit ego, banyak output.",
    valuesHeading: "Nilai-Nilai Kami",
    values: [
      { icon: "\u{1F3AF}", title: "Outcome over Output", body: "Kami tidak hitung story points. Kami hitung dampak nyata ke bisnis Anda." },
      { icon: "\u{1F50D}", title: "Radical Transparency", body: "Kabar buruk disampaikan cepat. Tidak ada happy path reporting." },
      { icon: "\u{1F331}", title: "Kaizen", body: "Setiap sprint lebih baik dari yang sebelumnya. Continuous improvement bukan slogan." },
      { icon: "\u{1F91D}", title: "Respect & Inclusion", body: "Tim yang beragam menghasilkan solusi yang lebih kaya. Selalu." }
    ],
    ctaHeading: "Bergabung dengan Kami?",
    ctaSubheading: "Kami selalu mencari engineer, designer, dan PM yang passionate. Tidak ada posisi kosong? Kirim saja CV Anda.",
    ctaPrimary: "Lihat Karir",
    ctaSecondary: "Hubungi Kami",
    stats: [
      { label: "Tahun Berdiri" },
      { label: "Profesional" },
      { label: "Proyek" },
      { label: "Klien" }
    ]
  },
  contact: {
    badge: "\u{1F4EC} Kontak",
    heroHeadline1: "Ayo Ngobrol",
    heroHeadline2: "Tentang Proyek Anda",
    heroDescription: "Respon dalam 1 hari kerja. Tidak ada pertanyaan yang terlalu kecil atau terlalu besar.",
    formHeading: "Kirim Pesan",
    formSubheading: "Semua field wajib diisi. Kami balas dalam 1\xD724 jam kerja.",
    fields: {
      name: "Nama Lengkap",
      namePlaceholder: "Budi Santoso",
      email: "Email",
      emailPlaceholder: "budi@perusahaan.com",
      company: "Nama Perusahaan",
      companyPlaceholder: "PT Maju Bersama",
      service: "Kebutuhan Utama",
      servicePlaceholder: "Pilih layanan...",
      serviceOptions: [
        "Product Engineering",
        "Cloud & DevOps",
        "Mobile Development",
        "AI & Data Engineering",
        "Security & Compliance",
        "Analytics & BI",
        "Lainnya"
      ],
      message: "Ceritakan Proyeknya",
      messagePlaceholder: "Kami sedang membangun platform X dan butuh bantuan di bagian Y..."
    },
    submitLabel: "Kirim Pesan \u2726",
    successMessage: "\u2705 Pesan berhasil dikirim! Kami akan membalas dalam 1\xD724 jam kerja.",
    errorMessage: "\u274C Terjadi kesalahan. Silakan coba lagi atau hubungi kami langsung via email.",
    infoAddress: "Alamat",
    infoEmail: "Email",
    infoPhone: "Telepon",
    socialHeading: "Temukan Kami"
  },
  notFound: {
    code: "404",
    message: "Halaman yang kamu cari tidak ada di Springfield ini.",
    cta: "Kembali ke Beranda"
  },
  seo: {
    homeTitle: "Beranda",
    homeDescription: "{description}",
    servicesTitle: "Layanan",
    servicesDescription: "Product engineering, cloud/DevOps, mobile, AI, security, dan analytics \u2014 solusi lengkap untuk startup hingga enterprise.",
    portfolioTitle: "Portfolio",
    portfolioDescription: "Portfolio proyek Simptecho \u2014 fintech, e-commerce, edtech, logistik, dan lebih banyak lagi.",
    aboutTitle: "Tentang Kami",
    aboutDescription: "{name} \u2014 {tagline}. Didirikan {founded}, {employees} profesional, {projects} proyek selesai.",
    contactTitle: "Kontak",
    contactDescription: "Hubungi {name} \u2014 kami siap mendiskusikan proyek digital Anda.",
    faqTitle: "FAQ",
    faqDescription: "Pertanyaan yang sering ditanyakan ke Simptecho \u2014 dijawab jujur."
  },
  faq: {
    badge: "\u{1F37A} Tanya Moe",
    heroHeadline1: "Pertanyaan?",
    heroHeadline2: "Moe Siap Jawab",
    heroDescription: "Semua yang ingin Anda tahu tentang Simptecho \u2014 dijawab langsung dari balik bar.",
    items: [
      { q: "Berapa lama biasanya satu proyek selesai?", a: "Tergantung scopenya. MVP sederhana bisa 6\u20138 minggu. Platform enterprise bisa 6\u201312 bulan. Yang pasti, kami tidak akan kasih estimasi sebelum benar-benar paham scope-nya." },
      { q: "Apakah Simptecho juga handle maintenance setelah launch?", a: "Ya. Kami punya paket retainer bulanan untuk maintenance, monitoring, dan pengembangan lanjutan. Banyak klien kami yang sudah bareng kami 3+ tahun." },
      { q: "Tech stack apa yang paling sering dipakai?", a: "Backend: Go dan Node.js. Frontend: React/Next.js. Mobile: React Native. Cloud: AWS dan GCP. Tapi kami pilih stack berdasarkan kebutuhan proyek, bukan kebiasaan." },
      { q: "Bisa bantu project yang sudah jalan tapi butuh refactor?", a: "Bisa dan sering kami lakukan. Kami biasanya mulai dengan audit teknis dulu untuk pahami kondisi codebase, baru kasih roadmap refactor yang realistis." },
      { q: "Bagaimana model engagement Simptecho?", a: "Ada dua: project-based (scope tetap, timeline tetap) atau dedicated team (tim kami embed ke tim Anda). Kami rekomendasikan dedicated team untuk proyek yang evolve cepat." },
      { q: "Apakah ada minimum budget proyek?", a: "Untuk project-based, minimum engagement kami sekitar Rp 150 juta. Untuk konsultasi atau audit teknis, ada paket tersendiri yang lebih terjangkau." },
      { q: "Simptecho pernah handle proyek fintech/healthcare yang butuh compliance ketat?", a: "Ya. Kami punya pengalaman dengan PCI-DSS, POJK fintech, dan standar keamanan data kesehatan. Security dan compliance bukan afterthought di sini." },
      { q: "Bagaimana cara kerja sprint dan reporting-nya?", a: "Sprint dua minggu. Di akhir setiap sprint ada demo langsung ke stakeholder. Weekly async update via Slack/Notion. Tidak ada laporan PowerPoint yang panjang dan membosankan." }
    ]
  },
  data: {
    services: [
      { title: "Product Engineering", description: "Kami rancang dan bangun produk digital dari nol \u2014 arsitektur solid, UX intuitif, dan delivery tepat waktu.", detail: "Full-cycle product development" },
      { title: "Cloud & DevOps", description: "Infrastructure as code, CI/CD pipeline, Kubernetes orchestration, dan observability end-to-end.", detail: "AWS \xB7 GCP \xB7 Azure \xB7 K8s" },
      { title: "Mobile Development", description: "Aplikasi native iOS & Android, serta cross-platform React Native untuk reach yang lebih luas.", detail: "iOS \xB7 Android \xB7 React Native" },
      { title: "AI & Data Engineering", description: "Pipeline data real-time, model ML production-ready, dan integrasi LLM untuk produk cerdas.", detail: "ML \xB7 LLM \xB7 Streaming Data" },
      { title: "Security & Compliance", description: "Penetration testing, secure SDLC, dan compliance audit untuk produk yang aman dari ground up.", detail: "PenTest \xB7 OWASP \xB7 ISO 27001" },
      { title: "Analytics & BI", description: "Dashboard real-time, data warehouse modern, dan insight actionable dari data bisnis Anda.", detail: "dbt \xB7 Redshift \xB7 Metabase" }
    ],
    team: [
      { bio: "10+ tahun di product engineering. Ex-Gojek, ex-Tokopedia. Passionate soal scalable systems.", funFact: "Bisa debug production issue sambil makan soto." },
      { bio: "Distributed systems expert. Speaker di berbagai konferensi teknologi Asia Tenggara.", funFact: "Koleksi mechanical keyboard lebih dari 20 unit." },
      { bio: "Platform engineer dengan spesialisasi Kubernetes dan observability. Open source contributor.", funFact: "Pernah deploy ke production dari atas gunung." },
      { bio: "Design systems practitioner. Percaya bahwa UX yang baik adalah invisible UX.", funFact: "Mendesain sambil dengerin jazz \u2014 selalu jazz." }
    ],
    testimonials: [
      { text: "Simptecho transform cara tim kami bekerja. Delivery 3x lebih cepat, bug rate turun drastis. Mereka bukan vendor \u2014 mereka partner." },
      { text: "Migration ke microservices selesai dalam 6 bulan tanpa downtime. Saya tidak pernah lihat eksekusi sekelas ini sebelumnya." },
      { text: "Platform kami handle 500k concurrent users saat launch \u2014 sesuatu yang kami kira tidak mungkin dalam timeline itu." }
    ],
    portfolios: [
      { description: "Platform pembayaran digital dengan 2M+ pengguna aktif. Real-time transaction processing, fraud detection ML, dan open banking integration.", result: "2M+ pengguna aktif" },
      { description: "Microservices re-architecture untuk platform retail dengan 50+ brand. Zero-downtime migration dari monolith legacy.", result: "Zero-downtime migration" },
      { description: "Learning management system untuk 500k+ pelajar. Live streaming, adaptive quiz engine, dan sertifikasi blockchain.", result: "500k+ pelajar aktif" },
      { description: "Fleet management dan real-time cargo tracking untuk 1000+ kendaraan. IoT integration dengan prediksi rute AI.", result: "1000+ armada terpantau" }
    ]
  }
};

// src/i18n/en.ts
var en = {
  locale: "en",
  nav: {
    home: "Home",
    services: "Services",
    portfolio: "Portfolio",
    about: "About",
    contact: "Contact",
    cta: "Don't Have a Cow \u2014 Contact Us",
    switchLang: "ID"
  },
  footer: {
    pagesHeading: "Pages",
    contactHeading: "Contact",
    builtWith: "Mmm... Built with \u2600\uFE0F Bun + Hono",
    rights: "All rights reserved. Excellent."
  },
  ui: {
    learnMore: "Learn More \u2192",
    viewAll: "View All \u2192",
    sendMessage: "Send It! \u2726",
    sending: "Sending... D'oh, hold on...",
    backHome: "Back to Springfield",
    year: "Year",
    featuredProject: "\u2605 Featured Project",
    otherProjects: "More Projects",
    readMore: "Read More"
  },
  home: {
    heroBadge: "\u2600\uFE0F Since {founded} \u2014 Built for the Real World",
    heroHeadline1: "Digital Solutions",
    heroHeadline2: "That Actually Work",
    heroDescription: "{description}",
    heroCtaPrimary: "See Our Services \u2726",
    heroCtaSecondary: "View Portfolio \u2192",
    servicesHeading: "What We Do (And We're Cromulent at It)",
    servicesSubheading: "From product engineering to cloud infrastructure \u2014 one partner, every digital need. Woo-hoo!",
    servicesCtaLabel: "All Services \u2192",
    whyHeading: "Why Simptecho? (Excellent Question...)",
    whySubheading: "We're not just a body shop. We're the engineering team that actually gives a D'oh about your business outcome.",
    whyCtaLabel: "About Us \u2192",
    whyPoints: [
      { icon: "\u26A1", title: "Fast Delivery", body: "Two-week sprints. Demo every cycle. No big-bang surprises \u2014 just steady, cromulent progress." },
      { icon: "\u{1F512}", title: "Security First", body: "Secure SDLC from day one. Code review, SAST, dependency audits \u2014 not a last-minute afterthought. Sweet Jebus!" },
      { icon: "\u{1F4C8}", title: "Scales Like Crazy", body: "Architecture built to grow. From 100 to 10 million users without a painful re-architecture. Woo-hoo!" },
      { icon: "\u{1F91D}", title: "Partner, Not Just Vendor", body: "We sit on your side of the table \u2014 thinking about your business, not just closing tickets. Mmm... partnership." }
    ],
    testimonialsHeading: "Don't Take Our Word for It",
    testimonialsSubheading: "Results speak louder than promises. Here's what our clients say \u2014 and they're not just being neighborly.",
    ctaHeading: "Ready to Start? Don't Have a Cow!",
    ctaSubheading: "Tell us your challenge \u2014 we'll sit down, grab a donut, and figure it out together.",
    ctaPrimary: "Contact Us \u2726",
    ctaSecondary: "View Portfolio",
    stats: [
      { label: "Projects Shipped" },
      { label: "Happy Clients" },
      { label: "Professionals" },
      { label: "Years of Experience" }
    ]
  },
  services: {
    badge: "\u{1F6E0} Our Services",
    heroHeadline1: "Full-Stack Solutions",
    heroHeadline2: "For Your Team",
    heroDescription: "From product ideation to enterprise-grade infrastructure \u2014 one partner for every digital need. Woo-hoo!",
    processHeading: "How We Work (It's Surprisingly Cromulent)",
    processSubheading: "Structured process, transparent communication. No Homers allowed on ambiguity.",
    steps: [
      { num: "01", title: "Discovery", body: "Intensive workshops to understand your business, pain points, and target outcomes. We align before a single line of code is written. Mmm... clarity." },
      { num: "02", title: "Architecture", body: "Technical design, ADRs, and the right stack for the job. Architecture docs become living documents throughout the project." },
      { num: "03", title: "Build", body: "Two-week sprints. Demo every cycle. CI from day one \u2014 no big-bang release. Excellent." },
      { num: "04", title: "Deploy & Scale", body: "Zero-downtime deployment, end-to-end monitoring, and post-launch support to keep production stable. Woo-hoo!" }
    ],
    techHeading: "Tech Stack (Mmm... Technology...)",
    techSubheading: "We pick the right tool for the right problem \u2014 not whatever's trending on the internet this week.",
    ctaHeading: "Need a Technical Consultation?",
    ctaSubheading: "Free 60 minutes \u2014 we review your architecture or stack and give you brutally honest feedback. D'oh, it's free!",
    ctaPrimary: "Schedule Consultation",
    ctaSecondary: "View Portfolio"
  },
  portfolio: {
    badge: "\u{1F3C6} Portfolio",
    heroHeadline1: "Projects We're",
    heroHeadline2: "Genuinely Proud Of",
    heroDescription: "Every project is a story of real challenges and solutions that actually work. No participation trophies here.",
    ctaHeading: "Your Project Next? Don't Be a Square!",
    ctaSubheading: "Let's make your project the next success story we brag about at the water cooler.",
    ctaPrimary: "Let's Talk",
    ctaSecondary: "View Services",
    stats: [
      { label: "Projects Delivered" },
      { label: "Happy Clients" },
      { label: "Uptime SLA" },
      { label: "Client Rating" }
    ]
  },
  about: {
    badge: "\u{1F3E2} About Us",
    heroHeadline1: "We Believe",
    heroHeadline2: "Tech Embiggens Business",
    heroDescription: "Since {founded}, we've helped hundreds of companies grow faster through technology that actually does something. Woo-hoo!",
    storyHeading: "The Origin Story of Simptecho",
    storyParagraphs: [
      "Founded in {founded} by two engineers who were, frankly, fed up watching tech projects fail \u2014 not because of technical problems, but because of terrible communication between business and engineering teams. D'oh!",
      "We built Simptecho on one cromulent principle: be a partner, not a vendor. That means we think about your business, not just execute requirements that land in our inbox.",
      "Today we're a team of {employees} professionals who've completed {projects} projects for {clients} clients across practically every industry you can think of. Excellent."
    ],
    timeline: [
      { year: "2015", event: "Simptecho founded. First team of 5, first 3 startup clients. Woo-hoo!" },
      { year: "2017", event: "Expanded to enterprise. First project with a national bank. Excellent." },
      { year: "2019", event: "Launched Cloud & DevOps division. Team grew to 50. Mmm... growth." },
      { year: "2021", event: "Launched AI Lab. Started building data-driven products for clients." },
      { year: "2023", event: "150+ team, 500+ projects, present in 5 cities. Don't have a cow!" }
    ],
    teamHeading: "The People Behind the Magic",
    teamSubheading: "A small, dense team \u2014 low ego, high output. Ned Flanders would approve.",
    valuesHeading: "Our Values (Perfectly Cromulent Ones)",
    values: [
      { icon: "\u{1F3AF}", title: "Outcomes over Output", body: "We don't count story points. We count real business impact. Mmm... impact." },
      { icon: "\u{1F50D}", title: "Radical Transparency", body: "Bad news delivered fast. No happy-path-only reporting. Ever." },
      { icon: "\u{1F331}", title: "Kaizen", body: "Every sprint better than the last. Continuous improvement is not just a poster on the wall." },
      { icon: "\u{1F91D}", title: "Respect & Inclusion", body: "Diverse teams produce richer solutions. That's just science, man." }
    ],
    ctaHeading: "Join the Team? Ay Caramba!",
    ctaSubheading: "We're always looking for engineers, designers, and PMs who are passionate. No open roles? Send your CV anyway \u2014 we don't bite.",
    ctaPrimary: "View Careers",
    ctaSecondary: "Contact Us",
    stats: [
      { label: "Founded" },
      { label: "Professionals" },
      { label: "Projects" },
      { label: "Clients" }
    ]
  },
  contact: {
    badge: "\u{1F4EC} Contact",
    heroHeadline1: "Let's Talk",
    heroHeadline2: "About Your Project",
    heroDescription: "Response within 1 business day. No question is too small or too big. Mmm... questions.",
    formHeading: "Send a Message",
    formSubheading: "All fields required. We reply within 24 business hours. Don't have a cow.",
    fields: {
      name: "Full Name",
      namePlaceholder: "Homer Simpson",
      email: "Email",
      emailPlaceholder: "homer@springfield.com",
      company: "Company Name",
      companyPlaceholder: "Springfield Nuclear",
      service: "What Do You Need?",
      servicePlaceholder: "Pick a service...",
      serviceOptions: [
        "Product Engineering",
        "Cloud & DevOps",
        "Mobile Development",
        "AI & Data Engineering",
        "Security & Compliance",
        "Analytics & BI",
        "Something Else"
      ],
      message: "Tell Us About It",
      messagePlaceholder: "We're building platform X and need help with Y... don't be shy, Mmm..."
    },
    submitLabel: "Send It! \u2726",
    successMessage: "\u2705 Message sent! We'll get back to you within 1 business day. Woo-hoo!",
    errorMessage: "\u274C D'oh! Something went wrong. Try again or email us directly.",
    infoAddress: "Address",
    infoEmail: "Email",
    infoPhone: "Phone",
    socialHeading: "Find Us Out There"
  },
  notFound: {
    code: "404",
    message: "D'oh! This page doesn't exist in Springfield.",
    cta: "Back to Springfield"
  },
  seo: {
    homeTitle: "Home",
    homeDescription: "{description}",
    servicesTitle: "Services",
    servicesDescription: "Product engineering, cloud/DevOps, mobile, AI, security, and analytics \u2014 complete solutions for startups to enterprise.",
    portfolioTitle: "Portfolio",
    portfolioDescription: "Simptecho portfolio \u2014 fintech, e-commerce, edtech, logistics, and more. Excellent.",
    aboutTitle: "About Us",
    aboutDescription: "{name} \u2014 {tagline}. Founded {founded}, {employees} professionals, {projects} projects completed.",
    contactTitle: "Contact",
    contactDescription: "Contact {name} \u2014 we're ready to discuss your digital project. Don't have a cow!",
    faqTitle: "FAQ",
    faqDescription: "Everything you wanted to ask Simptecho \u2014 answered honestly from behind the bar."
  },
  faq: {
    badge: "\u{1F37A} Ask Moe",
    heroHeadline1: "Got Questions?",
    heroHeadline2: "Moe's Got Answers",
    heroDescription: "Everything you wanted to know about Simptecho \u2014 answered honestly from behind the bar. Mmm... answers.",
    items: [
      { q: "How long does a typical project take?", a: "Depends on the scope. A simple MVP? Six to eight weeks. An enterprise platform? Six to twelve months. We won't give you an estimate until we actually understand what you need. Excellent." },
      { q: "Do you handle maintenance after launch?", a: "Yep. We have monthly retainer packages for maintenance, monitoring, and ongoing development. Many of our clients have been with us for 3+ years. Woo-hoo!" },
      { q: "What's your go-to tech stack?", a: "Backend: Go and Node.js. Frontend: React/Next.js. Mobile: React Native. Cloud: AWS and GCP. But we pick the stack based on the project's needs, not just habit. Mmm... pragmatism." },
      { q: "Can you help with a project that's already running but needs refactoring?", a: "Absolutely \u2014 we do it all the time. We usually start with a technical audit to understand the codebase, then give you a realistic refactor roadmap. D'oh, why didn't they call us earlier?" },
      { q: "What engagement models do you offer?", a: "Two options: project-based (fixed scope, fixed timeline) or dedicated team (our team embeds into yours). We recommend dedicated team for fast-evolving products. Don't have a cow \u2014 both work great." },
      { q: "Is there a minimum project budget?", a: "For project-based work, our minimum engagement is around IDR 150 million. For consultation or technical audits, there's a separate, more accessible package." },
      { q: "Have you handled fintech or healthcare projects with strict compliance requirements?", a: "Yes. We have experience with PCI-DSS, Indonesian fintech regulations, and healthcare data security standards. Security and compliance are not afterthoughts here. Sweet Jebus!" },
      { q: "How do sprints and reporting work?", a: "Two-week sprints. End of every sprint: live demo to stakeholders. Weekly async updates via Slack/Notion. No death-by-PowerPoint around here. Excellent." }
    ]
  },
  data: {
    services: [
      { title: "Product Engineering", description: "We design and build digital products from scratch \u2014 solid architecture, intuitive UX, and on-time delivery. Woo-hoo!", detail: "Full-cycle product development" },
      { title: "Cloud & DevOps", description: "Infrastructure as code, CI/CD pipelines, Kubernetes orchestration, and end-to-end observability. Excellent.", detail: "AWS \xB7 GCP \xB7 Azure \xB7 K8s" },
      { title: "Mobile Development", description: "Native iOS & Android apps, plus cross-platform React Native for maximum reach. Mmm... mobile.", detail: "iOS \xB7 Android \xB7 React Native" },
      { title: "AI & Data Engineering", description: "Real-time data pipelines, production-ready ML models, and LLM integrations for genuinely smart products.", detail: "ML \xB7 LLM \xB7 Streaming Data" },
      { title: "Security & Compliance", description: "Penetration testing, secure SDLC, and compliance audits for products that are safe from the ground up. Sweet Jebus!", detail: "PenTest \xB7 OWASP \xB7 ISO 27001" },
      { title: "Analytics & BI", description: "Real-time dashboards, modern data warehouses, and actionable insights from your business data. Mmm... data.", detail: "dbt \xB7 Redshift \xB7 Metabase" }
    ],
    team: [
      { bio: "10+ years in product engineering. Ex-Gojek, ex-Tokopedia. Obsessed with scalable systems.", funFact: "Can debug a production issue while eating a donut. Mmm... donut." },
      { bio: "Distributed systems expert. Speaker at tech conferences across Southeast Asia.", funFact: "Owns more than 20 mechanical keyboards. Woo-hoo!" },
      { bio: "Platform engineer specializing in Kubernetes and observability. Open source contributor.", funFact: "Once deployed to production from the top of a mountain. Excellent." },
      { bio: "Design systems practitioner. Believes good UX is invisible UX.", funFact: "Designs exclusively to jazz. Always jazz." }
    ],
    testimonials: [
      { text: "Simptecho transformed the way our team works. 3x faster delivery, bug rate dropped dramatically. They're not a vendor \u2014 they're a partner. Woo-hoo!" },
      { text: "Microservices migration completed in 6 months with zero downtime. I've never seen execution of this caliber before. Excellent." },
      { text: "Our platform handled 500k concurrent users at launch \u2014 something we thought was impossible in that timeline. Sweet Jebus!" }
    ],
    portfolios: [
      { description: "Digital payment platform with 2M+ active users. Real-time transaction processing, ML fraud detection, and open banking integration.", result: "2M+ active users" },
      { description: "Microservices re-architecture for a retail platform with 50+ brands. Zero-downtime migration from legacy monolith.", result: "Zero-downtime migration" },
      { description: "Learning management system for 500k+ learners. Live streaming, adaptive quiz engine, and blockchain certification.", result: "500k+ active learners" },
      { description: "Fleet management and real-time cargo tracking for 1000+ vehicles. IoT integration with AI route prediction.", result: "1000+ fleet monitored" }
    ]
  }
};

// src/i18n/index.ts
var translations = { id, en };
var SUPPORTED_LOCALES = ["id", "en"];
var DEFAULT_LOCALE = "id";
function getTranslation(locale) {
  return translations[locale] ?? translations[DEFAULT_LOCALE];
}
function stripLocale(path) {
  const segment = path.split("/")[1];
  if (SUPPORTED_LOCALES.includes(segment)) {
    return path.slice(segment.length + 1) || "/";
  }
  return path;
}
function localePath(locale, path) {
  if (locale === DEFAULT_LOCALE) return path;
  const clean = stripLocale(path);
  return `/${locale}${clean === "/" ? "" : clean}`;
}
function interpolate(template, vars) {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? `{${key}}`);
}

// src/lib/constants.ts
var PORT = Number(process.env.PORT) || 3e3;
function getNavLinks(locale) {
  const t = getTranslation(locale);
  return [
    { href: localePath(locale, "/"), label: t.nav.home },
    { href: localePath(locale, "/services"), label: t.nav.services },
    { href: localePath(locale, "/portfolio"), label: t.nav.portfolio },
    { href: localePath(locale, "/about"), label: t.nav.about },
    { href: localePath(locale, "/contact"), label: t.nav.contact },
    { href: localePath(locale, "/faq"), label: locale === "en" ? "FAQ" : "FAQ" }
  ];
}
var SEO = {
  siteName: "Simptecho",
  defaultDescription: "Solusi digital kelas Springfield \u2014 product engineering, cloud/DevOps, mobile, AI, dan security untuk startup hingga enterprise.",
  defaultOgImage: "/og-image.png",
  twitterHandle: "@simptecho_id"
};

// src/data/company.ts
var company = {
  name: "Simptecho",
  tagline: "Solusi Digital Kelas Springfield",
  description: "We don't just write code, we cook up surprises (the good kind). Scalable, fast digital products \u2014 from scrappy startup stalls to enterprises the size of a nuclear plant.",
  founded: "2015",
  employees: "150+",
  projects: "500+",
  clients: "200+",
  email: "hello@simptecho.id",
  phone: "+62 21 1234 5678",
  address: "Jl. Springfield No. 742, Jakarta Selatan, DKI Jakarta 12190",
  social: {
    linkedin: "https://linkedin.com/company/simptecho",
    twitter: "https://twitter.com/simptecho_id",
    instagram: "https://instagram.com/simptecho.id",
    github: "https://github.com/simptecho"
  }
};
var services = [
  {
    id: 1,
    icon: "\u{1F680}",
    title: "Product Engineering",
    description: "Kami rancang dan bangun produk digital dari nol \u2014 arsitektur solid, UX intuitif, dan delivery tepat waktu.",
    detail: "Full-cycle product development"
  },
  {
    id: 2,
    icon: "\u2601\uFE0F",
    title: "Cloud & DevOps",
    description: "Infrastructure as code, CI/CD pipeline, Kubernetes orchestration, dan observability end-to-end.",
    detail: "AWS \xB7 GCP \xB7 Azure \xB7 K8s"
  },
  {
    id: 3,
    icon: "\u{1F4F1}",
    title: "Mobile Development",
    description: "Aplikasi native iOS & Android, serta cross-platform React Native untuk reach yang lebih luas.",
    detail: "iOS \xB7 Android \xB7 React Native"
  },
  {
    id: 4,
    icon: "\u{1F916}",
    title: "AI & Data Engineering",
    description: "Pipeline data real-time, model ML production-ready, dan integrasi LLM untuk produk cerdas.",
    detail: "ML \xB7 LLM \xB7 Streaming Data"
  },
  {
    id: 5,
    icon: "\u{1F510}",
    title: "Security & Compliance",
    description: "Penetration testing, secure SDLC, dan compliance audit untuk produk yang aman dari ground up.",
    detail: "PenTest \xB7 OWASP \xB7 ISO 27001"
  },
  {
    id: 6,
    icon: "\u{1F4CA}",
    title: "Analytics & BI",
    description: "Dashboard real-time, data warehouse modern, dan insight actionable dari data bisnis Anda.",
    detail: "dbt \xB7 Redshift \xB7 Metabase"
  }
];
var team = [
  {
    id: 1,
    name: "Budi Santoso",
    role: "CEO & Co-Founder",
    initials: "BS",
    bio: "10+ tahun di product engineering. Ex-Gojek, ex-Tokopedia. Passionate soal scalable systems.",
    funFact: "Bisa debug production issue sambil makan soto."
  },
  {
    id: 2,
    name: "Dewi Rahayu",
    role: "CTO & Co-Founder",
    initials: "DR",
    bio: "Distributed systems expert. Speaker di berbagai konferensi teknologi Asia Tenggara.",
    funFact: "Koleksi mechanical keyboard lebih dari 20 unit."
  },
  {
    id: 3,
    name: "Ahmad Fauzi",
    role: "Head of Engineering",
    initials: "AF",
    bio: "Platform engineer dengan spesialisasi Kubernetes dan observability. Open source contributor.",
    funFact: "Pernah deploy ke production dari atas gunung."
  },
  {
    id: 4,
    name: "Siti Nurhaliza",
    role: "Head of Design",
    initials: "SN",
    bio: "Design systems practitioner. Percaya bahwa UX yang baik adalah invisible UX.",
    funFact: "Mendesain sambil dengerin jazz \u2014 selalu jazz."
  }
];
var testimonials = [
  {
    id: 1,
    name: "Rizky Pratama",
    company: "FinPay Indonesia",
    role: "CTO",
    text: "Simptecho transform cara tim kami bekerja. Delivery 3x lebih cepat, bug rate turun drastis. Mereka bukan vendor \u2014 mereka partner.",
    rating: 5,
    avatar: "RP"
  },
  {
    id: 2,
    name: "Lisa Hartono",
    company: "RetailGo",
    role: "VP Engineering",
    text: "Migration ke microservices selesai dalam 6 bulan tanpa downtime. Saya tidak pernah lihat eksekusi sekelas ini sebelumnya.",
    rating: 5,
    avatar: "LH"
  },
  {
    id: 3,
    name: "Marco Tanuwijaya",
    company: "EduNusa",
    role: "Founder & CEO",
    text: "Platform kami handle 500k concurrent users saat launch \u2014 sesuatu yang kami kira tidak mungkin dalam timeline itu.",
    rating: 5,
    avatar: "MT"
  }
];
var portfolios = [
  {
    id: 1,
    title: "FinPay Super App",
    category: "Fintech \xB7 Mobile & Web",
    description: "Platform pembayaran digital dengan 2M+ pengguna aktif. Real-time transaction processing, fraud detection ML, dan open banking integration.",
    tech: ["Go", "Kafka", "React Native", "PostgreSQL", "Redis"],
    year: "2023",
    result: "2M+ pengguna aktif"
  },
  {
    id: 2,
    title: "RetailGo Platform",
    category: "E-commerce \xB7 Enterprise",
    description: "Microservices re-architecture untuk platform retail dengan 50+ brand. Zero-downtime migration dari monolith legacy.",
    tech: ["Node.js", "Kubernetes", "React", "MongoDB", "RabbitMQ"],
    year: "2023",
    result: "Zero-downtime migration"
  },
  {
    id: 3,
    title: "EduNusa LMS",
    category: "EdTech \xB7 Platform",
    description: "Learning management system untuk 500k+ pelajar. Live streaming, adaptive quiz engine, dan sertifikasi blockchain.",
    tech: ["Next.js", "WebRTC", "Python", "PostgreSQL", "AWS"],
    year: "2022",
    result: "500k+ pelajar aktif"
  },
  {
    id: 4,
    title: "LogiTrack",
    category: "Logistik \xB7 IoT",
    description: "Fleet management dan real-time cargo tracking untuk 1000+ kendaraan. IoT integration dengan prediksi rute AI.",
    tech: ["Go", "MQTT", "TimescaleDB", "React", "Mapbox"],
    year: "2022",
    result: "1000+ armada terpantau"
  }
];

// src/lib/scripts.ts
function chalkboardScript() {
  const messages = [
    "Saya tidak akan deploy ke production hari Jumat",
    "Stack overflow bukan solusi, tapi kadang membantu",
    "Saya sudah baca dokumentasinya (bohong)",
    "Saya tidak akan commit langsung ke main",
    "Console.log bukan debugging yang proper",
    "Saya akan tulis unit test besok (janji)",
    "Copy-paste dari internet bukan plagiat, itu efisiensi",
    "Saya sudah backup sebelum menghapus ini",
    "Dark mode bukan preferensi, ini kebutuhan medis",
    "Saya tidak akan menyalahkan cache kalau ada bug"
  ];
  const msgsEN = [
    "I will not push to production on Fridays",
    "Stack Overflow is not a crutch (it totally is)",
    "I have read the documentation (I have not)",
    "I will not commit directly to main",
    "console.log is not a debugging strategy",
    "I will write unit tests tomorrow (for real this time)",
    "Copy-pasting from the internet is research, not plagiarism",
    "I backed up before deleting this (I did not)",
    "Dark mode is a medical necessity, not a preference",
    "I will not blame the cache when there is a bug"
  ];
  return `
<script>
(function() {
  var SESSION_KEY = 'spt_chalk_shown';
  if (sessionStorage.getItem(SESSION_KEY)) return;
  sessionStorage.setItem(SESSION_KEY, '1');

  var msgs    = ${JSON.stringify(messages)};
  var msgsEN  = ${JSON.stringify(msgsEN)};
  var isEN    = document.documentElement.lang === 'en';
  var list    = isEN ? msgsEN : msgs;
  var text    = list[Math.floor(Math.random() * list.length)];

  var overlay = document.createElement('div');
  overlay.id  = 'chalk-overlay';
  overlay.innerHTML = \`
    <div style="
      position:fixed;inset:0;z-index:9999;
      background:#1a1a2e;
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      gap:2rem;padding:2rem;
    ">
      <div style="
        width:min(680px,90vw);
        background:#2a2a1a;
        border:4px solid #555;
        border-radius:4px;
        padding:2.5rem 3rem 3rem;
        box-shadow:inset 0 0 40px #00000088, 0 8px 32px #00000099;
        position:relative;
      ">
        <!-- chalk tray line -->
        <div style="position:absolute;bottom:0;left:0;right:0;height:18px;background:#3a3828;border-top:3px solid #555;border-radius:0 0 4px 4px;"></div>
        <p id="chalk-text" style="
          font-family:'Bangers',cursive;
          font-size:clamp(1.5rem,4vw,2.2rem);
          color:#f0f0e0;
          letter-spacing:0.06em;
          line-height:1.4;
          text-align:center;
          margin:0;
          text-shadow:0 0 8px #ffffff33;
          opacity:0;
          animation:chalkWrite 0.8s ease forwards 0.3s;
        ">\${text}</p>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;">
        <div style="font-family:'Fredoka',sans-serif;font-size:0.85rem;color:#FED41D99;">
          \${isEN ? 'click anywhere to enter Springfield...' : 'klik di mana saja untuk masuk...'}
        </div>
        <div style="
          width:48px;height:48px;
          background:#FED41D;
          border:3px solid #1A1A2E;
          border-radius:50%;
          box-shadow:4px 4px 0 #F5C400;
          display:flex;align-items:center;justify-content:center;
          font-size:1.6rem;
          animation:donutBounce 0.8s ease infinite alternate;
        ">\u{1F369}</div>
      </div>
    </div>
  \`;

  var style = document.createElement('style');
  style.textContent = \`
    @keyframes chalkWrite {
      from { opacity:0; transform:translateY(8px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes donutBounce {
      from { transform:translateY(0); }
      to   { transform:translateY(-8px); }
    }
    @keyframes fadeOut {
      from { opacity:1; }
      to   { opacity:0; pointer-events:none; }
    }
  \`;
  document.head.appendChild(style);
  document.body.appendChild(overlay);

  function dismiss() {
    overlay.style.animation = 'fadeOut 0.4s ease forwards';
    setTimeout(function() { overlay.remove(); }, 400);
  }
  overlay.addEventListener('click', dismiss);
  setTimeout(dismiss, 5000);
})();
</script>`;
}
function themeToggleStyles() {
  return `
<style>
  /* Night override \u2014 applied via [data-theme="night"] on <html> */
  [data-theme="night"] {
    --spt-bg:        #0d0d1a;
    --spt-surface:   #16162a;
    --spt-text:      #e8e8f0;
    --spt-text-muted:#8888aa;
    --spt-yellow:    #FFE566;
    --spt-sky:       #4466cc;
  }
  [data-theme="night"] body { background: var(--spt-bg) !important; }
  [data-theme="night"] .comic-card { background: var(--spt-surface) !important; border-color: #FED41D88 !important; }
  [data-theme="night"] .comic-divider {
    background: repeating-linear-gradient(90deg, #FFE566 0,#FFE566 20px,#0d0d1a 20px,#0d0d1a 24px) !important;
  }
</style>`;
}
function themeToggleScript() {
  return `
<script>
(function() {
  // Read cookie
  function getCookie(name) {
    var m = document.cookie.match('(?:^|; )' + name + '=([^;]*)');
    return m ? decodeURIComponent(m[1]) : null;
  }
  function setCookie(name, value) {
    document.cookie = name + '=' + encodeURIComponent(value) + ';path=/;max-age=31536000';
  }

  var current = getCookie('spt_theme') || 'day';
  document.documentElement.setAttribute('data-theme', current);

  window.__sptToggleTheme = function() {
    current = current === 'day' ? 'night' : 'day';
    document.documentElement.setAttribute('data-theme', current);
    setCookie('spt_theme', current);
    updateBtn();
  };

  function updateBtn() {
    var btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;
    var isNight = current === 'night';
    var isEN    = document.documentElement.lang === 'en';
    btn.textContent = isNight
      ? (isEN ? '\u2600\uFE0F Springfield Day'   : '\u2600\uFE0F Siang di Springfield')
      : (isEN ? '\u{1F319} Springfield Night' : '\u{1F319} Malam di Springfield');
  }

  document.addEventListener('DOMContentLoaded', updateBtn);
})();
</script>`;
}
function themeToggleButton() {
  return `
  <button id="theme-toggle-btn" onclick="__sptToggleTheme()" style="
    background:transparent;
    border:2px solid #FED41D55;
    border-radius:8px;
    padding:0.35rem 0.8rem;
    font-family:'Fredoka',sans-serif;
    font-size:0.82rem;font-weight:600;
    color:#FED41DAA;
    cursor:pointer;
    white-space:nowrap;
    transition:border-color 0.15s,color 0.15s;
  "
  onmouseover="this.style.borderColor='#FED41D';this.style.color='#FED41D'"
  onmouseout="this.style.borderColor='#FED41D55';this.style.color='#FED41DAA'"
  >\u2600\uFE0F Siang di Springfield</button>`;
}
function beerLoadingBar() {
  return `
<style>
  #beer-bar {
    position:fixed;top:0;left:0;right:0;z-index:9998;
    height:4px;
    pointer-events:none;
    overflow:hidden;
    opacity:0;
    transition:opacity 0.2s;
  }
  #beer-bar.active { opacity:1; }
  #beer-bar-fill {
    height:100%;
    width:0%;
    background:linear-gradient(90deg, #F5C400, #FED41D 40%, #ffe566 60%, #FED41D);
    box-shadow:0 0 8px #FED41Daa;
    transition:width 0.3s ease;
    position:relative;
  }
  #beer-bar-fill::after {
    content:'';
    position:absolute;right:0;top:0;bottom:0;width:20px;
    background:linear-gradient(90deg,transparent,#ffffffaa);
  }
  #beer-bar-foam {
    position:absolute;right:-6px;top:-4px;
    width:14px;height:12px;
    background:#fffef7;
    border-radius:50% 50% 30% 30%;
    box-shadow:0 0 4px #ffffffaa;
  }
</style>
<div id="beer-bar"><div id="beer-bar-fill"><div id="beer-bar-foam"></div></div></div>
<script>
(function() {
  var bar   = document.getElementById('beer-bar');
  var fill  = document.getElementById('beer-bar-fill');
  var tid, pct;

  function start() {
    pct = 0;
    bar.classList.add('active');
    clearInterval(tid);
    tid = setInterval(function() {
      pct = Math.min(pct + (Math.random() * 12 + 3), 85);
      fill.style.width = pct + '%';
    }, 180);
  }
  function finish() {
    clearInterval(tid);
    fill.style.width = '100%';
    setTimeout(function() {
      bar.classList.remove('active');
      setTimeout(function() { fill.style.width = '0%'; }, 200);
    }, 300);
  }

  // Trigger on <a> clicks (same origin, non-hash)
  document.addEventListener('click', function(e) {
    var a = e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel')) return;
    if (a.target === '_blank') return;
    try {
      var url = new URL(href, location.href);
      if (url.origin !== location.origin) return;
      // Normalize trailing slash before comparing
      var norm = function(p) { return p.replace(//$/, '') || '/'; };
      if (norm(url.pathname) === norm(location.pathname)) return;
    } catch(e) { return; }
    start();
  });
  window.addEventListener('pageshow', finish);
  window.addEventListener('load', finish);
})();
</script>`;
}
function donutConfettiScript() {
  return `
<canvas id="confetti-canvas" style="
  position:fixed;inset:0;pointer-events:none;z-index:9997;
  width:100%;height:100%;
"></canvas>
<script>
(function() {
  var canvas = document.getElementById('confetti-canvas');
  var ctx    = canvas.getContext('2d');
  var particles = [];
  var raf;

  var EMOJIS = ['\u{1F369}','\u{1F369}','\u2B50','\u2728','\u{1F389}','\u{1F37A}','\u{1F31F}'];
  var COLORS  = ['#FED41D','#FF6B6B','#87CEEB','#4CAF50','#FFE566','#F5C400'];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function spawn(n) {
    for (var i = 0; i < n; i++) {
      particles.push({
        x:   Math.random() * canvas.width,
        y:   -20 - Math.random() * 100,
        vx:  (Math.random() - 0.5) * 5,
        vy:  2 + Math.random() * 4,
        rot: Math.random() * Math.PI * 2,
        rv:  (Math.random() - 0.5) * 0.2,
        size: 18 + Math.random() * 16,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 1,
        life: 120 + Math.floor(Math.random() * 80),
      });
    }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x   += p.vx;
      p.y   += p.vy;
      p.rot += p.rv;
      p.vy  += 0.08; // gravity
      p.life--;
      if (p.life < 30) p.alpha = p.life / 30;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.font = p.size + 'px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.emoji, 0, 0);
      ctx.restore();
    }
    if (particles.length > 0) raf = requestAnimationFrame(loop);
    else cancelAnimationFrame(raf);
  }

  window.__sptDonutConfetti = function(n) {
    spawn(n || 60);
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
  };
})();
</script>`;
}
function konamiEasterEggScript() {
  return `
<script>
(function() {
  var SEQ  = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  var idx  = 0;

  document.addEventListener('keydown', function(e) {
    if (e.key === SEQ[idx]) {
      idx++;
      if (idx === SEQ.length) {
        idx = 0;
        triggerEasterEgg();
      }
    } else {
      idx = e.key === SEQ[0] ? 1 : 0;
    }
  });

  function triggerEasterEgg() {
    if (typeof window.__sptDonutConfetti === 'function') window.__sptDonutConfetti(120);

    var isEN   = document.documentElement.lang === 'en';
    var msg    = isEN
      ? "Woo-hoo! You found the secret! D'oh \u2014 now everyone knows."
      : "Woo-hoo! Kamu menemukan rahasia Springfield! \u{1F369}";

    var toast = document.createElement('div');
    toast.style.cssText = [
      'position:fixed','bottom:2rem','left:50%',
      'transform:translateX(-50%)',
      'background:#FED41D','color:#1A1A2E',
      'border:3px solid #1A1A2E',
      'border-radius:16px',
      'padding:1rem 2rem',
      'font-family:Fredoka,sans-serif',
      'font-size:1rem','font-weight:700',
      'box-shadow:5px 5px 0 #1A1A2E',
      'z-index:9990',
      'animation:toastIn 0.4s cubic-bezier(.175,.885,.32,1.275) forwards',
      'text-align:center',
      'max-width:90vw',
    ].join(';');
    toast.textContent = msg;

    var s = document.createElement('style');
    s.textContent = '@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}';
    document.head.appendChild(s);
    document.body.appendChild(toast);
    setTimeout(function() {
      toast.style.transition = 'opacity 0.4s';
      toast.style.opacity    = '0';
      setTimeout(function() { toast.remove(); }, 400);
    }, 4000);
  }
})();
</script>`;
}

// src/layouts/base.ts
function langSwitcher(locale, currentPath) {
  const t = getTranslation(locale);
  const pagePath = stripLocale(currentPath);
  const otherLocale = locale === "id" ? "en" : "id";
  const switchHref = localePath(otherLocale, pagePath);
  const flag = locale === "id" ? "\u{1F1EE}\u{1F1E9}" : "\u{1F1FA}\u{1F1F8}";
  const switchFlag = locale === "id" ? "\u{1F1FA}\u{1F1F8}" : "\u{1F1EE}\u{1F1E9}";
  return `
  <a href="${switchHref}" title="Switch language" style="
    display:inline-flex;align-items:center;gap:0.35rem;
    padding:0.35rem 0.75rem;
    background:#FED41D22;
    border:2px solid #FED41D66;
    border-radius:8px;
    font-family:'Fredoka',sans-serif;
    font-size:0.85rem;font-weight:700;
    color:#FED41D;
    text-decoration:none;
    transition:background 0.15s,border-color 0.15s;
    white-space:nowrap;
  "
  onmouseover="this.style.background='#FED41D33';this.style.borderColor='#FED41D'"
  onmouseout="this.style.background='#FED41D22';this.style.borderColor='#FED41D66'"
  aria-label="Switch to ${otherLocale === "en" ? "English" : "Bahasa Indonesia"}"
  >
    <span style="font-size:1rem;line-height:1;">${flag}</span>
    <span style="opacity:0.5;font-size:0.7rem;">\u2192</span>
    <span style="font-size:1rem;line-height:1;">${switchFlag}</span>
    <span>${t.nav.switchLang}</span>
  </a>`;
}
function navbar(locale, activePage) {
  const t = getTranslation(locale);
  const links = getNavLinks(locale);
  const ctaHref = localePath(locale, "/contact");
  const desktopLinks = links.map(({ href, label }) => {
    const isActive = activePage === href;
    return `
    <a href="${href}" style="
      font-family:'Fredoka',sans-serif;
      font-size:1rem;font-weight:600;
      text-decoration:none;
      padding:0.4rem 1rem;
      border-radius:8px;
      border:2px solid ${isActive ? "#1A1A2E" : "transparent"};
      background:${isActive ? "#FED41D" : "transparent"};
      color:${isActive ? "#1A1A2E" : "#FFFEF7"};
      box-shadow:${isActive ? "3px 3px 0px #1A1A2E" : "none"};
      transition:background 0.15s,color 0.15s,border-color 0.15s,box-shadow 0.15s;
      white-space:nowrap;
    "
    onmouseover="if(!this.dataset.active){this.style.background='#FED41D33';this.style.color='#FED41D';}"
    onmouseout="if(!this.dataset.active){this.style.background='transparent';this.style.color='#FFFEF7';}"
    ${isActive ? 'data-active="true"' : ""}
    >${label}</a>`;
  }).join("");
  const mobileLinks = links.map(({ href, label }) => {
    const isActive = activePage === href;
    return `
    <a href="${href}" style="
      font-family:'Fredoka',sans-serif;font-size:1.1rem;font-weight:600;
      text-decoration:none;padding:0.75rem 1.25rem;border-radius:10px;
      border:2px solid ${isActive ? "#1A1A2E" : "#FED41D33"};
      background:${isActive ? "#FED41D" : "transparent"};
      color:${isActive ? "#1A1A2E" : "#FFFEF7"};
      display:block;
    ">${label}</a>`;
  }).join("");
  return `
  <nav id="navbar" style="
    position:fixed;top:0;left:0;right:0;z-index:1000;
    background:#1A1A2E;
    border-bottom:3px solid #FED41D;
    transition:box-shadow 0.2s;
  ">
    <div style="max-width:1200px;margin:0 auto;padding:0 1.5rem;height:64px;
      display:flex;align-items:center;justify-content:space-between;gap:1rem;">

      <!-- Logo -->
      <a href="${localePath(locale, "/")}" style="text-decoration:none;display:flex;align-items:center;gap:0.5rem;flex-shrink:0;">
        <div style="
          width:38px;height:38px;background:#FED41D;
          border:3px solid #FED41D;border-radius:10px;
          box-shadow:3px 3px 0px #F5C400;
          display:flex;align-items:center;justify-content:center;
          font-family:'Bangers',cursive;font-size:1.2rem;color:#1A1A2E;
        ">ST</div>
        <span style="font-family:'Bangers',cursive;font-size:1.4rem;letter-spacing:0.06em;color:#FFFEF7;">${company.name}</span>
      </a>

      <!-- Desktop links + switcher + CTA -->
      <div id="nav-links" style="display:flex;align-items:center;gap:0.25rem;">
        ${desktopLinks}
        <div style="width:1px;height:24px;background:#FFFEF722;margin:0 0.5rem;"></div>
        ${themeToggleButton()}
        <div style="width:1px;height:24px;background:#FFFEF722;margin:0 0.5rem;"></div>
        ${langSwitcher(locale, activePage)}
        <a href="${ctaHref}" style="
          margin-left:0.5rem;
          padding:0.4rem 1.25rem;
          background:#FED41D;color:#1A1A2E;
          border:2px solid #1A1A2E;border-radius:8px;
          font-family:'Fredoka',sans-serif;font-size:0.95rem;font-weight:700;
          text-decoration:none;box-shadow:3px 3px 0px #1A1A2E;
          transition:transform 0.1s,box-shadow 0.1s;white-space:nowrap;
        "
        onmouseover="this.style.transform='translate(-1px,-1px)';this.style.boxShadow='4px 4px 0px #1A1A2E'"
        onmouseout="this.style.transform='';this.style.boxShadow='3px 3px 0px #1A1A2E'"
        >${t.nav.cta}</a>
      </div>

      <!-- Mobile hamburger -->
      <button id="menu-btn" aria-label="Menu" style="
        display:none;background:none;
        border:2px solid #FED41D;border-radius:8px;
        padding:0.4rem 0.6rem;cursor:pointer;
        color:#FED41D;font-size:1.3rem;line-height:1;
      ">\u2630</button>
    </div>

    <!-- Mobile drawer -->
    <div id="mobile-menu" style="
      display:none;flex-direction:column;gap:0.5rem;
      padding:1rem 1.5rem 1.5rem;
      border-top:2px solid #FED41D33;background:#1A1A2E;
    ">
      ${mobileLinks}
      <div style="padding-top:0.5rem;display:flex;align-items:center;gap:0.75rem;">
        ${langSwitcher(locale, activePage)}
        <a href="${ctaHref}" style="
          flex:1;text-align:center;
          padding:0.75rem;background:#FED41D;color:#1A1A2E;
          border:2px solid #1A1A2E;border-radius:10px;
          font-family:'Fredoka',sans-serif;font-size:1rem;font-weight:700;
          text-decoration:none;
        ">${t.nav.cta}</a>
      </div>
    </div>
  </nav>`;
}
function footer(locale) {
  const t = getTranslation(locale);
  const links = getNavLinks(locale);
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const socials = [
    { label: "LinkedIn", href: company.social.linkedin },
    { label: "Twitter", href: company.social.twitter },
    { label: "GitHub", href: company.social.github },
    { label: "Instagram", href: company.social.instagram }
  ].map(({ label, href }) => `
    <a href="${href}" target="_blank" rel="noopener noreferrer" style="
      font-family:'Fredoka',sans-serif;font-size:0.9rem;font-weight:500;
      color:#87CEEB;text-decoration:none;transition:color 0.15s;
    "
    onmouseover="this.style.color='#FED41D'"
    onmouseout="this.style.color='#87CEEB'"
    >${label}</a>`).join("");
  const footerLinks = links.map(({ href, label }) => `
    <a href="${href}" style="
      font-family:'Fredoka',sans-serif;font-size:0.9rem;
      color:#FFFEF799;text-decoration:none;transition:color 0.15s;
    "
    onmouseover="this.style.color='#FED41D'"
    onmouseout="this.style.color='#FFFEF799'"
    >${label}</a>`).join("");
  return `
  <footer style="
    background:#1A1A2E;border-top:4px solid #FED41D;
    padding:3rem 1.5rem 2rem;margin-top:auto;
  ">
    <div style="max-width:1200px;margin:0 auto;">
      <div style="
        display:grid;grid-template-columns:2fr 1fr 1fr;gap:2.5rem;
        padding-bottom:2rem;border-bottom:2px solid #FED41D22;
      " class="footer-grid">

        <!-- Brand -->
        <div style="display:flex;flex-direction:column;gap:1rem;">
          <a href="${localePath(locale, "/")}" style="text-decoration:none;display:flex;align-items:center;gap:0.5rem;">
            <div style="
              width:36px;height:36px;background:#FED41D;
              border:3px solid #FED41D;border-radius:8px;
              box-shadow:3px 3px 0px #F5C400;
              display:flex;align-items:center;justify-content:center;
              font-family:'Bangers',cursive;font-size:1.1rem;color:#1A1A2E;
            ">ST</div>
            <span style="font-family:'Bangers',cursive;font-size:1.3rem;letter-spacing:0.05em;color:#FFFEF7;">${company.name}</span>
          </a>
          <p style="font-family:'Fredoka',sans-serif;font-size:0.9rem;color:#FFFEF799;line-height:1.6;margin:0;max-width:280px;">
            ${company.description}
          </p>
          <div style="display:flex;gap:1rem;flex-wrap:wrap;">${socials}</div>
        </div>

        <!-- Nav -->
        <div>
          <h4 style="font-family:'Bangers',cursive;font-size:1.1rem;letter-spacing:0.05em;color:#FED41D;margin:0 0 1rem;">
            ${t.footer.pagesHeading}
          </h4>
          <div style="display:flex;flex-direction:column;gap:0.5rem;">${footerLinks}</div>
        </div>

        <!-- Contact -->
        <div>
          <h4 style="font-family:'Bangers',cursive;font-size:1.1rem;letter-spacing:0.05em;color:#FED41D;margin:0 0 1rem;">
            ${t.footer.contactHeading}
          </h4>
          <div style="display:flex;flex-direction:column;gap:0.5rem;">
            <span style="font-family:'Fredoka',sans-serif;font-size:0.9rem;color:#FFFEF799;">${company.email}</span>
            <span style="font-family:'Fredoka',sans-serif;font-size:0.9rem;color:#FFFEF799;">${company.phone}</span>
            <span style="font-family:'Fredoka',sans-serif;font-size:0.85rem;color:#FFFEF766;line-height:1.5;">${company.address}</span>
          </div>
        </div>
      </div>

      <div style="
        padding-top:1.5rem;
        display:flex;justify-content:space-between;align-items:center;
        flex-wrap:wrap;gap:1rem;
      ">
        <span style="font-family:'Fredoka',sans-serif;font-size:0.85rem;color:#FFFEF755;">
          \xA9 ${year} ${company.name}. ${t.footer.rights}
        </span>
        <span style="font-family:'Fredoka',sans-serif;font-size:0.85rem;color:#FED41D88;">
          ${t.footer.builtWith}
        </span>
      </div>
    </div>
  </footer>`;
}
function globalStyles() {
  return `
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
    body {
      background: #FFFEF7; color: #1A1A2E;
      min-height: 100vh; display: flex; flex-direction: column; overflow-x: hidden;
    }
    .comic-card:hover {
      transform: translate(-2px, -2px);
      box-shadow: 7px 7px 0px #1A1A2E !important;
    }
    .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.5s ease, transform 0.5s ease; }
    .reveal.visible { opacity: 1; transform: translateY(0); }
    .reveal-d1 { transition-delay: 0.05s; }
    .reveal-d2 { transition-delay: 0.10s; }
    .reveal-d3 { transition-delay: 0.15s; }
    .reveal-d4 { transition-delay: 0.20s; }
    .reveal-d5 { transition-delay: 0.25s; }
    .reveal-d6 { transition-delay: 0.30s; }
    main { padding-top: 64px; flex: 1; }
    .section    { padding: 5rem 1.5rem; }
    .section-sm { padding: 3rem 1.5rem; }
    .container  { max-width: 1200px; margin: 0 auto; }
    .comic-divider {
      height: 4px;
      background: repeating-linear-gradient(
        90deg, #FED41D 0px, #FED41D 20px, #1A1A2E 20px, #1A1A2E 24px
      );
    }
    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
    @media (max-width: 768px) {
      #nav-links { display: none !important; }
      #menu-btn  { display: flex !important; }
      .footer-grid { grid-template-columns: 1fr !important; }
      .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr !important; }
    }
    @media (min-width: 769px) and (max-width: 1024px) {
      .grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
      .grid-3 { grid-template-columns: repeat(2, 1fr) !important; }
    }
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #1A1A2E; }
    ::-webkit-scrollbar-thumb { background: #FED41D; border-radius: 4px; }
  </style>`;
}
function globalScripts() {
  return `
  <script>
    (function() {
      var nav = document.getElementById('navbar');
      window.addEventListener('scroll', function() {
        nav.style.boxShadow = window.scrollY > 10 ? '0 4px 24px #00000066' : 'none';
      }, { passive: true });
    })();
    (function() {
      var btn  = document.getElementById('menu-btn');
      var menu = document.getElementById('mobile-menu');
      if (!btn || !menu) return;
      btn.addEventListener('click', function() {
        var open = menu.style.display === 'flex';
        menu.style.display = open ? 'none' : 'flex';
        btn.textContent = open ? '\u2630' : '\u2715';
      });
    })();
    (function() {
      var els = document.querySelectorAll('.reveal');
      if (!('IntersectionObserver' in window)) {
        els.forEach(function(el) { el.classList.add('visible'); });
        return;
      }
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      els.forEach(function(el) { obs.observe(el); });
    })();
    (function() {
      function animateCounter(el) {
        var raw    = el.dataset.target || el.textContent;
        var suffix = el.dataset.suffix || '';
        var num    = parseFloat(raw.replace(/[^0-9.]/g, ''));
        var isFloat = raw.includes('.');
        if (isNaN(num)) return;
        var duration = 1800, startTime = null;
        function step(ts) {
          if (!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / duration, 1);
          var ease     = 1 - Math.pow(1 - progress, 3);
          var current  = num * ease;
          el.textContent = (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }
      var counterEls = document.querySelectorAll('[data-counter]');
      if (!('IntersectionObserver' in window)) { counterEls.forEach(animateCounter); return; }
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          if (e.isIntersecting) { animateCounter(e.target); obs.unobserve(e.target); }
        });
      }, { threshold: 0.5 });
      counterEls.forEach(function(el) { obs.observe(el); });
    })();
  </script>`;
}
function baseLayout({ title, description, activePage, locale, content }) {
  const t = getTranslation(locale);
  const desc = description ?? SEO.defaultDescription;
  const fullTitle = `${title} \u2014 ${SEO.siteName}`;
  const htmlLang = locale === "en" ? "en" : "id";
  return `<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${fullTitle}</title>
  <meta name="description" content="${desc}" />
  <meta property="og:title" content="${fullTitle}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="${SEO.twitterHandle}" />
  <!-- Alternate language links for SEO -->
  <link rel="alternate" hreflang="id" href="/id${stripLocale(activePage) === "/" ? "" : stripLocale(activePage)}" />
  <link rel="alternate" hreflang="en" href="/en${stripLocale(activePage) === "/" ? "" : stripLocale(activePage)}" />
  <link rel="alternate" hreflang="x-default" href="${stripLocale(activePage)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Fredoka:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  ${themeToggleStyles()}
  <!-- Apply saved theme immediately to prevent flash -->
  <script>(function(){var m=document.cookie.match('(?:^|; )spt_theme=([^;]*)');if(m&&decodeURIComponent(m[1])==='night'){document.documentElement.setAttribute('data-theme','night');}})();</script>
  ${globalStyles()}
</head>
<body>
  ${navbar(locale, activePage)}
  ${beerLoadingBar()}
  <main>
    ${content}
  </main>
  ${footer(locale)}
  ${globalScripts()}
  ${donutConfettiScript()}
  ${konamiEasterEggScript()}
  ${themeToggleScript()}
  ${chalkboardScript()}
</body>
</html>`;
}

// src/components/card.ts
function card({ title, body, icon, badge: badgeText, footer: footer2 }) {
  return `
  <div class="comic-card" style="
    background:#FFFEF7;
    border:3px solid #1A1A2E;
    border-radius:16px;
    box-shadow:5px 5px 0px #1A1A2E;
    padding:1.5rem;
    display:flex;
    flex-direction:column;
    gap:0.75rem;
    transition:transform 0.15s ease,box-shadow 0.15s ease;
    cursor:default;
  ">
    ${icon ? `<div style="font-size:2rem;line-height:1;">${icon}</div>` : ""}
    ${badgeText ? `<span style="
            display:inline-block;width:fit-content;
            padding:2px 10px;border-radius:999px;
            border:2px solid #1A1A2E;
            background:#FED41D;color:#1A1A2E;
            font-family:'Fredoka',sans-serif;font-size:0.72rem;font-weight:600;
          ">${badgeText}</span>` : ""}
    <h3 style="
      font-family:'Bangers',cursive;
      font-size:1.4rem;
      letter-spacing:0.04em;
      color:#1A1A2E;
      margin:0;
      line-height:1.2;
    ">${title}</h3>
    <p style="
      font-family:'Fredoka',sans-serif;
      font-size:0.95rem;
      color:#2D2D44;
      line-height:1.6;
      margin:0;
      flex:1;
    ">${body}</p>
    ${footer2 ? `<div style="
            padding-top:0.75rem;
            border-top:2px solid #1A1A2E22;
            font-family:'Fredoka',sans-serif;
            font-size:0.8rem;
            font-weight:600;
            color:#5BA8D4;
          ">${footer2}</div>` : ""}
  </div>`;
}

// src/components/stats.ts
function statsStrip(items, dark = false) {
  const bg = dark ? "#1A1A2E" : "#FED41D";
  const color = dark ? "#FED41D" : "#1A1A2E";
  const border = dark ? "border:3px solid #FED41D;" : "border:3px solid #1A1A2E;";
  const cells = items.map(
    ({ value, label, suffix = "" }) => `
      <div style="text-align:center;padding:1.5rem 1rem;">
        <div style="
          font-family:'Bangers',cursive;
          font-size:clamp(2rem,5vw,3rem);
          color:${color};
          line-height:1;
          letter-spacing:0.05em;
        " data-counter data-target="${value}" data-suffix="${suffix}">${value}${suffix}</div>
        <div style="
          font-family:'Fredoka',sans-serif;
          font-size:0.85rem;
          font-weight:500;
          color:${dark ? "#87CEEB" : "#1A1A2E"};
          margin-top:0.25rem;
          opacity:0.85;
        ">${label}</div>
      </div>`
  ).join(`<div style="width:3px;background:${dark ? "#FED41D44" : "#1A1A2E33"};margin:1rem 0;"></div>`);
  return `
  <div style="
    display:grid;
    grid-template-columns:repeat(${items.length},1fr);
    background:${bg};
    ${border}
    border-radius:16px;
    box-shadow:5px 5px 0px ${dark ? "#FED41D44" : "#1A1A2E"};
    overflow:hidden;
  ">
    ${cells}
  </div>`;
}

// src/components/cta.ts
function ctaSection({
  heading,
  subheading,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref
}) {
  const secondary = secondaryLabel && secondaryHref ? `<a href="${secondaryHref}" style="
        display:inline-block;
        padding:0.75rem 2rem;
        border:3px solid #FED41D;
        border-radius:12px;
        background:transparent;
        color:#FED41D;
        font-family:'Fredoka',sans-serif;
        font-size:1rem;
        font-weight:600;
        text-decoration:none;
        transition:background 0.15s,color 0.15s;
      " onmouseover="this.style.background='#FED41D';this.style.color='#1A1A2E'"
         onmouseout="this.style.background='transparent';this.style.color='#FED41D'"
      >${secondaryLabel}</a>` : "";
  return `
  <section style="
    background:#1A1A2E;
    border-top:4px solid #FED41D;
    border-bottom:4px solid #FED41D;
    padding:5rem 1.5rem;
    text-align:center;
  ">
    <div style="max-width:640px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:1.5rem;">
      <h2 style="
        font-family:'Bangers',cursive;
        font-size:clamp(2.2rem,6vw,3.5rem);
        color:#FED41D;
        letter-spacing:0.06em;
        line-height:1.1;
        margin:0;
      ">${heading}</h2>
      <p style="
        font-family:'Fredoka',sans-serif;
        font-size:1.1rem;
        color:#87CEEB;
        line-height:1.6;
        margin:0;
      ">${subheading}</p>
      <div style="display:flex;flex-wrap:wrap;gap:1rem;justify-content:center;margin-top:0.5rem;">
        <a href="${primaryHref}" style="
          display:inline-block;
          padding:0.85rem 2.25rem;
          background:#FED41D;
          color:#1A1A2E;
          border:3px solid #1A1A2E;
          border-radius:12px;
          font-family:'Fredoka',sans-serif;
          font-size:1rem;
          font-weight:700;
          text-decoration:none;
          box-shadow:4px 4px 0px #F5C400;
          transition:transform 0.1s,box-shadow 0.1s;
        " onmouseover="this.style.transform='translate(-2px,-2px)';this.style.boxShadow='6px 6px 0px #F5C400'"
           onmouseout="this.style.transform='';this.style.boxShadow='4px 4px 0px #F5C400'"
        >${primaryLabel}</a>
        ${secondary}
      </div>
    </div>
  </section>`;
}

// src/pages/home.ts
function heroSection(locale) {
  const t = getTranslation(locale);
  const h = t.home;
  const badge2 = interpolate(h.heroBadge, { founded: company.founded });
  const desc = interpolate(h.heroDescription, { description: company.description });
  return `
  <section style="
    background:linear-gradient(160deg,#1A1A2E 0%,#2D2D44 100%);
    padding:6rem 1.5rem 5rem;position:relative;overflow:hidden;
  ">
    <div style="position:absolute;top:-80px;right:-80px;width:340px;height:340px;
      background:#FED41D22;border-radius:50%;pointer-events:none;"></div>
    <div style="position:absolute;bottom:-60px;left:-60px;width:260px;height:260px;
      background:#87CEEB18;border-radius:50%;pointer-events:none;"></div>

    <div class="container" style="position:relative;z-index:1;">
      <div style="max-width:720px;">
        <div class="reveal" style="margin-bottom:1.25rem;">
          <span style="
            display:inline-flex;align-items:center;gap:0.4rem;
            padding:0.35rem 1rem;background:#FED41D22;
            border:2px solid #FED41D44;border-radius:999px;
            font-family:'Fredoka',sans-serif;font-size:0.85rem;font-weight:600;color:#FED41D;
          ">${badge2}</span>
        </div>

        <h1 class="reveal reveal-d1" style="
          font-family:'Bangers',cursive;
          font-size:clamp(3rem,8vw,5.5rem);
          line-height:1.0;letter-spacing:0.04em;color:#FFFEF7;margin-bottom:0.5rem;
        ">
          ${h.heroHeadline1}<br/>
          <span style="color:#FED41D;text-shadow:4px 4px 0px #1A1A2E;">${h.heroHeadline2}</span>
        </h1>

        <p class="reveal reveal-d2" style="
          font-family:'Fredoka',sans-serif;font-size:1.15rem;
          color:#FFFEF7BB;line-height:1.7;margin:1.5rem 0 2.5rem;max-width:560px;
        ">${desc}</p>

        <div class="reveal reveal-d3" style="display:flex;flex-wrap:wrap;gap:1rem;">
          <a href="${localePath(locale, "/services")}" style="
            padding:0.85rem 2.25rem;background:#FED41D;color:#1A1A2E;
            border:3px solid #1A1A2E;border-radius:12px;
            font-family:'Fredoka',sans-serif;font-size:1rem;font-weight:700;
            text-decoration:none;box-shadow:5px 5px 0px #F5C400;
            transition:transform 0.1s,box-shadow 0.1s;
          "
          onmouseover="this.style.transform='translate(-2px,-2px)';this.style.boxShadow='7px 7px 0px #F5C400'"
          onmouseout="this.style.transform='';this.style.boxShadow='5px 5px 0px #F5C400'"
          >${h.heroCtaPrimary}</a>
          <a href="${localePath(locale, "/portfolio")}" style="
            padding:0.85rem 2.25rem;background:transparent;color:#FFFEF7;
            border:3px solid #FFFEF755;border-radius:12px;
            font-family:'Fredoka',sans-serif;font-size:1rem;font-weight:600;
            text-decoration:none;transition:border-color 0.15s,color 0.15s;
          "
          onmouseover="this.style.borderColor='#FED41D';this.style.color='#FED41D'"
          onmouseout="this.style.borderColor='#FFFEF755';this.style.color='#FFFEF7'"
          >${h.heroCtaSecondary}</a>
        </div>
      </div>

      <div class="reveal reveal-d4" style="margin-top:4rem;">
        ${statsStrip([
    { value: company.projects, label: h.stats[0].label, suffix: "" },
    { value: company.clients, label: h.stats[1].label, suffix: "" },
    { value: company.employees, label: h.stats[2].label, suffix: "" },
    { value: "9", label: h.stats[3].label, suffix: locale === "id" ? " thn" : " yrs" }
  ], true)}
      </div>
    </div>
  </section>`;
}
function servicesPreview(locale) {
  const t = getTranslation(locale);
  const h = t.home;
  const ds = t.data.services;
  const cards = services.slice(0, 4).map((s, i) => {
    const d = ds[i];
    return `<div class="reveal reveal-d${i + 1}">
      ${card({ title: d.title, body: d.description, icon: s.icon, footer: d.detail })}
    </div>`;
  }).join("");
  return `
  <section class="section">
    <div class="container">
      <div style="text-align:center;margin-bottom:3rem;">
        <h2 class="reveal" style="
          font-family:'Bangers',cursive;font-size:clamp(2rem,5vw,3rem);
          letter-spacing:0.05em;color:#1A1A2E;margin-bottom:0.75rem;
        ">${h.servicesHeading}</h2>
        <p class="reveal reveal-d1" style="
          font-family:'Fredoka',sans-serif;font-size:1rem;color:#2D2D44BB;
          max-width:480px;margin:0 auto;line-height:1.6;
        ">${h.servicesSubheading}</p>
      </div>
      <div class="grid-2">${cards}</div>
      <div class="reveal" style="text-align:center;margin-top:2.5rem;">
        <a href="${localePath(locale, "/services")}" style="
          display:inline-block;padding:0.75rem 2rem;
          border:3px solid #1A1A2E;border-radius:12px;
          background:#FED41D;color:#1A1A2E;
          font-family:'Fredoka',sans-serif;font-size:0.95rem;font-weight:700;
          text-decoration:none;box-shadow:4px 4px 0px #1A1A2E;
          transition:transform 0.1s,box-shadow 0.1s;
        "
        onmouseover="this.style.transform='translate(-2px,-2px)';this.style.boxShadow='6px 6px 0px #1A1A2E'"
        onmouseout="this.style.transform='';this.style.boxShadow='4px 4px 0px #1A1A2E'"
        >${h.servicesCtaLabel}</a>
      </div>
    </div>
  </section>`;
}
function whyUsSection(locale) {
  const t = getTranslation(locale);
  const h = t.home;
  const items = h.whyPoints.map((p, i) => `
    <div class="reveal reveal-d${i + 1}" style="
      display:flex;gap:1rem;align-items:flex-start;padding:1.25rem;
      border:2px solid #1A1A2E22;border-radius:14px;background:#FFFEF7;
      transition:border-color 0.15s,box-shadow 0.15s;
    "
    onmouseover="this.style.borderColor='#FED41D';this.style.boxShadow='4px 4px 0px #FED41D'"
    onmouseout="this.style.borderColor='#1A1A2E22';this.style.boxShadow='none'"
    >
      <div style="font-size:1.75rem;line-height:1;flex-shrink:0;">${p.icon}</div>
      <div>
        <h3 style="font-family:'Bangers',cursive;font-size:1.2rem;letter-spacing:0.04em;color:#1A1A2E;margin-bottom:0.35rem;">${p.title}</h3>
        <p style="font-family:'Fredoka',sans-serif;font-size:0.9rem;color:#2D2D44;line-height:1.6;margin:0;">${p.body}</p>
      </div>
    </div>`).join("");
  return `
  <section class="section" style="background:#1A1A2E;">
    <div class="container">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center;" class="grid-why">
        <div>
          <h2 class="reveal" style="
            font-family:'Bangers',cursive;font-size:clamp(2rem,5vw,3rem);
            letter-spacing:0.05em;color:#FED41D;margin-bottom:1rem;line-height:1.1;
          ">${h.whyHeading}</h2>
          <p class="reveal reveal-d1" style="
            font-family:'Fredoka',sans-serif;font-size:1rem;
            color:#FFFEF799;line-height:1.7;margin-bottom:2rem;
          ">${h.whySubheading}</p>
          <a class="reveal reveal-d2" href="${localePath(locale, "/about")}" style="
            display:inline-block;padding:0.75rem 1.75rem;
            background:#FED41D;color:#1A1A2E;
            border:3px solid #FED41D;border-radius:12px;
            font-family:'Fredoka',sans-serif;font-size:0.95rem;font-weight:700;
            text-decoration:none;box-shadow:4px 4px 0px #F5C400;
          ">${h.whyCtaLabel}</a>
        </div>
        <div style="display:flex;flex-direction:column;gap:1rem;">${items}</div>
      </div>
    </div>
    <style>@media(max-width:768px){.grid-why{grid-template-columns:1fr !important;gap:2rem !important;}}</style>
  </section>`;
}
function testimonialsSection(locale) {
  const t = getTranslation(locale);
  const h = t.home;
  const dt = t.data.testimonials;
  const cards = testimonials.map((tst, i) => {
    const d = dt[i];
    return `
    <div class="reveal reveal-d${i + 1}" style="
      background:#FFFEF7;border:3px solid #1A1A2E;border-radius:16px;
      box-shadow:5px 5px 0px #FED41D;padding:1.75rem;
      display:flex;flex-direction:column;gap:1rem;
    ">
      <div style="color:#FED41D;font-size:1.1rem;letter-spacing:0.1em;">${"\u2605".repeat(tst.rating)}</div>
      <p style="font-family:'Fredoka',sans-serif;font-size:0.95rem;color:#1A1A2E;line-height:1.7;flex:1;font-style:italic;">
        "${d.text}"
      </p>
      <div style="display:flex;align-items:center;gap:0.75rem;padding-top:0.75rem;border-top:2px solid #1A1A2E22;">
        <div style="
          width:40px;height:40px;background:#FED41D;
          border:2px solid #1A1A2E;border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          font-family:'Bangers',cursive;font-size:0.85rem;color:#1A1A2E;flex-shrink:0;
        ">${tst.avatar}</div>
        <div>
          <div style="font-family:'Fredoka',sans-serif;font-size:0.9rem;font-weight:700;color:#1A1A2E;">${tst.name}</div>
          <div style="font-family:'Fredoka',sans-serif;font-size:0.78rem;color:#2D2D44AA;">${tst.role}, ${tst.company}</div>
        </div>
      </div>
    </div>`;
  }).join("");
  return `
  <section class="section" style="background:#F5F5EC;">
    <div class="container">
      <div style="text-align:center;margin-bottom:3rem;">
        <h2 class="reveal" style="
          font-family:'Bangers',cursive;font-size:clamp(2rem,5vw,3rem);
          letter-spacing:0.05em;color:#1A1A2E;margin-bottom:0.75rem;
        ">${h.testimonialsHeading}</h2>
        <p class="reveal reveal-d1" style="
          font-family:'Fredoka',sans-serif;font-size:1rem;color:#2D2D44BB;
          max-width:440px;margin:0 auto;
        ">${h.testimonialsSubheading}</p>
      </div>
      <div class="grid-3">${cards}</div>
    </div>
  </section>`;
}
function homePage(locale) {
  const t = getTranslation(locale);
  const h = t.home;
  const desc = interpolate(t.seo.homeDescription, { description: company.description });
  const content = `
    ${heroSection(locale)}
    <div class="comic-divider"></div>
    ${servicesPreview(locale)}
    ${whyUsSection(locale)}
    <div class="comic-divider"></div>
    ${testimonialsSection(locale)}
    ${ctaSection({
    heading: h.ctaHeading,
    subheading: h.ctaSubheading,
    primaryLabel: h.ctaPrimary,
    primaryHref: localePath(locale, "/contact"),
    secondaryLabel: h.ctaSecondary,
    secondaryHref: localePath(locale, "/portfolio")
  })}
  `;
  return baseLayout({
    title: t.seo.homeTitle,
    description: desc,
    activePage: localePath(locale, "/"),
    locale,
    content
  });
}

// src/pages/services.ts
function servicesHero(locale) {
  const t = getTranslation(locale);
  const s = t.services;
  return `
  <section style="
    background:linear-gradient(160deg,#1A1A2E 0%,#2D2D44 100%);
    padding:5rem 1.5rem 4rem;text-align:center;
  ">
    <div class="container">
      <div class="reveal" style="margin-bottom:1rem;">
        <span style="
          display:inline-block;padding:0.3rem 1rem;
          background:#FED41D22;border:2px solid #FED41D44;border-radius:999px;
          font-family:'Fredoka',sans-serif;font-size:0.85rem;font-weight:600;color:#FED41D;
        ">${s.badge}</span>
      </div>
      <h1 class="reveal reveal-d1" style="
        font-family:'Bangers',cursive;font-size:clamp(2.5rem,7vw,4.5rem);
        letter-spacing:0.05em;color:#FFFEF7;line-height:1.05;margin-bottom:1rem;
      ">${s.heroHeadline1}<br/><span style="color:#FED41D;text-shadow:4px 4px 0 #1A1A2E;">${s.heroHeadline2}</span></h1>
      <p class="reveal reveal-d2" style="
        font-family:'Fredoka',sans-serif;font-size:1.05rem;
        color:#FFFEF7AA;max-width:520px;margin:0 auto;line-height:1.7;
      ">${s.heroDescription}</p>
    </div>
  </section>`;
}
function servicesGrid(locale) {
  const t = getTranslation(locale);
  const ds = t.data.services;
  const cards = services.map((s, i) => {
    const d = ds[i];
    return `<div class="reveal reveal-d${i % 3 + 1}">
      ${card({ title: d.title, body: d.description, icon: s.icon, badge: d.detail })}
    </div>`;
  }).join("");
  return `
  <section class="section">
    <div class="container">
      <div class="grid-3">${cards}</div>
    </div>
  </section>`;
}
function processSection(locale) {
  const t = getTranslation(locale);
  const s = t.services;
  const items = s.steps.map((step, i) => `
    <div class="reveal reveal-d${i + 1}" style="
      display:flex;gap:1.25rem;align-items:flex-start;padding:1.5rem;
      border:3px solid #1A1A2E;border-radius:16px;
      background:#FFFEF7;box-shadow:4px 4px 0 #FED41D;
    ">
      <div style="
        min-width:52px;height:52px;background:#FED41D;
        border:3px solid #1A1A2E;border-radius:12px;
        display:flex;align-items:center;justify-content:center;
        font-family:'Bangers',cursive;font-size:1.3rem;letter-spacing:0.05em;color:#1A1A2E;flex-shrink:0;
      ">${step.num}</div>
      <div>
        <h3 style="font-family:'Bangers',cursive;font-size:1.3rem;letter-spacing:0.04em;color:#1A1A2E;margin-bottom:0.4rem;">${step.title}</h3>
        <p style="font-family:'Fredoka',sans-serif;font-size:0.9rem;color:#2D2D44;line-height:1.6;margin:0;">${step.body}</p>
      </div>
    </div>`).join("");
  return `
  <section class="section" style="background:#1A1A2E;">
    <div class="container">
      <div style="text-align:center;margin-bottom:3rem;">
        <h2 class="reveal" style="
          font-family:'Bangers',cursive;font-size:clamp(2rem,5vw,3rem);
          letter-spacing:0.05em;color:#FED41D;margin-bottom:0.75rem;
        ">${s.processHeading}</h2>
        <p class="reveal reveal-d1" style="font-family:'Fredoka',sans-serif;font-size:1rem;color:#FFFEF799;max-width:440px;margin:0 auto;">
          ${s.processSubheading}
        </p>
      </div>
      <div class="grid-2" style="gap:1.25rem;">${items}</div>
    </div>
  </section>`;
}
function techStackSection(locale) {
  const t = getTranslation(locale);
  const s = t.services;
  const stacks = [
    { cat: "Backend", items: ["Go", "Node.js", "Python", "Rust"] },
    { cat: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind"] },
    { cat: "Mobile", items: ["React Native", "Swift", "Kotlin", "Flutter"] },
    { cat: "Cloud & Infra", items: ["AWS", "GCP", "Kubernetes", "Terraform"] },
    { cat: "Data", items: ["PostgreSQL", "MongoDB", "Kafka", "Redis"] },
    { cat: "AI/ML", items: ["PyTorch", "LangChain", "Hugging Face", "MLflow"] }
  ];
  const groups = stacks.map((st, i) => `
    <div class="reveal reveal-d${i % 3 + 1}" style="
      padding:1.25rem;border:3px solid #FED41D33;border-radius:14px;background:#FFFEF708;
    ">
      <h4 style="font-family:'Bangers',cursive;font-size:1rem;letter-spacing:0.06em;color:#FED41D;margin-bottom:0.75rem;">${st.cat}</h4>
      <div style="display:flex;flex-wrap:wrap;gap:0.4rem;">
        ${st.items.map((it) => `
          <span style="
            padding:0.2rem 0.7rem;background:#FED41D18;
            border:1.5px solid #FED41D44;border-radius:999px;
            font-family:'Fredoka',sans-serif;font-size:0.8rem;font-weight:500;color:#FFFEF7CC;
          ">${it}</span>`).join("")}
      </div>
    </div>`).join("");
  return `
  <section class="section">
    <div class="container">
      <div style="text-align:center;margin-bottom:3rem;">
        <h2 class="reveal" style="
          font-family:'Bangers',cursive;font-size:clamp(2rem,5vw,3rem);
          letter-spacing:0.05em;color:#1A1A2E;margin-bottom:0.75rem;
        ">${s.techHeading}</h2>
        <p class="reveal reveal-d1" style="font-family:'Fredoka',sans-serif;font-size:1rem;color:#2D2D44AA;max-width:400px;margin:0 auto;">
          ${s.techSubheading}
        </p>
      </div>
      <div class="grid-3" style="gap:1.25rem;">${groups}</div>
    </div>
  </section>`;
}
function servicesPage(locale) {
  const t = getTranslation(locale);
  const s = t.services;
  const content = `
    ${servicesHero(locale)}
    <div class="comic-divider"></div>
    ${servicesGrid(locale)}
    ${processSection(locale)}
    <div class="comic-divider"></div>
    ${techStackSection(locale)}
    ${ctaSection({
    heading: s.ctaHeading,
    subheading: s.ctaSubheading,
    primaryLabel: s.ctaPrimary,
    primaryHref: localePath(locale, "/contact"),
    secondaryLabel: s.ctaSecondary,
    secondaryHref: localePath(locale, "/portfolio")
  })}
  `;
  return baseLayout({
    title: t.seo.servicesTitle,
    description: t.seo.servicesDescription,
    activePage: localePath(locale, "/services"),
    locale,
    content
  });
}

// src/components/badge.ts
function badge(text, variant = "yellow") {
  const styles = {
    yellow: "background:#FED41D;color:#1A1A2E;",
    sky: "background:#87CEEB;color:#1A1A2E;",
    ink: "background:#1A1A2E;color:#FED41D;",
    coral: "background:#FF6B6B;color:#fff;"
  };
  return `<span style="
    display:inline-block;
    padding:2px 10px;
    border-radius:999px;
    border:2px solid #1A1A2E;
    font-family:'Fredoka',sans-serif;
    font-size:0.75rem;
    font-weight:600;
    letter-spacing:0.03em;
    ${styles[variant]}
  ">${text}</span>`;
}

// src/pages/portfolio.ts
function portfolioHero(locale) {
  const t = getTranslation(locale);
  const p = t.portfolio;
  return `
  <section style="
    background:linear-gradient(160deg,#1A1A2E 0%,#2D2D44 100%);
    padding:5rem 1.5rem 4rem;text-align:center;
  ">
    <div class="container">
      <div class="reveal" style="margin-bottom:1rem;">
        <span style="
          display:inline-block;padding:0.3rem 1rem;
          background:#FED41D22;border:2px solid #FED41D44;border-radius:999px;
          font-family:'Fredoka',sans-serif;font-size:0.85rem;font-weight:600;color:#FED41D;
        ">${p.badge}</span>
      </div>
      <h1 class="reveal reveal-d1" style="
        font-family:'Bangers',cursive;font-size:clamp(2.5rem,7vw,4.5rem);
        letter-spacing:0.05em;color:#FFFEF7;line-height:1.05;margin-bottom:1rem;
      ">${p.heroHeadline1}<br/><span style="color:#FED41D;text-shadow:4px 4px 0 #1A1A2E;">${p.heroHeadline2}</span></h1>
      <p class="reveal reveal-d2" style="
        font-family:'Fredoka',sans-serif;font-size:1.05rem;
        color:#FFFEF7AA;max-width:500px;margin:0 auto;line-height:1.7;
      ">${p.heroDescription}</p>
    </div>
  </section>`;
}
function featuredProject(locale) {
  const t = getTranslation(locale);
  const featured = portfolios[0];
  const dp = t.data.portfolios[0];
  const techBadges = featured.tech.map((tech) => badge(tech, "sky")).join(" ");
  return `
  <section class="section">
    <div class="container">
      <div class="reveal" style="margin-bottom:1rem;">
        <span style="
          font-family:'Fredoka',sans-serif;font-size:0.85rem;font-weight:700;
          color:#FED41D;letter-spacing:0.08em;text-transform:uppercase;
        ">${t.ui.featuredProject}</span>
      </div>
      <div style="
        border:3px solid #1A1A2E;border-radius:20px;
        box-shadow:8px 8px 0 #FED41D;overflow:hidden;
        display:grid;grid-template-columns:1fr 1fr;
      " class="featured-grid">
        <div style="
          background:linear-gradient(135deg,#1A1A2E 0%,#2D2D44 100%);
          padding:3rem 2.5rem;display:flex;flex-direction:column;justify-content:center;gap:1.5rem;
          border-right:3px solid #FED41D;
        ">
          <div style="font-family:'Bangers',cursive;font-size:5rem;line-height:1;">\u{1F3E6}</div>
          <h2 style="font-family:'Bangers',cursive;font-size:2.5rem;letter-spacing:0.05em;color:#FED41D;line-height:1.1;margin:0;">
            ${featured.title}
          </h2>
          <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">${techBadges}</div>
          <div style="
            display:inline-flex;align-items:center;gap:0.5rem;padding:0.5rem 1rem;
            background:#FED41D;border:2px solid #1A1A2E;border-radius:10px;width:fit-content;
          ">
            <span style="font-family:'Bangers',cursive;font-size:1rem;color:#1A1A2E;letter-spacing:0.04em;">
              \u{1F4CA} ${dp.result}
            </span>
          </div>
        </div>
        <div style="padding:3rem 2.5rem;background:#FFFEF7;display:flex;flex-direction:column;justify-content:center;gap:1.25rem;">
          ${badge(featured.category, "yellow")}
          <h3 style="font-family:'Bangers',cursive;font-size:1.5rem;letter-spacing:0.04em;color:#1A1A2E;margin:0;">${featured.title}</h3>
          <p style="font-family:'Fredoka',sans-serif;font-size:0.95rem;color:#2D2D44;line-height:1.7;margin:0;">${dp.description}</p>
          <div style="padding:1rem;background:#FED41D18;border:2px solid #FED41D;border-radius:12px;">
            <span style="font-family:'Fredoka',sans-serif;font-size:0.85rem;font-weight:600;color:#1A1A2E;">
              \u{1F5D3} ${featured.year} \xB7 ${dp.result}
            </span>
          </div>
        </div>
      </div>
    </div>
    <style>
      @media(max-width:768px){
        .featured-grid{grid-template-columns:1fr !important;}
        .featured-grid > div:first-child{border-right:none !important;border-bottom:3px solid #FED41D;}
      }
    </style>
  </section>`;
}
function portfolioGrid(locale) {
  const t = getTranslation(locale);
  const rest = portfolios.slice(1);
  const dps = t.data.portfolios.slice(1);
  const EMOJIS = ["\u{1F6D2}", "\u{1F4DA}", "\u{1F69B}", "\u{1F4A1}"];
  const cards = rest.map((p, i) => {
    const dp = dps[i];
    const emoji = EMOJIS[i] ?? "\u2B50";
    const techStr = p.tech.join(" \xB7 ");
    return `
    <div class="reveal reveal-d${i + 1}" style="perspective:800px;">
      <div class="trade-card" onclick="this.classList.toggle('flipped')" style="
        position:relative;
        width:100%;padding-top:140%;
        transform-style:preserve-3d;
        transition:transform 0.55s cubic-bezier(.4,0,.2,1);
        cursor:pointer;
      ">
        <!-- FRONT -->
        <div style="
          position:absolute;inset:0;
          backface-visibility:hidden;-webkit-backface-visibility:hidden;
          background:linear-gradient(135deg,#1A1A2E,#2D2D44);
          border:3px solid #FED41D;border-radius:16px;
          box-shadow:5px 5px 0 #FED41D44;
          display:flex;flex-direction:column;align-items:center;
          justify-content:center;gap:1rem;padding:1.5rem;
          text-align:center;
        ">
          <div style="
            font-size:3.5rem;line-height:1;
            filter:drop-shadow(0 4px 8px #00000088);
          ">${emoji}</div>
          <h3 style="
            font-family:'Bangers',cursive;font-size:1.5rem;
            letter-spacing:0.05em;color:#FED41D;margin:0;line-height:1.2;
          ">${p.title}</h3>
          <div style="
            padding:0.3rem 0.9rem;
            background:#FED41D22;border:1.5px solid #FED41D44;border-radius:999px;
            font-family:'Fredoka',sans-serif;font-size:0.78rem;color:#FED41DAA;
          ">${p.category}</div>
          <div style="
            margin-top:auto;
            font-family:'Fredoka',sans-serif;font-size:0.75rem;color:#FFFEF755;
            letter-spacing:0.04em;
          ">${locale === "en" ? "tap to flip \u21BB" : "ketuk untuk balik \u21BB"}</div>
        </div>

        <!-- BACK -->
        <div style="
          position:absolute;inset:0;
          backface-visibility:hidden;-webkit-backface-visibility:hidden;
          transform:rotateY(180deg);
          background:#FFFEF7;
          border:3px solid #1A1A2E;border-radius:16px;
          box-shadow:5px 5px 0 #1A1A2E;
          display:flex;flex-direction:column;gap:0.75rem;
          padding:1.5rem;
          overflow:hidden;
        ">
          <div style="font-family:'Bangers',cursive;font-size:1.1rem;letter-spacing:0.05em;color:#1A1A2E;">${p.title}</div>
          <p style="font-family:'Fredoka',sans-serif;font-size:0.82rem;color:#2D2D44;line-height:1.5;margin:0;flex:1;">${dp.description}</p>
          <div style="
            padding:0.5rem 0.75rem;
            background:#1A1A2E;border-radius:8px;
            font-family:'Fredoka',sans-serif;font-size:0.78rem;
            color:#FED41D;font-weight:600;
          ">\u{1F6E0} ${techStr}</div>
          <div style="
            padding:0.5rem 0.75rem;
            background:#FED41D18;border:2px solid #FED41D66;border-radius:8px;
            font-family:'Fredoka',sans-serif;font-size:0.78rem;
            color:#1A1A2E;font-weight:700;
          ">\u{1F4CA} ${dp.result}</div>
          <div style="
            font-family:'Fredoka',sans-serif;font-size:0.7rem;
            color:#1A1A2E88;text-align:right;
          ">${p.year}</div>
        </div>
      </div>
    </div>`;
  }).join("");
  return `
  <section class="section" style="background:#F5F5EC;">
    <div class="container">
      <h2 class="reveal" style="
        font-family:'Bangers',cursive;font-size:clamp(1.8rem,4vw,2.5rem);
        letter-spacing:0.05em;color:#1A1A2E;margin-bottom:0.5rem;
      ">${t.ui.otherProjects}</h2>
      <p class="reveal reveal-d1" style="
        font-family:'Fredoka',sans-serif;font-size:0.88rem;color:#2D2D44AA;margin-bottom:2rem;
      ">${locale === "en" ? "Tap a card to flip and reveal the tech stack." : "Ketuk kartu untuk balik dan lihat tech stack-nya."}</p>
      <div class="grid-3" style="gap:1.5rem;">${cards}</div>
    </div>
  </section>

  <style>
    .trade-card.flipped { transform: rotateY(180deg); }
  </style>`;
}
function portfolioStats(locale) {
  const t = getTranslation(locale);
  const p = t.portfolio;
  return `
  <section class="section-sm" style="background:#1A1A2E;">
    <div class="container">
      ${statsStrip([
    { value: "500", label: p.stats[0].label, suffix: "+" },
    { value: "200", label: p.stats[1].label, suffix: "+" },
    { value: "99.9", label: p.stats[2].label, suffix: "%" },
    { value: "4.9", label: p.stats[3].label, suffix: "/5" }
  ], true)}
    </div>
  </section>`;
}
function portfolioPage(locale) {
  const t = getTranslation(locale);
  const p = t.portfolio;
  const content = `
    ${portfolioHero(locale)}
    <div class="comic-divider"></div>
    ${featuredProject(locale)}
    ${portfolioGrid(locale)}
    ${portfolioStats(locale)}
    ${ctaSection({
    heading: p.ctaHeading,
    subheading: p.ctaSubheading,
    primaryLabel: p.ctaPrimary,
    primaryHref: localePath(locale, "/contact"),
    secondaryLabel: p.ctaSecondary,
    secondaryHref: localePath(locale, "/services")
  })}
  `;
  return baseLayout({
    title: t.seo.portfolioTitle,
    description: t.seo.portfolioDescription,
    activePage: localePath(locale, "/portfolio"),
    locale,
    content
  });
}

// src/pages/about.ts
function aboutHero(locale) {
  const t = getTranslation(locale);
  const a = t.about;
  const desc = interpolate(a.heroDescription, { founded: company.founded });
  return `
  <section style="
    background:linear-gradient(160deg,#1A1A2E 0%,#2D2D44 100%);
    padding:5rem 1.5rem 4rem;text-align:center;
  ">
    <div class="container">
      <div class="reveal" style="margin-bottom:1rem;">
        <span style="
          display:inline-block;padding:0.3rem 1rem;
          background:#FED41D22;border:2px solid #FED41D44;border-radius:999px;
          font-family:'Fredoka',sans-serif;font-size:0.85rem;font-weight:600;color:#FED41D;
        ">${a.badge}</span>
      </div>
      <h1 class="reveal reveal-d1" style="
        font-family:'Bangers',cursive;font-size:clamp(2.5rem,7vw,4.5rem);
        letter-spacing:0.05em;color:#FFFEF7;line-height:1.05;margin-bottom:1rem;
      ">${a.heroHeadline1}<br/><span style="color:#FED41D;text-shadow:4px 4px 0 #1A1A2E;">${a.heroHeadline2}</span></h1>
      <p class="reveal reveal-d2" style="
        font-family:'Fredoka',sans-serif;font-size:1.05rem;
        color:#FFFEF7AA;max-width:520px;margin:0 auto;line-height:1.7;
      ">${desc}</p>
    </div>
  </section>`;
}
function storySection(locale) {
  const t = getTranslation(locale);
  const a = t.about;
  const vars = {
    founded: company.founded,
    employees: company.employees,
    projects: company.projects,
    clients: company.clients
  };
  const paragraphs = a.storyParagraphs.map(
    (p) => `<p class="reveal reveal-d${a.storyParagraphs.indexOf(p) + 1}" style="
      font-family:'Fredoka',sans-serif;font-size:0.95rem;color:#2D2D44;line-height:1.7;margin:0;
    ">${interpolate(p, vars)}</p>`
  ).join("");
  const timelineItems = a.timeline.map((item, i) => `
    <div style="display:flex;gap:1rem;align-items:flex-start;position:relative;">
      <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0;">
        <div style="
          width:44px;height:44px;background:#FED41D;border:3px solid #1A1A2E;
          border-radius:50%;display:flex;align-items:center;justify-content:center;
          font-family:'Bangers',cursive;font-size:0.78rem;color:#1A1A2E;letter-spacing:0.02em;flex-shrink:0;
        ">${item.year}</div>
        ${i < a.timeline.length - 1 ? `<div style="width:3px;height:40px;background:#FED41D44;margin:2px 0;"></div>` : ""}
      </div>
      <div style="padding:0.5rem 0 ${i < a.timeline.length - 1 ? "1.5rem" : "0"};">
        <p style="font-family:'Fredoka',sans-serif;font-size:0.9rem;color:#2D2D44;line-height:1.6;margin:0;">${item.event}</p>
      </div>
    </div>`).join("");
  return `
  <section class="section">
    <div class="container">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center;" class="story-grid">
        <div>
          <h2 class="reveal" style="
            font-family:'Bangers',cursive;font-size:clamp(2rem,5vw,3rem);
            letter-spacing:0.05em;color:#1A1A2E;margin-bottom:1.5rem;line-height:1.1;
          ">${a.storyHeading}</h2>
          <div style="display:flex;flex-direction:column;gap:1rem;">${paragraphs}</div>
        </div>
        <div class="reveal reveal-d2" style="display:flex;flex-direction:column;gap:0;">
          ${timelineItems}
        </div>
      </div>
    </div>
    <style>@media(max-width:768px){.story-grid{grid-template-columns:1fr !important;gap:2.5rem !important;}}</style>
  </section>`;
}
function statsSection(locale) {
  const t = getTranslation(locale);
  const a = t.about;
  return `
  <section class="section-sm" style="background:#FED41D;border-top:4px solid #1A1A2E;border-bottom:4px solid #1A1A2E;">
    <div class="container">
      ${statsStrip([
    { value: company.founded, label: a.stats[0].label, suffix: "" },
    { value: company.employees, label: a.stats[1].label, suffix: "" },
    { value: company.projects, label: a.stats[2].label, suffix: "" },
    { value: company.clients, label: a.stats[3].label, suffix: "" }
  ], false)}
    </div>
  </section>`;
}
function teamSection(locale) {
  const t = getTranslation(locale);
  const a = t.about;
  const dts = t.data.team;
  const cards = team.map((m, i) => {
    const d = dts[i];
    return `
    <div class="reveal reveal-d${i + 1} comic-card" style="
      background:#FFFEF7;border:3px solid #1A1A2E;border-radius:16px;
      box-shadow:5px 5px 0 #1A1A2E;padding:1.75rem;
      display:flex;flex-direction:column;gap:1rem;
      transition:transform 0.15s,box-shadow 0.15s;
    ">
      <div style="display:flex;align-items:center;gap:1rem;">
        <div style="
          width:56px;height:56px;background:#FED41D;
          border:3px solid #1A1A2E;border-radius:14px;box-shadow:3px 3px 0 #1A1A2E;
          display:flex;align-items:center;justify-content:center;
          font-family:'Bangers',cursive;font-size:1.2rem;color:#1A1A2E;flex-shrink:0;
        ">${m.initials}</div>
        <div>
          <div style="font-family:'Bangers',cursive;font-size:1.2rem;letter-spacing:0.04em;color:#1A1A2E;">${m.name}</div>
          <div style="font-family:'Fredoka',sans-serif;font-size:0.82rem;font-weight:600;color:#5BA8D4;">${m.role}</div>
        </div>
      </div>
      <p style="font-family:'Fredoka',sans-serif;font-size:0.88rem;color:#2D2D44;line-height:1.6;margin:0;flex:1;">${d.bio}</p>
      <div style="
        padding:0.6rem 0.9rem;background:#FED41D18;
        border:2px solid #FED41D66;border-radius:8px;
        font-family:'Fredoka',sans-serif;font-size:0.8rem;font-weight:500;color:#1A1A2E;
      ">\u{1F4A1} ${d.funFact}</div>
    </div>`;
  }).join("");
  return `
  <section class="section">
    <div class="container">
      <div style="text-align:center;margin-bottom:3rem;">
        <h2 class="reveal" style="
          font-family:'Bangers',cursive;font-size:clamp(2rem,5vw,3rem);
          letter-spacing:0.05em;color:#1A1A2E;margin-bottom:0.75rem;
        ">${a.teamHeading}</h2>
        <p class="reveal reveal-d1" style="font-family:'Fredoka',sans-serif;font-size:1rem;color:#2D2D44AA;max-width:440px;margin:0 auto;">
          ${a.teamSubheading}
        </p>
      </div>
      <div class="grid-2" style="gap:1.5rem;">${cards}</div>
    </div>
  </section>`;
}
function valuesSection(locale) {
  const t = getTranslation(locale);
  const a = t.about;
  const items = a.values.map((v, i) => `
    <div class="reveal reveal-d${i + 1}" style="
      text-align:center;padding:2rem 1.5rem;
      border:3px solid #FED41D33;border-radius:16px;background:#FFFEF708;
      transition:border-color 0.15s,background 0.15s;
    "
    onmouseover="this.style.borderColor='#FED41D';this.style.background='#FED41D11'"
    onmouseout="this.style.borderColor='#FED41D33';this.style.background='#FFFEF708'"
    >
      <div style="font-size:2.5rem;margin-bottom:1rem;">${v.icon}</div>
      <h3 style="font-family:'Bangers',cursive;font-size:1.2rem;letter-spacing:0.04em;color:#FED41D;margin-bottom:0.5rem;">${v.title}</h3>
      <p style="font-family:'Fredoka',sans-serif;font-size:0.88rem;color:#FFFEF799;line-height:1.6;margin:0;">${v.body}</p>
    </div>`).join("");
  return `
  <section class="section" style="background:#1A1A2E;">
    <div class="container">
      <div style="text-align:center;margin-bottom:3rem;">
        <h2 class="reveal" style="
          font-family:'Bangers',cursive;font-size:clamp(2rem,5vw,3rem);
          letter-spacing:0.05em;color:#FED41D;margin-bottom:0.75rem;
        ">${a.valuesHeading}</h2>
      </div>
      <div class="grid-4" style="gap:1.25rem;">${items}</div>
    </div>
  </section>`;
}
function aboutPage(locale) {
  const t = getTranslation(locale);
  const a = t.about;
  const desc = interpolate(t.seo.aboutDescription, {
    name: company.name,
    tagline: company.tagline,
    founded: company.founded,
    employees: company.employees,
    projects: company.projects
  });
  const content = `
    ${aboutHero(locale)}
    <div class="comic-divider"></div>
    ${storySection(locale)}
    ${statsSection(locale)}
    ${teamSection(locale)}
    ${valuesSection(locale)}
    ${ctaSection({
    heading: a.ctaHeading,
    subheading: a.ctaSubheading,
    primaryLabel: a.ctaPrimary,
    primaryHref: localePath(locale, "/contact"),
    secondaryLabel: a.ctaSecondary,
    secondaryHref: localePath(locale, "/contact")
  })}
  `;
  return baseLayout({
    title: t.seo.aboutTitle,
    description: desc,
    activePage: localePath(locale, "/about"),
    locale,
    content
  });
}

// src/pages/contact.ts
function contactHero(locale) {
  const t = getTranslation(locale);
  const c = t.contact;
  return `
  <section style="
    background:linear-gradient(160deg,#1A1A2E 0%,#2D2D44 100%);
    padding:5rem 1.5rem 4rem;text-align:center;
  ">
    <div class="container">
      <div class="reveal" style="margin-bottom:1rem;">
        <span style="
          display:inline-block;padding:0.3rem 1rem;
          background:#FED41D22;border:2px solid #FED41D44;border-radius:999px;
          font-family:'Fredoka',sans-serif;font-size:0.85rem;font-weight:600;color:#FED41D;
        ">${c.badge}</span>
      </div>
      <h1 class="reveal reveal-d1" style="
        font-family:'Bangers',cursive;font-size:clamp(2.5rem,7vw,4.5rem);
        letter-spacing:0.05em;color:#FFFEF7;line-height:1.05;margin-bottom:1rem;
      ">${c.heroHeadline1}<br/><span style="color:#FED41D;text-shadow:4px 4px 0 #1A1A2E;">${c.heroHeadline2}</span></h1>
      <p class="reveal reveal-d2" style="
        font-family:'Fredoka',sans-serif;font-size:1.05rem;
        color:#FFFEF7AA;max-width:480px;margin:0 auto;line-height:1.7;
      ">${c.heroDescription}</p>
    </div>
  </section>`;
}
function inputField(id2, label, type, placeholder) {
  return `
  <div style="display:flex;flex-direction:column;gap:0.4rem;">
    <label for="${id2}" style="font-family:'Fredoka',sans-serif;font-size:0.85rem;font-weight:600;color:#1A1A2E;">
      ${label} <span style="color:#FF6B6B;">*</span>
    </label>
    <input type="${type}" id="${id2}" name="${id2}" placeholder="${placeholder}" required style="
      padding:0.7rem 1rem;border:2.5px solid #1A1A2E;border-radius:10px;
      font-family:'Fredoka',sans-serif;font-size:0.95rem;color:#1A1A2E;
      background:#FFFEF7;outline:none;transition:border-color 0.15s,box-shadow 0.15s;
    "
    onfocus="this.style.borderColor='#FED41D';this.style.boxShadow='0 0 0 3px #FED41D44'"
    onblur="this.style.borderColor='#1A1A2E';this.style.boxShadow='none'"
    />
  </div>`;
}
function selectField(id2, label, placeholder, options) {
  const opts = options.map(
    (o) => `<option value="${o.toLowerCase().replace(/\s+/g, "-")}">${o}</option>`
  ).join("");
  return `
  <div style="display:flex;flex-direction:column;gap:0.4rem;">
    <label for="${id2}" style="font-family:'Fredoka',sans-serif;font-size:0.85rem;font-weight:600;color:#1A1A2E;">
      ${label} <span style="color:#FF6B6B;">*</span>
    </label>
    <select id="${id2}" name="${id2}" required style="
      padding:0.7rem 1rem;border:2.5px solid #1A1A2E;border-radius:10px;
      font-family:'Fredoka',sans-serif;font-size:0.95rem;color:#1A1A2E;
      background:#FFFEF7;outline:none;cursor:pointer;transition:border-color 0.15s;
    "
    onfocus="this.style.borderColor='#FED41D'"
    onblur="this.style.borderColor='#1A1A2E'"
    >
      <option value="" disabled selected>${placeholder}</option>
      ${opts}
    </select>
  </div>`;
}
function textareaField(id2, label, placeholder) {
  return `
  <div style="display:flex;flex-direction:column;gap:0.4rem;">
    <label for="${id2}" style="font-family:'Fredoka',sans-serif;font-size:0.85rem;font-weight:600;color:#1A1A2E;">
      ${label} <span style="color:#FF6B6B;">*</span>
    </label>
    <textarea id="${id2}" name="${id2}" placeholder="${placeholder}" required rows="5" style="
      padding:0.7rem 1rem;border:2.5px solid #1A1A2E;border-radius:10px;
      font-family:'Fredoka',sans-serif;font-size:0.95rem;color:#1A1A2E;
      background:#FFFEF7;outline:none;resize:vertical;transition:border-color 0.15s,box-shadow 0.15s;
    "
    onfocus="this.style.borderColor='#FED41D';this.style.boxShadow='0 0 0 3px #FED41D44'"
    onblur="this.style.borderColor='#1A1A2E';this.style.boxShadow='none'"
    ></textarea>
  </div>`;
}
function infoCard(icon, title, body) {
  return `
  <div class="reveal" style="
    background:#FFFEF7;border:3px solid #1A1A2E;border-radius:14px;
    box-shadow:4px 4px 0 #1A1A2E;padding:1.25rem;
    display:flex;gap:1rem;align-items:flex-start;
  ">
    <div style="font-size:1.5rem;line-height:1;flex-shrink:0;">${icon}</div>
    <div>
      <div style="font-family:'Bangers',cursive;font-size:1rem;letter-spacing:0.04em;color:#1A1A2E;margin-bottom:0.25rem;">${title}</div>
      <div style="font-family:'Fredoka',sans-serif;font-size:0.88rem;color:#2D2D44;line-height:1.5;">${body}</div>
    </div>
  </div>`;
}
function socialLink(code, label, href) {
  return `
  <a href="${href}" target="_blank" rel="noopener noreferrer" style="
    display:flex;align-items:center;gap:0.75rem;padding:0.6rem 0.75rem;
    border:2px solid #FED41D22;border-radius:8px;
    text-decoration:none;transition:border-color 0.15s,background 0.15s;
  "
  onmouseover="this.style.borderColor='#FED41D';this.style.background='#FED41D11'"
  onmouseout="this.style.borderColor='#FED41D22';this.style.background='transparent'"
  >
    <span style="
      width:28px;height:28px;background:#FED41D22;border:1.5px solid #FED41D44;
      border-radius:6px;display:flex;align-items:center;justify-content:center;
      font-family:'Bangers',cursive;font-size:0.7rem;color:#FED41D;flex-shrink:0;
    ">${code.toUpperCase()}</span>
    <span style="font-family:'Fredoka',sans-serif;font-size:0.88rem;font-weight:500;color:#FFFEF7CC;">${label}</span>
  </a>`;
}
function contactForm(locale) {
  const t = getTranslation(locale);
  const c = t.contact;
  const f = c.fields;
  return `
  <section class="section">
    <div class="container">
      <div style="display:grid;grid-template-columns:3fr 2fr;gap:3rem;align-items:start;" class="contact-grid">

        <!-- Form -->
        <div class="reveal" style="
          background:#FFFEF7;border:3px solid #1A1A2E;border-radius:20px;
          box-shadow:8px 8px 0 #FED41D;padding:2.5rem;
        ">
          <h2 style="font-family:'Bangers',cursive;font-size:1.8rem;letter-spacing:0.05em;color:#1A1A2E;margin-bottom:0.5rem;">
            ${c.formHeading}
          </h2>
          <p style="font-family:'Fredoka',sans-serif;font-size:0.9rem;color:#2D2D44AA;margin-bottom:2rem;">
            ${c.formSubheading}
          </p>

          <form id="contact-form" style="display:flex;flex-direction:column;gap:1.25rem;"
            onsubmit="handleContactSubmit(event)">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;" class="form-row">
              ${inputField("name", f.name, "text", f.namePlaceholder)}
              ${inputField("email", f.email, "email", f.emailPlaceholder)}
            </div>
            ${inputField("company", f.company, "text", f.companyPlaceholder)}
            ${selectField("service", f.service, f.servicePlaceholder, f.serviceOptions)}
            ${textareaField("message", f.message, f.messagePlaceholder)}

            <button type="submit" id="submit-btn" style="
              padding:0.9rem 2rem;background:#FED41D;color:#1A1A2E;
              border:3px solid #1A1A2E;border-radius:12px;
              font-family:'Fredoka',sans-serif;font-size:1rem;font-weight:700;
              cursor:pointer;box-shadow:5px 5px 0 #1A1A2E;
              transition:transform 0.1s,box-shadow 0.1s;align-self:flex-start;
            "
            onmouseover="this.style.transform='translate(-2px,-2px)';this.style.boxShadow='7px 7px 0 #1A1A2E'"
            onmouseout="this.style.transform='';this.style.boxShadow='5px 5px 0 #1A1A2E'"
            >${c.submitLabel}</button>
          </form>

          <div id="form-success" style="display:none;
            margin-top:1.5rem;padding:1rem 1.25rem;
            background:#4CAF5018;border:2px solid #4CAF50;border-radius:12px;
            font-family:'Fredoka',sans-serif;font-size:0.95rem;color:#2D6A2D;
          ">${c.successMessage}</div>
          <div id="form-error" style="display:none;
            margin-top:1.5rem;padding:1rem 1.25rem;
            background:#FF6B6B18;border:2px solid #FF6B6B;border-radius:12px;
            font-family:'Fredoka',sans-serif;font-size:0.95rem;color:#8B0000;
          ">${c.errorMessage}</div>
        </div>

        <!-- Sidebar -->
        <div style="display:flex;flex-direction:column;gap:1.5rem;">
          ${infoCard("\u{1F4CD}", c.infoAddress, company.address)}
          ${infoCard("\u2709\uFE0F", c.infoEmail, `<a href="mailto:${company.email}" style="color:#5BA8D4;text-decoration:none;">${company.email}</a>`)}
          ${infoCard("\u{1F4DE}", c.infoPhone, `<a href="tel:${company.phone.replace(/\s/g, "")}" style="color:#5BA8D4;text-decoration:none;">${company.phone}</a>`)}

          <div class="reveal" style="
            background:#1A1A2E;border:3px solid #FED41D;border-radius:16px;
            box-shadow:5px 5px 0 #FED41D44;padding:1.5rem;
          ">
            <h3 style="font-family:'Bangers',cursive;font-size:1.1rem;letter-spacing:0.05em;color:#FED41D;margin-bottom:1rem;">
              ${c.socialHeading}
            </h3>
            <div style="display:flex;flex-direction:column;gap:0.5rem;">
              ${socialLink("in", "LinkedIn", company.social.linkedin)}
              ${socialLink("tw", "Twitter / X", company.social.twitter)}
              ${socialLink("gh", "GitHub", company.social.github)}
              ${socialLink("ig", "Instagram", company.social.instagram)}
            </div>
          </div>
        </div>
      </div>
    </div>
    <style>
      @media(max-width:768px){
        .contact-grid{grid-template-columns:1fr !important;}
        .form-row{grid-template-columns:1fr !important;}
      }
    </style>
  </section>`;
}
function contactScript(locale) {
  const t = getTranslation(locale);
  const apiPath = localePath(locale, "/api/contact");
  const sending = t.ui.sending;
  const submit = t.contact.submitLabel;
  return `
  <script>
    async function handleContactSubmit(e) {
      e.preventDefault();
      var btn     = document.getElementById('submit-btn');
      var success = document.getElementById('form-success');
      var error   = document.getElementById('form-error');
      var form    = document.getElementById('contact-form');
      btn.disabled    = true;
      btn.textContent = '${sending}';
      success.style.display = 'none';
      error.style.display   = 'none';
      var data = {
        name:    form.name.value,
        email:   form.email.value,
        company: form.company.value,
        service: form.service.value,
        message: form.message.value,
      };
      try {
        var res = await fetch('${apiPath}', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          success.style.display = 'block';
          form.reset();
          if (typeof window.__sptDonutConfetti === 'function') window.__sptDonutConfetti(80);
        } else {
          error.style.display = 'block';
        }
      } catch (_) {
        error.style.display = 'block';
      } finally {
        btn.disabled    = false;
        btn.textContent = '${submit}';
      }
    }
  </script>`;
}
function contactPage(locale) {
  const t = getTranslation(locale);
  const desc = interpolate(t.seo.contactDescription, { name: company.name });
  const content = `
    ${contactHero(locale)}
    <div class="comic-divider"></div>
    ${contactForm(locale)}
    ${contactScript(locale)}
  `;
  return baseLayout({
    title: t.seo.contactTitle,
    description: desc,
    activePage: localePath(locale, "/contact"),
    locale,
    content
  });
}

// src/pages/faq.ts
function faqHero(locale) {
  const t = getTranslation(locale);
  const f = t.faq;
  return `
  <section style="
    background:linear-gradient(160deg,#1A1A2E 0%,#2D2D44 100%);
    padding:5rem 1.5rem 4rem;text-align:center;overflow:hidden;position:relative;
  ">
    <!-- Decorative beer mug SVG (100% generic, no IP) -->
    <div style="
      position:absolute;right:5%;top:50%;transform:translateY(-50%);
      font-size:clamp(4rem,10vw,8rem);opacity:0.08;pointer-events:none;
      line-height:1;
    ">\u{1F37A}</div>
    <div class="container">
      <div class="reveal" style="margin-bottom:1rem;">
        <span style="
          display:inline-block;padding:0.3rem 1rem;
          background:#FED41D22;border:2px solid #FED41D44;border-radius:999px;
          font-family:'Fredoka',sans-serif;font-size:0.85rem;font-weight:600;color:#FED41D;
        ">${f.badge}</span>
      </div>
      <h1 class="reveal reveal-d1" style="
        font-family:'Bangers',cursive;font-size:clamp(2.5rem,7vw,4.5rem);
        letter-spacing:0.05em;color:#FFFEF7;line-height:1.05;margin-bottom:1rem;
      ">${f.heroHeadline1}<br/><span style="color:#FED41D;text-shadow:4px 4px 0 #1A1A2E;">${f.heroHeadline2}</span></h1>
      <p class="reveal reveal-d2" style="
        font-family:'Fredoka',sans-serif;font-size:1.05rem;
        color:#FFFEF7AA;max-width:500px;margin:0 auto;line-height:1.7;
      ">${f.heroDescription}</p>
    </div>
  </section>`;
}
function faqAccordion(locale) {
  const t = getTranslation(locale);
  const items = t.faq.items;
  const entries = items.map((item, i) => `
    <!-- FAQ item ${i} -->
    <div class="faq-item reveal reveal-d${i % 4 + 1}" style="
      border:3px solid #1A1A2E;
      border-radius:16px;
      overflow:hidden;
      box-shadow:4px 4px 0 #1A1A2E;
      transition:box-shadow 0.15s;
    ">
      <!-- Question bubble (Moe asking) -->
      <button onclick="toggleFaq(${i})" style="
        width:100%;
        background:#FED41D;
        border:none;cursor:pointer;
        padding:1.25rem 1.5rem;
        display:flex;align-items:center;gap:1rem;
        text-align:left;
      ">
        <div style="
          width:38px;height:38px;flex-shrink:0;
          background:#1A1A2E;
          border:2px solid #1A1A2E;
          border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          font-size:1.2rem;
        ">\u{1F64B}</div>
        <span style="
          font-family:'Fredoka',sans-serif;font-size:1rem;font-weight:700;
          color:#1A1A2E;flex:1;line-height:1.4;
        ">${item.q}</span>
        <span id="faq-icon-${i}" style="
          font-size:1.4rem;color:#1A1A2E;transition:transform 0.25s;
          flex-shrink:0;font-weight:700;
        ">+</span>
      </button>

      <!-- Answer bubble (Moe answering) -->
      <div id="faq-answer-${i}" style="
        display:none;
        background:#FFFEF7;
        border-top:3px solid #1A1A2E;
        padding:0;
        overflow:hidden;
      ">
        <div style="display:flex;gap:1rem;align-items:flex-start;padding:1.25rem 1.5rem;">
          <div style="
            width:38px;height:38px;flex-shrink:0;
            background:#87CEEB;
            border:2px solid #1A1A2E;
            border-radius:50%;
            display:flex;align-items:center;justify-content:center;
            font-size:1.2rem;margin-top:0.15rem;
          ">\u{1F37A}</div>
          <div style="
            background:#F0F8FF;
            border:2px solid #87CEEB;
            border-radius:0 14px 14px 14px;
            padding:0.9rem 1.1rem;
            flex:1;
          ">
            <p style="
              font-family:'Fredoka',sans-serif;font-size:0.95rem;
              color:#1A1A2E;line-height:1.7;margin:0;
            ">${item.a}</p>
          </div>
        </div>
      </div>
    </div>`).join("");
  return `
  <section class="section">
    <div class="container" style="max-width:800px;">
      <div style="display:flex;flex-direction:column;gap:1rem;">
        ${entries}
      </div>
    </div>
  </section>

  <script>
    function toggleFaq(idx) {
      var ans  = document.getElementById('faq-answer-' + idx);
      var icon = document.getElementById('faq-icon-' + idx);
      var open = ans.style.display === 'block';
      ans.style.display  = open ? 'none' : 'block';
      icon.textContent   = open ? '+' : '\u2212';
      icon.style.transform = open ? '' : 'rotate(45deg)';
    }
  </script>`;
}
function faqPage(locale) {
  const t = getTranslation(locale);
  const content = `
    ${faqHero(locale)}
    <div class="comic-divider"></div>
    ${faqAccordion(locale)}
    ${ctaSection({
    heading: locale === "en" ? "Still Got Questions?" : "Masih Ada Pertanyaan?",
    subheading: locale === "en" ? "Don't have a cow \u2014 just send us a message and we'll get back to you. Woo-hoo!" : "Jangan sungkan \u2014 kirimi kami pesan dan kami akan segera membalas.",
    primaryLabel: locale === "en" ? "Contact Us \u2726" : "Hubungi Kami \u2726",
    primaryHref: localePath(locale, "/contact"),
    secondaryLabel: locale === "en" ? "View Services" : "Lihat Layanan",
    secondaryHref: localePath(locale, "/services")
  })}
  `;
  return baseLayout({
    title: t.seo.faqTitle,
    description: t.seo.faqDescription,
    activePage: localePath(locale, "/faq"),
    locale,
    content
  });
}

// src/lib/quotes.ts
var QUOTES = [
  { text: "Any sufficiently advanced bug is indistinguishable from a feature.", author: "Springfield Engineering Proverb" },
  { text: "There are only two hard problems in CS: naming things, cache invalidation, and off-by-one errors.", author: "Springfield CS Dept." },
  { text: "It works on my machine. Perhaps we should ship your machine.", author: "Dev floor, circa every standup" },
  { text: "Documentation is like a good donut: everyone wants it, nobody wants to make it.", author: "Anonymous Springfield Dev" },
  { text: "Move fast and fix things. The breaking was the easy part.", author: "Revised Springfield Motto" },
  { text: "A deploy on Friday is just a weekend adventure you didn't plan.", author: "Springfield SRE Handbook" },
  { text: "Clean code is not written, it is rewritten.", author: "Springfield Refactor Guild" },
  { text: "The best code is the code you didn't have to write.", author: "Lazy Engineer Quarterly" },
  { text: "An estimate is just a guess wearing a suit and a tie.", author: "Springfield PM Conference 2019" },
  { text: "Every legacy codebase is someone's passionate side project that got promoted.", author: "Tales from the On-Call Rotation" },
  { text: "The first rule of optimization is: don't. The second rule is: not yet.", author: "Springfield Performance Guild" },
  { text: "Comments should explain why, not what. The code already says what. Badly.", author: "Code Review Notes, vol. 7" },
  { text: "Kubernetes is just Docker, but for people who like YAML the way Homer likes donuts.", author: "Springfield DevOps Zine" },
  { text: "A good API is like a good traffic light: obvious, consistent, and nobody reads the manual.", author: "Springfield Platform Team" },
  { text: "Ship it. The universe is 13.8 billion years old. Your bug can wait until Monday.", author: "Existential Engineering Notes" }
];
function getDailyQuote() {
  const d = /* @__PURE__ */ new Date();
  const seed = d.getUTCFullYear() * 1e4 + (d.getUTCMonth() + 1) * 100 + d.getUTCDate();
  return QUOTES[seed % QUOTES.length];
}

// src/router.ts
var app = new Hono2();
app.use("*", logger());
app.use("*", timing());
app.use("*", secureHeaders());
app.use("*", async (c, next) => {
  await next();
  if (c.req.method === "GET" && c.res.status === 200) {
    c.header("Cache-Control", "public, max-age=60, stale-while-revalidate=600");
  }
});
app.get("/", (c) => c.redirect(`/${DEFAULT_LOCALE}`, 302));
function getLocaleFromPath(path) {
  const seg = path.split("/")[1] ?? "";
  return SUPPORTED_LOCALES.includes(seg) ? seg : DEFAULT_LOCALE;
}
async function handleContact(c, loc) {
  try {
    const body = await c.req.json();
    if (!body.name || !body.email || !body.message) {
      const msg2 = loc === "en" ? "D'oh! Name, email, and message are required." : "Field name, email, dan message wajib diisi.";
      return c.json({ success: false, error: msg2 }, 400);
    }
    console.log(`[contact:${loc}]`, {
      name: body.name,
      email: body.email,
      company: body.company,
      service: body.service,
      message: body.message.slice(0, 120)
    });
    const msg = loc === "en" ? "Woo-hoo! Message received." : "Pesan berhasil diterima.";
    return c.json({ success: true, message: msg }, 200);
  } catch {
    const msg = loc === "en" ? "D'oh! Invalid request body." : "Request body tidak valid.";
    return c.json({ success: false, error: msg }, 400);
  }
}
app.get("/id", (c) => c.html(homePage("id")));
app.get("/id/", (c) => c.html(homePage("id")));
app.get("/id/services", (c) => c.html(servicesPage("id")));
app.get("/id/portfolio", (c) => c.html(portfolioPage("id")));
app.get("/id/about", (c) => c.html(aboutPage("id")));
app.get("/id/contact", (c) => c.html(contactPage("id")));
app.post("/id/api/contact", (c) => handleContact(c, "id"));
app.get("/id/faq", (c) => c.html(faqPage("id")));
app.get("/en", (c) => c.html(homePage("en")));
app.get("/en/", (c) => c.html(homePage("en")));
app.get("/en/services", (c) => c.html(servicesPage("en")));
app.get("/en/portfolio", (c) => c.html(portfolioPage("en")));
app.get("/en/about", (c) => c.html(aboutPage("en")));
app.get("/en/contact", (c) => c.html(contactPage("en")));
app.post("/en/api/contact", (c) => handleContact(c, "en"));
app.get("/en/faq", (c) => c.html(faqPage("en")));
app.post("/api/contact", (c) => handleContact(c, DEFAULT_LOCALE));
app.get("/services", (c) => c.redirect(`/${DEFAULT_LOCALE}/services`, 302));
app.get("/portfolio", (c) => c.redirect(`/${DEFAULT_LOCALE}/portfolio`, 302));
app.get("/about", (c) => c.redirect(`/${DEFAULT_LOCALE}/about`, 302));
app.get("/contact", (c) => c.redirect(`/${DEFAULT_LOCALE}/contact`, 302));
app.get("/faq", (c) => c.redirect(`/${DEFAULT_LOCALE}/faq`, 302));
app.get("/api/quote", (c) => {
  const quote = getDailyQuote();
  return c.json({
    text: quote.text,
    author: quote.author,
    date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
  });
});
app.get("/health", (c) => c.json({ status: "ok", ts: Date.now() }));
app.notFound((c) => {
  const loc = getLocaleFromPath(c.req.path);
  const t = getTranslation(loc);
  const nf = t.notFound;
  const html = `<!DOCTYPE html>
<html lang="${loc}">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${nf.code} \u2014 ${loc === "en" ? "Page Not Found" : "Halaman Tidak Ditemukan"}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Fredoka:wght@400;600&display=swap" rel="stylesheet"/>
</head>
<body style="margin:0;background:#1A1A2E;min-height:100vh;display:flex;align-items:center;justify-content:center;">
  <div style="text-align:center;padding:2rem;">
    <div style="font-size:5rem;margin-bottom:1rem;">\u{1F573}\uFE0F</div>
    <h1 style="font-family:'Bangers',cursive;font-size:6rem;color:#FED41D;letter-spacing:0.1em;margin:0;text-shadow:6px 6px 0 #F5C400;">${nf.code}</h1>
    <p style="color:#FFFEF7AA;font-family:'Fredoka',sans-serif;font-size:1.1rem;margin:0.75rem 0 2rem;">${nf.message}</p>
    <a href="/${loc}" style="
      display:inline-block;padding:0.85rem 2.25rem;
      background:#FED41D;color:#1A1A2E;
      border:3px solid #1A1A2E;border-radius:12px;
      font-family:'Fredoka',sans-serif;font-size:1rem;font-weight:700;
      text-decoration:none;box-shadow:5px 5px 0 #F5C400;
    ">${nf.cta}</a>
  </div>
</body>
</html>`;
  return c.html(html, 404);
});
app.onError((err, c) => {
  console.error("[error]", err);
  return c.json({ success: false, error: "Internal server error." }, 500);
});
var router_default = app;

// api/index.ts
module.exports = createAdaptorServer(router_default);
