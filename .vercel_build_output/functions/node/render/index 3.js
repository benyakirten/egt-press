var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// .svelte-kit/vercel/entry.js
__export(exports, {
  default: () => entry_default
});

// node_modules/@sveltejs/kit/dist/install-fetch.js
var import_http = __toModule(require("http"));
var import_https = __toModule(require("https"));
var import_zlib = __toModule(require("zlib"));
var import_stream = __toModule(require("stream"));
var import_util = __toModule(require("util"));
var import_crypto = __toModule(require("crypto"));
var import_url = __toModule(require("url"));
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf("charset=") === 0) {
        charset = meta[i].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
var src = dataUriToBuffer;
var dataUriToBuffer$1 = src;
var { Readable } = import_stream.default;
var wm = new WeakMap();
async function* read(parts) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else {
      yield part;
    }
  }
}
var Blob = class {
  constructor(blobParts = [], options2 = {}) {
    let size = 0;
    const parts = blobParts.map((element) => {
      let buffer;
      if (element instanceof Buffer) {
        buffer = element;
      } else if (ArrayBuffer.isView(element)) {
        buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
      } else if (element instanceof ArrayBuffer) {
        buffer = Buffer.from(element);
      } else if (element instanceof Blob) {
        buffer = element;
      } else {
        buffer = Buffer.from(typeof element === "string" ? element : String(element));
      }
      size += buffer.length || buffer.size || 0;
      return buffer;
    });
    const type = options2.type === void 0 ? "" : String(options2.type).toLowerCase();
    wm.set(this, {
      type: /[^\u0020-\u007E]/.test(type) ? "" : type,
      size,
      parts
    });
  }
  get size() {
    return wm.get(this).size;
  }
  get type() {
    return wm.get(this).type;
  }
  async text() {
    return Buffer.from(await this.arrayBuffer()).toString();
  }
  async arrayBuffer() {
    const data = new Uint8Array(this.size);
    let offset = 0;
    for await (const chunk of this.stream()) {
      data.set(chunk, offset);
      offset += chunk.length;
    }
    return data.buffer;
  }
  stream() {
    return Readable.from(read(wm.get(this).parts));
  }
  slice(start = 0, end = this.size, type = "") {
    const { size } = this;
    let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
    let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
    const span = Math.max(relativeEnd - relativeStart, 0);
    const parts = wm.get(this).parts.values();
    const blobParts = [];
    let added = 0;
    for (const part of parts) {
      const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
      if (relativeStart && size2 <= relativeStart) {
        relativeStart -= size2;
        relativeEnd -= size2;
      } else {
        const chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
        blobParts.push(chunk);
        added += ArrayBuffer.isView(chunk) ? chunk.byteLength : chunk.size;
        relativeStart = 0;
        if (added >= span) {
          break;
        }
      }
    }
    const blob = new Blob([], { type: String(type).toLowerCase() });
    Object.assign(wm.get(blob), { size: span, parts: blobParts });
    return blob;
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
  static [Symbol.hasInstance](object) {
    return object && typeof object === "object" && typeof object.stream === "function" && object.stream.length === 0 && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
  }
};
Object.defineProperties(Blob.prototype, {
  size: { enumerable: true },
  type: { enumerable: true },
  slice: { enumerable: true }
});
var fetchBlob = Blob;
var Blob$1 = fetchBlob;
var FetchBaseError = class extends Error {
  constructor(message, type) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.type = type;
  }
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
};
var FetchError = class extends FetchBaseError {
  constructor(message, type, systemError) {
    super(message, type);
    if (systemError) {
      this.code = this.errno = systemError.code;
      this.erroredSysCall = systemError.syscall;
    }
  }
};
var NAME = Symbol.toStringTag;
var isURLSearchParameters = (object) => {
  return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
};
var isBlob = (object) => {
  return typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
};
function isFormData(object) {
  return typeof object === "object" && typeof object.append === "function" && typeof object.set === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.delete === "function" && typeof object.keys === "function" && typeof object.values === "function" && typeof object.entries === "function" && typeof object.constructor === "function" && object[NAME] === "FormData";
}
var isAbortSignal = (object) => {
  return typeof object === "object" && object[NAME] === "AbortSignal";
};
var carriage = "\r\n";
var dashes = "-".repeat(2);
var carriageLength = Buffer.byteLength(carriage);
var getFooter = (boundary) => `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
function getHeader(boundary, name, field) {
  let header = "";
  header += `${dashes}${boundary}${carriage}`;
  header += `Content-Disposition: form-data; name="${name}"`;
  if (isBlob(field)) {
    header += `; filename="${field.name}"${carriage}`;
    header += `Content-Type: ${field.type || "application/octet-stream"}`;
  }
  return `${header}${carriage.repeat(2)}`;
}
var getBoundary = () => (0, import_crypto.randomBytes)(8).toString("hex");
async function* formDataIterator(form, boundary) {
  for (const [name, value] of form) {
    yield getHeader(boundary, name, value);
    if (isBlob(value)) {
      yield* value.stream();
    } else {
      yield value;
    }
    yield carriage;
  }
  yield getFooter(boundary);
}
function getFormDataLength(form, boundary) {
  let length = 0;
  for (const [name, value] of form) {
    length += Buffer.byteLength(getHeader(boundary, name, value));
    if (isBlob(value)) {
      length += value.size;
    } else {
      length += Buffer.byteLength(String(value));
    }
    length += carriageLength;
  }
  length += Buffer.byteLength(getFooter(boundary));
  return length;
}
var INTERNALS$2 = Symbol("Body internals");
var Body = class {
  constructor(body, {
    size = 0
  } = {}) {
    let boundary = null;
    if (body === null) {
      body = null;
    } else if (isURLSearchParameters(body)) {
      body = Buffer.from(body.toString());
    } else if (isBlob(body))
      ;
    else if (Buffer.isBuffer(body))
      ;
    else if (import_util.types.isAnyArrayBuffer(body)) {
      body = Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
      body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    } else if (body instanceof import_stream.default)
      ;
    else if (isFormData(body)) {
      boundary = `NodeFetchFormDataBoundary${getBoundary()}`;
      body = import_stream.default.Readable.from(formDataIterator(body, boundary));
    } else {
      body = Buffer.from(String(body));
    }
    this[INTERNALS$2] = {
      body,
      boundary,
      disturbed: false,
      error: null
    };
    this.size = size;
    if (body instanceof import_stream.default) {
      body.on("error", (err) => {
        const error2 = err instanceof FetchBaseError ? err : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${err.message}`, "system", err);
        this[INTERNALS$2].error = error2;
      });
    }
  }
  get body() {
    return this[INTERNALS$2].body;
  }
  get bodyUsed() {
    return this[INTERNALS$2].disturbed;
  }
  async arrayBuffer() {
    const { buffer, byteOffset, byteLength } = await consumeBody(this);
    return buffer.slice(byteOffset, byteOffset + byteLength);
  }
  async blob() {
    const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
    const buf = await this.buffer();
    return new Blob$1([buf], {
      type: ct
    });
  }
  async json() {
    const buffer = await consumeBody(this);
    return JSON.parse(buffer.toString());
  }
  async text() {
    const buffer = await consumeBody(this);
    return buffer.toString();
  }
  buffer() {
    return consumeBody(this);
  }
};
Object.defineProperties(Body.prototype, {
  body: { enumerable: true },
  bodyUsed: { enumerable: true },
  arrayBuffer: { enumerable: true },
  blob: { enumerable: true },
  json: { enumerable: true },
  text: { enumerable: true }
});
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  let { body } = data;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (isBlob(body)) {
    body = body.stream();
  }
  if (Buffer.isBuffer(body)) {
    return body;
  }
  if (!(body instanceof import_stream.default)) {
    return Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const err = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(err);
        throw err;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error2) {
    if (error2 instanceof FetchBaseError) {
      throw error2;
    } else {
      throw new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error2.message}`, "system", error2);
    }
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return Buffer.from(accum.join(""));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error2) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error2.message}`, "system", error2);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
var clone = (instance, highWaterMark) => {
  let p1;
  let p2;
  let { body } = instance;
  if (instance.bodyUsed) {
    throw new Error("cannot clone body after it is used");
  }
  if (body instanceof import_stream.default && typeof body.getBoundary !== "function") {
    p1 = new import_stream.PassThrough({ highWaterMark });
    p2 = new import_stream.PassThrough({ highWaterMark });
    body.pipe(p1);
    body.pipe(p2);
    instance[INTERNALS$2].body = p1;
    body = p2;
  }
  return body;
};
var extractContentType = (body, request) => {
  if (body === null) {
    return null;
  }
  if (typeof body === "string") {
    return "text/plain;charset=UTF-8";
  }
  if (isURLSearchParameters(body)) {
    return "application/x-www-form-urlencoded;charset=UTF-8";
  }
  if (isBlob(body)) {
    return body.type || null;
  }
  if (Buffer.isBuffer(body) || import_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
    return null;
  }
  if (body && typeof body.getBoundary === "function") {
    return `multipart/form-data;boundary=${body.getBoundary()}`;
  }
  if (isFormData(body)) {
    return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
  }
  if (body instanceof import_stream.default) {
    return null;
  }
  return "text/plain;charset=UTF-8";
};
var getTotalBytes = (request) => {
  const { body } = request;
  if (body === null) {
    return 0;
  }
  if (isBlob(body)) {
    return body.size;
  }
  if (Buffer.isBuffer(body)) {
    return body.length;
  }
  if (body && typeof body.getLengthSync === "function") {
    return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
  }
  if (isFormData(body)) {
    return getFormDataLength(request[INTERNALS$2].boundary);
  }
  return null;
};
var writeToStream = (dest, { body }) => {
  if (body === null) {
    dest.end();
  } else if (isBlob(body)) {
    body.stream().pipe(dest);
  } else if (Buffer.isBuffer(body)) {
    dest.write(body);
    dest.end();
  } else {
    body.pipe(dest);
  }
};
var validateHeaderName = typeof import_http.default.validateHeaderName === "function" ? import_http.default.validateHeaderName : (name) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
    const err = new TypeError(`Header name must be a valid HTTP token [${name}]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
    throw err;
  }
};
var validateHeaderValue = typeof import_http.default.validateHeaderValue === "function" ? import_http.default.validateHeaderValue : (name, value) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
    const err = new TypeError(`Invalid character in header content ["${name}"]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_CHAR" });
    throw err;
  }
};
var Headers = class extends URLSearchParams {
  constructor(init2) {
    let result = [];
    if (init2 instanceof Headers) {
      const raw = init2.raw();
      for (const [name, values] of Object.entries(raw)) {
        result.push(...values.map((value) => [name, value]));
      }
    } else if (init2 == null)
      ;
    else if (typeof init2 === "object" && !import_util.types.isBoxedPrimitive(init2)) {
      const method = init2[Symbol.iterator];
      if (method == null) {
        result.push(...Object.entries(init2));
      } else {
        if (typeof method !== "function") {
          throw new TypeError("Header pairs must be iterable");
        }
        result = [...init2].map((pair) => {
          if (typeof pair !== "object" || import_util.types.isBoxedPrimitive(pair)) {
            throw new TypeError("Each header pair must be an iterable object");
          }
          return [...pair];
        }).map((pair) => {
          if (pair.length !== 2) {
            throw new TypeError("Each header pair must be a name/value tuple");
          }
          return [...pair];
        });
      }
    } else {
      throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
    }
    result = result.length > 0 ? result.map(([name, value]) => {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return [String(name).toLowerCase(), String(value)];
    }) : void 0;
    super(result);
    return new Proxy(this, {
      get(target, p, receiver) {
        switch (p) {
          case "append":
          case "set":
            return (name, value) => {
              validateHeaderName(name);
              validateHeaderValue(name, String(value));
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase(), String(value));
            };
          case "delete":
          case "has":
          case "getAll":
            return (name) => {
              validateHeaderName(name);
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase());
            };
          case "keys":
            return () => {
              target.sort();
              return new Set(URLSearchParams.prototype.keys.call(target)).keys();
            };
          default:
            return Reflect.get(target, p, receiver);
        }
      }
    });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  toString() {
    return Object.prototype.toString.call(this);
  }
  get(name) {
    const values = this.getAll(name);
    if (values.length === 0) {
      return null;
    }
    let value = values.join(", ");
    if (/^content-encoding$/i.test(name)) {
      value = value.toLowerCase();
    }
    return value;
  }
  forEach(callback) {
    for (const name of this.keys()) {
      callback(this.get(name), name);
    }
  }
  *values() {
    for (const name of this.keys()) {
      yield this.get(name);
    }
  }
  *entries() {
    for (const name of this.keys()) {
      yield [name, this.get(name)];
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  raw() {
    return [...this.keys()].reduce((result, key) => {
      result[key] = this.getAll(key);
      return result;
    }, {});
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this.keys()].reduce((result, key) => {
      const values = this.getAll(key);
      if (key === "host") {
        result[key] = values[0];
      } else {
        result[key] = values.length > 1 ? values : values[0];
      }
      return result;
    }, {});
  }
};
Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
  result[property] = { enumerable: true };
  return result;
}, {}));
function fromRawHeaders(headers = []) {
  return new Headers(headers.reduce((result, value, index2, array) => {
    if (index2 % 2 === 0) {
      result.push(array.slice(index2, index2 + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch {
      return false;
    }
  }));
}
var redirectStatus = new Set([301, 302, 303, 307, 308]);
var isRedirect = (code) => {
  return redirectStatus.has(code);
};
var INTERNALS$1 = Symbol("Response internals");
var Response = class extends Body {
  constructor(body = null, options2 = {}) {
    super(body, options2);
    const status = options2.status || 200;
    const headers = new Headers(options2.headers);
    if (body !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(body);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    this[INTERNALS$1] = {
      url: options2.url,
      status,
      statusText: options2.statusText || "",
      headers,
      counter: options2.counter,
      highWaterMark: options2.highWaterMark
    };
  }
  get url() {
    return this[INTERNALS$1].url || "";
  }
  get status() {
    return this[INTERNALS$1].status;
  }
  get ok() {
    return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
  }
  get redirected() {
    return this[INTERNALS$1].counter > 0;
  }
  get statusText() {
    return this[INTERNALS$1].statusText;
  }
  get headers() {
    return this[INTERNALS$1].headers;
  }
  get highWaterMark() {
    return this[INTERNALS$1].highWaterMark;
  }
  clone() {
    return new Response(clone(this, this.highWaterMark), {
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      ok: this.ok,
      redirected: this.redirected,
      size: this.size
    });
  }
  static redirect(url, status = 302) {
    if (!isRedirect(status)) {
      throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
    }
    return new Response(null, {
      headers: {
        location: new URL(url).toString()
      },
      status
    });
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
};
Object.defineProperties(Response.prototype, {
  url: { enumerable: true },
  status: { enumerable: true },
  ok: { enumerable: true },
  redirected: { enumerable: true },
  statusText: { enumerable: true },
  headers: { enumerable: true },
  clone: { enumerable: true }
});
var getSearch = (parsedURL) => {
  if (parsedURL.search) {
    return parsedURL.search;
  }
  const lastOffset = parsedURL.href.length - 1;
  const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
  return parsedURL.href[lastOffset - hash2.length] === "?" ? "?" : "";
};
var INTERNALS = Symbol("Request internals");
var isRequest = (object) => {
  return typeof object === "object" && typeof object[INTERNALS] === "object";
};
var Request = class extends Body {
  constructor(input, init2 = {}) {
    let parsedURL;
    if (isRequest(input)) {
      parsedURL = new URL(input.url);
    } else {
      parsedURL = new URL(input);
      input = {};
    }
    let method = init2.method || input.method || "GET";
    method = method.toUpperCase();
    if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
      throw new TypeError("Request with GET/HEAD method cannot have body");
    }
    const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
    super(inputBody, {
      size: init2.size || input.size || 0
    });
    const headers = new Headers(init2.headers || input.headers || {});
    if (inputBody !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(inputBody, this);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    let signal = isRequest(input) ? input.signal : null;
    if ("signal" in init2) {
      signal = init2.signal;
    }
    if (signal !== null && !isAbortSignal(signal)) {
      throw new TypeError("Expected signal to be an instanceof AbortSignal");
    }
    this[INTERNALS] = {
      method,
      redirect: init2.redirect || input.redirect || "follow",
      headers,
      parsedURL,
      signal
    };
    this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
    this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
    this.counter = init2.counter || input.counter || 0;
    this.agent = init2.agent || input.agent;
    this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
    this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
  }
  get method() {
    return this[INTERNALS].method;
  }
  get url() {
    return (0, import_url.format)(this[INTERNALS].parsedURL);
  }
  get headers() {
    return this[INTERNALS].headers;
  }
  get redirect() {
    return this[INTERNALS].redirect;
  }
  get signal() {
    return this[INTERNALS].signal;
  }
  clone() {
    return new Request(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
};
Object.defineProperties(Request.prototype, {
  method: { enumerable: true },
  url: { enumerable: true },
  headers: { enumerable: true },
  redirect: { enumerable: true },
  clone: { enumerable: true },
  signal: { enumerable: true }
});
var getNodeRequestOptions = (request) => {
  const { parsedURL } = request[INTERNALS];
  const headers = new Headers(request[INTERNALS].headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "*/*");
  }
  let contentLengthValue = null;
  if (request.body === null && /^(post|put)$/i.test(request.method)) {
    contentLengthValue = "0";
  }
  if (request.body !== null) {
    const totalBytes = getTotalBytes(request);
    if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
      contentLengthValue = String(totalBytes);
    }
  }
  if (contentLengthValue) {
    headers.set("Content-Length", contentLengthValue);
  }
  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", "node-fetch");
  }
  if (request.compress && !headers.has("Accept-Encoding")) {
    headers.set("Accept-Encoding", "gzip,deflate,br");
  }
  let { agent } = request;
  if (typeof agent === "function") {
    agent = agent(parsedURL);
  }
  if (!headers.has("Connection") && !agent) {
    headers.set("Connection", "close");
  }
  const search = getSearch(parsedURL);
  const requestOptions = {
    path: parsedURL.pathname + search,
    pathname: parsedURL.pathname,
    hostname: parsedURL.hostname,
    protocol: parsedURL.protocol,
    port: parsedURL.port,
    hash: parsedURL.hash,
    search: parsedURL.search,
    query: parsedURL.query,
    href: parsedURL.href,
    method: request.method,
    headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
    insecureHTTPParser: request.insecureHTTPParser,
    agent
  };
  return requestOptions;
};
var AbortError = class extends FetchBaseError {
  constructor(message, type = "aborted") {
    super(message, type);
  }
};
var supportedSchemas = new Set(["data:", "http:", "https:"]);
async function fetch(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request(url, options_);
    const options2 = getNodeRequestOptions(request);
    if (!supportedSchemas.has(options2.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${options2.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (options2.protocol === "data:") {
      const data = dataUriToBuffer$1(request.url);
      const response2 = new Response(data, { headers: { "Content-Type": data.typeFull } });
      resolve2(response2);
      return;
    }
    const send = (options2.protocol === "https:" ? import_https.default : import_http.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error2 = new AbortError("The operation was aborted.");
      reject(error2);
      if (request.body && request.body instanceof import_stream.default.Readable) {
        request.body.destroy(error2);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error2);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(options2);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (err) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
      finalize();
    });
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        const locationURL = location === null ? null : new URL(location, request.url);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              try {
                headers.set("Location", locationURL);
              } catch (error2) {
                reject(error2);
              }
            }
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: request.body,
              signal: request.signal,
              size: request.size
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_stream.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            resolve2(fetch(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
        }
      }
      response_.once("end", () => {
        if (signal) {
          signal.removeEventListener("abort", abortAndFinalize);
        }
      });
      let body = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error2) => {
        reject(error2);
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: import_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createGunzip(zlibOptions), (error2) => {
          reject(error2);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error2) => {
          reject(error2);
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflate(), (error2) => {
              reject(error2);
            });
          } else {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflateRaw(), (error2) => {
              reject(error2);
            });
          }
          response = new Response(body, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createBrotliDecompress(), (error2) => {
          reject(error2);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request);
  });
}

// node_modules/@sveltejs/kit/dist/adapter-utils.js
function isContentTypeTextual(content_type) {
  if (!content_type)
    return true;
  const [type] = content_type.split(";");
  return type === "text/plain" || type === "application/json" || type === "application/x-www-form-urlencoded" || type === "multipart/form-data";
}

// node_modules/@sveltejs/kit/dist/node.js
function getRawBody(req) {
  return new Promise((fulfil, reject) => {
    const h = req.headers;
    if (!h["content-type"]) {
      return fulfil("");
    }
    req.on("error", reject);
    const length = Number(h["content-length"]);
    if (isNaN(length) && h["transfer-encoding"] == null) {
      return fulfil("");
    }
    let data = new Uint8Array(length || 0);
    if (length > 0) {
      let offset = 0;
      req.on("data", (chunk) => {
        const new_len = offset + Buffer.byteLength(chunk);
        if (new_len > length) {
          return reject({
            status: 413,
            reason: 'Exceeded "Content-Length" limit'
          });
        }
        data.set(chunk, offset);
        offset = new_len;
      });
    } else {
      req.on("data", (chunk) => {
        const new_data = new Uint8Array(data.length + chunk.length);
        new_data.set(data, 0);
        new_data.set(chunk, data.length);
        data = new_data;
      });
    }
    req.on("end", () => {
      const [type] = (h["content-type"] || "").split(/;\s*/);
      if (isContentTypeTextual(type)) {
        const encoding = h["content-encoding"] || "utf-8";
        return fulfil(new TextDecoder(encoding).decode(data));
      }
      fulfil(data);
    });
  });
}

// node_modules/@sveltejs/kit/dist/ssr.js
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key in obj) {
    clone2[key.toLowerCase()] = obj[key];
  }
  return clone2;
}
function error(body) {
  return {
    status: 500,
    body,
    headers: {}
  };
}
function is_string(s2) {
  return typeof s2 === "string" || s2 instanceof String;
}
async function render_endpoint(request, route) {
  const mod = await route.load();
  const handler = mod[request.method.toLowerCase().replace("delete", "del")];
  if (!handler) {
    return;
  }
  const match = route.pattern.exec(request.path);
  if (!match) {
    return error("could not parse parameters from request path");
  }
  const params = route.params(match);
  const response = await handler({ ...request, params });
  const preface = `Invalid response from route ${request.path}`;
  if (!response) {
    return;
  }
  if (typeof response !== "object") {
    return error(`${preface}: expected an object, got ${typeof response}`);
  }
  let { status = 200, body, headers = {} } = response;
  headers = lowercase_keys(headers);
  const type = headers["content-type"];
  const is_type_textual = isContentTypeTextual(type);
  if (!is_type_textual && !(body instanceof Uint8Array || is_string(body))) {
    return error(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
  }
  let normalized_body;
  if ((typeof body === "object" || typeof body === "undefined") && !(body instanceof Uint8Array) && (!type || type.startsWith("application/json"))) {
    headers = { ...headers, "content-type": "application/json; charset=utf-8" };
    normalized_body = JSON.stringify(typeof body === "undefined" ? {} : body);
  } else {
    normalized_body = body;
  }
  return { status, body: normalized_body, headers };
}
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i) {
            statements_1.push(name + "[" + i + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop() {
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
Promise.resolve();
var subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = [];
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (let i = 0; i < subscribers.length; i += 1) {
          const s2 = subscribers[i];
          s2[1]();
          subscriber_queue.push(s2, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.push(subscriber);
    if (subscribers.length === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      const index2 = subscribers.indexOf(subscriber);
      if (index2 !== -1) {
        subscribers.splice(index2, 1);
      }
      if (subscribers.length === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe };
}
function hash(value) {
  let hash2 = 5381;
  let i = value.length;
  if (typeof value === "string") {
    while (i)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i);
  } else {
    while (i)
      hash2 = hash2 * 33 ^ value[--i];
  }
  return (hash2 >>> 0).toString(36);
}
var s$1 = JSON.stringify;
async function render_response({
  branch,
  options: options2,
  $session,
  page_config,
  status,
  error: error2,
  page
}) {
  const css2 = new Set(options2.entry.css);
  const js = new Set(options2.entry.js);
  const styles = new Set();
  const serialized_data = [];
  let rendered;
  let is_private = false;
  let maxage;
  if (error2) {
    error2.stack = options2.get_stack(error2);
  }
  if (page_config.ssr) {
    branch.forEach(({ node, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url) => css2.add(url));
      if (node.js)
        node.js.forEach((url) => js.add(url));
      if (node.styles)
        node.styles.forEach((content) => styles.add(content));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable($session);
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        session
      },
      page,
      components: branch.map(({ node }) => node.module.default)
    };
    for (let i = 0; i < branch.length; i += 1) {
      props[`props_${i}`] = await branch[i].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options2.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  const include_js = page_config.router || page_config.hydrate;
  if (!include_js)
    js.clear();
  const links = options2.amp ? styles.size > 0 || rendered.css.code.length > 0 ? `<style amp-custom>${Array.from(styles).concat(rendered.css.code).join("\n")}</style>` : "" : [
    ...Array.from(js).map((dep) => `<link rel="modulepreload" href="${dep}">`),
    ...Array.from(css2).map((dep) => `<link rel="stylesheet" href="${dep}">`)
  ].join("\n		");
  let init2 = "";
  if (options2.amp) {
    init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>`;
  } else if (include_js) {
    init2 = `<script type="module">
			import { start } from ${s$1(options2.entry.file)};
			start({
				target: ${options2.target ? `document.querySelector(${s$1(options2.target)})` : "document.body"},
				paths: ${s$1(options2.paths)},
				session: ${try_serialize($session, (error3) => {
      throw new Error(`Failed to serialize session data: ${error3.message}`);
    })},
				host: ${page && page.host ? s$1(page.host) : "location.host"},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				trailing_slash: ${s$1(options2.trailing_slash)},
				hydrate: ${page_config.ssr && page_config.hydrate ? `{
					status: ${status},
					error: ${serialize_error(error2)},
					nodes: [
						${(branch || []).map(({ node }) => `import(${s$1(node.entry)})`).join(",\n						")}
					],
					page: {
						host: ${page && page.host ? s$1(page.host) : "location.host"}, // TODO this is redundant
						path: ${s$1(page && page.path)},
						query: new URLSearchParams(${page ? s$1(page.query.toString()) : ""}),
						params: ${page && s$1(page.params)}
					}
				}` : "null"}
			});
		<\/script>`;
  }
  if (options2.service_worker) {
    init2 += `<script>
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('${options2.service_worker}');
			}
		<\/script>`;
  }
  const head = [
    rendered.head,
    styles.size && !options2.amp ? `<style data-svelte>${Array.from(styles).join("\n")}</style>` : "",
    links,
    init2
  ].join("\n\n		");
  const body = options2.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({ url, body: body2, json }) => {
    let attributes = `type="application/json" data-type="svelte-data" data-url="${url}"`;
    if (body2)
      attributes += ` data-body="${hash(body2)}"`;
    return `<script ${attributes}>${json}<\/script>`;
  }).join("\n\n			")}
		`.replace(/^\t{2}/gm, "");
  const headers = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers["cache-control"] = `${is_private ? "private" : "public"}, max-age=${maxage}`;
  }
  if (!options2.floc) {
    headers["permissions-policy"] = "interest-cohort=()";
  }
  return {
    status,
    headers,
    body: options2.template({ head, body })
  };
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(err);
    return null;
  }
}
function serialize_error(error2) {
  if (!error2)
    return null;
  let serialized = try_serialize(error2);
  if (!serialized) {
    const { name, message, stack } = error2;
    serialized = try_serialize({ ...error2, name, message, stack });
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize(loaded) {
  const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
  if (loaded.error || has_error_status) {
    const status = loaded.status;
    if (!loaded.error && has_error_status) {
      return {
        status: status || 500,
        error: new Error()
      };
    }
    const error2 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    if (!(error2 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error2}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error2 };
    }
    return { status, error: error2 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  return loaded;
}
var s = JSON.stringify;
async function load_node({
  request,
  options: options2,
  state,
  route,
  page,
  node,
  $session,
  context,
  prerender_enabled,
  is_leaf,
  is_error,
  status,
  error: error2
}) {
  const { module: module2 } = node;
  let uses_credentials = false;
  const fetched = [];
  let loaded;
  const page_proxy = new Proxy(page, {
    get: (target, prop, receiver) => {
      if (prop === "query" && prerender_enabled) {
        throw new Error("Cannot access query on a page with prerendering enabled");
      }
      return Reflect.get(target, prop, receiver);
    }
  });
  if (module2.load) {
    const load_input = {
      page: page_proxy,
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let url;
        if (typeof resource === "string") {
          url = resource;
        } else {
          url = resource.url;
          opts = {
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity,
            ...opts
          };
        }
        const resolved = resolve(request.path, url.split("?")[0]);
        let response;
        const filename = resolved.replace(options2.paths.assets, "").slice(1);
        const filename_html = `${filename}/index.html`;
        const asset = options2.manifest.assets.find((d2) => d2.file === filename || d2.file === filename_html);
        if (asset) {
          response = options2.read ? new Response(options2.read(asset.file), {
            headers: asset.type ? {
              "content-type": asset.type
            } : {}
          }) : await fetch(`http://${page.host}/${asset.file}`, opts);
        } else if (resolved.startsWith(options2.paths.base || "/") && !resolved.startsWith("//")) {
          const relative = resolved.replace(options2.paths.base, "");
          const headers = { ...opts.headers };
          if (opts.credentials !== "omit") {
            uses_credentials = true;
            headers.cookie = request.headers.cookie;
            if (!headers.authorization) {
              headers.authorization = request.headers.authorization;
            }
          }
          if (opts.body && typeof opts.body !== "string") {
            throw new Error("Request body must be a string");
          }
          const search = url.includes("?") ? url.slice(url.indexOf("?") + 1) : "";
          const rendered = await respond({
            host: request.host,
            method: opts.method || "GET",
            headers,
            path: relative,
            rawBody: opts.body,
            query: new URLSearchParams(search)
          }, options2, {
            fetched: url,
            initiator: route
          });
          if (rendered) {
            if (state.prerender) {
              state.prerender.dependencies.set(relative, rendered);
            }
            response = new Response(rendered.body, {
              status: rendered.status,
              headers: rendered.headers
            });
          }
        } else {
          if (resolved.startsWith("//")) {
            throw new Error(`Cannot request protocol-relative URL (${url}) in server-side fetch`);
          }
          if (typeof request.host !== "undefined") {
            const { hostname: fetch_hostname } = new URL(url);
            const [server_hostname] = request.host.split(":");
            if (`.${fetch_hostname}`.endsWith(`.${server_hostname}`) && opts.credentials !== "omit") {
              uses_credentials = true;
              opts.headers = {
                ...opts.headers,
                cookie: request.headers.cookie
              };
            }
          }
          const external_request = new Request(url, opts);
          response = await options2.hooks.serverFetch.call(null, external_request);
        }
        if (response) {
          const proxy = new Proxy(response, {
            get(response2, key, receiver) {
              async function text() {
                const body = await response2.text();
                const headers = {};
                for (const [key2, value] of response2.headers) {
                  if (key2 !== "etag" && key2 !== "set-cookie")
                    headers[key2] = value;
                }
                if (!opts.body || typeof opts.body === "string") {
                  fetched.push({
                    url,
                    body: opts.body,
                    json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers)},"body":${escape(body)}}`
                  });
                }
                return body;
              }
              if (key === "text") {
                return text;
              }
              if (key === "json") {
                return async () => {
                  return JSON.parse(await text());
                };
              }
              return Reflect.get(response2, key, response2);
            }
          });
          return proxy;
        }
        return response || new Response("Not found", {
          status: 404
        });
      },
      context: { ...context }
    };
    if (is_error) {
      load_input.status = status;
      load_input.error = error2;
    }
    loaded = await module2.load.call(null, load_input);
  } else {
    loaded = {};
  }
  if (!loaded && is_leaf && !is_error)
    return;
  if (!loaded) {
    throw new Error(`${node.entry} - load must return a value except for page fall through`);
  }
  return {
    node,
    loaded: normalize(loaded),
    context: loaded.context || context,
    fetched,
    uses_credentials
  };
}
var escaped = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escape(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped) {
      result += escaped[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += `\\u${code.toString(16).toUpperCase()}`;
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
var absolute = /^([a-z]+:)?\/?\//;
function resolve(base, path) {
  const base_match = absolute.exec(base);
  const path_match = absolute.exec(path);
  if (!base_match) {
    throw new Error(`bad base path: "${base}"`);
  }
  const baseparts = path_match ? [] : base.slice(base_match[0].length).split("/");
  const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
  baseparts.pop();
  for (let i = 0; i < pathparts.length; i += 1) {
    const part = pathparts[i];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
  return `${prefix}${baseparts.join("/")}`;
}
function coalesce_to_error(err) {
  return err instanceof Error ? err : new Error(JSON.stringify(err));
}
async function respond_with_error({ request, options: options2, state, $session, status, error: error2 }) {
  const default_layout = await options2.load_component(options2.manifest.layout);
  const default_error = await options2.load_component(options2.manifest.error);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params: {}
  };
  const loaded = await load_node({
    request,
    options: options2,
    state,
    route: null,
    page,
    node: default_layout,
    $session,
    context: {},
    prerender_enabled: is_prerender_enabled(options2, default_error, state),
    is_leaf: false,
    is_error: false
  });
  const branch = [
    loaded,
    await load_node({
      request,
      options: options2,
      state,
      route: null,
      page,
      node: default_error,
      $session,
      context: loaded ? loaded.context : {},
      prerender_enabled: is_prerender_enabled(options2, default_error, state),
      is_leaf: false,
      is_error: true,
      status,
      error: error2
    })
  ];
  try {
    return await render_response({
      options: options2,
      $session,
      page_config: {
        hydrate: options2.hydrate,
        router: options2.router,
        ssr: options2.ssr
      },
      status,
      error: error2,
      branch,
      page
    });
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3);
    return {
      status: 500,
      headers: {},
      body: error3.stack
    };
  }
}
function is_prerender_enabled(options2, node, state) {
  return options2.prerender && (!!node.module.prerender || !!state.prerender && state.prerender.all);
}
async function respond$1(opts) {
  const { request, options: options2, state, $session, route } = opts;
  let nodes;
  try {
    nodes = await Promise.all(route.a.map((id) => id ? options2.load_component(id) : void 0));
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error3
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  let page_config = get_page_config(leaf, options2);
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return {
      status: 204,
      headers: {},
      body: ""
    };
  }
  let branch = [];
  let status = 200;
  let error2;
  ssr:
    if (page_config.ssr) {
      let context = {};
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let loaded;
        if (node) {
          try {
            loaded = await load_node({
              ...opts,
              node,
              context,
              prerender_enabled: is_prerender_enabled(options2, node, state),
              is_leaf: i === nodes.length - 1,
              is_error: false
            });
            if (!loaded)
              return;
            if (loaded.loaded.redirect) {
              return {
                status: loaded.loaded.status,
                headers: {
                  location: encodeURI(loaded.loaded.redirect)
                }
              };
            }
            if (loaded.loaded.error) {
              ({ status, error: error2 } = loaded.loaded);
            }
          } catch (err) {
            const e = coalesce_to_error(err);
            options2.handle_error(e);
            status = 500;
            error2 = e;
          }
          if (loaded && !error2) {
            branch.push(loaded);
          }
          if (error2) {
            while (i--) {
              if (route.b[i]) {
                const error_node = await options2.load_component(route.b[i]);
                let node_loaded;
                let j = i;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  const error_loaded = await load_node({
                    ...opts,
                    node: error_node,
                    context: node_loaded.context,
                    prerender_enabled: is_prerender_enabled(options2, error_node, state),
                    is_leaf: false,
                    is_error: true,
                    status,
                    error: error2
                  });
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  page_config = get_page_config(error_node.module, options2);
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  break ssr;
                } catch (err) {
                  const e = coalesce_to_error(err);
                  options2.handle_error(e);
                  continue;
                }
              }
            }
            return await respond_with_error({
              request,
              options: options2,
              state,
              $session,
              status,
              error: error2
            });
          }
        }
        if (loaded && loaded.loaded.context) {
          context = {
            ...context,
            ...loaded.loaded.context
          };
        }
      }
    }
  try {
    return await render_response({
      ...opts,
      page_config,
      status,
      error: error2,
      branch: branch.filter(Boolean)
    });
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3);
    return await respond_with_error({
      ...opts,
      status: 500,
      error: error3
    });
  }
}
function get_page_config(leaf, options2) {
  return {
    ssr: "ssr" in leaf ? !!leaf.ssr : options2.ssr,
    router: "router" in leaf ? !!leaf.router : options2.router,
    hydrate: "hydrate" in leaf ? !!leaf.hydrate : options2.hydrate
  };
}
async function render_page(request, route, options2, state) {
  if (state.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`
    };
  }
  const match = route.pattern.exec(request.path);
  const params = route.params(match);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params
  };
  const $session = await options2.hooks.getSession(request);
  const response = await respond$1({
    request,
    options: options2,
    state,
    $session,
    route,
    page
  });
  if (response) {
    return response;
  }
  if (state.fetched) {
    return {
      status: 500,
      headers: {},
      body: `Bad request in load function: failed to fetch ${state.fetched}`
    };
  }
}
function read_only_form_data() {
  const map = new Map();
  return {
    append(key, value) {
      if (map.has(key)) {
        (map.get(key) || []).push(value);
      } else {
        map.set(key, [value]);
      }
    },
    data: new ReadOnlyFormData(map)
  };
}
var ReadOnlyFormData = class {
  #map;
  constructor(map) {
    this.#map = map;
  }
  get(key) {
    const value = this.#map.get(key);
    return value && value[0];
  }
  getAll(key) {
    return this.#map.get(key);
  }
  has(key) {
    return this.#map.has(key);
  }
  *[Symbol.iterator]() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *entries() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *keys() {
    for (const [key] of this.#map)
      yield key;
  }
  *values() {
    for (const [, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield value[i];
      }
    }
  }
};
function parse_body(raw, headers) {
  if (!raw || typeof raw !== "string")
    return raw;
  const [type, ...directives] = headers["content-type"].split(/;\s*/);
  switch (type) {
    case "text/plain":
      return raw;
    case "application/json":
      return JSON.parse(raw);
    case "application/x-www-form-urlencoded":
      return get_urlencoded(raw);
    case "multipart/form-data": {
      const boundary = directives.find((directive) => directive.startsWith("boundary="));
      if (!boundary)
        throw new Error("Missing boundary");
      return get_multipart(raw, boundary.slice("boundary=".length));
    }
    default:
      throw new Error(`Invalid Content-Type ${type}`);
  }
}
function get_urlencoded(text) {
  const { data, append } = read_only_form_data();
  text.replace(/\+/g, " ").split("&").forEach((str) => {
    const [key, value] = str.split("=");
    append(decodeURIComponent(key), decodeURIComponent(value));
  });
  return data;
}
function get_multipart(text, boundary) {
  const parts = text.split(`--${boundary}`);
  if (parts[0] !== "" || parts[parts.length - 1].trim() !== "--") {
    throw new Error("Malformed form data");
  }
  const { data, append } = read_only_form_data();
  parts.slice(1, -1).forEach((part) => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    if (!match) {
      throw new Error("Malformed form data");
    }
    const raw_headers = match[1];
    const body = match[2].trim();
    let key;
    const headers = {};
    raw_headers.split("\r\n").forEach((str) => {
      const [raw_header, ...raw_directives] = str.split("; ");
      let [name, value] = raw_header.split(": ");
      name = name.toLowerCase();
      headers[name] = value;
      const directives = {};
      raw_directives.forEach((raw_directive) => {
        const [name2, value2] = raw_directive.split("=");
        directives[name2] = JSON.parse(value2);
      });
      if (name === "content-disposition") {
        if (value !== "form-data")
          throw new Error("Malformed form data");
        if (directives.filename) {
          throw new Error("File upload is not yet implemented");
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key)
      throw new Error("Malformed form data");
    append(key, body);
  });
  return data;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path !== "/" && options2.trailing_slash !== "ignore") {
    const has_trailing_slash = incoming.path.endsWith("/");
    if (has_trailing_slash && options2.trailing_slash === "never" || !has_trailing_slash && options2.trailing_slash === "always" && !(incoming.path.split("/").pop() || "").includes(".")) {
      const path = has_trailing_slash ? incoming.path.slice(0, -1) : incoming.path + "/";
      const q = incoming.query.toString();
      return {
        status: 301,
        headers: {
          location: encodeURI(path + (q ? `?${q}` : ""))
        }
      };
    }
  }
  try {
    const headers = lowercase_keys(incoming.headers);
    return await options2.hooks.handle({
      request: {
        ...incoming,
        headers,
        body: parse_body(incoming.rawBody, headers),
        params: {},
        locals: {}
      },
      resolve: async (request) => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request),
            page_config: { ssr: false, router: true, hydrate: true },
            status: 200,
            branch: []
          });
        }
        for (const route of options2.manifest.routes) {
          if (!route.pattern.test(request.path))
            continue;
          const response = route.type === "endpoint" ? await render_endpoint(request, route) : await render_page(request, route, options2, state);
          if (response) {
            if (response.status === 200) {
              if (!/(no-store|immutable)/.test(response.headers["cache-control"])) {
                const etag = `"${hash(response.body || "")}"`;
                if (request.headers["if-none-match"] === etag) {
                  return {
                    status: 304,
                    headers: {},
                    body: ""
                  };
                }
                response.headers["etag"] = etag;
              }
            }
            return response;
          }
        }
        const $session = await options2.hooks.getSession(request);
        return await respond_with_error({
          request,
          options: options2,
          state,
          $session,
          status: 404,
          error: new Error(`Not found: ${request.path}`)
        });
      }
    });
  } catch (err) {
    const e = coalesce_to_error(err);
    options2.handle_error(e);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e.stack : e.message
    };
  }
}

// .svelte-kit/output/server/app.js
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function custom_event(type, detail, bubbles = false) {
  const e = document.createEvent("CustomEvent");
  e.initCustomEvent(type, bubbles, false, detail);
  return e;
}
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function createEventDispatcher() {
  const component = get_current_component();
  return (type, detail) => {
    const callbacks = component.$$.callbacks[type];
    if (callbacks) {
      const event = custom_event(type, detail);
      callbacks.slice().forEach((fn) => {
        fn.call(component, event);
      });
    }
  };
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
Promise.resolve();
var escaped2 = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape2(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped2[match]);
}
function each(items, fn) {
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
var missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
var on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(parent_component ? parent_component.$$.context : context || []),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  return ` ${name}${value === true ? "" : `=${typeof value === "string" ? JSON.stringify(escape2(value)) : `"${value}"`}`}`;
}
function add_classes(classes) {
  return classes ? ` class="${classes}"` : "";
}
function afterUpdate() {
}
var css$4 = {
  code: "#svelte-announcer.svelte-1j55zn5{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}",
  map: `{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<!-- This file is generated by @sveltejs/kit \u2014 do not edit it! -->\\n<script>\\n\\timport { setContext, afterUpdate, onMount } from 'svelte';\\n\\n\\t// stores\\n\\texport let stores;\\n\\texport let page;\\n\\n\\texport let components;\\n\\texport let props_0 = null;\\n\\texport let props_1 = null;\\n\\texport let props_2 = null;\\n\\texport let props_3 = null;\\n\\n\\tsetContext('__svelte__', stores);\\n\\n\\t$: stores.page.set(page);\\n\\tafterUpdate(stores.page.notify);\\n\\n\\tlet mounted = false;\\n\\tlet navigated = false;\\n\\tlet title = null;\\n\\n\\tonMount(() => {\\n\\t\\tconst unsubscribe = stores.page.subscribe(() => {\\n\\t\\t\\tif (mounted) {\\n\\t\\t\\t\\tnavigated = true;\\n\\t\\t\\t\\ttitle = document.title || 'untitled page';\\n\\t\\t\\t}\\n\\t\\t});\\n\\n\\t\\tmounted = true;\\n\\t\\treturn unsubscribe;\\n\\t});\\n<\/script>\\n\\n<svelte:component this={components[0]} {...(props_0 || {})}>\\n\\t{#if components[1]}\\n\\t\\t<svelte:component this={components[1]} {...(props_1 || {})}>\\n\\t\\t\\t{#if components[2]}\\n\\t\\t\\t\\t<svelte:component this={components[2]} {...(props_2 || {})}>\\n\\t\\t\\t\\t\\t{#if components[3]}\\n\\t\\t\\t\\t\\t\\t<svelte:component this={components[3]} {...(props_3 || {})}/>\\n\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t</svelte:component>\\n\\t\\t\\t{/if}\\n\\t\\t</svelte:component>\\n\\t{/if}\\n</svelte:component>\\n\\n{#if mounted}\\n\\t<div id=\\"svelte-announcer\\" aria-live=\\"assertive\\" aria-atomic=\\"true\\">\\n\\t\\t{#if navigated}\\n\\t\\t\\t{title}\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>\\n\\t#svelte-announcer {\\n\\t\\tposition: absolute;\\n\\t\\tleft: 0;\\n\\t\\ttop: 0;\\n\\t\\tclip: rect(0 0 0 0);\\n\\t\\tclip-path: inset(50%);\\n\\t\\toverflow: hidden;\\n\\t\\twhite-space: nowrap;\\n\\t\\twidth: 1px;\\n\\t\\theight: 1px;\\n\\t}\\n</style>"],"names":[],"mappings":"AA2DC,iBAAiB,eAAC,CAAC,AAClB,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACnB,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,QAAQ,CAAE,MAAM,CAChB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,GAAG,AACZ,CAAC"}`
};
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  let { props_3 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page !== void 0)
    $$bindings.page(page);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  if ($$props.props_3 === void 0 && $$bindings.props_3 && props_3 !== void 0)
    $$bindings.props_3(props_3);
  $$result.css.add(css$4);
  {
    stores.page.set(page);
  }
  return `


${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
      default: () => `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {
        default: () => `${components[3] ? `${validate_component(components[3] || missing_component, "svelte:component").$$render($$result, Object.assign(props_3 || {}), {}, {})}` : ``}`
      })}` : ``}`
    })}` : ``}`
  })}

