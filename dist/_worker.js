var Mt=Object.defineProperty;var Ye=t=>{throw TypeError(t)};var Ft=(t,e,s)=>e in t?Mt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[e]=s;var g=(t,e,s)=>Ft(t,typeof e!="symbol"?e+"":e,s),Pe=(t,e,s)=>e.has(t)||Ye("Cannot "+s);var i=(t,e,s)=>(Pe(t,e,"read from private field"),s?s.call(t):e.get(t)),b=(t,e,s)=>e.has(t)?Ye("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,s),h=(t,e,s,r)=>(Pe(t,e,"write to private field"),r?r.call(t,s):e.set(t,s),s),v=(t,e,s)=>(Pe(t,e,"access private method"),s);var Je=(t,e,s,r)=>({set _(a){h(t,e,a,s)},get _(){return i(t,e,r)}});var Ve=(t,e,s)=>(r,a)=>{let n=-1;return o(0);async function o(d){if(d<=n)throw new Error("next() called multiple times");n=d;let l,c=!1,u;if(t[d]?(u=t[d][0][0],r.req.routeIndex=d):u=d===t.length&&a||void 0,u)try{l=await u(r,()=>o(d+1))}catch(f){if(f instanceof Error&&e)r.error=f,l=await e(f,r),c=!0;else throw f}else r.finalized===!1&&s&&(l=await s(r));return l&&(r.finalized===!1||c)&&(r.res=l),r}},Tt=Symbol(),At=async(t,e=Object.create(null))=>{const{all:s=!1,dot:r=!1}=e,n=(t instanceof pt?t.raw.headers:t.headers).get("Content-Type");return n!=null&&n.startsWith("multipart/form-data")||n!=null&&n.startsWith("application/x-www-form-urlencoded")?Ot(t,{all:s,dot:r}):{}};async function Ot(t,e){const s=await t.formData();return s?Dt(s,e):{}}function Dt(t,e){const s=Object.create(null);return t.forEach((r,a)=>{e.all||a.endsWith("[]")?Ht(s,a,r):s[a]=r}),e.dot&&Object.entries(s).forEach(([r,a])=>{r.includes(".")&&(Bt(s,r,a),delete s[r])}),s}var Ht=(t,e,s)=>{t[e]!==void 0?Array.isArray(t[e])?t[e].push(s):t[e]=[t[e],s]:e.endsWith("[]")?t[e]=[s]:t[e]=s},Bt=(t,e,s)=>{let r=t;const a=e.split(".");a.forEach((n,o)=>{o===a.length-1?r[n]=s:((!r[n]||typeof r[n]!="object"||Array.isArray(r[n])||r[n]instanceof File)&&(r[n]=Object.create(null)),r=r[n])})},ct=t=>{const e=t.split("/");return e[0]===""&&e.shift(),e},Lt=t=>{const{groups:e,path:s}=Nt(t),r=ct(s);return Pt(r,e)},Nt=t=>{const e=[];return t=t.replace(/\{[^}]+\}/g,(s,r)=>{const a=`@${r}`;return e.push([a,s]),a}),{groups:e,path:t}},Pt=(t,e)=>{for(let s=e.length-1;s>=0;s--){const[r]=e[s];for(let a=t.length-1;a>=0;a--)if(t[a].includes(r)){t[a]=t[a].replace(r,e[s][1]);break}}return t},$e={},qt=(t,e)=>{if(t==="*")return"*";const s=t.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(s){const r=`${t}#${e}`;return $e[r]||(s[2]?$e[r]=e&&e[0]!==":"&&e[0]!=="*"?[r,s[1],new RegExp(`^${s[2]}(?=/${e})`)]:[t,s[1],new RegExp(`^${s[2]}$`)]:$e[r]=[t,s[1],!0]),$e[r]}return null},We=(t,e)=>{try{return e(t)}catch{return t.replace(/(?:%[0-9A-Fa-f]{2})+/g,s=>{try{return e(s)}catch{return s}})}},Ut=t=>We(t,decodeURI),lt=t=>{const e=t.url,s=e.indexOf("/",e.indexOf(":")+4);let r=s;for(;r<e.length;r++){const a=e.charCodeAt(r);if(a===37){const n=e.indexOf("?",r),o=e.slice(s,n===-1?void 0:n);return Ut(o.includes("%25")?o.replace(/%25/g,"%2525"):o)}else if(a===63)break}return e.slice(s,r)},zt=t=>{const e=lt(t);return e.length>1&&e.at(-1)==="/"?e.slice(0,-1):e},oe=(t,e,...s)=>(s.length&&(e=oe(e,...s)),`${(t==null?void 0:t[0])==="/"?"":"/"}${t}${e==="/"?"":`${(t==null?void 0:t.at(-1))==="/"?"":"/"}${(e==null?void 0:e[0])==="/"?e.slice(1):e}`}`),dt=t=>{if(t.charCodeAt(t.length-1)!==63||!t.includes(":"))return null;const e=t.split("/"),s=[];let r="";return e.forEach(a=>{if(a!==""&&!/\:/.test(a))r+="/"+a;else if(/\:/.test(a))if(/\?/.test(a)){s.length===0&&r===""?s.push("/"):s.push(r);const n=a.replace("?","");r+="/"+n,s.push(r)}else r+="/"+a}),s.filter((a,n,o)=>o.indexOf(a)===n)},qe=t=>/[%+]/.test(t)?(t.indexOf("+")!==-1&&(t=t.replace(/\+/g," ")),t.indexOf("%")!==-1?We(t,ft):t):t,ut=(t,e,s)=>{let r;if(!s&&e&&!/[%+]/.test(e)){let o=t.indexOf("?",8);if(o===-1)return;for(t.startsWith(e,o+1)||(o=t.indexOf(`&${e}`,o+1));o!==-1;){const d=t.charCodeAt(o+e.length+1);if(d===61){const l=o+e.length+2,c=t.indexOf("&",l);return qe(t.slice(l,c===-1?void 0:c))}else if(d==38||isNaN(d))return"";o=t.indexOf(`&${e}`,o+1)}if(r=/[%+]/.test(t),!r)return}const a={};r??(r=/[%+]/.test(t));let n=t.indexOf("?",8);for(;n!==-1;){const o=t.indexOf("&",n+1);let d=t.indexOf("=",n);d>o&&o!==-1&&(d=-1);let l=t.slice(n+1,d===-1?o===-1?void 0:o:d);if(r&&(l=qe(l)),n=o,l==="")continue;let c;d===-1?c="":(c=t.slice(d+1,o===-1?void 0:o),r&&(c=qe(c))),s?(a[l]&&Array.isArray(a[l])||(a[l]=[]),a[l].push(c)):a[l]??(a[l]=c)}return e?a[e]:a},Wt=ut,Gt=(t,e)=>ut(t,e,!0),ft=decodeURIComponent,Ke=t=>We(t,ft),le,$,N,mt,ht,ze,q,st,pt=(st=class{constructor(t,e="/",s=[[]]){b(this,N);g(this,"raw");b(this,le);b(this,$);g(this,"routeIndex",0);g(this,"path");g(this,"bodyCache",{});b(this,q,t=>{const{bodyCache:e,raw:s}=this,r=e[t];if(r)return r;const a=Object.keys(e)[0];return a?e[a].then(n=>(a==="json"&&(n=JSON.stringify(n)),new Response(n)[t]())):e[t]=s[t]()});this.raw=t,this.path=e,h(this,$,s),h(this,le,{})}param(t){return t?v(this,N,mt).call(this,t):v(this,N,ht).call(this)}query(t){return Wt(this.url,t)}queries(t){return Gt(this.url,t)}header(t){if(t)return this.raw.headers.get(t)??void 0;const e={};return this.raw.headers.forEach((s,r)=>{e[r]=s}),e}async parseBody(t){var e;return(e=this.bodyCache).parsedBody??(e.parsedBody=await At(this,t))}json(){return i(this,q).call(this,"text").then(t=>JSON.parse(t))}text(){return i(this,q).call(this,"text")}arrayBuffer(){return i(this,q).call(this,"arrayBuffer")}blob(){return i(this,q).call(this,"blob")}formData(){return i(this,q).call(this,"formData")}addValidatedData(t,e){i(this,le)[t]=e}valid(t){return i(this,le)[t]}get url(){return this.raw.url}get method(){return this.raw.method}get[Tt](){return i(this,$)}get matchedRoutes(){return i(this,$)[0].map(([[,t]])=>t)}get routePath(){return i(this,$)[0].map(([[,t]])=>t)[this.routeIndex].path}},le=new WeakMap,$=new WeakMap,N=new WeakSet,mt=function(t){const e=i(this,$)[0][this.routeIndex][1][t],s=v(this,N,ze).call(this,e);return s&&/\%/.test(s)?Ke(s):s},ht=function(){const t={},e=Object.keys(i(this,$)[0][this.routeIndex][1]);for(const s of e){const r=v(this,N,ze).call(this,i(this,$)[0][this.routeIndex][1][s]);r!==void 0&&(t[s]=/\%/.test(r)?Ke(r):r)}return t},ze=function(t){return i(this,$)[1]?i(this,$)[1][t]:t},q=new WeakMap,st),Yt={Stringify:1},gt=async(t,e,s,r,a)=>{typeof t=="object"&&!(t instanceof String)&&(t instanceof Promise||(t=t.toString()),t instanceof Promise&&(t=await t));const n=t.callbacks;return n!=null&&n.length?(a?a[0]+=t:a=[t],Promise.all(n.map(d=>d({phase:e,buffer:a,context:r}))).then(d=>Promise.all(d.filter(Boolean).map(l=>gt(l,e,!1,r,a))).then(()=>a[0]))):Promise.resolve(t)},Jt="text/plain; charset=UTF-8",Ue=(t,e)=>({"Content-Type":t,...e}),ke,je,D,de,H,_,Ee,ue,fe,X,Re,_e,U,ie,rt,Vt=(rt=class{constructor(t,e){b(this,U);b(this,ke);b(this,je);g(this,"env",{});b(this,D);g(this,"finalized",!1);g(this,"error");b(this,de);b(this,H);b(this,_);b(this,Ee);b(this,ue);b(this,fe);b(this,X);b(this,Re);b(this,_e);g(this,"render",(...t)=>(i(this,ue)??h(this,ue,e=>this.html(e)),i(this,ue).call(this,...t)));g(this,"setLayout",t=>h(this,Ee,t));g(this,"getLayout",()=>i(this,Ee));g(this,"setRenderer",t=>{h(this,ue,t)});g(this,"header",(t,e,s)=>{this.finalized&&h(this,_,new Response(i(this,_).body,i(this,_)));const r=i(this,_)?i(this,_).headers:i(this,X)??h(this,X,new Headers);e===void 0?r.delete(t):s!=null&&s.append?r.append(t,e):r.set(t,e)});g(this,"status",t=>{h(this,de,t)});g(this,"set",(t,e)=>{i(this,D)??h(this,D,new Map),i(this,D).set(t,e)});g(this,"get",t=>i(this,D)?i(this,D).get(t):void 0);g(this,"newResponse",(...t)=>v(this,U,ie).call(this,...t));g(this,"body",(t,e,s)=>v(this,U,ie).call(this,t,e,s));g(this,"text",(t,e,s)=>!i(this,X)&&!i(this,de)&&!e&&!s&&!this.finalized?new Response(t):v(this,U,ie).call(this,t,e,Ue(Jt,s)));g(this,"json",(t,e,s)=>v(this,U,ie).call(this,JSON.stringify(t),e,Ue("application/json",s)));g(this,"html",(t,e,s)=>{const r=a=>v(this,U,ie).call(this,a,e,Ue("text/html; charset=UTF-8",s));return typeof t=="object"?gt(t,Yt.Stringify,!1,{}).then(r):r(t)});g(this,"redirect",(t,e)=>{const s=String(t);return this.header("Location",/[^\x00-\xFF]/.test(s)?encodeURI(s):s),this.newResponse(null,e??302)});g(this,"notFound",()=>(i(this,fe)??h(this,fe,()=>new Response),i(this,fe).call(this,this)));h(this,ke,t),e&&(h(this,H,e.executionCtx),this.env=e.env,h(this,fe,e.notFoundHandler),h(this,_e,e.path),h(this,Re,e.matchResult))}get req(){return i(this,je)??h(this,je,new pt(i(this,ke),i(this,_e),i(this,Re))),i(this,je)}get event(){if(i(this,H)&&"respondWith"in i(this,H))return i(this,H);throw Error("This context has no FetchEvent")}get executionCtx(){if(i(this,H))return i(this,H);throw Error("This context has no ExecutionContext")}get res(){return i(this,_)||h(this,_,new Response(null,{headers:i(this,X)??h(this,X,new Headers)}))}set res(t){if(i(this,_)&&t){t=new Response(t.body,t);for(const[e,s]of i(this,_).headers.entries())if(e!=="content-type")if(e==="set-cookie"){const r=i(this,_).headers.getSetCookie();t.headers.delete("set-cookie");for(const a of r)t.headers.append("set-cookie",a)}else t.headers.set(e,s)}h(this,_,t),this.finalized=!0}get var(){return i(this,D)?Object.fromEntries(i(this,D)):{}}},ke=new WeakMap,je=new WeakMap,D=new WeakMap,de=new WeakMap,H=new WeakMap,_=new WeakMap,Ee=new WeakMap,ue=new WeakMap,fe=new WeakMap,X=new WeakMap,Re=new WeakMap,_e=new WeakMap,U=new WeakSet,ie=function(t,e,s){const r=i(this,_)?new Headers(i(this,_).headers):i(this,X)??new Headers;if(typeof e=="object"&&"headers"in e){const n=e.headers instanceof Headers?e.headers:new Headers(e.headers);for(const[o,d]of n)o.toLowerCase()==="set-cookie"?r.append(o,d):r.set(o,d)}if(s)for(const[n,o]of Object.entries(s))if(typeof o=="string")r.set(n,o);else{r.delete(n);for(const d of o)r.append(n,d)}const a=typeof e=="number"?e:(e==null?void 0:e.status)??i(this,de);return new Response(t,{status:a,headers:r})},rt),k="ALL",Kt="all",Zt=["get","post","put","delete","options","patch"],xt="Can not add a route since the matcher is already built.",bt=class extends Error{},Xt="__COMPOSED_HANDLER",Qt=t=>t.text("404 Not Found",404),Ze=(t,e)=>{if("getResponse"in t){const s=t.getResponse();return e.newResponse(s.body,s)}return console.error(t),e.text("Internal Server Error",500)},M,j,vt,F,K,Me,Fe,pe,es=(pe=class{constructor(e={}){b(this,j);g(this,"get");g(this,"post");g(this,"put");g(this,"delete");g(this,"options");g(this,"patch");g(this,"all");g(this,"on");g(this,"use");g(this,"router");g(this,"getPath");g(this,"_basePath","/");b(this,M,"/");g(this,"routes",[]);b(this,F,Qt);g(this,"errorHandler",Ze);g(this,"onError",e=>(this.errorHandler=e,this));g(this,"notFound",e=>(h(this,F,e),this));g(this,"fetch",(e,...s)=>v(this,j,Fe).call(this,e,s[1],s[0],e.method));g(this,"request",(e,s,r,a)=>e instanceof Request?this.fetch(s?new Request(e,s):e,r,a):(e=e.toString(),this.fetch(new Request(/^https?:\/\//.test(e)?e:`http://localhost${oe("/",e)}`,s),r,a)));g(this,"fire",()=>{addEventListener("fetch",e=>{e.respondWith(v(this,j,Fe).call(this,e.request,e,void 0,e.request.method))})});[...Zt,Kt].forEach(n=>{this[n]=(o,...d)=>(typeof o=="string"?h(this,M,o):v(this,j,K).call(this,n,i(this,M),o),d.forEach(l=>{v(this,j,K).call(this,n,i(this,M),l)}),this)}),this.on=(n,o,...d)=>{for(const l of[o].flat()){h(this,M,l);for(const c of[n].flat())d.map(u=>{v(this,j,K).call(this,c.toUpperCase(),i(this,M),u)})}return this},this.use=(n,...o)=>(typeof n=="string"?h(this,M,n):(h(this,M,"*"),o.unshift(n)),o.forEach(d=>{v(this,j,K).call(this,k,i(this,M),d)}),this);const{strict:r,...a}=e;Object.assign(this,a),this.getPath=r??!0?e.getPath??lt:zt}route(e,s){const r=this.basePath(e);return s.routes.map(a=>{var o;let n;s.errorHandler===Ze?n=a.handler:(n=async(d,l)=>(await Ve([],s.errorHandler)(d,()=>a.handler(d,l))).res,n[Xt]=a.handler),v(o=r,j,K).call(o,a.method,a.path,n)}),this}basePath(e){const s=v(this,j,vt).call(this);return s._basePath=oe(this._basePath,e),s}mount(e,s,r){let a,n;r&&(typeof r=="function"?n=r:(n=r.optionHandler,r.replaceRequest===!1?a=l=>l:a=r.replaceRequest));const o=n?l=>{const c=n(l);return Array.isArray(c)?c:[c]}:l=>{let c;try{c=l.executionCtx}catch{}return[l.env,c]};a||(a=(()=>{const l=oe(this._basePath,e),c=l==="/"?0:l.length;return u=>{const f=new URL(u.url);return f.pathname=f.pathname.slice(c)||"/",new Request(f,u)}})());const d=async(l,c)=>{const u=await s(a(l.req.raw),...o(l));if(u)return u;await c()};return v(this,j,K).call(this,k,oe(e,"*"),d),this}},M=new WeakMap,j=new WeakSet,vt=function(){const e=new pe({router:this.router,getPath:this.getPath});return e.errorHandler=this.errorHandler,h(e,F,i(this,F)),e.routes=this.routes,e},F=new WeakMap,K=function(e,s,r){e=e.toUpperCase(),s=oe(this._basePath,s);const a={basePath:this._basePath,path:s,method:e,handler:r};this.router.add(e,s,[r,a]),this.routes.push(a)},Me=function(e,s){if(e instanceof Error)return this.errorHandler(e,s);throw e},Fe=function(e,s,r,a){if(a==="HEAD")return(async()=>new Response(null,await v(this,j,Fe).call(this,e,s,r,"GET")))();const n=this.getPath(e,{env:r}),o=this.router.match(a,n),d=new Vt(e,{path:n,matchResult:o,env:r,executionCtx:s,notFoundHandler:i(this,F)});if(o[0].length===1){let c;try{c=o[0][0][0][0](d,async()=>{d.res=await i(this,F).call(this,d)})}catch(u){return v(this,j,Me).call(this,u,d)}return c instanceof Promise?c.then(u=>u||(d.finalized?d.res:i(this,F).call(this,d))).catch(u=>v(this,j,Me).call(this,u,d)):c??i(this,F).call(this,d)}const l=Ve(o[0],this.errorHandler,i(this,F));return(async()=>{try{const c=await l(d);if(!c.finalized)throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return c.res}catch(c){return v(this,j,Me).call(this,c,d)}})()},pe),yt=[];function ts(t,e){const s=this.buildAllMatchers(),r=(a,n)=>{const o=s[a]||s[k],d=o[2][n];if(d)return d;const l=n.match(o[0]);if(!l)return[[],yt];const c=l.indexOf("",1);return[o[1][c],l]};return this.match=r,r(t,e)}var Ae="[^/]+",ye=".*",we="(?:|/.*)",ce=Symbol(),ss=new Set(".\\+*[^]$()");function rs(t,e){return t.length===1?e.length===1?t<e?-1:1:-1:e.length===1||t===ye||t===we?1:e===ye||e===we?-1:t===Ae?1:e===Ae?-1:t.length===e.length?t<e?-1:1:e.length-t.length}var Q,ee,T,re,as=(re=class{constructor(){b(this,Q);b(this,ee);b(this,T,Object.create(null))}insert(e,s,r,a,n){if(e.length===0){if(i(this,Q)!==void 0)throw ce;if(n)return;h(this,Q,s);return}const[o,...d]=e,l=o==="*"?d.length===0?["","",ye]:["","",Ae]:o==="/*"?["","",we]:o.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);let c;if(l){const u=l[1];let f=l[2]||Ae;if(u&&l[2]&&(f===".*"||(f=f.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(f))))throw ce;if(c=i(this,T)[f],!c){if(Object.keys(i(this,T)).some(p=>p!==ye&&p!==we))throw ce;if(n)return;c=i(this,T)[f]=new re,u!==""&&h(c,ee,a.varIndex++)}!n&&u!==""&&r.push([u,i(c,ee)])}else if(c=i(this,T)[o],!c){if(Object.keys(i(this,T)).some(u=>u.length>1&&u!==ye&&u!==we))throw ce;if(n)return;c=i(this,T)[o]=new re}c.insert(d,s,r,a,n)}buildRegExpStr(){const s=Object.keys(i(this,T)).sort(rs).map(r=>{const a=i(this,T)[r];return(typeof i(a,ee)=="number"?`(${r})@${i(a,ee)}`:ss.has(r)?`\\${r}`:r)+a.buildRegExpStr()});return typeof i(this,Q)=="number"&&s.unshift(`#${i(this,Q)}`),s.length===0?"":s.length===1?s[0]:"(?:"+s.join("|")+")"}},Q=new WeakMap,ee=new WeakMap,T=new WeakMap,re),De,Ie,at,ns=(at=class{constructor(){b(this,De,{varIndex:0});b(this,Ie,new as)}insert(t,e,s){const r=[],a=[];for(let o=0;;){let d=!1;if(t=t.replace(/\{[^}]+\}/g,l=>{const c=`@\\${o}`;return a[o]=[c,l],o++,d=!0,c}),!d)break}const n=t.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let o=a.length-1;o>=0;o--){const[d]=a[o];for(let l=n.length-1;l>=0;l--)if(n[l].indexOf(d)!==-1){n[l]=n[l].replace(d,a[o][1]);break}}return i(this,Ie).insert(n,e,r,i(this,De),s),r}buildRegExp(){let t=i(this,Ie).buildRegExpStr();if(t==="")return[/^$/,[],[]];let e=0;const s=[],r=[];return t=t.replace(/#(\d+)|@(\d+)|\.\*\$/g,(a,n,o)=>n!==void 0?(s[++e]=Number(n),"$()"):(o!==void 0&&(r[Number(o)]=++e),"")),[new RegExp(`^${t}`),s,r]}},De=new WeakMap,Ie=new WeakMap,at),os=[/^$/,[],Object.create(null)],Te=Object.create(null);function wt(t){return Te[t]??(Te[t]=new RegExp(t==="*"?"":`^${t.replace(/\/\*$|([.\\+*[^\]$()])/g,(e,s)=>s?`\\${s}`:"(?:|/.*)")}$`))}function is(){Te=Object.create(null)}function cs(t){var c;const e=new ns,s=[];if(t.length===0)return os;const r=t.map(u=>[!/\*|\/:/.test(u[0]),...u]).sort(([u,f],[p,m])=>u?1:p?-1:f.length-m.length),a=Object.create(null);for(let u=0,f=-1,p=r.length;u<p;u++){const[m,y,C]=r[u];m?a[y]=[C.map(([w])=>[w,Object.create(null)]),yt]:f++;let x;try{x=e.insert(y,f,m)}catch(w){throw w===ce?new bt(y):w}m||(s[f]=C.map(([w,I])=>{const V=Object.create(null);for(I-=1;I>=0;I--){const[ae,S]=x[I];V[ae]=S}return[w,V]}))}const[n,o,d]=e.buildRegExp();for(let u=0,f=s.length;u<f;u++)for(let p=0,m=s[u].length;p<m;p++){const y=(c=s[u][p])==null?void 0:c[1];if(!y)continue;const C=Object.keys(y);for(let x=0,w=C.length;x<w;x++)y[C[x]]=d[y[C[x]]]}const l=[];for(const u in o)l[u]=s[o[u]];return[n,l,a]}function ne(t,e){if(t){for(const s of Object.keys(t).sort((r,a)=>a.length-r.length))if(wt(s).test(e))return[...t[s]]}}var z,W,He,Ct,nt,ls=(nt=class{constructor(){b(this,He);g(this,"name","RegExpRouter");b(this,z);b(this,W);g(this,"match",ts);h(this,z,{[k]:Object.create(null)}),h(this,W,{[k]:Object.create(null)})}add(t,e,s){var d;const r=i(this,z),a=i(this,W);if(!r||!a)throw new Error(xt);r[t]||[r,a].forEach(l=>{l[t]=Object.create(null),Object.keys(l[k]).forEach(c=>{l[t][c]=[...l[k][c]]})}),e==="/*"&&(e="*");const n=(e.match(/\/:/g)||[]).length;if(/\*$/.test(e)){const l=wt(e);t===k?Object.keys(r).forEach(c=>{var u;(u=r[c])[e]||(u[e]=ne(r[c],e)||ne(r[k],e)||[])}):(d=r[t])[e]||(d[e]=ne(r[t],e)||ne(r[k],e)||[]),Object.keys(r).forEach(c=>{(t===k||t===c)&&Object.keys(r[c]).forEach(u=>{l.test(u)&&r[c][u].push([s,n])})}),Object.keys(a).forEach(c=>{(t===k||t===c)&&Object.keys(a[c]).forEach(u=>l.test(u)&&a[c][u].push([s,n]))});return}const o=dt(e)||[e];for(let l=0,c=o.length;l<c;l++){const u=o[l];Object.keys(a).forEach(f=>{var p;(t===k||t===f)&&((p=a[f])[u]||(p[u]=[...ne(r[f],u)||ne(r[k],u)||[]]),a[f][u].push([s,n-c+l+1]))})}}buildAllMatchers(){const t=Object.create(null);return Object.keys(i(this,W)).concat(Object.keys(i(this,z))).forEach(e=>{t[e]||(t[e]=v(this,He,Ct).call(this,e))}),h(this,z,h(this,W,void 0)),is(),t}},z=new WeakMap,W=new WeakMap,He=new WeakSet,Ct=function(t){const e=[];let s=t===k;return[i(this,z),i(this,W)].forEach(r=>{const a=r[t]?Object.keys(r[t]).map(n=>[n,r[t][n]]):[];a.length!==0?(s||(s=!0),e.push(...a)):t!==k&&e.push(...Object.keys(r[k]).map(n=>[n,r[k][n]]))}),s?cs(e):null},nt),G,B,ot,ds=(ot=class{constructor(t){g(this,"name","SmartRouter");b(this,G,[]);b(this,B,[]);h(this,G,t.routers)}add(t,e,s){if(!i(this,B))throw new Error(xt);i(this,B).push([t,e,s])}match(t,e){if(!i(this,B))throw new Error("Fatal error");const s=i(this,G),r=i(this,B),a=s.length;let n=0,o;for(;n<a;n++){const d=s[n];try{for(let l=0,c=r.length;l<c;l++)d.add(...r[l]);o=d.match(t,e)}catch(l){if(l instanceof bt)continue;throw l}this.match=d.match.bind(d),h(this,G,[d]),h(this,B,void 0);break}if(n===a)throw new Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,o}get activeRouter(){if(i(this,B)||i(this,G).length!==1)throw new Error("No active router has been determined yet.");return i(this,G)[0]}},G=new WeakMap,B=new WeakMap,ot),ve=Object.create(null),Y,R,te,me,E,L,Z,he,us=(he=class{constructor(e,s,r){b(this,L);b(this,Y);b(this,R);b(this,te);b(this,me,0);b(this,E,ve);if(h(this,R,r||Object.create(null)),h(this,Y,[]),e&&s){const a=Object.create(null);a[e]={handler:s,possibleKeys:[],score:0},h(this,Y,[a])}h(this,te,[])}insert(e,s,r){h(this,me,++Je(this,me)._);let a=this;const n=Lt(s),o=[];for(let d=0,l=n.length;d<l;d++){const c=n[d],u=n[d+1],f=qt(c,u),p=Array.isArray(f)?f[0]:c;if(p in i(a,R)){a=i(a,R)[p],f&&o.push(f[1]);continue}i(a,R)[p]=new he,f&&(i(a,te).push(f),o.push(f[1])),a=i(a,R)[p]}return i(a,Y).push({[e]:{handler:r,possibleKeys:o.filter((d,l,c)=>c.indexOf(d)===l),score:i(this,me)}}),a}search(e,s){var l;const r=[];h(this,E,ve);let n=[this];const o=ct(s),d=[];for(let c=0,u=o.length;c<u;c++){const f=o[c],p=c===u-1,m=[];for(let y=0,C=n.length;y<C;y++){const x=n[y],w=i(x,R)[f];w&&(h(w,E,i(x,E)),p?(i(w,R)["*"]&&r.push(...v(this,L,Z).call(this,i(w,R)["*"],e,i(x,E))),r.push(...v(this,L,Z).call(this,w,e,i(x,E)))):m.push(w));for(let I=0,V=i(x,te).length;I<V;I++){const ae=i(x,te)[I],S=i(x,E)===ve?{}:{...i(x,E)};if(ae==="*"){const P=i(x,R)["*"];P&&(r.push(...v(this,L,Z).call(this,P,e,i(x,E))),h(P,E,S),m.push(P));continue}const[Le,Se,be]=ae;if(!f&&!(be instanceof RegExp))continue;const O=i(x,R)[Le],$t=o.slice(c).join("/");if(be instanceof RegExp){const P=be.exec($t);if(P){if(S[Se]=P[0],r.push(...v(this,L,Z).call(this,O,e,i(x,E),S)),Object.keys(i(O,R)).length){h(O,E,S);const Ne=((l=P[0].match(/\//))==null?void 0:l.length)??0;(d[Ne]||(d[Ne]=[])).push(O)}continue}}(be===!0||be.test(f))&&(S[Se]=f,p?(r.push(...v(this,L,Z).call(this,O,e,S,i(x,E))),i(O,R)["*"]&&r.push(...v(this,L,Z).call(this,i(O,R)["*"],e,S,i(x,E)))):(h(O,E,S),m.push(O)))}}n=m.concat(d.shift()??[])}return r.length>1&&r.sort((c,u)=>c.score-u.score),[r.map(({handler:c,params:u})=>[c,u])]}},Y=new WeakMap,R=new WeakMap,te=new WeakMap,me=new WeakMap,E=new WeakMap,L=new WeakSet,Z=function(e,s,r,a){const n=[];for(let o=0,d=i(e,Y).length;o<d;o++){const l=i(e,Y)[o],c=l[s]||l[k],u={};if(c!==void 0&&(c.params=Object.create(null),n.push(c),r!==ve||a&&a!==ve))for(let f=0,p=c.possibleKeys.length;f<p;f++){const m=c.possibleKeys[f],y=u[c.score];c.params[m]=a!=null&&a[m]&&!y?a[m]:r[m]??(a==null?void 0:a[m]),u[c.score]=!0}}return n},he),se,it,fs=(it=class{constructor(){g(this,"name","TrieRouter");b(this,se);h(this,se,new us)}add(t,e,s){const r=dt(e);if(r){for(let a=0,n=r.length;a<n;a++)i(this,se).insert(t,r[a],s);return}i(this,se).insert(t,e,s)}match(t,e){return i(this,se).search(t,e)}},se=new WeakMap,it),J=class extends es{constructor(t={}){super(t),this.router=t.router??new ds({routers:[new ls,new fs]})}},ps=/^\s*(?:text\/(?!event-stream(?:[;\s]|$))[^;\s]+|application\/(?:javascript|json|xml|xml-dtd|ecmascript|dart|postscript|rtf|tar|toml|vnd\.dart|vnd\.ms-fontobject|vnd\.ms-opentype|wasm|x-httpd-php|x-javascript|x-ns-proxy-autoconfig|x-sh|x-tar|x-virtualbox-hdd|x-virtualbox-ova|x-virtualbox-ovf|x-virtualbox-vbox|x-virtualbox-vdi|x-virtualbox-vhd|x-virtualbox-vmdk|x-www-form-urlencoded)|font\/(?:otf|ttf)|image\/(?:bmp|vnd\.adobe\.photoshop|vnd\.microsoft\.icon|vnd\.ms-dds|x-icon|x-ms-bmp)|message\/rfc822|model\/gltf-binary|x-shader\/x-fragment|x-shader\/x-vertex|[^;\s]+?\+(?:json|text|xml|yaml))(?:[;\s]|$)/i,Xe=(t,e=hs)=>{const s=/\.([a-zA-Z0-9]+?)$/,r=t.match(s);if(!r)return;let a=e[r[1]];return a&&a.startsWith("text")&&(a+="; charset=utf-8"),a},ms={aac:"audio/aac",avi:"video/x-msvideo",avif:"image/avif",av1:"video/av1",bin:"application/octet-stream",bmp:"image/bmp",css:"text/css",csv:"text/csv",eot:"application/vnd.ms-fontobject",epub:"application/epub+zip",gif:"image/gif",gz:"application/gzip",htm:"text/html",html:"text/html",ico:"image/x-icon",ics:"text/calendar",jpeg:"image/jpeg",jpg:"image/jpeg",js:"text/javascript",json:"application/json",jsonld:"application/ld+json",map:"application/json",mid:"audio/x-midi",midi:"audio/x-midi",mjs:"text/javascript",mp3:"audio/mpeg",mp4:"video/mp4",mpeg:"video/mpeg",oga:"audio/ogg",ogv:"video/ogg",ogx:"application/ogg",opus:"audio/opus",otf:"font/otf",pdf:"application/pdf",png:"image/png",rtf:"application/rtf",svg:"image/svg+xml",tif:"image/tiff",tiff:"image/tiff",ts:"video/mp2t",ttf:"font/ttf",txt:"text/plain",wasm:"application/wasm",webm:"video/webm",weba:"audio/webm",webmanifest:"application/manifest+json",webp:"image/webp",woff:"font/woff",woff2:"font/woff2",xhtml:"application/xhtml+xml",xml:"application/xml",zip:"application/zip","3gp":"video/3gpp","3g2":"video/3gpp2",gltf:"model/gltf+json",glb:"model/gltf-binary"},hs=ms,gs=(...t)=>{let e=t.filter(a=>a!=="").join("/");e=e.replace(new RegExp("(?<=\\/)\\/+","g"),"");const s=e.split("/"),r=[];for(const a of s)a===".."&&r.length>0&&r.at(-1)!==".."?r.pop():a!=="."&&r.push(a);return r.join("/")||"."},kt={br:".br",zstd:".zst",gzip:".gz"},xs=Object.keys(kt),bs="index.html",vs=t=>{const e=t.root??"./",s=t.path,r=t.join??gs;return async(a,n)=>{var u,f,p,m;if(a.finalized)return n();let o;if(t.path)o=t.path;else try{if(o=decodeURIComponent(a.req.path),/(?:^|[\/\\])\.\.(?:$|[\/\\])/.test(o))throw new Error}catch{return await((u=t.onNotFound)==null?void 0:u.call(t,a.req.path,a)),n()}let d=r(e,!s&&t.rewriteRequestPath?t.rewriteRequestPath(o):o);t.isDir&&await t.isDir(d)&&(d=r(d,bs));const l=t.getContent;let c=await l(d,a);if(c instanceof Response)return a.newResponse(c.body,c);if(c){const y=t.mimes&&Xe(d,t.mimes)||Xe(d);if(a.header("Content-Type",y||"application/octet-stream"),t.precompressed&&(!y||ps.test(y))){const C=new Set((f=a.req.header("Accept-Encoding"))==null?void 0:f.split(",").map(x=>x.trim()));for(const x of xs){if(!C.has(x))continue;const w=await l(d+kt[x],a);if(w){c=w,a.header("Content-Encoding",x),a.header("Vary","Accept-Encoding",{append:!0});break}}}return await((p=t.onFound)==null?void 0:p.call(t,d,a)),a.body(c)}await((m=t.onNotFound)==null?void 0:m.call(t,d,a)),await n()}},ys=async(t,e)=>{let s;e&&e.manifest?typeof e.manifest=="string"?s=JSON.parse(e.manifest):s=e.manifest:typeof __STATIC_CONTENT_MANIFEST=="string"?s=JSON.parse(__STATIC_CONTENT_MANIFEST):s=__STATIC_CONTENT_MANIFEST;let r;e&&e.namespace?r=e.namespace:r=__STATIC_CONTENT;const a=s[t]||t;if(!a)return null;const n=await r.get(a,{type:"stream"});return n||null},ws=t=>async function(s,r){return vs({...t,getContent:async n=>ys(n,{manifest:t.manifest,namespace:t.namespace?t.namespace:s.env?s.env.__STATIC_CONTENT:void 0})})(s,r)},jt=t=>ws(t),Cs=t=>{const s={...{origin:"*",allowMethods:["GET","HEAD","PUT","POST","DELETE","PATCH"],allowHeaders:[],exposeHeaders:[]},...t},r=(n=>typeof n=="string"?n==="*"?()=>n:o=>n===o?o:null:typeof n=="function"?n:o=>n.includes(o)?o:null)(s.origin),a=(n=>typeof n=="function"?n:Array.isArray(n)?()=>n:()=>[])(s.allowMethods);return async function(o,d){var u;function l(f,p){o.res.headers.set(f,p)}const c=await r(o.req.header("origin")||"",o);if(c&&l("Access-Control-Allow-Origin",c),s.credentials&&l("Access-Control-Allow-Credentials","true"),(u=s.exposeHeaders)!=null&&u.length&&l("Access-Control-Expose-Headers",s.exposeHeaders.join(",")),o.req.method==="OPTIONS"){s.origin!=="*"&&l("Vary","Origin"),s.maxAge!=null&&l("Access-Control-Max-Age",s.maxAge.toString());const f=await a(o.req.header("origin")||"",o);f.length&&l("Access-Control-Allow-Methods",f.join(","));let p=s.allowHeaders;if(!(p!=null&&p.length)){const m=o.req.header("Access-Control-Request-Headers");m&&(p=m.split(/\s*,\s*/))}return p!=null&&p.length&&(l("Access-Control-Allow-Headers",p.join(",")),o.res.headers.append("Vary","Access-Control-Request-Headers")),o.res.headers.delete("Content-Length"),o.res.headers.delete("Content-Type"),new Response(null,{headers:o.res.headers,status:204,statusText:"No Content"})}await d(),s.origin!=="*"&&o.header("Vary","Origin",{append:!0})}};class Qe{static calculate(e){const s=e.cnt_win+e.cnt_plc,r=Math.min(1,Math.sqrt(s/500)),a=e.rate_win_ret*.3+e.rate_plc_ret*.7-80,n=10*Math.tanh(a*r/25),o=this.getGrade(n);return{score:Math.round(n*100)/100,grade:o,reliability:Math.round(r*1e3)/1e3,weightedDiff:Math.round(a*100)/100}}static getGrade(e){return e>=7?"S":e>=4?"A":e>=1?"B":e>=-3?"C":"D"}static getGradeDescription(e){return{S:"極めて優秀 - 高い収益性が期待できる",A:"優秀 - 安定した収益が見込める",B:"良好 - プラス収益の可能性が高い",C:"平均 - 標準的なパフォーマンス",D:"要改善 - 収益性が低い可能性がある"}[e]||"不明"}}class et{static calculate(e){const s=new Map,r=this.groupByRaceId(e);for(const[a,n]of r.entries()){const o=n.map(m=>({horse:m,nMin:Math.min(m.cnt_win,m.cnt_plc),hitRaw:.65*m.rate_win_hit+.35*m.rate_plc_hit,retRaw:.35*m.rate_win_ret+.65*m.rate_plc_ret})),d=o.map(m=>m.hitRaw),l=o.map(m=>m.retRaw),c=this.mean(d),u=this.stdDev(d,c),f=this.mean(l),p=this.stdDev(l,f);for(const{horse:m,nMin:y,hitRaw:C,retRaw:x}of o){const w=u>0?(C-c)/u:0,I=p>0?(x-f)/p:0,V=Math.sqrt(y/(y+400)),ae=.55*w+.45*I,S=Math.round(12*Math.tanh(ae)*V*10)/10,Le=this.getGrade(S),Se=`${a}_${m.cnt_win}_${m.cnt_plc}`;s.set(Se,{score:S,grade:Le,hitRaw:Math.round(C*100)/100,retRaw:Math.round(x*100)/100,shrinkage:Math.round(V*1e3)/1e3})}}return s}static groupByRaceId(e){const s=new Map;for(const r of e){const a=s.get(r.group_id)||[];a.push(r),s.set(r.group_id,a)}return s}static mean(e){return e.length===0?0:e.reduce((s,r)=>s+r,0)/e.length}static stdDev(e,s){if(e.length<=1)return 0;const r=e.reduce((a,n)=>a+Math.pow(n-s,2),0)/e.length;return Math.sqrt(r)}static getGrade(e){return e>=8?"S+":e>=5?"S":e>=2?"A":e>=-1?"B":e>=-4?"C":"D"}static getGradeDescription(e){return{"S+":"最高評価 - レース内で圧倒的な優位性",S:"極めて優秀 - レース内で明確な優位性",A:"優秀 - レース内で有力候補",B:"良好 - レース内で競争力あり",C:"平均 - レース内で標準的な位置",D:"要改善 - レース内で劣勢"}[e]||"不明"}}const ge=new J;ge.use("/*",Cs());ge.post("/rgs/calculate",async t=>{try{const e=await t.req.json();if(typeof e.cnt_win!="number"||e.cnt_win<0)return t.json({error:"cnt_win must be a positive number"},400);if(typeof e.cnt_plc!="number"||e.cnt_plc<0)return t.json({error:"cnt_plc must be a positive number"},400);if(typeof e.rate_win_ret!="number")return t.json({error:"rate_win_ret must be a number"},400);if(typeof e.rate_plc_ret!="number")return t.json({error:"rate_plc_ret must be a number"},400);const s=Qe.calculate(e);return t.json({success:!0,data:{score:s.score,grade:s.grade,reliability:s.reliability,weightedDiff:s.weightedDiff,description:Qe.getGradeDescription(s.grade)}})}catch(e){return console.error("RGS calculation error:",e),t.json({success:!1,error:"RGS calculation failed",message:e instanceof Error?e.message:"Unknown error"},500)}});ge.post("/aas/calculate",async t=>{try{const e=await t.req.json();if(!Array.isArray(e.horses)||e.horses.length===0)return t.json({error:"horses must be a non-empty array"},400);for(const a of e.horses){if(!a.group_id||typeof a.group_id!="string")return t.json({error:"group_id is required and must be a string"},400);if(typeof a.cnt_win!="number"||a.cnt_win<0)return t.json({error:"cnt_win must be a positive number"},400);if(typeof a.cnt_plc!="number"||a.cnt_plc<0)return t.json({error:"cnt_plc must be a positive number"},400);if(typeof a.rate_win_hit!="number")return t.json({error:"rate_win_hit must be a number"},400);if(typeof a.rate_plc_hit!="number")return t.json({error:"rate_plc_hit must be a number"},400);if(typeof a.rate_win_ret!="number")return t.json({error:"rate_win_ret must be a number"},400);if(typeof a.rate_plc_ret!="number")return t.json({error:"rate_plc_ret must be a number"},400)}const s=et.calculate(e.horses),r=Array.from(s.entries()).map(([a,n])=>({key:a,score:n.score,grade:n.grade,hitRaw:n.hitRaw,retRaw:n.retRaw,shrinkage:n.shrinkage,description:et.getGradeDescription(n.grade)}));return t.json({success:!0,data:{count:r.length,results:r}})}catch(e){return console.error("AAS calculation error:",e),t.json({success:!1,error:"AAS calculation failed",message:e instanceof Error?e.message:"Unknown error"},500)}});ge.post("/factor/test",async t=>{try{const e=await t.req.json();if(!Array.isArray(e.factors)||e.factors.length===0)return t.json({error:"factors must be a non-empty array"},400);if(!Array.isArray(e.testData)||e.testData.length===0)return t.json({error:"testData must be a non-empty array"},400);const s=e.factors.reduce((p,m)=>p+m.weight,0);if(Math.abs(s-100)>.01)return t.json({error:"Total weight must be 100%"},400);const r=e.testData.map(p=>{var x,w;const m=((x=e.factors.find(I=>I.name==="RGS基礎値"))==null?void 0:x.weight)||0,y=((w=e.factors.find(I=>I.name==="AAS基礎値"))==null?void 0:w.weight)||0,C=p.rgs_score*m/100+p.aas_score*y/100;return{...p,factor_score:C}}),a=new Map;for(const p of r){const m=a.get(p.race_id)||[];m.push(p),a.set(p.race_id,m)}const n=[];for(const[p,m]of a.entries())m.sort((C,x)=>x.factor_score-C.factor_score).forEach((C,x)=>{n.push({...C,predicted_rank:x+1})});let o=0,d=0,l=r.length;for(const p of n)p.predicted_rank===1&&p.actual_rank<=3&&(o++,d+=100*(4-p.actual_rank));const c=o/l*100,u=d/(l*100)*100,f=u-100;return t.json({success:!0,data:{performance:{hit_rate:Math.round(c*10)/10,recovery_rate:Math.round(u*10)/10,roi:Math.round(f*10)/10,total_bets:l,total_hits:o,total_return:d},predictions:n.slice(0,10)}})}catch(e){return console.error("Factor test error:",e),t.json({success:!1,error:"Factor test failed",message:e instanceof Error?e.message:"Unknown error"},500)}});ge.get("/health",t=>t.json({success:!0,message:"UMAYOMI API is running",version:"1.0.0",timestamp:new Date().toISOString()}));const Et=new J;Et.get("/condition-settings",t=>t.html(`<!DOCTYPE html>
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
</html>`));const Rt=new J;Rt.get("/analysis",t=>t.html(`<!DOCTYPE html>
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
</html>`));const xe=new J,Ce=[];xe.get("/factor-register",t=>t.html(`<!DOCTYPE html>
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
</html>`));xe.get("/api/factors",async t=>{try{return t.json(Ce)}catch(e){return console.error("Failed to get factors:",e),t.json({error:"Failed to get factors"},500)}});xe.post("/api/factors",async t=>{try{const{name:e,description:s,conditions:r}=await t.req.json();if(!e||!s||!r)return t.json({error:"Missing required fields"},400);const a={id:Date.now(),name:e,description:s,conditions:JSON.stringify(r),created_at:new Date().toISOString()};return Ce.push(a),t.json({id:a.id,message:"Factor saved successfully"})}catch(e){return console.error("Failed to save factor:",e),t.json({error:"Failed to save factor"},500)}});xe.delete("/api/factors/:id",async t=>{try{const e=parseInt(t.req.param("id")),s=Ce.findIndex(r=>r.id===e);return s===-1?t.json({error:"Factor not found"},404):(Ce.splice(s,1),t.json({message:"Factor deleted successfully"}))}catch(e){return console.error("Failed to delete factor:",e),t.json({error:"Failed to delete factor"},500)}});xe.put("/api/factors/:id",async t=>{try{const e=parseInt(t.req.param("id")),{name:s,description:r,conditions:a}=await t.req.json(),n=Ce.find(o=>o.id===e);return n?(n.name=s,n.description=r,n.conditions=JSON.stringify(a),t.json({message:"Factor updated successfully"})):t.json({error:"Factor not found"},404)}catch(e){return console.error("Failed to update factor:",e),t.json({error:"Failed to update factor"},500)}});class _t{parse(e){if(!e||e.length<46)return null;try{const s=e.substring(2,10);return{track_code:e.substring(0,2).trim(),race_date:this.parseDate(s),race_number:e.substring(10,12).trim(),horse_number:e.substring(12,14).trim(),horse_id:e.substring(14,22).trim(),time_1:e.substring(22,25).trim(),time_2:e.substring(25,28).trim(),time_3:e.substring(28,31).trim(),time_4:e.substring(31,34).trim(),time_5:e.substring(34,37).trim(),time_6:e.substring(37,40).trim(),time_7:e.substring(40,43).trim(),time_8:e.substring(43,46).trim(),raw:e}}catch(s){return console.error("Failed to parse HC line:",s),null}}parseFile(e){const s=e.split(/\r?\n/),r=[];for(const a of s)if(a.trim()){const n=this.parse(a);n&&r.push(n)}return r}parseDate(e){return e}parseFilenameDate(e){const s=e.match(/HC\d{2}(\d{3})(\d{2})(\d{2})/);if(s){const r="20"+s[1].substring(1),a=s[2],n=s[3];return`${r}-${a}-${n}`}return""}getTrackName(e){return{"01":"札幌","02":"函館","03":"福島","04":"新潟","05":"東京","06":"中山","07":"中京","08":"京都","09":"阪神",10:"小倉"}[e]||e}groupByRace(e){const s=new Map;for(const r of e){const a=`${r.track_code}-${r.race_date}-${r.race_number}`;s.has(a)||s.set(a,[]),s.get(a).push(r)}return s}}const Be=new J;let It=new Map,Oe="";Be.get("/tomorrow-races",t=>t.html(`<!DOCTYPE html>
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
</html>`));Be.post("/api/tomorrow-races/upload",async t=>{try{const{filename:e,content:s}=await t.req.json();if(!e||!s)return t.json({error:"Missing required fields"},400);const r=new _t,a=r.parseFile(s);if(a.length===0)return t.json({error:"No records found in file"},400);const n=r.groupByRace(a);return It=n,Oe=r.parseFilenameDate(e),t.json({message:"File uploaded successfully",totalRecords:a.length,totalRaces:n.size,uploadedDate:Oe})}catch(e){return console.error("Failed to upload CK_DATA:",e),t.json({error:"Failed to upload file"},500)}});Be.get("/api/tomorrow-races",async t=>{try{const e=[],s=new _t;for(const[r,a]of It){const n=a[0];e.push({trackCode:n.track_code,trackName:s.getTrackName(n.track_code),date:Oe||n.race_date,raceNumber:n.race_number,horseCount:a.length,horses:a.map(o=>({horseNumber:o.horse_number,horseId:o.horse_id}))})}return e.sort((r,a)=>parseInt(r.raceNumber)-parseInt(a.raceNumber)),t.json({races:e,uploadedDate:Oe})}catch(e){return console.error("Failed to get tomorrow races:",e),t.json({error:"Failed to get races"},500)}});const Ge=new J;Ge.get("/race-card",t=>(t.req.query("track"),t.req.query("date"),t.req.query("race"),t.html(`<!DOCTYPE html>
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
                    \${horse.score !== null && horse.score !== undefined ? \`
                    <div class="flex justify-between">
                        <span class="text-gray-400">ファクター得点:</span>
                        <span class="text-white font-semibold">\${horse.score.toFixed(1)} 点</span>
                    </div>
                    \` : ''}
                </div>
            </div>
            
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
        const response = await axios.get('/api/factors');
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
        // TODO: Implement factor calculation
        // For now, generate random scores
        allHorses = allHorses.map(horse => ({
            ...horse,
            score: Math.random() * 100
        }));
        
        currentSort = 'score';
        renderHorses(allHorses);
        
        alert('ファクターを適用しました！（デモ版：ランダムスコア）');
    } catch (error) {
        console.error('Failed to apply factor:', error);
        alert('ファクターの適用に失敗しました: ' + error.message);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadRaceCard();
});
    <\/script>
</body>
</html>`)));Ge.get("/api/race-card",async t=>{try{const e=t.req.query("track")||"",s=t.req.query("date")||"",r=t.req.query("race")||"",a=`${e}-${s}-${r}`;return t.json({track:e,date:s,raceNumber:r,horses:[{horse_number:"01",horse_id:"01910696",score:null},{horse_number:"02",horse_id:"02210009",score:null},{horse_number:"03",horse_id:"02210058",score:null},{horse_number:"04",horse_id:"02210142",score:null},{horse_number:"05",horse_id:"02210363",score:null},{horse_number:"06",horse_id:"02210413",score:null},{horse_number:"07",horse_id:"02210544",score:null},{horse_number:"08",horse_id:"02210550",score:null}]})}catch(e){return console.error("Failed to get race card:",e),t.json({error:"Failed to get race card"},500)}});const A=new J;A.route("/api",ge);A.route("/",Et);A.route("/",Rt);A.route("/",xe);A.route("/",Be);A.route("/",Ge);A.use("/static/*",jt({root:"./public"}));A.use("/downloads/*",jt({root:"./public"}));A.get("/",t=>t.html(`<!DOCTYPE html>
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
</html>`));const tt=new J,ks=Object.assign({"/src/index.tsx":A});let St=!1;for(const[,t]of Object.entries(ks))t&&(tt.route("/",t),tt.notFound(t.notFoundHandler),St=!0);if(!St)throw new Error("Can't import modules from ['/src/index.tsx','/app/server.ts']");export{tt as default};
