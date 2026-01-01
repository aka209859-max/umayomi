var Re=Object.defineProperty;var qt=e=>{throw TypeError(e)};var _e=(e,t,r)=>t in e?Re(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var m=(e,t,r)=>_e(e,typeof t!="symbol"?t+"":t,r),It=(e,t,r)=>t.has(e)||qt("Cannot "+r);var o=(e,t,r)=>(It(e,t,"read from private field"),r?r.call(e):t.get(e)),b=(e,t,r)=>t.has(e)?qt("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),g=(e,t,r,s)=>(It(e,t,"write to private field"),s?s.call(e,r):t.set(e,r),r),y=(e,t,r)=>(It(e,t,"access private method"),r);var Ut=(e,t,r,s)=>({set _(a){g(e,t,a,r)},get _(){return o(e,t,s)}});var Gt=(e,t,r)=>(s,a)=>{let n=-1;return i(0);async function i(d){if(d<=n)throw new Error("next() called multiple times");n=d;let l,c=!1,h;if(e[d]?(h=e[d][0][0],s.req.routeIndex=d):h=d===e.length&&a||void 0,h)try{l=await h(s,()=>i(d+1))}catch(u){if(u instanceof Error&&t)s.error=u,l=await t(u,s),c=!0;else throw u}else s.finalized===!1&&r&&(l=await r(s));return l&&(s.finalized===!1||c)&&(s.res=l),s}},je=Symbol(),Ee=async(e,t=Object.create(null))=>{const{all:r=!1,dot:s=!1}=t,n=(e instanceof ce?e.raw.headers:e.headers).get("Content-Type");return n!=null&&n.startsWith("multipart/form-data")||n!=null&&n.startsWith("application/x-www-form-urlencoded")?Ce(e,{all:r,dot:s}):{}};async function Ce(e,t){const r=await e.formData();return r?Ae(r,t):{}}function Ae(e,t){const r=Object.create(null);return e.forEach((s,a)=>{t.all||a.endsWith("[]")?Se(r,a,s):r[a]=s}),t.dot&&Object.entries(r).forEach(([s,a])=>{s.includes(".")&&(Oe(r,s,a),delete r[s])}),r}var Se=(e,t,r)=>{e[t]!==void 0?Array.isArray(e[t])?e[t].push(r):e[t]=[e[t],r]:t.endsWith("[]")?e[t]=[r]:e[t]=r},Oe=(e,t,r)=>{let s=e;const a=t.split(".");a.forEach((n,i)=>{i===a.length-1?s[n]=r:((!s[n]||typeof s[n]!="object"||Array.isArray(s[n])||s[n]instanceof File)&&(s[n]=Object.create(null)),s=s[n])})},se=e=>{const t=e.split("/");return t[0]===""&&t.shift(),t},ke=e=>{const{groups:t,path:r}=Te(e),s=se(r);return Me(s,t)},Te=e=>{const t=[];return e=e.replace(/\{[^}]+\}/g,(r,s)=>{const a=`@${s}`;return t.push([a,r]),a}),{groups:t,path:e}},Me=(e,t)=>{for(let r=t.length-1;r>=0;r--){const[s]=t[r];for(let a=e.length-1;a>=0;a--)if(e[a].includes(s)){e[a]=e[a].replace(s,t[r][1]);break}}return e},At={},Pe=(e,t)=>{if(e==="*")return"*";const r=e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(r){const s=`${e}#${t}`;return At[s]||(r[2]?At[s]=t&&t[0]!==":"&&t[0]!=="*"?[s,r[1],new RegExp(`^${r[2]}(?=/${t})`)]:[e,r[1],new RegExp(`^${r[2]}$`)]:At[s]=[e,r[1],!0]),At[s]}return null},Ft=(e,t)=>{try{return t(e)}catch{return e.replace(/(?:%[0-9A-Fa-f]{2})+/g,r=>{try{return t(r)}catch{return r}})}},De=e=>Ft(e,decodeURI),ae=e=>{const t=e.url,r=t.indexOf("/",t.indexOf(":")+4);let s=r;for(;s<t.length;s++){const a=t.charCodeAt(s);if(a===37){const n=t.indexOf("?",s),i=t.slice(r,n===-1?void 0:n);return De(i.includes("%25")?i.replace(/%25/g,"%2525"):i)}else if(a===63)break}return t.slice(r,s)},He=e=>{const t=ae(e);return t.length>1&&t.at(-1)==="/"?t.slice(0,-1):t},at=(e,t,...r)=>(r.length&&(t=at(t,...r)),`${(e==null?void 0:e[0])==="/"?"":"/"}${e}${t==="/"?"":`${(e==null?void 0:e.at(-1))==="/"?"":"/"}${(t==null?void 0:t[0])==="/"?t.slice(1):t}`}`),ne=e=>{if(e.charCodeAt(e.length-1)!==63||!e.includes(":"))return null;const t=e.split("/"),r=[];let s="";return t.forEach(a=>{if(a!==""&&!/\:/.test(a))s+="/"+a;else if(/\:/.test(a))if(/\?/.test(a)){r.length===0&&s===""?r.push("/"):r.push(s);const n=a.replace("?","");s+="/"+n,r.push(s)}else s+="/"+a}),r.filter((a,n,i)=>i.indexOf(a)===n)},Nt=e=>/[%+]/.test(e)?(e.indexOf("+")!==-1&&(e=e.replace(/\+/g," ")),e.indexOf("%")!==-1?Ft(e,oe):e):e,ie=(e,t,r)=>{let s;if(!r&&t&&!/[%+]/.test(t)){let i=e.indexOf("?",8);if(i===-1)return;for(e.startsWith(t,i+1)||(i=e.indexOf(`&${t}`,i+1));i!==-1;){const d=e.charCodeAt(i+t.length+1);if(d===61){const l=i+t.length+2,c=e.indexOf("&",l);return Nt(e.slice(l,c===-1?void 0:c))}else if(d==38||isNaN(d))return"";i=e.indexOf(`&${t}`,i+1)}if(s=/[%+]/.test(e),!s)return}const a={};s??(s=/[%+]/.test(e));let n=e.indexOf("?",8);for(;n!==-1;){const i=e.indexOf("&",n+1);let d=e.indexOf("=",n);d>i&&i!==-1&&(d=-1);let l=e.slice(n+1,d===-1?i===-1?void 0:i:d);if(s&&(l=Nt(l)),n=i,l==="")continue;let c;d===-1?c="":(c=e.slice(d+1,i===-1?void 0:i),s&&(c=Nt(c))),r?(a[l]&&Array.isArray(a[l])||(a[l]=[]),a[l].push(c)):a[l]??(a[l]=c)}return t?a[t]:a},Ie=ie,Ne=(e,t)=>ie(e,t,!0),oe=decodeURIComponent,zt=e=>Ft(e,oe),ot,k,L,le,de,Lt,B,Xt,ce=(Xt=class{constructor(e,t="/",r=[[]]){b(this,L);m(this,"raw");b(this,ot);b(this,k);m(this,"routeIndex",0);m(this,"path");m(this,"bodyCache",{});b(this,B,e=>{const{bodyCache:t,raw:r}=this,s=t[e];if(s)return s;const a=Object.keys(t)[0];return a?t[a].then(n=>(a==="json"&&(n=JSON.stringify(n)),new Response(n)[e]())):t[e]=r[e]()});this.raw=e,this.path=t,g(this,k,r),g(this,ot,{})}param(e){return e?y(this,L,le).call(this,e):y(this,L,de).call(this)}query(e){return Ie(this.url,e)}queries(e){return Ne(this.url,e)}header(e){if(e)return this.raw.headers.get(e)??void 0;const t={};return this.raw.headers.forEach((r,s)=>{t[s]=r}),t}async parseBody(e){var t;return(t=this.bodyCache).parsedBody??(t.parsedBody=await Ee(this,e))}json(){return o(this,B).call(this,"text").then(e=>JSON.parse(e))}text(){return o(this,B).call(this,"text")}arrayBuffer(){return o(this,B).call(this,"arrayBuffer")}blob(){return o(this,B).call(this,"blob")}formData(){return o(this,B).call(this,"formData")}addValidatedData(e,t){o(this,ot)[e]=t}valid(e){return o(this,ot)[e]}get url(){return this.raw.url}get method(){return this.raw.method}get[je](){return o(this,k)}get matchedRoutes(){return o(this,k)[0].map(([[,e]])=>e)}get routePath(){return o(this,k)[0].map(([[,e]])=>e)[this.routeIndex].path}},ot=new WeakMap,k=new WeakMap,L=new WeakSet,le=function(e){const t=o(this,k)[0][this.routeIndex][1][e],r=y(this,L,Lt).call(this,t);return r&&/\%/.test(r)?zt(r):r},de=function(){const e={},t=Object.keys(o(this,k)[0][this.routeIndex][1]);for(const r of t){const s=y(this,L,Lt).call(this,o(this,k)[0][this.routeIndex][1][r]);s!==void 0&&(e[r]=/\%/.test(s)?zt(s):s)}return e},Lt=function(e){return o(this,k)[1]?o(this,k)[1][e]:e},B=new WeakMap,Xt),$e={Stringify:1},he=async(e,t,r,s,a)=>{typeof e=="object"&&!(e instanceof String)&&(e instanceof Promise||(e=e.toString()),e instanceof Promise&&(e=await e));const n=e.callbacks;return n!=null&&n.length?(a?a[0]+=e:a=[e],Promise.all(n.map(d=>d({phase:t,buffer:a,context:s}))).then(d=>Promise.all(d.filter(Boolean).map(l=>he(l,t,!1,s,a))).then(()=>a[0]))):Promise.resolve(e)},Le="text/plain; charset=UTF-8",$t=(e,t)=>({"Content-Type":e,...t}),yt,vt,H,ct,I,A,wt,lt,dt,J,Rt,_t,q,nt,Qt,Fe=(Qt=class{constructor(e,t){b(this,q);b(this,yt);b(this,vt);m(this,"env",{});b(this,H);m(this,"finalized",!1);m(this,"error");b(this,ct);b(this,I);b(this,A);b(this,wt);b(this,lt);b(this,dt);b(this,J);b(this,Rt);b(this,_t);m(this,"render",(...e)=>(o(this,lt)??g(this,lt,t=>this.html(t)),o(this,lt).call(this,...e)));m(this,"setLayout",e=>g(this,wt,e));m(this,"getLayout",()=>o(this,wt));m(this,"setRenderer",e=>{g(this,lt,e)});m(this,"header",(e,t,r)=>{this.finalized&&g(this,A,new Response(o(this,A).body,o(this,A)));const s=o(this,A)?o(this,A).headers:o(this,J)??g(this,J,new Headers);t===void 0?s.delete(e):r!=null&&r.append?s.append(e,t):s.set(e,t)});m(this,"status",e=>{g(this,ct,e)});m(this,"set",(e,t)=>{o(this,H)??g(this,H,new Map),o(this,H).set(e,t)});m(this,"get",e=>o(this,H)?o(this,H).get(e):void 0);m(this,"newResponse",(...e)=>y(this,q,nt).call(this,...e));m(this,"body",(e,t,r)=>y(this,q,nt).call(this,e,t,r));m(this,"text",(e,t,r)=>!o(this,J)&&!o(this,ct)&&!t&&!r&&!this.finalized?new Response(e):y(this,q,nt).call(this,e,t,$t(Le,r)));m(this,"json",(e,t,r)=>y(this,q,nt).call(this,JSON.stringify(e),t,$t("application/json",r)));m(this,"html",(e,t,r)=>{const s=a=>y(this,q,nt).call(this,a,t,$t("text/html; charset=UTF-8",r));return typeof e=="object"?he(e,$e.Stringify,!1,{}).then(s):s(e)});m(this,"redirect",(e,t)=>{const r=String(e);return this.header("Location",/[^\x00-\xFF]/.test(r)?encodeURI(r):r),this.newResponse(null,t??302)});m(this,"notFound",()=>(o(this,dt)??g(this,dt,()=>new Response),o(this,dt).call(this,this)));g(this,yt,e),t&&(g(this,I,t.executionCtx),this.env=t.env,g(this,dt,t.notFoundHandler),g(this,_t,t.path),g(this,Rt,t.matchResult))}get req(){return o(this,vt)??g(this,vt,new ce(o(this,yt),o(this,_t),o(this,Rt))),o(this,vt)}get event(){if(o(this,I)&&"respondWith"in o(this,I))return o(this,I);throw Error("This context has no FetchEvent")}get executionCtx(){if(o(this,I))return o(this,I);throw Error("This context has no ExecutionContext")}get res(){return o(this,A)||g(this,A,new Response(null,{headers:o(this,J)??g(this,J,new Headers)}))}set res(e){if(o(this,A)&&e){e=new Response(e.body,e);for(const[t,r]of o(this,A).headers.entries())if(t!=="content-type")if(t==="set-cookie"){const s=o(this,A).headers.getSetCookie();e.headers.delete("set-cookie");for(const a of s)e.headers.append("set-cookie",a)}else e.headers.set(t,r)}g(this,A,e),this.finalized=!0}get var(){return o(this,H)?Object.fromEntries(o(this,H)):{}}},yt=new WeakMap,vt=new WeakMap,H=new WeakMap,ct=new WeakMap,I=new WeakMap,A=new WeakMap,wt=new WeakMap,lt=new WeakMap,dt=new WeakMap,J=new WeakMap,Rt=new WeakMap,_t=new WeakMap,q=new WeakSet,nt=function(e,t,r){const s=o(this,A)?new Headers(o(this,A).headers):o(this,J)??new Headers;if(typeof t=="object"&&"headers"in t){const n=t.headers instanceof Headers?t.headers:new Headers(t.headers);for(const[i,d]of n)i.toLowerCase()==="set-cookie"?s.append(i,d):s.set(i,d)}if(r)for(const[n,i]of Object.entries(r))if(typeof i=="string")s.set(n,i);else{s.delete(n);for(const d of i)s.append(n,d)}const a=typeof t=="number"?t:(t==null?void 0:t.status)??o(this,ct);return new Response(e,{status:a,headers:s})},Qt),_="ALL",Be="all",qe=["get","post","put","delete","options","patch"],ue="Can not add a route since the matcher is already built.",fe=class extends Error{},Ue="__COMPOSED_HANDLER",Ge=e=>e.text("404 Not Found",404),Wt=(e,t)=>{if("getResponse"in e){const r=e.getResponse();return t.newResponse(r.body,r)}return console.error(e),t.text("Internal Server Error",500)},T,j,pe,M,K,St,Ot,ht,ze=(ht=class{constructor(t={}){b(this,j);m(this,"get");m(this,"post");m(this,"put");m(this,"delete");m(this,"options");m(this,"patch");m(this,"all");m(this,"on");m(this,"use");m(this,"router");m(this,"getPath");m(this,"_basePath","/");b(this,T,"/");m(this,"routes",[]);b(this,M,Ge);m(this,"errorHandler",Wt);m(this,"onError",t=>(this.errorHandler=t,this));m(this,"notFound",t=>(g(this,M,t),this));m(this,"fetch",(t,...r)=>y(this,j,Ot).call(this,t,r[1],r[0],t.method));m(this,"request",(t,r,s,a)=>t instanceof Request?this.fetch(r?new Request(t,r):t,s,a):(t=t.toString(),this.fetch(new Request(/^https?:\/\//.test(t)?t:`http://localhost${at("/",t)}`,r),s,a)));m(this,"fire",()=>{addEventListener("fetch",t=>{t.respondWith(y(this,j,Ot).call(this,t.request,t,void 0,t.request.method))})});[...qe,Be].forEach(n=>{this[n]=(i,...d)=>(typeof i=="string"?g(this,T,i):y(this,j,K).call(this,n,o(this,T),i),d.forEach(l=>{y(this,j,K).call(this,n,o(this,T),l)}),this)}),this.on=(n,i,...d)=>{for(const l of[i].flat()){g(this,T,l);for(const c of[n].flat())d.map(h=>{y(this,j,K).call(this,c.toUpperCase(),o(this,T),h)})}return this},this.use=(n,...i)=>(typeof n=="string"?g(this,T,n):(g(this,T,"*"),i.unshift(n)),i.forEach(d=>{y(this,j,K).call(this,_,o(this,T),d)}),this);const{strict:s,...a}=t;Object.assign(this,a),this.getPath=s??!0?t.getPath??ae:He}route(t,r){const s=this.basePath(t);return r.routes.map(a=>{var i;let n;r.errorHandler===Wt?n=a.handler:(n=async(d,l)=>(await Gt([],r.errorHandler)(d,()=>a.handler(d,l))).res,n[Ue]=a.handler),y(i=s,j,K).call(i,a.method,a.path,n)}),this}basePath(t){const r=y(this,j,pe).call(this);return r._basePath=at(this._basePath,t),r}mount(t,r,s){let a,n;s&&(typeof s=="function"?n=s:(n=s.optionHandler,s.replaceRequest===!1?a=l=>l:a=s.replaceRequest));const i=n?l=>{const c=n(l);return Array.isArray(c)?c:[c]}:l=>{let c;try{c=l.executionCtx}catch{}return[l.env,c]};a||(a=(()=>{const l=at(this._basePath,t),c=l==="/"?0:l.length;return h=>{const u=new URL(h.url);return u.pathname=u.pathname.slice(c)||"/",new Request(u,h)}})());const d=async(l,c)=>{const h=await r(a(l.req.raw),...i(l));if(h)return h;await c()};return y(this,j,K).call(this,_,at(t,"*"),d),this}},T=new WeakMap,j=new WeakSet,pe=function(){const t=new ht({router:this.router,getPath:this.getPath});return t.errorHandler=this.errorHandler,g(t,M,o(this,M)),t.routes=this.routes,t},M=new WeakMap,K=function(t,r,s){t=t.toUpperCase(),r=at(this._basePath,r);const a={basePath:this._basePath,path:r,method:t,handler:s};this.router.add(t,r,[s,a]),this.routes.push(a)},St=function(t,r){if(t instanceof Error)return this.errorHandler(t,r);throw t},Ot=function(t,r,s,a){if(a==="HEAD")return(async()=>new Response(null,await y(this,j,Ot).call(this,t,r,s,"GET")))();const n=this.getPath(t,{env:s}),i=this.router.match(a,n),d=new Fe(t,{path:n,matchResult:i,env:s,executionCtx:r,notFoundHandler:o(this,M)});if(i[0].length===1){let c;try{c=i[0][0][0][0](d,async()=>{d.res=await o(this,M).call(this,d)})}catch(h){return y(this,j,St).call(this,h,d)}return c instanceof Promise?c.then(h=>h||(d.finalized?d.res:o(this,M).call(this,d))).catch(h=>y(this,j,St).call(this,h,d)):c??o(this,M).call(this,d)}const l=Gt(i[0],this.errorHandler,o(this,M));return(async()=>{try{const c=await l(d);if(!c.finalized)throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return c.res}catch(c){return y(this,j,St).call(this,c,d)}})()},ht),ge=[];function We(e,t){const r=this.buildAllMatchers(),s=(a,n)=>{const i=r[a]||r[_],d=i[2][n];if(d)return d;const l=n.match(i[0]);if(!l)return[[],ge];const c=l.indexOf("",1);return[i[1][c],l]};return this.match=s,s(e,t)}var Tt="[^/]+",xt=".*",bt="(?:|/.*)",it=Symbol(),Ve=new Set(".\\+*[^]$()");function Ke(e,t){return e.length===1?t.length===1?e<t?-1:1:-1:t.length===1||e===xt||e===bt?1:t===xt||t===bt?-1:e===Tt?1:t===Tt?-1:e.length===t.length?e<t?-1:1:t.length-e.length}var X,Q,P,et,Ye=(et=class{constructor(){b(this,X);b(this,Q);b(this,P,Object.create(null))}insert(t,r,s,a,n){if(t.length===0){if(o(this,X)!==void 0)throw it;if(n)return;g(this,X,r);return}const[i,...d]=t,l=i==="*"?d.length===0?["","",xt]:["","",Tt]:i==="/*"?["","",bt]:i.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);let c;if(l){const h=l[1];let u=l[2]||Tt;if(h&&l[2]&&(u===".*"||(u=u.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(u))))throw it;if(c=o(this,P)[u],!c){if(Object.keys(o(this,P)).some(f=>f!==xt&&f!==bt))throw it;if(n)return;c=o(this,P)[u]=new et,h!==""&&g(c,Q,a.varIndex++)}!n&&h!==""&&s.push([h,o(c,Q)])}else if(c=o(this,P)[i],!c){if(Object.keys(o(this,P)).some(h=>h.length>1&&h!==xt&&h!==bt))throw it;if(n)return;c=o(this,P)[i]=new et}c.insert(d,r,s,a,n)}buildRegExpStr(){const r=Object.keys(o(this,P)).sort(Ke).map(s=>{const a=o(this,P)[s];return(typeof o(a,Q)=="number"?`(${s})@${o(a,Q)}`:Ve.has(s)?`\\${s}`:s)+a.buildRegExpStr()});return typeof o(this,X)=="number"&&r.unshift(`#${o(this,X)}`),r.length===0?"":r.length===1?r[0]:"(?:"+r.join("|")+")"}},X=new WeakMap,Q=new WeakMap,P=new WeakMap,et),Mt,jt,Zt,Je=(Zt=class{constructor(){b(this,Mt,{varIndex:0});b(this,jt,new Ye)}insert(e,t,r){const s=[],a=[];for(let i=0;;){let d=!1;if(e=e.replace(/\{[^}]+\}/g,l=>{const c=`@\\${i}`;return a[i]=[c,l],i++,d=!0,c}),!d)break}const n=e.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let i=a.length-1;i>=0;i--){const[d]=a[i];for(let l=n.length-1;l>=0;l--)if(n[l].indexOf(d)!==-1){n[l]=n[l].replace(d,a[i][1]);break}}return o(this,jt).insert(n,t,s,o(this,Mt),r),s}buildRegExp(){let e=o(this,jt).buildRegExpStr();if(e==="")return[/^$/,[],[]];let t=0;const r=[],s=[];return e=e.replace(/#(\d+)|@(\d+)|\.\*\$/g,(a,n,i)=>n!==void 0?(r[++t]=Number(n),"$()"):(i!==void 0&&(s[Number(i)]=++t),"")),[new RegExp(`^${e}`),r,s]}},Mt=new WeakMap,jt=new WeakMap,Zt),Xe=[/^$/,[],Object.create(null)],kt=Object.create(null);function me(e){return kt[e]??(kt[e]=new RegExp(e==="*"?"":`^${e.replace(/\/\*$|([.\\+*[^\]$()])/g,(t,r)=>r?`\\${r}`:"(?:|/.*)")}$`))}function Qe(){kt=Object.create(null)}function Ze(e){var c;const t=new Je,r=[];if(e.length===0)return Xe;const s=e.map(h=>[!/\*|\/:/.test(h[0]),...h]).sort(([h,u],[f,p])=>h?1:f?-1:u.length-p.length),a=Object.create(null);for(let h=0,u=-1,f=s.length;h<f;h++){const[p,v,R]=s[h];p?a[v]=[R.map(([w])=>[w,Object.create(null)]),ge]:u++;let x;try{x=t.insert(v,u,p)}catch(w){throw w===it?new fe(v):w}p||(r[u]=R.map(([w,S])=>{const V=Object.create(null);for(S-=1;S>=0;S--){const[rt,O]=x[S];V[rt]=O}return[w,V]}))}const[n,i,d]=t.buildRegExp();for(let h=0,u=r.length;h<u;h++)for(let f=0,p=r[h].length;f<p;f++){const v=(c=r[h][f])==null?void 0:c[1];if(!v)continue;const R=Object.keys(v);for(let x=0,w=R.length;x<w;x++)v[R[x]]=d[v[R[x]]]}const l=[];for(const h in i)l[h]=r[i[h]];return[n,l,a]}function st(e,t){if(e){for(const r of Object.keys(e).sort((s,a)=>a.length-s.length))if(me(r).test(t))return[...e[r]]}}var U,G,Pt,xe,te,tr=(te=class{constructor(){b(this,Pt);m(this,"name","RegExpRouter");b(this,U);b(this,G);m(this,"match",We);g(this,U,{[_]:Object.create(null)}),g(this,G,{[_]:Object.create(null)})}add(e,t,r){var d;const s=o(this,U),a=o(this,G);if(!s||!a)throw new Error(ue);s[e]||[s,a].forEach(l=>{l[e]=Object.create(null),Object.keys(l[_]).forEach(c=>{l[e][c]=[...l[_][c]]})}),t==="/*"&&(t="*");const n=(t.match(/\/:/g)||[]).length;if(/\*$/.test(t)){const l=me(t);e===_?Object.keys(s).forEach(c=>{var h;(h=s[c])[t]||(h[t]=st(s[c],t)||st(s[_],t)||[])}):(d=s[e])[t]||(d[t]=st(s[e],t)||st(s[_],t)||[]),Object.keys(s).forEach(c=>{(e===_||e===c)&&Object.keys(s[c]).forEach(h=>{l.test(h)&&s[c][h].push([r,n])})}),Object.keys(a).forEach(c=>{(e===_||e===c)&&Object.keys(a[c]).forEach(h=>l.test(h)&&a[c][h].push([r,n]))});return}const i=ne(t)||[t];for(let l=0,c=i.length;l<c;l++){const h=i[l];Object.keys(a).forEach(u=>{var f;(e===_||e===u)&&((f=a[u])[h]||(f[h]=[...st(s[u],h)||st(s[_],h)||[]]),a[u][h].push([r,n-c+l+1]))})}}buildAllMatchers(){const e=Object.create(null);return Object.keys(o(this,G)).concat(Object.keys(o(this,U))).forEach(t=>{e[t]||(e[t]=y(this,Pt,xe).call(this,t))}),g(this,U,g(this,G,void 0)),Qe(),e}},U=new WeakMap,G=new WeakMap,Pt=new WeakSet,xe=function(e){const t=[];let r=e===_;return[o(this,U),o(this,G)].forEach(s=>{const a=s[e]?Object.keys(s[e]).map(n=>[n,s[e][n]]):[];a.length!==0?(r||(r=!0),t.push(...a)):e!==_&&t.push(...Object.keys(s[_]).map(n=>[n,s[_][n]]))}),r?Ze(t):null},te),z,N,ee,er=(ee=class{constructor(e){m(this,"name","SmartRouter");b(this,z,[]);b(this,N,[]);g(this,z,e.routers)}add(e,t,r){if(!o(this,N))throw new Error(ue);o(this,N).push([e,t,r])}match(e,t){if(!o(this,N))throw new Error("Fatal error");const r=o(this,z),s=o(this,N),a=r.length;let n=0,i;for(;n<a;n++){const d=r[n];try{for(let l=0,c=s.length;l<c;l++)d.add(...s[l]);i=d.match(e,t)}catch(l){if(l instanceof fe)continue;throw l}this.match=d.match.bind(d),g(this,z,[d]),g(this,N,void 0);break}if(n===a)throw new Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,i}get activeRouter(){if(o(this,N)||o(this,z).length!==1)throw new Error("No active router has been determined yet.");return o(this,z)[0]}},z=new WeakMap,N=new WeakMap,ee),mt=Object.create(null),W,C,Z,ut,E,$,Y,ft,rr=(ft=class{constructor(t,r,s){b(this,$);b(this,W);b(this,C);b(this,Z);b(this,ut,0);b(this,E,mt);if(g(this,C,s||Object.create(null)),g(this,W,[]),t&&r){const a=Object.create(null);a[t]={handler:r,possibleKeys:[],score:0},g(this,W,[a])}g(this,Z,[])}insert(t,r,s){g(this,ut,++Ut(this,ut)._);let a=this;const n=ke(r),i=[];for(let d=0,l=n.length;d<l;d++){const c=n[d],h=n[d+1],u=Pe(c,h),f=Array.isArray(u)?u[0]:c;if(f in o(a,C)){a=o(a,C)[f],u&&i.push(u[1]);continue}o(a,C)[f]=new ft,u&&(o(a,Z).push(u),i.push(u[1])),a=o(a,C)[f]}return o(a,W).push({[t]:{handler:s,possibleKeys:i.filter((d,l,c)=>c.indexOf(d)===l),score:o(this,ut)}}),a}search(t,r){var l;const s=[];g(this,E,mt);let n=[this];const i=se(r),d=[];for(let c=0,h=i.length;c<h;c++){const u=i[c],f=c===h-1,p=[];for(let v=0,R=n.length;v<R;v++){const x=n[v],w=o(x,C)[u];w&&(g(w,E,o(x,E)),f?(o(w,C)["*"]&&s.push(...y(this,$,Y).call(this,o(w,C)["*"],t,o(x,E))),s.push(...y(this,$,Y).call(this,w,t,o(x,E)))):p.push(w));for(let S=0,V=o(x,Z).length;S<V;S++){const rt=o(x,Z)[S],O=o(x,E)===mt?{}:{...o(x,E)};if(rt==="*"){const F=o(x,C)["*"];F&&(s.push(...y(this,$,Y).call(this,F,t,o(x,E))),g(F,E,O),p.push(F));continue}const[Dt,Ct,gt]=rt;if(!u&&!(gt instanceof RegExp))continue;const D=o(x,C)[Dt],we=i.slice(c).join("/");if(gt instanceof RegExp){const F=gt.exec(we);if(F){if(O[Ct]=F[0],s.push(...y(this,$,Y).call(this,D,t,o(x,E),O)),Object.keys(o(D,C)).length){g(D,E,O);const Ht=((l=F[0].match(/\//))==null?void 0:l.length)??0;(d[Ht]||(d[Ht]=[])).push(D)}continue}}(gt===!0||gt.test(u))&&(O[Ct]=u,f?(s.push(...y(this,$,Y).call(this,D,t,O,o(x,E))),o(D,C)["*"]&&s.push(...y(this,$,Y).call(this,o(D,C)["*"],t,O,o(x,E)))):(g(D,E,O),p.push(D)))}}n=p.concat(d.shift()??[])}return s.length>1&&s.sort((c,h)=>c.score-h.score),[s.map(({handler:c,params:h})=>[c,h])]}},W=new WeakMap,C=new WeakMap,Z=new WeakMap,ut=new WeakMap,E=new WeakMap,$=new WeakSet,Y=function(t,r,s,a){const n=[];for(let i=0,d=o(t,W).length;i<d;i++){const l=o(t,W)[i],c=l[r]||l[_],h={};if(c!==void 0&&(c.params=Object.create(null),n.push(c),s!==mt||a&&a!==mt))for(let u=0,f=c.possibleKeys.length;u<f;u++){const p=c.possibleKeys[u],v=h[c.score];c.params[p]=a!=null&&a[p]&&!v?a[p]:s[p]??(a==null?void 0:a[p]),h[c.score]=!0}}return n},ft),tt,re,sr=(re=class{constructor(){m(this,"name","TrieRouter");b(this,tt);g(this,tt,new rr)}add(e,t,r){const s=ne(t);if(s){for(let a=0,n=s.length;a<n;a++)o(this,tt).insert(e,s[a],r);return}o(this,tt).insert(e,t,r)}match(e,t){return o(this,tt).search(e,t)}},tt=new WeakMap,re),Bt=class extends ze{constructor(e={}){super(e),this.router=e.router??new er({routers:[new tr,new sr]})}},ar=/^\s*(?:text\/(?!event-stream(?:[;\s]|$))[^;\s]+|application\/(?:javascript|json|xml|xml-dtd|ecmascript|dart|postscript|rtf|tar|toml|vnd\.dart|vnd\.ms-fontobject|vnd\.ms-opentype|wasm|x-httpd-php|x-javascript|x-ns-proxy-autoconfig|x-sh|x-tar|x-virtualbox-hdd|x-virtualbox-ova|x-virtualbox-ovf|x-virtualbox-vbox|x-virtualbox-vdi|x-virtualbox-vhd|x-virtualbox-vmdk|x-www-form-urlencoded)|font\/(?:otf|ttf)|image\/(?:bmp|vnd\.adobe\.photoshop|vnd\.microsoft\.icon|vnd\.ms-dds|x-icon|x-ms-bmp)|message\/rfc822|model\/gltf-binary|x-shader\/x-fragment|x-shader\/x-vertex|[^;\s]+?\+(?:json|text|xml|yaml))(?:[;\s]|$)/i,Vt=(e,t=ir)=>{const r=/\.([a-zA-Z0-9]+?)$/,s=e.match(r);if(!s)return;let a=t[s[1]];return a&&a.startsWith("text")&&(a+="; charset=utf-8"),a},nr={aac:"audio/aac",avi:"video/x-msvideo",avif:"image/avif",av1:"video/av1",bin:"application/octet-stream",bmp:"image/bmp",css:"text/css",csv:"text/csv",eot:"application/vnd.ms-fontobject",epub:"application/epub+zip",gif:"image/gif",gz:"application/gzip",htm:"text/html",html:"text/html",ico:"image/x-icon",ics:"text/calendar",jpeg:"image/jpeg",jpg:"image/jpeg",js:"text/javascript",json:"application/json",jsonld:"application/ld+json",map:"application/json",mid:"audio/x-midi",midi:"audio/x-midi",mjs:"text/javascript",mp3:"audio/mpeg",mp4:"video/mp4",mpeg:"video/mpeg",oga:"audio/ogg",ogv:"video/ogg",ogx:"application/ogg",opus:"audio/opus",otf:"font/otf",pdf:"application/pdf",png:"image/png",rtf:"application/rtf",svg:"image/svg+xml",tif:"image/tiff",tiff:"image/tiff",ts:"video/mp2t",ttf:"font/ttf",txt:"text/plain",wasm:"application/wasm",webm:"video/webm",weba:"audio/webm",webmanifest:"application/manifest+json",webp:"image/webp",woff:"font/woff",woff2:"font/woff2",xhtml:"application/xhtml+xml",xml:"application/xml",zip:"application/zip","3gp":"video/3gpp","3g2":"video/3gpp2",gltf:"model/gltf+json",glb:"model/gltf-binary"},ir=nr,or=(...e)=>{let t=e.filter(a=>a!=="").join("/");t=t.replace(new RegExp("(?<=\\/)\\/+","g"),"");const r=t.split("/"),s=[];for(const a of r)a===".."&&s.length>0&&s.at(-1)!==".."?s.pop():a!=="."&&s.push(a);return s.join("/")||"."},be={br:".br",zstd:".zst",gzip:".gz"},cr=Object.keys(be),lr="index.html",dr=e=>{const t=e.root??"./",r=e.path,s=e.join??or;return async(a,n)=>{var h,u,f,p;if(a.finalized)return n();let i;if(e.path)i=e.path;else try{if(i=decodeURIComponent(a.req.path),/(?:^|[\/\\])\.\.(?:$|[\/\\])/.test(i))throw new Error}catch{return await((h=e.onNotFound)==null?void 0:h.call(e,a.req.path,a)),n()}let d=s(t,!r&&e.rewriteRequestPath?e.rewriteRequestPath(i):i);e.isDir&&await e.isDir(d)&&(d=s(d,lr));const l=e.getContent;let c=await l(d,a);if(c instanceof Response)return a.newResponse(c.body,c);if(c){const v=e.mimes&&Vt(d,e.mimes)||Vt(d);if(a.header("Content-Type",v||"application/octet-stream"),e.precompressed&&(!v||ar.test(v))){const R=new Set((u=a.req.header("Accept-Encoding"))==null?void 0:u.split(",").map(x=>x.trim()));for(const x of cr){if(!R.has(x))continue;const w=await l(d+be[x],a);if(w){c=w,a.header("Content-Encoding",x),a.header("Vary","Accept-Encoding",{append:!0});break}}}return await((f=e.onFound)==null?void 0:f.call(e,d,a)),a.body(c)}await((p=e.onNotFound)==null?void 0:p.call(e,d,a)),await n()}},hr=async(e,t)=>{let r;t&&t.manifest?typeof t.manifest=="string"?r=JSON.parse(t.manifest):r=t.manifest:typeof __STATIC_CONTENT_MANIFEST=="string"?r=JSON.parse(__STATIC_CONTENT_MANIFEST):r=__STATIC_CONTENT_MANIFEST;let s;t&&t.namespace?s=t.namespace:s=__STATIC_CONTENT;const a=r[e]||e;if(!a)return null;const n=await s.get(a,{type:"stream"});return n||null},ur=e=>async function(r,s){return dr({...e,getContent:async n=>hr(n,{manifest:e.manifest,namespace:e.namespace?e.namespace:r.env?r.env.__STATIC_CONTENT:void 0})})(r,s)},ye=e=>ur(e),fr=e=>{const r={...{origin:"*",allowMethods:["GET","HEAD","PUT","POST","DELETE","PATCH"],allowHeaders:[],exposeHeaders:[]},...e},s=(n=>typeof n=="string"?n==="*"?()=>n:i=>n===i?i:null:typeof n=="function"?n:i=>n.includes(i)?i:null)(r.origin),a=(n=>typeof n=="function"?n:Array.isArray(n)?()=>n:()=>[])(r.allowMethods);return async function(i,d){var h;function l(u,f){i.res.headers.set(u,f)}const c=await s(i.req.header("origin")||"",i);if(c&&l("Access-Control-Allow-Origin",c),r.credentials&&l("Access-Control-Allow-Credentials","true"),(h=r.exposeHeaders)!=null&&h.length&&l("Access-Control-Expose-Headers",r.exposeHeaders.join(",")),i.req.method==="OPTIONS"){r.origin!=="*"&&l("Vary","Origin"),r.maxAge!=null&&l("Access-Control-Max-Age",r.maxAge.toString());const u=await a(i.req.header("origin")||"",i);u.length&&l("Access-Control-Allow-Methods",u.join(","));let f=r.allowHeaders;if(!(f!=null&&f.length)){const p=i.req.header("Access-Control-Request-Headers");p&&(f=p.split(/\s*,\s*/))}return f!=null&&f.length&&(l("Access-Control-Allow-Headers",f.join(",")),i.res.headers.append("Vary","Access-Control-Request-Headers")),i.res.headers.delete("Content-Length"),i.res.headers.delete("Content-Type"),new Response(null,{headers:i.res.headers,status:204,statusText:"No Content"})}await d(),r.origin!=="*"&&i.header("Vary","Origin",{append:!0})}};class Kt{static calculate(t){const r=t.cnt_win+t.cnt_plc,s=Math.min(1,Math.sqrt(r/500)),a=t.rate_win_ret*.3+t.rate_plc_ret*.7-80,n=10*Math.tanh(a*s/25),i=this.getGrade(n);return{score:Math.round(n*100)/100,grade:i,reliability:Math.round(s*1e3)/1e3,weightedDiff:Math.round(a*100)/100}}static getGrade(t){return t>=7?"S":t>=4?"A":t>=1?"B":t>=-3?"C":"D"}static getGradeDescription(t){return{S:"極めて優秀 - 高い収益性が期待できる",A:"優秀 - 安定した収益が見込める",B:"良好 - プラス収益の可能性が高い",C:"平均 - 標準的なパフォーマンス",D:"要改善 - 収益性が低い可能性がある"}[t]||"不明"}}class Yt{static calculate(t){const r=new Map,s=this.groupByRaceId(t);for(const[a,n]of s.entries()){const i=n.map(p=>({horse:p,nMin:Math.min(p.cnt_win,p.cnt_plc),hitRaw:.65*p.rate_win_hit+.35*p.rate_plc_hit,retRaw:.35*p.rate_win_ret+.65*p.rate_plc_ret})),d=i.map(p=>p.hitRaw),l=i.map(p=>p.retRaw),c=this.mean(d),h=this.stdDev(d,c),u=this.mean(l),f=this.stdDev(l,u);for(const{horse:p,nMin:v,hitRaw:R,retRaw:x}of i){const w=h>0?(R-c)/h:0,S=f>0?(x-u)/f:0,V=Math.sqrt(v/(v+400)),rt=.55*w+.45*S,O=Math.round(12*Math.tanh(rt)*V*10)/10,Dt=this.getGrade(O),Ct=`${a}_${p.cnt_win}_${p.cnt_plc}`;r.set(Ct,{score:O,grade:Dt,hitRaw:Math.round(R*100)/100,retRaw:Math.round(x*100)/100,shrinkage:Math.round(V*1e3)/1e3})}}return r}static groupByRaceId(t){const r=new Map;for(const s of t){const a=r.get(s.group_id)||[];a.push(s),r.set(s.group_id,a)}return r}static mean(t){return t.length===0?0:t.reduce((r,s)=>r+s,0)/t.length}static stdDev(t,r){if(t.length<=1)return 0;const s=t.reduce((a,n)=>a+Math.pow(n-r,2),0)/t.length;return Math.sqrt(s)}static getGrade(t){return t>=8?"S+":t>=5?"S":t>=2?"A":t>=-1?"B":t>=-4?"C":"D"}static getGradeDescription(t){return{"S+":"最高評価 - レース内で圧倒的な優位性",S:"極めて優秀 - レース内で明確な優位性",A:"優秀 - レース内で有力候補",B:"良好 - レース内で競争力あり",C:"平均 - レース内で標準的な位置",D:"要改善 - レース内で劣勢"}[t]||"不明"}}const pt=new Bt;pt.use("/*",fr());pt.post("/rgs/calculate",async e=>{try{const t=await e.req.json();if(typeof t.cnt_win!="number"||t.cnt_win<0)return e.json({error:"cnt_win must be a positive number"},400);if(typeof t.cnt_plc!="number"||t.cnt_plc<0)return e.json({error:"cnt_plc must be a positive number"},400);if(typeof t.rate_win_ret!="number")return e.json({error:"rate_win_ret must be a number"},400);if(typeof t.rate_plc_ret!="number")return e.json({error:"rate_plc_ret must be a number"},400);const r=Kt.calculate(t);return e.json({success:!0,data:{score:r.score,grade:r.grade,reliability:r.reliability,weightedDiff:r.weightedDiff,description:Kt.getGradeDescription(r.grade)}})}catch(t){return console.error("RGS calculation error:",t),e.json({success:!1,error:"RGS calculation failed",message:t instanceof Error?t.message:"Unknown error"},500)}});pt.post("/aas/calculate",async e=>{try{const t=await e.req.json();if(!Array.isArray(t.horses)||t.horses.length===0)return e.json({error:"horses must be a non-empty array"},400);for(const a of t.horses){if(!a.group_id||typeof a.group_id!="string")return e.json({error:"group_id is required and must be a string"},400);if(typeof a.cnt_win!="number"||a.cnt_win<0)return e.json({error:"cnt_win must be a positive number"},400);if(typeof a.cnt_plc!="number"||a.cnt_plc<0)return e.json({error:"cnt_plc must be a positive number"},400);if(typeof a.rate_win_hit!="number")return e.json({error:"rate_win_hit must be a number"},400);if(typeof a.rate_plc_hit!="number")return e.json({error:"rate_plc_hit must be a number"},400);if(typeof a.rate_win_ret!="number")return e.json({error:"rate_win_ret must be a number"},400);if(typeof a.rate_plc_ret!="number")return e.json({error:"rate_plc_ret must be a number"},400)}const r=Yt.calculate(t.horses),s=Array.from(r.entries()).map(([a,n])=>({key:a,score:n.score,grade:n.grade,hitRaw:n.hitRaw,retRaw:n.retRaw,shrinkage:n.shrinkage,description:Yt.getGradeDescription(n.grade)}));return e.json({success:!0,data:{count:s.length,results:s}})}catch(t){return console.error("AAS calculation error:",t),e.json({success:!1,error:"AAS calculation failed",message:t instanceof Error?t.message:"Unknown error"},500)}});pt.post("/factor/test",async e=>{try{const t=await e.req.json();if(!Array.isArray(t.factors)||t.factors.length===0)return e.json({error:"factors must be a non-empty array"},400);if(!Array.isArray(t.testData)||t.testData.length===0)return e.json({error:"testData must be a non-empty array"},400);const r=t.factors.reduce((f,p)=>f+p.weight,0);if(Math.abs(r-100)>.01)return e.json({error:"Total weight must be 100%"},400);const s=t.testData.map(f=>{var x,w;const p=((x=t.factors.find(S=>S.name==="RGS基礎値"))==null?void 0:x.weight)||0,v=((w=t.factors.find(S=>S.name==="AAS基礎値"))==null?void 0:w.weight)||0,R=f.rgs_score*p/100+f.aas_score*v/100;return{...f,factor_score:R}}),a=new Map;for(const f of s){const p=a.get(f.race_id)||[];p.push(f),a.set(f.race_id,p)}const n=[];for(const[f,p]of a.entries())p.sort((R,x)=>x.factor_score-R.factor_score).forEach((R,x)=>{n.push({...R,predicted_rank:x+1})});let i=0,d=0,l=s.length;for(const f of n)f.predicted_rank===1&&f.actual_rank<=3&&(i++,d+=100*(4-f.actual_rank));const c=i/l*100,h=d/(l*100)*100,u=h-100;return e.json({success:!0,data:{performance:{hit_rate:Math.round(c*10)/10,recovery_rate:Math.round(h*10)/10,roi:Math.round(u*10)/10,total_bets:l,total_hits:i,total_return:d},predictions:n.slice(0,10)}})}catch(t){return console.error("Factor test error:",t),e.json({success:!1,error:"Factor test failed",message:t instanceof Error?t.message:"Unknown error"},500)}});pt.get("/health",e=>e.json({success:!0,message:"UMAYOMI API is running",version:"1.0.0",timestamp:new Date().toISOString()}));const Et=new Bt;Et.route("/api",pt);Et.use("/static/*",ye({root:"./public"}));Et.use("/downloads/*",ye({root:"./public"}));Et.get("/",e=>e.html(`<!DOCTYPE html>
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
</html>`));const Jt=new Bt,pr=Object.assign({"/src/index.tsx":Et});let ve=!1;for(const[,e]of Object.entries(pr))e&&(Jt.route("/",e),Jt.notFound(e.notFoundHandler),ve=!0);if(!ve)throw new Error("Can't import modules from ['/src/index.tsx','/app/server.ts']");export{Jt as default};