${``}`;
});
function set_paths(paths) {
}
function set_prerendering(value) {
}
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
var template = ({ head, body }) => '<!DOCTYPE html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<link rel="icon" href="/favicon.png" />\n		<meta name="viewport" content="width=device-width, initial-scale=1" />\n		<meta\n			name="description"\n			content="The home of English Garden Talk Press and Saint Bridged Vineyard Press.\n			Learn about our authors and the books, whether already published or upcoming and discover us on social media."\n		/>\n		<link rel="preconnect" href="https://fonts.googleapis.com" />\n		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n		<link\n			href="https://fonts.googleapis.com/css2?family=Domine&family=Quattrocento+Sans&display=swap"\n			rel="stylesheet"\n		/>\n		' + head + '\n	</head>\n	<body>\n		<div id="svelte">' + body + "</div>\n	</body>\n</html>\n";
var options = null;
var default_settings = { paths: { "base": "", "assets": "/." } };
function init(settings = default_settings) {
  set_paths(settings.paths);
  set_prerendering(settings.prerendering || false);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: "/./_app/start-b13b2bdf.js",
      css: ["/./_app/assets/start-8077b9bf.css"],
      js: ["/./_app/start-b13b2bdf.js", "/./_app/chunks/vendor-7804c1c7.js", "/./_app/chunks/singletons-12a22614.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => "/./_app/" + entry_lookup[id],
    get_stack: (error2) => String(error2),
    handle_error: (error2) => {
      if (error2.frame) {
        console.error(error2.frame);
      }
      console.error(error2.stack);
      error2.stack = options.get_stack(error2);
    },
    hooks: get_hooks(user_hooks),
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings.paths,
    prerender: true,
    read: settings.read,
    root: Root,
    service_worker: null,
    router: true,
    ssr: true,
    target: "#svelte",
    template,
    trailing_slash: "never"
  };
}
var d = decodeURIComponent;
var empty = () => ({});
var manifest = {
  assets: [{ "file": "books/covers/christmas-trees-winter-lake.jpg", "size": 104420, "type": "image/jpeg" }, { "file": "books/covers/delusions-form.jpg", "size": 68606, "type": "image/jpeg" }, { "file": "books/covers/human-automata.jpg", "size": 35135, "type": "image/jpeg" }, { "file": "books/covers/peachy-wu.jpg", "size": 59283, "type": "image/jpeg" }, { "file": "books/covers/secret-gold.jpg", "size": 53646, "type": "image/jpeg" }, { "file": "books/covers/shadow-mt-oro.jpg", "size": 77093, "type": "image/jpeg" }, { "file": "books/covers/where-loons-call.jpg", "size": 111264, "type": "image/jpeg" }, { "file": "books/covers/white-elephant.jpg", "size": 75753, "type": "image/jpeg" }, { "file": "books/illustrations/girl.png", "size": 9245, "type": "image/png" }, { "file": "covers/christmas-trees-winter-lake.jpg", "size": 104420, "type": "image/jpeg" }, { "file": "covers/delusions-form.jpg", "size": 68606, "type": "image/jpeg" }, { "file": "covers/human-automata.jpg", "size": 35135, "type": "image/jpeg" }, { "file": "covers/peachy-wu.jpg", "size": 59283, "type": "image/jpeg" }, { "file": "covers/secret-gold.jpg", "size": 53646, "type": "image/jpeg" }, { "file": "covers/shadow-mt-oro.jpg", "size": 77093, "type": "image/jpeg" }, { "file": "covers/where-loons-call.jpg", "size": 111264, "type": "image/jpeg" }, { "file": "covers/white-elephant.jpg", "size": 75753, "type": "image/jpeg" }, { "file": "favicon.png", "size": 9245, "type": "image/png" }, { "file": "illustrations/girl.png", "size": 9245, "type": "image/png" }, { "file": "illustrations/watercolor.jpg", "size": 48848, "type": "image/jpeg" }, { "file": "people/ben.png", "size": 76168, "type": "image/png" }, { "file": "people/claudia.png", "size": 95368, "type": "image/png" }, { "file": "people/gloria.png", "size": 88708, "type": "image/png" }],
  layout: "src/routes/__layout.svelte",
  error: "src/routes/__error.svelte",
  routes: [
    {
      type: "page",
      pattern: /^\/$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/privacy-policy\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/privacy-policy.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/contact\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/contact.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/meet-us\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/meet-us.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/books\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/books/__layout.svelte", "src/routes/books/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/books\/([^/]+?)\/?$/,
      params: (m) => ({ title: d(m[1]) }),
      a: ["src/routes/__layout.svelte", "src/routes/books/__layout.svelte", "src/routes/books/[title].svelte"],
      b: ["src/routes/__error.svelte"]
    }
  ]
};
var get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({ request, resolve: resolve2 }) => resolve2(request)),
  serverFetch: hooks.serverFetch || fetch
});
var module_lookup = {
  "src/routes/__layout.svelte": () => Promise.resolve().then(function() {
    return __layout$1;
  }),
  "src/routes/__error.svelte": () => Promise.resolve().then(function() {
    return __error;
  }),
  "src/routes/index.svelte": () => Promise.resolve().then(function() {
    return index$1;
  }),
  "src/routes/privacy-policy.svelte": () => Promise.resolve().then(function() {
    return privacyPolicy;
  }),
  "src/routes/contact.svelte": () => Promise.resolve().then(function() {
    return contact;
  }),
  "src/routes/meet-us.svelte": () => Promise.resolve().then(function() {
    return meetUs;
  }),
  "src/routes/books/__layout.svelte": () => Promise.resolve().then(function() {
    return __layout;
  }),
  "src/routes/books/index.svelte": () => Promise.resolve().then(function() {
    return index;
  }),
  "src/routes/books/[title].svelte": () => Promise.resolve().then(function() {
    return _title_;
  })
};
var metadata_lookup = { "src/routes/__layout.svelte": { "entry": "/./_app/pages/__layout.svelte-2f6bbc74.js", "css": ["/./_app/assets/pages/__layout.svelte-48f555e0.css"], "js": ["/./_app/pages/__layout.svelte-2f6bbc74.js", "/./_app/chunks/vendor-7804c1c7.js"], "styles": [] }, "src/routes/__error.svelte": { "entry": "/./_app/pages/__error.svelte-b3423bd1.js", "css": [], "js": ["/./_app/pages/__error.svelte-b3423bd1.js", "/./_app/chunks/vendor-7804c1c7.js"], "styles": [] }, "src/routes/index.svelte": { "entry": "/./_app/pages/index.svelte-0095b467.js", "css": ["/./_app/assets/pages/index.svelte-13645f5f.css"], "js": ["/./_app/pages/index.svelte-0095b467.js", "/./_app/chunks/vendor-7804c1c7.js"], "styles": [] }, "src/routes/privacy-policy.svelte": { "entry": "/./_app/pages/privacy-policy.svelte-8e86cbd7.js", "css": [], "js": ["/./_app/pages/privacy-policy.svelte-8e86cbd7.js", "/./_app/chunks/vendor-7804c1c7.js"], "styles": [] }, "src/routes/contact.svelte": { "entry": "/./_app/pages/contact.svelte-d09ecc14.js", "css": [], "js": ["/./_app/pages/contact.svelte-d09ecc14.js", "/./_app/chunks/vendor-7804c1c7.js"], "styles": [] }, "src/routes/meet-us.svelte": { "entry": "/./_app/pages/meet-us.svelte-d643ce0b.js", "css": [], "js": ["/./_app/pages/meet-us.svelte-d643ce0b.js", "/./_app/chunks/vendor-7804c1c7.js", "/./_app/chunks/writing-584ab928.js"], "styles": [] }, "src/routes/books/__layout.svelte": { "entry": "/./_app/pages/books/__layout.svelte-25cee036.js", "css": ["/./_app/assets/pages/books/__layout.svelte-c21b254c.css"], "js": ["/./_app/pages/books/__layout.svelte-25cee036.js", "/./_app/chunks/vendor-7804c1c7.js", "/./_app/chunks/singletons-12a22614.js", "/./_app/chunks/writing-584ab928.js"], "styles": [] }, "src/routes/books/index.svelte": { "entry": "/./_app/pages/books/index.svelte-08fa81ff.js", "css": [], "js": ["/./_app/pages/books/index.svelte-08fa81ff.js", "/./_app/chunks/vendor-7804c1c7.js"], "styles": [] }, "src/routes/books/[title].svelte": { "entry": "/./_app/pages/books/[title].svelte-9dd20a96.js", "css": ["/./_app/assets/pages/books/[title].svelte-c739cf31.css"], "js": ["/./_app/pages/books/[title].svelte-9dd20a96.js", "/./_app/chunks/vendor-7804c1c7.js", "/./_app/chunks/writing-584ab928.js"], "styles": [] } };
async function load_component(file) {
  return {
    module: await module_lookup[file](),
    ...metadata_lookup[file]
  };
}
function render(request, {
  prerender
} = {}) {
  const host = request.headers["host"];
  return respond({ ...request, host }, options, { prerender });
}
var PageTransition_component = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { refresh = "" } = $$props;
  if ($$props.refresh === void 0 && $$bindings.refresh && refresh !== void 0)
    $$bindings.refresh(refresh);
  return `<div>${slots.default ? slots.default({}) : ``}</div>`;
});
var css$3 = {
  code: '@keyframes fade-in{from{opacity:0}to{opacity:1}}.lead{opacity:0;animation:800ms ease-in 1200ms forwards fade-in}.article{opacity:0;animation:800ms ease-in 2000ms forwards fade-in}.article p{opacity:0;animation:800ms ease-in 2600ms forwards fade-in}a{transition:all 0.6s ease-in-out;opacity:0.8;position:relative}a:hover{opacity:1}@media only screen and (hover: none){a{opacity:1}}a::after{content:"";position:absolute;bottom:0;left:0;width:100%;height:2px;background-color:#000;transition:transform 0.35s ease-in-out;transform-origin:left;transform:scaleX(0)}a:hover::after{transform:scaleX(1)}.active-route{opacity:1}.active-route::after{transform:scaleX(1)}',
  map: `{"version":3,"file":"__layout.svelte","sources":["__layout.svelte"],"sourcesContent":["<script context=\\"module\\" lang=\\"ts\\">;\\nexport const load = ({ page }) => ({ props: { path: page.path.split('/')[1] } });\\n<\/script>\\n\\n<script lang=\\"ts\\">import '../tailwind.css';\\nimport PageTransition from '$/components/Transitions/PageTransition.component.svelte';\\nexport let path;\\n<\/script>\\n<div class=\\"mx-8 sm:mx-8 lg:mx-36\\">\\n\\t<nav class=\\"layout h-24 text-2xl\\">\\n\\t\\t<a class=\\"flex items-center\\" class:active-route={path === ''} href=\\"/\\">\\n\\t\\t\\t<img class=\\"h-11 mr-2\\" src=\\"illustrations/girl.png\\" alt=\\"EGT Press Logo\\" />\\n\\t\\t\\tHome\\n\\t\\t</a>\\n\\t\\t<a class:active-route={path.includes('books')} href=\\"/books\\"> Books </a>\\n\\t\\t<a class:active-route={path === 'meet-us'} href=\\"/meet-us\\"> Meet Us </a>\\n\\t</nav>\\n\\t\\n\\t<main class=\\"min-h-screen\\">\\n\\t\\t<PageTransition refresh={path}>\\n\\t\\t\\t<slot />\\n\\t\\t</PageTransition>\\n\\t</main>\\n\\t\\n\\t<footer class=\\"layout h-14 text-lg\\">\\n\\t\\t<a class:active-route={path === 'privacy-policy'} href=\\"/privacy-policy\\"> Privacy Policy </a>\\n\\t\\t<a class:active-route={path === 'contact'} href=\\"/contact\\"> Contact </a>\\n\\t\\t<div class=\\"text-xs\\">\\n\\t\\t\\t<p>&COPY; 2021 by English Garden Talk Press</p>\\n\\t\\t</div>\\n\\t</footer>\\n</div>\\n\\n<style lang=\\"scss\\" global>@keyframes -global-fade-in {\\n  from {\\n    opacity: 0;\\n  }\\n  to {\\n    opacity: 1;\\n  }\\n}\\n:global(.lead) {\\n  opacity: 0;\\n  animation: 800ms ease-in 1200ms forwards fade-in;\\n}\\n\\n:global(.article) {\\n  opacity: 0;\\n  animation: 800ms ease-in 2000ms forwards fade-in;\\n}\\n:global(.article) :global(p) {\\n  opacity: 0;\\n  animation: 800ms ease-in 2600ms forwards fade-in;\\n}\\n\\n:global(a) {\\n  transition: all 0.6s ease-in-out;\\n  opacity: 0.8;\\n  position: relative;\\n}\\n:global(a:hover) {\\n  opacity: 1;\\n}\\n@media only screen and (hover: none) {\\n  :global(a) {\\n    opacity: 1;\\n  }\\n}\\n:global(a::after) {\\n  content: \\"\\";\\n  position: absolute;\\n  bottom: 0;\\n  left: 0;\\n  width: 100%;\\n  height: 2px;\\n  background-color: #000;\\n  transition: transform 0.35s ease-in-out;\\n  transform-origin: left;\\n  transform: scaleX(0);\\n}\\n:global(a:hover::after) {\\n  transform: scaleX(1);\\n}\\n\\n:global(.active-route) {\\n  opacity: 1;\\n}\\n:global(.active-route::after) {\\n  transform: scaleX(1);\\n}</style>\\n"],"names":[],"mappings":"AAiC0B,WAAW,AAAQ,OAAO,AAAC,CAAC,AACpD,IAAI,AAAC,CAAC,AACJ,OAAO,CAAE,CAAC,AACZ,CAAC,AACD,EAAE,AAAC,CAAC,AACF,OAAO,CAAE,CAAC,AACZ,CAAC,AACH,CAAC,AACO,KAAK,AAAE,CAAC,AACd,OAAO,CAAE,CAAC,CACV,SAAS,CAAE,KAAK,CAAC,OAAO,CAAC,MAAM,CAAC,QAAQ,CAAC,OAAO,AAClD,CAAC,AAEO,QAAQ,AAAE,CAAC,AACjB,OAAO,CAAE,CAAC,CACV,SAAS,CAAE,KAAK,CAAC,OAAO,CAAC,MAAM,CAAC,QAAQ,CAAC,OAAO,AAClD,CAAC,AACO,QAAQ,AAAC,CAAC,AAAQ,CAAC,AAAE,CAAC,AAC5B,OAAO,CAAE,CAAC,CACV,SAAS,CAAE,KAAK,CAAC,OAAO,CAAC,MAAM,CAAC,QAAQ,CAAC,OAAO,AAClD,CAAC,AAEO,CAAC,AAAE,CAAC,AACV,UAAU,CAAE,GAAG,CAAC,IAAI,CAAC,WAAW,CAChC,OAAO,CAAE,GAAG,CACZ,QAAQ,CAAE,QAAQ,AACpB,CAAC,AACO,OAAO,AAAE,CAAC,AAChB,OAAO,CAAE,CAAC,AACZ,CAAC,AACD,OAAO,IAAI,CAAC,MAAM,CAAC,GAAG,CAAC,QAAQ,IAAI,CAAC,AAAC,CAAC,AAC5B,CAAC,AAAE,CAAC,AACV,OAAO,CAAE,CAAC,AACZ,CAAC,AACH,CAAC,AACO,QAAQ,AAAE,CAAC,AACjB,OAAO,CAAE,EAAE,CACX,QAAQ,CAAE,QAAQ,CAClB,MAAM,CAAE,CAAC,CACT,IAAI,CAAE,CAAC,CACP,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,GAAG,CACX,gBAAgB,CAAE,IAAI,CACtB,UAAU,CAAE,SAAS,CAAC,KAAK,CAAC,WAAW,CACvC,gBAAgB,CAAE,IAAI,CACtB,SAAS,CAAE,OAAO,CAAC,CAAC,AACtB,CAAC,AACO,cAAc,AAAE,CAAC,AACvB,SAAS,CAAE,OAAO,CAAC,CAAC,AACtB,CAAC,AAEO,aAAa,AAAE,CAAC,AACtB,OAAO,CAAE,CAAC,AACZ,CAAC,AACO,oBAAoB,AAAE,CAAC,AAC7B,SAAS,CAAE,OAAO,CAAC,CAAC,AACtB,CAAC"}`
};
var load$4 = ({ page }) => ({ props: { path: page.path.split("/")[1] } });
var _layout$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { path } = $$props;
  if ($$props.path === void 0 && $$bindings.path && path !== void 0)
    $$bindings.path(path);
  $$result.css.add(css$3);
  return `<div class="${"mx-8 sm:mx-8 lg:mx-36"}"><nav class="${"layout h-24 text-2xl"}"><a class="${["flex items-center", path === "" ? "active-route" : ""].join(" ").trim()}" href="${"/"}"><img class="${"h-11 mr-2"}" src="${"illustrations/girl.png"}" alt="${"EGT Press Logo"}">
			Home
		</a>
		<a href="${"/books"}"${add_classes([path.includes("books") ? "active-route" : ""].join(" ").trim())}>Books </a>
		<a href="${"/meet-us"}"${add_classes([path === "meet-us" ? "active-route" : ""].join(" ").trim())}>Meet Us </a></nav>
	
	<main class="${"min-h-screen"}">${validate_component(PageTransition_component, "PageTransition").$$render($$result, { refresh: path }, {}, {
    default: () => `${slots.default ? slots.default({}) : ``}`
  })}</main>
	
	<footer class="${"layout h-14 text-lg"}"><a href="${"/privacy-policy"}"${add_classes([path === "privacy-policy" ? "active-route" : ""].join(" ").trim())}>Privacy Policy </a>
		<a href="${"/contact"}"${add_classes([path === "contact" ? "active-route" : ""].join(" ").trim())}>Contact </a>
		<div class="${"text-xs"}"><p>\xA9 2021 by English Garden Talk Press</p></div></footer>
