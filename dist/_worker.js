var Ie=Object.defineProperty;var Gt=e=>{throw TypeError(e)};var Me=(e,t,s)=>t in e?Ie(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s;var g=(e,t,s)=>Me(e,typeof t!="symbol"?t+"":t,s),Pt=(e,t,s)=>t.has(e)||Gt("Cannot "+s);var i=(e,t,s)=>(Pt(e,t,"read from private field"),s?s.call(e):t.get(e)),b=(e,t,s)=>t.has(e)?Gt("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,s),m=(e,t,s,r)=>(Pt(e,t,"write to private field"),r?r.call(e,s):t.set(e,s),s),v=(e,t,s)=>(Pt(e,t,"access private method"),s);var Vt=(e,t,s,r)=>({set _(a){m(e,t,a,s)},get _(){return i(e,t,r)}});var Yt=(e,t,s)=>(r,a)=>{let n=-1;return o(0);async function o(l){if(l<=n)throw new Error("next() called multiple times");n=l;let c,d=!1,u;if(e[l]?(u=e[l][0][0],r.req.routeIndex=l):u=l===e.length&&a||void 0,u)try{c=await u(r,()=>o(l+1))}catch(f){if(f instanceof Error&&t)r.error=f,c=await t(f,r),d=!0;else throw f}else r.finalized===!1&&s&&(c=await s(r));return c&&(r.finalized===!1||d)&&(r.res=c),r}},$e=Symbol(),Fe=async(e,t=Object.create(null))=>{const{all:s=!1,dot:r=!1}=t,n=(e instanceof fe?e.raw.headers:e.headers).get("Content-Type");return n!=null&&n.startsWith("multipart/form-data")||n!=null&&n.startsWith("application/x-www-form-urlencoded")?Ae(e,{all:s,dot:r}):{}};async function Ae(e,t){const s=await e.formData();return s?Te(s,t):{}}function Te(e,t){const s=Object.create(null);return e.forEach((r,a)=>{t.all||a.endsWith("[]")?Oe(s,a,r):s[a]=r}),t.dot&&Object.entries(s).forEach(([r,a])=>{r.includes(".")&&(De(s,r,a),delete s[r])}),s}var Oe=(e,t,s)=>{e[t]!==void 0?Array.isArray(e[t])?e[t].push(s):e[t]=[e[t],s]:t.endsWith("[]")?e[t]=[s]:e[t]=s},De=(e,t,s)=>{let r=e;const a=t.split(".");a.forEach((n,o)=>{o===a.length-1?r[n]=s:((!r[n]||typeof r[n]!="object"||Array.isArray(r[n])||r[n]instanceof File)&&(r[n]=Object.create(null)),r=r[n])})},ie=e=>{const t=e.split("/");return t[0]===""&&t.shift(),t},He=e=>{const{groups:t,path:s}=Be(e),r=ie(s);return Le(r,t)},Be=e=>{const t=[];return e=e.replace(/\{[^}]+\}/g,(s,r)=>{const a=`@${r}`;return t.push([a,s]),a}),{groups:t,path:e}},Le=(e,t)=>{for(let s=t.length-1;s>=0;s--){const[r]=t[s];for(let a=e.length-1;a>=0;a--)if(e[a].includes(r)){e[a]=e[a].replace(r,t[s][1]);break}}return e},$t={},Ne=(e,t)=>{if(e==="*")return"*";const s=e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(s){const r=`${e}#${t}`;return $t[r]||(s[2]?$t[r]=t&&t[0]!==":"&&t[0]!=="*"?[r,s[1],new RegExp(`^${s[2]}(?=/${t})`)]:[e,s[1],new RegExp(`^${s[2]}$`)]:$t[r]=[e,s[1],!0]),$t[r]}return null},Wt=(e,t)=>{try{return t(e)}catch{return e.replace(/(?:%[0-9A-Fa-f]{2})+/g,s=>{try{return t(s)}catch{return s}})}},Pe=e=>Wt(e,decodeURI),ce=e=>{const t=e.url,s=t.indexOf("/",t.indexOf(":")+4);let r=s;for(;r<t.length;r++){const a=t.charCodeAt(r);if(a===37){const n=t.indexOf("?",r),o=t.slice(s,n===-1?void 0:n);return Pe(o.includes("%25")?o.replace(/%25/g,"%2525"):o)}else if(a===63)break}return t.slice(s,r)},qe=e=>{const t=ce(e);return t.length>1&&t.at(-1)==="/"?t.slice(0,-1):t},it=(e,t,...s)=>(s.length&&(t=it(t,...s)),`${(e==null?void 0:e[0])==="/"?"":"/"}${e}${t==="/"?"":`${(e==null?void 0:e.at(-1))==="/"?"":"/"}${(t==null?void 0:t[0])==="/"?t.slice(1):t}`}`),le=e=>{if(e.charCodeAt(e.length-1)!==63||!e.includes(":"))return null;const t=e.split("/"),s=[];let r="";return t.forEach(a=>{if(a!==""&&!/\:/.test(a))r+="/"+a;else if(/\:/.test(a))if(/\?/.test(a)){s.length===0&&r===""?s.push("/"):s.push(r);const n=a.replace("?","");r+="/"+n,s.push(r)}else r+="/"+a}),s.filter((a,n,o)=>o.indexOf(a)===n)},qt=e=>/[%+]/.test(e)?(e.indexOf("+")!==-1&&(e=e.replace(/\+/g," ")),e.indexOf("%")!==-1?Wt(e,ue):e):e,de=(e,t,s)=>{let r;if(!s&&t&&!/[%+]/.test(t)){let o=e.indexOf("?",8);if(o===-1)return;for(e.startsWith(t,o+1)||(o=e.indexOf(`&${t}`,o+1));o!==-1;){const l=e.charCodeAt(o+t.length+1);if(l===61){const c=o+t.length+2,d=e.indexOf("&",c);return qt(e.slice(c,d===-1?void 0:d))}else if(l==38||isNaN(l))return"";o=e.indexOf(`&${t}`,o+1)}if(r=/[%+]/.test(e),!r)return}const a={};r??(r=/[%+]/.test(e));let n=e.indexOf("?",8);for(;n!==-1;){const o=e.indexOf("&",n+1);let l=e.indexOf("=",n);l>o&&o!==-1&&(l=-1);let c=e.slice(n+1,l===-1?o===-1?void 0:o:l);if(r&&(c=qt(c)),n=o,c==="")continue;let d;l===-1?d="":(d=e.slice(l+1,o===-1?void 0:o),r&&(d=qt(d))),s?(a[c]&&Array.isArray(a[c])||(a[c]=[]),a[c].push(d)):a[c]??(a[c]=d)}return t?a[t]:a},Ue=de,ze=(e,t)=>de(e,t,!0),ue=decodeURIComponent,Jt=e=>Wt(e,ue),dt,M,P,pe,he,zt,U,ee,fe=(ee=class{constructor(e,t="/",s=[[]]){b(this,P);g(this,"raw");b(this,dt);b(this,M);g(this,"routeIndex",0);g(this,"path");g(this,"bodyCache",{});b(this,U,e=>{const{bodyCache:t,raw:s}=this,r=t[e];if(r)return r;const a=Object.keys(t)[0];return a?t[a].then(n=>(a==="json"&&(n=JSON.stringify(n)),new Response(n)[e]())):t[e]=s[e]()});this.raw=e,this.path=t,m(this,M,s),m(this,dt,{})}param(e){return e?v(this,P,pe).call(this,e):v(this,P,he).call(this)}query(e){return Ue(this.url,e)}queries(e){return ze(this.url,e)}header(e){if(e)return this.raw.headers.get(e)??void 0;const t={};return this.raw.headers.forEach((s,r)=>{t[r]=s}),t}async parseBody(e){var t;return(t=this.bodyCache).parsedBody??(t.parsedBody=await Fe(this,e))}json(){return i(this,U).call(this,"text").then(e=>JSON.parse(e))}text(){return i(this,U).call(this,"text")}arrayBuffer(){return i(this,U).call(this,"arrayBuffer")}blob(){return i(this,U).call(this,"blob")}formData(){return i(this,U).call(this,"formData")}addValidatedData(e,t){i(this,dt)[e]=t}valid(e){return i(this,dt)[e]}get url(){return this.raw.url}get method(){return this.raw.method}get[$e](){return i(this,M)}get matchedRoutes(){return i(this,M)[0].map(([[,e]])=>e)}get routePath(){return i(this,M)[0].map(([[,e]])=>e)[this.routeIndex].path}},dt=new WeakMap,M=new WeakMap,P=new WeakSet,pe=function(e){const t=i(this,M)[0][this.routeIndex][1][e],s=v(this,P,zt).call(this,t);return s&&/\%/.test(s)?Jt(s):s},he=function(){const e={},t=Object.keys(i(this,M)[0][this.routeIndex][1]);for(const s of t){const r=v(this,P,zt).call(this,i(this,M)[0][this.routeIndex][1][s]);r!==void 0&&(e[s]=/\%/.test(r)?Jt(r):r)}return e},zt=function(e){return i(this,M)[1]?i(this,M)[1][e]:e},U=new WeakMap,ee),We={Stringify:1},me=async(e,t,s,r,a)=>{typeof e=="object"&&!(e instanceof String)&&(e instanceof Promise||(e=e.toString()),e instanceof Promise&&(e=await e));const n=e.callbacks;return n!=null&&n.length?(a?a[0]+=e:a=[e],Promise.all(n.map(l=>l({phase:t,buffer:a,context:r}))).then(l=>Promise.all(l.filter(Boolean).map(c=>me(c,t,!1,r,a))).then(()=>a[0]))):Promise.resolve(e)},Ge="text/plain; charset=UTF-8",Ut=(e,t)=>({"Content-Type":e,...t}),Ct,_t,H,ut,B,E,jt,ft,pt,Q,Rt,Et,z,ct,se,Ve=(se=class{constructor(e,t){b(this,z);b(this,Ct);b(this,_t);g(this,"env",{});b(this,H);g(this,"finalized",!1);g(this,"error");b(this,ut);b(this,B);b(this,E);b(this,jt);b(this,ft);b(this,pt);b(this,Q);b(this,Rt);b(this,Et);g(this,"render",(...e)=>(i(this,ft)??m(this,ft,t=>this.html(t)),i(this,ft).call(this,...e)));g(this,"setLayout",e=>m(this,jt,e));g(this,"getLayout",()=>i(this,jt));g(this,"setRenderer",e=>{m(this,ft,e)});g(this,"header",(e,t,s)=>{this.finalized&&m(this,E,new Response(i(this,E).body,i(this,E)));const r=i(this,E)?i(this,E).headers:i(this,Q)??m(this,Q,new Headers);t===void 0?r.delete(e):s!=null&&s.append?r.append(e,t):r.set(e,t)});g(this,"status",e=>{m(this,ut,e)});g(this,"set",(e,t)=>{i(this,H)??m(this,H,new Map),i(this,H).set(e,t)});g(this,"get",e=>i(this,H)?i(this,H).get(e):void 0);g(this,"newResponse",(...e)=>v(this,z,ct).call(this,...e));g(this,"body",(e,t,s)=>v(this,z,ct).call(this,e,t,s));g(this,"text",(e,t,s)=>!i(this,Q)&&!i(this,ut)&&!t&&!s&&!this.finalized?new Response(e):v(this,z,ct).call(this,e,t,Ut(Ge,s)));g(this,"json",(e,t,s)=>v(this,z,ct).call(this,JSON.stringify(e),t,Ut("application/json",s)));g(this,"html",(e,t,s)=>{const r=a=>v(this,z,ct).call(this,a,t,Ut("text/html; charset=UTF-8",s));return typeof e=="object"?me(e,We.Stringify,!1,{}).then(r):r(e)});g(this,"redirect",(e,t)=>{const s=String(e);return this.header("Location",/[^\x00-\xFF]/.test(s)?encodeURI(s):s),this.newResponse(null,t??302)});g(this,"notFound",()=>(i(this,pt)??m(this,pt,()=>new Response),i(this,pt).call(this,this)));m(this,Ct,e),t&&(m(this,B,t.executionCtx),this.env=t.env,m(this,pt,t.notFoundHandler),m(this,Et,t.path),m(this,Rt,t.matchResult))}get req(){return i(this,_t)??m(this,_t,new fe(i(this,Ct),i(this,Et),i(this,Rt))),i(this,_t)}get event(){if(i(this,B)&&"respondWith"in i(this,B))return i(this,B);throw Error("This context has no FetchEvent")}get executionCtx(){if(i(this,B))return i(this,B);throw Error("This context has no ExecutionContext")}get res(){return i(this,E)||m(this,E,new Response(null,{headers:i(this,Q)??m(this,Q,new Headers)}))}set res(e){if(i(this,E)&&e){e=new Response(e.body,e);for(const[t,s]of i(this,E).headers.entries())if(t!=="content-type")if(t==="set-cookie"){const r=i(this,E).headers.getSetCookie();e.headers.delete("set-cookie");for(const a of r)e.headers.append("set-cookie",a)}else e.headers.set(t,s)}m(this,E,e),this.finalized=!0}get var(){return i(this,H)?Object.fromEntries(i(this,H)):{}}},Ct=new WeakMap,_t=new WeakMap,H=new WeakMap,ut=new WeakMap,B=new WeakMap,E=new WeakMap,jt=new WeakMap,ft=new WeakMap,pt=new WeakMap,Q=new WeakMap,Rt=new WeakMap,Et=new WeakMap,z=new WeakSet,ct=function(e,t,s){const r=i(this,E)?new Headers(i(this,E).headers):i(this,Q)??new Headers;if(typeof t=="object"&&"headers"in t){const n=t.headers instanceof Headers?t.headers:new Headers(t.headers);for(const[o,l]of n)o.toLowerCase()==="set-cookie"?r.append(o,l):r.set(o,l)}if(s)for(const[n,o]of Object.entries(s))if(typeof o=="string")r.set(n,o);else{r.delete(n);for(const l of o)r.append(n,l)}const a=typeof t=="number"?t:(t==null?void 0:t.status)??i(this,ut);return new Response(e,{status:a,headers:r})},se),C="ALL",Ye="all",Je=["get","post","put","delete","options","patch"],ge="Can not add a route since the matcher is already built.",xe=class extends Error{},Ke="__COMPOSED_HANDLER",Ze=e=>e.text("404 Not Found",404),Kt=(e,t)=>{if("getResponse"in e){const s=e.getResponse();return t.newResponse(s.body,s)}return console.error(e),t.text("Internal Server Error",500)},F,_,be,A,Z,Ft,At,ht,Xe=(ht=class{constructor(t={}){b(this,_);g(this,"get");g(this,"post");g(this,"put");g(this,"delete");g(this,"options");g(this,"patch");g(this,"all");g(this,"on");g(this,"use");g(this,"router");g(this,"getPath");g(this,"_basePath","/");b(this,F,"/");g(this,"routes",[]);b(this,A,Ze);g(this,"errorHandler",Kt);g(this,"onError",t=>(this.errorHandler=t,this));g(this,"notFound",t=>(m(this,A,t),this));g(this,"fetch",(t,...s)=>v(this,_,At).call(this,t,s[1],s[0],t.method));g(this,"request",(t,s,r,a)=>t instanceof Request?this.fetch(s?new Request(t,s):t,r,a):(t=t.toString(),this.fetch(new Request(/^https?:\/\//.test(t)?t:`http://localhost${it("/",t)}`,s),r,a)));g(this,"fire",()=>{addEventListener("fetch",t=>{t.respondWith(v(this,_,At).call(this,t.request,t,void 0,t.request.method))})});[...Je,Ye].forEach(n=>{this[n]=(o,...l)=>(typeof o=="string"?m(this,F,o):v(this,_,Z).call(this,n,i(this,F),o),l.forEach(c=>{v(this,_,Z).call(this,n,i(this,F),c)}),this)}),this.on=(n,o,...l)=>{for(const c of[o].flat()){m(this,F,c);for(const d of[n].flat())l.map(u=>{v(this,_,Z).call(this,d.toUpperCase(),i(this,F),u)})}return this},this.use=(n,...o)=>(typeof n=="string"?m(this,F,n):(m(this,F,"*"),o.unshift(n)),o.forEach(l=>{v(this,_,Z).call(this,C,i(this,F),l)}),this);const{strict:r,...a}=t;Object.assign(this,a),this.getPath=r??!0?t.getPath??ce:qe}route(t,s){const r=this.basePath(t);return s.routes.map(a=>{var o;let n;s.errorHandler===Kt?n=a.handler:(n=async(l,c)=>(await Yt([],s.errorHandler)(l,()=>a.handler(l,c))).res,n[Ke]=a.handler),v(o=r,_,Z).call(o,a.method,a.path,n)}),this}basePath(t){const s=v(this,_,be).call(this);return s._basePath=it(this._basePath,t),s}mount(t,s,r){let a,n;r&&(typeof r=="function"?n=r:(n=r.optionHandler,r.replaceRequest===!1?a=c=>c:a=r.replaceRequest));const o=n?c=>{const d=n(c);return Array.isArray(d)?d:[d]}:c=>{let d;try{d=c.executionCtx}catch{}return[c.env,d]};a||(a=(()=>{const c=it(this._basePath,t),d=c==="/"?0:c.length;return u=>{const f=new URL(u.url);return f.pathname=f.pathname.slice(d)||"/",new Request(f,u)}})());const l=async(c,d)=>{const u=await s(a(c.req.raw),...o(c));if(u)return u;await d()};return v(this,_,Z).call(this,C,it(t,"*"),l),this}},F=new WeakMap,_=new WeakSet,be=function(){const t=new ht({router:this.router,getPath:this.getPath});return t.errorHandler=this.errorHandler,m(t,A,i(this,A)),t.routes=this.routes,t},A=new WeakMap,Z=function(t,s,r){t=t.toUpperCase(),s=it(this._basePath,s);const a={basePath:this._basePath,path:s,method:t,handler:r};this.router.add(t,s,[r,a]),this.routes.push(a)},Ft=function(t,s){if(t instanceof Error)return this.errorHandler(t,s);throw t},At=function(t,s,r,a){if(a==="HEAD")return(async()=>new Response(null,await v(this,_,At).call(this,t,s,r,"GET")))();const n=this.getPath(t,{env:r}),o=this.router.match(a,n),l=new Ve(t,{path:n,matchResult:o,env:r,executionCtx:s,notFoundHandler:i(this,A)});if(o[0].length===1){let d;try{d=o[0][0][0][0](l,async()=>{l.res=await i(this,A).call(this,l)})}catch(u){return v(this,_,Ft).call(this,u,l)}return d instanceof Promise?d.then(u=>u||(l.finalized?l.res:i(this,A).call(this,l))).catch(u=>v(this,_,Ft).call(this,u,l)):d??i(this,A).call(this,l)}const c=Yt(o[0],this.errorHandler,i(this,A));return(async()=>{try{const d=await c(l);if(!d.finalized)throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return d.res}catch(d){return v(this,_,Ft).call(this,d,l)}})()},ht),ve=[];function Qe(e,t){const s=this.buildAllMatchers(),r=(a,n)=>{const o=s[a]||s[C],l=o[2][n];if(l)return l;const c=n.match(o[0]);if(!c)return[[],ve];const d=c.indexOf("",1);return[o[1][d],c]};return this.match=r,r(e,t)}var Ot="[^/]+",wt=".*",kt="(?:|/.*)",lt=Symbol(),ts=new Set(".\\+*[^]$()");function es(e,t){return e.length===1?t.length===1?e<t?-1:1:-1:t.length===1||e===wt||e===kt?1:t===wt||t===kt?-1:e===Ot?1:t===Ot?-1:e.length===t.length?e<t?-1:1:t.length-e.length}var tt,et,T,at,ss=(at=class{constructor(){b(this,tt);b(this,et);b(this,T,Object.create(null))}insert(t,s,r,a,n){if(t.length===0){if(i(this,tt)!==void 0)throw lt;if(n)return;m(this,tt,s);return}const[o,...l]=t,c=o==="*"?l.length===0?["","",wt]:["","",Ot]:o==="/*"?["","",kt]:o.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);let d;if(c){const u=c[1];let f=c[2]||Ot;if(u&&c[2]&&(f===".*"||(f=f.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(f))))throw lt;if(d=i(this,T)[f],!d){if(Object.keys(i(this,T)).some(p=>p!==wt&&p!==kt))throw lt;if(n)return;d=i(this,T)[f]=new at,u!==""&&m(d,et,a.varIndex++)}!n&&u!==""&&r.push([u,i(d,et)])}else if(d=i(this,T)[o],!d){if(Object.keys(i(this,T)).some(u=>u.length>1&&u!==wt&&u!==kt))throw lt;if(n)return;d=i(this,T)[o]=new at}d.insert(l,s,r,a,n)}buildRegExpStr(){const s=Object.keys(i(this,T)).sort(es).map(r=>{const a=i(this,T)[r];return(typeof i(a,et)=="number"?`(${r})@${i(a,et)}`:ts.has(r)?`\\${r}`:r)+a.buildRegExpStr()});return typeof i(this,tt)=="number"&&s.unshift(`#${i(this,tt)}`),s.length===0?"":s.length===1?s[0]:"(?:"+s.join("|")+")"}},tt=new WeakMap,et=new WeakMap,T=new WeakMap,at),Dt,St,re,rs=(re=class{constructor(){b(this,Dt,{varIndex:0});b(this,St,new ss)}insert(e,t,s){const r=[],a=[];for(let o=0;;){let l=!1;if(e=e.replace(/\{[^}]+\}/g,c=>{const d=`@\\${o}`;return a[o]=[d,c],o++,l=!0,d}),!l)break}const n=e.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let o=a.length-1;o>=0;o--){const[l]=a[o];for(let c=n.length-1;c>=0;c--)if(n[c].indexOf(l)!==-1){n[c]=n[c].replace(l,a[o][1]);break}}return i(this,St).insert(n,t,r,i(this,Dt),s),r}buildRegExp(){let e=i(this,St).buildRegExpStr();if(e==="")return[/^$/,[],[]];let t=0;const s=[],r=[];return e=e.replace(/#(\d+)|@(\d+)|\.\*\$/g,(a,n,o)=>n!==void 0?(s[++t]=Number(n),"$()"):(o!==void 0&&(r[Number(o)]=++t),"")),[new RegExp(`^${e}`),s,r]}},Dt=new WeakMap,St=new WeakMap,re),as=[/^$/,[],Object.create(null)],Tt=Object.create(null);function ye(e){return Tt[e]??(Tt[e]=new RegExp(e==="*"?"":`^${e.replace(/\/\*$|([.\\+*[^\]$()])/g,(t,s)=>s?`\\${s}`:"(?:|/.*)")}$`))}function ns(){Tt=Object.create(null)}function os(e){var d;const t=new rs,s=[];if(e.length===0)return as;const r=e.map(u=>[!/\*|\/:/.test(u[0]),...u]).sort(([u,f],[p,h])=>u?1:p?-1:f.length-h.length),a=Object.create(null);for(let u=0,f=-1,p=r.length;u<p;u++){const[h,y,k]=r[u];h?a[y]=[k.map(([w])=>[w,Object.create(null)]),ve]:f++;let x;try{x=t.insert(y,f,h)}catch(w){throw w===lt?new xe(y):w}h||(s[f]=k.map(([w,S])=>{const K=Object.create(null);for(S-=1;S>=0;S--){const[nt,I]=x[S];K[nt]=I}return[w,K]}))}const[n,o,l]=t.buildRegExp();for(let u=0,f=s.length;u<f;u++)for(let p=0,h=s[u].length;p<h;p++){const y=(d=s[u][p])==null?void 0:d[1];if(!y)continue;const k=Object.keys(y);for(let x=0,w=k.length;x<w;x++)y[k[x]]=l[y[k[x]]]}const c=[];for(const u in o)c[u]=s[o[u]];return[n,c,a]}function ot(e,t){if(e){for(const s of Object.keys(e).sort((r,a)=>a.length-r.length))if(ye(s).test(t))return[...e[s]]}}var W,G,Ht,we,ae,is=(ae=class{constructor(){b(this,Ht);g(this,"name","RegExpRouter");b(this,W);b(this,G);g(this,"match",Qe);m(this,W,{[C]:Object.create(null)}),m(this,G,{[C]:Object.create(null)})}add(e,t,s){var l;const r=i(this,W),a=i(this,G);if(!r||!a)throw new Error(ge);r[e]||[r,a].forEach(c=>{c[e]=Object.create(null),Object.keys(c[C]).forEach(d=>{c[e][d]=[...c[C][d]]})}),t==="/*"&&(t="*");const n=(t.match(/\/:/g)||[]).length;if(/\*$/.test(t)){const c=ye(t);e===C?Object.keys(r).forEach(d=>{var u;(u=r[d])[t]||(u[t]=ot(r[d],t)||ot(r[C],t)||[])}):(l=r[e])[t]||(l[t]=ot(r[e],t)||ot(r[C],t)||[]),Object.keys(r).forEach(d=>{(e===C||e===d)&&Object.keys(r[d]).forEach(u=>{c.test(u)&&r[d][u].push([s,n])})}),Object.keys(a).forEach(d=>{(e===C||e===d)&&Object.keys(a[d]).forEach(u=>c.test(u)&&a[d][u].push([s,n]))});return}const o=le(t)||[t];for(let c=0,d=o.length;c<d;c++){const u=o[c];Object.keys(a).forEach(f=>{var p;(e===C||e===f)&&((p=a[f])[u]||(p[u]=[...ot(r[f],u)||ot(r[C],u)||[]]),a[f][u].push([s,n-d+c+1]))})}}buildAllMatchers(){const e=Object.create(null);return Object.keys(i(this,G)).concat(Object.keys(i(this,W))).forEach(t=>{e[t]||(e[t]=v(this,Ht,we).call(this,t))}),m(this,W,m(this,G,void 0)),ns(),e}},W=new WeakMap,G=new WeakMap,Ht=new WeakSet,we=function(e){const t=[];let s=e===C;return[i(this,W),i(this,G)].forEach(r=>{const a=r[e]?Object.keys(r[e]).map(n=>[n,r[e][n]]):[];a.length!==0?(s||(s=!0),t.push(...a)):e!==C&&t.push(...Object.keys(r[C]).map(n=>[n,r[C][n]]))}),s?os(t):null},ae),V,L,ne,cs=(ne=class{constructor(e){g(this,"name","SmartRouter");b(this,V,[]);b(this,L,[]);m(this,V,e.routers)}add(e,t,s){if(!i(this,L))throw new Error(ge);i(this,L).push([e,t,s])}match(e,t){if(!i(this,L))throw new Error("Fatal error");const s=i(this,V),r=i(this,L),a=s.length;let n=0,o;for(;n<a;n++){const l=s[n];try{for(let c=0,d=r.length;c<d;c++)l.add(...r[c]);o=l.match(e,t)}catch(c){if(c instanceof xe)continue;throw c}this.match=l.match.bind(l),m(this,V,[l]),m(this,L,void 0);break}if(n===a)throw new Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,o}get activeRouter(){if(i(this,L)||i(this,V).length!==1)throw new Error("No active router has been determined yet.");return i(this,V)[0]}},V=new WeakMap,L=new WeakMap,ne),yt=Object.create(null),Y,R,st,mt,j,N,X,gt,ls=(gt=class{constructor(t,s,r){b(this,N);b(this,Y);b(this,R);b(this,st);b(this,mt,0);b(this,j,yt);if(m(this,R,r||Object.create(null)),m(this,Y,[]),t&&s){const a=Object.create(null);a[t]={handler:s,possibleKeys:[],score:0},m(this,Y,[a])}m(this,st,[])}insert(t,s,r){m(this,mt,++Vt(this,mt)._);let a=this;const n=He(s),o=[];for(let l=0,c=n.length;l<c;l++){const d=n[l],u=n[l+1],f=Ne(d,u),p=Array.isArray(f)?f[0]:d;if(p in i(a,R)){a=i(a,R)[p],f&&o.push(f[1]);continue}i(a,R)[p]=new gt,f&&(i(a,st).push(f),o.push(f[1])),a=i(a,R)[p]}return i(a,Y).push({[t]:{handler:r,possibleKeys:o.filter((l,c,d)=>d.indexOf(l)===c),score:i(this,mt)}}),a}search(t,s){var c;const r=[];m(this,j,yt);let n=[this];const o=ie(s),l=[];for(let d=0,u=o.length;d<u;d++){const f=o[d],p=d===u-1,h=[];for(let y=0,k=n.length;y<k;y++){const x=n[y],w=i(x,R)[f];w&&(m(w,j,i(x,j)),p?(i(w,R)["*"]&&r.push(...v(this,N,X).call(this,i(w,R)["*"],t,i(x,j))),r.push(...v(this,N,X).call(this,w,t,i(x,j)))):h.push(w));for(let S=0,K=i(x,st).length;S<K;S++){const nt=i(x,st)[S],I=i(x,j)===yt?{}:{...i(x,j)};if(nt==="*"){const q=i(x,R)["*"];q&&(r.push(...v(this,N,X).call(this,q,t,i(x,j))),m(q,j,I),h.push(q));continue}const[Lt,Mt,vt]=nt;if(!f&&!(vt instanceof RegExp))continue;const D=i(x,R)[Lt],Se=o.slice(d).join("/");if(vt instanceof RegExp){const q=vt.exec(Se);if(q){if(I[Mt]=q[0],r.push(...v(this,N,X).call(this,D,t,i(x,j),I)),Object.keys(i(D,R)).length){m(D,j,I);const Nt=((c=q[0].match(/\//))==null?void 0:c.length)??0;(l[Nt]||(l[Nt]=[])).push(D)}continue}}(vt===!0||vt.test(f))&&(I[Mt]=f,p?(r.push(...v(this,N,X).call(this,D,t,I,i(x,j))),i(D,R)["*"]&&r.push(...v(this,N,X).call(this,i(D,R)["*"],t,I,i(x,j)))):(m(D,j,I),h.push(D)))}}n=h.concat(l.shift()??[])}return r.length>1&&r.sort((d,u)=>d.score-u.score),[r.map(({handler:d,params:u})=>[d,u])]}},Y=new WeakMap,R=new WeakMap,st=new WeakMap,mt=new WeakMap,j=new WeakMap,N=new WeakSet,X=function(t,s,r,a){const n=[];for(let o=0,l=i(t,Y).length;o<l;o++){const c=i(t,Y)[o],d=c[s]||c[C],u={};if(d!==void 0&&(d.params=Object.create(null),n.push(d),r!==yt||a&&a!==yt))for(let f=0,p=d.possibleKeys.length;f<p;f++){const h=d.possibleKeys[f],y=u[d.score];d.params[h]=a!=null&&a[h]&&!y?a[h]:r[h]??(a==null?void 0:a[h]),u[d.score]=!0}}return n},gt),rt,oe,ds=(oe=class{constructor(){g(this,"name","TrieRouter");b(this,rt);m(this,rt,new ls)}add(e,t,s){const r=le(t);if(r){for(let a=0,n=r.length;a<n;a++)i(this,rt).insert(e,r[a],s);return}i(this,rt).insert(e,t,s)}match(e,t){return i(this,rt).search(e,t)}},rt=new WeakMap,oe),J=class extends Xe{constructor(e={}){super(e),this.router=e.router??new cs({routers:[new is,new ds]})}},us=/^\s*(?:text\/(?!event-stream(?:[;\s]|$))[^;\s]+|application\/(?:javascript|json|xml|xml-dtd|ecmascript|dart|postscript|rtf|tar|toml|vnd\.dart|vnd\.ms-fontobject|vnd\.ms-opentype|wasm|x-httpd-php|x-javascript|x-ns-proxy-autoconfig|x-sh|x-tar|x-virtualbox-hdd|x-virtualbox-ova|x-virtualbox-ovf|x-virtualbox-vbox|x-virtualbox-vdi|x-virtualbox-vhd|x-virtualbox-vmdk|x-www-form-urlencoded)|font\/(?:otf|ttf)|image\/(?:bmp|vnd\.adobe\.photoshop|vnd\.microsoft\.icon|vnd\.ms-dds|x-icon|x-ms-bmp)|message\/rfc822|model\/gltf-binary|x-shader\/x-fragment|x-shader\/x-vertex|[^;\s]+?\+(?:json|text|xml|yaml))(?:[;\s]|$)/i,Zt=(e,t=ps)=>{const s=/\.([a-zA-Z0-9]+?)$/,r=e.match(s);if(!r)return;let a=t[r[1]];return a&&a.startsWith("text")&&(a+="; charset=utf-8"),a},fs={aac:"audio/aac",avi:"video/x-msvideo",avif:"image/avif",av1:"video/av1",bin:"application/octet-stream",bmp:"image/bmp",css:"text/css",csv:"text/csv",eot:"application/vnd.ms-fontobject",epub:"application/epub+zip",gif:"image/gif",gz:"application/gzip",htm:"text/html",html:"text/html",ico:"image/x-icon",ics:"text/calendar",jpeg:"image/jpeg",jpg:"image/jpeg",js:"text/javascript",json:"application/json",jsonld:"application/ld+json",map:"application/json",mid:"audio/x-midi",midi:"audio/x-midi",mjs:"text/javascript",mp3:"audio/mpeg",mp4:"video/mp4",mpeg:"video/mpeg",oga:"audio/ogg",ogv:"video/ogg",ogx:"application/ogg",opus:"audio/opus",otf:"font/otf",pdf:"application/pdf",png:"image/png",rtf:"application/rtf",svg:"image/svg+xml",tif:"image/tiff",tiff:"image/tiff",ts:"video/mp2t",ttf:"font/ttf",txt:"text/plain",wasm:"application/wasm",webm:"video/webm",weba:"audio/webm",webmanifest:"application/manifest+json",webp:"image/webp",woff:"font/woff",woff2:"font/woff2",xhtml:"application/xhtml+xml",xml:"application/xml",zip:"application/zip","3gp":"video/3gpp","3g2":"video/3gpp2",gltf:"model/gltf+json",glb:"model/gltf-binary"},ps=fs,hs=(...e)=>{let t=e.filter(a=>a!=="").join("/");t=t.replace(new RegExp("(?<=\\/)\\/+","g"),"");const s=t.split("/"),r=[];for(const a of s)a===".."&&r.length>0&&r.at(-1)!==".."?r.pop():a!=="."&&r.push(a);return r.join("/")||"."},ke={br:".br",zstd:".zst",gzip:".gz"},ms=Object.keys(ke),gs="index.html",xs=e=>{const t=e.root??"./",s=e.path,r=e.join??hs;return async(a,n)=>{var u,f,p,h;if(a.finalized)return n();let o;if(e.path)o=e.path;else try{if(o=decodeURIComponent(a.req.path),/(?:^|[\/\\])\.\.(?:$|[\/\\])/.test(o))throw new Error}catch{return await((u=e.onNotFound)==null?void 0:u.call(e,a.req.path,a)),n()}let l=r(t,!s&&e.rewriteRequestPath?e.rewriteRequestPath(o):o);e.isDir&&await e.isDir(l)&&(l=r(l,gs));const c=e.getContent;let d=await c(l,a);if(d instanceof Response)return a.newResponse(d.body,d);if(d){const y=e.mimes&&Zt(l,e.mimes)||Zt(l);if(a.header("Content-Type",y||"application/octet-stream"),e.precompressed&&(!y||us.test(y))){const k=new Set((f=a.req.header("Accept-Encoding"))==null?void 0:f.split(",").map(x=>x.trim()));for(const x of ms){if(!k.has(x))continue;const w=await c(l+ke[x],a);if(w){d=w,a.header("Content-Encoding",x),a.header("Vary","Accept-Encoding",{append:!0});break}}}return await((p=e.onFound)==null?void 0:p.call(e,l,a)),a.body(d)}await((h=e.onNotFound)==null?void 0:h.call(e,l,a)),await n()}},bs=async(e,t)=>{let s;t&&t.manifest?typeof t.manifest=="string"?s=JSON.parse(t.manifest):s=t.manifest:typeof __STATIC_CONTENT_MANIFEST=="string"?s=JSON.parse(__STATIC_CONTENT_MANIFEST):s=__STATIC_CONTENT_MANIFEST;let r;t&&t.namespace?r=t.namespace:r=__STATIC_CONTENT;const a=s[e]||e;if(!a)return null;const n=await r.get(a,{type:"stream"});return n||null},vs=e=>async function(s,r){return xs({...e,getContent:async n=>bs(n,{manifest:e.manifest,namespace:e.namespace?e.namespace:s.env?s.env.__STATIC_CONTENT:void 0})})(s,r)},Ce=e=>vs(e),ys=e=>{const s={...{origin:"*",allowMethods:["GET","HEAD","PUT","POST","DELETE","PATCH"],allowHeaders:[],exposeHeaders:[]},...e},r=(n=>typeof n=="string"?n==="*"?()=>n:o=>n===o?o:null:typeof n=="function"?n:o=>n.includes(o)?o:null)(s.origin),a=(n=>typeof n=="function"?n:Array.isArray(n)?()=>n:()=>[])(s.allowMethods);return async function(o,l){var u;function c(f,p){o.res.headers.set(f,p)}const d=await r(o.req.header("origin")||"",o);if(d&&c("Access-Control-Allow-Origin",d),s.credentials&&c("Access-Control-Allow-Credentials","true"),(u=s.exposeHeaders)!=null&&u.length&&c("Access-Control-Expose-Headers",s.exposeHeaders.join(",")),o.req.method==="OPTIONS"){s.origin!=="*"&&c("Vary","Origin"),s.maxAge!=null&&c("Access-Control-Max-Age",s.maxAge.toString());const f=await a(o.req.header("origin")||"",o);f.length&&c("Access-Control-Allow-Methods",f.join(","));let p=s.allowHeaders;if(!(p!=null&&p.length)){const h=o.req.header("Access-Control-Request-Headers");h&&(p=h.split(/\s*,\s*/))}return p!=null&&p.length&&(c("Access-Control-Allow-Headers",p.join(",")),o.res.headers.append("Vary","Access-Control-Request-Headers")),o.res.headers.delete("Content-Length"),o.res.headers.delete("Content-Type"),new Response(null,{headers:o.res.headers,status:204,statusText:"No Content"})}await l(),s.origin!=="*"&&o.header("Vary","Origin",{append:!0})}};class Xt{static calculate(t){const s=t.cnt_win+t.cnt_plc,r=Math.min(1,Math.sqrt(s/500)),a=t.rate_win_ret*.3+t.rate_plc_ret*.7-80,n=10*Math.tanh(a*r/25),o=this.getGrade(n);return{score:Math.round(n*100)/100,grade:o,reliability:Math.round(r*1e3)/1e3,weightedDiff:Math.round(a*100)/100}}static getGrade(t){return t>=7?"S":t>=4?"A":t>=1?"B":t>=-3?"C":"D"}static getGradeDescription(t){return{S:"極めて優秀 - 高い収益性が期待できる",A:"優秀 - 安定した収益が見込める",B:"良好 - プラス収益の可能性が高い",C:"平均 - 標準的なパフォーマンス",D:"要改善 - 収益性が低い可能性がある"}[t]||"不明"}}class Qt{static calculate(t){const s=new Map,r=this.groupByRaceId(t);for(const[a,n]of r.entries()){const o=n.map(h=>({horse:h,nMin:Math.min(h.cnt_win,h.cnt_plc),hitRaw:.65*h.rate_win_hit+.35*h.rate_plc_hit,retRaw:.35*h.rate_win_ret+.65*h.rate_plc_ret})),l=o.map(h=>h.hitRaw),c=o.map(h=>h.retRaw),d=this.mean(l),u=this.stdDev(l,d),f=this.mean(c),p=this.stdDev(c,f);for(const{horse:h,nMin:y,hitRaw:k,retRaw:x}of o){const w=u>0?(k-d)/u:0,S=p>0?(x-f)/p:0,K=Math.sqrt(y/(y+400)),nt=.55*w+.45*S,I=Math.round(12*Math.tanh(nt)*K*10)/10,Lt=this.getGrade(I),Mt=`${a}_${h.cnt_win}_${h.cnt_plc}`;s.set(Mt,{score:I,grade:Lt,hitRaw:Math.round(k*100)/100,retRaw:Math.round(x*100)/100,shrinkage:Math.round(K*1e3)/1e3})}}return s}static groupByRaceId(t){const s=new Map;for(const r of t){const a=s.get(r.group_id)||[];a.push(r),s.set(r.group_id,a)}return s}static mean(t){return t.length===0?0:t.reduce((s,r)=>s+r,0)/t.length}static stdDev(t,s){if(t.length<=1)return 0;const r=t.reduce((a,n)=>a+Math.pow(n-s,2),0)/t.length;return Math.sqrt(r)}static getGrade(t){return t>=8?"S+":t>=5?"S":t>=2?"A":t>=-1?"B":t>=-4?"C":"D"}static getGradeDescription(t){return{"S+":"最高評価 - レース内で圧倒的な優位性",S:"極めて優秀 - レース内で明確な優位性",A:"優秀 - レース内で有力候補",B:"良好 - レース内で競争力あり",C:"平均 - レース内で標準的な位置",D:"要改善 - レース内で劣勢"}[t]||"不明"}}const xt=new J;xt.use("/*",ys());xt.post("/rgs/calculate",async e=>{try{const t=await e.req.json();if(typeof t.cnt_win!="number"||t.cnt_win<0)return e.json({error:"cnt_win must be a positive number"},400);if(typeof t.cnt_plc!="number"||t.cnt_plc<0)return e.json({error:"cnt_plc must be a positive number"},400);if(typeof t.rate_win_ret!="number")return e.json({error:"rate_win_ret must be a number"},400);if(typeof t.rate_plc_ret!="number")return e.json({error:"rate_plc_ret must be a number"},400);const s=Xt.calculate(t);return e.json({success:!0,data:{score:s.score,grade:s.grade,reliability:s.reliability,weightedDiff:s.weightedDiff,description:Xt.getGradeDescription(s.grade)}})}catch(t){return console.error("RGS calculation error:",t),e.json({success:!1,error:"RGS calculation failed",message:t instanceof Error?t.message:"Unknown error"},500)}});xt.post("/aas/calculate",async e=>{try{const t=await e.req.json();if(!Array.isArray(t.horses)||t.horses.length===0)return e.json({error:"horses must be a non-empty array"},400);for(const a of t.horses){if(!a.group_id||typeof a.group_id!="string")return e.json({error:"group_id is required and must be a string"},400);if(typeof a.cnt_win!="number"||a.cnt_win<0)return e.json({error:"cnt_win must be a positive number"},400);if(typeof a.cnt_plc!="number"||a.cnt_plc<0)return e.json({error:"cnt_plc must be a positive number"},400);if(typeof a.rate_win_hit!="number")return e.json({error:"rate_win_hit must be a number"},400);if(typeof a.rate_plc_hit!="number")return e.json({error:"rate_plc_hit must be a number"},400);if(typeof a.rate_win_ret!="number")return e.json({error:"rate_win_ret must be a number"},400);if(typeof a.rate_plc_ret!="number")return e.json({error:"rate_plc_ret must be a number"},400)}const s=Qt.calculate(t.horses),r=Array.from(s.entries()).map(([a,n])=>({key:a,score:n.score,grade:n.grade,hitRaw:n.hitRaw,retRaw:n.retRaw,shrinkage:n.shrinkage,description:Qt.getGradeDescription(n.grade)}));return e.json({success:!0,data:{count:r.length,results:r}})}catch(t){return console.error("AAS calculation error:",t),e.json({success:!1,error:"AAS calculation failed",message:t instanceof Error?t.message:"Unknown error"},500)}});xt.post("/factor/test",async e=>{try{const t=await e.req.json();if(!Array.isArray(t.factors)||t.factors.length===0)return e.json({error:"factors must be a non-empty array"},400);if(!Array.isArray(t.testData)||t.testData.length===0)return e.json({error:"testData must be a non-empty array"},400);const s=t.factors.reduce((p,h)=>p+h.weight,0);if(Math.abs(s-100)>.01)return e.json({error:"Total weight must be 100%"},400);const r=t.testData.map(p=>{var x,w;const h=((x=t.factors.find(S=>S.name==="RGS基礎値"))==null?void 0:x.weight)||0,y=((w=t.factors.find(S=>S.name==="AAS基礎値"))==null?void 0:w.weight)||0,k=p.rgs_score*h/100+p.aas_score*y/100;return{...p,factor_score:k}}),a=new Map;for(const p of r){const h=a.get(p.race_id)||[];h.push(p),a.set(p.race_id,h)}const n=[];for(const[p,h]of a.entries())h.sort((k,x)=>x.factor_score-k.factor_score).forEach((k,x)=>{n.push({...k,predicted_rank:x+1})});let o=0,l=0,c=r.length;for(const p of n)p.predicted_rank===1&&p.actual_rank<=3&&(o++,l+=100*(4-p.actual_rank));const d=o/c*100,u=l/(c*100)*100,f=u-100;return e.json({success:!0,data:{performance:{hit_rate:Math.round(d*10)/10,recovery_rate:Math.round(u*10)/10,roi:Math.round(f*10)/10,total_bets:c,total_hits:o,total_return:l},predictions:n.slice(0,10)}})}catch(t){return console.error("Factor test error:",t),e.json({success:!1,error:"Factor test failed",message:t instanceof Error?t.message:"Unknown error"},500)}});xt.get("/health",e=>e.json({success:!0,message:"UMAYOMI API is running",version:"1.0.0",timestamp:new Date().toISOString()}));const _e=new J;_e.get("/condition-settings",e=>e.html(`<!DOCTYPE html>
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
</html>`));const je=new J;je.get("/analysis",e=>e.html(`<!DOCTYPE html>
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
</html>`));const $={tomorrowRaces:new Map,uploadedDate:"",factorsStore:[],addFactor(e){this.factorsStore.push(e)},getFactor(e){return this.factorsStore.find(t=>t.id===e)},deleteFactor(e){const t=this.factorsStore.findIndex(s=>s.id===e);t!==-1&&this.factorsStore.splice(t,1)},updateFactor(e,t){const s=this.getFactor(e);s&&Object.assign(s,t)},getAllFactors(){return this.factorsStore}},bt=new J;bt.get("/factor-register",e=>e.html(`<!DOCTYPE html>
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
</html>`));bt.get("/api/factors",async e=>{try{return e.json($.getAllFactors())}catch(t){return console.error("Failed to get factors:",t),e.json({error:"Failed to get factors"},500)}});bt.post("/api/factors",async e=>{try{const{name:t,description:s,conditions:r}=await e.req.json();if(!t||!s||!r)return e.json({error:"Missing required fields"},400);const a={id:Date.now(),name:t,description:s,conditions:JSON.stringify(r),created_at:new Date().toISOString()};return $.addFactor(a),e.json({id:a.id,message:"Factor saved successfully"})}catch(t){return console.error("Failed to save factor:",t),e.json({error:"Failed to save factor"},500)}});bt.delete("/api/factors/:id",async e=>{try{const t=parseInt(e.req.param("id"));return $.deleteFactor(t),e.json({message:"Factor deleted successfully"})}catch(t){return console.error("Failed to delete factor:",t),e.json({error:"Failed to delete factor"},500)}});bt.put("/api/factors/:id",async e=>{try{const t=parseInt(e.req.param("id")),{name:s,description:r,conditions:a}=await e.req.json();return $.updateFactor(t,{name:s,description:r,conditions:JSON.stringify(a)}),e.json({message:"Factor updated successfully"})}catch(t){return console.error("Failed to update factor:",t),e.json({error:"Failed to update factor"},500)}});class Re{parse(t){if(!t||t.length<46)return null;try{const s=t.substring(2,10);return{track_code:t.substring(0,2).trim(),race_date:this.parseDate(s),race_number:t.substring(10,12).trim(),horse_number:t.substring(12,14).trim(),horse_id:t.substring(14,22).trim(),time_1:t.substring(22,25).trim(),time_2:t.substring(25,28).trim(),time_3:t.substring(28,31).trim(),time_4:t.substring(31,34).trim(),time_5:t.substring(34,37).trim(),time_6:t.substring(37,40).trim(),time_7:t.substring(40,43).trim(),time_8:t.substring(43,46).trim(),raw:t}}catch(s){return console.error("Failed to parse HC line:",s),null}}parseFile(t){const s=t.split(/\r?\n/),r=[];for(const a of s)if(a.trim()){const n=this.parse(a);n&&r.push(n)}return r}parseDate(t){return t}parseFilenameDate(t){const s=t.match(/HC\d{2}(\d{3})(\d{2})(\d{2})/);if(s){const r="20"+s[1].substring(1),a=s[2],n=s[3];return`${r}-${a}-${n}`}return""}getTrackName(t){return{"01":"札幌","02":"函館","03":"福島","04":"新潟","05":"東京","06":"中山","07":"中京","08":"京都","09":"阪神",10:"小倉"}[t]||t}groupByRace(t){const s=new Map;for(const r of t){const a=`${r.track_code}-${r.race_date}-${r.race_number}`;s.has(a)||s.set(a,[]),s.get(a).push(r)}return s}}const Bt=new J;Bt.get("/tomorrow-races",e=>e.html(`<!DOCTYPE html>
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
</html>`));Bt.post("/api/tomorrow-races/upload",async e=>{try{const{filename:t,content:s}=await e.req.json();if(!t||!s)return e.json({error:"Missing required fields"},400);const r=new Re,a=r.parseFile(s);if(a.length===0)return e.json({error:"No records found in file"},400);const n=r.groupByRace(a);return $.tomorrowRaces=n,$.uploadedDate=r.parseFilenameDate(t),e.json({message:"File uploaded successfully",totalRecords:a.length,totalRaces:n.size,uploadedDate:$.uploadedDate})}catch(t){return console.error("Failed to upload CK_DATA:",t),e.json({error:"Failed to upload file"},500)}});Bt.get("/api/tomorrow-races",async e=>{try{const t=[],s=new Re;for(const[r,a]of $.tomorrowRaces){const n=a[0];t.push({trackCode:n.track_code,trackName:s.getTrackName(n.track_code),date:$.uploadedDate||n.race_date,raceNumber:n.race_number,horseCount:a.length,horses:a.map(o=>({horseNumber:o.horse_number,horseId:o.horse_id}))})}return t.sort((r,a)=>parseInt(r.raceNumber)-parseInt(a.raceNumber)),e.json({races:t,uploadedDate:$.uploadedDate})}catch(t){return console.error("Failed to get tomorrow races:",t),e.json({error:"Failed to get races"},500)}});class ws{applyFactor(t,s,r){return t.map(a=>{const n=this.calculateRGS(a,s,r),o=this.calculateAAS(a,s),l=(n+o)/2,{matched:c,total:d}=this.countMatchedConditions(a,s);return{...a,rgs:n,aas:o,total_score:l,matched_conditions:c,total_conditions:d}})}calculateRGS(t,s,r){let a=50;const{race:n}=s;return n.track&&n.track===r.track&&(a+=10),n.distanceMin&&n.distanceMax&&(r.distance>=n.distanceMin&&r.distance<=n.distanceMax?a+=15:a-=10),n.surface&&n.surface===r.surface&&(a+=10),Math.max(0,Math.min(100,a))}calculateAAS(t,s){let r=50,a=0,n=s.factors.length;if(n===0)return r;for(const l of s.factors){const c=this.getHorseValue(t,l.factor);if(c===null)continue;this.checkCondition(c,l.operator,l.value)&&a++}return r=50+a/n*50,Math.max(0,Math.min(100,r))}getHorseValue(t,s){switch(s){case"odds":return t.odds??this.generateMockOdds();case"popularity":return t.popularity??this.generateMockPopularity();case"weight":return t.weight??55;case"horse_weight":return t.horse_weight??this.generateMockHorseWeight();case"jockey_win_rate":return t.jockey_win_rate??this.generateMockWinRate();case"trainer_win_rate":return t.trainer_win_rate??this.generateMockWinRate();case"recent_form":return t.recent_form??this.generateMockForm();case"speed_index":return t.speed_index??this.generateMockIndex();case"pace_index":return t.pace_index??this.generateMockIndex();case"position_index":return t.position_index??this.generateMockIndex();default:return null}}checkCondition(t,s,r){switch(s){case"gte":return t>=r;case"lte":return t<=r;case"eq":return t===r;case"gt":return t>r;case"lt":return t<r;default:return!1}}countMatchedConditions(t,s){let r=0;const a=s.factors.length;for(const n of s.factors){const o=this.getHorseValue(t,n.factor);o!==null&&this.checkCondition(o,n.operator,n.value)&&r++}return{matched:r,total:a}}generateMockOdds(){return Math.random()*50+1}generateMockPopularity(){return Math.floor(Math.random()*18)+1}generateMockHorseWeight(){return Math.floor(Math.random()*100)+400}generateMockWinRate(){return Math.random()*30}generateMockForm(){return Math.random()*100}generateMockIndex(){return Math.random()*100}}const It=new J;It.get("/race-card",e=>(e.req.query("track"),e.req.query("date"),e.req.query("race"),e.html(`<!DOCTYPE html>
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
</html>`)));It.get("/api/race-card",async e=>{try{const t=e.req.query("track")||"",s=e.req.query("date")||"",r=e.req.query("race")||"",a=`${t}-${s}-${r}`;return e.json({track:t,date:s,raceNumber:r,horses:[{horse_number:"01",horse_id:"01910696"},{horse_number:"02",horse_id:"02210009"},{horse_number:"03",horse_id:"02210058"},{horse_number:"04",horse_id:"02210142"},{horse_number:"05",horse_id:"02210363"},{horse_number:"06",horse_id:"02210413"},{horse_number:"07",horse_id:"02210544"},{horse_number:"08",horse_id:"02210550"},{horse_number:"09",horse_id:"02210617"},{horse_number:"10",horse_id:"02210643"},{horse_number:"11",horse_id:"02210734"},{horse_number:"12",horse_id:"01910669"}]})}catch(t){return console.error("Failed to get race card:",t),e.json({error:"Failed to get race card"},500)}});It.post("/api/race-card/apply-factor",async e=>{try{const{factorId:t,horses:s,raceInfo:r}=await e.req.json();if(!t||!s||!r)return e.json({error:"Missing required fields"},400);const a=$.getFactor(parseInt(t));if(!a)return e.json({error:"Factor not found"},404);const n=JSON.parse(a.conditions),l=new ws().applyFactor(s,n,r);return e.json({horses:l,factor:{id:a.id,name:a.name,description:a.description}})}catch(t){return console.error("Failed to apply factor:",t),e.json({error:"Failed to apply factor: "+t.message},500)}});It.get("/api/race-card/factors",async e=>{try{return e.json($.getAllFactors())}catch(t){return console.error("Failed to get factors:",t),e.json({error:"Failed to get factors"},500)}});const O=new J;O.route("/api",xt);O.route("/",_e);O.route("/",je);O.route("/",bt);O.route("/",Bt);O.route("/",It);O.use("/static/*",Ce({root:"./public"}));O.use("/downloads/*",Ce({root:"./public"}));O.get("/",e=>e.html(`<!DOCTYPE html>
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
</html>`));const te=new J,ks=Object.assign({"/src/index.tsx":O});let Ee=!1;for(const[,e]of Object.entries(ks))e&&(te.route("/",e),te.notFound(e.notFoundHandler),Ee=!0);if(!Ee)throw new Error("Can't import modules from ['/src/index.tsx','/app/server.ts']");export{te as default};
