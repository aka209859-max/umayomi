var Bo=Object.defineProperty;var pn=i=>{throw TypeError(i)};var zo=(i,t,e)=>t in i?Bo(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var m=(i,t,e)=>zo(i,typeof t!="symbol"?t+"":t,e),hr=(i,t,e)=>t.has(i)||pn("Cannot "+e);var a=(i,t,e)=>(hr(i,t,"read from private field"),e?e.call(i):t.get(i)),w=(i,t,e)=>t.has(i)?pn("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(i):t.set(i,e),p=(i,t,e,s)=>(hr(i,t,"write to private field"),s?s.call(i,e):t.set(i,e),e),x=(i,t,e)=>(hr(i,t,"access private method"),e);var Ms=(i,t,e,s)=>({set _(r){p(i,t,r,e)},get _(){return a(i,t,s)}});import{fileURLToPath as ja}from"node:url";import{win32 as Mr,posix as Ho}from"node:path";import Zr,{realpathSync as Wo,readlinkSync as Uo,readdirSync as qo,readdir as Go,lstatSync as Vo}from"fs";import*as Ko from"node:fs";import{realpath as Jo,readlink as Yo,readdir as Zo,lstat as Xo}from"node:fs/promises";import{EventEmitter as Xr}from"node:events";import Oa from"node:stream";import{StringDecoder as Qo}from"node:string_decoder";import ar from"path";import tc from"util";var mn=(i,t,e)=>(s,r)=>{let n=-1;return o(0);async function o(c){if(c<=n)throw new Error("next() called multiple times");n=c;let l,d=!1,h;if(i[c]?(h=i[c][0][0],s.req.routeIndex=c):h=c===i.length&&r||void 0,h)try{l=await h(s,()=>o(c+1))}catch(f){if(f instanceof Error&&t)s.error=f,l=await t(f,s),d=!0;else throw f}else s.finalized===!1&&e&&(l=await e(s));return l&&(s.finalized===!1||d)&&(s.res=l),s}},ec=Symbol(),sc=async(i,t=Object.create(null))=>{const{all:e=!1,dot:s=!1}=t,n=(i instanceof $a?i.raw.headers:i.headers).get("Content-Type");return n!=null&&n.startsWith("multipart/form-data")||n!=null&&n.startsWith("application/x-www-form-urlencoded")?ic(i,{all:e,dot:s}):{}};async function ic(i,t){const e=await i.formData();return e?rc(e,t):{}}function rc(i,t){const e=Object.create(null);return i.forEach((s,r)=>{t.all||r.endsWith("[]")?nc(e,r,s):e[r]=s}),t.dot&&Object.entries(e).forEach(([s,r])=>{s.includes(".")&&(ac(e,s,r),delete e[s])}),e}var nc=(i,t,e)=>{i[t]!==void 0?Array.isArray(i[t])?i[t].push(e):i[t]=[i[t],e]:t.endsWith("[]")?i[t]=[e]:i[t]=e},ac=(i,t,e)=>{let s=i;const r=t.split(".");r.forEach((n,o)=>{o===r.length-1?s[n]=e:((!s[n]||typeof s[n]!="object"||Array.isArray(s[n])||s[n]instanceof File)&&(s[n]=Object.create(null)),s=s[n])})},Aa=i=>{const t=i.split("/");return t[0]===""&&t.shift(),t},oc=i=>{const{groups:t,path:e}=cc(i),s=Aa(e);return lc(s,t)},cc=i=>{const t=[];return i=i.replace(/\{[^}]+\}/g,(e,s)=>{const r=`@${s}`;return t.push([r,e]),r}),{groups:t,path:i}},lc=(i,t)=>{for(let e=t.length-1;e>=0;e--){const[s]=t[e];for(let r=i.length-1;r>=0;r--)if(i[r].includes(s)){i[r]=i[r].replace(s,t[e][1]);break}}return i},ji={},dc=(i,t)=>{if(i==="*")return"*";const e=i.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(e){const s=`${i}#${t}`;return ji[s]||(e[2]?ji[s]=t&&t[0]!==":"&&t[0]!=="*"?[s,e[1],new RegExp(`^${e[2]}(?=/${t})`)]:[i,e[1],new RegExp(`^${e[2]}$`)]:ji[s]=[i,e[1],!0]),ji[s]}return null},Qr=(i,t)=>{try{return t(i)}catch{return i.replace(/(?:%[0-9A-Fa-f]{2})+/g,e=>{try{return t(e)}catch{return e}})}},hc=i=>Qr(i,decodeURI),Ma=i=>{const t=i.url,e=t.indexOf("/",t.indexOf(":")+4);let s=e;for(;s<t.length;s++){const r=t.charCodeAt(s);if(r===37){const n=t.indexOf("?",s),o=t.slice(e,n===-1?void 0:n);return hc(o.includes("%25")?o.replace(/%25/g,"%2525"):o)}else if(r===63)break}return t.slice(e,s)},fc=i=>{const t=Ma(i);return t.length>1&&t.at(-1)==="/"?t.slice(0,-1):t},os=(i,t,...e)=>(e.length&&(t=os(t,...e)),`${(i==null?void 0:i[0])==="/"?"":"/"}${i}${t==="/"?"":`${(i==null?void 0:i.at(-1))==="/"?"":"/"}${(t==null?void 0:t[0])==="/"?t.slice(1):t}`}`),Ia=i=>{if(i.charCodeAt(i.length-1)!==63||!i.includes(":"))return null;const t=i.split("/"),e=[];let s="";return t.forEach(r=>{if(r!==""&&!/\:/.test(r))s+="/"+r;else if(/\:/.test(r))if(/\?/.test(r)){e.length===0&&s===""?e.push("/"):e.push(s);const n=r.replace("?","");s+="/"+n,e.push(s)}else s+="/"+r}),e.filter((r,n,o)=>o.indexOf(r)===n)},fr=i=>/[%+]/.test(i)?(i.indexOf("+")!==-1&&(i=i.replace(/\+/g," ")),i.indexOf("%")!==-1?Qr(i,Da):i):i,Fa=(i,t,e)=>{let s;if(!e&&t&&!/[%+]/.test(t)){let o=i.indexOf("?",8);if(o===-1)return;for(i.startsWith(t,o+1)||(o=i.indexOf(`&${t}`,o+1));o!==-1;){const c=i.charCodeAt(o+t.length+1);if(c===61){const l=o+t.length+2,d=i.indexOf("&",l);return fr(i.slice(l,d===-1?void 0:d))}else if(c==38||isNaN(c))return"";o=i.indexOf(`&${t}`,o+1)}if(s=/[%+]/.test(i),!s)return}const r={};s??(s=/[%+]/.test(i));let n=i.indexOf("?",8);for(;n!==-1;){const o=i.indexOf("&",n+1);let c=i.indexOf("=",n);c>o&&o!==-1&&(c=-1);let l=i.slice(n+1,c===-1?o===-1?void 0:o:c);if(s&&(l=fr(l)),n=o,l==="")continue;let d;c===-1?d="":(d=i.slice(c+1,o===-1?void 0:o),s&&(d=fr(d))),e?(r[l]&&Array.isArray(r[l])||(r[l]=[]),r[l].push(d)):r[l]??(r[l]=d)}return t?r[t]:r},uc=Fa,pc=(i,t)=>Fa(i,t,!0),Da=decodeURIComponent,gn=i=>Qr(i,Da),hs,vt,le,Pa,Na,Ir,be,ea,$a=(ea=class{constructor(i,t="/",e=[[]]){w(this,le);m(this,"raw");w(this,hs);w(this,vt);m(this,"routeIndex",0);m(this,"path");m(this,"bodyCache",{});w(this,be,i=>{const{bodyCache:t,raw:e}=this,s=t[i];if(s)return s;const r=Object.keys(t)[0];return r?t[r].then(n=>(r==="json"&&(n=JSON.stringify(n)),new Response(n)[i]())):t[i]=e[i]()});this.raw=i,this.path=t,p(this,vt,e),p(this,hs,{})}param(i){return i?x(this,le,Pa).call(this,i):x(this,le,Na).call(this)}query(i){return uc(this.url,i)}queries(i){return pc(this.url,i)}header(i){if(i)return this.raw.headers.get(i)??void 0;const t={};return this.raw.headers.forEach((e,s)=>{t[s]=e}),t}async parseBody(i){var t;return(t=this.bodyCache).parsedBody??(t.parsedBody=await sc(this,i))}json(){return a(this,be).call(this,"text").then(i=>JSON.parse(i))}text(){return a(this,be).call(this,"text")}arrayBuffer(){return a(this,be).call(this,"arrayBuffer")}blob(){return a(this,be).call(this,"blob")}formData(){return a(this,be).call(this,"formData")}addValidatedData(i,t){a(this,hs)[i]=t}valid(i){return a(this,hs)[i]}get url(){return this.raw.url}get method(){return this.raw.method}get[ec](){return a(this,vt)}get matchedRoutes(){return a(this,vt)[0].map(([[,i]])=>i)}get routePath(){return a(this,vt)[0].map(([[,i]])=>i)[this.routeIndex].path}},hs=new WeakMap,vt=new WeakMap,le=new WeakSet,Pa=function(i){const t=a(this,vt)[0][this.routeIndex][1][i],e=x(this,le,Ir).call(this,t);return e&&/\%/.test(e)?gn(e):e},Na=function(){const i={},t=Object.keys(a(this,vt)[0][this.routeIndex][1]);for(const e of t){const s=x(this,le,Ir).call(this,a(this,vt)[0][this.routeIndex][1][e]);s!==void 0&&(i[e]=/\%/.test(s)?gn(s):s)}return i},Ir=function(i){return a(this,vt)[1]?a(this,vt)[1][i]:i},be=new WeakMap,ea),mc={Stringify:1},La=async(i,t,e,s,r)=>{typeof i=="object"&&!(i instanceof String)&&(i instanceof Promise||(i=i.toString()),i instanceof Promise&&(i=await i));const n=i.callbacks;return n!=null&&n.length?(r?r[0]+=i:r=[i],Promise.all(n.map(c=>c({phase:t,buffer:r,context:s}))).then(c=>Promise.all(c.filter(Boolean).map(l=>La(l,t,!1,s,r))).then(()=>r[0]))):Promise.resolve(i)},gc="text/plain; charset=UTF-8",ur=(i,t)=>({"Content-Type":i,...t}),Js,Ys,Xt,fs,Qt,rt,Zs,us,ps,Be,Xs,Qs,ye,cs,sa,bc=(sa=class{constructor(i,t){w(this,ye);w(this,Js);w(this,Ys);m(this,"env",{});w(this,Xt);m(this,"finalized",!1);m(this,"error");w(this,fs);w(this,Qt);w(this,rt);w(this,Zs);w(this,us);w(this,ps);w(this,Be);w(this,Xs);w(this,Qs);m(this,"render",(...i)=>(a(this,us)??p(this,us,t=>this.html(t)),a(this,us).call(this,...i)));m(this,"setLayout",i=>p(this,Zs,i));m(this,"getLayout",()=>a(this,Zs));m(this,"setRenderer",i=>{p(this,us,i)});m(this,"header",(i,t,e)=>{this.finalized&&p(this,rt,new Response(a(this,rt).body,a(this,rt)));const s=a(this,rt)?a(this,rt).headers:a(this,Be)??p(this,Be,new Headers);t===void 0?s.delete(i):e!=null&&e.append?s.append(i,t):s.set(i,t)});m(this,"status",i=>{p(this,fs,i)});m(this,"set",(i,t)=>{a(this,Xt)??p(this,Xt,new Map),a(this,Xt).set(i,t)});m(this,"get",i=>a(this,Xt)?a(this,Xt).get(i):void 0);m(this,"newResponse",(...i)=>x(this,ye,cs).call(this,...i));m(this,"body",(i,t,e)=>x(this,ye,cs).call(this,i,t,e));m(this,"text",(i,t,e)=>!a(this,Be)&&!a(this,fs)&&!t&&!e&&!this.finalized?new Response(i):x(this,ye,cs).call(this,i,t,ur(gc,e)));m(this,"json",(i,t,e)=>x(this,ye,cs).call(this,JSON.stringify(i),t,ur("application/json",e)));m(this,"html",(i,t,e)=>{const s=r=>x(this,ye,cs).call(this,r,t,ur("text/html; charset=UTF-8",e));return typeof i=="object"?La(i,mc.Stringify,!1,{}).then(s):s(i)});m(this,"redirect",(i,t)=>{const e=String(i);return this.header("Location",/[^\x00-\xFF]/.test(e)?encodeURI(e):e),this.newResponse(null,t??302)});m(this,"notFound",()=>(a(this,ps)??p(this,ps,()=>new Response),a(this,ps).call(this,this)));p(this,Js,i),t&&(p(this,Qt,t.executionCtx),this.env=t.env,p(this,ps,t.notFoundHandler),p(this,Qs,t.path),p(this,Xs,t.matchResult))}get req(){return a(this,Ys)??p(this,Ys,new $a(a(this,Js),a(this,Qs),a(this,Xs))),a(this,Ys)}get event(){if(a(this,Qt)&&"respondWith"in a(this,Qt))return a(this,Qt);throw Error("This context has no FetchEvent")}get executionCtx(){if(a(this,Qt))return a(this,Qt);throw Error("This context has no ExecutionContext")}get res(){return a(this,rt)||p(this,rt,new Response(null,{headers:a(this,Be)??p(this,Be,new Headers)}))}set res(i){if(a(this,rt)&&i){i=new Response(i.body,i);for(const[t,e]of a(this,rt).headers.entries())if(t!=="content-type")if(t==="set-cookie"){const s=a(this,rt).headers.getSetCookie();i.headers.delete("set-cookie");for(const r of s)i.headers.append("set-cookie",r)}else i.headers.set(t,e)}p(this,rt,i),this.finalized=!0}get var(){return a(this,Xt)?Object.fromEntries(a(this,Xt)):{}}},Js=new WeakMap,Ys=new WeakMap,Xt=new WeakMap,fs=new WeakMap,Qt=new WeakMap,rt=new WeakMap,Zs=new WeakMap,us=new WeakMap,ps=new WeakMap,Be=new WeakMap,Xs=new WeakMap,Qs=new WeakMap,ye=new WeakSet,cs=function(i,t,e){const s=a(this,rt)?new Headers(a(this,rt).headers):a(this,Be)??new Headers;if(typeof t=="object"&&"headers"in t){const n=t.headers instanceof Headers?t.headers:new Headers(t.headers);for(const[o,c]of n)o.toLowerCase()==="set-cookie"?s.append(o,c):s.set(o,c)}if(e)for(const[n,o]of Object.entries(e))if(typeof o=="string")s.set(n,o);else{s.delete(n);for(const c of o)s.append(n,c)}const r=typeof t=="number"?t:(t==null?void 0:t.status)??a(this,fs);return new Response(i,{status:r,headers:s})},sa),B="ALL",yc="all",xc=["get","post","put","delete","options","patch"],Ba="Can not add a route since the matcher is already built.",za=class extends Error{},wc="__COMPOSED_HANDLER",vc=i=>i.text("404 Not Found",404),bn=(i,t)=>{if("getResponse"in i){const e=i.getResponse();return t.newResponse(e.body,e)}return console.error(i),t.text("Internal Server Error",500)},Ot,z,Ha,At,Fe,Li,Bi,ms,Ec=(ms=class{constructor(t={}){w(this,z);m(this,"get");m(this,"post");m(this,"put");m(this,"delete");m(this,"options");m(this,"patch");m(this,"all");m(this,"on");m(this,"use");m(this,"router");m(this,"getPath");m(this,"_basePath","/");w(this,Ot,"/");m(this,"routes",[]);w(this,At,vc);m(this,"errorHandler",bn);m(this,"onError",t=>(this.errorHandler=t,this));m(this,"notFound",t=>(p(this,At,t),this));m(this,"fetch",(t,...e)=>x(this,z,Bi).call(this,t,e[1],e[0],t.method));m(this,"request",(t,e,s,r)=>t instanceof Request?this.fetch(e?new Request(t,e):t,s,r):(t=t.toString(),this.fetch(new Request(/^https?:\/\//.test(t)?t:`http://localhost${os("/",t)}`,e),s,r)));m(this,"fire",()=>{addEventListener("fetch",t=>{t.respondWith(x(this,z,Bi).call(this,t.request,t,void 0,t.request.method))})});[...xc,yc].forEach(n=>{this[n]=(o,...c)=>(typeof o=="string"?p(this,Ot,o):x(this,z,Fe).call(this,n,a(this,Ot),o),c.forEach(l=>{x(this,z,Fe).call(this,n,a(this,Ot),l)}),this)}),this.on=(n,o,...c)=>{for(const l of[o].flat()){p(this,Ot,l);for(const d of[n].flat())c.map(h=>{x(this,z,Fe).call(this,d.toUpperCase(),a(this,Ot),h)})}return this},this.use=(n,...o)=>(typeof n=="string"?p(this,Ot,n):(p(this,Ot,"*"),o.unshift(n)),o.forEach(c=>{x(this,z,Fe).call(this,B,a(this,Ot),c)}),this);const{strict:s,...r}=t;Object.assign(this,r),this.getPath=s??!0?t.getPath??Ma:fc}route(t,e){const s=this.basePath(t);return e.routes.map(r=>{var o;let n;e.errorHandler===bn?n=r.handler:(n=async(c,l)=>(await mn([],e.errorHandler)(c,()=>r.handler(c,l))).res,n[wc]=r.handler),x(o=s,z,Fe).call(o,r.method,r.path,n)}),this}basePath(t){const e=x(this,z,Ha).call(this);return e._basePath=os(this._basePath,t),e}mount(t,e,s){let r,n;s&&(typeof s=="function"?n=s:(n=s.optionHandler,s.replaceRequest===!1?r=l=>l:r=s.replaceRequest));const o=n?l=>{const d=n(l);return Array.isArray(d)?d:[d]}:l=>{let d;try{d=l.executionCtx}catch{}return[l.env,d]};r||(r=(()=>{const l=os(this._basePath,t),d=l==="/"?0:l.length;return h=>{const f=new URL(h.url);return f.pathname=f.pathname.slice(d)||"/",new Request(f,h)}})());const c=async(l,d)=>{const h=await e(r(l.req.raw),...o(l));if(h)return h;await d()};return x(this,z,Fe).call(this,B,os(t,"*"),c),this}},Ot=new WeakMap,z=new WeakSet,Ha=function(){const t=new ms({router:this.router,getPath:this.getPath});return t.errorHandler=this.errorHandler,p(t,At,a(this,At)),t.routes=this.routes,t},At=new WeakMap,Fe=function(t,e,s){t=t.toUpperCase(),e=os(this._basePath,e);const r={basePath:this._basePath,path:e,method:t,handler:s};this.router.add(t,e,[s,r]),this.routes.push(r)},Li=function(t,e){if(t instanceof Error)return this.errorHandler(t,e);throw t},Bi=function(t,e,s,r){if(r==="HEAD")return(async()=>new Response(null,await x(this,z,Bi).call(this,t,e,s,"GET")))();const n=this.getPath(t,{env:s}),o=this.router.match(r,n),c=new bc(t,{path:n,matchResult:o,env:s,executionCtx:e,notFoundHandler:a(this,At)});if(o[0].length===1){let d;try{d=o[0][0][0][0](c,async()=>{c.res=await a(this,At).call(this,c)})}catch(h){return x(this,z,Li).call(this,h,c)}return d instanceof Promise?d.then(h=>h||(c.finalized?c.res:a(this,At).call(this,c))).catch(h=>x(this,z,Li).call(this,h,c)):d??a(this,At).call(this,c)}const l=mn(o[0],this.errorHandler,a(this,At));return(async()=>{try{const d=await l(c);if(!d.finalized)throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return d.res}catch(d){return x(this,z,Li).call(this,d,c)}})()},ms),Wa=[];function Sc(i,t){const e=this.buildAllMatchers(),s=(r,n)=>{const o=e[r]||e[B],c=o[2][n];if(c)return c;const l=n.match(o[0]);if(!l)return[[],Wa];const d=l.indexOf("",1);return[o[1][d],l]};return this.match=s,s(i,t)}var Zi="[^/]+",Vs=".*",Ks="(?:|/.*)",ls=Symbol(),kc=new Set(".\\+*[^]$()");function Cc(i,t){return i.length===1?t.length===1?i<t?-1:1:-1:t.length===1||i===Vs||i===Ks?1:t===Vs||t===Ks?-1:i===Zi?1:t===Zi?-1:i.length===t.length?i<t?-1:1:t.length-i.length}var ze,He,Mt,ss,_c=(ss=class{constructor(){w(this,ze);w(this,He);w(this,Mt,Object.create(null))}insert(t,e,s,r,n){if(t.length===0){if(a(this,ze)!==void 0)throw ls;if(n)return;p(this,ze,e);return}const[o,...c]=t,l=o==="*"?c.length===0?["","",Vs]:["","",Zi]:o==="/*"?["","",Ks]:o.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);let d;if(l){const h=l[1];let f=l[2]||Zi;if(h&&l[2]&&(f===".*"||(f=f.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(f))))throw ls;if(d=a(this,Mt)[f],!d){if(Object.keys(a(this,Mt)).some(u=>u!==Vs&&u!==Ks))throw ls;if(n)return;d=a(this,Mt)[f]=new ss,h!==""&&p(d,He,r.varIndex++)}!n&&h!==""&&s.push([h,a(d,He)])}else if(d=a(this,Mt)[o],!d){if(Object.keys(a(this,Mt)).some(h=>h.length>1&&h!==Vs&&h!==Ks))throw ls;if(n)return;d=a(this,Mt)[o]=new ss}d.insert(c,e,s,r,n)}buildRegExpStr(){const e=Object.keys(a(this,Mt)).sort(Cc).map(s=>{const r=a(this,Mt)[s];return(typeof a(r,He)=="number"?`(${s})@${a(r,He)}`:kc.has(s)?`\\${s}`:s)+r.buildRegExpStr()});return typeof a(this,ze)=="number"&&e.unshift(`#${a(this,ze)}`),e.length===0?"":e.length===1?e[0]:"(?:"+e.join("|")+")"}},ze=new WeakMap,He=new WeakMap,Mt=new WeakMap,ss),rr,ti,ia,Tc=(ia=class{constructor(){w(this,rr,{varIndex:0});w(this,ti,new _c)}insert(i,t,e){const s=[],r=[];for(let o=0;;){let c=!1;if(i=i.replace(/\{[^}]+\}/g,l=>{const d=`@\\${o}`;return r[o]=[d,l],o++,c=!0,d}),!c)break}const n=i.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let o=r.length-1;o>=0;o--){const[c]=r[o];for(let l=n.length-1;l>=0;l--)if(n[l].indexOf(c)!==-1){n[l]=n[l].replace(c,r[o][1]);break}}return a(this,ti).insert(n,t,s,a(this,rr),e),s}buildRegExp(){let i=a(this,ti).buildRegExpStr();if(i==="")return[/^$/,[],[]];let t=0;const e=[],s=[];return i=i.replace(/#(\d+)|@(\d+)|\.\*\$/g,(r,n,o)=>n!==void 0?(e[++t]=Number(n),"$()"):(o!==void 0&&(s[Number(o)]=++t),"")),[new RegExp(`^${i}`),e,s]}},rr=new WeakMap,ti=new WeakMap,ia),Rc=[/^$/,[],Object.create(null)],zi=Object.create(null);function Ua(i){return zi[i]??(zi[i]=new RegExp(i==="*"?"":`^${i.replace(/\/\*$|([.\\+*[^\]$()])/g,(t,e)=>e?`\\${e}`:"(?:|/.*)")}$`))}function jc(){zi=Object.create(null)}function Oc(i){var d;const t=new Tc,e=[];if(i.length===0)return Rc;const s=i.map(h=>[!/\*|\/:/.test(h[0]),...h]).sort(([h,f],[u,g])=>h?1:u?-1:f.length-g.length),r=Object.create(null);for(let h=0,f=-1,u=s.length;h<u;h++){const[g,y,b]=s[h];g?r[y]=[b.map(([v])=>[v,Object.create(null)]),Wa]:f++;let E;try{E=t.insert(y,f,g)}catch(v){throw v===ls?new za(y):v}g||(e[f]=b.map(([v,k])=>{const S=Object.create(null);for(k-=1;k>=0;k--){const[_,T]=E[k];S[_]=T}return[v,S]}))}const[n,o,c]=t.buildRegExp();for(let h=0,f=e.length;h<f;h++)for(let u=0,g=e[h].length;u<g;u++){const y=(d=e[h][u])==null?void 0:d[1];if(!y)continue;const b=Object.keys(y);for(let E=0,v=b.length;E<v;E++)y[b[E]]=c[y[b[E]]]}const l=[];for(const h in o)l[h]=e[o[h]];return[n,l,r]}function ns(i,t){if(i){for(const e of Object.keys(i).sort((s,r)=>r.length-s.length))if(Ua(e).test(t))return[...i[e]]}}var xe,we,nr,qa,ra,Ac=(ra=class{constructor(){w(this,nr);m(this,"name","RegExpRouter");w(this,xe);w(this,we);m(this,"match",Sc);p(this,xe,{[B]:Object.create(null)}),p(this,we,{[B]:Object.create(null)})}add(i,t,e){var c;const s=a(this,xe),r=a(this,we);if(!s||!r)throw new Error(Ba);s[i]||[s,r].forEach(l=>{l[i]=Object.create(null),Object.keys(l[B]).forEach(d=>{l[i][d]=[...l[B][d]]})}),t==="/*"&&(t="*");const n=(t.match(/\/:/g)||[]).length;if(/\*$/.test(t)){const l=Ua(t);i===B?Object.keys(s).forEach(d=>{var h;(h=s[d])[t]||(h[t]=ns(s[d],t)||ns(s[B],t)||[])}):(c=s[i])[t]||(c[t]=ns(s[i],t)||ns(s[B],t)||[]),Object.keys(s).forEach(d=>{(i===B||i===d)&&Object.keys(s[d]).forEach(h=>{l.test(h)&&s[d][h].push([e,n])})}),Object.keys(r).forEach(d=>{(i===B||i===d)&&Object.keys(r[d]).forEach(h=>l.test(h)&&r[d][h].push([e,n]))});return}const o=Ia(t)||[t];for(let l=0,d=o.length;l<d;l++){const h=o[l];Object.keys(r).forEach(f=>{var u;(i===B||i===f)&&((u=r[f])[h]||(u[h]=[...ns(s[f],h)||ns(s[B],h)||[]]),r[f][h].push([e,n-d+l+1]))})}}buildAllMatchers(){const i=Object.create(null);return Object.keys(a(this,we)).concat(Object.keys(a(this,xe))).forEach(t=>{i[t]||(i[t]=x(this,nr,qa).call(this,t))}),p(this,xe,p(this,we,void 0)),jc(),i}},xe=new WeakMap,we=new WeakMap,nr=new WeakSet,qa=function(i){const t=[];let e=i===B;return[a(this,xe),a(this,we)].forEach(s=>{const r=s[i]?Object.keys(s[i]).map(n=>[n,s[i][n]]):[];r.length!==0?(e||(e=!0),t.push(...r)):i!==B&&t.push(...Object.keys(s[B]).map(n=>[n,s[B][n]]))}),e?Oc(t):null},ra),ve,te,na,Mc=(na=class{constructor(i){m(this,"name","SmartRouter");w(this,ve,[]);w(this,te,[]);p(this,ve,i.routers)}add(i,t,e){if(!a(this,te))throw new Error(Ba);a(this,te).push([i,t,e])}match(i,t){if(!a(this,te))throw new Error("Fatal error");const e=a(this,ve),s=a(this,te),r=e.length;let n=0,o;for(;n<r;n++){const c=e[n];try{for(let l=0,d=s.length;l<d;l++)c.add(...s[l]);o=c.match(i,t)}catch(l){if(l instanceof za)continue;throw l}this.match=c.match.bind(c),p(this,ve,[c]),p(this,te,void 0);break}if(n===r)throw new Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,o}get activeRouter(){if(a(this,te)||a(this,ve).length!==1)throw new Error("No active router has been determined yet.");return a(this,ve)[0]}},ve=new WeakMap,te=new WeakMap,na),Is=Object.create(null),Ee,Q,We,gs,J,ee,De,bs,Ic=(bs=class{constructor(t,e,s){w(this,ee);w(this,Ee);w(this,Q);w(this,We);w(this,gs,0);w(this,J,Is);if(p(this,Q,s||Object.create(null)),p(this,Ee,[]),t&&e){const r=Object.create(null);r[t]={handler:e,possibleKeys:[],score:0},p(this,Ee,[r])}p(this,We,[])}insert(t,e,s){p(this,gs,++Ms(this,gs)._);let r=this;const n=oc(e),o=[];for(let c=0,l=n.length;c<l;c++){const d=n[c],h=n[c+1],f=dc(d,h),u=Array.isArray(f)?f[0]:d;if(u in a(r,Q)){r=a(r,Q)[u],f&&o.push(f[1]);continue}a(r,Q)[u]=new bs,f&&(a(r,We).push(f),o.push(f[1])),r=a(r,Q)[u]}return a(r,Ee).push({[t]:{handler:s,possibleKeys:o.filter((c,l,d)=>d.indexOf(c)===l),score:a(this,gs)}}),r}search(t,e){var l;const s=[];p(this,J,Is);let n=[this];const o=Aa(e),c=[];for(let d=0,h=o.length;d<h;d++){const f=o[d],u=d===h-1,g=[];for(let y=0,b=n.length;y<b;y++){const E=n[y],v=a(E,Q)[f];v&&(p(v,J,a(E,J)),u?(a(v,Q)["*"]&&s.push(...x(this,ee,De).call(this,a(v,Q)["*"],t,a(E,J))),s.push(...x(this,ee,De).call(this,v,t,a(E,J)))):g.push(v));for(let k=0,S=a(E,We).length;k<S;k++){const _=a(E,We)[k],T=a(E,J)===Is?{}:{...a(E,J)};if(_==="*"){const Kt=a(E,Q)["*"];Kt&&(s.push(...x(this,ee,De).call(this,Kt,t,a(E,J))),p(Kt,J,T),g.push(Kt));continue}const[Y,Tt,yt]=_;if(!f&&!(yt instanceof RegExp))continue;const Z=a(E,Q)[Y],he=o.slice(d).join("/");if(yt instanceof RegExp){const Kt=yt.exec(he);if(Kt){if(T[Tt]=Kt[0],s.push(...x(this,ee,De).call(this,Z,t,a(E,J),T)),Object.keys(a(Z,Q)).length){p(Z,J,T);const dr=((l=Kt[0].match(/\//))==null?void 0:l.length)??0;(c[dr]||(c[dr]=[])).push(Z)}continue}}(yt===!0||yt.test(f))&&(T[Tt]=f,u?(s.push(...x(this,ee,De).call(this,Z,t,T,a(E,J))),a(Z,Q)["*"]&&s.push(...x(this,ee,De).call(this,a(Z,Q)["*"],t,T,a(E,J)))):(p(Z,J,T),g.push(Z)))}}n=g.concat(c.shift()??[])}return s.length>1&&s.sort((d,h)=>d.score-h.score),[s.map(({handler:d,params:h})=>[d,h])]}},Ee=new WeakMap,Q=new WeakMap,We=new WeakMap,gs=new WeakMap,J=new WeakMap,ee=new WeakSet,De=function(t,e,s,r){const n=[];for(let o=0,c=a(t,Ee).length;o<c;o++){const l=a(t,Ee)[o],d=l[e]||l[B],h={};if(d!==void 0&&(d.params=Object.create(null),n.push(d),s!==Is||r&&r!==Is))for(let f=0,u=d.possibleKeys.length;f<u;f++){const g=d.possibleKeys[f],y=h[d.score];d.params[g]=r!=null&&r[g]&&!y?r[g]:s[g]??(r==null?void 0:r[g]),h[d.score]=!0}}return n},bs),Ue,aa,Fc=(aa=class{constructor(){m(this,"name","TrieRouter");w(this,Ue);p(this,Ue,new Ic)}add(i,t,e){const s=Ia(t);if(s){for(let r=0,n=s.length;r<n;r++)a(this,Ue).insert(i,s[r],e);return}a(this,Ue).insert(i,t,e)}match(i,t){return a(this,Ue).search(i,t)}},Ue=new WeakMap,aa),de=class extends Ec{constructor(i={}){super(i),this.router=i.router??new Mc({routers:[new Ac,new Fc]})}},Dc=/^\s*(?:text\/(?!event-stream(?:[;\s]|$))[^;\s]+|application\/(?:javascript|json|xml|xml-dtd|ecmascript|dart|postscript|rtf|tar|toml|vnd\.dart|vnd\.ms-fontobject|vnd\.ms-opentype|wasm|x-httpd-php|x-javascript|x-ns-proxy-autoconfig|x-sh|x-tar|x-virtualbox-hdd|x-virtualbox-ova|x-virtualbox-ovf|x-virtualbox-vbox|x-virtualbox-vdi|x-virtualbox-vhd|x-virtualbox-vmdk|x-www-form-urlencoded)|font\/(?:otf|ttf)|image\/(?:bmp|vnd\.adobe\.photoshop|vnd\.microsoft\.icon|vnd\.ms-dds|x-icon|x-ms-bmp)|message\/rfc822|model\/gltf-binary|x-shader\/x-fragment|x-shader\/x-vertex|[^;\s]+?\+(?:json|text|xml|yaml))(?:[;\s]|$)/i,yn=(i,t=Pc)=>{const e=/\.([a-zA-Z0-9]+?)$/,s=i.match(e);if(!s)return;let r=t[s[1]];return r&&r.startsWith("text")&&(r+="; charset=utf-8"),r},$c={aac:"audio/aac",avi:"video/x-msvideo",avif:"image/avif",av1:"video/av1",bin:"application/octet-stream",bmp:"image/bmp",css:"text/css",csv:"text/csv",eot:"application/vnd.ms-fontobject",epub:"application/epub+zip",gif:"image/gif",gz:"application/gzip",htm:"text/html",html:"text/html",ico:"image/x-icon",ics:"text/calendar",jpeg:"image/jpeg",jpg:"image/jpeg",js:"text/javascript",json:"application/json",jsonld:"application/ld+json",map:"application/json",mid:"audio/x-midi",midi:"audio/x-midi",mjs:"text/javascript",mp3:"audio/mpeg",mp4:"video/mp4",mpeg:"video/mpeg",oga:"audio/ogg",ogv:"video/ogg",ogx:"application/ogg",opus:"audio/opus",otf:"font/otf",pdf:"application/pdf",png:"image/png",rtf:"application/rtf",svg:"image/svg+xml",tif:"image/tiff",tiff:"image/tiff",ts:"video/mp2t",ttf:"font/ttf",txt:"text/plain",wasm:"application/wasm",webm:"video/webm",weba:"audio/webm",webmanifest:"application/manifest+json",webp:"image/webp",woff:"font/woff",woff2:"font/woff2",xhtml:"application/xhtml+xml",xml:"application/xml",zip:"application/zip","3gp":"video/3gpp","3g2":"video/3gpp2",gltf:"model/gltf+json",glb:"model/gltf-binary"},Pc=$c,Nc=(...i)=>{let t=i.filter(r=>r!=="").join("/");t=t.replace(new RegExp("(?<=\\/)\\/+","g"),"");const e=t.split("/"),s=[];for(const r of e)r===".."&&s.length>0&&s.at(-1)!==".."?s.pop():r!=="."&&s.push(r);return s.join("/")||"."},Ga={br:".br",zstd:".zst",gzip:".gz"},Lc=Object.keys(Ga),Bc="index.html",zc=i=>{const t=i.root??"./",e=i.path,s=i.join??Nc;return async(r,n)=>{var h,f,u,g;if(r.finalized)return n();let o;if(i.path)o=i.path;else try{if(o=decodeURIComponent(r.req.path),/(?:^|[\/\\])\.\.(?:$|[\/\\])/.test(o))throw new Error}catch{return await((h=i.onNotFound)==null?void 0:h.call(i,r.req.path,r)),n()}let c=s(t,!e&&i.rewriteRequestPath?i.rewriteRequestPath(o):o);i.isDir&&await i.isDir(c)&&(c=s(c,Bc));const l=i.getContent;let d=await l(c,r);if(d instanceof Response)return r.newResponse(d.body,d);if(d){const y=i.mimes&&yn(c,i.mimes)||yn(c);if(r.header("Content-Type",y||"application/octet-stream"),i.precompressed&&(!y||Dc.test(y))){const b=new Set((f=r.req.header("Accept-Encoding"))==null?void 0:f.split(",").map(E=>E.trim()));for(const E of Lc){if(!b.has(E))continue;const v=await l(c+Ga[E],r);if(v){d=v,r.header("Content-Encoding",E),r.header("Vary","Accept-Encoding",{append:!0});break}}}return await((u=i.onFound)==null?void 0:u.call(i,c,r)),r.body(d)}await((g=i.onNotFound)==null?void 0:g.call(i,c,r)),await n()}},Hc=async(i,t)=>{let e;t&&t.manifest?typeof t.manifest=="string"?e=JSON.parse(t.manifest):e=t.manifest:typeof __STATIC_CONTENT_MANIFEST=="string"?e=JSON.parse(__STATIC_CONTENT_MANIFEST):e=__STATIC_CONTENT_MANIFEST;let s;t&&t.namespace?s=t.namespace:s=__STATIC_CONTENT;const r=e[i]||i;if(!r)return null;const n=await s.get(r,{type:"stream"});return n||null},Wc=i=>async function(e,s){return zc({...i,getContent:async n=>Hc(n,{manifest:i.manifest,namespace:i.namespace?i.namespace:e.env?e.env.__STATIC_CONTENT:void 0})})(e,s)},Va=i=>Wc(i),Ka=i=>{const e={...{origin:"*",allowMethods:["GET","HEAD","PUT","POST","DELETE","PATCH"],allowHeaders:[],exposeHeaders:[]},...i},s=(n=>typeof n=="string"?n==="*"?()=>n:o=>n===o?o:null:typeof n=="function"?n:o=>n.includes(o)?o:null)(e.origin),r=(n=>typeof n=="function"?n:Array.isArray(n)?()=>n:()=>[])(e.allowMethods);return async function(o,c){var h;function l(f,u){o.res.headers.set(f,u)}const d=await s(o.req.header("origin")||"",o);if(d&&l("Access-Control-Allow-Origin",d),e.credentials&&l("Access-Control-Allow-Credentials","true"),(h=e.exposeHeaders)!=null&&h.length&&l("Access-Control-Expose-Headers",e.exposeHeaders.join(",")),o.req.method==="OPTIONS"){e.origin!=="*"&&l("Vary","Origin"),e.maxAge!=null&&l("Access-Control-Max-Age",e.maxAge.toString());const f=await r(o.req.header("origin")||"",o);f.length&&l("Access-Control-Allow-Methods",f.join(","));let u=e.allowHeaders;if(!(u!=null&&u.length)){const g=o.req.header("Access-Control-Request-Headers");g&&(u=g.split(/\s*,\s*/))}return u!=null&&u.length&&(l("Access-Control-Allow-Headers",u.join(",")),o.res.headers.append("Vary","Access-Control-Request-Headers")),o.res.headers.delete("Content-Length"),o.res.headers.delete("Content-Type"),new Response(null,{headers:o.res.headers,status:204,statusText:"No Content"})}await c(),e.origin!=="*"&&o.header("Vary","Origin",{append:!0})}};class xn{static calculate(t){const e=t.cnt_win+t.cnt_plc,s=Math.min(1,Math.sqrt(e/500)),r=t.rate_win_ret*.3+t.rate_plc_ret*.7-80,n=10*Math.tanh(r*s/25),o=this.getGrade(n);return{score:Math.round(n*100)/100,grade:o,reliability:Math.round(s*1e3)/1e3,weightedDiff:Math.round(r*100)/100}}static getGrade(t){return t>=7?"S":t>=4?"A":t>=1?"B":t>=-3?"C":"D"}static getGradeDescription(t){return{S:"極めて優秀 - 高い収益性が期待できる",A:"優秀 - 安定した収益が見込める",B:"良好 - プラス収益の可能性が高い",C:"平均 - 標準的なパフォーマンス",D:"要改善 - 収益性が低い可能性がある"}[t]||"不明"}}class wn{static calculate(t){const e=new Map,s=this.groupByRaceId(t);for(const[r,n]of s.entries()){const o=n.map(g=>({horse:g,nMin:Math.min(g.cnt_win,g.cnt_plc),hitRaw:.65*g.rate_win_hit+.35*g.rate_plc_hit,retRaw:.35*g.rate_win_ret+.65*g.rate_plc_ret})),c=o.map(g=>g.hitRaw),l=o.map(g=>g.retRaw),d=this.mean(c),h=this.stdDev(c,d),f=this.mean(l),u=this.stdDev(l,f);for(const{horse:g,nMin:y,hitRaw:b,retRaw:E}of o){const v=h>0?(b-d)/h:0,k=u>0?(E-f)/u:0,S=Math.sqrt(y/(y+400)),_=.55*v+.45*k,T=Math.round(12*Math.tanh(_)*S*10)/10,Y=this.getGrade(T),Tt=`${r}_${g.cnt_win}_${g.cnt_plc}`;e.set(Tt,{score:T,grade:Y,hitRaw:Math.round(b*100)/100,retRaw:Math.round(E*100)/100,shrinkage:Math.round(S*1e3)/1e3})}}return e}static groupByRaceId(t){const e=new Map;for(const s of t){const r=e.get(s.group_id)||[];r.push(s),e.set(s.group_id,r)}return e}static mean(t){return t.length===0?0:t.reduce((e,s)=>e+s,0)/t.length}static stdDev(t,e){if(t.length<=1)return 0;const s=t.reduce((r,n)=>r+Math.pow(n-e,2),0)/t.length;return Math.sqrt(s)}static getGrade(t){return t>=8?"S+":t>=5?"S":t>=2?"A":t>=-1?"B":t>=-4?"C":"D"}static getGradeDescription(t){return{"S+":"最高評価 - レース内で圧倒的な優位性",S:"極めて優秀 - レース内で明確な優位性",A:"優秀 - レース内で有力候補",B:"良好 - レース内で競争力あり",C:"平均 - レース内で標準的な位置",D:"要改善 - レース内で劣勢"}[t]||"不明"}}const Os=new de;Os.use("/*",Ka());Os.post("/rgs/calculate",async i=>{try{const t=await i.req.json();if(typeof t.cnt_win!="number"||t.cnt_win<0)return i.json({error:"cnt_win must be a positive number"},400);if(typeof t.cnt_plc!="number"||t.cnt_plc<0)return i.json({error:"cnt_plc must be a positive number"},400);if(typeof t.rate_win_ret!="number")return i.json({error:"rate_win_ret must be a number"},400);if(typeof t.rate_plc_ret!="number")return i.json({error:"rate_plc_ret must be a number"},400);const e=xn.calculate(t);return i.json({success:!0,data:{score:e.score,grade:e.grade,reliability:e.reliability,weightedDiff:e.weightedDiff,description:xn.getGradeDescription(e.grade)}})}catch(t){return console.error("RGS calculation error:",t),i.json({success:!1,error:"RGS calculation failed",message:t instanceof Error?t.message:"Unknown error"},500)}});Os.post("/aas/calculate",async i=>{try{const t=await i.req.json();if(!Array.isArray(t.horses)||t.horses.length===0)return i.json({error:"horses must be a non-empty array"},400);for(const r of t.horses){if(!r.group_id||typeof r.group_id!="string")return i.json({error:"group_id is required and must be a string"},400);if(typeof r.cnt_win!="number"||r.cnt_win<0)return i.json({error:"cnt_win must be a positive number"},400);if(typeof r.cnt_plc!="number"||r.cnt_plc<0)return i.json({error:"cnt_plc must be a positive number"},400);if(typeof r.rate_win_hit!="number")return i.json({error:"rate_win_hit must be a number"},400);if(typeof r.rate_plc_hit!="number")return i.json({error:"rate_plc_hit must be a number"},400);if(typeof r.rate_win_ret!="number")return i.json({error:"rate_win_ret must be a number"},400);if(typeof r.rate_plc_ret!="number")return i.json({error:"rate_plc_ret must be a number"},400)}const e=wn.calculate(t.horses),s=Array.from(e.entries()).map(([r,n])=>({key:r,score:n.score,grade:n.grade,hitRaw:n.hitRaw,retRaw:n.retRaw,shrinkage:n.shrinkage,description:wn.getGradeDescription(n.grade)}));return i.json({success:!0,data:{count:s.length,results:s}})}catch(t){return console.error("AAS calculation error:",t),i.json({success:!1,error:"AAS calculation failed",message:t instanceof Error?t.message:"Unknown error"},500)}});Os.post("/factor/test",async i=>{try{const t=await i.req.json();if(!Array.isArray(t.factors)||t.factors.length===0)return i.json({error:"factors must be a non-empty array"},400);if(!Array.isArray(t.testData)||t.testData.length===0)return i.json({error:"testData must be a non-empty array"},400);const e=t.factors.reduce((u,g)=>u+g.weight,0);if(Math.abs(e-100)>.01)return i.json({error:"Total weight must be 100%"},400);const s=t.testData.map(u=>{var E,v;const g=((E=t.factors.find(k=>k.name==="RGS基礎値"))==null?void 0:E.weight)||0,y=((v=t.factors.find(k=>k.name==="AAS基礎値"))==null?void 0:v.weight)||0,b=u.rgs_score*g/100+u.aas_score*y/100;return{...u,factor_score:b}}),r=new Map;for(const u of s){const g=r.get(u.race_id)||[];g.push(u),r.set(u.race_id,g)}const n=[];for(const[u,g]of r.entries())g.sort((b,E)=>E.factor_score-b.factor_score).forEach((b,E)=>{n.push({...b,predicted_rank:E+1})});let o=0,c=0,l=s.length;for(const u of n)u.predicted_rank===1&&u.actual_rank<=3&&(o++,c+=100*(4-u.actual_rank));const d=o/l*100,h=c/(l*100)*100,f=h-100;return i.json({success:!0,data:{performance:{hit_rate:Math.round(d*10)/10,recovery_rate:Math.round(h*10)/10,roi:Math.round(f*10)/10,total_bets:l,total_hits:o,total_return:c},predictions:n.slice(0,10)}})}catch(t){return console.error("Factor test error:",t),i.json({success:!1,error:"Factor test failed",message:t instanceof Error?t.message:"Unknown error"},500)}});Os.get("/health",i=>i.json({success:!0,message:"UMAYOMI API is running",version:"1.0.0",timestamp:new Date().toISOString()}));const Ja=new de;Ja.get("/condition-settings",i=>i.html(`<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Condition設定 - UMAYOMI</title>
    <script src="https://cdn.tailwindcss.com"><\/script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"><\/script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Inter', sans-serif; }
        
        .glass {
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(148, 163, 184, 0.1);
        }
        
        .condition-card {
            transition: all 0.3s ease;
        }
        
        .condition-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(59, 130, 246, 0.2);
        }
        
        .factor-input {
            background: rgba(15, 23, 42, 0.5);
            border: 1px solid #334155;
            color: #e2e8f0;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            transition: all 0.2s;
        }
        
        .factor-input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
    </style>
</head>
<body class="bg-gray-900 text-gray-100 min-h-screen">
    
    <!-- Header -->
    <div class="bg-gray-800 border-b border-gray-700">
        <div class="max-w-7xl mx-auto px-6 py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <a href="/" class="text-gray-400 hover:text-white transition">
                        <i class="fas fa-arrow-left"></i>
                    </a>
                    <div>
                        <h1 class="text-2xl font-bold text-white">Condition設定</h1>
                        <p class="text-sm text-gray-400">ファクターの条件を設定して回収率を分析</p>
                    </div>
                </div>
                <button onclick="saveConditions()" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
                    <i class="fas fa-save mr-2"></i>保存して分析
                </button>
            </div>
        </div>
    </div>
    
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-8">
        
        <!-- レース条件設定 -->
        <div class="glass rounded-xl p-6 mb-6 condition-card">
            <h2 class="text-xl font-bold text-white mb-4">
                <i class="fas fa-sliders-h text-blue-400 mr-2"></i>
                レース条件
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- 競馬場 -->
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">競馬場</label>
                    <select id="track" class="factor-input w-full">
                        <option value="">全て</option>
                        <option value="01">札幌</option>
                        <option value="02">函館</option>
                        <option value="03">福島</option>
                        <option value="04">新潟</option>
                        <option value="05">東京</option>
                        <option value="06">中山</option>
                        <option value="07">中京</option>
                        <option value="08">京都</option>
                        <option value="09">阪神</option>
                        <option value="10">小倉</option>
                    </select>
                </div>
                
                <!-- 距離 -->
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">距離（m）</label>
                    <div class="flex space-x-2">
                        <input type="number" id="distanceMin" placeholder="最小" class="factor-input w-full" value="1000">
                        <span class="text-gray-400 self-center">〜</span>
                        <input type="number" id="distanceMax" placeholder="最大" class="factor-input w-full" value="3600">
                    </div>
                </div>
                
                <!-- 馬場 -->
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">馬場</label>
                    <select id="surface" class="factor-input w-full">
                        <option value="">全て</option>
                        <option value="芝">芝</option>
                        <option value="ダート">ダート</option>
                        <option value="障害">障害</option>
                    </select>
                </div>
            </div>
        </div>
        
        <!-- ファクター条件設定 -->
        <div class="glass rounded-xl p-6 mb-6 condition-card">
            <h2 class="text-xl font-bold text-white mb-4">
                <i class="fas fa-chart-line text-green-400 mr-2"></i>
                ファクター条件
            </h2>
            
            <div id="factorConditions" class="space-y-4">
                <!-- Factor条件がここに追加される -->
            </div>
            
            <button onclick="addFactorCondition()" class="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition">
                <i class="fas fa-plus mr-2"></i>条件を追加
            </button>
        </div>
        
        <!-- プレビュー -->
        <div class="glass rounded-xl p-6 condition-card">
            <h2 class="text-xl font-bold text-white mb-4">
                <i class="fas fa-eye text-purple-400 mr-2"></i>
                条件プレビュー
            </h2>
            
            <div id="conditionPreview" class="bg-gray-800 rounded-lg p-4 font-mono text-sm text-gray-300">
                <div class="text-gray-500">条件を設定してください...</div>
            </div>
            
            <div class="mt-4 flex space-x-4">
                <button onclick="testConditions()" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition">
                    <i class="fas fa-flask mr-2"></i>テスト実行
                </button>
                <button onclick="clearConditions()" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition">
                    <i class="fas fa-trash mr-2"></i>クリア
                </button>
            </div>
        </div>
        
    </div>
    
    <script>
// Condition設定のJavaScript
let factorConditions = [];

// ファクター種別の定義
const factorTypes = [
    { value: 'odds', label: 'オッズ', unit: '倍' },
    { value: 'popularity', label: '人気', unit: '番' },
    { value: 'weight', label: '斤量', unit: 'kg' },
    { value: 'horse_weight', label: '馬体重', unit: 'kg' },
    { value: 'jockey_win_rate', label: '騎手勝率', unit: '%' },
    { value: 'trainer_win_rate', label: '調教師勝率', unit: '%' },
    { value: 'recent_form', label: '近走成績', unit: '点' },
    { value: 'speed_index', label: 'スピード指数', unit: '点' },
    { value: 'pace_index', label: 'ペース指数', unit: '点' },
    { value: 'position_index', label: '位置取り指数', unit: '点' }
];

// 比較演算子
const operators = [
    { value: 'gte', label: '以上 (≥)' },
    { value: 'lte', label: '以下 (≤)' },
    { value: 'eq', label: '等しい (=)' },
    { value: 'gt', label: 'より大きい (>)' },
    { value: 'lt', label: 'より小さい (<)' }
];

// ファクター条件を追加
function addFactorCondition() {
    const id = Date.now();
    const condition = {
        id,
        factor: 'odds',
        operator: 'lte',
        value: 10
    };
    
    factorConditions.push(condition);
    renderFactorConditions();
    updatePreview();
}

// ファクター条件を削除
function removeFactorCondition(id) {
    factorConditions = factorConditions.filter(c => c.id !== id);
    renderFactorConditions();
    updatePreview();
}

// ファクター条件を更新
function updateFactorCondition(id, field, value) {
    const condition = factorConditions.find(c => c.id === id);
    if (condition) {
        condition[field] = value;
        updatePreview();
    }
}

// ファクター条件を描画
function renderFactorConditions() {
    const container = document.getElementById('factorConditions');
    
    if (factorConditions.length === 0) {
        container.innerHTML = \`
            <div class="text-center text-gray-500 py-8">
                <i class="fas fa-info-circle text-4xl mb-2"></i>
                <p>「条件を追加」ボタンでファクター条件を設定してください</p>
            </div>
        \`;
        return;
    }
    
    container.innerHTML = factorConditions.map(condition => {
        const factor = factorTypes.find(f => f.value === condition.factor);
        
        return \`
            <div class="flex items-center space-x-4 bg-gray-800 rounded-lg p-4">
                <div class="flex-1">
                    <select class="factor-input w-full" 
                            onchange="updateFactorCondition(\${condition.id}, 'factor', this.value)">
                        \${factorTypes.map(f => 
                            \`<option value="\${f.value}" \${f.value === condition.factor ? 'selected' : ''}>\${f.label}</option>\`
                        ).join('')}
                    </select>
                </div>
                
                <div class="flex-1">
                    <select class="factor-input w-full"
                            onchange="updateFactorCondition(\${condition.id}, 'operator', this.value)">
                        \${operators.map(op => 
                            \`<option value="\${op.value}" \${op.value === condition.operator ? 'selected' : ''}>\${op.label}</option>\`
                        ).join('')}
                    </select>
                </div>
                
                <div class="flex-1">
                    <div class="relative">
                        <input type="number" 
                               class="factor-input w-full pr-12" 
                               value="\${condition.value}"
                               onchange="updateFactorCondition(\${condition.id}, 'value', parseFloat(this.value))">
                        <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            \${factor.unit}
                        </span>
                    </div>
                </div>
                
                <button onclick="removeFactorCondition(\${condition.id})" 
                        class="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        \`;
    }).join('');
}

// プレビューを更新
function updatePreview() {
    const track = document.getElementById('track').value;
    const distanceMin = document.getElementById('distanceMin').value;
    const distanceMax = document.getElementById('distanceMax').value;
    const surface = document.getElementById('surface').value;
    
    const conditions = {
        race: {
            track: track || '全て',
            distance: \`\${distanceMin}m 〜 \${distanceMax}m\`,
            surface: surface || '全て'
        },
        factors: factorConditions.map(c => {
            const factor = factorTypes.find(f => f.value === c.factor);
            const operator = operators.find(op => op.value === c.operator);
            return \`\${factor.label} \${operator.label} \${c.value}\${factor.unit}\`;
        })
    };
    
    const preview = document.getElementById('conditionPreview');
    preview.innerHTML = \`
        <div class="space-y-2">
            <div><strong class="text-blue-400">レース条件:</strong></div>
            <div class="pl-4">
                <div>競馬場: \${conditions.race.track}</div>
                <div>距離: \${conditions.race.distance}</div>
                <div>馬場: \${conditions.race.surface}</div>
            </div>
            
            <div class="mt-4"><strong class="text-green-400">ファクター条件:</strong></div>
            <div class="pl-4">
                \${conditions.factors.length > 0 
                    ? conditions.factors.map(f => \`<div>・\${f}</div>\`).join('')
                    : '<div class="text-gray-500">条件未設定</div>'}
            </div>
        </div>
    \`;
}

// 条件を保存
async function saveConditions() {
    const conditions = {
        race: {
            track: document.getElementById('track').value,
            distanceMin: parseInt(document.getElementById('distanceMin').value),
            distanceMax: parseInt(document.getElementById('distanceMax').value),
            surface: document.getElementById('surface').value
        },
        factors: factorConditions
    };
    
    console.log('Saving conditions:', conditions);
    
    // sessionStorageに保存
    sessionStorage.setItem('pendingConditions', JSON.stringify(conditions));
    
    // ファクター登録ページへ遷移
    window.location.href = '/factor-register';
}

// テスト実行
async function testConditions() {
    console.log('Testing conditions...');
    alert('テスト実行中...\\n（実装予定）');
}

// クリア
function clearConditions() {
    if (confirm('全ての条件をクリアしますか？')) {
        factorConditions = [];
        document.getElementById('track').value = '';
        document.getElementById('distanceMin').value = '1000';
        document.getElementById('distanceMax').value = '3600';
        document.getElementById('surface').value = '';
        renderFactorConditions();
        updatePreview();
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    renderFactorConditions();
    updatePreview();
    
    // 入力フィールドの変更を監視
    ['track', 'distanceMin', 'distanceMax', 'surface'].forEach(id => {
        document.getElementById(id).addEventListener('change', updatePreview);
    });
});
    <\/script>
</body>
</html>`));const Ya=new de;Ya.get("/analysis",i=>i.html(`<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>回収率分析 - UMAYOMI</title>
    <script src="https://cdn.tailwindcss.com"><\/script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"><\/script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"><\/script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Inter', sans-serif; }
        
        .glass {
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(148, 163, 184, 0.1);
        }
        
        .stat-card {
            transition: all 0.3s ease;
        }
        
        .stat-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3);
        }
        
        .chart-container {
            position: relative;
            height: 400px;
        }
    </style>
</head>
<body class="bg-gray-900 text-gray-100 min-h-screen">
    
    <!-- Header -->
    <div class="bg-gray-800 border-b border-gray-700">
        <div class="max-w-7xl mx-auto px-6 py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <a href="/condition-settings" class="text-gray-400 hover:text-white transition">
                        <i class="fas fa-arrow-left"></i>
                    </a>
                    <div>
                        <h1 class="text-2xl font-bold text-white">回収率分析</h1>
                        <p class="text-sm text-gray-400">バックテスト結果と回収率の詳細分析</p>
                    </div>
                </div>
                <div class="flex space-x-3">
                    <button onclick="runBacktest()" class="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition">
                        <i class="fas fa-play mr-2"></i>バックテスト実行
                    </button>
                    <button onclick="saveAsLogic()" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
                        <i class="fas fa-save mr-2"></i>ロジックとして保存
                    </button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-8">
        
        <!-- KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <!-- 回収率 -->
            <div class="glass rounded-xl p-6 stat-card">
                <div class="flex items-center justify-between mb-4">
                    <div class="text-gray-400 text-sm font-medium">回収率</div>
                    <div class="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                        <i class="fas fa-coins text-green-400"></i>
                    </div>
                </div>
                <div id="recovery-rate" class="text-4xl font-bold text-white mb-2">128.5%</div>
                <div class="flex items-center text-sm">
                    <i class="fas fa-arrow-up text-green-400 mr-1"></i>
                    <span class="text-green-400 font-medium">+28.5%</span>
                    <span class="text-gray-500 ml-2">100%基準</span>
                </div>
            </div>
            
            <!-- 的中率 -->
            <div class="glass rounded-xl p-6 stat-card">
                <div class="flex items-center justify-between mb-4">
                    <div class="text-gray-400 text-sm font-medium">的中率</div>
                    <div class="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <i class="fas fa-bullseye text-blue-400"></i>
                    </div>
                </div>
                <div id="hit-rate" class="text-4xl font-bold text-white mb-2">35.2%</div>
                <div class="flex items-center text-sm">
                    <span class="text-gray-400">対象レース:</span>
                    <span id="total-races" class="text-white ml-2 font-medium">1,043</span>
                </div>
            </div>
            
            <!-- ROI -->
            <div class="glass rounded-xl p-6 stat-card">
                <div class="flex items-center justify-between mb-4">
                    <div class="text-gray-400 text-sm font-medium">ROI</div>
                    <div class="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                        <i class="fas fa-chart-line text-purple-400"></i>
                    </div>
                </div>
                <div id="roi" class="text-4xl font-bold text-white mb-2">+28.5%</div>
                <div class="flex items-center text-sm">
                    <span class="text-gray-400">投資収益率</span>
                </div>
            </div>
            
            <!-- 総利益 -->
            <div class="glass rounded-xl p-6 stat-card">
                <div class="flex items-center justify-between mb-4">
                    <div class="text-gray-400 text-sm font-medium">総利益</div>
                    <div class="w-10 h-10 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                        <i class="fas fa-yen-sign text-yellow-400"></i>
                    </div>
                </div>
                <div id="total-profit" class="text-4xl font-bold text-white mb-2">+285,000</div>
                <div class="flex items-center text-sm">
                    <span class="text-gray-400">円</span>
                    <span class="text-green-400 ml-2">(1レース100円購入)</span>
                </div>
            </div>
        </div>
        
        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <!-- 回収率推移グラフ -->
            <div class="glass rounded-xl p-6">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h3 class="text-xl font-bold text-white">回収率推移</h3>
                        <p class="text-sm text-gray-400 mt-1">月別の回収率変動</p>
                    </div>
                    <select id="period-selector" class="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300">
                        <option value="6m">過去6ヶ月</option>
                        <option value="1y" selected>過去1年</option>
                        <option value="all">全期間</option>
                    </select>
                </div>
                <div class="chart-container">
                    <canvas id="recoveryChart"></canvas>
                </div>
            </div>
            
            <!-- 的中率推移グラフ -->
            <div class="glass rounded-xl p-6">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h3 class="text-xl font-bold text-white">的中率推移</h3>
                        <p class="text-sm text-gray-400 mt-1">月別の的中率変動</p>
                    </div>
                </div>
                <div class="chart-container">
                    <canvas id="hitRateChart"></canvas>
                </div>
            </div>
        </div>
        
        <!-- 詳細統計 -->
        <div class="glass rounded-xl p-6 mb-8">
            <h3 class="text-xl font-bold text-white mb-6">
                <i class="fas fa-table text-blue-400 mr-2"></i>
                詳細統計
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- 競馬場別統計 -->
                <div>
                    <h4 class="text-sm font-medium text-gray-400 mb-3">競馬場別回収率</h4>
                    <div class="space-y-2">
                        <div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <span class="text-gray-300">東京</span>
                            <span class="text-green-400 font-medium">145.2%</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <span class="text-gray-300">中山</span>
                            <span class="text-green-400 font-medium">132.8%</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <span class="text-gray-300">阪神</span>
                            <span class="text-green-400 font-medium">128.5%</span>
                        </div>
                    </div>
                </div>
                
                <!-- 距離別統計 -->
                <div>
                    <h4 class="text-sm font-medium text-gray-400 mb-3">距離別回収率</h4>
                    <div class="space-y-2">
                        <div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <span class="text-gray-300">1200m</span>
                            <span class="text-green-400 font-medium">138.2%</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <span class="text-gray-300">1600m</span>
                            <span class="text-green-400 font-medium">125.6%</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <span class="text-gray-300">2000m</span>
                            <span class="text-green-400 font-medium">122.3%</span>
                        </div>
                    </div>
                </div>
                
                <!-- 馬場別統計 -->
                <div>
                    <h4 class="text-sm font-medium text-gray-400 mb-3">馬場別回収率</h4>
                    <div class="space-y-2">
                        <div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <span class="text-gray-300">芝</span>
                            <span class="text-green-400 font-medium">135.4%</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <span class="text-gray-300">ダート</span>
                            <span class="text-green-400 font-medium">118.9%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- レース結果一覧 -->
        <div class="glass rounded-xl p-6">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h3 class="text-xl font-bold text-white">レース結果一覧</h3>
                    <p class="text-sm text-gray-400 mt-1">バックテスト対象レースの詳細</p>
                </div>
                <button onclick="exportResults()" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition">
                    <i class="fas fa-download mr-2"></i>CSVエクスポート
                </button>
            </div>
            
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="border-b border-gray-700">
                            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">日付</th>
                            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">競馬場</th>
                            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">R</th>
                            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">距離</th>
                            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">予想馬</th>
                            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">着順</th>
                            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">オッズ</th>
                            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">結果</th>
                        </tr>
                    </thead>
                    <tbody id="resultsTableBody">
                        <!-- Results will be inserted here -->
                    </tbody>
                </table>
            </div>
            
            <!-- Pagination -->
            <div class="flex items-center justify-between mt-6 pt-6 border-t border-gray-700">
                <div class="text-sm text-gray-400">
                    1-20 / 1,043 レース
                </div>
                <div class="flex space-x-2">
                    <button class="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">1</button>
                    <button class="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition">2</button>
                    <button class="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition">3</button>
                    <button class="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition">...</button>
                    <button class="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition">53</button>
                    <button class="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
        
    </div>
    
    <script>
// Analysis Page JavaScript

// Sample data (will be replaced with real API data)
const sampleResults = [
    { date: '2024-12-29', track: '東京', race: '1R', distance: '1600m', horse: 'エイシンフラッシュ', finish: 1, odds: 3.2, hit: true },
    { date: '2024-12-29', track: '東京', race: '2R', distance: '2000m', horse: 'ディープインパクト', finish: 5, odds: 2.1, hit: false },
    { date: '2024-12-29', track: '中山', race: '1R', distance: '1200m', horse: 'オルフェーヴル', finish: 2, odds: 4.5, hit: true },
    { date: '2024-12-28', track: '阪神', race: '3R', distance: '1800m', horse: 'キタサンブラック', finish: 1, odds: 2.8, hit: true },
    { date: '2024-12-28', track: '東京', race: '5R', distance: '2400m', horse: 'ゴールドシップ', finish: 8, odds: 5.2, hit: false },
];

// Initialize charts
function createRecoveryChart() {
    const ctx = document.getElementById('recoveryChart').getContext('2d');
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(34, 197, 94, 0.3)');
    gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            datasets: [{
                label: '回収率 (%)',
                data: [125, 118, 132, 145, 128, 135, 142, 138, 148, 152, 146, 158],
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointBackgroundColor: 'rgb(34, 197, 94)',
                pointBorderColor: '#111827',
                pointBorderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    titleColor: '#f8fafc',
                    bodyColor: '#cbd5e1',
                    borderColor: '#374151',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 100,
                    grid: { color: 'rgba(55, 65, 81, 0.3)' },
                    ticks: { 
                        color: '#9ca3af',
                        callback: (value) => value + '%'
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#9ca3af' }
                }
            }
        }
    });
}

function createHitRateChart() {
    const ctx = document.getElementById('hitRateChart').getContext('2d');
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            datasets: [{
                label: '的中率 (%)',
                data: [32, 28, 35, 38, 33, 36, 39, 34, 40, 42, 38, 41],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: '#111827',
                pointBorderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    titleColor: '#f8fafc',
                    bodyColor: '#cbd5e1',
                    borderColor: '#374151',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(55, 65, 81, 0.3)' },
                    ticks: { 
                        color: '#9ca3af',
                        callback: (value) => value + '%'
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#9ca3af' }
                }
            }
        }
    });
}

// Populate results table
function populateResultsTable() {
    const tbody = document.getElementById('resultsTableBody');
    tbody.innerHTML = '';
    
    sampleResults.forEach(result => {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-700 hover:bg-gray-800 transition cursor-pointer';
        
        const hitBadge = result.hit 
            ? '<span class="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs font-medium">的中</span>'
            : '<span class="px-2 py-1 bg-gray-600/20 text-gray-400 rounded text-xs font-medium">不的中</span>';
        
        row.innerHTML = \`
            <td class="py-3 px-4 text-sm text-gray-300">\${result.date}</td>
            <td class="py-3 px-4"><span class="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-medium">\${result.track}</span></td>
            <td class="py-3 px-4 text-sm text-white font-medium">\${result.race}</td>
            <td class="py-3 px-4 text-sm text-gray-300">\${result.distance}</td>
            <td class="py-3 px-4 text-sm text-white">\${result.horse}</td>
            <td class="py-3 px-4 text-sm font-bold \${result.finish <= 3 ? 'text-green-400' : 'text-gray-400'}">\${result.finish}着</td>
            <td class="py-3 px-4 text-sm text-gray-300">\${result.odds}倍</td>
            <td class="py-3 px-4">\${hitBadge}</td>
        \`;
        
        tbody.appendChild(row);
    });
}

// Run backtest
async function runBacktest() {
    console.log('Running backtest...');
    alert('バックテストを実行中...\\n（過去データを分析します）');
    
    // TODO: Call backtest API
    // const response = await axios.post('/api/backtest', conditions);
}

// Save as logic
function saveAsLogic() {
    window.location.href = '/factor-register';
}

// Export results
function exportResults() {
    console.log('Exporting results...');
    alert('CSV形式でエクスポート中...\\n（実装予定）');
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    createRecoveryChart();
    createHitRateChart();
    populateResultsTable();
});
    <\/script>
</body>
</html>`));const Ct={tomorrowRaces:new Map,uploadedDate:"",factorsStore:[],addFactor(i){this.factorsStore.push(i)},getFactor(i){return this.factorsStore.find(t=>t.id===i)},deleteFactor(i){const t=this.factorsStore.findIndex(e=>e.id===i);t!==-1&&this.factorsStore.splice(t,1)},updateFactor(i,t){const e=this.getFactor(i);e&&Object.assign(e,t)},getAllFactors(){return this.factorsStore}},As=new de;As.get("/factor-register",i=>i.html(`<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ファクター登録 - UMAYOMI</title>
    <script src="https://cdn.tailwindcss.com"><\/script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"><\/script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Inter', sans-serif; }
        
        .glass {
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(148, 163, 184, 0.1);
        }
        
        .factor-card {
            transition: all 0.3s ease;
        }
        
        .factor-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(59, 130, 246, 0.2);
        }
        
        .input-field {
            background: rgba(15, 23, 42, 0.5);
            border: 1px solid #334155;
            color: #e2e8f0;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            transition: all 0.2s;
        }
        
        .input-field:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
        }
    </style>
</head>
<body class="bg-gray-900 text-gray-100 min-h-screen">
    
    <!-- Header -->
    <div class="bg-gray-800 border-b border-gray-700">
        <div class="max-w-7xl mx-auto px-6 py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <a href="/" class="text-gray-400 hover:text-white transition">
                        <i class="fas fa-arrow-left"></i>
                    </a>
                    <div>
                        <h1 class="text-2xl font-bold text-white">ファクター登録</h1>
                        <p class="text-sm text-gray-400">独自のロジックを作成・管理</p>
                    </div>
                </div>
                <a href="/condition-settings" class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition">
                    <i class="fas fa-sliders-h mr-2"></i>新規作成
                </a>
            </div>
        </div>
    </div>
    
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-8">
        
        <!-- 登録フォーム -->
        <div class="glass rounded-xl p-6 mb-8 factor-card" id="registerForm">
            <h2 class="text-xl font-bold text-white mb-4">
                <i class="fas fa-plus-circle text-green-400 mr-2"></i>
                新しいロジックを登録
            </h2>
            
            <div class="space-y-4">
                <!-- ロジック名 -->
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                        ロジック名 <span class="text-red-400">*</span>
                    </label>
                    <input type="text" 
                           id="factorName" 
                           placeholder="例: 東京芝1800m逃げ馬狙い"
                           class="input-field w-full"
                           maxlength="100">
                    <p class="text-xs text-gray-500 mt-1">簡潔で分かりやすい名前を付けてください</p>
                </div>
                
                <!-- ロジック説明 -->
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                        ロジック説明 <span class="text-red-400">*</span>
                    </label>
                    <textarea id="factorDescription" 
                              placeholder="例: 東京競馬場の芝1800mで、逃げ脚質の馬を狙うロジック。オッズは10倍以下、騎手勝率15%以上を条件とする。"
                              class="input-field w-full"
                              rows="3"
                              maxlength="500"></textarea>
                    <p class="text-xs text-gray-500 mt-1">このロジックの狙いや特徴を説明してください</p>
                </div>
                
                <!-- 条件サマリー -->
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                        設定されている条件
                    </label>
                    <div id="conditionSummary" class="bg-gray-800 rounded-lg p-4 text-sm">
                        <div class="text-gray-500 text-center py-4">
                            <i class="fas fa-info-circle text-2xl mb-2"></i>
                            <p>「新規作成」ボタンから条件を設定してください</p>
                        </div>
                    </div>
                </div>
                
                <!-- 保存ボタン -->
                <div class="flex space-x-4">
                    <button onclick="saveFactor()" 
                            class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                            id="saveButton"
                            disabled>
                        <i class="fas fa-save mr-2"></i>ロジックを保存
                    </button>
                    <button onclick="clearForm()" 
                            class="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition">
                        <i class="fas fa-redo mr-2"></i>リセット
                    </button>
                </div>
            </div>
        </div>
        
        <!-- 登録済みロジック一覧 -->
        <div class="glass rounded-xl p-6 factor-card">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-white">
                    <i class="fas fa-list text-blue-400 mr-2"></i>
                    登録済みロジック
                </h2>
                <div class="text-sm text-gray-400">
                    全 <span id="totalFactors" class="text-white font-bold">0</span> 件
                </div>
            </div>
            
            <!-- 検索・フィルター -->
            <div class="mb-4">
                <div class="relative">
                    <input type="text" 
                           id="searchQuery"
                           placeholder="ロジック名で検索..."
                           class="input-field w-full pl-10"
                           onkeyup="filterFactors()">
                    <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                </div>
            </div>
            
            <!-- ロジック一覧テーブル -->
            <div class="overflow-x-auto">
                <table class="w-full" id="factorsTable">
                    <thead>
                        <tr class="border-b border-gray-700">
                            <th class="text-left py-3 px-4 font-semibold text-gray-300">ロジック名</th>
                            <th class="text-left py-3 px-4 font-semibold text-gray-300">説明</th>
                            <th class="text-left py-3 px-4 font-semibold text-gray-300">作成日時</th>
                            <th class="text-left py-3 px-4 font-semibold text-gray-300">条件数</th>
                            <th class="text-right py-3 px-4 font-semibold text-gray-300">操作</th>
                        </tr>
                    </thead>
                    <tbody id="factorsTableBody">
                        <!-- ロジックがここに表示される -->
                    </tbody>
                </table>
            </div>
            
            <!-- 空状態 -->
            <div id="emptyState" class="text-center py-12 hidden">
                <i class="fas fa-folder-open text-6xl text-gray-700 mb-4"></i>
                <p class="text-gray-500 mb-4">登録されているロジックがありません</p>
                <a href="/condition-settings" class="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition">
                    <i class="fas fa-plus mr-2"></i>最初のロジックを作成
                </a>
            </div>
        </div>
        
    </div>
    
    <!-- 詳細モーダル -->
    <div id="detailModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
        <div class="bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-white">ロジック詳細</h3>
                <button onclick="closeDetailModal()" class="text-gray-400 hover:text-white transition">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <div id="detailContent">
                <!-- 詳細内容がここに表示される -->
            </div>
        </div>
    </div>
    
    <script>
// グローバル変数
let allFactors = [];
let currentConditions = null;

// ページ読み込み時
document.addEventListener('DOMContentLoaded', async function() {
    // 保存された条件を取得（sessionStorage から）
    const savedConditions = sessionStorage.getItem('pendingConditions');
    if (savedConditions) {
        currentConditions = JSON.parse(savedConditions);
        displayConditionSummary(currentConditions);
        document.getElementById('saveButton').disabled = false;
    }
    
    // 登録済みファクターを読み込み
    await loadFactors();
});

// 条件サマリーを表示
function displayConditionSummary(conditions) {
    const summary = document.getElementById('conditionSummary');
    
    const raceConditions = [];
    if (conditions.race.track) raceConditions.push(\`競馬場: \${getTrackName(conditions.race.track)}\`);
    if (conditions.race.distanceMin && conditions.race.distanceMax) {
        raceConditions.push(\`距離: \${conditions.race.distanceMin}m 〜 \${conditions.race.distanceMax}m\`);
    }
    if (conditions.race.surface) raceConditions.push(\`馬場: \${conditions.race.surface}\`);
    
    const factorConditions = conditions.factors.map(f => {
        const factorName = getFactorName(f.factor);
        const operatorSymbol = getOperatorSymbol(f.operator);
        return \`\${factorName} \${operatorSymbol} \${f.value}\`;
    });
    
    summary.innerHTML = \`
        <div class="space-y-3">
            <div>
                <strong class="text-blue-400">レース条件:</strong>
                <div class="mt-1 space-y-1">
                    \${raceConditions.length > 0 
                        ? raceConditions.map(c => \`<div class="text-gray-300">・\${c}</div>\`).join('')
                        : '<div class="text-gray-500">全てのレース</div>'}
                </div>
            </div>
            
            <div>
                <strong class="text-green-400">ファクター条件:</strong>
                <div class="mt-1 space-y-1">
                    \${factorConditions.length > 0
                        ? factorConditions.map(c => \`<div class="text-gray-300">・\${c}</div>\`).join('')
                        : '<div class="text-gray-500">条件未設定</div>'}
                </div>
            </div>
            
            <div class="pt-2 border-t border-gray-700">
                <span class="badge bg-purple-600 text-white">
                    条件数: \${raceConditions.length + factorConditions.length}
                </span>
            </div>
        </div>
    \`;
}

// 登録済みファクターを読み込み
async function loadFactors() {
    try {
        const response = await axios.get('/api/factors');
        allFactors = response.data;
        renderFactorsTable(allFactors);
    } catch (error) {
        console.error('Failed to load factors:', error);
        allFactors = [];
        renderFactorsTable([]);
    }
}

// ファクターテーブルを描画
function renderFactorsTable(factors) {
    const tbody = document.getElementById('factorsTableBody');
    const emptyState = document.getElementById('emptyState');
    const totalFactors = document.getElementById('totalFactors');
    
    totalFactors.textContent = factors.length;
    
    if (factors.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    tbody.innerHTML = factors.map(factor => {
        const conditions = JSON.parse(factor.conditions);
        const conditionCount = (conditions.factors?.length || 0) + 
                              (conditions.race?.track ? 1 : 0) + 
                              (conditions.race?.surface ? 1 : 0) + 
                              (conditions.race?.distanceMin ? 1 : 0);
        
        return \`
            <tr class="border-b border-gray-700 hover:bg-gray-800 transition">
                <td class="py-3 px-4">
                    <div class="font-medium text-white">\${escapeHtml(factor.name)}</div>
                </td>
                <td class="py-3 px-4">
                    <div class="text-sm text-gray-400 max-w-xs truncate">
                        \${escapeHtml(factor.description)}
                    </div>
                </td>
                <td class="py-3 px-4">
                    <div class="text-sm text-gray-400">
                        \${new Date(factor.created_at).toLocaleString('ja-JP')}
                    </div>
                </td>
                <td class="py-3 px-4">
                    <span class="badge bg-blue-600 text-white">
                        \${conditionCount} 条件
                    </span>
                </td>
                <td class="py-3 px-4 text-right">
                    <div class="flex justify-end space-x-2">
                        <button onclick="viewFactorDetail(\${factor.id})" 
                                class="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition"
                                title="詳細を見る">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="runBacktest(\${factor.id})" 
                                class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition"
                                title="バックテスト">
                            <i class="fas fa-chart-line"></i>
                        </button>
                        <button onclick="editFactor(\${factor.id})" 
                                class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition"
                                title="編集">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteFactor(\${factor.id})" 
                                class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition"
                                title="削除">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        \`;
    }).join('');
}

// ファクター検索
function filterFactors() {
    const query = document.getElementById('searchQuery').value.toLowerCase();
    const filtered = allFactors.filter(f => 
        f.name.toLowerCase().includes(query) || 
        f.description.toLowerCase().includes(query)
    );
    renderFactorsTable(filtered);
}

// ファクターを保存
async function saveFactor() {
    const name = document.getElementById('factorName').value.trim();
    const description = document.getElementById('factorDescription').value.trim();
    
    if (!name) {
        alert('ロジック名を入力してください');
        return;
    }
    
    if (!description) {
        alert('ロジック説明を入力してください');
        return;
    }
    
    if (!currentConditions) {
        alert('条件を設定してください');
        return;
    }
    
    try {
        await axios.post('/api/factors', {
            name,
            description,
            conditions: currentConditions
        });
        
        alert('ロジックを保存しました！');
        
        // フォームをクリア
        clearForm();
        
        // 一覧を再読み込み
        await loadFactors();
        
    } catch (error) {
        console.error('Failed to save factor:', error);
        alert('保存に失敗しました: ' + error.message);
    }
}

// フォームをクリア
function clearForm() {
    document.getElementById('factorName').value = '';
    document.getElementById('factorDescription').value = '';
    sessionStorage.removeItem('pendingConditions');
    currentConditions = null;
    document.getElementById('conditionSummary').innerHTML = \`
        <div class="text-gray-500 text-center py-4">
            <i class="fas fa-info-circle text-2xl mb-2"></i>
            <p>「新規作成」ボタンから条件を設定してください</p>
        </div>
    \`;
    document.getElementById('saveButton').disabled = true;
}

// ファクター詳細を表示
function viewFactorDetail(id) {
    const factor = allFactors.find(f => f.id === id);
    if (!factor) return;
    
    const conditions = JSON.parse(factor.conditions);
    
    const detailContent = document.getElementById('detailContent');
    detailContent.innerHTML = \`
        <div class="space-y-4">
            <div>
                <h4 class="font-semibold text-gray-300 mb-1">ロジック名</h4>
                <p class="text-white text-lg">\${escapeHtml(factor.name)}</p>
            </div>
            
            <div>
                <h4 class="font-semibold text-gray-300 mb-1">説明</h4>
                <p class="text-gray-400">\${escapeHtml(factor.description)}</p>
            </div>
            
            <div>
                <h4 class="font-semibold text-gray-300 mb-2">レース条件</h4>
                <div class="bg-gray-900 rounded-lg p-3 space-y-1 text-sm">
                    <div>競馬場: \${conditions.race.track ? getTrackName(conditions.race.track) : '全て'}</div>
                    <div>距離: \${conditions.race.distanceMin || 1000}m 〜 \${conditions.race.distanceMax || 3600}m</div>
                    <div>馬場: \${conditions.race.surface || '全て'}</div>
                </div>
            </div>
            
            <div>
                <h4 class="font-semibold text-gray-300 mb-2">ファクター条件</h4>
                <div class="bg-gray-900 rounded-lg p-3 space-y-1 text-sm">
                    \${conditions.factors.length > 0
                        ? conditions.factors.map(f => \`
                            <div>・\${getFactorName(f.factor)} \${getOperatorSymbol(f.operator)} \${f.value}</div>
                        \`).join('')
                        : '<div class="text-gray-500">条件未設定</div>'}
                </div>
            </div>
            
            <div class="pt-4 border-t border-gray-700">
                <div class="text-sm text-gray-400">
                    作成日時: \${new Date(factor.created_at).toLocaleString('ja-JP')}
                </div>
            </div>
        </div>
    \`;
    
    document.getElementById('detailModal').classList.remove('hidden');
    document.getElementById('detailModal').classList.add('flex');
}

// モーダルを閉じる
function closeDetailModal() {
    document.getElementById('detailModal').classList.add('hidden');
    document.getElementById('detailModal').classList.remove('flex');
}

// バックテスト実行
function runBacktest(id) {
    // TODO: バックテストページへ遷移
    window.location.href = \`/analysis?factorId=\${id}\`;
}

// ファクター編集
function editFactor(id) {
    const factor = allFactors.find(f => f.id === id);
    if (!factor) return;
    
    // 条件をsessionStorageに保存
    sessionStorage.setItem('pendingConditions', factor.conditions);
    sessionStorage.setItem('editingFactorId', id);
    
    // Condition設定ページへ遷移
    window.location.href = '/condition-settings';
}

// ファクター削除
async function deleteFactor(id) {
    const factor = allFactors.find(f => f.id === id);
    if (!factor) return;
    
    if (!confirm(\`「\${factor.name}」を削除しますか？\\nこの操作は取り消せません。\`)) {
        return;
    }
    
    try {
        await axios.delete(\`/api/factors/\${id}\`);
        alert('削除しました');
        await loadFactors();
    } catch (error) {
        console.error('Failed to delete factor:', error);
        alert('削除に失敗しました: ' + error.message);
    }
}

// ヘルパー関数
function getTrackName(code) {
    const tracks = {
        '01': '札幌', '02': '函館', '03': '福島', '04': '新潟',
        '05': '東京', '06': '中山', '07': '中京', '08': '京都',
        '09': '阪神', '10': '小倉'
    };
    return tracks[code] || code;
}

function getFactorName(factor) {
    const factors = {
        odds: 'オッズ',
        popularity: '人気',
        weight: '斤量',
        horse_weight: '馬体重',
        jockey_win_rate: '騎手勝率',
        trainer_win_rate: '調教師勝率',
        recent_form: '近走成績',
        speed_index: 'スピード指数',
        pace_index: 'ペース指数',
        position_index: '位置取り指数'
    };
    return factors[factor] || factor;
}

function getOperatorSymbol(operator) {
    const operators = {
        gte: '以上 (≥)',
        lte: '以下 (≤)',
        eq: '等しい (=)',
        gt: 'より大きい (>)',
        lt: 'より小さい (<)'
    };
    return operators[operator] || operator;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
    <\/script>
</body>
</html>`));As.get("/api/factors",async i=>{try{return i.json(Ct.getAllFactors())}catch(t){return console.error("Failed to get factors:",t),i.json({error:"Failed to get factors"},500)}});As.post("/api/factors",async i=>{try{const{name:t,description:e,conditions:s}=await i.req.json();if(!t||!e||!s)return i.json({error:"Missing required fields"},400);const r={id:Date.now(),name:t,description:e,conditions:JSON.stringify(s),created_at:new Date().toISOString()};return Ct.addFactor(r),i.json({id:r.id,message:"Factor saved successfully"})}catch(t){return console.error("Failed to save factor:",t),i.json({error:"Failed to save factor"},500)}});As.delete("/api/factors/:id",async i=>{try{const t=parseInt(i.req.param("id"));return Ct.deleteFactor(t),i.json({message:"Factor deleted successfully"})}catch(t){return console.error("Failed to delete factor:",t),i.json({error:"Failed to delete factor"},500)}});As.put("/api/factors/:id",async i=>{try{const t=parseInt(i.req.param("id")),{name:e,description:s,conditions:r}=await i.req.json();return Ct.updateFactor(t,{name:e,description:s,conditions:JSON.stringify(r)}),i.json({message:"Factor updated successfully"})}catch(t){return console.error("Failed to update factor:",t),i.json({error:"Failed to update factor"},500)}});class Za{parse(t){if(!t||t.length<46)return null;try{const e=t.substring(2,10);return{track_code:t.substring(0,2).trim(),race_date:this.parseDate(e),race_number:t.substring(10,12).trim(),horse_number:t.substring(12,14).trim(),horse_id:t.substring(14,22).trim(),time_1:t.substring(22,25).trim(),time_2:t.substring(25,28).trim(),time_3:t.substring(28,31).trim(),time_4:t.substring(31,34).trim(),time_5:t.substring(34,37).trim(),time_6:t.substring(37,40).trim(),time_7:t.substring(40,43).trim(),time_8:t.substring(43,46).trim(),raw:t}}catch(e){return console.error("Failed to parse HC line:",e),null}}parseFile(t){const e=t.split(/\r?\n/),s=[];for(const r of e)if(r.trim()){const n=this.parse(r);n&&s.push(n)}return s}parseDate(t){return t}parseFilenameDate(t){const e=t.match(/HC\d{2}(\d{3})(\d{2})(\d{2})/);if(e){const s="20"+e[1].substring(1),r=e[2],n=e[3];return`${s}-${r}-${n}`}return""}getTrackName(t){return{"01":"札幌","02":"函館","03":"福島","04":"新潟","05":"東京","06":"中山","07":"中京","08":"京都","09":"阪神",10:"小倉"}[t]||t}groupByRace(t){const e=new Map;for(const s of t){const r=`${s.track_code}-${s.race_date}-${s.race_number}`;e.has(r)||e.set(r,[]),e.get(r).push(s)}return e}}const or=new de;or.get("/tomorrow-races",i=>i.html(`<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>翌日レース - UMAYOMI</title>
    <script src="https://cdn.tailwindcss.com"><\/script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"><\/script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Inter', sans-serif; }
        
        .glass {
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(148, 163, 184, 0.1);
        }
        
        .race-card {
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .race-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
        }
        
        .upload-zone {
            border: 2px dashed #475569;
            transition: all 0.3s;
        }
        
        .upload-zone:hover {
            border-color: #3b82f6;
            background: rgba(59, 130, 246, 0.05);
        }
        
        .upload-zone.dragover {
            border-color: #10b981;
            background: rgba(16, 185, 129, 0.1);
        }
    </style>
</head>
<body class="bg-gray-900 text-gray-100 min-h-screen">
    
    <!-- Header -->
    <div class="bg-gray-800 border-b border-gray-700">
        <div class="max-w-7xl mx-auto px-6 py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <a href="/" class="text-gray-400 hover:text-white transition">
                        <i class="fas fa-arrow-left"></i>
                    </a>
                    <div>
                        <h1 class="text-2xl font-bold text-white">翌日レース</h1>
                        <p class="text-sm text-gray-400">JRA-VAN CK_DATAから出走表を読み込み</p>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <div id="uploadedInfo" class="text-sm text-gray-400 hidden">
                        <i class="fas fa-calendar-check text-green-400 mr-2"></i>
                        <span id="uploadedDateText"></span>
                    </div>
                    <button onclick="document.getElementById('fileInput').click()" 
                            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
                        <i class="fas fa-upload mr-2"></i>CK_DATA読み込み
                    </button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-8">
        
        <!-- Upload Zone -->
        <div id="uploadZone" class="upload-zone glass rounded-xl p-12 mb-8 text-center">
            <i class="fas fa-cloud-upload-alt text-6xl text-gray-600 mb-4"></i>
            <h3 class="text-xl font-semibold text-white mb-2">CK_DATAファイルをアップロード</h3>
            <p class="text-gray-400 mb-4">ファイルをドラッグ&ドロップ または クリックして選択</p>
            <input type="file" id="fileInput" class="hidden" accept=".DAT,.dat,.txt" onchange="handleFileSelect(event)">
            <p class="text-xs text-gray-500">例: HC020250102.DAT</p>
        </div>
        
        <!-- Race List -->
        <div id="raceListContainer" class="hidden">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-white">
                    <i class="fas fa-list text-blue-400 mr-2"></i>
                    レース一覧
                </h2>
                <div class="text-sm text-gray-400">
                    全 <span id="totalRaces" class="text-white font-bold">0</span> レース
                </div>
            </div>
            
            <div id="raceList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- レースカードがここに表示される -->
            </div>
        </div>
        
        <!-- Empty State -->
        <div id="emptyState" class="text-center py-12">
            <i class="fas fa-inbox text-6xl text-gray-700 mb-4"></i>
            <p class="text-gray-500 mb-4">CK_DATAファイルをアップロードしてください</p>
            <p class="text-sm text-gray-600">金曜/土曜の夜にJRA-VANからダウンロードしたファイル</p>
        </div>
        
    </div>
    
    <script>
let allRaces = [];

// File drop handling
const uploadZone = document.getElementById('uploadZone');

uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

uploadZone.addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

// File select handling
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        handleFile(file);
    }
}

// Upload file
async function handleFile(file) {
    try {
        console.log('Uploading file:', file.name);
        
        const reader = new FileReader();
        reader.onload = async (e) => {
            const content = e.target.result;
            
            await axios.post('/api/tomorrow-races/upload', {
                filename: file.name,
                content: content
            });
            
            alert(\`\${file.name} を読み込みました！\`);
            
            // Reload races
            await loadRaces();
        };
        
        reader.readAsText(file, 'Shift-JIS');
    } catch (error) {
        console.error('Failed to upload file:', error);
        alert('ファイルのアップロードに失敗しました: ' + error.message);
    }
}

// Load races
async function loadRaces() {
    try {
        const response = await axios.get('/api/tomorrow-races');
        const data = response.data;
        
        allRaces = data.races || [];
        const uploadedDate = data.uploadedDate || '';
        
        if (allRaces.length > 0) {
            document.getElementById('emptyState').classList.add('hidden');
            document.getElementById('raceListContainer').classList.remove('hidden');
            document.getElementById('uploadedInfo').classList.remove('hidden');
            document.getElementById('uploadedDateText').textContent = uploadedDate;
            
            renderRaces(allRaces);
        } else {
            document.getElementById('emptyState').classList.remove('hidden');
            document.getElementById('raceListContainer').classList.add('hidden');
            document.getElementById('uploadedInfo').classList.add('hidden');
        }
    } catch (error) {
        console.error('Failed to load races:', error);
    }
}

// Render races
function renderRaces(races) {
    const container = document.getElementById('raceList');
    const totalRaces = document.getElementById('totalRaces');
    
    totalRaces.textContent = races.length;
    
    container.innerHTML = races.map((race, index) => \`
        <div class="glass rounded-xl p-6 race-card" onclick="viewRaceDetail(\${index})">
            <div class="flex items-start justify-between mb-4">
                <div>
                    <h3 class="text-lg font-bold text-white mb-1">\${race.trackName}</h3>
                    <p class="text-sm text-gray-400">\${race.date}</p>
                </div>
                <div class="text-right">
                    <div class="text-2xl font-bold text-blue-400">R\${race.raceNumber}</div>
                </div>
            </div>
            
            <div class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-400">出走頭数</span>
                    <span class="font-semibold text-white">\${race.horseCount}頭</span>
                </div>
            </div>
            
            <div class="mt-4 pt-4 border-t border-gray-700">
                <button class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
                        onclick="event.stopPropagation(); viewRaceDetail(\${index})">
                    <i class="fas fa-eye mr-2"></i>出走表を見る
                </button>
            </div>
        </div>
    \`).join('');
}

// View race detail
function viewRaceDetail(index) {
    const race = allRaces[index];
    window.location.href = \`/race-card?track=\${race.trackCode}&date=\${race.date}&race=\${race.raceNumber}\`;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadRaces();
});
    <\/script>
</body>
</html>`));or.post("/api/tomorrow-races/upload",async i=>{try{const{filename:t,content:e}=await i.req.json();if(!t||!e)return i.json({error:"Missing required fields"},400);const s=new Za,r=s.parseFile(e);if(r.length===0)return i.json({error:"No records found in file"},400);const n=s.groupByRace(r);return Ct.tomorrowRaces=n,Ct.uploadedDate=s.parseFilenameDate(t),i.json({message:"File uploaded successfully",totalRecords:r.length,totalRaces:n.size,uploadedDate:Ct.uploadedDate})}catch(t){return console.error("Failed to upload CK_DATA:",t),i.json({error:"Failed to upload file"},500)}});or.get("/api/tomorrow-races",async i=>{try{const t=[],e=new Za;for(const[s,r]of Ct.tomorrowRaces){const n=r[0];t.push({trackCode:n.track_code,trackName:e.getTrackName(n.track_code),date:Ct.uploadedDate||n.race_date,raceNumber:n.race_number,horseCount:r.length,horses:r.map(o=>({horseNumber:o.horse_number,horseId:o.horse_id}))})}return t.sort((s,r)=>parseInt(s.raceNumber)-parseInt(r.raceNumber)),i.json({races:t,uploadedDate:Ct.uploadedDate})}catch(t){return console.error("Failed to get tomorrow races:",t),i.json({error:"Failed to get races"},500)}});class Uc{applyFactor(t,e,s){return t.map(r=>{const n=this.calculateRGS(r,e,s),o=this.calculateAAS(r,e),c=(n+o)/2,{matched:l,total:d}=this.countMatchedConditions(r,e);return{...r,rgs:n,aas:o,total_score:c,matched_conditions:l,total_conditions:d}})}calculateRGS(t,e,s){let r=50;const{race:n}=e;return n.track&&n.track===s.track&&(r+=10),n.distanceMin&&n.distanceMax&&(s.distance>=n.distanceMin&&s.distance<=n.distanceMax?r+=15:r-=10),n.surface&&n.surface===s.surface&&(r+=10),Math.max(0,Math.min(100,r))}calculateAAS(t,e){let s=50,r=0,n=e.factors.length;if(n===0)return s;for(const c of e.factors){const l=this.getHorseValue(t,c.factor);if(l===null)continue;this.checkCondition(l,c.operator,c.value)&&r++}return s=50+r/n*50,Math.max(0,Math.min(100,s))}getHorseValue(t,e){switch(e){case"odds":return t.odds??this.generateMockOdds();case"popularity":return t.popularity??this.generateMockPopularity();case"weight":return t.weight??55;case"horse_weight":return t.horse_weight??this.generateMockHorseWeight();case"jockey_win_rate":return t.jockey_win_rate??this.generateMockWinRate();case"trainer_win_rate":return t.trainer_win_rate??this.generateMockWinRate();case"recent_form":return t.recent_form??this.generateMockForm();case"speed_index":return t.speed_index??this.generateMockIndex();case"pace_index":return t.pace_index??this.generateMockIndex();case"position_index":return t.position_index??this.generateMockIndex();default:return null}}checkCondition(t,e,s){switch(e){case"gte":return t>=s;case"lte":return t<=s;case"eq":return t===s;case"gt":return t>s;case"lt":return t<s;default:return!1}}countMatchedConditions(t,e){let s=0;const r=e.factors.length;for(const n of e.factors){const o=this.getHorseValue(t,n.factor);o!==null&&this.checkCondition(o,n.operator,n.value)&&s++}return{matched:s,total:r}}generateMockOdds(){return Math.random()*50+1}generateMockPopularity(){return Math.floor(Math.random()*18)+1}generateMockHorseWeight(){return Math.floor(Math.random()*100)+400}generateMockWinRate(){return Math.random()*30}generateMockForm(){return Math.random()*100}generateMockIndex(){return Math.random()*100}}const Ci=new de;Ci.get("/race-card",i=>(i.req.query("track"),i.req.query("date"),i.req.query("race"),i.html(`<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>出走表 - UMAYOMI</title>
    <script src="https://cdn.tailwindcss.com"><\/script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"><\/script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Inter', sans-serif; }
        
        .glass {
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(148, 163, 184, 0.1);
        }
        
        .horse-row {
            transition: all 0.2s ease;
        }
        
        .horse-row:hover {
            background: rgba(59, 130, 246, 0.1);
            transform: translateX(4px);
        }
        
        .horse-number {
            min-width: 48px;
            height: 48px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 1.25rem;
        }
        
        .rank-1 { background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #000; }
        .rank-2 { background: linear-gradient(135deg, #d1d5db, #9ca3af); color: #000; }
        .rank-3 { background: linear-gradient(135deg, #ea580c, #dc2626); color: #fff; }
        .rank-other { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
        
        .score-badge {
            display: inline-block;
            padding: 0.5rem 1rem;
            border-radius: 9999px;
            font-weight: 700;
            font-size: 1.125rem;
        }
        
        .score-high { background: linear-gradient(135deg, #10b981, #059669); }
        .score-medium { background: linear-gradient(135deg, #3b82f6, #2563eb); }
        .score-low { background: rgba(75, 85, 99, 0.5); }
        
        @media (max-width: 768px) {
            .desktop-only { display: none; }
        }
    </style>
</head>
<body class="bg-gray-900 text-gray-100 min-h-screen">
    
    <!-- Header -->
    <div class="bg-gray-800 border-b border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <a href="/tomorrow-races" class="text-gray-400 hover:text-white transition">
                        <i class="fas fa-arrow-left"></i>
                    </a>
                    <div>
                        <h1 class="text-xl sm:text-2xl font-bold text-white" id="raceTitle">出走表</h1>
                        <p class="text-xs sm:text-sm text-gray-400" id="raceInfo">読み込み中...</p>
                    </div>
                </div>
                <div class="flex items-center space-x-2 sm:space-x-4">
                    <select id="factorSelect" class="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm">
                        <option value="">ファクター選択</option>
                    </select>
                    <button onclick="applyFactor()" 
                            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition text-sm">
                        <i class="fas fa-calculator mr-2"></i>適用
                    </button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        <!-- Sort & Filter -->
        <div class="glass rounded-xl p-4 mb-6">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div class="flex items-center space-x-4">
                    <button onclick="sortBy('number')" 
                            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition">
                        <i class="fas fa-sort-numeric-down mr-2"></i>馬番順
                    </button>
                    <button onclick="sortBy('score')" 
                            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition">
                        <i class="fas fa-sort-amount-down mr-2"></i>得点順
                    </button>
                </div>
                <div class="text-sm text-gray-400">
                    全 <span id="totalHorses" class="text-white font-bold">0</span> 頭
                </div>
            </div>
        </div>
        
        <!-- Horse List -->
        <div class="space-y-3" id="horseList">
            <!-- 出走馬がここに表示される -->
        </div>
        
        <!-- Empty State -->
        <div id="emptyState" class="glass rounded-xl p-12 text-center">
            <i class="fas fa-spinner fa-spin text-4xl text-gray-600 mb-4"></i>
            <p class="text-gray-400">読み込み中...</p>
        </div>
        
    </div>
    
    <!-- Horse Detail Modal -->
    <div id="horseModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50 p-4">
        <div class="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-white" id="modalHorseName">馬情報</h3>
                <button onclick="closeModal()" class="text-gray-400 hover:text-white transition">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <div id="modalContent">
                <!-- 馬情報がここに表示される -->
            </div>
        </div>
    </div>
    
    <script>
// URL parameters
const urlParams = new URLSearchParams(window.location.search);
const trackCode = urlParams.get('track') || '';
const raceDate = urlParams.get('date') || '';
const raceNumber = urlParams.get('race') || '';

let allHorses = [];
let currentSort = 'number';
let appliedFactor = null;

// Track names
const trackNames = {
    '01': '札幌', '02': '函館', '03': '福島', '04': '新潟',
    '05': '東京', '06': '中山', '07': '中京', '08': '京都',
    '09': '阪神', '10': '小倉'
};

// Load race data
async function loadRaceCard() {
    try {
        const response = await axios.get(\`/api/race-card?track=\${trackCode}&date=\${raceDate}&race=\${raceNumber}\`);
        const data = response.data;
        
        if (!data || !data.horses) {
            throw new Error('レースデータが見つかりません');
        }
        
        allHorses = data.horses;
        
        // Update header
        const trackName = trackNames[trackCode] || trackCode;
        document.getElementById('raceTitle').textContent = \`\${trackName} \${raceNumber}R\`;
        document.getElementById('raceInfo').textContent = \`\${raceDate} • \${allHorses.length}頭立\`;
        document.getElementById('totalHorses').textContent = allHorses.length;
        
        // Render horses
        renderHorses(allHorses);
        
        // Load factors
        await loadFactors();
        
        document.getElementById('emptyState').classList.add('hidden');
    } catch (error) {
        console.error('Failed to load race card:', error);
        document.getElementById('emptyState').innerHTML = \`
            <i class="fas fa-exclamation-circle text-4xl text-red-500 mb-4"></i>
            <p class="text-gray-400 mb-4">レースデータの読み込みに失敗しました</p>
            <a href="/tomorrow-races" class="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                レース一覧に戻る
            </a>
        \`;
    }
}

// Render horses
function renderHorses(horses) {
    const container = document.getElementById('horseList');
    
    // Sort horses
    const sortedHorses = [...horses].sort((a, b) => {
        if (currentSort === 'number') {
            return parseInt(a.horse_number) - parseInt(b.horse_number);
        } else if (currentSort === 'score') {
            return (b.score || 0) - (a.score || 0);
        }
        return 0;
    });
    
    container.innerHTML = sortedHorses.map((horse, index) => {
        const horseNum = parseInt(horse.horse_number);
        const rank = currentSort === 'score' ? index + 1 : null;
        const score = horse.score || null;
        
        let rankClass = 'rank-other';
        if (rank === 1) rankClass = 'rank-1';
        else if (rank === 2) rankClass = 'rank-2';
        else if (rank === 3) rankClass = 'rank-3';
        
        let scoreClass = 'score-low';
        let scoreDisplay = 'N/A';
        if (score !== null) {
            scoreDisplay = score.toFixed(1);
            if (score >= 80) scoreClass = 'score-high';
            else if (score >= 60) scoreClass = 'score-medium';
        }
        
        return \`
            <div class="glass rounded-xl p-4 sm:p-6 horse-row cursor-pointer" onclick="showHorseDetail(\${index})">
                <div class="flex items-center gap-4">
                    <!-- Horse Number -->
                    <div class="horse-number \${currentSort === 'score' && rank <= 3 ? rankClass : 'rank-other'}">
                        \${horseNum}
                    </div>
                    
                    <!-- Horse Info -->
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-2">
                            <h3 class="text-lg font-bold text-white truncate">馬ID: \${horse.horse_id}</h3>
                            \${rank && rank <= 3 ? \`
                                <span class="flex-shrink-0 px-2 py-1 bg-yellow-600 text-white rounded text-xs font-bold">
                                    TOP \${rank}
                                </span>
                            \` : ''}
                        </div>
                        
                        <div class="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-400">
                            <span><i class="fas fa-hashtag mr-1"></i>馬番: \${horseNum}</span>
                            <span class="desktop-only">•</span>
                            <span><i class="fas fa-dna mr-1"></i>ID: \${horse.horse_id}</span>
                        </div>
                    </div>
                    
                    <!-- Score -->
                    \${score !== null ? \`
                        <div class="flex-shrink-0">
                            <div class="score-badge \${scoreClass}">
                                \${scoreDisplay}
                            </div>
                        </div>
                    \` : ''}
                    
                    <!-- Arrow -->
                    <div class="flex-shrink-0 text-gray-500">
                        <i class="fas fa-chevron-right"></i>
                    </div>
                </div>
            </div>
        \`;
    }).join('');
}

// Sort horses
function sortBy(type) {
    currentSort = type;
    renderHorses(allHorses);
}

// Show horse detail
function showHorseDetail(index) {
    const horses = [...allHorses].sort((a, b) => {
        if (currentSort === 'number') {
            return parseInt(a.horse_number) - parseInt(b.horse_number);
        } else if (currentSort === 'score') {
            return (b.score || 0) - (a.score || 0);
        }
        return 0;
    });
    
    const horse = horses[index];
    
    document.getElementById('modalHorseName').textContent = \`馬番 \${horse.horse_number}\`;
    document.getElementById('modalContent').innerHTML = \`
        <div class="space-y-4">
            <div>
                <h4 class="font-semibold text-gray-300 mb-2">基本情報</h4>
                <div class="bg-gray-900 rounded-lg p-4 space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-400">馬番:</span>
                        <span class="text-white font-semibold">\${horse.horse_number}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">血統登録番号:</span>
                        <span class="text-white font-semibold">\${horse.horse_id}</span>
                    </div>
                </div>
            </div>
            
            \${horse.score !== null && horse.score !== undefined ? \`
            <div>
                <h4 class="font-semibold text-gray-300 mb-2">ファクター得点</h4>
                <div class="bg-gray-900 rounded-lg p-4 space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-400">総合得点:</span>
                        <span class="text-2xl font-bold text-white">\${horse.score.toFixed(1)} 点</span>
                    </div>
                    <div class="border-t border-gray-800 pt-3 space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-400">RGS (レース適性):</span>
                            <span class="text-blue-400 font-semibold">\${horse.rgs?.toFixed(1) || 'N/A'}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400">AAS (能力評価):</span>
                            <span class="text-green-400 font-semibold">\${horse.aas?.toFixed(1) || 'N/A'}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400">条件一致:</span>
                            <span class="text-purple-400 font-semibold">
                                \${horse.matched_conditions || 0} / \${horse.total_conditions || 0}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            \` : ''}
            
            <div>
                <h4 class="font-semibold text-gray-300 mb-2">Raw Data</h4>
                <div class="bg-gray-900 rounded-lg p-4">
                    <pre class="text-xs text-gray-400 overflow-x-auto">\${JSON.stringify(horse, null, 2)}</pre>
                </div>
            </div>
        </div>
    \`;
    
    document.getElementById('horseModal').classList.remove('hidden');
    document.getElementById('horseModal').classList.add('flex');
}

// Close modal
function closeModal() {
    document.getElementById('horseModal').classList.add('hidden');
    document.getElementById('horseModal').classList.remove('flex');
}

// Load factors
async function loadFactors() {
    try {
        const response = await axios.get('/api/race-card/factors');
        const factors = response.data;
        
        const select = document.getElementById('factorSelect');
        select.innerHTML = '<option value="">ファクター選択</option>' + 
            factors.map(f => \`<option value="\${f.id}">\${f.name}</option>\`).join('');
    } catch (error) {
        console.error('Failed to load factors:', error);
    }
}

// Apply factor
async function applyFactor() {
    const factorId = document.getElementById('factorSelect').value;
    
    if (!factorId) {
        alert('ファクターを選択してください');
        return;
    }
    
    try {
        // Show loading
        const emptyState = document.getElementById('emptyState');
        emptyState.classList.remove('hidden');
        emptyState.innerHTML = \`
            <i class="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
            <p class="text-gray-400">ファクターを適用中...</p>
        \`;
        document.getElementById('horseList').classList.add('hidden');
        
        // Apply factor
        const response = await axios.post('/api/race-card/apply-factor', {
            factorId: parseInt(factorId),
            horses: allHorses,
            raceInfo: {
                track: trackCode,
                distance: 1800, // TODO: Get from race data
                surface: '芝'   // TODO: Get from race data
            }
        });
        
        const data = response.data;
        allHorses = data.horses.map(h => ({
            ...h,
            score: h.total_score,
            rgs: h.rgs,
            aas: h.aas,
            matched_conditions: h.matched_conditions,
            total_conditions: h.total_conditions
        }));
        
        // Hide loading, show horses
        emptyState.classList.add('hidden');
        document.getElementById('horseList').classList.remove('hidden');
        
        // Sort by score and render
        currentSort = 'score';
        renderHorses(allHorses);
        
        // Show success message
        const factorName = data.factor.name;
        alert(\`ファクター「\${factorName}」を適用しました！\\n\\n得点順に並び替えました。\`);
    } catch (error) {
        console.error('Failed to apply factor:', error);
        alert('ファクターの適用に失敗しました: ' + error.message);
        
        // Reset view
        document.getElementById('emptyState').classList.add('hidden');
        document.getElementById('horseList').classList.remove('hidden');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadRaceCard();
});
    <\/script>
</body>
</html>`)));Ci.get("/api/race-card",async i=>{try{const t=i.req.query("track")||"",e=i.req.query("date")||"",s=i.req.query("race")||"",r=`${t}-${e}-${s}`;return i.json({track:t,date:e,raceNumber:s,horses:[{horse_number:"01",horse_id:"01910696"},{horse_number:"02",horse_id:"02210009"},{horse_number:"03",horse_id:"02210058"},{horse_number:"04",horse_id:"02210142"},{horse_number:"05",horse_id:"02210363"},{horse_number:"06",horse_id:"02210413"},{horse_number:"07",horse_id:"02210544"},{horse_number:"08",horse_id:"02210550"},{horse_number:"09",horse_id:"02210617"},{horse_number:"10",horse_id:"02210643"},{horse_number:"11",horse_id:"02210734"},{horse_number:"12",horse_id:"01910669"}]})}catch(t){return console.error("Failed to get race card:",t),i.json({error:"Failed to get race card"},500)}});Ci.post("/api/race-card/apply-factor",async i=>{try{const{factorId:t,horses:e,raceInfo:s}=await i.req.json();if(!t||!e||!s)return i.json({error:"Missing required fields"},400);const r=Ct.getFactor(parseInt(t));if(!r)return i.json({error:"Factor not found"},404);const n=JSON.parse(r.conditions),c=new Uc().applyFactor(e,n,s);return i.json({horses:c,factor:{id:r.id,name:r.name,description:r.description}})}catch(t){return console.error("Failed to apply factor:",t),i.json({error:"Failed to apply factor: "+t.message},500)}});Ci.get("/api/race-card/factors",async i=>{try{return i.json(Ct.getAllFactors())}catch(t){return console.error("Failed to get factors:",t),i.json({error:"Failed to get factors"},500)}});const _i=new de;_i.use("/*",Ka());const tn=new Map;_i.post("/start",async i=>{const t=await i.req.json(),{dataSource:e,startDate:s,endDate:r,dataPath:n}=t;if(!e||!s||!r||!n)return i.json({error:"パラメータ不足: dataSource, startDate, endDate, dataPath が必要です"},400);const o=`job_${Date.now()}_${Math.random().toString(36).substring(7)}`,c={jobId:o,status:"running",dataSource:e,startDate:s,endDate:r,dataPath:n,totalFiles:0,processedFiles:0,totalRecords:0,speed:0,startTime:Date.now()};return tn.set(o,c),qc(c).catch(l=>{c.status="error",c.error=l.message}),i.json({jobId:o,status:"started"})});_i.get("/progress/:jobId",i=>{const t=i.req.param("jobId"),e=tn.get(t);return e?i.json(e):i.json({error:"ジョブが見つかりません"},404)});_i.get("/jobs",i=>{const t=Array.from(tn.values()).sort((e,s)=>s.startTime-e.startTime);return i.json({jobs:t})});async function qc(i){try{if(i.dataSource.startsWith("jrdb_"))await Gc(i);else if(i.dataSource.startsWith("jravan_"))await Kc(i);else throw new Error(`未対応のデータソース: ${i.dataSource}`);i.status="completed",i.duration=(Date.now()-i.startTime)/1e3,i.averageSpeed=i.duration>0?Math.round(i.totalRecords/i.duration):0}catch(t){i.status="error",i.error=t.message}}async function Gc(i){await import("fs");const t=await import("path"),e=await Promise.resolve().then(()=>kd),s=i.dataPath.replace(/\\/g,"/"),r=e.sync(s).sort();if(r.length===0)throw new Error(`ファイルが見つかりません: ${i.dataPath}`);const n=Jc(r,i.startDate,i.endDate,i.dataSource);i.totalFiles=n.length,console.log(`📂 対象ファイル: ${n.length}件`),console.log(`📅 期間: ${i.startDate} ～ ${i.endDate}`);const{parseZEDFile:o}=await Promise.resolve().then(()=>Cd),c=(await Promise.resolve().then(()=>Wd)).default,l=t.join(process.cwd(),".wrangler/state/v3/d1/miniflare-D1DatabaseObject/0aedb352c8e6bb5c4415dfb2780580e45d94a7381c9bdb7654f57812c160c7ad.sqlite"),d=new c(l);d.pragma("journal_mode = WAL"),d.pragma("synchronous = NORMAL");for(const h of n)try{let f=[],u=0;if(i.dataSource==="jrdb_zed")f=o(h),u=Vc(d,f);else{console.log(`⚠️ パーサー未実装: ${i.dataSource}`);continue}i.processedFiles++,i.totalRecords+=u,i.lastFile=t.basename(h),i.lastRecords=u;const g=(Date.now()-i.startTime)/1e3;i.speed=g>0?Math.round(i.totalRecords/g):0,console.log(`✅ ${i.lastFile}: ${u} records`),await new Promise(y=>setTimeout(y,10))}catch(f){console.error(`❌ ${t.basename(h)}: ${f.message}`)}d.close()}function Vc(i,t){if(t.length===0)return 0;try{const e=i.prepare(`
      INSERT OR IGNORE INTO jrdb_zed_race (
        track_code, race_num, day_of_week, month, day, race_id, race_date,
        race_name, grade, distance, track_type, track_condition, weather,
        race_class, age_limit, weight_type, prize_1, prize_2, prize_3,
        prize_4, prize_5, num_horses, course, raw_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);return i.transaction(r=>{for(const n of r)e.run(n.trackCode,n.raceNum,n.dayOfWeek,n.month,n.day,n.raceId,n.raceDate,n.raceName,n.grade,n.distance,n.trackType,n.trackCondition,n.weather,n.raceClass,n.ageLimit,n.weightType,n.prize1,n.prize2,n.prize3,n.prize4,n.prize5,n.numHorses,n.course,n.rawData)})(t),t.length}catch(e){return console.error(`❌ Insert error: ${e.message}`),0}}async function Kc(i){throw new Error("JRA-VAN インポートは未実装です")}function Jc(i,t,e,s){const r=new Date(t),n=new Date(e);return i.filter(o=>{const c=o.split(/[\\/]/).pop();let l=null;if(s==="jrdb_zed"){const d=c.match(/ZED(\d{2})(\d{2})(\d{2})\.txt/i);if(d){const h=2e3+parseInt(d[1]),f=parseInt(d[2]),u=parseInt(d[3]);l=new Date(h,f-1,u)}}return l?l>=r&&l<=n:!1})}const Ht=new de;Ht.route("/api",Os);Ht.route("/api/data-import",_i);Ht.route("/",Ja);Ht.route("/",Ya);Ht.route("/",As);Ht.route("/",or);Ht.route("/",Ci);Ht.use("/static/*",Va({root:"./public"}));Ht.use("/downloads/*",Va({root:"./public"}));Ht.get("/",i=>i.html(`<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UMAYOMI - 馬を読む。レースが変わる。</title>
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
                    <p class="text-xs text-gray-400">馬を読む。レースが変わる。</p>
                </div>
            </div>
            
            <!-- Navigation -->
            <nav class="space-y-2">
                <a href="#" class="flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-600 text-white transition-smooth">
                    <i class="fas fa-home w-5"></i>
                    <span class="font-medium">ダッシュボード</span>
                </a>
                <a href="#" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-dark-card hover:text-white transition-smooth">
                    <i class="fas fa-flag-checkered w-5"></i>
                    <span class="font-medium">レース検索</span>
                </a>
                <a href="#" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-dark-card hover:text-white transition-smooth">
                    <i class="fas fa-horse w-5"></i>
                    <span class="font-medium">馬検索</span>
                </a>
                <a href="#" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-dark-card hover:text-white transition-smooth">
                    <i class="fas fa-user-tie w-5"></i>
                    <span class="font-medium">騎手検索</span>
                </a>
                <a href="#" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-dark-card hover:text-white transition-smooth">
                    <i class="fas fa-sliders-h w-5"></i>
                    <span class="font-medium">ファクター分析</span>
                </a>
                <a href="#" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-dark-card hover:text-white transition-smooth">
                    <i class="fas fa-chart-line w-5"></i>
                    <span class="font-medium">バックテスト</span>
                </a>
            </nav>
            
            <!-- Bottom Menu -->
            <div class="mt-8 pt-8 border-t border-dark-border space-y-2">
                <a href="/data-import.html" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-dark-card hover:text-white transition-smooth">
                    <i class="fas fa-download w-5"></i>
                    <span class="font-medium">データ取り込み</span>
                </a>
                <a href="#" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-dark-card hover:text-white transition-smooth">
                    <i class="fas fa-cog w-5"></i>
                    <span class="font-medium">設定</span>
                </a>
                <a href="#" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-dark-card hover:text-white transition-smooth">
                    <i class="fas fa-question-circle w-5"></i>
                    <span class="font-medium">ヘルプ</span>
                </a>
            </div>
            
            <!-- Version Info -->
            <div class="mt-8 px-4 py-3 glass rounded-lg">
                <p class="text-xs text-gray-500">Phase 4 - Day 3</p>
                <p class="text-xs text-gray-400 mt-1">進捗: 20% (2/10日)</p>
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
                <h2 class="text-3xl font-bold text-white">ダッシュボード</h2>
                <p class="text-gray-400 mt-1">2016-2025年のデータ分析 (1,043日分)</p>
            </div>
            <div class="flex items-center space-x-4">
                <div class="glass px-4 py-2 rounded-lg">
                    <i class="fas fa-calendar-alt text-blue-400 mr-2"></i>
                    <span class="text-sm text-gray-300">2025年12月30日</span>
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
            <!-- Card 1: 回収率 -->
            <div class="glass rounded-xl p-6 hover-glow transition-smooth animate-fade-in-up delay-100">
                <div class="flex items-center justify-between mb-4">
                    <div class="text-gray-400 text-sm font-medium">回収率</div>
                    <div class="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                        <i class="fas fa-coins text-green-400"></i>
                    </div>
                </div>
                <div class="text-4xl font-bold text-white mb-2">128.5%</div>
                <div class="flex items-center text-sm">
                    <i class="fas fa-arrow-up text-green-400 mr-1"></i>
                    <span class="text-green-400 font-medium">+8.3%</span>
                    <span class="text-gray-500 ml-2">vs 先月</span>
                </div>
            </div>
            
            <!-- Card 2: 的中率 -->
            <div class="glass rounded-xl p-6 hover-glow transition-smooth animate-fade-in-up delay-200">
                <div class="flex items-center justify-between mb-4">
                    <div class="text-gray-400 text-sm font-medium">的中率</div>
                    <div class="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <i class="fas fa-bullseye text-blue-400"></i>
                    </div>
                </div>
                <div class="text-4xl font-bold text-white mb-2">35.2%</div>
                <div class="flex items-center text-sm">
                    <i class="fas fa-arrow-up text-green-400 mr-1"></i>
                    <span class="text-green-400 font-medium">+2.1%</span>
                    <span class="text-gray-500 ml-2">vs 先月</span>
                </div>
            </div>
            
            <!-- Card 3: ROI -->
            <div class="glass rounded-xl p-6 hover-glow transition-smooth animate-fade-in-up delay-300">
                <div class="flex items-center justify-between mb-4">
                    <div class="text-gray-400 text-sm font-medium">ROI (投資収益率)</div>
                    <div class="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                        <i class="fas fa-chart-line text-purple-400"></i>
                    </div>
                </div>
                <div class="text-4xl font-bold text-white mb-2">+28.5%</div>
                <div class="flex items-center text-sm">
                    <i class="fas fa-arrow-up text-green-400 mr-1"></i>
                    <span class="text-green-400 font-medium">+5.2%</span>
                    <span class="text-gray-500 ml-2">vs 先月</span>
                </div>
            </div>
        </div>
        
        <!-- Chart Section -->
        <div class="glass rounded-xl p-6 mb-8 animate-fade-in-up delay-400">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h3 class="text-xl font-bold text-white">回収率推移 (月別)</h3>
                    <p class="text-sm text-gray-400 mt-1">2024年1月 - 2025年12月</p>
                </div>
                <div class="flex space-x-2">
                    <button class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-smooth">
                        月別
                    </button>
                    <button class="px-4 py-2 glass text-gray-400 rounded-lg text-sm font-medium hover:bg-dark-card transition-smooth">
                        週別
                    </button>
                    <button class="px-4 py-2 glass text-gray-400 rounded-lg text-sm font-medium hover:bg-dark-card transition-smooth">
                        日別
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
                    <h3 class="text-xl font-bold text-white">最近のレース結果</h3>
                    <p class="text-sm text-gray-400 mt-1">全10,430レースから表示</p>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="relative">
                        <input type="text" placeholder="検索..." 
                               class="bg-dark-card border border-dark-border rounded-lg px-4 py-2 pl-10 text-sm text-gray-300 focus:outline-none focus:border-blue-500 transition-smooth w-64">
                        <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                    </div>
                    <button class="px-4 py-2 glass text-gray-400 rounded-lg text-sm font-medium hover:bg-dark-card transition-smooth">
                        <i class="fas fa-filter mr-2"></i>フィルター
                    </button>
                </div>
            </div>
            
            <!-- Table -->
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="border-b border-dark-border">
                            <th class="text-left py-4 px-4 text-sm font-semibold text-gray-400">日付</th>
                            <th class="text-left py-4 px-4 text-sm font-semibold text-gray-400">競馬場</th>
                            <th class="text-left py-4 px-4 text-sm font-semibold text-gray-400">レース</th>
                            <th class="text-left py-4 px-4 text-sm font-semibold text-gray-400">距離</th>
                            <th class="text-left py-4 px-4 text-sm font-semibold text-gray-400">馬場</th>
                            <th class="text-left py-4 px-4 text-sm font-semibold text-gray-400">回収率</th>
                            <th class="text-left py-4 px-4 text-sm font-semibold text-gray-400">的中</th>
                            <th class="text-right py-4 px-4 text-sm font-semibold text-gray-400">操作</th>
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
                    1-10 / 10,430 レース
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
    { date: '2025-12-29', track: '東京', race: '1R', distance: '1600m', condition: '良', recovery: 145.2, hit: true },
    { date: '2025-12-29', track: '東京', race: '2R', distance: '2000m', condition: '良', recovery: 98.5, hit: false },
    { date: '2025-12-29', track: '中山', race: '1R', distance: '1200m', condition: '稍重', recovery: 132.8, hit: true },
    { date: '2025-12-28', track: '阪神', race: '3R', distance: '1800m', condition: '良', recovery: 156.3, hit: true },
    { date: '2025-12-28', track: '東京', race: '5R', distance: '2400m', condition: '良', recovery: 89.2, hit: false },
    { date: '2025-12-28', track: '中山', race: '7R', distance: '1600m', condition: '良', recovery: 142.1, hit: true },
    { date: '2025-12-27', track: '阪神', race: '2R', distance: '1400m', condition: '重', recovery: 178.5, hit: true },
    { date: '2025-12-27', track: '東京', race: '4R', distance: '1800m', condition: '良', recovery: 95.6, hit: false },
    { date: '2025-12-27', track: '中山', race: '6R', distance: '2000m', condition: '稍重', recovery: 125.3, hit: true },
    { date: '2025-12-26', track: '阪神', race: '8R', distance: '1600m', condition: '良', recovery: 162.7, hit: true },
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
            ? '<span class="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs font-medium">的中</span>'
            : '<span class="px-2 py-1 bg-gray-600/20 text-gray-400 rounded text-xs font-medium">不的中</span>';
        
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
                    <i class="fas fa-eye mr-1"></i>詳細
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
            labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            datasets: [{
                label: '回収率 (%)',
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
                            return '回収率: ' + context.parsed.y + '%';
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
</html>`));const vn=new de,Yc=Object.assign({"/src/index.tsx":Ht});let Xa=!1;for(const[,i]of Object.entries(Yc))i&&(vn.route("/",i),vn.notFound(i.notFoundHandler),Xa=!0);if(!Xa)throw new Error("Can't import modules from ['/src/index.tsx','/app/server.ts']");const Qa=(i,t,e)=>{const s=i instanceof RegExp?En(i,e):i,r=t instanceof RegExp?En(t,e):t,n=s!==null&&r!=null&&Zc(s,r,e);return n&&{start:n[0],end:n[1],pre:e.slice(0,n[0]),body:e.slice(n[0]+s.length,n[1]),post:e.slice(n[1]+r.length)}},En=(i,t)=>{const e=t.match(i);return e?e[0]:null},Zc=(i,t,e)=>{let s,r,n,o,c,l=e.indexOf(i),d=e.indexOf(t,l+1),h=l;if(l>=0&&d>0){if(i===t)return[l,d];for(s=[],n=e.length;h>=0&&!c;){if(h===l)s.push(h),l=e.indexOf(i,h+1);else if(s.length===1){const f=s.pop();f!==void 0&&(c=[f,d])}else r=s.pop(),r!==void 0&&r<n&&(n=r,o=d),d=e.indexOf(t,h+1);h=l<d&&l>=0?l:d}s.length&&o!==void 0&&(c=[n,o])}return c},to="\0SLASH"+Math.random()+"\0",eo="\0OPEN"+Math.random()+"\0",en="\0CLOSE"+Math.random()+"\0",so="\0COMMA"+Math.random()+"\0",io="\0PERIOD"+Math.random()+"\0",Xc=new RegExp(to,"g"),Qc=new RegExp(eo,"g"),tl=new RegExp(en,"g"),el=new RegExp(so,"g"),sl=new RegExp(io,"g"),il=/\\\\/g,rl=/\\{/g,nl=/\\}/g,al=/\\,/g,ol=/\\./g;function pr(i){return isNaN(i)?i.charCodeAt(0):parseInt(i,10)}function cl(i){return i.replace(il,to).replace(rl,eo).replace(nl,en).replace(al,so).replace(ol,io)}function ll(i){return i.replace(Xc,"\\").replace(Qc,"{").replace(tl,"}").replace(el,",").replace(sl,".")}function ro(i){if(!i)return[""];const t=[],e=Qa("{","}",i);if(!e)return i.split(",");const{pre:s,body:r,post:n}=e,o=s.split(",");o[o.length-1]+="{"+r+"}";const c=ro(n);return n.length&&(o[o.length-1]+=c.shift(),o.push.apply(o,c)),t.push.apply(t,o),t}function dl(i){return i?(i.slice(0,2)==="{}"&&(i="\\{\\}"+i.slice(2)),Bs(cl(i),!0).map(ll)):[]}function hl(i){return"{"+i+"}"}function fl(i){return/^-?0\d/.test(i)}function ul(i,t){return i<=t}function pl(i,t){return i>=t}function Bs(i,t){const e=[],s=Qa("{","}",i);if(!s)return[i];const r=s.pre,n=s.post.length?Bs(s.post,!1):[""];if(/\$$/.test(s.pre))for(let o=0;o<n.length;o++){const c=r+"{"+s.body+"}"+n[o];e.push(c)}else{const o=/^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(s.body),c=/^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(s.body),l=o||c,d=s.body.indexOf(",")>=0;if(!l&&!d)return s.post.match(/,(?!,).*\}/)?(i=s.pre+"{"+s.body+en+s.post,Bs(i)):[i];let h;if(l)h=s.body.split(/\.\./);else if(h=ro(s.body),h.length===1&&h[0]!==void 0&&(h=Bs(h[0],!1).map(hl),h.length===1))return n.map(u=>s.pre+h[0]+u);let f;if(l&&h[0]!==void 0&&h[1]!==void 0){const u=pr(h[0]),g=pr(h[1]),y=Math.max(h[0].length,h[1].length);let b=h.length===3&&h[2]!==void 0?Math.abs(pr(h[2])):1,E=ul;g<u&&(b*=-1,E=pl);const k=h.some(fl);f=[];for(let S=u;E(S,g);S+=b){let _;if(c)_=String.fromCharCode(S),_==="\\"&&(_="");else if(_=String(S),k){const T=y-_.length;if(T>0){const Y=new Array(T+1).join("0");S<0?_="-"+Y+_.slice(1):_=Y+_}}f.push(_)}}else{f=[];for(let u=0;u<h.length;u++)f.push.apply(f,Bs(h[u],!1))}for(let u=0;u<f.length;u++)for(let g=0;g<n.length;g++){const y=r+f[u]+n[g];(!t||l||y)&&e.push(y)}}return e}const ml=1024*64,Xi=i=>{if(typeof i!="string")throw new TypeError("invalid pattern");if(i.length>ml)throw new TypeError("pattern is too long")},gl={"[:alnum:]":["\\p{L}\\p{Nl}\\p{Nd}",!0],"[:alpha:]":["\\p{L}\\p{Nl}",!0],"[:ascii:]":["\\x00-\\x7f",!1],"[:blank:]":["\\p{Zs}\\t",!0],"[:cntrl:]":["\\p{Cc}",!0],"[:digit:]":["\\p{Nd}",!0],"[:graph:]":["\\p{Z}\\p{C}",!0,!0],"[:lower:]":["\\p{Ll}",!0],"[:print:]":["\\p{C}",!0],"[:punct:]":["\\p{P}",!0],"[:space:]":["\\p{Z}\\t\\r\\n\\v\\f",!0],"[:upper:]":["\\p{Lu}",!0],"[:word:]":["\\p{L}\\p{Nl}\\p{Nd}\\p{Pc}",!0],"[:xdigit:]":["A-Fa-f0-9",!1]},Fs=i=>i.replace(/[[\]\\-]/g,"\\$&"),bl=i=>i.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&"),Sn=i=>i.join(""),yl=(i,t)=>{const e=t;if(i.charAt(e)!=="[")throw new Error("not in a brace expression");const s=[],r=[];let n=e+1,o=!1,c=!1,l=!1,d=!1,h=e,f="";t:for(;n<i.length;){const b=i.charAt(n);if((b==="!"||b==="^")&&n===e+1){d=!0,n++;continue}if(b==="]"&&o&&!l){h=n+1;break}if(o=!0,b==="\\"&&!l){l=!0,n++;continue}if(b==="["&&!l){for(const[E,[v,k,S]]of Object.entries(gl))if(i.startsWith(E,n)){if(f)return["$.",!1,i.length-e,!0];n+=E.length,S?r.push(v):s.push(v),c=c||k;continue t}}if(l=!1,f){b>f?s.push(Fs(f)+"-"+Fs(b)):b===f&&s.push(Fs(b)),f="",n++;continue}if(i.startsWith("-]",n+1)){s.push(Fs(b+"-")),n+=2;continue}if(i.startsWith("-",n+1)){f=b,n+=2;continue}s.push(Fs(b)),n++}if(h<n)return["",!1,0,!1];if(!s.length&&!r.length)return["$.",!1,i.length-e,!0];if(r.length===0&&s.length===1&&/^\\?.$/.test(s[0])&&!d){const b=s[0].length===2?s[0].slice(-1):s[0];return[bl(b),!1,h-e,!1]}const u="["+(d?"^":"")+Sn(s)+"]",g="["+(d?"":"^")+Sn(r)+"]";return[s.length&&r.length?"("+u+"|"+g+")":s.length?u:g,c,h-e,!0]},Le=(i,{windowsPathsNoEscape:t=!1,magicalBraces:e=!0}={})=>e?t?i.replace(/\[([^\/\\])\]/g,"$1"):i.replace(/((?!\\).|^)\[([^\/\\])\]/g,"$1$2").replace(/\\([^\/])/g,"$1"):t?i.replace(/\[([^\/\\{}])\]/g,"$1"):i.replace(/((?!\\).|^)\[([^\/\\{}])\]/g,"$1$2").replace(/\\([^\/{}])/g,"$1"),xl=new Set(["!","?","+","*","@"]),kn=i=>xl.has(i),wl="(?!(?:^|/)\\.\\.?(?:$|/))",Oi="(?!\\.)",vl=new Set(["[","."]),El=new Set(["..","."]),Sl=new Set("().*{}+?[]^$\\!"),kl=i=>i.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&"),sn="[^/]",Cn=sn+"*?",_n=sn+"+?";var P,q,se,M,D,Se,qe,ke,qt,Ge,ei,is,no,Oe,Hi,Fr,ao;const it=class it{constructor(t,e,s={}){w(this,is);m(this,"type");w(this,P);w(this,q);w(this,se,!1);w(this,M,[]);w(this,D);w(this,Se);w(this,qe);w(this,ke,!1);w(this,qt);w(this,Ge);w(this,ei,!1);this.type=t,t&&p(this,q,!0),p(this,D,e),p(this,P,a(this,D)?a(a(this,D),P):this),p(this,qt,a(this,P)===this?s:a(a(this,P),qt)),p(this,qe,a(this,P)===this?[]:a(a(this,P),qe)),t==="!"&&!a(a(this,P),ke)&&a(this,qe).push(this),p(this,Se,a(this,D)?a(a(this,D),M).length:0)}get hasMagic(){if(a(this,q)!==void 0)return a(this,q);for(const t of a(this,M))if(typeof t!="string"&&(t.type||t.hasMagic))return p(this,q,!0);return a(this,q)}toString(){return a(this,Ge)!==void 0?a(this,Ge):this.type?p(this,Ge,this.type+"("+a(this,M).map(t=>String(t)).join("|")+")"):p(this,Ge,a(this,M).map(t=>String(t)).join(""))}push(...t){for(const e of t)if(e!==""){if(typeof e!="string"&&!(e instanceof it&&a(e,D)===this))throw new Error("invalid part: "+e);a(this,M).push(e)}}toJSON(){var e;const t=this.type===null?a(this,M).slice().map(s=>typeof s=="string"?s:s.toJSON()):[this.type,...a(this,M).map(s=>s.toJSON())];return this.isStart()&&!this.type&&t.unshift([]),this.isEnd()&&(this===a(this,P)||a(a(this,P),ke)&&((e=a(this,D))==null?void 0:e.type)==="!")&&t.push({}),t}isStart(){var e;if(a(this,P)===this)return!0;if(!((e=a(this,D))!=null&&e.isStart()))return!1;if(a(this,Se)===0)return!0;const t=a(this,D);for(let s=0;s<a(this,Se);s++){const r=a(t,M)[s];if(!(r instanceof it&&r.type==="!"))return!1}return!0}isEnd(){var e,s,r;if(a(this,P)===this||((e=a(this,D))==null?void 0:e.type)==="!")return!0;if(!((s=a(this,D))!=null&&s.isEnd()))return!1;if(!this.type)return(r=a(this,D))==null?void 0:r.isEnd();const t=a(this,D)?a(a(this,D),M).length:0;return a(this,Se)===t-1}copyIn(t){typeof t=="string"?this.push(t):this.push(t.clone(this))}clone(t){const e=new it(this.type,t);for(const s of a(this,M))e.copyIn(s);return e}static fromGlob(t,e={}){var r;const s=new it(null,void 0,e);return x(r=it,Oe,Hi).call(r,t,s,0,e),s}toMMPattern(){if(this!==a(this,P))return a(this,P).toMMPattern();const t=this.toString(),[e,s,r,n]=this.toRegExpSource();if(!(r||a(this,q)||a(this,qt).nocase&&!a(this,qt).nocaseMagicOnly&&t.toUpperCase()!==t.toLowerCase()))return s;const c=(a(this,qt).nocase?"i":"")+(n?"u":"");return Object.assign(new RegExp(`^${e}$`,c),{_src:e,_glob:t})}get options(){return a(this,qt)}toRegExpSource(t){var l;const e=t??!!a(this,qt).dot;if(a(this,P)===this&&x(this,is,no).call(this),!this.type){const d=this.isStart()&&this.isEnd()&&!a(this,M).some(y=>typeof y!="string"),h=a(this,M).map(y=>{var S;const[b,E,v,k]=typeof y=="string"?x(S=it,Oe,ao).call(S,y,a(this,q),d):y.toRegExpSource(t);return p(this,q,a(this,q)||v),p(this,se,a(this,se)||k),b}).join("");let f="";if(this.isStart()&&typeof a(this,M)[0]=="string"&&!(a(this,M).length===1&&El.has(a(this,M)[0]))){const b=vl,E=e&&b.has(h.charAt(0))||h.startsWith("\\.")&&b.has(h.charAt(2))||h.startsWith("\\.\\.")&&b.has(h.charAt(4)),v=!e&&!t&&b.has(h.charAt(0));f=E?wl:v?Oi:""}let u="";return this.isEnd()&&a(a(this,P),ke)&&((l=a(this,D))==null?void 0:l.type)==="!"&&(u="(?:$|\\/)"),[f+h+u,Le(h),p(this,q,!!a(this,q)),a(this,se)]}const s=this.type==="*"||this.type==="+",r=this.type==="!"?"(?:(?!(?:":"(?:";let n=x(this,is,Fr).call(this,e);if(this.isStart()&&this.isEnd()&&!n&&this.type!=="!"){const d=this.toString();return p(this,M,[d]),this.type=null,p(this,q,void 0),[d,Le(this.toString()),!1,!1]}let o=!s||t||e||!Oi?"":x(this,is,Fr).call(this,!0);o===n&&(o=""),o&&(n=`(?:${n})(?:${o})*?`);let c="";if(this.type==="!"&&a(this,ei))c=(this.isStart()&&!e?Oi:"")+_n;else{const d=this.type==="!"?"))"+(this.isStart()&&!e&&!t?Oi:"")+Cn+")":this.type==="@"?")":this.type==="?"?")?":this.type==="+"&&o?")":this.type==="*"&&o?")?":`)${this.type}`;c=r+n+d}return[c,Le(n),p(this,q,!!a(this,q)),a(this,se)]}};P=new WeakMap,q=new WeakMap,se=new WeakMap,M=new WeakMap,D=new WeakMap,Se=new WeakMap,qe=new WeakMap,ke=new WeakMap,qt=new WeakMap,Ge=new WeakMap,ei=new WeakMap,is=new WeakSet,no=function(){if(this!==a(this,P))throw new Error("should only call on root");if(a(this,ke))return this;this.toString(),p(this,ke,!0);let t;for(;t=a(this,qe).pop();){if(t.type!=="!")continue;let e=t,s=a(e,D);for(;s;){for(let r=a(e,Se)+1;!s.type&&r<a(s,M).length;r++)for(const n of a(t,M)){if(typeof n=="string")throw new Error("string part in extglob AST??");n.copyIn(a(s,M)[r])}e=s,s=a(e,D)}}return this},Oe=new WeakSet,Hi=function(t,e,s,r){var g,y;let n=!1,o=!1,c=-1,l=!1;if(e.type===null){let b=s,E="";for(;b<t.length;){const v=t.charAt(b++);if(n||v==="\\"){n=!n,E+=v;continue}if(o){b===c+1?(v==="^"||v==="!")&&(l=!0):v==="]"&&!(b===c+2&&l)&&(o=!1),E+=v;continue}else if(v==="["){o=!0,c=b,l=!1,E+=v;continue}if(!r.noext&&kn(v)&&t.charAt(b)==="("){e.push(E),E="";const k=new it(v,e);b=x(g=it,Oe,Hi).call(g,t,k,b,r),e.push(k);continue}E+=v}return e.push(E),b}let d=s+1,h=new it(null,e);const f=[];let u="";for(;d<t.length;){const b=t.charAt(d++);if(n||b==="\\"){n=!n,u+=b;continue}if(o){d===c+1?(b==="^"||b==="!")&&(l=!0):b==="]"&&!(d===c+2&&l)&&(o=!1),u+=b;continue}else if(b==="["){o=!0,c=d,l=!1,u+=b;continue}if(kn(b)&&t.charAt(d)==="("){h.push(u),u="";const E=new it(b,h);h.push(E),d=x(y=it,Oe,Hi).call(y,t,E,d,r);continue}if(b==="|"){h.push(u),u="",f.push(h),h=new it(null,e);continue}if(b===")")return u===""&&a(e,M).length===0&&p(e,ei,!0),h.push(u),u="",e.push(...f,h),d;u+=b}return e.type=null,p(e,q,void 0),p(e,M,[t.substring(s-1)]),d},Fr=function(t){return a(this,M).map(e=>{if(typeof e=="string")throw new Error("string type in extglob ast??");const[s,r,n,o]=e.toRegExpSource(t);return p(this,se,a(this,se)||o),s}).filter(e=>!(this.isStart()&&this.isEnd())||!!e).join("|")},ao=function(t,e,s=!1){let r=!1,n="",o=!1;for(let c=0;c<t.length;c++){const l=t.charAt(c);if(r){r=!1,n+=(Sl.has(l)?"\\":"")+l;continue}if(l==="\\"){c===t.length-1?n+="\\\\":r=!0;continue}if(l==="["){const[d,h,f,u]=yl(t,c);if(f){n+=d,o=o||h,c+=f-1,e=e||u;continue}}if(l==="*"){n+=s&&t==="*"?_n:Cn,e=!0;continue}if(l==="?"){n+=sn,e=!0;continue}n+=kl(l)}return[n,Le(t),!!e,o]},w(it,Oe);let Qi=it;const rn=(i,{windowsPathsNoEscape:t=!1,magicalBraces:e=!1}={})=>e?t?i.replace(/[?*()[\]{}]/g,"[$&]"):i.replace(/[?*()[\]\\{}]/g,"\\$&"):t?i.replace(/[?*()[\]]/g,"[$&]"):i.replace(/[?*()[\]\\]/g,"\\$&");var mr={};const lt=(i,t,e={})=>(Xi(t),!e.nocomment&&t.charAt(0)==="#"?!1:new Ae(t,e).match(i)),Cl=/^\*+([^+@!?\*\[\(]*)$/,_l=i=>t=>!t.startsWith(".")&&t.endsWith(i),Tl=i=>t=>t.endsWith(i),Rl=i=>(i=i.toLowerCase(),t=>!t.startsWith(".")&&t.toLowerCase().endsWith(i)),jl=i=>(i=i.toLowerCase(),t=>t.toLowerCase().endsWith(i)),Ol=/^\*+\.\*+$/,Al=i=>!i.startsWith(".")&&i.includes("."),Ml=i=>i!=="."&&i!==".."&&i.includes("."),Il=/^\.\*+$/,Fl=i=>i!=="."&&i!==".."&&i.startsWith("."),Dl=/^\*+$/,$l=i=>i.length!==0&&!i.startsWith("."),Pl=i=>i.length!==0&&i!=="."&&i!=="..",Nl=/^\?+([^+@!?\*\[\(]*)?$/,Ll=([i,t=""])=>{const e=oo([i]);return t?(t=t.toLowerCase(),s=>e(s)&&s.toLowerCase().endsWith(t)):e},Bl=([i,t=""])=>{const e=co([i]);return t?(t=t.toLowerCase(),s=>e(s)&&s.toLowerCase().endsWith(t)):e},zl=([i,t=""])=>{const e=co([i]);return t?s=>e(s)&&s.endsWith(t):e},Hl=([i,t=""])=>{const e=oo([i]);return t?s=>e(s)&&s.endsWith(t):e},oo=([i])=>{const t=i.length;return e=>e.length===t&&!e.startsWith(".")},co=([i])=>{const t=i.length;return e=>e.length===t&&e!=="."&&e!==".."},lo=typeof process=="object"&&process?typeof mr=="object"&&mr&&mr.__MINIMATCH_TESTING_PLATFORM__||process.platform:"posix",Tn={win32:{sep:"\\"},posix:{sep:"/"}},Wl=lo==="win32"?Tn.win32.sep:Tn.posix.sep;lt.sep=Wl;const ct=Symbol("globstar **");lt.GLOBSTAR=ct;const Ul="[^/]",ql=Ul+"*?",Gl="(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?",Vl="(?:(?!(?:\\/|^)\\.).)*?",Kl=(i,t={})=>e=>lt(e,i,t);lt.filter=Kl;const xt=(i,t={})=>Object.assign({},i,t),Jl=i=>{if(!i||typeof i!="object"||!Object.keys(i).length)return lt;const t=lt;return Object.assign((s,r,n={})=>t(s,r,xt(i,n)),{Minimatch:class extends t.Minimatch{constructor(r,n={}){super(r,xt(i,n))}static defaults(r){return t.defaults(xt(i,r)).Minimatch}},AST:class extends t.AST{constructor(r,n,o={}){super(r,n,xt(i,o))}static fromGlob(r,n={}){return t.AST.fromGlob(r,xt(i,n))}},unescape:(s,r={})=>t.unescape(s,xt(i,r)),escape:(s,r={})=>t.escape(s,xt(i,r)),filter:(s,r={})=>t.filter(s,xt(i,r)),defaults:s=>t.defaults(xt(i,s)),makeRe:(s,r={})=>t.makeRe(s,xt(i,r)),braceExpand:(s,r={})=>t.braceExpand(s,xt(i,r)),match:(s,r,n={})=>t.match(s,r,xt(i,n)),sep:t.sep,GLOBSTAR:ct})};lt.defaults=Jl;const ho=(i,t={})=>(Xi(i),t.nobrace||!/\{(?:(?!\{).)*\}/.test(i)?[i]:dl(i));lt.braceExpand=ho;const Yl=(i,t={})=>new Ae(i,t).makeRe();lt.makeRe=Yl;const Zl=(i,t,e={})=>{const s=new Ae(t,e);return i=i.filter(r=>s.match(r)),s.options.nonull&&!i.length&&i.push(t),i};lt.match=Zl;const Rn=/[?*]|[+@!]\(.*?\)|\[|\]/,Xl=i=>i.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&");class Ae{constructor(t,e={}){m(this,"options");m(this,"set");m(this,"pattern");m(this,"windowsPathsNoEscape");m(this,"nonegate");m(this,"negate");m(this,"comment");m(this,"empty");m(this,"preserveMultipleSlashes");m(this,"partial");m(this,"globSet");m(this,"globParts");m(this,"nocase");m(this,"isWindows");m(this,"platform");m(this,"windowsNoMagicRoot");m(this,"regexp");Xi(t),e=e||{},this.options=e,this.pattern=t,this.platform=e.platform||lo,this.isWindows=this.platform==="win32",this.windowsPathsNoEscape=!!e.windowsPathsNoEscape||e.allowWindowsEscape===!1,this.windowsPathsNoEscape&&(this.pattern=this.pattern.replace(/\\/g,"/")),this.preserveMultipleSlashes=!!e.preserveMultipleSlashes,this.regexp=null,this.negate=!1,this.nonegate=!!e.nonegate,this.comment=!1,this.empty=!1,this.partial=!!e.partial,this.nocase=!!this.options.nocase,this.windowsNoMagicRoot=e.windowsNoMagicRoot!==void 0?e.windowsNoMagicRoot:!!(this.isWindows&&this.nocase),this.globSet=[],this.globParts=[],this.set=[],this.make()}hasMagic(){if(this.options.magicalBraces&&this.set.length>1)return!0;for(const t of this.set)for(const e of t)if(typeof e!="string")return!0;return!1}debug(...t){}make(){const t=this.pattern,e=this.options;if(!e.nocomment&&t.charAt(0)==="#"){this.comment=!0;return}if(!t){this.empty=!0;return}this.parseNegate(),this.globSet=[...new Set(this.braceExpand())],e.debug&&(this.debug=(...n)=>console.error(...n)),this.debug(this.pattern,this.globSet);const s=this.globSet.map(n=>this.slashSplit(n));this.globParts=this.preprocess(s),this.debug(this.pattern,this.globParts);let r=this.globParts.map((n,o,c)=>{if(this.isWindows&&this.windowsNoMagicRoot){const l=n[0]===""&&n[1]===""&&(n[2]==="?"||!Rn.test(n[2]))&&!Rn.test(n[3]),d=/^[a-z]:/i.test(n[0]);if(l)return[...n.slice(0,4),...n.slice(4).map(h=>this.parse(h))];if(d)return[n[0],...n.slice(1).map(h=>this.parse(h))]}return n.map(l=>this.parse(l))});if(this.debug(this.pattern,r),this.set=r.filter(n=>n.indexOf(!1)===-1),this.isWindows)for(let n=0;n<this.set.length;n++){const o=this.set[n];o[0]===""&&o[1]===""&&this.globParts[n][2]==="?"&&typeof o[3]=="string"&&/^[a-z]:$/i.test(o[3])&&(o[2]="?")}this.debug(this.pattern,this.set)}preprocess(t){if(this.options.noglobstar)for(let s=0;s<t.length;s++)for(let r=0;r<t[s].length;r++)t[s][r]==="**"&&(t[s][r]="*");const{optimizationLevel:e=1}=this.options;return e>=2?(t=this.firstPhasePreProcess(t),t=this.secondPhasePreProcess(t)):e>=1?t=this.levelOneOptimize(t):t=this.adjascentGlobstarOptimize(t),t}adjascentGlobstarOptimize(t){return t.map(e=>{let s=-1;for(;(s=e.indexOf("**",s+1))!==-1;){let r=s;for(;e[r+1]==="**";)r++;r!==s&&e.splice(s,r-s)}return e})}levelOneOptimize(t){return t.map(e=>(e=e.reduce((s,r)=>{const n=s[s.length-1];return r==="**"&&n==="**"?s:r===".."&&n&&n!==".."&&n!=="."&&n!=="**"?(s.pop(),s):(s.push(r),s)},[]),e.length===0?[""]:e))}levelTwoFileOptimize(t){Array.isArray(t)||(t=this.slashSplit(t));let e=!1;do{if(e=!1,!this.preserveMultipleSlashes){for(let r=1;r<t.length-1;r++){const n=t[r];r===1&&n===""&&t[0]===""||(n==="."||n==="")&&(e=!0,t.splice(r,1),r--)}t[0]==="."&&t.length===2&&(t[1]==="."||t[1]==="")&&(e=!0,t.pop())}let s=0;for(;(s=t.indexOf("..",s+1))!==-1;){const r=t[s-1];r&&r!=="."&&r!==".."&&r!=="**"&&(e=!0,t.splice(s-1,2),s-=2)}}while(e);return t.length===0?[""]:t}firstPhasePreProcess(t){let e=!1;do{e=!1;for(let s of t){let r=-1;for(;(r=s.indexOf("**",r+1))!==-1;){let o=r;for(;s[o+1]==="**";)o++;o>r&&s.splice(r+1,o-r);let c=s[r+1];const l=s[r+2],d=s[r+3];if(c!==".."||!l||l==="."||l===".."||!d||d==="."||d==="..")continue;e=!0,s.splice(r,1);const h=s.slice(0);h[r]="**",t.push(h),r--}if(!this.preserveMultipleSlashes){for(let o=1;o<s.length-1;o++){const c=s[o];o===1&&c===""&&s[0]===""||(c==="."||c==="")&&(e=!0,s.splice(o,1),o--)}s[0]==="."&&s.length===2&&(s[1]==="."||s[1]==="")&&(e=!0,s.pop())}let n=0;for(;(n=s.indexOf("..",n+1))!==-1;){const o=s[n-1];if(o&&o!=="."&&o!==".."&&o!=="**"){e=!0;const l=n===1&&s[n+1]==="**"?["."]:[];s.splice(n-1,2,...l),s.length===0&&s.push(""),n-=2}}}}while(e);return t}secondPhasePreProcess(t){for(let e=0;e<t.length-1;e++)for(let s=e+1;s<t.length;s++){const r=this.partsMatch(t[e],t[s],!this.preserveMultipleSlashes);if(r){t[e]=[],t[s]=r;break}}return t.filter(e=>e.length)}partsMatch(t,e,s=!1){let r=0,n=0,o=[],c="";for(;r<t.length&&n<e.length;)if(t[r]===e[n])o.push(c==="b"?e[n]:t[r]),r++,n++;else if(s&&t[r]==="**"&&e[n]===t[r+1])o.push(t[r]),r++;else if(s&&e[n]==="**"&&t[r]===e[n+1])o.push(e[n]),n++;else if(t[r]==="*"&&e[n]&&(this.options.dot||!e[n].startsWith("."))&&e[n]!=="**"){if(c==="b")return!1;c="a",o.push(t[r]),r++,n++}else if(e[n]==="*"&&t[r]&&(this.options.dot||!t[r].startsWith("."))&&t[r]!=="**"){if(c==="a")return!1;c="b",o.push(e[n]),r++,n++}else return!1;return t.length===e.length&&o}parseNegate(){if(this.nonegate)return;const t=this.pattern;let e=!1,s=0;for(let r=0;r<t.length&&t.charAt(r)==="!";r++)e=!e,s++;s&&(this.pattern=t.slice(s)),this.negate=e}matchOne(t,e,s=!1){const r=this.options;if(this.isWindows){const b=typeof t[0]=="string"&&/^[a-z]:$/i.test(t[0]),E=!b&&t[0]===""&&t[1]===""&&t[2]==="?"&&/^[a-z]:$/i.test(t[3]),v=typeof e[0]=="string"&&/^[a-z]:$/i.test(e[0]),k=!v&&e[0]===""&&e[1]===""&&e[2]==="?"&&typeof e[3]=="string"&&/^[a-z]:$/i.test(e[3]),S=E?3:b?0:void 0,_=k?3:v?0:void 0;if(typeof S=="number"&&typeof _=="number"){const[T,Y]=[t[S],e[_]];T.toLowerCase()===Y.toLowerCase()&&(e[_]=T,_>S?e=e.slice(_):S>_&&(t=t.slice(S)))}}const{optimizationLevel:n=1}=this.options;n>=2&&(t=this.levelTwoFileOptimize(t)),this.debug("matchOne",this,{file:t,pattern:e}),this.debug("matchOne",t.length,e.length);for(var o=0,c=0,l=t.length,d=e.length;o<l&&c<d;o++,c++){this.debug("matchOne loop");var h=e[c],f=t[o];if(this.debug(e,h,f),h===!1)return!1;if(h===ct){this.debug("GLOBSTAR",[e,h,f]);var u=o,g=c+1;if(g===d){for(this.debug("** at the end");o<l;o++)if(t[o]==="."||t[o]===".."||!r.dot&&t[o].charAt(0)===".")return!1;return!0}for(;u<l;){var y=t[u];if(this.debug(`
globstar while`,t,u,e,g,y),this.matchOne(t.slice(u),e.slice(g),s))return this.debug("globstar found match!",u,l,y),!0;if(y==="."||y===".."||!r.dot&&y.charAt(0)==="."){this.debug("dot detected!",t,u,e,g);break}this.debug("globstar swallow a segment, and continue"),u++}return!!(s&&(this.debug(`
>>> no match, partial?`,t,u,e,g),u===l))}let b;if(typeof h=="string"?(b=f===h,this.debug("string match",h,f,b)):(b=h.test(f),this.debug("pattern match",h,f,b)),!b)return!1}if(o===l&&c===d)return!0;if(o===l)return s;if(c===d)return o===l-1&&t[o]==="";throw new Error("wtf?")}braceExpand(){return ho(this.pattern,this.options)}parse(t){Xi(t);const e=this.options;if(t==="**")return ct;if(t==="")return"";let s,r=null;(s=t.match(Dl))?r=e.dot?Pl:$l:(s=t.match(Cl))?r=(e.nocase?e.dot?jl:Rl:e.dot?Tl:_l)(s[1]):(s=t.match(Nl))?r=(e.nocase?e.dot?Bl:Ll:e.dot?zl:Hl)(s):(s=t.match(Ol))?r=e.dot?Ml:Al:(s=t.match(Il))&&(r=Fl);const n=Qi.fromGlob(t,this.options).toMMPattern();return r&&typeof n=="object"&&Reflect.defineProperty(n,"test",{value:r}),n}makeRe(){if(this.regexp||this.regexp===!1)return this.regexp;const t=this.set;if(!t.length)return this.regexp=!1,this.regexp;const e=this.options,s=e.noglobstar?ql:e.dot?Gl:Vl,r=new Set(e.nocase?["i"]:[]);let n=t.map(l=>{const d=l.map(f=>{if(f instanceof RegExp)for(const u of f.flags.split(""))r.add(u);return typeof f=="string"?Xl(f):f===ct?ct:f._src});d.forEach((f,u)=>{const g=d[u+1],y=d[u-1];f!==ct||y===ct||(y===void 0?g!==void 0&&g!==ct?d[u+1]="(?:\\/|"+s+"\\/)?"+g:d[u]=s:g===void 0?d[u-1]=y+"(?:\\/|\\/"+s+")?":g!==ct&&(d[u-1]=y+"(?:\\/|\\/"+s+"\\/)"+g,d[u+1]=ct))});const h=d.filter(f=>f!==ct);if(this.partial&&h.length>=1){const f=[];for(let u=1;u<=h.length;u++)f.push(h.slice(0,u).join("/"));return"(?:"+f.join("|")+")"}return h.join("/")}).join("|");const[o,c]=t.length>1?["(?:",")"]:["",""];n="^"+o+n+c+"$",this.partial&&(n="^(?:\\/|"+o+n.slice(1,-1)+c+")$"),this.negate&&(n="^(?!"+n+").+$");try{this.regexp=new RegExp(n,[...r].join(""))}catch{this.regexp=!1}return this.regexp}slashSplit(t){return this.preserveMultipleSlashes?t.split("/"):this.isWindows&&/^\/\/[^\/]+/.test(t)?["",...t.split(/\/+/)]:t.split(/\/+/)}match(t,e=this.partial){if(this.debug("match",t,this.pattern),this.comment)return!1;if(this.empty)return t==="";if(t==="/"&&e)return!0;const s=this.options;this.isWindows&&(t=t.split("\\").join("/"));const r=this.slashSplit(t);this.debug(this.pattern,"split",r);const n=this.set;this.debug(this.pattern,"set",n);let o=r[r.length-1];if(!o)for(let c=r.length-2;!o&&c>=0;c--)o=r[c];for(let c=0;c<n.length;c++){const l=n[c];let d=r;if(s.matchBase&&l.length===1&&(d=[o]),this.matchOne(d,l,e))return s.flipNegate?!0:!this.negate}return s.flipNegate?!1:this.negate}static defaults(t){return lt.defaults(t).Minimatch}}lt.AST=Qi;lt.Minimatch=Ae;lt.escape=rn;lt.unescape=Le;const Ql=typeof performance=="object"&&performance&&typeof performance.now=="function"?performance:Date,fo=new Set,Dr=typeof process=="object"&&process?process:{},uo=(i,t,e,s)=>{typeof Dr.emitWarning=="function"?Dr.emitWarning(i,t,e,s):console.error(`[${e}] ${t}: ${i}`)};let tr=globalThis.AbortController,jn=globalThis.AbortSignal;var oa;if(typeof tr>"u"){jn=class{constructor(){m(this,"onabort");m(this,"_onabort",[]);m(this,"reason");m(this,"aborted",!1)}addEventListener(s,r){this._onabort.push(r)}},tr=class{constructor(){m(this,"signal",new jn);t()}abort(s){var r,n;if(!this.signal.aborted){this.signal.reason=s,this.signal.aborted=!0;for(const o of this.signal._onabort)o(s);(n=(r=this.signal).onabort)==null||n.call(r,s)}}};let i=((oa=Dr.env)==null?void 0:oa.LRU_CACHE_IGNORE_AC_WARNING)!=="1";const t=()=>{i&&(i=!1,uo("AbortController is not defined. If using lru-cache in node 14, load an AbortController polyfill from the `node-abort-controller` package. A minimal polyfill is provided for use by LRUCache.fetch(), but it should not be relied upon in other contexts (eg, passing it to other APIs that use AbortController/AbortSignal might have undesirable effects). You may disable this with LRU_CACHE_IGNORE_AC_WARNING=1 in the env.","NO_ABORT_CONTROLLER","ENOTSUP",t))}}const td=i=>!fo.has(i),ue=i=>i&&i===Math.floor(i)&&i>0&&isFinite(i),po=i=>ue(i)?i<=Math.pow(2,8)?Uint8Array:i<=Math.pow(2,16)?Uint16Array:i<=Math.pow(2,32)?Uint32Array:i<=Number.MAX_SAFE_INTEGER?Wi:null:null;class Wi extends Array{constructor(t){super(t),this.fill(0)}}var ys;const Ne=class Ne{constructor(t,e){m(this,"heap");m(this,"length");if(!a(Ne,ys))throw new TypeError("instantiate Stack using Stack.create(n)");this.heap=new e(t),this.length=0}static create(t){const e=po(t);if(!e)return[];p(Ne,ys,!0);const s=new Ne(t,e);return p(Ne,ys,!1),s}push(t){this.heap[this.length++]=t}pop(){return this.heap[--this.length]}};ys=new WeakMap,w(Ne,ys,!1);let $r=Ne;var ca,la,Et,ft,It,Ve,Ft,xs,ws,Dt,N,$t,$,I,O,nt,ut,tt,G,Pt,V,Nt,Lt,pt,mt,Bt,Ce,at,vs,C,Pr,Ke,ie,si,gt,mo,Je,Es,ii,pe,me,Nr,Ui,qi,A,Lr,zs,ge,Br;const fn=class fn{constructor(t){w(this,C);w(this,Et);w(this,ft);w(this,It);w(this,Ve);w(this,Ft);w(this,xs);w(this,ws);w(this,Dt);m(this,"ttl");m(this,"ttlResolution");m(this,"ttlAutopurge");m(this,"updateAgeOnGet");m(this,"updateAgeOnHas");m(this,"allowStale");m(this,"noDisposeOnSet");m(this,"noUpdateTTL");m(this,"maxEntrySize");m(this,"sizeCalculation");m(this,"noDeleteOnFetchRejection");m(this,"noDeleteOnStaleGet");m(this,"allowStaleOnFetchAbort");m(this,"allowStaleOnFetchRejection");m(this,"ignoreFetchAbort");w(this,N);w(this,$t);w(this,$);w(this,I);w(this,O);w(this,nt);w(this,ut);w(this,tt);w(this,G);w(this,Pt);w(this,V);w(this,Nt);w(this,Lt);w(this,pt);w(this,mt);w(this,Bt);w(this,Ce);w(this,at);w(this,vs);w(this,Ke,()=>{});w(this,ie,()=>{});w(this,si,()=>{});w(this,gt,()=>!1);w(this,Je,t=>{});w(this,Es,(t,e,s)=>{});w(this,ii,(t,e,s,r)=>{if(s||r)throw new TypeError("cannot set size without setting maxSize or maxEntrySize on cache");return 0});m(this,ca,"LRUCache");const{max:e=0,ttl:s,ttlResolution:r=1,ttlAutopurge:n,updateAgeOnGet:o,updateAgeOnHas:c,allowStale:l,dispose:d,onInsert:h,disposeAfter:f,noDisposeOnSet:u,noUpdateTTL:g,maxSize:y=0,maxEntrySize:b=0,sizeCalculation:E,fetchMethod:v,memoMethod:k,noDeleteOnFetchRejection:S,noDeleteOnStaleGet:_,allowStaleOnFetchRejection:T,allowStaleOnFetchAbort:Y,ignoreFetchAbort:Tt,perf:yt}=t;if(yt!==void 0&&typeof(yt==null?void 0:yt.now)!="function")throw new TypeError("perf option must have a now() method if specified");if(p(this,Dt,yt??Ql),e!==0&&!ue(e))throw new TypeError("max option must be a nonnegative integer");const Z=e?po(e):Array;if(!Z)throw new Error("invalid max value: "+e);if(p(this,Et,e),p(this,ft,y),this.maxEntrySize=b||a(this,ft),this.sizeCalculation=E,this.sizeCalculation){if(!a(this,ft)&&!this.maxEntrySize)throw new TypeError("cannot set sizeCalculation without setting maxSize or maxEntrySize");if(typeof this.sizeCalculation!="function")throw new TypeError("sizeCalculation set to non-function")}if(k!==void 0&&typeof k!="function")throw new TypeError("memoMethod must be a function if defined");if(p(this,ws,k),v!==void 0&&typeof v!="function")throw new TypeError("fetchMethod must be a function if specified");if(p(this,xs,v),p(this,Ce,!!v),p(this,$,new Map),p(this,I,new Array(e).fill(void 0)),p(this,O,new Array(e).fill(void 0)),p(this,nt,new Z(e)),p(this,ut,new Z(e)),p(this,tt,0),p(this,G,0),p(this,Pt,$r.create(e)),p(this,N,0),p(this,$t,0),typeof d=="function"&&p(this,It,d),typeof h=="function"&&p(this,Ve,h),typeof f=="function"?(p(this,Ft,f),p(this,V,[])):(p(this,Ft,void 0),p(this,V,void 0)),p(this,Bt,!!a(this,It)),p(this,vs,!!a(this,Ve)),p(this,at,!!a(this,Ft)),this.noDisposeOnSet=!!u,this.noUpdateTTL=!!g,this.noDeleteOnFetchRejection=!!S,this.allowStaleOnFetchRejection=!!T,this.allowStaleOnFetchAbort=!!Y,this.ignoreFetchAbort=!!Tt,this.maxEntrySize!==0){if(a(this,ft)!==0&&!ue(a(this,ft)))throw new TypeError("maxSize must be a positive integer if specified");if(!ue(this.maxEntrySize))throw new TypeError("maxEntrySize must be a positive integer if specified");x(this,C,mo).call(this)}if(this.allowStale=!!l,this.noDeleteOnStaleGet=!!_,this.updateAgeOnGet=!!o,this.updateAgeOnHas=!!c,this.ttlResolution=ue(r)||r===0?r:1,this.ttlAutopurge=!!n,this.ttl=s||0,this.ttl){if(!ue(this.ttl))throw new TypeError("ttl must be a positive integer if specified");x(this,C,Pr).call(this)}if(a(this,Et)===0&&this.ttl===0&&a(this,ft)===0)throw new TypeError("At least one of max, maxSize, or ttl is required");if(!this.ttlAutopurge&&!a(this,Et)&&!a(this,ft)){const he="LRU_CACHE_UNBOUNDED";td(he)&&(fo.add(he),uo("TTL caching without ttlAutopurge, max, or maxSize can result in unbounded memory consumption.","UnboundedCacheWarning",he,fn))}}get perf(){return a(this,Dt)}static unsafeExposeInternals(t){return{starts:a(t,Lt),ttls:a(t,pt),autopurgeTimers:a(t,mt),sizes:a(t,Nt),keyMap:a(t,$),keyList:a(t,I),valList:a(t,O),next:a(t,nt),prev:a(t,ut),get head(){return a(t,tt)},get tail(){return a(t,G)},free:a(t,Pt),isBackgroundFetch:e=>{var s;return x(s=t,C,A).call(s,e)},backgroundFetch:(e,s,r,n)=>{var o;return x(o=t,C,qi).call(o,e,s,r,n)},moveToTail:e=>{var s;return x(s=t,C,zs).call(s,e)},indexes:e=>{var s;return x(s=t,C,pe).call(s,e)},rindexes:e=>{var s;return x(s=t,C,me).call(s,e)},isStale:e=>{var s;return a(s=t,gt).call(s,e)}}}get max(){return a(this,Et)}get maxSize(){return a(this,ft)}get calculatedSize(){return a(this,$t)}get size(){return a(this,N)}get fetchMethod(){return a(this,xs)}get memoMethod(){return a(this,ws)}get dispose(){return a(this,It)}get onInsert(){return a(this,Ve)}get disposeAfter(){return a(this,Ft)}getRemainingTTL(t){return a(this,$).has(t)?1/0:0}*entries(){for(const t of x(this,C,pe).call(this))a(this,O)[t]!==void 0&&a(this,I)[t]!==void 0&&!x(this,C,A).call(this,a(this,O)[t])&&(yield[a(this,I)[t],a(this,O)[t]])}*rentries(){for(const t of x(this,C,me).call(this))a(this,O)[t]!==void 0&&a(this,I)[t]!==void 0&&!x(this,C,A).call(this,a(this,O)[t])&&(yield[a(this,I)[t],a(this,O)[t]])}*keys(){for(const t of x(this,C,pe).call(this)){const e=a(this,I)[t];e!==void 0&&!x(this,C,A).call(this,a(this,O)[t])&&(yield e)}}*rkeys(){for(const t of x(this,C,me).call(this)){const e=a(this,I)[t];e!==void 0&&!x(this,C,A).call(this,a(this,O)[t])&&(yield e)}}*values(){for(const t of x(this,C,pe).call(this))a(this,O)[t]!==void 0&&!x(this,C,A).call(this,a(this,O)[t])&&(yield a(this,O)[t])}*rvalues(){for(const t of x(this,C,me).call(this))a(this,O)[t]!==void 0&&!x(this,C,A).call(this,a(this,O)[t])&&(yield a(this,O)[t])}[(la=Symbol.iterator,ca=Symbol.toStringTag,la)](){return this.entries()}find(t,e={}){for(const s of x(this,C,pe).call(this)){const r=a(this,O)[s],n=x(this,C,A).call(this,r)?r.__staleWhileFetching:r;if(n!==void 0&&t(n,a(this,I)[s],this))return this.get(a(this,I)[s],e)}}forEach(t,e=this){for(const s of x(this,C,pe).call(this)){const r=a(this,O)[s],n=x(this,C,A).call(this,r)?r.__staleWhileFetching:r;n!==void 0&&t.call(e,n,a(this,I)[s],this)}}rforEach(t,e=this){for(const s of x(this,C,me).call(this)){const r=a(this,O)[s],n=x(this,C,A).call(this,r)?r.__staleWhileFetching:r;n!==void 0&&t.call(e,n,a(this,I)[s],this)}}purgeStale(){let t=!1;for(const e of x(this,C,me).call(this,{allowStale:!0}))a(this,gt).call(this,e)&&(x(this,C,ge).call(this,a(this,I)[e],"expire"),t=!0);return t}info(t){const e=a(this,$).get(t);if(e===void 0)return;const s=a(this,O)[e],r=x(this,C,A).call(this,s)?s.__staleWhileFetching:s;if(r===void 0)return;const n={value:r};if(a(this,pt)&&a(this,Lt)){const o=a(this,pt)[e],c=a(this,Lt)[e];if(o&&c){const l=o-(a(this,Dt).now()-c);n.ttl=l,n.start=Date.now()}}return a(this,Nt)&&(n.size=a(this,Nt)[e]),n}dump(){const t=[];for(const e of x(this,C,pe).call(this,{allowStale:!0})){const s=a(this,I)[e],r=a(this,O)[e],n=x(this,C,A).call(this,r)?r.__staleWhileFetching:r;if(n===void 0||s===void 0)continue;const o={value:n};if(a(this,pt)&&a(this,Lt)){o.ttl=a(this,pt)[e];const c=a(this,Dt).now()-a(this,Lt)[e];o.start=Math.floor(Date.now()-c)}a(this,Nt)&&(o.size=a(this,Nt)[e]),t.unshift([s,o])}return t}load(t){this.clear();for(const[e,s]of t){if(s.start){const r=Date.now()-s.start;s.start=a(this,Dt).now()-r}this.set(e,s.value,s)}}set(t,e,s={}){var u,g,y,b,E,v,k;if(e===void 0)return this.delete(t),this;const{ttl:r=this.ttl,start:n,noDisposeOnSet:o=this.noDisposeOnSet,sizeCalculation:c=this.sizeCalculation,status:l}=s;let{noUpdateTTL:d=this.noUpdateTTL}=s;const h=a(this,ii).call(this,t,e,s.size||0,c);if(this.maxEntrySize&&h>this.maxEntrySize)return l&&(l.set="miss",l.maxEntrySizeExceeded=!0),x(this,C,ge).call(this,t,"set"),this;let f=a(this,N)===0?void 0:a(this,$).get(t);if(f===void 0)f=a(this,N)===0?a(this,G):a(this,Pt).length!==0?a(this,Pt).pop():a(this,N)===a(this,Et)?x(this,C,Ui).call(this,!1):a(this,N),a(this,I)[f]=t,a(this,O)[f]=e,a(this,$).set(t,f),a(this,nt)[a(this,G)]=f,a(this,ut)[f]=a(this,G),p(this,G,f),Ms(this,N)._++,a(this,Es).call(this,f,h,l),l&&(l.set="add"),d=!1,a(this,vs)&&((u=a(this,Ve))==null||u.call(this,e,t,"add"));else{x(this,C,zs).call(this,f);const S=a(this,O)[f];if(e!==S){if(a(this,Ce)&&x(this,C,A).call(this,S)){S.__abortController.abort(new Error("replaced"));const{__staleWhileFetching:_}=S;_!==void 0&&!o&&(a(this,Bt)&&((g=a(this,It))==null||g.call(this,_,t,"set")),a(this,at)&&((y=a(this,V))==null||y.push([_,t,"set"])))}else o||(a(this,Bt)&&((b=a(this,It))==null||b.call(this,S,t,"set")),a(this,at)&&((E=a(this,V))==null||E.push([S,t,"set"])));if(a(this,Je).call(this,f),a(this,Es).call(this,f,h,l),a(this,O)[f]=e,l){l.set="replace";const _=S&&x(this,C,A).call(this,S)?S.__staleWhileFetching:S;_!==void 0&&(l.oldValue=_)}}else l&&(l.set="update");a(this,vs)&&((v=this.onInsert)==null||v.call(this,e,t,e===S?"update":"replace"))}if(r!==0&&!a(this,pt)&&x(this,C,Pr).call(this),a(this,pt)&&(d||a(this,si).call(this,f,r,n),l&&a(this,ie).call(this,l,f)),!o&&a(this,at)&&a(this,V)){const S=a(this,V);let _;for(;_=S==null?void 0:S.shift();)(k=a(this,Ft))==null||k.call(this,..._)}return this}pop(){var t;try{for(;a(this,N);){const e=a(this,O)[a(this,tt)];if(x(this,C,Ui).call(this,!0),x(this,C,A).call(this,e)){if(e.__staleWhileFetching)return e.__staleWhileFetching}else if(e!==void 0)return e}}finally{if(a(this,at)&&a(this,V)){const e=a(this,V);let s;for(;s=e==null?void 0:e.shift();)(t=a(this,Ft))==null||t.call(this,...s)}}}has(t,e={}){const{updateAgeOnHas:s=this.updateAgeOnHas,status:r}=e,n=a(this,$).get(t);if(n!==void 0){const o=a(this,O)[n];if(x(this,C,A).call(this,o)&&o.__staleWhileFetching===void 0)return!1;if(a(this,gt).call(this,n))r&&(r.has="stale",a(this,ie).call(this,r,n));else return s&&a(this,Ke).call(this,n),r&&(r.has="hit",a(this,ie).call(this,r,n)),!0}else r&&(r.has="miss");return!1}peek(t,e={}){const{allowStale:s=this.allowStale}=e,r=a(this,$).get(t);if(r===void 0||!s&&a(this,gt).call(this,r))return;const n=a(this,O)[r];return x(this,C,A).call(this,n)?n.__staleWhileFetching:n}async fetch(t,e={}){const{allowStale:s=this.allowStale,updateAgeOnGet:r=this.updateAgeOnGet,noDeleteOnStaleGet:n=this.noDeleteOnStaleGet,ttl:o=this.ttl,noDisposeOnSet:c=this.noDisposeOnSet,size:l=0,sizeCalculation:d=this.sizeCalculation,noUpdateTTL:h=this.noUpdateTTL,noDeleteOnFetchRejection:f=this.noDeleteOnFetchRejection,allowStaleOnFetchRejection:u=this.allowStaleOnFetchRejection,ignoreFetchAbort:g=this.ignoreFetchAbort,allowStaleOnFetchAbort:y=this.allowStaleOnFetchAbort,context:b,forceRefresh:E=!1,status:v,signal:k}=e;if(!a(this,Ce))return v&&(v.fetch="get"),this.get(t,{allowStale:s,updateAgeOnGet:r,noDeleteOnStaleGet:n,status:v});const S={allowStale:s,updateAgeOnGet:r,noDeleteOnStaleGet:n,ttl:o,noDisposeOnSet:c,size:l,sizeCalculation:d,noUpdateTTL:h,noDeleteOnFetchRejection:f,allowStaleOnFetchRejection:u,allowStaleOnFetchAbort:y,ignoreFetchAbort:g,status:v,signal:k};let _=a(this,$).get(t);if(_===void 0){v&&(v.fetch="miss");const T=x(this,C,qi).call(this,t,_,S,b);return T.__returned=T}else{const T=a(this,O)[_];if(x(this,C,A).call(this,T)){const he=s&&T.__staleWhileFetching!==void 0;return v&&(v.fetch="inflight",he&&(v.returnedStale=!0)),he?T.__staleWhileFetching:T.__returned=T}const Y=a(this,gt).call(this,_);if(!E&&!Y)return v&&(v.fetch="hit"),x(this,C,zs).call(this,_),r&&a(this,Ke).call(this,_),v&&a(this,ie).call(this,v,_),T;const Tt=x(this,C,qi).call(this,t,_,S,b),Z=Tt.__staleWhileFetching!==void 0&&s;return v&&(v.fetch=Y?"stale":"refresh",Z&&Y&&(v.returnedStale=!0)),Z?Tt.__staleWhileFetching:Tt.__returned=Tt}}async forceFetch(t,e={}){const s=await this.fetch(t,e);if(s===void 0)throw new Error("fetch() returned undefined");return s}memo(t,e={}){const s=a(this,ws);if(!s)throw new Error("no memoMethod provided to constructor");const{context:r,forceRefresh:n,...o}=e,c=this.get(t,o);if(!n&&c!==void 0)return c;const l=s(t,c,{options:o,context:r});return this.set(t,l,o),l}get(t,e={}){const{allowStale:s=this.allowStale,updateAgeOnGet:r=this.updateAgeOnGet,noDeleteOnStaleGet:n=this.noDeleteOnStaleGet,status:o}=e,c=a(this,$).get(t);if(c!==void 0){const l=a(this,O)[c],d=x(this,C,A).call(this,l);return o&&a(this,ie).call(this,o,c),a(this,gt).call(this,c)?(o&&(o.get="stale"),d?(o&&s&&l.__staleWhileFetching!==void 0&&(o.returnedStale=!0),s?l.__staleWhileFetching:void 0):(n||x(this,C,ge).call(this,t,"expire"),o&&s&&(o.returnedStale=!0),s?l:void 0)):(o&&(o.get="hit"),d?l.__staleWhileFetching:(x(this,C,zs).call(this,c),r&&a(this,Ke).call(this,c),l))}else o&&(o.get="miss")}delete(t){return x(this,C,ge).call(this,t,"delete")}clear(){return x(this,C,Br).call(this,"delete")}};Et=new WeakMap,ft=new WeakMap,It=new WeakMap,Ve=new WeakMap,Ft=new WeakMap,xs=new WeakMap,ws=new WeakMap,Dt=new WeakMap,N=new WeakMap,$t=new WeakMap,$=new WeakMap,I=new WeakMap,O=new WeakMap,nt=new WeakMap,ut=new WeakMap,tt=new WeakMap,G=new WeakMap,Pt=new WeakMap,V=new WeakMap,Nt=new WeakMap,Lt=new WeakMap,pt=new WeakMap,mt=new WeakMap,Bt=new WeakMap,Ce=new WeakMap,at=new WeakMap,vs=new WeakMap,C=new WeakSet,Pr=function(){const t=new Wi(a(this,Et)),e=new Wi(a(this,Et));p(this,pt,t),p(this,Lt,e);const s=this.ttlAutopurge?new Array(a(this,Et)):void 0;p(this,mt,s),p(this,si,(o,c,l=a(this,Dt).now())=>{if(e[o]=c!==0?l:0,t[o]=c,s!=null&&s[o]&&(clearTimeout(s[o]),s[o]=void 0),c!==0&&s){const d=setTimeout(()=>{a(this,gt).call(this,o)&&x(this,C,ge).call(this,a(this,I)[o],"expire")},c+1);d.unref&&d.unref(),s[o]=d}}),p(this,Ke,o=>{e[o]=t[o]!==0?a(this,Dt).now():0}),p(this,ie,(o,c)=>{if(t[c]){const l=t[c],d=e[c];if(!l||!d)return;o.ttl=l,o.start=d,o.now=r||n();const h=o.now-d;o.remainingTTL=l-h}});let r=0;const n=()=>{const o=a(this,Dt).now();if(this.ttlResolution>0){r=o;const c=setTimeout(()=>r=0,this.ttlResolution);c.unref&&c.unref()}return o};this.getRemainingTTL=o=>{const c=a(this,$).get(o);if(c===void 0)return 0;const l=t[c],d=e[c];if(!l||!d)return 1/0;const h=(r||n())-d;return l-h},p(this,gt,o=>{const c=e[o],l=t[o];return!!l&&!!c&&(r||n())-c>l})},Ke=new WeakMap,ie=new WeakMap,si=new WeakMap,gt=new WeakMap,mo=function(){const t=new Wi(a(this,Et));p(this,$t,0),p(this,Nt,t),p(this,Je,e=>{p(this,$t,a(this,$t)-t[e]),t[e]=0}),p(this,ii,(e,s,r,n)=>{if(x(this,C,A).call(this,s))return 0;if(!ue(r))if(n){if(typeof n!="function")throw new TypeError("sizeCalculation must be a function");if(r=n(s,e),!ue(r))throw new TypeError("sizeCalculation return invalid (expect positive integer)")}else throw new TypeError("invalid size value (must be positive integer). When maxSize or maxEntrySize is used, sizeCalculation or size must be set.");return r}),p(this,Es,(e,s,r)=>{if(t[e]=s,a(this,ft)){const n=a(this,ft)-t[e];for(;a(this,$t)>n;)x(this,C,Ui).call(this,!0)}p(this,$t,a(this,$t)+t[e]),r&&(r.entrySize=s,r.totalCalculatedSize=a(this,$t))})},Je=new WeakMap,Es=new WeakMap,ii=new WeakMap,pe=function*({allowStale:t=this.allowStale}={}){if(a(this,N))for(let e=a(this,G);!(!x(this,C,Nr).call(this,e)||((t||!a(this,gt).call(this,e))&&(yield e),e===a(this,tt)));)e=a(this,ut)[e]},me=function*({allowStale:t=this.allowStale}={}){if(a(this,N))for(let e=a(this,tt);!(!x(this,C,Nr).call(this,e)||((t||!a(this,gt).call(this,e))&&(yield e),e===a(this,G)));)e=a(this,nt)[e]},Nr=function(t){return t!==void 0&&a(this,$).get(a(this,I)[t])===t},Ui=function(t){var n,o,c;const e=a(this,tt),s=a(this,I)[e],r=a(this,O)[e];return a(this,Ce)&&x(this,C,A).call(this,r)?r.__abortController.abort(new Error("evicted")):(a(this,Bt)||a(this,at))&&(a(this,Bt)&&((n=a(this,It))==null||n.call(this,r,s,"evict")),a(this,at)&&((o=a(this,V))==null||o.push([r,s,"evict"]))),a(this,Je).call(this,e),(c=a(this,mt))!=null&&c[e]&&(clearTimeout(a(this,mt)[e]),a(this,mt)[e]=void 0),t&&(a(this,I)[e]=void 0,a(this,O)[e]=void 0,a(this,Pt).push(e)),a(this,N)===1?(p(this,tt,p(this,G,0)),a(this,Pt).length=0):p(this,tt,a(this,nt)[e]),a(this,$).delete(s),Ms(this,N)._--,e},qi=function(t,e,s,r){const n=e===void 0?void 0:a(this,O)[e];if(x(this,C,A).call(this,n))return n;const o=new tr,{signal:c}=s;c==null||c.addEventListener("abort",()=>o.abort(c.reason),{signal:o.signal});const l={signal:o.signal,options:s,context:r},d=(b,E=!1)=>{const{aborted:v}=o.signal,k=s.ignoreFetchAbort&&b!==void 0;if(s.status&&(v&&!E?(s.status.fetchAborted=!0,s.status.fetchError=o.signal.reason,k&&(s.status.fetchAbortIgnored=!0)):s.status.fetchResolved=!0),v&&!k&&!E)return f(o.signal.reason);const S=g,_=a(this,O)[e];return(_===g||k&&E&&_===void 0)&&(b===void 0?S.__staleWhileFetching!==void 0?a(this,O)[e]=S.__staleWhileFetching:x(this,C,ge).call(this,t,"fetch"):(s.status&&(s.status.fetchUpdated=!0),this.set(t,b,l.options))),b},h=b=>(s.status&&(s.status.fetchRejected=!0,s.status.fetchError=b),f(b)),f=b=>{const{aborted:E}=o.signal,v=E&&s.allowStaleOnFetchAbort,k=v||s.allowStaleOnFetchRejection,S=k||s.noDeleteOnFetchRejection,_=g;if(a(this,O)[e]===g&&(!S||_.__staleWhileFetching===void 0?x(this,C,ge).call(this,t,"fetch"):v||(a(this,O)[e]=_.__staleWhileFetching)),k)return s.status&&_.__staleWhileFetching!==void 0&&(s.status.returnedStale=!0),_.__staleWhileFetching;if(_.__returned===_)throw b},u=(b,E)=>{var k;const v=(k=a(this,xs))==null?void 0:k.call(this,t,n,l);v&&v instanceof Promise&&v.then(S=>b(S===void 0?void 0:S),E),o.signal.addEventListener("abort",()=>{(!s.ignoreFetchAbort||s.allowStaleOnFetchAbort)&&(b(void 0),s.allowStaleOnFetchAbort&&(b=S=>d(S,!0)))})};s.status&&(s.status.fetchDispatched=!0);const g=new Promise(u).then(d,h),y=Object.assign(g,{__abortController:o,__staleWhileFetching:n,__returned:void 0});return e===void 0?(this.set(t,y,{...l.options,status:void 0}),e=a(this,$).get(t)):a(this,O)[e]=y,y},A=function(t){if(!a(this,Ce))return!1;const e=t;return!!e&&e instanceof Promise&&e.hasOwnProperty("__staleWhileFetching")&&e.__abortController instanceof tr},Lr=function(t,e){a(this,ut)[e]=t,a(this,nt)[t]=e},zs=function(t){t!==a(this,G)&&(t===a(this,tt)?p(this,tt,a(this,nt)[t]):x(this,C,Lr).call(this,a(this,ut)[t],a(this,nt)[t]),x(this,C,Lr).call(this,a(this,G),t),p(this,G,t))},ge=function(t,e){var r,n,o,c,l,d;let s=!1;if(a(this,N)!==0){const h=a(this,$).get(t);if(h!==void 0)if((r=a(this,mt))!=null&&r[h]&&(clearTimeout((n=a(this,mt))==null?void 0:n[h]),a(this,mt)[h]=void 0),s=!0,a(this,N)===1)x(this,C,Br).call(this,e);else{a(this,Je).call(this,h);const f=a(this,O)[h];if(x(this,C,A).call(this,f)?f.__abortController.abort(new Error("deleted")):(a(this,Bt)||a(this,at))&&(a(this,Bt)&&((o=a(this,It))==null||o.call(this,f,t,e)),a(this,at)&&((c=a(this,V))==null||c.push([f,t,e]))),a(this,$).delete(t),a(this,I)[h]=void 0,a(this,O)[h]=void 0,h===a(this,G))p(this,G,a(this,ut)[h]);else if(h===a(this,tt))p(this,tt,a(this,nt)[h]);else{const u=a(this,ut)[h];a(this,nt)[u]=a(this,nt)[h];const g=a(this,nt)[h];a(this,ut)[g]=a(this,ut)[h]}Ms(this,N)._--,a(this,Pt).push(h)}}if(a(this,at)&&((l=a(this,V))!=null&&l.length)){const h=a(this,V);let f;for(;f=h==null?void 0:h.shift();)(d=a(this,Ft))==null||d.call(this,...f)}return s},Br=function(t){var e,s,r,n;for(const o of x(this,C,me).call(this,{allowStale:!0})){const c=a(this,O)[o];if(x(this,C,A).call(this,c))c.__abortController.abort(new Error("deleted"));else{const l=a(this,I)[o];a(this,Bt)&&((e=a(this,It))==null||e.call(this,c,l,t)),a(this,at)&&((s=a(this,V))==null||s.push([c,l,t]))}}if(a(this,$).clear(),a(this,O).fill(void 0),a(this,I).fill(void 0),a(this,pt)&&a(this,Lt)){a(this,pt).fill(0),a(this,Lt).fill(0);for(const o of a(this,mt)??[])o!==void 0&&clearTimeout(o);(r=a(this,mt))==null||r.fill(void 0)}if(a(this,Nt)&&a(this,Nt).fill(0),p(this,tt,0),p(this,G,0),a(this,Pt).length=0,p(this,$t,0),p(this,N,0),a(this,at)&&a(this,V)){const o=a(this,V);let c;for(;c=o==null?void 0:o.shift();)(n=a(this,Ft))==null||n.call(this,...c)}};let js=fn;const On=typeof process=="object"&&process?process:{stdout:null,stderr:null},ed=i=>!!i&&typeof i=="object"&&(i instanceof er||i instanceof Oa||sd(i)||id(i)),sd=i=>!!i&&typeof i=="object"&&i instanceof Xr&&typeof i.pipe=="function"&&i.pipe!==Oa.Writable.prototype.pipe,id=i=>!!i&&typeof i=="object"&&i instanceof Xr&&typeof i.write=="function"&&typeof i.end=="function",Jt=Symbol("EOF"),Yt=Symbol("maybeEmitEnd"),fe=Symbol("emittedEnd"),Ai=Symbol("emittingEnd"),Ds=Symbol("emittedError"),Mi=Symbol("closed"),An=Symbol("read"),Ii=Symbol("flush"),Mn=Symbol("flushChunk"),Rt=Symbol("encoding"),as=Symbol("decoder"),H=Symbol("flowing"),$s=Symbol("paused"),ds=Symbol("resume"),W=Symbol("buffer"),st=Symbol("pipes"),U=Symbol("bufferLength"),gr=Symbol("bufferPush"),Fi=Symbol("bufferShift"),X=Symbol("objectMode"),F=Symbol("destroyed"),br=Symbol("error"),yr=Symbol("emitData"),In=Symbol("emitEnd"),xr=Symbol("emitEnd2"),Wt=Symbol("async"),wr=Symbol("abort"),Di=Symbol("aborted"),Ps=Symbol("signal"),Ie=Symbol("dataListeners"),ht=Symbol("discarded"),Ns=i=>Promise.resolve().then(i),rd=i=>i(),nd=i=>i==="end"||i==="finish"||i==="prefinish",ad=i=>i instanceof ArrayBuffer||!!i&&typeof i=="object"&&i.constructor&&i.constructor.name==="ArrayBuffer"&&i.byteLength>=0,od=i=>!Buffer.isBuffer(i)&&ArrayBuffer.isView(i);class go{constructor(t,e,s){m(this,"src");m(this,"dest");m(this,"opts");m(this,"ondrain");this.src=t,this.dest=e,this.opts=s,this.ondrain=()=>t[ds](),this.dest.on("drain",this.ondrain)}unpipe(){this.dest.removeListener("drain",this.ondrain)}proxyErrors(t){}end(){this.unpipe(),this.opts.end&&this.dest.end()}}class cd extends go{unpipe(){this.src.removeListener("error",this.proxyErrors),super.unpipe()}constructor(t,e,s){super(t,e,s),this.proxyErrors=r=>e.emit("error",r),t.on("error",this.proxyErrors)}}const ld=i=>!!i.objectMode,dd=i=>!i.objectMode&&!!i.encoding&&i.encoding!=="buffer";var da,ha,fa,ua,pa,ma,ga,ba,ya,xa,wa,va,Ea,Sa,ka,Ca,_a,Ta,Ra;class er extends Xr{constructor(...e){const s=e[0]||{};super();m(this,Ra,!1);m(this,Ta,!1);m(this,_a,[]);m(this,Ca,[]);m(this,ka);m(this,Sa);m(this,Ea);m(this,va);m(this,wa,!1);m(this,xa,!1);m(this,ya,!1);m(this,ba,!1);m(this,ga,null);m(this,ma,0);m(this,pa,!1);m(this,ua);m(this,fa,!1);m(this,ha,0);m(this,da,!1);m(this,"writable",!0);m(this,"readable",!0);if(s.objectMode&&typeof s.encoding=="string")throw new TypeError("Encoding and objectMode may not be used together");ld(s)?(this[X]=!0,this[Rt]=null):dd(s)?(this[Rt]=s.encoding,this[X]=!1):(this[X]=!1,this[Rt]=null),this[Wt]=!!s.async,this[as]=this[Rt]?new Qo(this[Rt]):null,s&&s.debugExposeBuffer===!0&&Object.defineProperty(this,"buffer",{get:()=>this[W]}),s&&s.debugExposePipes===!0&&Object.defineProperty(this,"pipes",{get:()=>this[st]});const{signal:r}=s;r&&(this[Ps]=r,r.aborted?this[wr]():r.addEventListener("abort",()=>this[wr]()))}get bufferLength(){return this[U]}get encoding(){return this[Rt]}set encoding(e){throw new Error("Encoding must be set at instantiation time")}setEncoding(e){throw new Error("Encoding must be set at instantiation time")}get objectMode(){return this[X]}set objectMode(e){throw new Error("objectMode must be set at instantiation time")}get async(){return this[Wt]}set async(e){this[Wt]=this[Wt]||!!e}[(Ra=H,Ta=$s,_a=st,Ca=W,ka=X,Sa=Rt,Ea=Wt,va=as,wa=Jt,xa=fe,ya=Ai,ba=Mi,ga=Ds,ma=U,pa=F,ua=Ps,fa=Di,ha=Ie,da=ht,wr)](){var e,s;this[Di]=!0,this.emit("abort",(e=this[Ps])==null?void 0:e.reason),this.destroy((s=this[Ps])==null?void 0:s.reason)}get aborted(){return this[Di]}set aborted(e){}write(e,s,r){var o;if(this[Di])return!1;if(this[Jt])throw new Error("write after end");if(this[F])return this.emit("error",Object.assign(new Error("Cannot call write after a stream was destroyed"),{code:"ERR_STREAM_DESTROYED"})),!0;typeof s=="function"&&(r=s,s="utf8"),s||(s="utf8");const n=this[Wt]?Ns:rd;if(!this[X]&&!Buffer.isBuffer(e)){if(od(e))e=Buffer.from(e.buffer,e.byteOffset,e.byteLength);else if(ad(e))e=Buffer.from(e);else if(typeof e!="string")throw new Error("Non-contiguous data written to non-objectMode stream")}return this[X]?(this[H]&&this[U]!==0&&this[Ii](!0),this[H]?this.emit("data",e):this[gr](e),this[U]!==0&&this.emit("readable"),r&&n(r),this[H]):e.length?(typeof e=="string"&&!(s===this[Rt]&&!((o=this[as])!=null&&o.lastNeed))&&(e=Buffer.from(e,s)),Buffer.isBuffer(e)&&this[Rt]&&(e=this[as].write(e)),this[H]&&this[U]!==0&&this[Ii](!0),this[H]?this.emit("data",e):this[gr](e),this[U]!==0&&this.emit("readable"),r&&n(r),this[H]):(this[U]!==0&&this.emit("readable"),r&&n(r),this[H])}read(e){if(this[F])return null;if(this[ht]=!1,this[U]===0||e===0||e&&e>this[U])return this[Yt](),null;this[X]&&(e=null),this[W].length>1&&!this[X]&&(this[W]=[this[Rt]?this[W].join(""):Buffer.concat(this[W],this[U])]);const s=this[An](e||null,this[W][0]);return this[Yt](),s}[An](e,s){if(this[X])this[Fi]();else{const r=s;e===r.length||e===null?this[Fi]():typeof r=="string"?(this[W][0]=r.slice(e),s=r.slice(0,e),this[U]-=e):(this[W][0]=r.subarray(e),s=r.subarray(0,e),this[U]-=e)}return this.emit("data",s),!this[W].length&&!this[Jt]&&this.emit("drain"),s}end(e,s,r){return typeof e=="function"&&(r=e,e=void 0),typeof s=="function"&&(r=s,s="utf8"),e!==void 0&&this.write(e,s),r&&this.once("end",r),this[Jt]=!0,this.writable=!1,(this[H]||!this[$s])&&this[Yt](),this}[ds](){this[F]||(!this[Ie]&&!this[st].length&&(this[ht]=!0),this[$s]=!1,this[H]=!0,this.emit("resume"),this[W].length?this[Ii]():this[Jt]?this[Yt]():this.emit("drain"))}resume(){return this[ds]()}pause(){this[H]=!1,this[$s]=!0,this[ht]=!1}get destroyed(){return this[F]}get flowing(){return this[H]}get paused(){return this[$s]}[gr](e){this[X]?this[U]+=1:this[U]+=e.length,this[W].push(e)}[Fi](){return this[X]?this[U]-=1:this[U]-=this[W][0].length,this[W].shift()}[Ii](e=!1){do;while(this[Mn](this[Fi]())&&this[W].length);!e&&!this[W].length&&!this[Jt]&&this.emit("drain")}[Mn](e){return this.emit("data",e),this[H]}pipe(e,s){if(this[F])return e;this[ht]=!1;const r=this[fe];return s=s||{},e===On.stdout||e===On.stderr?s.end=!1:s.end=s.end!==!1,s.proxyErrors=!!s.proxyErrors,r?s.end&&e.end():(this[st].push(s.proxyErrors?new cd(this,e,s):new go(this,e,s)),this[Wt]?Ns(()=>this[ds]()):this[ds]()),e}unpipe(e){const s=this[st].find(r=>r.dest===e);s&&(this[st].length===1?(this[H]&&this[Ie]===0&&(this[H]=!1),this[st]=[]):this[st].splice(this[st].indexOf(s),1),s.unpipe())}addListener(e,s){return this.on(e,s)}on(e,s){const r=super.on(e,s);if(e==="data")this[ht]=!1,this[Ie]++,!this[st].length&&!this[H]&&this[ds]();else if(e==="readable"&&this[U]!==0)super.emit("readable");else if(nd(e)&&this[fe])super.emit(e),this.removeAllListeners(e);else if(e==="error"&&this[Ds]){const n=s;this[Wt]?Ns(()=>n.call(this,this[Ds])):n.call(this,this[Ds])}return r}removeListener(e,s){return this.off(e,s)}off(e,s){const r=super.off(e,s);return e==="data"&&(this[Ie]=this.listeners("data").length,this[Ie]===0&&!this[ht]&&!this[st].length&&(this[H]=!1)),r}removeAllListeners(e){const s=super.removeAllListeners(e);return(e==="data"||e===void 0)&&(this[Ie]=0,!this[ht]&&!this[st].length&&(this[H]=!1)),s}get emittedEnd(){return this[fe]}[Yt](){!this[Ai]&&!this[fe]&&!this[F]&&this[W].length===0&&this[Jt]&&(this[Ai]=!0,this.emit("end"),this.emit("prefinish"),this.emit("finish"),this[Mi]&&this.emit("close"),this[Ai]=!1)}emit(e,...s){const r=s[0];if(e!=="error"&&e!=="close"&&e!==F&&this[F])return!1;if(e==="data")return!this[X]&&!r?!1:this[Wt]?(Ns(()=>this[yr](r)),!0):this[yr](r);if(e==="end")return this[In]();if(e==="close"){if(this[Mi]=!0,!this[fe]&&!this[F])return!1;const o=super.emit("close");return this.removeAllListeners("close"),o}else if(e==="error"){this[Ds]=r,super.emit(br,r);const o=!this[Ps]||this.listeners("error").length?super.emit("error",r):!1;return this[Yt](),o}else if(e==="resume"){const o=super.emit("resume");return this[Yt](),o}else if(e==="finish"||e==="prefinish"){const o=super.emit(e);return this.removeAllListeners(e),o}const n=super.emit(e,...s);return this[Yt](),n}[yr](e){for(const r of this[st])r.dest.write(e)===!1&&this.pause();const s=this[ht]?!1:super.emit("data",e);return this[Yt](),s}[In](){return this[fe]?!1:(this[fe]=!0,this.readable=!1,this[Wt]?(Ns(()=>this[xr]()),!0):this[xr]())}[xr](){if(this[as]){const s=this[as].end();if(s){for(const r of this[st])r.dest.write(s);this[ht]||super.emit("data",s)}}for(const s of this[st])s.end();const e=super.emit("end");return this.removeAllListeners("end"),e}async collect(){const e=Object.assign([],{dataLength:0});this[X]||(e.dataLength=0);const s=this.promise();return this.on("data",r=>{e.push(r),this[X]||(e.dataLength+=r.length)}),await s,e}async concat(){if(this[X])throw new Error("cannot concat in objectMode");const e=await this.collect();return this[Rt]?e.join(""):Buffer.concat(e,e.dataLength)}async promise(){return new Promise((e,s)=>{this.on(F,()=>s(new Error("stream destroyed"))),this.on("error",r=>s(r)),this.on("end",()=>e())})}[Symbol.asyncIterator](){this[ht]=!1;let e=!1;const s=async()=>(this.pause(),e=!0,{value:void 0,done:!0});return{next:()=>{if(e)return s();const n=this.read();if(n!==null)return Promise.resolve({done:!1,value:n});if(this[Jt])return s();let o,c;const l=u=>{this.off("data",d),this.off("end",h),this.off(F,f),s(),c(u)},d=u=>{this.off("error",l),this.off("end",h),this.off(F,f),this.pause(),o({value:u,done:!!this[Jt]})},h=()=>{this.off("error",l),this.off("data",d),this.off(F,f),s(),o({done:!0,value:void 0})},f=()=>l(new Error("stream destroyed"));return new Promise((u,g)=>{c=g,o=u,this.once(F,f),this.once("error",l),this.once("end",h),this.once("data",d)})},throw:s,return:s,[Symbol.asyncIterator](){return this}}}[Symbol.iterator](){this[ht]=!1;let e=!1;const s=()=>(this.pause(),this.off(br,s),this.off(F,s),this.off("end",s),e=!0,{done:!0,value:void 0}),r=()=>{if(e)return s();const n=this.read();return n===null?s():{done:!1,value:n}};return this.once("end",s),this.once(br,s),this.once(F,s),{next:r,throw:s,return:s,[Symbol.iterator](){return this}}}destroy(e){if(this[F])return e?this.emit("error",e):this.emit(F),this;this[F]=!0,this[ht]=!0,this[W].length=0,this[U]=0;const s=this;return typeof s.close=="function"&&!this[Mi]&&s.close(),e?this.emit("error",e):this.emit(F),this}static get isStream(){return ed}}const hd=Wo.native,Hs={lstatSync:Vo,readdir:Go,readdirSync:qo,readlinkSync:Uo,realpathSync:hd,promises:{lstat:Xo,readdir:Zo,readlink:Yo,realpath:Jo}},bo=i=>!i||i===Hs||i===Ko?Hs:{...Hs,...i,promises:{...Hs.promises,...i.promises||{}}},yo=/^\\\\\?\\([a-z]:)\\?$/i,fd=i=>i.replace(/\//g,"\\").replace(yo,"$1\\"),ud=/[\\\/]/,St=0,xo=1,wo=2,Ut=4,vo=6,Eo=8,$e=10,So=12,wt=15,Ls=~wt,vr=16,Fn=32,Ws=64,jt=128,$i=256,Gi=512,Dn=Ws|jt|Gi,pd=1023,Er=i=>i.isFile()?Eo:i.isDirectory()?Ut:i.isSymbolicLink()?$e:i.isCharacterDevice()?wo:i.isBlockDevice()?vo:i.isSocket()?So:i.isFIFO()?xo:St,$n=new js({max:2**12}),Us=i=>{const t=$n.get(i);if(t)return t;const e=i.normalize("NFKD");return $n.set(i,e),e},Pn=new js({max:2**12}),Pi=i=>{const t=Pn.get(i);if(t)return t;const e=Us(i.toLowerCase());return Pn.set(i,e),e};class Nn extends js{constructor(){super({max:256})}}class md extends js{constructor(t=16*1024){super({maxSize:t,sizeCalculation:e=>e.length+1})}}const ko=Symbol("PathScurry setAsCwd");var ot,ri,ni,ai,oi,ci,li,di,hi,fi,ui,pi,mi,gi,bi,yi,xi,wi,vi,_e,Ye,Gt,re,ne,ae,j,Ze,oe,Vt,R,zr,Vi,qs,Hr,Wr,Gs,Ki,Ur,qr,Ji,Co,_o,To,Gr,Ss,ks,Ro,Xe;class dt{constructor(t,e=St,s,r,n,o,c){w(this,R);m(this,"name");m(this,"root");m(this,"roots");m(this,"parent");m(this,"nocase");m(this,"isCWD",!1);w(this,ot);w(this,ri);w(this,ni);w(this,ai);w(this,oi);w(this,ci);w(this,li);w(this,di);w(this,hi);w(this,fi);w(this,ui);w(this,pi);w(this,mi);w(this,gi);w(this,bi);w(this,yi);w(this,xi);w(this,wi);w(this,vi);w(this,_e);w(this,Ye);w(this,Gt);w(this,re);w(this,ne);w(this,ae);w(this,j);w(this,Ze);w(this,oe);w(this,Vt);w(this,Ss,[]);w(this,ks,!1);w(this,Xe);this.name=t,p(this,_e,n?Pi(t):Us(t)),p(this,j,e&pd),this.nocase=n,this.roots=r,this.root=s||this,p(this,Ze,o),p(this,Gt,c.fullpath),p(this,ne,c.relative),p(this,ae,c.relativePosix),this.parent=c.parent,this.parent?p(this,ot,a(this.parent,ot)):p(this,ot,bo(c.fs))}get dev(){return a(this,ri)}get mode(){return a(this,ni)}get nlink(){return a(this,ai)}get uid(){return a(this,oi)}get gid(){return a(this,ci)}get rdev(){return a(this,li)}get blksize(){return a(this,di)}get ino(){return a(this,hi)}get size(){return a(this,fi)}get blocks(){return a(this,ui)}get atimeMs(){return a(this,pi)}get mtimeMs(){return a(this,mi)}get ctimeMs(){return a(this,gi)}get birthtimeMs(){return a(this,bi)}get atime(){return a(this,yi)}get mtime(){return a(this,xi)}get ctime(){return a(this,wi)}get birthtime(){return a(this,vi)}get parentPath(){return(this.parent||this).fullpath()}get path(){return this.parentPath}depth(){return a(this,Ye)!==void 0?a(this,Ye):this.parent?p(this,Ye,this.parent.depth()+1):p(this,Ye,0)}childrenCache(){return a(this,Ze)}resolve(t){var o;if(!t)return this;const e=this.getRootString(t),r=t.substring(e.length).split(this.splitSep);return e?x(o=this.getRoot(e),R,zr).call(o,r):x(this,R,zr).call(this,r)}children(){const t=a(this,Ze).get(this);if(t)return t;const e=Object.assign([],{provisional:0});return a(this,Ze).set(this,e),p(this,j,a(this,j)&~vr),e}child(t,e){if(t===""||t===".")return this;if(t==="..")return this.parent||this;const s=this.children(),r=this.nocase?Pi(t):Us(t);for(const l of s)if(a(l,_e)===r)return l;const n=this.parent?this.sep:"",o=a(this,Gt)?a(this,Gt)+n+t:void 0,c=this.newChild(t,St,{...e,parent:this,fullpath:o});return this.canReaddir()||p(c,j,a(c,j)|jt),s.push(c),c}relative(){if(this.isCWD)return"";if(a(this,ne)!==void 0)return a(this,ne);const t=this.name,e=this.parent;if(!e)return p(this,ne,this.name);const s=e.relative();return s+(!s||!e.parent?"":this.sep)+t}relativePosix(){if(this.sep==="/")return this.relative();if(this.isCWD)return"";if(a(this,ae)!==void 0)return a(this,ae);const t=this.name,e=this.parent;if(!e)return p(this,ae,this.fullpathPosix());const s=e.relativePosix();return s+(!s||!e.parent?"":"/")+t}fullpath(){if(a(this,Gt)!==void 0)return a(this,Gt);const t=this.name,e=this.parent;if(!e)return p(this,Gt,this.name);const r=e.fullpath()+(e.parent?this.sep:"")+t;return p(this,Gt,r)}fullpathPosix(){if(a(this,re)!==void 0)return a(this,re);if(this.sep==="/")return p(this,re,this.fullpath());if(!this.parent){const r=this.fullpath().replace(/\\/g,"/");return/^[a-z]:\//i.test(r)?p(this,re,`//?/${r}`):p(this,re,r)}const t=this.parent,e=t.fullpathPosix(),s=e+(!e||!t.parent?"":"/")+this.name;return p(this,re,s)}isUnknown(){return(a(this,j)&wt)===St}isType(t){return this[`is${t}`]()}getType(){return this.isUnknown()?"Unknown":this.isDirectory()?"Directory":this.isFile()?"File":this.isSymbolicLink()?"SymbolicLink":this.isFIFO()?"FIFO":this.isCharacterDevice()?"CharacterDevice":this.isBlockDevice()?"BlockDevice":this.isSocket()?"Socket":"Unknown"}isFile(){return(a(this,j)&wt)===Eo}isDirectory(){return(a(this,j)&wt)===Ut}isCharacterDevice(){return(a(this,j)&wt)===wo}isBlockDevice(){return(a(this,j)&wt)===vo}isFIFO(){return(a(this,j)&wt)===xo}isSocket(){return(a(this,j)&wt)===So}isSymbolicLink(){return(a(this,j)&$e)===$e}lstatCached(){return a(this,j)&Fn?this:void 0}readlinkCached(){return a(this,oe)}realpathCached(){return a(this,Vt)}readdirCached(){const t=this.children();return t.slice(0,t.provisional)}canReadlink(){if(a(this,oe))return!0;if(!this.parent)return!1;const t=a(this,j)&wt;return!(t!==St&&t!==$e||a(this,j)&$i||a(this,j)&jt)}calledReaddir(){return!!(a(this,j)&vr)}isENOENT(){return!!(a(this,j)&jt)}isNamed(t){return this.nocase?a(this,_e)===Pi(t):a(this,_e)===Us(t)}async readlink(){var e;const t=a(this,oe);if(t)return t;if(this.canReadlink()&&this.parent)try{const s=await a(this,ot).promises.readlink(this.fullpath()),r=(e=await this.parent.realpath())==null?void 0:e.resolve(s);if(r)return p(this,oe,r)}catch(s){x(this,R,qr).call(this,s.code);return}}readlinkSync(){var e;const t=a(this,oe);if(t)return t;if(this.canReadlink()&&this.parent)try{const s=a(this,ot).readlinkSync(this.fullpath()),r=(e=this.parent.realpathSync())==null?void 0:e.resolve(s);if(r)return p(this,oe,r)}catch(s){x(this,R,qr).call(this,s.code);return}}async lstat(){if(!(a(this,j)&jt))try{return x(this,R,Gr).call(this,await a(this,ot).promises.lstat(this.fullpath())),this}catch(t){x(this,R,Ur).call(this,t.code)}}lstatSync(){if(!(a(this,j)&jt))try{return x(this,R,Gr).call(this,a(this,ot).lstatSync(this.fullpath())),this}catch(t){x(this,R,Ur).call(this,t.code)}}readdirCB(t,e=!1){if(!this.canReaddir()){e?t(null,[]):queueMicrotask(()=>t(null,[]));return}const s=this.children();if(this.calledReaddir()){const n=s.slice(0,s.provisional);e?t(null,n):queueMicrotask(()=>t(null,n));return}if(a(this,Ss).push(t),a(this,ks))return;p(this,ks,!0);const r=this.fullpath();a(this,ot).readdir(r,{withFileTypes:!0},(n,o)=>{if(n)x(this,R,Ki).call(this,n.code),s.provisional=0;else{for(const c of o)x(this,R,Ji).call(this,c,s);x(this,R,Vi).call(this,s)}x(this,R,Ro).call(this,s.slice(0,s.provisional))})}async readdir(){if(!this.canReaddir())return[];const t=this.children();if(this.calledReaddir())return t.slice(0,t.provisional);const e=this.fullpath();if(a(this,Xe))await a(this,Xe);else{let s=()=>{};p(this,Xe,new Promise(r=>s=r));try{for(const r of await a(this,ot).promises.readdir(e,{withFileTypes:!0}))x(this,R,Ji).call(this,r,t);x(this,R,Vi).call(this,t)}catch(r){x(this,R,Ki).call(this,r.code),t.provisional=0}p(this,Xe,void 0),s()}return t.slice(0,t.provisional)}readdirSync(){if(!this.canReaddir())return[];const t=this.children();if(this.calledReaddir())return t.slice(0,t.provisional);const e=this.fullpath();try{for(const s of a(this,ot).readdirSync(e,{withFileTypes:!0}))x(this,R,Ji).call(this,s,t);x(this,R,Vi).call(this,t)}catch(s){x(this,R,Ki).call(this,s.code),t.provisional=0}return t.slice(0,t.provisional)}canReaddir(){if(a(this,j)&Dn)return!1;const t=wt&a(this,j);return t===St||t===Ut||t===$e}shouldWalk(t,e){return(a(this,j)&Ut)===Ut&&!(a(this,j)&Dn)&&!t.has(this)&&(!e||e(this))}async realpath(){if(a(this,Vt))return a(this,Vt);if(!((Gi|$i|jt)&a(this,j)))try{const t=await a(this,ot).promises.realpath(this.fullpath());return p(this,Vt,this.resolve(t))}catch{x(this,R,Wr).call(this)}}realpathSync(){if(a(this,Vt))return a(this,Vt);if(!((Gi|$i|jt)&a(this,j)))try{const t=a(this,ot).realpathSync(this.fullpath());return p(this,Vt,this.resolve(t))}catch{x(this,R,Wr).call(this)}}[ko](t){if(t===this)return;t.isCWD=!1,this.isCWD=!0;const e=new Set([]);let s=[],r=this;for(;r&&r.parent;)e.add(r),p(r,ne,s.join(this.sep)),p(r,ae,s.join("/")),r=r.parent,s.push("..");for(r=t;r&&r.parent&&!e.has(r);)p(r,ne,void 0),p(r,ae,void 0),r=r.parent}}ot=new WeakMap,ri=new WeakMap,ni=new WeakMap,ai=new WeakMap,oi=new WeakMap,ci=new WeakMap,li=new WeakMap,di=new WeakMap,hi=new WeakMap,fi=new WeakMap,ui=new WeakMap,pi=new WeakMap,mi=new WeakMap,gi=new WeakMap,bi=new WeakMap,yi=new WeakMap,xi=new WeakMap,wi=new WeakMap,vi=new WeakMap,_e=new WeakMap,Ye=new WeakMap,Gt=new WeakMap,re=new WeakMap,ne=new WeakMap,ae=new WeakMap,j=new WeakMap,Ze=new WeakMap,oe=new WeakMap,Vt=new WeakMap,R=new WeakSet,zr=function(t){let e=this;for(const s of t)e=e.child(s);return e},Vi=function(t){var e;p(this,j,a(this,j)|vr);for(let s=t.provisional;s<t.length;s++){const r=t[s];r&&x(e=r,R,qs).call(e)}},qs=function(){a(this,j)&jt||(p(this,j,(a(this,j)|jt)&Ls),x(this,R,Hr).call(this))},Hr=function(){var e;const t=this.children();t.provisional=0;for(const s of t)x(e=s,R,qs).call(e)},Wr=function(){p(this,j,a(this,j)|Gi),x(this,R,Gs).call(this)},Gs=function(){if(a(this,j)&Ws)return;let t=a(this,j);(t&wt)===Ut&&(t&=Ls),p(this,j,t|Ws),x(this,R,Hr).call(this)},Ki=function(t=""){t==="ENOTDIR"||t==="EPERM"?x(this,R,Gs).call(this):t==="ENOENT"?x(this,R,qs).call(this):this.children().provisional=0},Ur=function(t=""){var e;if(t==="ENOTDIR"){const s=this.parent;x(e=s,R,Gs).call(e)}else t==="ENOENT"&&x(this,R,qs).call(this)},qr=function(t=""){var s;let e=a(this,j);e|=$i,t==="ENOENT"&&(e|=jt),(t==="EINVAL"||t==="UNKNOWN")&&(e&=Ls),p(this,j,e),t==="ENOTDIR"&&this.parent&&x(s=this.parent,R,Gs).call(s)},Ji=function(t,e){return x(this,R,_o).call(this,t,e)||x(this,R,Co).call(this,t,e)},Co=function(t,e){const s=Er(t),r=this.newChild(t.name,s,{parent:this}),n=a(r,j)&wt;return n!==Ut&&n!==$e&&n!==St&&p(r,j,a(r,j)|Ws),e.unshift(r),e.provisional++,r},_o=function(t,e){for(let s=e.provisional;s<e.length;s++){const r=e[s];if((this.nocase?Pi(t.name):Us(t.name))===a(r,_e))return x(this,R,To).call(this,t,r,s,e)}},To=function(t,e,s,r){const n=e.name;return p(e,j,a(e,j)&Ls|Er(t)),n!==t.name&&(e.name=t.name),s!==r.provisional&&(s===r.length-1?r.pop():r.splice(s,1),r.unshift(e)),r.provisional++,e},Gr=function(t){const{atime:e,atimeMs:s,birthtime:r,birthtimeMs:n,blksize:o,blocks:c,ctime:l,ctimeMs:d,dev:h,gid:f,ino:u,mode:g,mtime:y,mtimeMs:b,nlink:E,rdev:v,size:k,uid:S}=t;p(this,yi,e),p(this,pi,s),p(this,vi,r),p(this,bi,n),p(this,di,o),p(this,ui,c),p(this,wi,l),p(this,gi,d),p(this,ri,h),p(this,ci,f),p(this,hi,u),p(this,ni,g),p(this,xi,y),p(this,mi,b),p(this,ai,E),p(this,li,v),p(this,fi,k),p(this,oi,S);const _=Er(t);p(this,j,a(this,j)&Ls|_|Fn),_!==St&&_!==Ut&&_!==$e&&p(this,j,a(this,j)|Ws)},Ss=new WeakMap,ks=new WeakMap,Ro=function(t){p(this,ks,!1);const e=a(this,Ss).slice();a(this,Ss).length=0,e.forEach(s=>s(null,t))},Xe=new WeakMap;class cr extends dt{constructor(e,s=St,r,n,o,c,l){super(e,s,r,n,o,c,l);m(this,"sep","\\");m(this,"splitSep",ud)}newChild(e,s=St,r={}){return new cr(e,s,this.root,this.roots,this.nocase,this.childrenCache(),r)}getRootString(e){return Mr.parse(e).root}getRoot(e){if(e=fd(e.toUpperCase()),e===this.root.name)return this.root;for(const[s,r]of Object.entries(this.roots))if(this.sameRoot(e,s))return this.roots[e]=r;return this.roots[e]=new nn(e,this).root}sameRoot(e,s=this.root.name){return e=e.toUpperCase().replace(/\//g,"\\").replace(yo,"$1\\"),e===s}}class lr extends dt{constructor(e,s=St,r,n,o,c,l){super(e,s,r,n,o,c,l);m(this,"splitSep","/");m(this,"sep","/")}getRootString(e){return e.startsWith("/")?"/":""}getRoot(e){return this.root}newChild(e,s=St,r={}){return new lr(e,s,this.root,this.roots,this.nocase,this.childrenCache(),r)}}var Cs,_s,Ei,Si;class jo{constructor(t=process.cwd(),e,s,{nocase:r,childrenCacheSize:n=16*1024,fs:o=Hs}={}){m(this,"root");m(this,"rootPath");m(this,"roots");m(this,"cwd");w(this,Cs);w(this,_s);w(this,Ei);m(this,"nocase");w(this,Si);p(this,Si,bo(o)),(t instanceof URL||t.startsWith("file://"))&&(t=ja(t));const c=e.resolve(t);this.roots=Object.create(null),this.rootPath=this.parseRootPath(c),p(this,Cs,new Nn),p(this,_s,new Nn),p(this,Ei,new md(n));const l=c.substring(this.rootPath.length).split(s);if(l.length===1&&!l[0]&&l.pop(),r===void 0)throw new TypeError("must provide nocase setting to PathScurryBase ctor");this.nocase=r,this.root=this.newRoot(a(this,Si)),this.roots[this.rootPath]=this.root;let d=this.root,h=l.length-1;const f=e.sep;let u=this.rootPath,g=!1;for(const y of l){const b=h--;d=d.child(y,{relative:new Array(b).fill("..").join(f),relativePosix:new Array(b).fill("..").join("/"),fullpath:u+=(g?"":f)+y}),g=!0}this.cwd=d}depth(t=this.cwd){return typeof t=="string"&&(t=this.cwd.resolve(t)),t.depth()}childrenCache(){return a(this,Ei)}resolve(...t){let e="";for(let n=t.length-1;n>=0;n--){const o=t[n];if(!(!o||o===".")&&(e=e?`${o}/${e}`:o,this.isAbsolute(o)))break}const s=a(this,Cs).get(e);if(s!==void 0)return s;const r=this.cwd.resolve(e).fullpath();return a(this,Cs).set(e,r),r}resolvePosix(...t){let e="";for(let n=t.length-1;n>=0;n--){const o=t[n];if(!(!o||o===".")&&(e=e?`${o}/${e}`:o,this.isAbsolute(o)))break}const s=a(this,_s).get(e);if(s!==void 0)return s;const r=this.cwd.resolve(e).fullpathPosix();return a(this,_s).set(e,r),r}relative(t=this.cwd){return typeof t=="string"&&(t=this.cwd.resolve(t)),t.relative()}relativePosix(t=this.cwd){return typeof t=="string"&&(t=this.cwd.resolve(t)),t.relativePosix()}basename(t=this.cwd){return typeof t=="string"&&(t=this.cwd.resolve(t)),t.name}dirname(t=this.cwd){return typeof t=="string"&&(t=this.cwd.resolve(t)),(t.parent||t).fullpath()}async readdir(t=this.cwd,e={withFileTypes:!0}){typeof t=="string"?t=this.cwd.resolve(t):t instanceof dt||(e=t,t=this.cwd);const{withFileTypes:s}=e;if(t.canReaddir()){const r=await t.readdir();return s?r:r.map(n=>n.name)}else return[]}readdirSync(t=this.cwd,e={withFileTypes:!0}){typeof t=="string"?t=this.cwd.resolve(t):t instanceof dt||(e=t,t=this.cwd);const{withFileTypes:s=!0}=e;return t.canReaddir()?s?t.readdirSync():t.readdirSync().map(r=>r.name):[]}async lstat(t=this.cwd){return typeof t=="string"&&(t=this.cwd.resolve(t)),t.lstat()}lstatSync(t=this.cwd){return typeof t=="string"&&(t=this.cwd.resolve(t)),t.lstatSync()}async readlink(t=this.cwd,{withFileTypes:e}={withFileTypes:!1}){typeof t=="string"?t=this.cwd.resolve(t):t instanceof dt||(e=t.withFileTypes,t=this.cwd);const s=await t.readlink();return e?s:s==null?void 0:s.fullpath()}readlinkSync(t=this.cwd,{withFileTypes:e}={withFileTypes:!1}){typeof t=="string"?t=this.cwd.resolve(t):t instanceof dt||(e=t.withFileTypes,t=this.cwd);const s=t.readlinkSync();return e?s:s==null?void 0:s.fullpath()}async realpath(t=this.cwd,{withFileTypes:e}={withFileTypes:!1}){typeof t=="string"?t=this.cwd.resolve(t):t instanceof dt||(e=t.withFileTypes,t=this.cwd);const s=await t.realpath();return e?s:s==null?void 0:s.fullpath()}realpathSync(t=this.cwd,{withFileTypes:e}={withFileTypes:!1}){typeof t=="string"?t=this.cwd.resolve(t):t instanceof dt||(e=t.withFileTypes,t=this.cwd);const s=t.realpathSync();return e?s:s==null?void 0:s.fullpath()}async walk(t=this.cwd,e={}){typeof t=="string"?t=this.cwd.resolve(t):t instanceof dt||(e=t,t=this.cwd);const{withFileTypes:s=!0,follow:r=!1,filter:n,walkFilter:o}=e,c=[];(!n||n(t))&&c.push(s?t:t.fullpath());const l=new Set,d=(f,u)=>{l.add(f),f.readdirCB((g,y)=>{if(g)return u(g);let b=y.length;if(!b)return u();const E=()=>{--b===0&&u()};for(const v of y)(!n||n(v))&&c.push(s?v:v.fullpath()),r&&v.isSymbolicLink()?v.realpath().then(k=>k!=null&&k.isUnknown()?k.lstat():k).then(k=>k!=null&&k.shouldWalk(l,o)?d(k,E):E()):v.shouldWalk(l,o)?d(v,E):E()},!0)},h=t;return new Promise((f,u)=>{d(h,g=>{if(g)return u(g);f(c)})})}walkSync(t=this.cwd,e={}){typeof t=="string"?t=this.cwd.resolve(t):t instanceof dt||(e=t,t=this.cwd);const{withFileTypes:s=!0,follow:r=!1,filter:n,walkFilter:o}=e,c=[];(!n||n(t))&&c.push(s?t:t.fullpath());const l=new Set([t]);for(const d of l){const h=d.readdirSync();for(const f of h){(!n||n(f))&&c.push(s?f:f.fullpath());let u=f;if(f.isSymbolicLink()){if(!(r&&(u=f.realpathSync())))continue;u.isUnknown()&&u.lstatSync()}u.shouldWalk(l,o)&&l.add(u)}}return c}[Symbol.asyncIterator](){return this.iterate()}iterate(t=this.cwd,e={}){return typeof t=="string"?t=this.cwd.resolve(t):t instanceof dt||(e=t,t=this.cwd),this.stream(t,e)[Symbol.asyncIterator]()}[Symbol.iterator](){return this.iterateSync()}*iterateSync(t=this.cwd,e={}){typeof t=="string"?t=this.cwd.resolve(t):t instanceof dt||(e=t,t=this.cwd);const{withFileTypes:s=!0,follow:r=!1,filter:n,walkFilter:o}=e;(!n||n(t))&&(yield s?t:t.fullpath());const c=new Set([t]);for(const l of c){const d=l.readdirSync();for(const h of d){(!n||n(h))&&(yield s?h:h.fullpath());let f=h;if(h.isSymbolicLink()){if(!(r&&(f=h.realpathSync())))continue;f.isUnknown()&&f.lstatSync()}f.shouldWalk(c,o)&&c.add(f)}}}stream(t=this.cwd,e={}){typeof t=="string"?t=this.cwd.resolve(t):t instanceof dt||(e=t,t=this.cwd);const{withFileTypes:s=!0,follow:r=!1,filter:n,walkFilter:o}=e,c=new er({objectMode:!0});(!n||n(t))&&c.write(s?t:t.fullpath());const l=new Set,d=[t];let h=0;const f=()=>{let u=!1;for(;!u;){const g=d.shift();if(!g){h===0&&c.end();return}h++,l.add(g);const y=(E,v,k=!1)=>{if(E)return c.emit("error",E);if(r&&!k){const S=[];for(const _ of v)_.isSymbolicLink()&&S.push(_.realpath().then(T=>T!=null&&T.isUnknown()?T.lstat():T));if(S.length){Promise.all(S).then(()=>y(null,v,!0));return}}for(const S of v)S&&(!n||n(S))&&(c.write(s?S:S.fullpath())||(u=!0));h--;for(const S of v){const _=S.realpathCached()||S;_.shouldWalk(l,o)&&d.push(_)}u&&!c.flowing?c.once("drain",f):b||f()};let b=!0;g.readdirCB(y,!0),b=!1}};return f(),c}streamSync(t=this.cwd,e={}){typeof t=="string"?t=this.cwd.resolve(t):t instanceof dt||(e=t,t=this.cwd);const{withFileTypes:s=!0,follow:r=!1,filter:n,walkFilter:o}=e,c=new er({objectMode:!0}),l=new Set;(!n||n(t))&&c.write(s?t:t.fullpath());const d=[t];let h=0;const f=()=>{let u=!1;for(;!u;){const g=d.shift();if(!g){h===0&&c.end();return}h++,l.add(g);const y=g.readdirSync();for(const b of y)(!n||n(b))&&(c.write(s?b:b.fullpath())||(u=!0));h--;for(const b of y){let E=b;if(b.isSymbolicLink()){if(!(r&&(E=b.realpathSync())))continue;E.isUnknown()&&E.lstatSync()}E.shouldWalk(l,o)&&d.push(E)}}u&&!c.flowing&&c.once("drain",f)};return f(),c}chdir(t=this.cwd){const e=this.cwd;this.cwd=typeof t=="string"?this.cwd.resolve(t):t,this.cwd[ko](e)}}Cs=new WeakMap,_s=new WeakMap,Ei=new WeakMap,Si=new WeakMap;class nn extends jo{constructor(e=process.cwd(),s={}){const{nocase:r=!0}=s;super(e,Mr,"\\",{...s,nocase:r});m(this,"sep","\\");this.nocase=r;for(let n=this.cwd;n;n=n.parent)n.nocase=this.nocase}parseRootPath(e){return Mr.parse(e).root.toUpperCase()}newRoot(e){return new cr(this.rootPath,Ut,void 0,this.roots,this.nocase,this.childrenCache(),{fs:e})}isAbsolute(e){return e.startsWith("/")||e.startsWith("\\")||/^[a-z]:(\/|\\)/i.test(e)}}class an extends jo{constructor(e=process.cwd(),s={}){const{nocase:r=!1}=s;super(e,Ho,"/",{...s,nocase:r});m(this,"sep","/");this.nocase=r}parseRootPath(e){return"/"}newRoot(e){return new lr(this.rootPath,Ut,void 0,this.roots,this.nocase,this.childrenCache(),{fs:e})}isAbsolute(e){return e.startsWith("/")}}class Oo extends an{constructor(t=process.cwd(),e={}){const{nocase:s=!0}=e;super(t,{...e,nocase:s})}}process.platform;const gd=process.platform==="win32"?nn:process.platform==="darwin"?Oo:an,bd=i=>i.length>=1,yd=i=>i.length>=1;var L,bt,K,Qe,zt,ki,Te,Re,je,Ts;const un=class un{constructor(t,e,s,r){w(this,L);w(this,bt);w(this,K);m(this,"length");w(this,Qe);w(this,zt);w(this,ki);w(this,Te);w(this,Re);w(this,je);w(this,Ts,!0);if(!bd(t))throw new TypeError("empty pattern list");if(!yd(e))throw new TypeError("empty glob list");if(e.length!==t.length)throw new TypeError("mismatched pattern list and glob list lengths");if(this.length=t.length,s<0||s>=this.length)throw new TypeError("index out of range");if(p(this,L,t),p(this,bt,e),p(this,K,s),p(this,Qe,r),a(this,K)===0){if(this.isUNC()){const[n,o,c,l,...d]=a(this,L),[h,f,u,g,...y]=a(this,bt);d[0]===""&&(d.shift(),y.shift());const b=[n,o,c,l,""].join("/"),E=[h,f,u,g,""].join("/");p(this,L,[b,...d]),p(this,bt,[E,...y]),this.length=a(this,L).length}else if(this.isDrive()||this.isAbsolute()){const[n,...o]=a(this,L),[c,...l]=a(this,bt);o[0]===""&&(o.shift(),l.shift());const d=n+"/",h=c+"/";p(this,L,[d,...o]),p(this,bt,[h,...l]),this.length=a(this,L).length}}}pattern(){return a(this,L)[a(this,K)]}isString(){return typeof a(this,L)[a(this,K)]=="string"}isGlobstar(){return a(this,L)[a(this,K)]===ct}isRegExp(){return a(this,L)[a(this,K)]instanceof RegExp}globString(){return p(this,ki,a(this,ki)||(a(this,K)===0?this.isAbsolute()?a(this,bt)[0]+a(this,bt).slice(1).join("/"):a(this,bt).join("/"):a(this,bt).slice(a(this,K)).join("/")))}hasMore(){return this.length>a(this,K)+1}rest(){return a(this,zt)!==void 0?a(this,zt):this.hasMore()?(p(this,zt,new un(a(this,L),a(this,bt),a(this,K)+1,a(this,Qe))),p(a(this,zt),je,a(this,je)),p(a(this,zt),Re,a(this,Re)),p(a(this,zt),Te,a(this,Te)),a(this,zt)):p(this,zt,null)}isUNC(){const t=a(this,L);return a(this,Re)!==void 0?a(this,Re):p(this,Re,a(this,Qe)==="win32"&&a(this,K)===0&&t[0]===""&&t[1]===""&&typeof t[2]=="string"&&!!t[2]&&typeof t[3]=="string"&&!!t[3])}isDrive(){const t=a(this,L);return a(this,Te)!==void 0?a(this,Te):p(this,Te,a(this,Qe)==="win32"&&a(this,K)===0&&this.length>1&&typeof t[0]=="string"&&/^[a-z]:$/i.test(t[0]))}isAbsolute(){const t=a(this,L);return a(this,je)!==void 0?a(this,je):p(this,je,t[0]===""&&t.length>1||this.isDrive()||this.isUNC())}root(){const t=a(this,L)[0];return typeof t=="string"&&this.isAbsolute()&&a(this,K)===0?t:""}checkFollowGlobstar(){return!(a(this,K)===0||!this.isGlobstar()||!a(this,Ts))}markFollowGlobstar(){return a(this,K)===0||!this.isGlobstar()||!a(this,Ts)?!1:(p(this,Ts,!1),!0)}};L=new WeakMap,bt=new WeakMap,K=new WeakMap,Qe=new WeakMap,zt=new WeakMap,ki=new WeakMap,Te=new WeakMap,Re=new WeakMap,je=new WeakMap,Ts=new WeakMap;let sr=un;const xd=typeof process=="object"&&process&&typeof process.platform=="string"?process.platform:"linux";class Vr{constructor(t,{nobrace:e,nocase:s,noext:r,noglobstar:n,platform:o=xd}){m(this,"relative");m(this,"relativeChildren");m(this,"absolute");m(this,"absoluteChildren");m(this,"platform");m(this,"mmopts");this.relative=[],this.absolute=[],this.relativeChildren=[],this.absoluteChildren=[],this.platform=o,this.mmopts={dot:!0,nobrace:e,nocase:s,noext:r,noglobstar:n,optimizationLevel:2,platform:o,nocomment:!0,nonegate:!0};for(const c of t)this.add(c)}add(t){const e=new Ae(t,this.mmopts);for(let s=0;s<e.set.length;s++){const r=e.set[s],n=e.globParts[s];if(!r||!n)throw new Error("invalid pattern object");for(;r[0]==="."&&n[0]===".";)r.shift(),n.shift();const o=new sr(r,n,0,this.platform),c=new Ae(o.globString(),this.mmopts),l=n[n.length-1]==="**",d=o.isAbsolute();d?this.absolute.push(c):this.relative.push(c),l&&(d?this.absoluteChildren.push(c):this.relativeChildren.push(c))}}ignored(t){const e=t.fullpath(),s=`${e}/`,r=t.relative()||".",n=`${r}/`;for(const o of this.relative)if(o.match(r)||o.match(n))return!0;for(const o of this.absolute)if(o.match(e)||o.match(s))return!0;return!1}childrenIgnored(t){const e=t.fullpath()+"/",s=(t.relative()||".")+"/";for(const r of this.relativeChildren)if(r.match(s))return!0;for(const r of this.absoluteChildren)if(r.match(e))return!0;return!1}}class on{constructor(t=new Map){m(this,"store");this.store=t}copy(){return new on(new Map(this.store))}hasWalked(t,e){var s;return(s=this.store.get(t.fullpath()))==null?void 0:s.has(e.globString())}storeWalked(t,e){const s=t.fullpath(),r=this.store.get(s);r?r.add(e.globString()):this.store.set(s,new Set([e.globString()]))}}class wd{constructor(){m(this,"store",new Map)}add(t,e,s){const r=(e?2:0)|(s?1:0),n=this.store.get(t);this.store.set(t,n===void 0?r:r&n)}entries(){return[...this.store.entries()].map(([t,e])=>[t,!!(e&2),!!(e&1)])}}class vd{constructor(){m(this,"store",new Map)}add(t,e){if(!t.canReaddir())return;const s=this.store.get(t);s?s.find(r=>r.globString()===e.globString())||s.push(e):this.store.set(t,[e])}get(t){const e=this.store.get(t);if(!e)throw new Error("attempting to walk unknown path");return e}entries(){return this.keys().map(t=>[t,this.store.get(t)])}keys(){return[...this.store.keys()].filter(t=>t.canReaddir())}}class ir{constructor(t,e){m(this,"hasWalkedCache");m(this,"matches",new wd);m(this,"subwalks",new vd);m(this,"patterns");m(this,"follow");m(this,"dot");m(this,"opts");this.opts=t,this.follow=!!t.follow,this.dot=!!t.dot,this.hasWalkedCache=e?e.copy():new on}processPatterns(t,e){this.patterns=e;const s=e.map(r=>[t,r]);for(let[r,n]of s){this.hasWalkedCache.storeWalked(r,n);const o=n.root(),c=n.isAbsolute()&&this.opts.absolute!==!1;if(o){r=r.resolve(o==="/"&&this.opts.root!==void 0?this.opts.root:o);const f=n.rest();if(f)n=f;else{this.matches.add(r,!0,!1);continue}}if(r.isENOENT())continue;let l,d,h=!1;for(;typeof(l=n.pattern())=="string"&&(d=n.rest());)r=r.resolve(l),n=d,h=!0;if(l=n.pattern(),d=n.rest(),h){if(this.hasWalkedCache.hasWalked(r,n))continue;this.hasWalkedCache.storeWalked(r,n)}if(typeof l=="string"){const f=l===".."||l===""||l===".";this.matches.add(r.resolve(l),c,f);continue}else if(l===ct){(!r.isSymbolicLink()||this.follow||n.checkFollowGlobstar())&&this.subwalks.add(r,n);const f=d==null?void 0:d.pattern(),u=d==null?void 0:d.rest();if(!d||(f===""||f===".")&&!u)this.matches.add(r,c,f===""||f===".");else if(f===".."){const g=r.parent||r;u?this.hasWalkedCache.hasWalked(g,u)||this.subwalks.add(g,u):this.matches.add(g,c,!0)}}else l instanceof RegExp&&this.subwalks.add(r,n)}return this}subwalkTargets(){return this.subwalks.keys()}child(){return new ir(this.opts,this.hasWalkedCache)}filterEntries(t,e){const s=this.subwalks.get(t),r=this.child();for(const n of e)for(const o of s){const c=o.isAbsolute(),l=o.pattern(),d=o.rest();l===ct?r.testGlobstar(n,o,d,c):l instanceof RegExp?r.testRegExp(n,l,d,c):r.testString(n,l,d,c)}return r}testGlobstar(t,e,s,r){if((this.dot||!t.name.startsWith("."))&&(e.hasMore()||this.matches.add(t,r,!1),t.canReaddir()&&(this.follow||!t.isSymbolicLink()?this.subwalks.add(t,e):t.isSymbolicLink()&&(s&&e.checkFollowGlobstar()?this.subwalks.add(t,s):e.markFollowGlobstar()&&this.subwalks.add(t,e)))),s){const n=s.pattern();if(typeof n=="string"&&n!==".."&&n!==""&&n!==".")this.testString(t,n,s.rest(),r);else if(n===".."){const o=t.parent||t;this.subwalks.add(o,s)}else n instanceof RegExp&&this.testRegExp(t,n,s.rest(),r)}}testRegExp(t,e,s,r){e.test(t.name)&&(s?this.subwalks.add(t,s):this.matches.add(t,r,!1))}testString(t,e,s,r){t.isNamed(e)&&(s?this.subwalks.add(t,s):this.matches.add(t,r,!1))}}const Ed=(i,t)=>typeof i=="string"?new Vr([i],t):Array.isArray(i)?new Vr(i,t):i;var Rs,ce,ts,kt,Pe,Kr;class Ao{constructor(t,e,s){w(this,kt);m(this,"path");m(this,"patterns");m(this,"opts");m(this,"seen",new Set);m(this,"paused",!1);m(this,"aborted",!1);w(this,Rs,[]);w(this,ce);w(this,ts);m(this,"signal");m(this,"maxDepth");m(this,"includeChildMatches");if(this.patterns=t,this.path=e,this.opts=s,p(this,ts,!s.posix&&s.platform==="win32"?"\\":"/"),this.includeChildMatches=s.includeChildMatches!==!1,(s.ignore||!this.includeChildMatches)&&(p(this,ce,Ed(s.ignore??[],s)),!this.includeChildMatches&&typeof a(this,ce).add!="function")){const r="cannot ignore child matches, ignore lacks add() method.";throw new Error(r)}this.maxDepth=s.maxDepth||1/0,s.signal&&(this.signal=s.signal,this.signal.addEventListener("abort",()=>{a(this,Rs).length=0}))}pause(){this.paused=!0}resume(){var e;if((e=this.signal)!=null&&e.aborted)return;this.paused=!1;let t;for(;!this.paused&&(t=a(this,Rs).shift());)t()}onResume(t){var e;(e=this.signal)!=null&&e.aborted||(this.paused?a(this,Rs).push(t):t())}async matchCheck(t,e){if(e&&this.opts.nodir)return;let s;if(this.opts.realpath){if(s=t.realpathCached()||await t.realpath(),!s)return;t=s}const n=t.isUnknown()||this.opts.stat?await t.lstat():t;if(this.opts.follow&&this.opts.nodir&&(n!=null&&n.isSymbolicLink())){const o=await n.realpath();o&&(o.isUnknown()||this.opts.stat)&&await o.lstat()}return this.matchCheckTest(n,e)}matchCheckTest(t,e){var s;return t&&(this.maxDepth===1/0||t.depth()<=this.maxDepth)&&(!e||t.canReaddir())&&(!this.opts.nodir||!t.isDirectory())&&(!this.opts.nodir||!this.opts.follow||!t.isSymbolicLink()||!((s=t.realpathCached())!=null&&s.isDirectory()))&&!x(this,kt,Pe).call(this,t)?t:void 0}matchCheckSync(t,e){if(e&&this.opts.nodir)return;let s;if(this.opts.realpath){if(s=t.realpathCached()||t.realpathSync(),!s)return;t=s}const n=t.isUnknown()||this.opts.stat?t.lstatSync():t;if(this.opts.follow&&this.opts.nodir&&(n!=null&&n.isSymbolicLink())){const o=n.realpathSync();o&&(o!=null&&o.isUnknown()||this.opts.stat)&&o.lstatSync()}return this.matchCheckTest(n,e)}matchFinish(t,e){var n;if(x(this,kt,Pe).call(this,t))return;if(!this.includeChildMatches&&((n=a(this,ce))!=null&&n.add)){const o=`${t.relativePosix()}/**`;a(this,ce).add(o)}const s=this.opts.absolute===void 0?e:this.opts.absolute;this.seen.add(t);const r=this.opts.mark&&t.isDirectory()?a(this,ts):"";if(this.opts.withFileTypes)this.matchEmit(t);else if(s){const o=this.opts.posix?t.fullpathPosix():t.fullpath();this.matchEmit(o+r)}else{const o=this.opts.posix?t.relativePosix():t.relative(),c=this.opts.dotRelative&&!o.startsWith(".."+a(this,ts))?"."+a(this,ts):"";this.matchEmit(o?c+o+r:"."+r)}}async match(t,e,s){const r=await this.matchCheck(t,s);r&&this.matchFinish(r,e)}matchSync(t,e,s){const r=this.matchCheckSync(t,s);r&&this.matchFinish(r,e)}walkCB(t,e,s){var r;(r=this.signal)!=null&&r.aborted&&s(),this.walkCB2(t,e,new ir(this.opts),s)}walkCB2(t,e,s,r){var c;if(x(this,kt,Kr).call(this,t))return r();if((c=this.signal)!=null&&c.aborted&&r(),this.paused){this.onResume(()=>this.walkCB2(t,e,s,r));return}s.processPatterns(t,e);let n=1;const o=()=>{--n===0&&r()};for(const[l,d,h]of s.matches.entries())x(this,kt,Pe).call(this,l)||(n++,this.match(l,d,h).then(()=>o()));for(const l of s.subwalkTargets()){if(this.maxDepth!==1/0&&l.depth()>=this.maxDepth)continue;n++;const d=l.readdirCached();l.calledReaddir()?this.walkCB3(l,d,s,o):l.readdirCB((h,f)=>this.walkCB3(l,f,s,o),!0)}o()}walkCB3(t,e,s,r){s=s.filterEntries(t,e);let n=1;const o=()=>{--n===0&&r()};for(const[c,l,d]of s.matches.entries())x(this,kt,Pe).call(this,c)||(n++,this.match(c,l,d).then(()=>o()));for(const[c,l]of s.subwalks.entries())n++,this.walkCB2(c,l,s.child(),o);o()}walkCBSync(t,e,s){var r;(r=this.signal)!=null&&r.aborted&&s(),this.walkCB2Sync(t,e,new ir(this.opts),s)}walkCB2Sync(t,e,s,r){var c;if(x(this,kt,Kr).call(this,t))return r();if((c=this.signal)!=null&&c.aborted&&r(),this.paused){this.onResume(()=>this.walkCB2Sync(t,e,s,r));return}s.processPatterns(t,e);let n=1;const o=()=>{--n===0&&r()};for(const[l,d,h]of s.matches.entries())x(this,kt,Pe).call(this,l)||this.matchSync(l,d,h);for(const l of s.subwalkTargets()){if(this.maxDepth!==1/0&&l.depth()>=this.maxDepth)continue;n++;const d=l.readdirSync();this.walkCB3Sync(l,d,s,o)}o()}walkCB3Sync(t,e,s,r){s=s.filterEntries(t,e);let n=1;const o=()=>{--n===0&&r()};for(const[c,l,d]of s.matches.entries())x(this,kt,Pe).call(this,c)||this.matchSync(c,l,d);for(const[c,l]of s.subwalks.entries())n++,this.walkCB2Sync(c,l,s.child(),o);o()}}Rs=new WeakMap,ce=new WeakMap,ts=new WeakMap,kt=new WeakSet,Pe=function(t){var e,s;return this.seen.has(t)||!!((s=(e=a(this,ce))==null?void 0:e.ignored)!=null&&s.call(e,t))},Kr=function(t){var e,s;return!!((s=(e=a(this,ce))==null?void 0:e.childrenIgnored)!=null&&s.call(e,t))};class Ln extends Ao{constructor(e,s,r){super(e,s,r);m(this,"matches",new Set)}matchEmit(e){this.matches.add(e)}async walk(){var e;if((e=this.signal)!=null&&e.aborted)throw this.signal.reason;return this.path.isUnknown()&&await this.path.lstat(),await new Promise((s,r)=>{this.walkCB(this.path,this.patterns,()=>{var n;(n=this.signal)!=null&&n.aborted?r(this.signal.reason):s(this.matches)})}),this.matches}walkSync(){var e;if((e=this.signal)!=null&&e.aborted)throw this.signal.reason;return this.path.isUnknown()&&this.path.lstatSync(),this.walkCBSync(this.path,this.patterns,()=>{var s;if((s=this.signal)!=null&&s.aborted)throw this.signal.reason}),this.matches}}class Bn extends Ao{constructor(e,s,r){super(e,s,r);m(this,"results");this.results=new er({signal:this.signal,objectMode:!0}),this.results.on("drain",()=>this.resume()),this.results.on("resume",()=>this.resume())}matchEmit(e){this.results.write(e),this.results.flowing||this.pause()}stream(){const e=this.path;return e.isUnknown()?e.lstat().then(()=>{this.walkCB(e,this.patterns,()=>this.results.end())}):this.walkCB(e,this.patterns,()=>this.results.end()),this.results}streamSync(){return this.path.isUnknown()&&this.path.lstatSync(),this.walkCBSync(this.path,this.patterns,()=>this.results.end()),this.results}}const Sd=typeof process=="object"&&process&&typeof process.platform=="string"?process.platform:"linux";class Me{constructor(t,e){m(this,"absolute");m(this,"cwd");m(this,"root");m(this,"dot");m(this,"dotRelative");m(this,"follow");m(this,"ignore");m(this,"magicalBraces");m(this,"mark");m(this,"matchBase");m(this,"maxDepth");m(this,"nobrace");m(this,"nocase");m(this,"nodir");m(this,"noext");m(this,"noglobstar");m(this,"pattern");m(this,"platform");m(this,"realpath");m(this,"scurry");m(this,"stat");m(this,"signal");m(this,"windowsPathsNoEscape");m(this,"withFileTypes");m(this,"includeChildMatches");m(this,"opts");m(this,"patterns");if(!e)throw new TypeError("glob options required");if(this.withFileTypes=!!e.withFileTypes,this.signal=e.signal,this.follow=!!e.follow,this.dot=!!e.dot,this.dotRelative=!!e.dotRelative,this.nodir=!!e.nodir,this.mark=!!e.mark,e.cwd?(e.cwd instanceof URL||e.cwd.startsWith("file://"))&&(e.cwd=ja(e.cwd)):this.cwd="",this.cwd=e.cwd||"",this.root=e.root,this.magicalBraces=!!e.magicalBraces,this.nobrace=!!e.nobrace,this.noext=!!e.noext,this.realpath=!!e.realpath,this.absolute=e.absolute,this.includeChildMatches=e.includeChildMatches!==!1,this.noglobstar=!!e.noglobstar,this.matchBase=!!e.matchBase,this.maxDepth=typeof e.maxDepth=="number"?e.maxDepth:1/0,this.stat=!!e.stat,this.ignore=e.ignore,this.withFileTypes&&this.absolute!==void 0)throw new Error("cannot set absolute and withFileTypes:true");if(typeof t=="string"&&(t=[t]),this.windowsPathsNoEscape=!!e.windowsPathsNoEscape||e.allowWindowsEscape===!1,this.windowsPathsNoEscape&&(t=t.map(l=>l.replace(/\\/g,"/"))),this.matchBase){if(e.noglobstar)throw new TypeError("base matching requires globstar");t=t.map(l=>l.includes("/")?l:`./**/${l}`)}if(this.pattern=t,this.platform=e.platform||Sd,this.opts={...e,platform:this.platform},e.scurry){if(this.scurry=e.scurry,e.nocase!==void 0&&e.nocase!==e.scurry.nocase)throw new Error("nocase option contradicts provided scurry option")}else{const l=e.platform==="win32"?nn:e.platform==="darwin"?Oo:e.platform?an:gd;this.scurry=new l(this.cwd,{nocase:e.nocase,fs:e.fs})}this.nocase=this.scurry.nocase;const s=this.platform==="darwin"||this.platform==="win32",r={...e,dot:this.dot,matchBase:this.matchBase,nobrace:this.nobrace,nocase:this.nocase,nocaseMagicOnly:s,nocomment:!0,noext:this.noext,nonegate:!0,optimizationLevel:2,platform:this.platform,windowsPathsNoEscape:this.windowsPathsNoEscape,debug:!!this.opts.debug},n=this.pattern.map(l=>new Ae(l,r)),[o,c]=n.reduce((l,d)=>(l[0].push(...d.set),l[1].push(...d.globParts),l),[[],[]]);this.patterns=o.map((l,d)=>{const h=c[d];if(!h)throw new Error("invalid pattern object");return new sr(l,h,0,this.platform)})}async walk(){return[...await new Ln(this.patterns,this.scurry.cwd,{...this.opts,maxDepth:this.maxDepth!==1/0?this.maxDepth+this.scurry.cwd.depth():1/0,platform:this.platform,nocase:this.nocase,includeChildMatches:this.includeChildMatches}).walk()]}walkSync(){return[...new Ln(this.patterns,this.scurry.cwd,{...this.opts,maxDepth:this.maxDepth!==1/0?this.maxDepth+this.scurry.cwd.depth():1/0,platform:this.platform,nocase:this.nocase,includeChildMatches:this.includeChildMatches}).walkSync()]}stream(){return new Bn(this.patterns,this.scurry.cwd,{...this.opts,maxDepth:this.maxDepth!==1/0?this.maxDepth+this.scurry.cwd.depth():1/0,platform:this.platform,nocase:this.nocase,includeChildMatches:this.includeChildMatches}).stream()}streamSync(){return new Bn(this.patterns,this.scurry.cwd,{...this.opts,maxDepth:this.maxDepth!==1/0?this.maxDepth+this.scurry.cwd.depth():1/0,platform:this.platform,nocase:this.nocase,includeChildMatches:this.includeChildMatches}).streamSync()}iterateSync(){return this.streamSync()[Symbol.iterator]()}[Symbol.iterator](){return this.iterateSync()}iterate(){return this.stream()[Symbol.asyncIterator]()}[Symbol.asyncIterator](){return this.iterate()}}const Mo=(i,t={})=>{Array.isArray(i)||(i=[i]);for(const e of i)if(new Ae(e,t).hasMagic())return!0;return!1};function Ti(i,t={}){return new Me(i,t).streamSync()}function cn(i,t={}){return new Me(i,t).stream()}function ln(i,t={}){return new Me(i,t).walkSync()}async function zn(i,t={}){return new Me(i,t).walk()}function Ri(i,t={}){return new Me(i,t).iterateSync()}function dn(i,t={}){return new Me(i,t).iterate()}const Io=Ti,Fo=Object.assign(cn,{sync:Ti}),Do=Ri,$o=Object.assign(dn,{sync:Ri}),Po=Object.assign(ln,{stream:Ti,iterate:Ri}),Jr=Object.assign(zn,{glob:zn,globSync:ln,sync:Po,globStream:cn,stream:Fo,globStreamSync:Ti,streamSync:Io,globIterate:dn,iterate:$o,globIterateSync:Ri,iterateSync:Do,Glob:Me,hasMagic:Mo,escape:rn,unescape:Le});Jr.glob=Jr;const kd=Object.freeze(Object.defineProperty({__proto__:null,Glob:Me,Ignore:Vr,escape:rn,glob:Jr,globIterate:dn,globIterateSync:Ri,globStream:cn,globStreamSync:Ti,globSync:ln,hasMagic:Mo,iterate:$o,iterateSync:Do,stream:Fo,streamSync:Io,sync:Po,unescape:Le},Symbol.toStringTag,{value:"Module"})),Cd=Object.freeze(Object.defineProperty({__proto__:null},Symbol.toStringTag,{value:"Module"}));function _d(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}var hn={exports:{}};function No(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var _t={};_t.getBooleanOption=(i,t)=>{let e=!1;if(t in i&&typeof(e=i[t])!="boolean")throw new TypeError(`Expected the "${t}" option to be a boolean`);return e};_t.cppdb=Symbol();_t.inspect=Symbol.for("nodejs.util.inspect.custom");const Yr={value:"SqliteError",writable:!0,enumerable:!1,configurable:!0};function es(i,t){if(new.target!==es)return new es(i,t);if(typeof t!="string")throw new TypeError("Expected second argument to be a string");Error.call(this,i),Yr.value=""+i,Object.defineProperty(this,"message",Yr),Error.captureStackTrace(this,es),this.code=t}Object.setPrototypeOf(es,Error);Object.setPrototypeOf(es.prototype,Error.prototype);Object.defineProperty(es.prototype,"name",Yr);var Lo=es,Ni={exports:{}},Sr,Hn;function Td(){if(Hn)return Sr;Hn=1;var i=ar.sep||"/";Sr=t;function t(e){if(typeof e!="string"||e.length<=7||e.substring(0,7)!="file://")throw new TypeError("must pass in a file:// URI to convert to a file path");var s=decodeURI(e.substring(7)),r=s.indexOf("/"),n=s.substring(0,r),o=s.substring(r+1);return n=="localhost"&&(n=""),n&&(n=i+i+n),o=o.replace(/^(.+)\|/,"$1:"),i=="\\"&&(o=o.replace(/\//g,"\\")),/^.+\:/.test(o)||(o=i+o),n+o}return Sr}var Wn;function Rd(){return Wn||(Wn=1,function(i,t){var e={},s=Zr,r=ar,n=Td(),o=r.join,c=r.dirname,l=s.accessSync&&function(f){try{s.accessSync(f)}catch{return!1}return!0}||s.existsSync||r.existsSync,d={arrow:e.NODE_BINDINGS_ARROW||" → ",compiled:e.NODE_BINDINGS_COMPILED_DIR||"compiled",platform:process.platform,arch:process.arch,nodePreGyp:"node-v"+process.versions.modules+"-"+process.platform+"-"+process.arch,version:process.versions.node,bindings:"bindings.node",try:[["module_root","build","bindings"],["module_root","build","Debug","bindings"],["module_root","build","Release","bindings"],["module_root","out","Debug","bindings"],["module_root","Debug","bindings"],["module_root","out","Release","bindings"],["module_root","Release","bindings"],["module_root","build","default","bindings"],["module_root","compiled","version","platform","arch","bindings"],["module_root","addon-build","release","install-root","bindings"],["module_root","addon-build","debug","install-root","bindings"],["module_root","addon-build","default","install-root","bindings"],["module_root","lib","binding","nodePreGyp","bindings"]]};function h(f){typeof f=="string"?f={bindings:f}:f||(f={}),Object.keys(d).map(function(S){S in f||(f[S]=d[S])}),f.module_root||(f.module_root=t.getRoot(t.getFileName())),r.extname(f.bindings)!=".node"&&(f.bindings+=".node");for(var u=typeof __webpack_require__=="function"?__non_webpack_require__:No,g=[],y=0,b=f.try.length,E,v,k;y<b;y++){E=o.apply(null,f.try[y].map(function(S){return f[S]||S})),g.push(E);try{return v=f.path?u.resolve(E):u(E),f.path||(v.path=E),v}catch(S){if(S.code!=="MODULE_NOT_FOUND"&&S.code!=="QUALIFIED_PATH_RESOLUTION_FAILED"&&!/not find/i.test(S.message))throw S}}throw k=new Error(`Could not locate the bindings file. Tried:
`+g.map(function(S){return f.arrow+S}).join(`
`)),k.tries=g,k}i.exports=t=h,t.getFileName=function(u){var g=Error.prepareStackTrace,y=Error.stackTraceLimit,b={},E;Error.stackTraceLimit=10,Error.prepareStackTrace=function(k,S){for(var _=0,T=S.length;_<T;_++)if(E=S[_].getFileName(),E!==__filename)if(u){if(E!==u)return}else return},Error.captureStackTrace(b),b.stack,Error.prepareStackTrace=g,Error.stackTraceLimit=y;var v="file://";return E.indexOf(v)===0&&(E=n(E)),E},t.getRoot=function(u){for(var g=c(u),y;;){if(g==="."&&(g=process.cwd()),l(o(g,"package.json"))||l(o(g,"node_modules")))return g;if(y===g)throw new Error('Could not find module root given file: "'+u+'". Do you have a `package.json` file? ');y=g,g=o(g,"..")}}}(Ni,Ni.exports)),Ni.exports}var Zt={},Un;function jd(){if(Un)return Zt;Un=1;const{cppdb:i}=_t;return Zt.prepare=function(e){return this[i].prepare(e,this,!1)},Zt.exec=function(e){return this[i].exec(e),this},Zt.close=function(){return this[i].close(),this},Zt.loadExtension=function(...e){return this[i].loadExtension(...e),this},Zt.defaultSafeIntegers=function(...e){return this[i].defaultSafeIntegers(...e),this},Zt.unsafeMode=function(...e){return this[i].unsafeMode(...e),this},Zt.getters={name:{get:function(){return this[i].name},enumerable:!0},open:{get:function(){return this[i].open},enumerable:!0},inTransaction:{get:function(){return this[i].inTransaction},enumerable:!0},readonly:{get:function(){return this[i].readonly},enumerable:!0},memory:{get:function(){return this[i].memory},enumerable:!0}},Zt}var kr,qn;function Od(){if(qn)return kr;qn=1;const{cppdb:i}=_t,t=new WeakMap;kr=function(n){if(typeof n!="function")throw new TypeError("Expected first argument to be a function");const o=this[i],c=e(o,this),{apply:l}=Function.prototype,d={default:{value:s(l,n,o,c.default)},deferred:{value:s(l,n,o,c.deferred)},immediate:{value:s(l,n,o,c.immediate)},exclusive:{value:s(l,n,o,c.exclusive)},database:{value:this,enumerable:!0}};return Object.defineProperties(d.default.value,d),Object.defineProperties(d.deferred.value,d),Object.defineProperties(d.immediate.value,d),Object.defineProperties(d.exclusive.value,d),d.default.value};const e=(r,n)=>{let o=t.get(r);if(!o){const c={commit:r.prepare("COMMIT",n,!1),rollback:r.prepare("ROLLBACK",n,!1),savepoint:r.prepare("SAVEPOINT `	_bs3.	`",n,!1),release:r.prepare("RELEASE `	_bs3.	`",n,!1),rollbackTo:r.prepare("ROLLBACK TO `	_bs3.	`",n,!1)};t.set(r,o={default:Object.assign({begin:r.prepare("BEGIN",n,!1)},c),deferred:Object.assign({begin:r.prepare("BEGIN DEFERRED",n,!1)},c),immediate:Object.assign({begin:r.prepare("BEGIN IMMEDIATE",n,!1)},c),exclusive:Object.assign({begin:r.prepare("BEGIN EXCLUSIVE",n,!1)},c)})}return o},s=(r,n,o,{begin:c,commit:l,rollback:d,savepoint:h,release:f,rollbackTo:u})=>function(){let y,b,E;o.inTransaction?(y=h,b=f,E=u):(y=c,b=l,E=d),y.run();try{const v=r.call(n,this,arguments);return b.run(),v}catch(v){throw o.inTransaction&&(E.run(),E!==d&&b.run()),v}};return kr}var Cr,Gn;function Ad(){if(Gn)return Cr;Gn=1;const{getBooleanOption:i,cppdb:t}=_t;return Cr=function(s,r){if(r==null&&(r={}),typeof s!="string")throw new TypeError("Expected first argument to be a string");if(typeof r!="object")throw new TypeError("Expected second argument to be an options object");const n=i(r,"simple"),o=this[t].prepare(`PRAGMA ${s}`,this,!0);return n?o.pluck().get():o.all()},Cr}var _r,Vn;function Md(){if(Vn)return _r;Vn=1;const i=Zr,t=ar,{promisify:e}=tc,{cppdb:s}=_t,r=e(i.access);_r=async function(c,l){if(l==null&&(l={}),typeof c!="string")throw new TypeError("Expected first argument to be a string");if(typeof l!="object")throw new TypeError("Expected second argument to be an options object");c=c.trim();const d="attached"in l?l.attached:"main",h="progress"in l?l.progress:null;if(!c)throw new TypeError("Backup filename cannot be an empty string");if(c===":memory:")throw new TypeError('Invalid backup filename ":memory:"');if(typeof d!="string")throw new TypeError('Expected the "attached" option to be a string');if(!d)throw new TypeError('The "attached" option cannot be an empty string');if(h!=null&&typeof h!="function")throw new TypeError('Expected the "progress" option to be a function');await r(t.dirname(c)).catch(()=>{throw new TypeError("Cannot save backup because the directory does not exist")});const f=await r(c).then(()=>!1,()=>!0);return n(this[s].backup(this,d,c,f),h||null)};const n=(o,c)=>{let l=0,d=!0;return new Promise((h,f)=>{setImmediate(function u(){try{const g=o.transfer(l);if(!g.remainingPages){o.close(),h(g);return}if(d&&(d=!1,l=100),c){const y=c(g);if(y!==void 0)if(typeof y=="number"&&y===y)l=Math.max(0,Math.min(2147483647,Math.round(y)));else throw new TypeError("Expected progress callback to return a number or undefined")}setImmediate(u)}catch(g){o.close(),f(g)}})})};return _r}var Tr,Kn;function Id(){if(Kn)return Tr;Kn=1;const{cppdb:i}=_t;return Tr=function(e){if(e==null&&(e={}),typeof e!="object")throw new TypeError("Expected first argument to be an options object");const s="attached"in e?e.attached:"main";if(typeof s!="string")throw new TypeError('Expected the "attached" option to be a string');if(!s)throw new TypeError('The "attached" option cannot be an empty string');return this[i].serialize(s)},Tr}var Rr,Jn;function Fd(){if(Jn)return Rr;Jn=1;const{getBooleanOption:i,cppdb:t}=_t;return Rr=function(s,r,n){if(r==null&&(r={}),typeof r=="function"&&(n=r,r={}),typeof s!="string")throw new TypeError("Expected first argument to be a string");if(typeof n!="function")throw new TypeError("Expected last argument to be a function");if(typeof r!="object")throw new TypeError("Expected second argument to be an options object");if(!s)throw new TypeError("User-defined function name cannot be an empty string");const o="safeIntegers"in r?+i(r,"safeIntegers"):2,c=i(r,"deterministic"),l=i(r,"directOnly"),d=i(r,"varargs");let h=-1;if(!d){if(h=n.length,!Number.isInteger(h)||h<0)throw new TypeError("Expected function.length to be a positive integer");if(h>100)throw new RangeError("User-defined functions cannot have more than 100 arguments")}return this[t].function(n,s,h,o,c,l),this},Rr}var jr,Yn;function Dd(){if(Yn)return jr;Yn=1;const{getBooleanOption:i,cppdb:t}=_t;jr=function(n,o){if(typeof n!="string")throw new TypeError("Expected first argument to be a string");if(typeof o!="object"||o===null)throw new TypeError("Expected second argument to be an options object");if(!n)throw new TypeError("User-defined function name cannot be an empty string");const c="start"in o?o.start:null,l=e(o,"step",!0),d=e(o,"inverse",!1),h=e(o,"result",!1),f="safeIntegers"in o?+i(o,"safeIntegers"):2,u=i(o,"deterministic"),g=i(o,"directOnly"),y=i(o,"varargs");let b=-1;if(!y&&(b=Math.max(s(l),d?s(d):0),b>0&&(b-=1),b>100))throw new RangeError("User-defined functions cannot have more than 100 arguments");return this[t].aggregate(c,l,d,h,n,b,f,u,g),this};const e=(r,n,o)=>{const c=n in r?r[n]:null;if(typeof c=="function")return c;if(c!=null)throw new TypeError(`Expected the "${n}" option to be a function`);if(o)throw new TypeError(`Missing required option "${n}"`);return null},s=({length:r})=>{if(Number.isInteger(r)&&r>=0)return r;throw new TypeError("Expected function.length to be a positive integer")};return jr}var Or,Zn;function $d(){if(Zn)return Or;Zn=1;const{cppdb:i}=_t;Or=function(g,y){if(typeof g!="string")throw new TypeError("Expected first argument to be a string");if(!g)throw new TypeError("Virtual table module name cannot be an empty string");let b=!1;if(typeof y=="object"&&y!==null)b=!0,y=f(e(y,"used",g));else{if(typeof y!="function")throw new TypeError("Expected second argument to be a function or a table definition object");y=t(y)}return this[i].table(y,g,b),this};function t(u){return function(y,b,E,...v){const k={module:y,database:b,table:E},S=l.call(u,k,v);if(typeof S!="object"||S===null)throw new TypeError(`Virtual table module "${y}" did not return a table definition object`);return e(S,"returned",y)}}function e(u,g,y){if(!c.call(u,"rows"))throw new TypeError(`Virtual table module "${y}" ${g} a table definition without a "rows" property`);if(!c.call(u,"columns"))throw new TypeError(`Virtual table module "${y}" ${g} a table definition without a "columns" property`);const b=u.rows;if(typeof b!="function"||Object.getPrototypeOf(b)!==d)throw new TypeError(`Virtual table module "${y}" ${g} a table definition with an invalid "rows" property (should be a generator function)`);let E=u.columns;if(!Array.isArray(E)||!(E=[...E]).every(T=>typeof T=="string"))throw new TypeError(`Virtual table module "${y}" ${g} a table definition with an invalid "columns" property (should be an array of strings)`);if(E.length!==new Set(E).size)throw new TypeError(`Virtual table module "${y}" ${g} a table definition with duplicate column names`);if(!E.length)throw new RangeError(`Virtual table module "${y}" ${g} a table definition with zero columns`);let v;if(c.call(u,"parameters")){if(v=u.parameters,!Array.isArray(v)||!(v=[...v]).every(T=>typeof T=="string"))throw new TypeError(`Virtual table module "${y}" ${g} a table definition with an invalid "parameters" property (should be an array of strings)`)}else v=o(b);if(v.length!==new Set(v).size)throw new TypeError(`Virtual table module "${y}" ${g} a table definition with duplicate parameter names`);if(v.length>32)throw new RangeError(`Virtual table module "${y}" ${g} a table definition with more than the maximum number of 32 parameters`);for(const T of v)if(E.includes(T))throw new TypeError(`Virtual table module "${y}" ${g} a table definition with column "${T}" which was ambiguously defined as both a column and parameter`);let k=2;if(c.call(u,"safeIntegers")){const T=u.safeIntegers;if(typeof T!="boolean")throw new TypeError(`Virtual table module "${y}" ${g} a table definition with an invalid "safeIntegers" property (should be a boolean)`);k=+T}let S=!1;if(c.call(u,"directOnly")&&(S=u.directOnly,typeof S!="boolean"))throw new TypeError(`Virtual table module "${y}" ${g} a table definition with an invalid "directOnly" property (should be a boolean)`);return[`CREATE TABLE x(${[...v.map(h).map(T=>`${T} HIDDEN`),...E.map(h)].join(", ")});`,s(b,new Map(E.map((T,Y)=>[T,v.length+Y])),y),v,k,S]}function s(u,g,y){return function*(...E){const v=E.map(k=>Buffer.isBuffer(k)?Buffer.from(k):k);for(let k=0;k<g.size;++k)v.push(null);for(const k of u(...E))if(Array.isArray(k))r(k,v,g.size,y),yield v;else if(typeof k=="object"&&k!==null)n(k,v,g,y),yield v;else throw new TypeError(`Virtual table module "${y}" yielded something that isn't a valid row object`)}}function r(u,g,y,b){if(u.length!==y)throw new TypeError(`Virtual table module "${b}" yielded a row with an incorrect number of columns`);const E=g.length-y;for(let v=0;v<y;++v)g[v+E]=u[v]}function n(u,g,y,b){let E=0;for(const v of Object.keys(u)){const k=y.get(v);if(k===void 0)throw new TypeError(`Virtual table module "${b}" yielded a row with an undeclared column "${v}"`);g[k]=u[v],E+=1}if(E!==y.size)throw new TypeError(`Virtual table module "${b}" yielded a row with missing columns`)}function o({length:u}){if(!Number.isInteger(u)||u<0)throw new TypeError("Expected function.length to be a positive integer");const g=[];for(let y=0;y<u;++y)g.push(`$${y+1}`);return g}const{hasOwnProperty:c}=Object.prototype,{apply:l}=Function.prototype,d=Object.getPrototypeOf(function*(){}),h=u=>`"${u.replace(/"/g,'""')}"`,f=u=>()=>u;return Or}var Ar,Xn;function Pd(){if(Xn)return Ar;Xn=1;const i=function(){};return Ar=function(e,s){return Object.assign(new i,this)},Ar}const Nd=Zr,Qn=ar,Yi=_t,Ld=Lo;let ta;function et(i,t){if(new.target==null)return new et(i,t);let e;if(Buffer.isBuffer(i)&&(e=i,i=":memory:"),i==null&&(i=""),t==null&&(t={}),typeof i!="string")throw new TypeError("Expected first argument to be a string");if(typeof t!="object")throw new TypeError("Expected second argument to be an options object");if("readOnly"in t)throw new TypeError('Misspelled option "readOnly" should be "readonly"');if("memory"in t)throw new TypeError('Option "memory" was removed in v7.0.0 (use ":memory:" filename instead)');const s=i.trim(),r=s===""||s===":memory:",n=Yi.getBooleanOption(t,"readonly"),o=Yi.getBooleanOption(t,"fileMustExist"),c="timeout"in t?t.timeout:5e3,l="verbose"in t?t.verbose:null,d="nativeBinding"in t?t.nativeBinding:null;if(n&&r&&!e)throw new TypeError("In-memory/temporary databases cannot be readonly");if(!Number.isInteger(c)||c<0)throw new TypeError('Expected the "timeout" option to be a positive integer');if(c>2147483647)throw new RangeError('Option "timeout" cannot be greater than 2147483647');if(l!=null&&typeof l!="function")throw new TypeError('Expected the "verbose" option to be a function');if(d!=null&&typeof d!="string"&&typeof d!="object")throw new TypeError('Expected the "nativeBinding" option to be a string or addon object');let h;if(d==null?h=ta||(ta=Rd()("better_sqlite3.node")):typeof d=="string"?h=(typeof __non_webpack_require__=="function"?__non_webpack_require__:No)(Qn.resolve(d).replace(/(\.node)?$/,".node")):h=d,h.isInitialized||(h.setErrorConstructor(Ld),h.isInitialized=!0),!r&&!Nd.existsSync(Qn.dirname(s)))throw new TypeError("Cannot open database because the directory does not exist");Object.defineProperties(this,{[Yi.cppdb]:{value:new h.Database(s,i,r,n,o,c,l||null,e||null)},...rs.getters})}const rs=jd();et.prototype.prepare=rs.prepare;et.prototype.transaction=Od();et.prototype.pragma=Ad();et.prototype.backup=Md();et.prototype.serialize=Id();et.prototype.function=Fd();et.prototype.aggregate=Dd();et.prototype.table=$d();et.prototype.loadExtension=rs.loadExtension;et.prototype.exec=rs.exec;et.prototype.close=rs.close;et.prototype.defaultSafeIntegers=rs.defaultSafeIntegers;et.prototype.unsafeMode=rs.unsafeMode;et.prototype[Yi.inspect]=Pd();var Bd=et;hn.exports=Bd;hn.exports.SqliteError=Lo;var zd=hn.exports;const Hd=_d(zd),Wd=Object.freeze(Object.defineProperty({__proto__:null,default:Hd},Symbol.toStringTag,{value:"Module"}));export{vn as default};