</div>`;
});
var __layout$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout$1,
  load: load$4
});
var load$3 = ({ page }) => ({ props: { path: page.path } });
var _error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { path } = $$props;
  if ($$props.path === void 0 && $$bindings.path && path !== void 0)
    $$bindings.path(path);
  return `${$$result.head += `${$$result.title = `<title>404</title>`, ""}`, ""}

<h1 class="${"header"}">404 - Page Does Not Exist</h1>
<p class="${"text-xl px-2 py-4 shadow-md"}">Unfortunately, no page at ${escape2(path)} exists. You find yourself here because something went wrong.
	I suggest you hit the back button or visit a link from thosse in the menu.
</p>`;
});
var __error = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _error,
  load: load$3
});
var css$2 = {
  code: ".article.svelte-1u4n7z6:first-child{margin-right:1.5rem}",
  map: `{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["<script context=\\"module\\" lang=\\"ts\\">export const hydrate = false;\\n<\/script>\\n\\n<svelte:head>\\n\\t<title>EGT Press - Home</title>\\n\\t<meta\\n\\t\\tname=\\"description\\"\\n\\t\\tcontent=\\"The home of English Garden Talk Press and Saint Bridged Vineyard Press.\\n\\t\\tLearn about our authors and the books, whether already published or upcoming and discover us on social media.\\"\\n\\t/>\\n</svelte:head>\\n\\n<div class=\\"lead\\">\\n\\t<h1 class=\\"header my-4\\">Welcome to the home of our craft publishing company</h1>\\n\\t<img class=\\"mx-auto\\" src=\\"illustrations/watercolor.jpg\\" alt=\\"A mesmerizing watercolor\\">\\n</div>\\n\\n<div class=\\"flex\\">\\n\\t<article class=\\"article\\">\\n\\t\\t<h3>English Garden Talk Press</h3>\\n\\t\\t<p>\\n\\t\\t\\tSpecializing in children's literature, English Garden Talk Press' main feature is the Olive\\n\\t\\t\\tand Violet Bright series by Gloria T. August. Envisioned as a book that parents and caretakers\\n\\t\\t\\tcan read to their children for warm, heartwarming stories, the series follows the story of four young English\\n\\t\\t\\thailing from Edwardian England who go around the world and solve mysteries. So far they've had adventures\\n\\t\\t\\tin England, Hong Kong, Tahiti, Bavaria and Hungary, and they're sure to explore more of the world\\n\\t\\t\\tas the 20th century starts to dawn across the world.\\n\\t\\t</p>\\n\\t</article>\\n\\n\\t<article class=\\"article\\">\\n\\t\\t<h3>Saint Bridged Vineyard Press</h3>\\n\\t\\t<p>\\n\\t\\t\\tSpecializing in literature for adults, Saint Bridged Vineyard Press' feature author is Benyakir Horowitz.\\n\\t\\t\\tHis books all occupy the same universe, a science-fiction cyberpunk quasi-satirical world\\n\\t\\t\\twhere humanity keeps on keeping on, seemingly for the sake of keeping up appearances. Inspired by\\n\\t\\t\\tIsaac Asimov and Philip K. Dick, the pushing question in his stories is where does modern existence begin and end?\\n\\t\\t\\tHow human can a robot be, and, moreover, how human is anyone? The definitions and boundaries of knowledge\\n\\t\\t\\tand existence are always mutable in Benyakir Horowitz's work.\\n\\t\\t</p>\\n\\t</article>\\n</div>\\n\\n<style lang=\\"scss\\">.article:first-child {\\n  margin-right: 1.5rem;\\n}</style>\\n"],"names":[],"mappings":"AA2CmB,uBAAQ,YAAY,AAAC,CAAC,AACvC,YAAY,CAAE,MAAM,AACtB,CAAC"}`
};
var hydrate$2 = false;
var Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$2);
  return `${$$result.head += `${$$result.title = `<title>EGT Press - Home</title>`, ""}<meta name="${"description"}" content="${"The home of English Garden Talk Press and Saint Bridged Vineyard Press.\n		Learn about our authors and the books, whether already published or upcoming and discover us on social media."}" data-svelte="svelte-1d6dhnx">`, ""}

