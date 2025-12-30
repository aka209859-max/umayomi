var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../.wrangler/tmp/bundle-8YkOfv/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// _worker.js
var ve = Object.defineProperty;
var Lt = /* @__PURE__ */ __name((t) => {
  throw TypeError(t);
}, "Lt");
var be = /* @__PURE__ */ __name((t, e, s) => e in t ? ve(t, e, { enumerable: true, configurable: true, writable: true, value: s }) : t[e] = s, "be");
var p = /* @__PURE__ */ __name((t, e, s) => be(t, typeof e != "symbol" ? e + "" : e, s), "p");
var _t = /* @__PURE__ */ __name((t, e, s) => e.has(t) || Lt("Cannot " + s), "_t");
var i = /* @__PURE__ */ __name((t, e, s) => (_t(t, e, "read from private field"), s ? s.call(t) : e.get(t)), "i");
var m = /* @__PURE__ */ __name((t, e, s) => e.has(t) ? Lt("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, s), "m");
var u = /* @__PURE__ */ __name((t, e, s, r) => (_t(t, e, "write to private field"), r ? r.call(t, s) : e.set(t, s), s), "u");
var x = /* @__PURE__ */ __name((t, e, s) => (_t(t, e, "access private method"), s), "x");
var Ft = /* @__PURE__ */ __name((t, e, s, r) => ({ set _(a) {
  u(t, e, a, s);
}, get _() {
  return i(t, e, r);
} }), "Ft");
var Bt = /* @__PURE__ */ __name((t, e, s) => (r, a) => {
  let n = -1;
  return o(0);
  async function o(l) {
    if (l <= n)
      throw new Error("next() called multiple times");
    n = l;
    let d, c = false, h;
    if (t[l] ? (h = t[l][0][0], r.req.routeIndex = l) : h = l === t.length && a || void 0, h)
      try {
        d = await h(r, () => o(l + 1));
      } catch (f) {
        if (f instanceof Error && e)
          r.error = f, d = await e(f, r), c = true;
        else
          throw f;
      }
    else
      r.finalized === false && s && (d = await s(r));
    return d && (r.finalized === false || c) && (r.res = d), r;
  }
  __name(o, "o");
}, "Bt");
var ye = Symbol();
var we = /* @__PURE__ */ __name(async (t, e = /* @__PURE__ */ Object.create(null)) => {
  const { all: s = false, dot: r = false } = e, n = (t instanceof re ? t.raw.headers : t.headers).get("Content-Type");
  return n != null && n.startsWith("multipart/form-data") || n != null && n.startsWith("application/x-www-form-urlencoded") ? Re(t, { all: s, dot: r }) : {};
}, "we");
async function Re(t, e) {
  const s = await t.formData();
  return s ? Ee(s, e) : {};
}
__name(Re, "Re");
function Ee(t, e) {
  const s = /* @__PURE__ */ Object.create(null);
  return t.forEach((r, a) => {
    e.all || a.endsWith("[]") ? je(s, a, r) : s[a] = r;
  }), e.dot && Object.entries(s).forEach(([r, a]) => {
    r.includes(".") && (Oe(s, r, a), delete s[r]);
  }), s;
}
__name(Ee, "Ee");
var je = /* @__PURE__ */ __name((t, e, s) => {
  t[e] !== void 0 ? Array.isArray(t[e]) ? t[e].push(s) : t[e] = [t[e], s] : e.endsWith("[]") ? t[e] = [s] : t[e] = s;
}, "je");
var Oe = /* @__PURE__ */ __name((t, e, s) => {
  let r = t;
  const a = e.split(".");
  a.forEach((n, o) => {
    o === a.length - 1 ? r[n] = s : ((!r[n] || typeof r[n] != "object" || Array.isArray(r[n]) || r[n] instanceof File) && (r[n] = /* @__PURE__ */ Object.create(null)), r = r[n]);
  });
}, "Oe");
var Qt = /* @__PURE__ */ __name((t) => {
  const e = t.split("/");
  return e[0] === "" && e.shift(), e;
}, "Qt");
var Ce = /* @__PURE__ */ __name((t) => {
  const { groups: e, path: s } = ke(t), r = Qt(s);
  return Se(r, e);
}, "Ce");
var ke = /* @__PURE__ */ __name((t) => {
  const e = [];
  return t = t.replace(/\{[^}]+\}/g, (s, r) => {
    const a = `@${r}`;
    return e.push([a, s]), a;
  }), { groups: e, path: t };
}, "ke");
var Se = /* @__PURE__ */ __name((t, e) => {
  for (let s = e.length - 1; s >= 0; s--) {
    const [r] = e[s];
    for (let a = t.length - 1; a >= 0; a--)
      if (t[a].includes(r)) {
        t[a] = t[a].replace(r, e[s][1]);
        break;
      }
  }
  return t;
}, "Se");
var jt = {};
var Pe = /* @__PURE__ */ __name((t, e) => {
  if (t === "*")
    return "*";
  const s = t.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (s) {
    const r = `${t}#${e}`;
    return jt[r] || (s[2] ? jt[r] = e && e[0] !== ":" && e[0] !== "*" ? [r, s[1], new RegExp(`^${s[2]}(?=/${e})`)] : [t, s[1], new RegExp(`^${s[2]}$`)] : jt[r] = [t, s[1], true]), jt[r];
  }
  return null;
}, "Pe");
var Ht = /* @__PURE__ */ __name((t, e) => {
  try {
    return e(t);
  } catch {
    return t.replace(/(?:%[0-9A-Fa-f]{2})+/g, (s) => {
      try {
        return e(s);
      } catch {
        return s;
      }
    });
  }
}, "Ht");
var Te = /* @__PURE__ */ __name((t) => Ht(t, decodeURI), "Te");
var Zt = /* @__PURE__ */ __name((t) => {
  const e = t.url, s = e.indexOf("/", e.indexOf(":") + 4);
  let r = s;
  for (; r < e.length; r++) {
    const a = e.charCodeAt(r);
    if (a === 37) {
      const n = e.indexOf("?", r), o = e.slice(s, n === -1 ? void 0 : n);
      return Te(o.includes("%25") ? o.replace(/%25/g, "%2525") : o);
    } else if (a === 63)
      break;
  }
  return e.slice(s, r);
}, "Zt");
var Ae = /* @__PURE__ */ __name((t) => {
  const e = Zt(t);
  return e.length > 1 && e.at(-1) === "/" ? e.slice(0, -1) : e;
}, "Ae");
var st = /* @__PURE__ */ __name((t, e, ...s) => (s.length && (e = st(e, ...s)), `${(t == null ? void 0 : t[0]) === "/" ? "" : "/"}${t}${e === "/" ? "" : `${(t == null ? void 0 : t.at(-1)) === "/" ? "" : "/"}${(e == null ? void 0 : e[0]) === "/" ? e.slice(1) : e}`}`), "st");
var te = /* @__PURE__ */ __name((t) => {
  if (t.charCodeAt(t.length - 1) !== 63 || !t.includes(":"))
    return null;
  const e = t.split("/"), s = [];
  let r = "";
  return e.forEach((a) => {
    if (a !== "" && !/\:/.test(a))
      r += "/" + a;
    else if (/\:/.test(a))
      if (/\?/.test(a)) {
        s.length === 0 && r === "" ? s.push("/") : s.push(r);
        const n = a.replace("?", "");
        r += "/" + n, s.push(r);
      } else
        r += "/" + a;
  }), s.filter((a, n, o) => o.indexOf(a) === n);
}, "te");
var It = /* @__PURE__ */ __name((t) => /[%+]/.test(t) ? (t.indexOf("+") !== -1 && (t = t.replace(/\+/g, " ")), t.indexOf("%") !== -1 ? Ht(t, se) : t) : t, "It");
var ee = /* @__PURE__ */ __name((t, e, s) => {
  let r;
  if (!s && e && !/[%+]/.test(e)) {
    let o = t.indexOf("?", 8);
    if (o === -1)
      return;
    for (t.startsWith(e, o + 1) || (o = t.indexOf(`&${e}`, o + 1)); o !== -1; ) {
      const l = t.charCodeAt(o + e.length + 1);
      if (l === 61) {
        const d = o + e.length + 2, c = t.indexOf("&", d);
        return It(t.slice(d, c === -1 ? void 0 : c));
      } else if (l == 38 || isNaN(l))
        return "";
      o = t.indexOf(`&${e}`, o + 1);
    }
    if (r = /[%+]/.test(t), !r)
      return;
  }
  const a = {};
  r ?? (r = /[%+]/.test(t));
  let n = t.indexOf("?", 8);
  for (; n !== -1; ) {
    const o = t.indexOf("&", n + 1);
    let l = t.indexOf("=", n);
    l > o && o !== -1 && (l = -1);
    let d = t.slice(n + 1, l === -1 ? o === -1 ? void 0 : o : l);
    if (r && (d = It(d)), n = o, d === "")
      continue;
    let c;
    l === -1 ? c = "" : (c = t.slice(l + 1, o === -1 ? void 0 : o), r && (c = It(c))), s ? (a[d] && Array.isArray(a[d]) || (a[d] = []), a[d].push(c)) : a[d] ?? (a[d] = c);
  }
  return e ? a[e] : a;
}, "ee");
var _e = ee;
var Ie = /* @__PURE__ */ __name((t, e) => ee(t, e, true), "Ie");
var se = decodeURIComponent;
var Ut = /* @__PURE__ */ __name((t) => Ht(t, se), "Ut");
var nt;
var k;
var M;
var ae;
var ne;
var $t;
var B;
var Kt;
var re = (Kt = /* @__PURE__ */ __name(class {
  constructor(t, e = "/", s = [[]]) {
    m(this, M);
    p(this, "raw");
    m(this, nt);
    m(this, k);
    p(this, "routeIndex", 0);
    p(this, "path");
    p(this, "bodyCache", {});
    m(this, B, (t2) => {
      const { bodyCache: e2, raw: s2 } = this, r = e2[t2];
      if (r)
        return r;
      const a = Object.keys(e2)[0];
      return a ? e2[a].then((n) => (a === "json" && (n = JSON.stringify(n)), new Response(n)[t2]())) : e2[t2] = s2[t2]();
    });
    this.raw = t, this.path = e, u(this, k, s), u(this, nt, {});
  }
  param(t) {
    return t ? x(this, M, ae).call(this, t) : x(this, M, ne).call(this);
  }
  query(t) {
    return _e(this.url, t);
  }
  queries(t) {
    return Ie(this.url, t);
  }
  header(t) {
    if (t)
      return this.raw.headers.get(t) ?? void 0;
    const e = {};
    return this.raw.headers.forEach((s, r) => {
      e[r] = s;
    }), e;
  }
  async parseBody(t) {
    var e;
    return (e = this.bodyCache).parsedBody ?? (e.parsedBody = await we(this, t));
  }
  json() {
    return i(this, B).call(this, "text").then((t) => JSON.parse(t));
  }
  text() {
    return i(this, B).call(this, "text");
  }
  arrayBuffer() {
    return i(this, B).call(this, "arrayBuffer");
  }
  blob() {
    return i(this, B).call(this, "blob");
  }
  formData() {
    return i(this, B).call(this, "formData");
  }
  addValidatedData(t, e) {
    i(this, nt)[t] = e;
  }
  valid(t) {
    return i(this, nt)[t];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get [ye]() {
    return i(this, k);
  }
  get matchedRoutes() {
    return i(this, k)[0].map(([[, t]]) => t);
  }
  get routePath() {
    return i(this, k)[0].map(([[, t]]) => t)[this.routeIndex].path;
  }
}, "Kt"), nt = /* @__PURE__ */ new WeakMap(), k = /* @__PURE__ */ new WeakMap(), M = /* @__PURE__ */ new WeakSet(), ae = /* @__PURE__ */ __name(function(t) {
  const e = i(this, k)[0][this.routeIndex][1][t], s = x(this, M, $t).call(this, e);
  return s && /\%/.test(s) ? Ut(s) : s;
}, "ae"), ne = /* @__PURE__ */ __name(function() {
  const t = {}, e = Object.keys(i(this, k)[0][this.routeIndex][1]);
  for (const s of e) {
    const r = x(this, M, $t).call(this, i(this, k)[0][this.routeIndex][1][s]);
    r !== void 0 && (t[s] = /\%/.test(r) ? Ut(r) : r);
  }
  return t;
}, "ne"), $t = /* @__PURE__ */ __name(function(t) {
  return i(this, k)[1] ? i(this, k)[1][t] : t;
}, "$t"), B = /* @__PURE__ */ new WeakMap(), Kt);
var Ne = { Stringify: 1 };
var ie = /* @__PURE__ */ __name(async (t, e, s, r, a) => {
  typeof t == "object" && !(t instanceof String) && (t instanceof Promise || (t = t.toString()), t instanceof Promise && (t = await t));
  const n = t.callbacks;
  return n != null && n.length ? (a ? a[0] += t : a = [t], Promise.all(n.map((l) => l({ phase: e, buffer: a, context: r }))).then((l) => Promise.all(l.filter(Boolean).map((d) => ie(d, e, false, r, a))).then(() => a[0]))) : Promise.resolve(t);
}, "ie");
var $e = "text/plain; charset=UTF-8";
var Nt = /* @__PURE__ */ __name((t, e) => ({ "Content-Type": t, ...e }), "Nt");
var xt;
var gt;
var N;
var it;
var $;
var C;
var vt;
var ot;
var ct;
var Y;
var bt;
var yt;
var U;
var rt;
var Gt;
var He = (Gt = /* @__PURE__ */ __name(class {
  constructor(t, e) {
    m(this, U);
    m(this, xt);
    m(this, gt);
    p(this, "env", {});
    m(this, N);
    p(this, "finalized", false);
    p(this, "error");
    m(this, it);
    m(this, $);
    m(this, C);
    m(this, vt);
    m(this, ot);
    m(this, ct);
    m(this, Y);
    m(this, bt);
    m(this, yt);
    p(this, "render", (...t2) => (i(this, ot) ?? u(this, ot, (e2) => this.html(e2)), i(this, ot).call(this, ...t2)));
    p(this, "setLayout", (t2) => u(this, vt, t2));
    p(this, "getLayout", () => i(this, vt));
    p(this, "setRenderer", (t2) => {
      u(this, ot, t2);
    });
    p(this, "header", (t2, e2, s) => {
      this.finalized && u(this, C, new Response(i(this, C).body, i(this, C)));
      const r = i(this, C) ? i(this, C).headers : i(this, Y) ?? u(this, Y, new Headers());
      e2 === void 0 ? r.delete(t2) : s != null && s.append ? r.append(t2, e2) : r.set(t2, e2);
    });
    p(this, "status", (t2) => {
      u(this, it, t2);
    });
    p(this, "set", (t2, e2) => {
      i(this, N) ?? u(this, N, /* @__PURE__ */ new Map()), i(this, N).set(t2, e2);
    });
    p(this, "get", (t2) => i(this, N) ? i(this, N).get(t2) : void 0);
    p(this, "newResponse", (...t2) => x(this, U, rt).call(this, ...t2));
    p(this, "body", (t2, e2, s) => x(this, U, rt).call(this, t2, e2, s));
    p(this, "text", (t2, e2, s) => !i(this, Y) && !i(this, it) && !e2 && !s && !this.finalized ? new Response(t2) : x(this, U, rt).call(this, t2, e2, Nt($e, s)));
    p(this, "json", (t2, e2, s) => x(this, U, rt).call(this, JSON.stringify(t2), e2, Nt("application/json", s)));
    p(this, "html", (t2, e2, s) => {
      const r = /* @__PURE__ */ __name((a) => x(this, U, rt).call(this, a, e2, Nt("text/html; charset=UTF-8", s)), "r");
      return typeof t2 == "object" ? ie(t2, Ne.Stringify, false, {}).then(r) : r(t2);
    });
    p(this, "redirect", (t2, e2) => {
      const s = String(t2);
      return this.header("Location", /[^\x00-\xFF]/.test(s) ? encodeURI(s) : s), this.newResponse(null, e2 ?? 302);
    });
    p(this, "notFound", () => (i(this, ct) ?? u(this, ct, () => new Response()), i(this, ct).call(this, this)));
    u(this, xt, t), e && (u(this, $, e.executionCtx), this.env = e.env, u(this, ct, e.notFoundHandler), u(this, yt, e.path), u(this, bt, e.matchResult));
  }
  get req() {
    return i(this, gt) ?? u(this, gt, new re(i(this, xt), i(this, yt), i(this, bt))), i(this, gt);
  }
  get event() {
    if (i(this, $) && "respondWith" in i(this, $))
      return i(this, $);
    throw Error("This context has no FetchEvent");
  }
  get executionCtx() {
    if (i(this, $))
      return i(this, $);
    throw Error("This context has no ExecutionContext");
  }
  get res() {
    return i(this, C) || u(this, C, new Response(null, { headers: i(this, Y) ?? u(this, Y, new Headers()) }));
  }
  set res(t) {
    if (i(this, C) && t) {
      t = new Response(t.body, t);
      for (const [e, s] of i(this, C).headers.entries())
        if (e !== "content-type")
          if (e === "set-cookie") {
            const r = i(this, C).headers.getSetCookie();
            t.headers.delete("set-cookie");
            for (const a of r)
              t.headers.append("set-cookie", a);
          } else
            t.headers.set(e, s);
    }
    u(this, C, t), this.finalized = true;
  }
  get var() {
    return i(this, N) ? Object.fromEntries(i(this, N)) : {};
  }
}, "Gt"), xt = /* @__PURE__ */ new WeakMap(), gt = /* @__PURE__ */ new WeakMap(), N = /* @__PURE__ */ new WeakMap(), it = /* @__PURE__ */ new WeakMap(), $ = /* @__PURE__ */ new WeakMap(), C = /* @__PURE__ */ new WeakMap(), vt = /* @__PURE__ */ new WeakMap(), ot = /* @__PURE__ */ new WeakMap(), ct = /* @__PURE__ */ new WeakMap(), Y = /* @__PURE__ */ new WeakMap(), bt = /* @__PURE__ */ new WeakMap(), yt = /* @__PURE__ */ new WeakMap(), U = /* @__PURE__ */ new WeakSet(), rt = /* @__PURE__ */ __name(function(t, e, s) {
  const r = i(this, C) ? new Headers(i(this, C).headers) : i(this, Y) ?? new Headers();
  if (typeof e == "object" && "headers" in e) {
    const n = e.headers instanceof Headers ? e.headers : new Headers(e.headers);
    for (const [o, l] of n)
      o.toLowerCase() === "set-cookie" ? r.append(o, l) : r.set(o, l);
  }
  if (s)
    for (const [n, o] of Object.entries(s))
      if (typeof o == "string")
        r.set(n, o);
      else {
        r.delete(n);
        for (const l of o)
          r.append(n, l);
      }
  const a = typeof e == "number" ? e : (e == null ? void 0 : e.status) ?? i(this, it);
  return new Response(t, { status: a, headers: r });
}, "rt"), Gt);
var y = "ALL";
var De = "all";
var Me = ["get", "post", "put", "delete", "options", "patch"];
var oe = "Can not add a route since the matcher is already built.";
var ce = /* @__PURE__ */ __name(class extends Error {
}, "ce");
var Le = "__COMPOSED_HANDLER";
var Fe = /* @__PURE__ */ __name((t) => t.text("404 Not Found", 404), "Fe");
var zt = /* @__PURE__ */ __name((t, e) => {
  if ("getResponse" in t) {
    const s = t.getResponse();
    return e.newResponse(s.body, s);
  }
  return console.error(t), e.text("Internal Server Error", 500);
}, "zt");
var S;
var w;
var le;
var P;
var G;
var Ot;
var Ct;
var lt;
var Be = (lt = /* @__PURE__ */ __name(class {
  constructor(e = {}) {
    m(this, w);
    p(this, "get");
    p(this, "post");
    p(this, "put");
    p(this, "delete");
    p(this, "options");
    p(this, "patch");
    p(this, "all");
    p(this, "on");
    p(this, "use");
    p(this, "router");
    p(this, "getPath");
    p(this, "_basePath", "/");
    m(this, S, "/");
    p(this, "routes", []);
    m(this, P, Fe);
    p(this, "errorHandler", zt);
    p(this, "onError", (e2) => (this.errorHandler = e2, this));
    p(this, "notFound", (e2) => (u(this, P, e2), this));
    p(this, "fetch", (e2, ...s) => x(this, w, Ct).call(this, e2, s[1], s[0], e2.method));
    p(this, "request", (e2, s, r2, a2) => e2 instanceof Request ? this.fetch(s ? new Request(e2, s) : e2, r2, a2) : (e2 = e2.toString(), this.fetch(new Request(/^https?:\/\//.test(e2) ? e2 : `http://localhost${st("/", e2)}`, s), r2, a2)));
    p(this, "fire", () => {
      addEventListener("fetch", (e2) => {
        e2.respondWith(x(this, w, Ct).call(this, e2.request, e2, void 0, e2.request.method));
      });
    });
    [...Me, De].forEach((n) => {
      this[n] = (o, ...l) => (typeof o == "string" ? u(this, S, o) : x(this, w, G).call(this, n, i(this, S), o), l.forEach((d) => {
        x(this, w, G).call(this, n, i(this, S), d);
      }), this);
    }), this.on = (n, o, ...l) => {
      for (const d of [o].flat()) {
        u(this, S, d);
        for (const c of [n].flat())
          l.map((h) => {
            x(this, w, G).call(this, c.toUpperCase(), i(this, S), h);
          });
      }
      return this;
    }, this.use = (n, ...o) => (typeof n == "string" ? u(this, S, n) : (u(this, S, "*"), o.unshift(n)), o.forEach((l) => {
      x(this, w, G).call(this, y, i(this, S), l);
    }), this);
    const { strict: r, ...a } = e;
    Object.assign(this, a), this.getPath = r ?? true ? e.getPath ?? Zt : Ae;
  }
  route(e, s) {
    const r = this.basePath(e);
    return s.routes.map((a) => {
      var o;
      let n;
      s.errorHandler === zt ? n = a.handler : (n = /* @__PURE__ */ __name(async (l, d) => (await Bt([], s.errorHandler)(l, () => a.handler(l, d))).res, "n"), n[Le] = a.handler), x(o = r, w, G).call(o, a.method, a.path, n);
    }), this;
  }
  basePath(e) {
    const s = x(this, w, le).call(this);
    return s._basePath = st(this._basePath, e), s;
  }
  mount(e, s, r) {
    let a, n;
    r && (typeof r == "function" ? n = r : (n = r.optionHandler, r.replaceRequest === false ? a = /* @__PURE__ */ __name((d) => d, "a") : a = r.replaceRequest));
    const o = n ? (d) => {
      const c = n(d);
      return Array.isArray(c) ? c : [c];
    } : (d) => {
      let c;
      try {
        c = d.executionCtx;
      } catch {
      }
      return [d.env, c];
    };
    a || (a = (() => {
      const d = st(this._basePath, e), c = d === "/" ? 0 : d.length;
      return (h) => {
        const f = new URL(h.url);
        return f.pathname = f.pathname.slice(c) || "/", new Request(f, h);
      };
    })());
    const l = /* @__PURE__ */ __name(async (d, c) => {
      const h = await s(a(d.req.raw), ...o(d));
      if (h)
        return h;
      await c();
    }, "l");
    return x(this, w, G).call(this, y, st(e, "*"), l), this;
  }
}, "lt"), S = /* @__PURE__ */ new WeakMap(), w = /* @__PURE__ */ new WeakSet(), le = /* @__PURE__ */ __name(function() {
  const e = new lt({ router: this.router, getPath: this.getPath });
  return e.errorHandler = this.errorHandler, u(e, P, i(this, P)), e.routes = this.routes, e;
}, "le"), P = /* @__PURE__ */ new WeakMap(), G = /* @__PURE__ */ __name(function(e, s, r) {
  e = e.toUpperCase(), s = st(this._basePath, s);
  const a = { basePath: this._basePath, path: s, method: e, handler: r };
  this.router.add(e, s, [r, a]), this.routes.push(a);
}, "G"), Ot = /* @__PURE__ */ __name(function(e, s) {
  if (e instanceof Error)
    return this.errorHandler(e, s);
  throw e;
}, "Ot"), Ct = /* @__PURE__ */ __name(function(e, s, r, a) {
  if (a === "HEAD")
    return (async () => new Response(null, await x(this, w, Ct).call(this, e, s, r, "GET")))();
  const n = this.getPath(e, { env: r }), o = this.router.match(a, n), l = new He(e, { path: n, matchResult: o, env: r, executionCtx: s, notFoundHandler: i(this, P) });
  if (o[0].length === 1) {
    let c;
    try {
      c = o[0][0][0][0](l, async () => {
        l.res = await i(this, P).call(this, l);
      });
    } catch (h) {
      return x(this, w, Ot).call(this, h, l);
    }
    return c instanceof Promise ? c.then((h) => h || (l.finalized ? l.res : i(this, P).call(this, l))).catch((h) => x(this, w, Ot).call(this, h, l)) : c ?? i(this, P).call(this, l);
  }
  const d = Bt(o[0], this.errorHandler, i(this, P));
  return (async () => {
    try {
      const c = await d(l);
      if (!c.finalized)
        throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");
      return c.res;
    } catch (c) {
      return x(this, w, Ot).call(this, c, l);
    }
  })();
}, "Ct"), lt);
var de = [];
function Ue(t, e) {
  const s = this.buildAllMatchers(), r = /* @__PURE__ */ __name((a, n) => {
    const o = s[a] || s[y], l = o[2][n];
    if (l)
      return l;
    const d = n.match(o[0]);
    if (!d)
      return [[], de];
    const c = d.indexOf("", 1);
    return [o[1][c], d];
  }, "r");
  return this.match = r, r(t, e);
}
__name(Ue, "Ue");
var St = "[^/]+";
var pt = ".*";
var mt = "(?:|/.*)";
var at = Symbol();
var ze = new Set(".\\+*[^]$()");
function We(t, e) {
  return t.length === 1 ? e.length === 1 ? t < e ? -1 : 1 : -1 : e.length === 1 || t === pt || t === mt ? 1 : e === pt || e === mt ? -1 : t === St ? 1 : e === St ? -1 : t.length === e.length ? t < e ? -1 : 1 : e.length - t.length;
}
__name(We, "We");
var J;
var X;
var T;
var tt;
var qe = (tt = /* @__PURE__ */ __name(class {
  constructor() {
    m(this, J);
    m(this, X);
    m(this, T, /* @__PURE__ */ Object.create(null));
  }
  insert(e, s, r, a, n) {
    if (e.length === 0) {
      if (i(this, J) !== void 0)
        throw at;
      if (n)
        return;
      u(this, J, s);
      return;
    }
    const [o, ...l] = e, d = o === "*" ? l.length === 0 ? ["", "", pt] : ["", "", St] : o === "/*" ? ["", "", mt] : o.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let c;
    if (d) {
      const h = d[1];
      let f = d[2] || St;
      if (h && d[2] && (f === ".*" || (f = f.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:"), /\((?!\?:)/.test(f))))
        throw at;
      if (c = i(this, T)[f], !c) {
        if (Object.keys(i(this, T)).some((v) => v !== pt && v !== mt))
          throw at;
        if (n)
          return;
        c = i(this, T)[f] = new tt(), h !== "" && u(c, X, a.varIndex++);
      }
      !n && h !== "" && r.push([h, i(c, X)]);
    } else if (c = i(this, T)[o], !c) {
      if (Object.keys(i(this, T)).some((h) => h.length > 1 && h !== pt && h !== mt))
        throw at;
      if (n)
        return;
      c = i(this, T)[o] = new tt();
    }
    c.insert(l, s, r, a, n);
  }
  buildRegExpStr() {
    const s = Object.keys(i(this, T)).sort(We).map((r) => {
      const a = i(this, T)[r];
      return (typeof i(a, X) == "number" ? `(${r})@${i(a, X)}` : ze.has(r) ? `\\${r}` : r) + a.buildRegExpStr();
    });
    return typeof i(this, J) == "number" && s.unshift(`#${i(this, J)}`), s.length === 0 ? "" : s.length === 1 ? s[0] : "(?:" + s.join("|") + ")";
  }
}, "tt"), J = /* @__PURE__ */ new WeakMap(), X = /* @__PURE__ */ new WeakMap(), T = /* @__PURE__ */ new WeakMap(), tt);
var Pt;
var wt;
var Vt;
var Ke = (Vt = /* @__PURE__ */ __name(class {
  constructor() {
    m(this, Pt, { varIndex: 0 });
    m(this, wt, new qe());
  }
  insert(t, e, s) {
    const r = [], a = [];
    for (let o = 0; ; ) {
      let l = false;
      if (t = t.replace(/\{[^}]+\}/g, (d) => {
        const c = `@\\${o}`;
        return a[o] = [c, d], o++, l = true, c;
      }), !l)
        break;
    }
    const n = t.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let o = a.length - 1; o >= 0; o--) {
      const [l] = a[o];
      for (let d = n.length - 1; d >= 0; d--)
        if (n[d].indexOf(l) !== -1) {
          n[d] = n[d].replace(l, a[o][1]);
          break;
        }
    }
    return i(this, wt).insert(n, e, r, i(this, Pt), s), r;
  }
  buildRegExp() {
    let t = i(this, wt).buildRegExpStr();
    if (t === "")
      return [/^$/, [], []];
    let e = 0;
    const s = [], r = [];
    return t = t.replace(/#(\d+)|@(\d+)|\.\*\$/g, (a, n, o) => n !== void 0 ? (s[++e] = Number(n), "$()") : (o !== void 0 && (r[Number(o)] = ++e), "")), [new RegExp(`^${t}`), s, r];
  }
}, "Vt"), Pt = /* @__PURE__ */ new WeakMap(), wt = /* @__PURE__ */ new WeakMap(), Vt);
var Ge = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var kt = /* @__PURE__ */ Object.create(null);
function he(t) {
  return kt[t] ?? (kt[t] = new RegExp(t === "*" ? "" : `^${t.replace(/\/\*$|([.\\+*[^\]$()])/g, (e, s) => s ? `\\${s}` : "(?:|/.*)")}$`));
}
__name(he, "he");
function Ve() {
  kt = /* @__PURE__ */ Object.create(null);
}
__name(Ve, "Ve");
function Ye(t) {
  var c;
  const e = new Ke(), s = [];
  if (t.length === 0)
    return Ge;
  const r = t.map((h) => [!/\*|\/:/.test(h[0]), ...h]).sort(([h, f], [v, b]) => h ? 1 : v ? -1 : f.length - b.length), a = /* @__PURE__ */ Object.create(null);
  for (let h = 0, f = -1, v = r.length; h < v; h++) {
    const [b, R, A] = r[h];
    b ? a[R] = [A.map(([E]) => [E, /* @__PURE__ */ Object.create(null)]), de] : f++;
    let g;
    try {
      g = e.insert(R, f, b);
    } catch (E) {
      throw E === at ? new ce(R) : E;
    }
    b || (s[f] = A.map(([E, L]) => {
      const Rt = /* @__PURE__ */ Object.create(null);
      for (L -= 1; L >= 0; L--) {
        const [Et, _] = g[L];
        Rt[Et] = _;
      }
      return [E, Rt];
    }));
  }
  const [n, o, l] = e.buildRegExp();
  for (let h = 0, f = s.length; h < f; h++)
    for (let v = 0, b = s[h].length; v < b; v++) {
      const R = (c = s[h][v]) == null ? void 0 : c[1];
      if (!R)
        continue;
      const A = Object.keys(R);
      for (let g = 0, E = A.length; g < E; g++)
        R[A[g]] = l[R[A[g]]];
    }
  const d = [];
  for (const h in o)
    d[h] = s[o[h]];
  return [n, d, a];
}
__name(Ye, "Ye");
function et(t, e) {
  if (t) {
    for (const s of Object.keys(t).sort((r, a) => a.length - r.length))
      if (he(s).test(e))
        return [...t[s]];
  }
}
__name(et, "et");
var z;
var W;
var Tt;
var fe;
var Yt;
var Je = (Yt = /* @__PURE__ */ __name(class {
  constructor() {
    m(this, Tt);
    p(this, "name", "RegExpRouter");
    m(this, z);
    m(this, W);
    p(this, "match", Ue);
    u(this, z, { [y]: /* @__PURE__ */ Object.create(null) }), u(this, W, { [y]: /* @__PURE__ */ Object.create(null) });
  }
  add(t, e, s) {
    var l;
    const r = i(this, z), a = i(this, W);
    if (!r || !a)
      throw new Error(oe);
    r[t] || [r, a].forEach((d) => {
      d[t] = /* @__PURE__ */ Object.create(null), Object.keys(d[y]).forEach((c) => {
        d[t][c] = [...d[y][c]];
      });
    }), e === "/*" && (e = "*");
    const n = (e.match(/\/:/g) || []).length;
    if (/\*$/.test(e)) {
      const d = he(e);
      t === y ? Object.keys(r).forEach((c) => {
        var h;
        (h = r[c])[e] || (h[e] = et(r[c], e) || et(r[y], e) || []);
      }) : (l = r[t])[e] || (l[e] = et(r[t], e) || et(r[y], e) || []), Object.keys(r).forEach((c) => {
        (t === y || t === c) && Object.keys(r[c]).forEach((h) => {
          d.test(h) && r[c][h].push([s, n]);
        });
      }), Object.keys(a).forEach((c) => {
        (t === y || t === c) && Object.keys(a[c]).forEach((h) => d.test(h) && a[c][h].push([s, n]));
      });
      return;
    }
    const o = te(e) || [e];
    for (let d = 0, c = o.length; d < c; d++) {
      const h = o[d];
      Object.keys(a).forEach((f) => {
        var v;
        (t === y || t === f) && ((v = a[f])[h] || (v[h] = [...et(r[f], h) || et(r[y], h) || []]), a[f][h].push([s, n - c + d + 1]));
      });
    }
  }
  buildAllMatchers() {
    const t = /* @__PURE__ */ Object.create(null);
    return Object.keys(i(this, W)).concat(Object.keys(i(this, z))).forEach((e) => {
      t[e] || (t[e] = x(this, Tt, fe).call(this, e));
    }), u(this, z, u(this, W, void 0)), Ve(), t;
  }
}, "Yt"), z = /* @__PURE__ */ new WeakMap(), W = /* @__PURE__ */ new WeakMap(), Tt = /* @__PURE__ */ new WeakSet(), fe = /* @__PURE__ */ __name(function(t) {
  const e = [];
  let s = t === y;
  return [i(this, z), i(this, W)].forEach((r) => {
    const a = r[t] ? Object.keys(r[t]).map((n) => [n, r[t][n]]) : [];
    a.length !== 0 ? (s || (s = true), e.push(...a)) : t !== y && e.push(...Object.keys(r[y]).map((n) => [n, r[y][n]]));
  }), s ? Ye(e) : null;
}, "fe"), Yt);
var q;
var H;
var Jt;
var Xe = (Jt = /* @__PURE__ */ __name(class {
  constructor(t) {
    p(this, "name", "SmartRouter");
    m(this, q, []);
    m(this, H, []);
    u(this, q, t.routers);
  }
  add(t, e, s) {
    if (!i(this, H))
      throw new Error(oe);
    i(this, H).push([t, e, s]);
  }
  match(t, e) {
    if (!i(this, H))
      throw new Error("Fatal error");
    const s = i(this, q), r = i(this, H), a = s.length;
    let n = 0, o;
    for (; n < a; n++) {
      const l = s[n];
      try {
        for (let d = 0, c = r.length; d < c; d++)
          l.add(...r[d]);
        o = l.match(t, e);
      } catch (d) {
        if (d instanceof ce)
          continue;
        throw d;
      }
      this.match = l.match.bind(l), u(this, q, [l]), u(this, H, void 0);
      break;
    }
    if (n === a)
      throw new Error("Fatal error");
    return this.name = `SmartRouter + ${this.activeRouter.name}`, o;
  }
  get activeRouter() {
    if (i(this, H) || i(this, q).length !== 1)
      throw new Error("No active router has been determined yet.");
    return i(this, q)[0];
  }
}, "Jt"), q = /* @__PURE__ */ new WeakMap(), H = /* @__PURE__ */ new WeakMap(), Jt);
var ut = /* @__PURE__ */ Object.create(null);
var K;
var O;
var Q;
var dt;
var j;
var D;
var V;
var ht;
var Qe = (ht = /* @__PURE__ */ __name(class {
  constructor(e, s, r) {
    m(this, D);
    m(this, K);
    m(this, O);
    m(this, Q);
    m(this, dt, 0);
    m(this, j, ut);
    if (u(this, O, r || /* @__PURE__ */ Object.create(null)), u(this, K, []), e && s) {
      const a = /* @__PURE__ */ Object.create(null);
      a[e] = { handler: s, possibleKeys: [], score: 0 }, u(this, K, [a]);
    }
    u(this, Q, []);
  }
  insert(e, s, r) {
    u(this, dt, ++Ft(this, dt)._);
    let a = this;
    const n = Ce(s), o = [];
    for (let l = 0, d = n.length; l < d; l++) {
      const c = n[l], h = n[l + 1], f = Pe(c, h), v = Array.isArray(f) ? f[0] : c;
      if (v in i(a, O)) {
        a = i(a, O)[v], f && o.push(f[1]);
        continue;
      }
      i(a, O)[v] = new ht(), f && (i(a, Q).push(f), o.push(f[1])), a = i(a, O)[v];
    }
    return i(a, K).push({ [e]: { handler: r, possibleKeys: o.filter((l, d, c) => c.indexOf(l) === d), score: i(this, dt) } }), a;
  }
  search(e, s) {
    var d;
    const r = [];
    u(this, j, ut);
    let n = [this];
    const o = Qt(s), l = [];
    for (let c = 0, h = o.length; c < h; c++) {
      const f = o[c], v = c === h - 1, b = [];
      for (let R = 0, A = n.length; R < A; R++) {
        const g = n[R], E = i(g, O)[f];
        E && (u(E, j, i(g, j)), v ? (i(E, O)["*"] && r.push(...x(this, D, V).call(this, i(E, O)["*"], e, i(g, j))), r.push(...x(this, D, V).call(this, E, e, i(g, j)))) : b.push(E));
        for (let L = 0, Rt = i(g, Q).length; L < Rt; L++) {
          const Et = i(g, Q)[L], _ = i(g, j) === ut ? {} : { ...i(g, j) };
          if (Et === "*") {
            const F = i(g, O)["*"];
            F && (r.push(...x(this, D, V).call(this, F, e, i(g, j))), u(F, j, _), b.push(F));
            continue;
          }
          const [xe, Mt, ft] = Et;
          if (!f && !(ft instanceof RegExp))
            continue;
          const I = i(g, O)[xe], ge = o.slice(c).join("/");
          if (ft instanceof RegExp) {
            const F = ft.exec(ge);
            if (F) {
              if (_[Mt] = F[0], r.push(...x(this, D, V).call(this, I, e, i(g, j), _)), Object.keys(i(I, O)).length) {
                u(I, j, _);
                const At = ((d = F[0].match(/\//)) == null ? void 0 : d.length) ?? 0;
                (l[At] || (l[At] = [])).push(I);
              }
              continue;
            }
          }
          (ft === true || ft.test(f)) && (_[Mt] = f, v ? (r.push(...x(this, D, V).call(this, I, e, _, i(g, j))), i(I, O)["*"] && r.push(...x(this, D, V).call(this, i(I, O)["*"], e, _, i(g, j)))) : (u(I, j, _), b.push(I)));
        }
      }
      n = b.concat(l.shift() ?? []);
    }
    return r.length > 1 && r.sort((c, h) => c.score - h.score), [r.map(({ handler: c, params: h }) => [c, h])];
  }
}, "ht"), K = /* @__PURE__ */ new WeakMap(), O = /* @__PURE__ */ new WeakMap(), Q = /* @__PURE__ */ new WeakMap(), dt = /* @__PURE__ */ new WeakMap(), j = /* @__PURE__ */ new WeakMap(), D = /* @__PURE__ */ new WeakSet(), V = /* @__PURE__ */ __name(function(e, s, r, a) {
  const n = [];
  for (let o = 0, l = i(e, K).length; o < l; o++) {
    const d = i(e, K)[o], c = d[s] || d[y], h = {};
    if (c !== void 0 && (c.params = /* @__PURE__ */ Object.create(null), n.push(c), r !== ut || a && a !== ut))
      for (let f = 0, v = c.possibleKeys.length; f < v; f++) {
        const b = c.possibleKeys[f], R = h[c.score];
        c.params[b] = a != null && a[b] && !R ? a[b] : r[b] ?? (a == null ? void 0 : a[b]), h[c.score] = true;
      }
  }
  return n;
}, "V"), ht);
var Z;
var Xt;
var Ze = (Xt = /* @__PURE__ */ __name(class {
  constructor() {
    p(this, "name", "TrieRouter");
    m(this, Z);
    u(this, Z, new Qe());
  }
  add(t, e, s) {
    const r = te(e);
    if (r) {
      for (let a = 0, n = r.length; a < n; a++)
        i(this, Z).insert(t, r[a], s);
      return;
    }
    i(this, Z).insert(t, e, s);
  }
  match(t, e) {
    return i(this, Z).search(t, e);
  }
}, "Xt"), Z = /* @__PURE__ */ new WeakMap(), Xt);
var ue = /* @__PURE__ */ __name(class extends Be {
  constructor(t = {}) {
    super(t), this.router = t.router ?? new Xe({ routers: [new Je(), new Ze()] });
  }
}, "ue");
var ts = /^\s*(?:text\/(?!event-stream(?:[;\s]|$))[^;\s]+|application\/(?:javascript|json|xml|xml-dtd|ecmascript|dart|postscript|rtf|tar|toml|vnd\.dart|vnd\.ms-fontobject|vnd\.ms-opentype|wasm|x-httpd-php|x-javascript|x-ns-proxy-autoconfig|x-sh|x-tar|x-virtualbox-hdd|x-virtualbox-ova|x-virtualbox-ovf|x-virtualbox-vbox|x-virtualbox-vdi|x-virtualbox-vhd|x-virtualbox-vmdk|x-www-form-urlencoded)|font\/(?:otf|ttf)|image\/(?:bmp|vnd\.adobe\.photoshop|vnd\.microsoft\.icon|vnd\.ms-dds|x-icon|x-ms-bmp)|message\/rfc822|model\/gltf-binary|x-shader\/x-fragment|x-shader\/x-vertex|[^;\s]+?\+(?:json|text|xml|yaml))(?:[;\s]|$)/i;
var Wt = /* @__PURE__ */ __name((t, e = ss) => {
  const s = /\.([a-zA-Z0-9]+?)$/, r = t.match(s);
  if (!r)
    return;
  let a = e[r[1]];
  return a && a.startsWith("text") && (a += "; charset=utf-8"), a;
}, "Wt");
var es = { aac: "audio/aac", avi: "video/x-msvideo", avif: "image/avif", av1: "video/av1", bin: "application/octet-stream", bmp: "image/bmp", css: "text/css", csv: "text/csv", eot: "application/vnd.ms-fontobject", epub: "application/epub+zip", gif: "image/gif", gz: "application/gzip", htm: "text/html", html: "text/html", ico: "image/x-icon", ics: "text/calendar", jpeg: "image/jpeg", jpg: "image/jpeg", js: "text/javascript", json: "application/json", jsonld: "application/ld+json", map: "application/json", mid: "audio/x-midi", midi: "audio/x-midi", mjs: "text/javascript", mp3: "audio/mpeg", mp4: "video/mp4", mpeg: "video/mpeg", oga: "audio/ogg", ogv: "video/ogg", ogx: "application/ogg", opus: "audio/opus", otf: "font/otf", pdf: "application/pdf", png: "image/png", rtf: "application/rtf", svg: "image/svg+xml", tif: "image/tiff", tiff: "image/tiff", ts: "video/mp2t", ttf: "font/ttf", txt: "text/plain", wasm: "application/wasm", webm: "video/webm", weba: "audio/webm", webmanifest: "application/manifest+json", webp: "image/webp", woff: "font/woff", woff2: "font/woff2", xhtml: "application/xhtml+xml", xml: "application/xml", zip: "application/zip", "3gp": "video/3gpp", "3g2": "video/3gpp2", gltf: "model/gltf+json", glb: "model/gltf-binary" };
var ss = es;
var rs = /* @__PURE__ */ __name((...t) => {
  let e = t.filter((a) => a !== "").join("/");
  e = e.replace(new RegExp("(?<=\\/)\\/+", "g"), "");
  const s = e.split("/"), r = [];
  for (const a of s)
    a === ".." && r.length > 0 && r.at(-1) !== ".." ? r.pop() : a !== "." && r.push(a);
  return r.join("/") || ".";
}, "rs");
var pe = { br: ".br", zstd: ".zst", gzip: ".gz" };
var as = Object.keys(pe);
var ns = "index.html";
var is = /* @__PURE__ */ __name((t) => {
  const e = t.root ?? "./", s = t.path, r = t.join ?? rs;
  return async (a, n) => {
    var h, f, v, b;
    if (a.finalized)
      return n();
    let o;
    if (t.path)
      o = t.path;
    else
      try {
        if (o = decodeURIComponent(a.req.path), /(?:^|[\/\\])\.\.(?:$|[\/\\])/.test(o))
          throw new Error();
      } catch {
        return await ((h = t.onNotFound) == null ? void 0 : h.call(t, a.req.path, a)), n();
      }
    let l = r(e, !s && t.rewriteRequestPath ? t.rewriteRequestPath(o) : o);
    t.isDir && await t.isDir(l) && (l = r(l, ns));
    const d = t.getContent;
    let c = await d(l, a);
    if (c instanceof Response)
      return a.newResponse(c.body, c);
    if (c) {
      const R = t.mimes && Wt(l, t.mimes) || Wt(l);
      if (a.header("Content-Type", R || "application/octet-stream"), t.precompressed && (!R || ts.test(R))) {
        const A = new Set((f = a.req.header("Accept-Encoding")) == null ? void 0 : f.split(",").map((g) => g.trim()));
        for (const g of as) {
          if (!A.has(g))
            continue;
          const E = await d(l + pe[g], a);
          if (E) {
            c = E, a.header("Content-Encoding", g), a.header("Vary", "Accept-Encoding", { append: true });
            break;
          }
        }
      }
      return await ((v = t.onFound) == null ? void 0 : v.call(t, l, a)), a.body(c);
    }
    await ((b = t.onNotFound) == null ? void 0 : b.call(t, l, a)), await n();
  };
}, "is");
var os = /* @__PURE__ */ __name(async (t, e) => {
  let s;
  e && e.manifest ? typeof e.manifest == "string" ? s = JSON.parse(e.manifest) : s = e.manifest : typeof __STATIC_CONTENT_MANIFEST == "string" ? s = JSON.parse(__STATIC_CONTENT_MANIFEST) : s = __STATIC_CONTENT_MANIFEST;
  let r;
  e && e.namespace ? r = e.namespace : r = __STATIC_CONTENT;
  const a = s[t] || t;
  if (!a)
    return null;
  const n = await r.get(a, { type: "stream" });
  return n || null;
}, "os");
var cs = /* @__PURE__ */ __name((t) => async function(s, r) {
  return is({ ...t, getContent: async (n) => os(n, { manifest: t.manifest, namespace: t.namespace ? t.namespace : s.env ? s.env.__STATIC_CONTENT : void 0 }) })(s, r);
}, "cs");
var ls = /* @__PURE__ */ __name((t) => cs(t), "ls");
var Dt = new ue();
Dt.use("/static/*", ls({ root: "./public" }));
Dt.get("/", (t) => t.html(`<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UMAYOMI - \u99AC\u3092\u8AAD\u3080\u3002\u30EC\u30FC\u30B9\u304C\u5909\u308F\u308B\u3002</title>
    <script src="https://cdn.tailwindcss.com"><\/script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"><\/script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        * {
            font-family: 'Inter', sans-serif;
        }
        
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        
        ::-webkit-scrollbar-track {
            background: #1e293b;
        }
        
        ::-webkit-scrollbar-thumb {
            background: #475569;
            border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: #64748b;
        }
        
        .glass {
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(148, 163, 184, 0.1);
        }
        
        .transition-smooth {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-glow:hover {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
        }
        
        .data-row:hover {
            background: rgba(59, 130, 246, 0.1);
            transform: translateX(4px);
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        
        .chart-container {
            position: relative;
            height: 300px;
        }
    </style>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'dark-bg': '#0f172a',
                        'dark-card': '#1e293b',
                        'dark-border': '#334155',
                    }
                }
            }
        }
    <\/script>
</head>
<body class="bg-dark-bg text-gray-100 min-h-screen">
    
    <!-- Sidebar -->
    <div class="fixed left-0 top-0 h-full w-64 glass z-50 overflow-y-auto">
        <div class="p-6">
            <!-- Logo -->
            <div class="flex items-center space-x-3 mb-8">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <i class="fas fa-horse-head text-white text-xl"></i>
                </div>
                <div>
                    <h1 class="text-xl font-bold text-white">UMAYOMI</h1>
                    <p class="text-xs text-gray-400">\u99AC\u3092\u8AAD\u3080\u3002\u30EC\u30FC\u30B9\u304C\u5909\u308F\u308B\u3002</p>
                </div>
            </div>
            
            <!-- Navigation -->
            <nav class="space-y-2">
                <a href="#" class="flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-600 text-white transition-smooth">
                    <i class="fas fa-home w-5"></i>
                    <span class="font-medium">\u30C0\u30C3\u30B7\u30E5\u30DC\u30FC\u30C9</span>
                </a>
                <a href="#" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-dark-card hover:text-white transition-smooth">
                    <i class="fas fa-flag-checkered w-5"></i>
                    <span class="font-medium">\u30EC\u30FC\u30B9\u691C\u7D22</span>
                </a>
                <a href="#" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-dark-card hover:text-white transition-smooth">
                    <i class="fas fa-horse w-5"></i>
                    <span class="font-medium">\u99AC\u691C\u7D22</span>
                </a>
                <a href="#" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-dark-card hover:text-white transition-smooth">
                    <i class="fas fa-user-tie w-5"></i>
                    <span class="font-medium">\u9A0E\u624B\u691C\u7D22</span>
                </a>
                <a href="#" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-dark-card hover:text-white transition-smooth">
                    <i class="fas fa-sliders-h w-5"></i>
                    <span class="font-medium">\u30D5\u30A1\u30AF\u30BF\u30FC\u5206\u6790</span>
                </a>
                <a href="#" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-dark-card hover:text-white transition-smooth">
                    <i class="fas fa-chart-line w-5"></i>
                    <span class="font-medium">\u30D0\u30C3\u30AF\u30C6\u30B9\u30C8</span>
                </a>
            </nav>
            
            <!-- Bottom Menu -->
            <div class="mt-8 pt-8 border-t border-dark-border space-y-2">
                <a href="#" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-dark-card hover:text-white transition-smooth">
                    <i class="fas fa-cog w-5"></i>
                    <span class="font-medium">\u8A2D\u5B9A</span>
                </a>
                <a href="#" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-dark-card hover:text-white transition-smooth">
                    <i class="fas fa-question-circle w-5"></i>
                    <span class="font-medium">\u30D8\u30EB\u30D7</span>
                </a>
            </div>
            
            <!-- Version Info -->
            <div class="mt-8 px-4 py-3 glass rounded-lg">
                <p class="text-xs text-gray-500">Phase 4 - Day 3</p>
                <p class="text-xs text-gray-400 mt-1">\u9032\u6357: 20% (2/10\u65E5)</p>
                <div class="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                    <div class="bg-blue-600 h-1.5 rounded-full" style="width: 20%"></div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Main Content -->
    <div class="ml-64 p-8">
        
        <!-- Header -->
        <div class="flex justify-between items-center mb-8 animate-fade-in-up">
            <div>
                <h2 class="text-3xl font-bold text-white">\u30C0\u30C3\u30B7\u30E5\u30DC\u30FC\u30C9</h2>
                <p class="text-gray-400 mt-1">2016-2025\u5E74\u306E\u30C7\u30FC\u30BF\u5206\u6790 (1,043\u65E5\u5206)</p>
            </div>
            <div class="flex items-center space-x-4">
                <div class="glass px-4 py-2 rounded-lg">
                    <i class="fas fa-calendar-alt text-blue-400 mr-2"></i>
                    <span class="text-sm text-gray-300">2025\u5E7412\u670830\u65E5</span>
                </div>
                <div class="glass w-10 h-10 rounded-lg flex items-center justify-center hover-glow transition-smooth cursor-pointer">
                    <i class="fas fa-bell text-gray-400"></i>
                </div>
                <div class="glass w-10 h-10 rounded-lg flex items-center justify-center hover-glow transition-smooth cursor-pointer">
                    <i class="fas fa-user text-gray-400"></i>
                </div>
            </div>
        </div>
        
        <!-- KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <!-- Card 1: \u56DE\u53CE\u7387 -->
            <div class="glass rounded-xl p-6 hover-glow transition-smooth animate-fade-in-up delay-100">
                <div class="flex items-center justify-between mb-4">
                    <div class="text-gray-400 text-sm font-medium">\u56DE\u53CE\u7387</div>
                    <div class="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                        <i class="fas fa-coins text-green-400"></i>
                    </div>
                </div>
                <div class="text-4xl font-bold text-white mb-2">128.5%</div>
                <div class="flex items-center text-sm">
                    <i class="fas fa-arrow-up text-green-400 mr-1"></i>
                    <span class="text-green-400 font-medium">+8.3%</span>
                    <span class="text-gray-500 ml-2">vs \u5148\u6708</span>
                </div>
            </div>
            
            <!-- Card 2: \u7684\u4E2D\u7387 -->
            <div class="glass rounded-xl p-6 hover-glow transition-smooth animate-fade-in-up delay-200">
                <div class="flex items-center justify-between mb-4">
                    <div class="text-gray-400 text-sm font-medium">\u7684\u4E2D\u7387</div>
                    <div class="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <i class="fas fa-bullseye text-blue-400"></i>
                    </div>
                </div>
                <div class="text-4xl font-bold text-white mb-2">35.2%</div>
                <div class="flex items-center text-sm">
                    <i class="fas fa-arrow-up text-green-400 mr-1"></i>
                    <span class="text-green-400 font-medium">+2.1%</span>
                    <span class="text-gray-500 ml-2">vs \u5148\u6708</span>
                </div>
            </div>
            
            <!-- Card 3: ROI -->
            <div class="glass rounded-xl p-6 hover-glow transition-smooth animate-fade-in-up delay-300">
                <div class="flex items-center justify-between mb-4">
                    <div class="text-gray-400 text-sm font-medium">ROI (\u6295\u8CC7\u53CE\u76CA\u7387)</div>
                    <div class="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                        <i class="fas fa-chart-line text-purple-400"></i>
                    </div>
                </div>
                <div class="text-4xl font-bold text-white mb-2">+28.5%</div>
                <div class="flex items-center text-sm">
                    <i class="fas fa-arrow-up text-green-400 mr-1"></i>
                    <span class="text-green-400 font-medium">+5.2%</span>
                    <span class="text-gray-500 ml-2">vs \u5148\u6708</span>
                </div>
            </div>
        </div>
        
        <!-- Chart Section -->
        <div class="glass rounded-xl p-6 mb-8 animate-fade-in-up delay-400">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h3 class="text-xl font-bold text-white">\u56DE\u53CE\u7387\u63A8\u79FB (\u6708\u5225)</h3>
                    <p class="text-sm text-gray-400 mt-1">2024\u5E741\u6708 - 2025\u5E7412\u6708</p>
                </div>
                <div class="flex space-x-2">
                    <button class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-smooth">
                        \u6708\u5225
                    </button>
                    <button class="px-4 py-2 glass text-gray-400 rounded-lg text-sm font-medium hover:bg-dark-card transition-smooth">
                        \u9031\u5225
                    </button>
                    <button class="px-4 py-2 glass text-gray-400 rounded-lg text-sm font-medium hover:bg-dark-card transition-smooth">
                        \u65E5\u5225
                    </button>
                </div>
            </div>
            <div class="chart-container">
                <canvas id="recoveryChart"></canvas>
            </div>
        </div>
        
        <!-- Data Table -->
        <div class="glass rounded-xl p-6 animate-fade-in-up delay-400">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h3 class="text-xl font-bold text-white">\u6700\u8FD1\u306E\u30EC\u30FC\u30B9\u7D50\u679C</h3>
                    <p class="text-sm text-gray-400 mt-1">\u516810,430\u30EC\u30FC\u30B9\u304B\u3089\u8868\u793A</p>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="relative">
                        <input type="text" placeholder="\u691C\u7D22..." 
                               class="bg-dark-card border border-dark-border rounded-lg px-4 py-2 pl-10 text-sm text-gray-300 focus:outline-none focus:border-blue-500 transition-smooth w-64">
                        <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                    </div>
                    <button class="px-4 py-2 glass text-gray-400 rounded-lg text-sm font-medium hover:bg-dark-card transition-smooth">
                        <i class="fas fa-filter mr-2"></i>\u30D5\u30A3\u30EB\u30BF\u30FC
                    </button>
                </div>
            </div>
            
            <!-- Table -->
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="border-b border-dark-border">
                            <th class="text-left py-4 px-4 text-sm font-semibold text-gray-400">\u65E5\u4ED8</th>
                            <th class="text-left py-4 px-4 text-sm font-semibold text-gray-400">\u7AF6\u99AC\u5834</th>
                            <th class="text-left py-4 px-4 text-sm font-semibold text-gray-400">\u30EC\u30FC\u30B9</th>
                            <th class="text-left py-4 px-4 text-sm font-semibold text-gray-400">\u8DDD\u96E2</th>
                            <th class="text-left py-4 px-4 text-sm font-semibold text-gray-400">\u99AC\u5834</th>
                            <th class="text-left py-4 px-4 text-sm font-semibold text-gray-400">\u56DE\u53CE\u7387</th>
                            <th class="text-left py-4 px-4 text-sm font-semibold text-gray-400">\u7684\u4E2D</th>
                            <th class="text-right py-4 px-4 text-sm font-semibold text-gray-400">\u64CD\u4F5C</th>
                        </tr>
                    </thead>
                    <tbody id="raceTableBody">
                        <!-- Data will be inserted by JavaScript -->
                    </tbody>
                </table>
            </div>
            
            <!-- Pagination -->
            <div class="flex items-center justify-between mt-6 pt-6 border-t border-dark-border">
                <div class="text-sm text-gray-400">
                    1-10 / 10,430 \u30EC\u30FC\u30B9
                </div>
                <div class="flex space-x-2">
                    <button class="px-3 py-2 glass text-gray-400 rounded-lg text-sm hover:bg-dark-card transition-smooth">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">1</button>
                    <button class="px-3 py-2 glass text-gray-400 rounded-lg text-sm hover:bg-dark-card transition-smooth">2</button>
                    <button class="px-3 py-2 glass text-gray-400 rounded-lg text-sm hover:bg-dark-card transition-smooth">3</button>
                    <button class="px-3 py-2 glass text-gray-400 rounded-lg text-sm hover:bg-dark-card transition-smooth">...</button>
                    <button class="px-3 py-2 glass text-gray-400 rounded-lg text-sm hover:bg-dark-card transition-smooth">1043</button>
                    <button class="px-3 py-2 glass text-gray-400 rounded-lg text-sm hover:bg-dark-card transition-smooth">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
        
    </div>
    
    <script>
// UMAYOMI Dashboard JavaScript

// Sample race data
const sampleRaces = [
    { date: '2025-12-29', track: '\u6771\u4EAC', race: '1R', distance: '1600m', condition: '\u826F', recovery: 145.2, hit: true },
    { date: '2025-12-29', track: '\u6771\u4EAC', race: '2R', distance: '2000m', condition: '\u826F', recovery: 98.5, hit: false },
    { date: '2025-12-29', track: '\u4E2D\u5C71', race: '1R', distance: '1200m', condition: '\u7A0D\u91CD', recovery: 132.8, hit: true },
    { date: '2025-12-28', track: '\u962A\u795E', race: '3R', distance: '1800m', condition: '\u826F', recovery: 156.3, hit: true },
    { date: '2025-12-28', track: '\u6771\u4EAC', race: '5R', distance: '2400m', condition: '\u826F', recovery: 89.2, hit: false },
    { date: '2025-12-28', track: '\u4E2D\u5C71', race: '7R', distance: '1600m', condition: '\u826F', recovery: 142.1, hit: true },
    { date: '2025-12-27', track: '\u962A\u795E', race: '2R', distance: '1400m', condition: '\u91CD', recovery: 178.5, hit: true },
    { date: '2025-12-27', track: '\u6771\u4EAC', race: '4R', distance: '1800m', condition: '\u826F', recovery: 95.6, hit: false },
    { date: '2025-12-27', track: '\u4E2D\u5C71', race: '6R', distance: '2000m', condition: '\u7A0D\u91CD', recovery: 125.3, hit: true },
    { date: '2025-12-26', track: '\u962A\u795E', race: '8R', distance: '1600m', condition: '\u826F', recovery: 162.7, hit: true },
];

// Populate race table
function populateRaceTable() {
    const tbody = document.getElementById('raceTableBody');
    tbody.innerHTML = '';
    
    sampleRaces.forEach((race, index) => {
        const row = document.createElement('tr');
        row.className = 'border-b border-dark-border data-row transition-smooth cursor-pointer';
        row.style.opacity = '0';
        row.style.animation = \`fadeInUp 0.4s ease-out \${index * 0.05}s forwards\`;
        
        const hitBadge = race.hit 
            ? '<span class="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs font-medium">\u7684\u4E2D</span>'
            : '<span class="px-2 py-1 bg-gray-600/20 text-gray-400 rounded text-xs font-medium">\u4E0D\u7684\u4E2D</span>';
        
        const recoveryColor = race.recovery >= 100 ? 'text-green-400' : 'text-red-400';
        
        row.innerHTML = \`
            <td class="py-4 px-4 text-sm text-gray-300">\${race.date}</td>
            <td class="py-4 px-4">
                <span class="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-medium">
                    \${race.track}
                </span>
            </td>
            <td class="py-4 px-4 text-sm font-medium text-white">\${race.race}</td>
            <td class="py-4 px-4 text-sm text-gray-300">\${race.distance}</td>
            <td class="py-4 px-4">
                <span class="px-2 py-1 bg-slate-600/30 text-gray-300 rounded text-xs">
                    \${race.condition}
                </span>
            </td>
            <td class="py-4 px-4 text-sm font-bold \${recoveryColor}">\${race.recovery}%</td>
            <td class="py-4 px-4">\${hitBadge}</td>
            <td class="py-4 px-4 text-right">
                <button class="px-3 py-1 glass text-gray-400 rounded text-xs hover:bg-dark-card hover:text-white transition-smooth">
                    <i class="fas fa-eye mr-1"></i>\u8A73\u7D30
                </button>
            </td>
        \`;
        
        tbody.appendChild(row);
    });
}

// Create recovery rate chart
function createRecoveryChart() {
    const ctx = document.getElementById('recoveryChart').getContext('2d');
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1\u6708', '2\u6708', '3\u6708', '4\u6708', '5\u6708', '6\u6708', '7\u6708', '8\u6708', '9\u6708', '10\u6708', '11\u6708', '12\u6708'],
            datasets: [{
                label: '\u56DE\u53CE\u7387 (%)',
                data: [125, 118, 132, 145, 128, 135, 142, 138, 148, 152, 146, 158],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: '#0f172a',
                pointBorderWidth: 2,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: 'rgb(59, 130, 246)',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#f8fafc',
                    bodyColor: '#cbd5e1',
                    borderColor: '#334155',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return '\u56DE\u53CE\u7387: ' + context.parsed.y + '%';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(51, 65, 85, 0.3)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#94a3b8',
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    populateRaceTable();
    createRecoveryChart();
});
    <\/script>
</body>
</html>`));
var qt = new ue();
var ds = Object.assign({ "/src/index.tsx": Dt });
var me = false;
for (const [, t] of Object.entries(ds))
  t && (qt.route("/", t), qt.notFound(t.notFoundHandler), me = true);
if (!me)
  throw new Error("Can't import modules from ['/src/index.tsx','/app/server.ts']");

// ../node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// ../.wrangler/tmp/bundle-8YkOfv/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = qt;

// ../node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// ../.wrangler/tmp/bundle-8YkOfv/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=bundledWorker-0.28772430115130043.mjs.map