<div class="${"lead"}"><h1 class="${"header my-4"}">Welcome to the home of our craft publishing company</h1>
	<img class="${"mx-auto"}" src="${"illustrations/watercolor.jpg"}" alt="${"A mesmerizing watercolor"}"></div>

<div class="${"flex"}"><article class="${"article svelte-1u4n7z6"}"><h3>English Garden Talk Press</h3>
		<p>Specializing in children&#39;s literature, English Garden Talk Press&#39; main feature is the Olive
			and Violet Bright series by Gloria T. August. Envisioned as a book that parents and caretakers
			can read to their children for warm, heartwarming stories, the series follows the story of four young English
			hailing from Edwardian England who go around the world and solve mysteries. So far they&#39;ve had adventures
			in England, Hong Kong, Tahiti, Bavaria and Hungary, and they&#39;re sure to explore more of the world
			as the 20th century starts to dawn across the world.
		</p></article>

	<article class="${"article svelte-1u4n7z6"}"><h3>Saint Bridged Vineyard Press</h3>
		<p>Specializing in literature for adults, Saint Bridged Vineyard Press&#39; feature author is Benyakir Horowitz.
			His books all occupy the same universe, a science-fiction cyberpunk quasi-satirical world
			where humanity keeps on keeping on, seemingly for the sake of keeping up appearances. Inspired by
			Isaac Asimov and Philip K. Dick, the pushing question in his stories is where does modern existence begin and end?
			How human can a robot be, and, moreover, how human is anyone? The definitions and boundaries of knowledge
			and existence are always mutable in Benyakir Horowitz&#39;s work.
		</p></article>
</div>`;
});
var index$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Routes,
  hydrate: hydrate$2
});
var hydrate$1 = false;
var Privacy_policy = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `${$$result.title = `<title>EGT Press - Privacy Policy</title>`, ""}<meta name="${"description"}" content="${"Privacy Policy of the English Garden Talk Press and Saint Bridged Vineyard Press website."}" data-svelte="svelte-rrljc3">`, ""}

<h1 class="${"header"}">Privacy Policy</h1>

<div class="${"w-3/4"}"><p class="${"my-2"}">No personal information is stored, nor are any users tracked.
		There are no cookies nor any private that is stored by this website.
	</p>
	<p class="${"my-2"}">Rest assurred that we take any concerns over privacy and personal data seriously.
		Many websites will track users for no good reason, and we don&#39;t believe in that.
		Our Amazon links don&#39;t even contain affilliate links.
	</p>
	<p class="${"my-2"}">In fact, this website itself is open source, and you can read the code that went into it
		by visiting <a href="${"https://github.com/benyakirten/egt-press"}">this Github repo</a>. You
		can also download the code and repurpose it for your own purposes.
	</p></div>`;
});
var privacyPolicy = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Privacy_policy,
  hydrate: hydrate$1
});
var hydrate = false;
var Contact = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `${$$result.title = `<title>EGT Press - Contact</title>`, ""}<meta name="${"description"}" content="${"Get the details for how to directly contact English Garden Talk Press and/or Saint Bridged Vineyard Press."}" data-svelte="svelte-yjrqi9">`, ""}

<h1 class="${"header"}">Contact Us</h1>

<div><h3 class="${"text-xl my-2"}">Our Presses:</h3>
	<p><a href="${"mailto:contact@egtpress.com"}">By email</a></p>
	<p>By mail: 566 McCaslin Boulevard, POB 270252, Superior, Colorado, 80027-998</p>
	<p><a href="${"https://www.facebook.com/English-Garden-Talk-Press-2023488454570609/"}" rel="${"external"}" target="${"blank"}">On Facebook
		</a></p></div>

<div><h3 class="${"text-xl my-2"}">Benyakir Horowitz</h3>
	<p><a href="${"mailto:ben@benyakiredits.com"}">By email </a></p>
	<p><a href="${"https://benyakiredits.com/about-me/contact/"}" rel="${"external"}" target="${"blank"}">On his blog </a></p>
	<p><a href="${"https://www.facebook.com/BenyakirTen"}" rel="${"external"}" target="${"blank"}">On Facebook </a></p>
	<p><a href="${"https://twitter.com/BenyakirTen"}" rel="${"external"}" target="${"blank"}">On Twitter </a></p></div>`;
});
var contact = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Contact,
  hydrate
});
var books = [
  {
    title: "The Secret Gold of Blackwheat Manor",
    image: "covers/secret-gold.jpg",
    author: "Gloria August",
    pubDate: new Date(2020, 5, 1),
    desc: `Mystery has come to Roseberry Topping, a quiet town on Edwardian England\u2019s North Coast. Olive and Violet Bright, Jack Pems and Judith Pinckney, young sleuths and amateur detectives, have stumbled upon the punctilious town librarian, and her two companions. The three have been holding mysterious meetings in an abandoned manor house known as Mockery Gables, and the Bright sisters are convinced they\u2019re up to no good. Soon, Blackwheat Jam, previously known only as a delicious spread for warm toast on cold mornings, has bubbled to life with a secret kept hidden for centuries. The sleuths take off on a wild ride across the English countryside as they pursue the three conspirators and their powerful secret. Hold the ponies and buckle up! The Bright sisters and their friends are about to shake the Holly District to the ground in a most extraordinary way!`,
    link: "https://www.amazon.com/dp/B085LP1VMD",
    publisher: "English Garden Talk Press",
    ebookIsbn: "978-1-7342095-4-9",
    printedIsbn: "978-1-7342095-0-1",
    audience: "Children",
    keywords: ["Edwardian", "Adventure"]
  },
  {
    title: "Peachy Wu and the Floating Village",
    image: "covers/peachy-wu.jpg",
    author: "Gloria August",
    pubDate: new Date(2020, 7, 1),
    desc: `Olive and Violet Bright, Jack Pems and Judith Pinckney arrive in Hong Kong to visit an old family acquaintance, Peachy Wu, but before they disembark from their ship they receive an urgent telegram: their friend Harold Wuffy is in a bit of a pickle. He has just evaded brutish hooligans, only to discover two Chinese masterpieces hidden in his suitcase. And as Harold contemplates the works of art, a thief breaks into his apartment to steal the priceless treasures. The five friends set about to investigate and soon stumble upon a ring of art forgers and thieves run by a secretive businessman called the Mandarin, who is protected in his exclusive and impenetrable enclave, the Floating Village. But Peachy Wu might have just the way to infiltrate the Mandarin's domain and bringing him to justice. If you\u2019re fast enough you might catch up with our intrepid detectives as they race about the length and breadth of Hong Kong and the New Territories solving the mystery of Peachy Wu and the Floating Village.`,
    link: "https://www.amazon.com/dp/B089GXHVPD",
    publisher: "English Garden Talk Press",
    ebookIsbn: "978-1-7342095-1-8",
    printedIsbn: "978-1-7342095-9-4",
    audience: "Children",
    keywords: ["Edwardian", "Adventure"]
  },
  {
    title: "In the Shadow of Mt. Oro",
    image: "covers/shadow-mt-oro.jpg",
    author: "Gloria August",
    pubDate: new Date(2020, 9, 1),
    desc: `Olive and Violet Bright have arrived on Cocoanut Palm Island for the opening of the Pacific Research Institute when Judith Pinckney shows them a beautiful, exotic flower before she departs for Hermosa. She explains that what she\u2019s holding is a Water Orchid, a plant thought to have been extinct but is now growing again on the island. At the same time, there are reports of strange runoff in the waterways of Cocoanut Palm Island that\u2019s harming the native wildlife. Olive and Violet take the flower to the Institute for examination. With the help of Lieutenant William Charlesson, the lead scientist at the Institute, they set about investigating the mystery and discover the tragic history that led to the suppression of the enchanting orchid. As they unravel the mystery, the Water Orchid begins to claim more of the island at the expense of everything else, and the young English turn to the Tahitian leaders and their priests for help. Together, they rally the people in a fight to save the island from impending ecological catastrophe.`,
    link: "https://www.amazon.com/dp/B08F21M565",
    publisher: "English Garden Talk Press",
    ebookIsbn: "978-1-7342095-2-5",
    printedIsbn: "978-1-7342095-3-2",
    audience: "Children",
    keywords: ["Edwardian", "Adventure"]
  },
  {
    title: "The Human Automata",
    image: "covers/human-automata.jpg",
    author: "Benyakir Horowitz",
    pubDate: new Date(2020, 9, 20),
    desc: `Jules Winters is certain of his destiny, to be a great man and inventor on par with geniuses like Edison or Carnegie. He may not have accomplished anything yet, but a terminal disease seems to be just the salvation he needs. It\u2019s a call to arms with one solution, remake himself as an immortal, future-proof robot. His humanity is worth nothing compared to what he could accomplish without it. As a tireless machine, he could uplift the impoverished and make them valuable members of society. He\u2019s so certain that it\u2019s the best solution that there\u2019s nothing that can dissuade him, not the incredible pain that comes with each step of his transformation, not the disregard he feels from his wife\u2019s family, and certainly not the creeping feeling that no one will ever care about his masterwork.`,
    link: "https://www.amazon.com/dp/B08G3KSNT7",
    publisher: "Saint Bridged Vineyard Press",
    ebookIsbn: "978-0-9779257-1-1",
    printedIsbn: "978-0-9779257-4-2",
    audience: "Adults",
    keywords: ["Science Fiction", "Cyberpunk", "Dystopian"]
  },
  {
    title: "Delusions of Form",
    image: "covers/delusions-form.jpg",
    author: "Benyakir Horowitz",
    pubDate: new Date(2021, 9, 25),
    desc: `The world has lost all sense, or John Albuquerque cannot find any sense to it. Reality drops into the abyss as he crosses an endless desert. A factory disassembles his memories as he investigates it. A house party ends with the disintegration of his body. But forget that. He only cares about one thing: that he exists. Well, he can\u2019t say that with certainty. The cosmos has abandoned him and so has any way to know the truth, much less if such a concept exists. Inspired by the author\u2019s experiences in a coma, follow John Albuquerque on the many paths of a mind in decline.`,
    link: "https://www.amazon.com/dp/B099RNC65L",
    publisher: "Saint Bridged Vineyard Press",
    ebookIsbn: "978-0-9779257-9-7",
    printedIsbn: "978-0-9858431-1-3",
    audience: "Adults",
    keywords: ["Science Fiction", "Cyberpunk", "Dystopian", "Medical"]
  }
];
var people = [
  {
    name: "Gloria T. August",
    image: "people/gloria.png",
    bio: `Gloria August has always had a passion for writing. She started when she was eight and has continued through her whole life. She enjoys writing and reading historical fiction as well as non-fiction in order to interface with the events of the past in terms of a person's life. She is especially proud of her book <em>Inheritance of Stone</em> about the Ludlow Massacre.`,
    books: ["The Secret Gold of Blackwheat Manor", "Peachy Wu and the Floating Village", "In the Shadow of Mt. Oro"]
  },
  {
    name: "Benyakir Horowitz",
    image: "people/ben.png",
    bio: `Benyakir Horowitz writes about the nexus of who people are and how that relates to how they interact. Language is the focus of his works, including two non-fiction works and one fiction novel, in which he examines language, history and culture as media. Recently, he has also become the tech wizard for our presses and designed this webpage. You can check out his <a href="https://github.com/benyakirten">Github</a> if you're curious.`,
    books: ["The Human Automata", "Delusions of Form"]
  },
  {
    name: "Claudia Mandelli",
    image: "people/claudia.png",
    bio: `Claudia Mandelli, our Media Specialist, hails from Milan, Italy. She studied accounting and worked for the Italian government before coming to America and following her passions by joining our team. She currently works as a translator and consultant. She is pictured here holding her rabbit named Ginger. Ginger is a Flemish Giant, one of the largest species of rabbit out there.`
  }
];
var Person_component = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { person } = $$props;
  let { alignLeft = true } = $$props;
  let { open = false } = $$props;
  createEventDispatcher();
  if ($$props.person === void 0 && $$bindings.person && person !== void 0)
    $$bindings.person(person);
  if ($$props.alignLeft === void 0 && $$bindings.alignLeft && alignLeft !== void 0)
    $$bindings.alignLeft(alignLeft);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  return `<section class="${"person my-10 " + escape2(open ? "h-full" : "h-10")}" style="${"transition: all 500ms"}"><div><button class="${"flex pl-2 w-full rounded-xl border border-solid border-black " + escape2(open ? "bg-blue-100" : "bg-white")}"><span class="${"transition-transform duration-500"}"${add_attribute("style", open ? "transform: rotate(270deg)" : "transform: rotate(90deg)", 0)}>\u27A4
            </span>
            <span class="${"mx-2"}">${escape2(person.name)}</span></button>
        <div style="${"transform-origin: top; " + escape2(open ? "transform: scaleY(1)" : "transform: scaleY(0)")}" class="${"flex flex-col md:flex-row transition-transform duration-500 " + escape2(alignLeft ? "" : "md:flex-row-reverse") + " mt-2"}"><img${add_attribute("src", person.image, 0)}${add_attribute("alt", person.name, 0)} class="${"hidden invisible md:block md:visible"}">
            <div class="${"flex flex-col justify-between " + escape2(alignLeft ? "ml-4" : "mr-4")}"><div><div class="${"flex flex-col justify-between"}"><img${add_attribute("src", person.image, 0)}${add_attribute("alt", person.name, 0)} class="${"mb-2 h-24 w-24 block visible md:hidden md:invisible"}">
                        <h3 class="${"text-lg mb-2"}">About ${escape2(person.name.split(" ")[0])}:
                        </h3></div>
                    <p><!-- HTML_TAG_START -->${person.bio}<!-- HTML_TAG_END --></p></div>
                ${person.books ? `<ul role="${"list"}" class="${"my-2"}"><h3 class="${"text-lg"}">Books:</h3>
                        ${each(person.books, (book) => `<li><a${add_attribute("href", `/books/${book}`, 0)}>${escape2(book)}</a>
                            </li>`)}</ul>` : ``}</div></div></div></section>`;
});
var load$2 = () => ({ props: { people } });
var Meet_us = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { people: people2 } = $$props;
  let openPerson = people2[0].name;
  if ($$props.people === void 0 && $$bindings.people && people2 !== void 0)
    $$bindings.people(people2);
  return `${$$result.head += `${$$result.title = `<title>EGT Press - Meet Us</title>`, ""}<meta name="${"description"}" content="${"Learn about the people who make up English Garden Talk Press and Saint Bridged Vineyard Press.\n		We're real people, we promise, and we have our own life stories that informs what we write."}" data-svelte="svelte-yt4rzb">`, ""}

<div><h1 class="${"header"}">Meet Us</h1>
	${each(people2, (person, index2) => `${validate_component(Person_component, "Person").$$render($$result, {
    person,
    alignLeft: index2 % 2 === 0 ? false : true,
    open: openPerson === person.name
  }, {}, {})}`)}</div>`;
});
var meetUs = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Meet_us,
  load: load$2
});
var SlideshowImage_component = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { image } = $$props;
  let { alt } = $$props;
  let { position = "primary" } = $$props;
  createEventDispatcher();
  if ($$props.image === void 0 && $$bindings.image && image !== void 0)
    $$bindings.image(image);
  if ($$props.alt === void 0 && $$bindings.alt && alt !== void 0)
    $$bindings.alt(alt);
  if ($$props.position === void 0 && $$bindings.position && position !== void 0)
    $$bindings.position(position);
  return `<figure class="${"flex flex-col justify-end cursor-pointer mx-1 " + escape2(position === "primary" ? "h-3/4 w-24 md:h-full md:w-36" : "h-1/2 w-16 md:h-3/4 md:w-24")}"><img${add_attribute("class", position === "primary" ? "" : "filter blur-sm", 0)}${add_attribute("src", image, 0)}${add_attribute("alt", alt, 0)}>
	<figcaption class="${"h-20"}"${add_attribute("aria-hidden", position === "primary" ? "false" : "true", 0)}>${slots.default ? slots.default({}) : ``}</figcaption></figure>`;
});
var css$1 = {
  code: ".slideshow-button.svelte-1yo6i2g{opacity:0.8;transition:all 0.8s}.slideshow-button.svelte-1yo6i2g:hover{transform:scale(1.5);opacity:1}",
  map: '{"version":3,"file":"Slideshow.component.svelte","sources":["Slideshow.component.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { goto } from \'$app/navigation\';\\nimport SlideshowImage from \'./SlideshowImage.component.svelte\';\\nexport let books;\\nexport let index = 0;\\nlet indexMinusOne = index === 0 ? books.length - 1 : index - 1;\\nlet indexMinusTwo = indexMinusOne === 0 ? books.length - 1 : indexMinusOne - 1;\\nlet indexPlusOne = index === books.length - 1 ? 0 : index + 1;\\nlet indexPlusTwo = indexPlusOne === books.length - 1 ? 0 : indexPlusOne + 1;\\nfunction moveLeft() {\\n    indexPlusTwo = indexPlusOne;\\n    indexPlusOne = index;\\n    index = indexMinusOne;\\n    indexMinusOne = indexMinusTwo;\\n    indexMinusTwo = indexMinusTwo === 0 ? books.length - 1 : indexMinusTwo - 1;\\n    navigateToIndex();\\n}\\nfunction moveRight() {\\n    indexMinusTwo = indexMinusOne;\\n    indexMinusOne = index;\\n    index = indexPlusOne;\\n    indexPlusOne = indexPlusTwo;\\n    indexPlusTwo = indexPlusTwo === books.length - 1 ? 0 : indexPlusTwo + 1;\\n    navigateToIndex();\\n}\\nfunction setIndexAndNavigate(idx) {\\n    index = idx;\\n    indexMinusOne = index === 0 ? books.length - 1 : index - 1;\\n    indexMinusTwo = indexMinusOne === 0 ? books.length - 1 : indexMinusOne - 1;\\n    indexPlusOne = index === books.length - 1 ? 0 : index + 1;\\n    indexPlusTwo = indexPlusOne === books.length - 1 ? 0 : indexPlusOne + 1;\\n    navigateToIndex();\\n}\\nfunction navigateToIndex() {\\n    goto(`/books/${books[index].title}`);\\n}\\n<\/script>\\n\\n<section class=\\"flex justify-center items-center h-64\\">\\n\\t<div class=\\"hidden-before-md\\">\\n\\t\\t<button class=\\"slideshow-button\\" on:click={moveLeft}>&larr;</button>\\n\\t</div>\\n\\t<SlideshowImage\\n\\t\\ton:select={() => setIndexAndNavigate(indexMinusTwo)}\\n\\t\\timage={books[indexMinusTwo].image}\\n\\t\\talt={books[indexMinusTwo].title}\\n\\t\\tposition=\\"secondary\\"\\n\\t/>\\n\\t<SlideshowImage\\n\\t\\ton:select={() => setIndexAndNavigate(indexMinusOne)}\\n\\t\\timage={books[indexMinusOne].image}\\n\\t\\talt={books[indexMinusOne].title}\\n\\t\\tposition=\\"secondary\\"\\n\\t/>\\n\\t<SlideshowImage on:select={e => goto(`/books/${e.detail}`)} image={books[index].image} alt={books[index].title}>\\n\\t\\t<p class=\\"text-xs text-center\\">{books[index].title}</p>\\n\\t</SlideshowImage>\\n\\t<SlideshowImage\\n\\t\\ton:select={() => setIndexAndNavigate(indexPlusOne)}\\n\\t\\timage={books[indexPlusOne].image}\\n\\t\\talt={books[indexPlusOne].title}\\n\\t\\tposition=\\"secondary\\"\\n\\t/>\\n\\t<SlideshowImage\\n\\t\\ton:select={() => setIndexAndNavigate(indexPlusTwo)}\\n\\t\\timage={books[indexPlusTwo].image}\\n\\t\\talt={books[indexPlusTwo].title}\\n\\t\\tposition=\\"secondary\\"\\n\\t/>\\n\\t<div class=\\"hidden-before-md\\">\\n\\t\\t<button class=\\"slideshow-button\\" on:click={moveRight}>&rarr;</button>\\n\\t</div>\\n</section>\\n<div class=\\"hidden-after-md flex justify-center\\">\\n\\t<button class=\\"slideshow-button\\" on:click={moveLeft}>&larr;</button>\\n\\t<button class=\\"slideshow-button\\" on:click={moveRight}>&rarr;</button>\\n</div>\\n\\n<style lang=\\"scss\\">.slideshow-button {\\n  opacity: 0.8;\\n  transition: all 0.8s;\\n}\\n.slideshow-button:hover {\\n  transform: scale(1.5);\\n  opacity: 1;\\n}</style>\\n"],"names":[],"mappings":"AA6EmB,iBAAiB,eAAC,CAAC,AACpC,OAAO,CAAE,GAAG,CACZ,UAAU,CAAE,GAAG,CAAC,IAAI,AACtB,CAAC,AACD,gCAAiB,MAAM,AAAC,CAAC,AACvB,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,OAAO,CAAE,CAAC,AACZ,CAAC"}'
};
var Slideshow_component = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { books: books2 } = $$props;
  let { index: index2 = 0 } = $$props;
  let indexMinusOne = index2 === 0 ? books2.length - 1 : index2 - 1;
  let indexMinusTwo = indexMinusOne === 0 ? books2.length - 1 : indexMinusOne - 1;
  let indexPlusOne = index2 === books2.length - 1 ? 0 : index2 + 1;
  let indexPlusTwo = indexPlusOne === books2.length - 1 ? 0 : indexPlusOne + 1;
  if ($$props.books === void 0 && $$bindings.books && books2 !== void 0)
    $$bindings.books(books2);
  if ($$props.index === void 0 && $$bindings.index && index2 !== void 0)
    $$bindings.index(index2);
  $$result.css.add(css$1);
  return `<section class="${"flex justify-center items-center h-64"}"><div class="${"hidden-before-md"}"><button class="${"slideshow-button svelte-1yo6i2g"}">\u2190</button></div>
	${validate_component(SlideshowImage_component, "SlideshowImage").$$render($$result, {
    image: books2[indexMinusTwo].image,
    alt: books2[indexMinusTwo].title,
    position: "secondary"
  }, {}, {})}
	${validate_component(SlideshowImage_component, "SlideshowImage").$$render($$result, {
    image: books2[indexMinusOne].image,
    alt: books2[indexMinusOne].title,
    position: "secondary"
  }, {}, {})}
	${validate_component(SlideshowImage_component, "SlideshowImage").$$render($$result, {
    image: books2[index2].image,
    alt: books2[index2].title
  }, {}, {
    default: () => `<p class="${"text-xs text-center"}">${escape2(books2[index2].title)}</p>`
  })}
	${validate_component(SlideshowImage_component, "SlideshowImage").$$render($$result, {
    image: books2[indexPlusOne].image,
    alt: books2[indexPlusOne].title,
    position: "secondary"
  }, {}, {})}
	${validate_component(SlideshowImage_component, "SlideshowImage").$$render($$result, {
    image: books2[indexPlusTwo].image,
    alt: books2[indexPlusTwo].title,
    position: "secondary"
  }, {}, {})}
	<div class="${"hidden-before-md"}"><button class="${"slideshow-button svelte-1yo6i2g"}">\u2192</button></div></section>
<div class="${"hidden-after-md flex justify-center"}"><button class="${"slideshow-button svelte-1yo6i2g"}">\u2190</button>
	<button class="${"slideshow-button svelte-1yo6i2g"}">\u2192</button>
</div>`;
});
var BookTransition_component = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { refresh = "" } = $$props;
  if ($$props.refresh === void 0 && $$bindings.refresh && refresh !== void 0)
    $$bindings.refresh(refresh);
  return `<div>${slots.default ? slots.default({}) : ``}</div>`;
});
var load$1 = ({ page }) => ({
  props: {
    path: page.path,
    books: books.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
  }
});
var _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { books: books2 } = $$props;
  let { path } = $$props;
  let bookIndex = books2.map((b) => b.title).indexOf(path.split("/")[2]);
  if ($$props.books === void 0 && $$bindings.books && books2 !== void 0)
    $$bindings.books(books2);
  if ($$props.path === void 0 && $$bindings.path && path !== void 0)
    $$bindings.path(path);
  return `<header class="${"flex flex-col items-center my-10"}"><p>Grab a book off the shelf</p>
	<div class="${"my-10"}">${validate_component(Slideshow_component, "Slideshow").$$render($$result, {
    books: books2,
    index: bookIndex >= 0 ? bookIndex : 0
  }, {}, {})}</div></header>

${validate_component(BookTransition_component, "BookTransition").$$render($$result, { refresh: path }, {}, {
    default: () => `${slots.default ? slots.default({}) : ``}`
  })}`;
});
var __layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout,
  load: load$1
});
var Books = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `${$$result.title = `<title>EGT Press - Books</title>`, ""}`, ""}

<h1 class="${"header"}">Get started by clicking a book above</h1>`;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Books
});
var css = {
  code: "img.svelte-u7hxaz:hover{height:24rem;width:16rem}li.svelte-u7hxaz{margin-top:0.5rem}",
  map: `{"version":3,"file":"Book.component.svelte","sources":["Book.component.svelte"],"sourcesContent":["<script lang=\\"ts\\">export let book;\\nlet futureBook = book.pubDate.valueOf() > Date.now();\\n<\/script>\\n\\n<section>\\n\\t<h1 class=\\"header\\">{book.title} by {book.author}</h1>\\n\\t<div class=\\"my-4\\">\\n\\t\\t<img\\n\\t\\t\\tclass=\\"ml-4 rounded-sm float-right h-60 w-40 transition-all origin-top-right duration-500\\"\\n\\t\\t\\tsrc={book.image}\\n\\t\\t\\talt={book.title}\\n\\t\\t/>\\n\\t\\t<p class=\\"text-lg\\">{book.desc}</p>\\n\\t</div>\\n\\t<ul role=\\"list\\" class=\\"my-4\\">\\n\\t\\t<li>\\n\\t\\t\\t{futureBook ? 'Coming out on' : 'Published on'} {book.pubDate.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\\n\\t\\t</li>\\n        <li>\\n            Genres: {book.keywords.join(', ')}\\n        </li>\\n\\t\\t<li>\\n\\t\\t\\tPublisher: {book.publisher}\\n\\t\\t</li>\\n\\t\\t<li>\\n\\t\\t\\tAudience: {book.audience}\\n\\t\\t</li>\\n\\t\\t<li>\\n\\t\\t\\tPrint ISBN: {book.printedIsbn}\\n\\t\\t</li>\\n\\t\\t<li>\\n\\t\\t\\tEbook ISBN: {book.printedIsbn}\\n\\t\\t</li>\\n\\t\\t<li>\\n\\t\\t\\t<a href={book.link}>Available for Purchase Here</a>\\n\\t\\t</li>\\n\\t</ul>\\n</section>\\n\\n<style lang=\\"scss\\">img:hover {\\n  height: 24rem;\\n  width: 16rem;\\n}\\n\\nli {\\n  margin-top: 0.5rem;\\n}</style>\\n"],"names":[],"mappings":"AAuCmB,iBAAG,MAAM,AAAC,CAAC,AAC5B,MAAM,CAAE,KAAK,CACb,KAAK,CAAE,KAAK,AACd,CAAC,AAED,EAAE,cAAC,CAAC,AACF,UAAU,CAAE,MAAM,AACpB,CAAC"}`
};
var Book_component = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { book } = $$props;
  let futureBook = book.pubDate.valueOf() > Date.now();
  if ($$props.book === void 0 && $$bindings.book && book !== void 0)
    $$bindings.book(book);
  $$result.css.add(css);
  return `<section><h1 class="${"header"}">${escape2(book.title)} by ${escape2(book.author)}</h1>
	<div class="${"my-4"}"><img class="${"ml-4 rounded-sm float-right h-60 w-40 transition-all origin-top-right duration-500 svelte-u7hxaz"}"${add_attribute("src", book.image, 0)}${add_attribute("alt", book.title, 0)}>
		<p class="${"text-lg"}">${escape2(book.desc)}</p></div>
	<ul role="${"list"}" class="${"my-4"}"><li class="${"svelte-u7hxaz"}">${escape2(futureBook ? "Coming out on" : "Published on")} ${escape2(book.pubDate.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }))}</li>
        <li class="${"svelte-u7hxaz"}">Genres: ${escape2(book.keywords.join(", "))}</li>
		<li class="${"svelte-u7hxaz"}">Publisher: ${escape2(book.publisher)}</li>
		<li class="${"svelte-u7hxaz"}">Audience: ${escape2(book.audience)}</li>
		<li class="${"svelte-u7hxaz"}">Print ISBN: ${escape2(book.printedIsbn)}</li>
		<li class="${"svelte-u7hxaz"}">Ebook ISBN: ${escape2(book.printedIsbn)}</li>
		<li class="${"svelte-u7hxaz"}"><a${add_attribute("href", book.link, 0)}>Available for Purchase Here</a></li></ul>
</section>`;
});
var load = ({ page }) => {
  const book = books.find((b) => b.title === page.params.title);
  return book ? { props: { book } } : null;
};
var U5Btitleu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { book } = $$props;
  if ($$props.book === void 0 && $$bindings.book && book !== void 0)
    $$bindings.book(book);
  return `${$$result.head += `${$$result.title = `<title>${escape2(book.title)}</title>`, ""}<meta name="${"description"}" content="${"Read about " + escape2(book.title) + ", whose genres are " + escape2(book.keywords.join(", "))}" data-svelte="svelte-1l7rlth">`, ""}

${validate_component(Book_component, "Book").$$render($$result, { book }, {}, {})}`;
});
var _title_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": U5Btitleu5D,
  load
});

// .svelte-kit/vercel/entry.js
init();
var entry_default = async (req, res) => {
  const { pathname, searchParams } = new URL(req.url || "", "http://localhost");
  let body;
  try {
    body = await getRawBody(req);
  } catch (err) {
    res.statusCode = err.status || 400;
    return res.end(err.reason || "Invalid request body");
  }
  const rendered = await render({
    method: req.method,
    headers: req.headers,
    path: pathname,
    query: searchParams,
    rawBody: body
  });
  if (rendered) {
    const { status, headers, body: body2 } = rendered;
    return res.writeHead(status, headers).end(body2);
  }
  return res.writeHead(404).end();
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
