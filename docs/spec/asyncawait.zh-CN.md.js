webpackJsonp([30],{1335:function(n,s){n.exports={content:["article",["p",["a",{title:null,href:"https://zeit.co/blog/async-and-await#how-promise-works"},"\u539f\u6587\u94fe\u63a5"]],["p","Javascript, \u5c24\u5176\u662f Node.js, \u6700\u88ab\u4eba\u8bdf\u75c5\u7684\u662f callback hell \u4e86. \u8fd9\u65f6\u5019\u5982\u679c\u4f60\u9700\u8981\u5904\u7406\u5927\u91cf\u7684\u5f02\u6b65 io \u64cd\u4f5c\uff0c\u4f60\u53ef\u80fd\u4f1a\u628a\u4ee3\u7801\u5199\u6210\u8fd9\u6837\uff1a"],["pre",{lang:"javascript",highlighted:'<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">function</span> <span class="token function">getLike</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token function">getUsers</span><span class="token punctuation">(</span><span class="token punctuation">(</span>err<span class="token punctuation">,</span> users<span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">></span> <span class="token punctuation">{</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token keyword">return</span> <span class="token function">fn</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token function">filterUsersWithFriends</span><span class="token punctuation">(</span><span class="token punctuation">(</span>err<span class="token punctuation">,</span> usersWithFriends<span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">></span> <span class="token punctuation">{</span>\n      <span class="token keyword">if</span> <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token keyword">return</span> <span class="token function">fn</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token function">getUsersLikes</span><span class="token punctuation">(</span>usersWithFriends<span class="token punctuation">,</span> <span class="token punctuation">(</span>err<span class="token punctuation">,</span> likes<span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">></span> <span class="token punctuation">{</span>\n        <span class="token keyword">if</span> <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token keyword">return</span> fn <span class="token punctuation">(</span>err<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token function">fn</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">,</span> likes<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>'},["code","export default function getLike() {\n  getUsers((err, users) => {\n    if (err) return fn(err);\n    filterUsersWithFriends((err, usersWithFriends) => {\n      if (err) return fn(err);\n      getUsersLikes(usersWithFriends, (err, likes) => {\n        if (err) return fn (err);\n        fn(null, likes);\n      });\n    });\n  });\n}"]],["p","\u6211\u4eec\u6765\u770b\u770b callback \u90fd\u6709\u54ea\u4e9b\u95ee\u9898\u3002"],["h2","\u56de\u8c03\u7684\u95ee\u9898"],["h3","\u9519\u8bef\u5904\u7406\u662f\u91cd\u590d\u7684"],["p","\u5728\u5927\u591a\u6570\u7684\u60c5\u51b5\u4e0b\uff0c\u4f60\u53ea\u9700\u8981\u5c06\u9519\u8bef\u4f20\u9012\u4e0b\u53bb\u3002\n\u7136\u800c\uff0c\u5728\u4e0a\u9762\u7684\u4f8b\u5b50\u4e2d\uff0c\u4f60\u91cd\u590d\u4e86\u5f88\u591a\u6b21\u3002\u5f53\u9519\u8bef\u53d1\u751f\u65f6\uff0c\u4e5f\u5f88\u5bb9\u6613\u5fd8\u8bb0 ",["code","return"],"\u3002"],["h3","\u672a\u6307\u5b9a\u9519\u8bef\u5904\u7406"],["p","\u5f53\u9519\u8bef\u53d1\u751f\u65f6\uff0c\u5927\u591a\u6570\u6d41\u884c\u7684\u6846\u67b6\u90fd\u4f1a\u8c03\u7528 callback\uff0c\u5e76\u4e14\u628a ",["code","Error"]," \u5bf9\u8c61\u4f5c\u4e3a\u53c2\u6570\u4f20\u8fdb\u53bb\u3002\u5982\u679c\u662f\u6210\u529f\uff0c\u5219\u4f7f\u7528 ",["code","null"]," \u4ee3\u66ff\u3002\n\u4e0d\u5e78\u7684\u662f\uff0c\u4e8b\u60c5\u522b\u4e0d\u603b\u662f\u8fd9\u6837\u3002\u4f60\u53ef\u80fd\u83b7\u53d6\u5230\u7684\u662f ",["code","false"]," \u800c\u4e0d\u662f ",["code","null"],"\u3002\u6709\u4e9b\u5e93\u751a\u81f3\u5ffd\u7565\u5b83\u3002\u5982\u679c\u6709\u51e0\u4e2a\u9519\u8bef\u51fa\u73b0\uff0c\u4f60\u53ef\u80fd\u4f1a\u5f97\u5230\u591a\u4e2a callback\u3002"],["h3","\u8c03\u5ea6\u662f\u4e0d\u786e\u5b9a\u7684"],["p","callback \u662f\u7acb\u5373\u8c03\u7528\uff1f\u662f\u4e0d\u662f\u5728\u4e0d\u540c\u7684 ",["a",{title:null,href:"https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/"},"microtask"],"\u961f\u5217\u4e2d\uff1f\u4e0d\u540c\u7684 tick\uff1f \u6709\u65f6\uff1f \u603b\u662f\uff1f"],["p","\u8c01\u90fd\u4e0d\u6e05\u695a\u3002\u8bfb\u81ea\u5df1\u7684\u4ee3\u7801\u662f\u6ca1\u7528\u7684\uff0c\u9605\u8bfb\u5e93\u7684\u6587\u6863\u53ef\u80fd\u4f1a\u544a\u8bc9\u4f60\uff0c\u5982\u679c\u4f60\u591f\u5e78\u8fd0\u3002"],["p","callback \u4e5f\u5f88\u5bb9\u6613\u9020\u6210\u5806\u6808\u7684\u4e22\u5931\uff0c\u4e5f\u5c31\u662f\u8bf4\u4f60\u770b\u5230\u7684\u5f02\u5e38\u7684\u5806\u6808\u662f\u5f88\u96be\u770b\u51fa\u95ee\u9898\u6240\u5728\u7684\u3002\u4f7f\u5f97\u6211\u4eec\u7684\u4ee3\u7801\u66f4\u96be\u8fdb\u884c\u8c03\u8bd5\u3002"],["p","\u89e3\u51b3\u8fd9\u4e9b\u95ee\u9898\u5df2\u7ecf\u5728 ",["code","Promise"]," \u8fdb\u884c\u6807\u51c6\u5316\u4e86"],["h2","Promise \u662f\u5982\u4f55\u5de5\u4f5c\u7684"],["p","Promise \u63d0\u4f9b\u4e86\u4e00\u5957\u975e\u5e38\u660e\u786e\u7684 API\n\u6211\u4eec\u6765\u770b\u4e0b  ",["code","setTimeout"]," \u5982\u4f55\u548c ",["code","Promise"]," \u8fdb\u884c\u914d\u5408\uff1a"],["pre",{lang:"javascript",highlighted:'<span class="token keyword">function</span> sleep <span class="token punctuation">(</span>time<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Promise</span><span class="token punctuation">(</span><span class="token punctuation">(</span>resolve<span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">></span> <span class="token function">setTimeout</span><span class="token punctuation">(</span>resolve<span class="token punctuation">,</span> time<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span>\n<span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">></span> console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">\'100ms elapsed\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n<span class="token punctuation">.</span><span class="token keyword">catch</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">></span> console<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">\'error!\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>'},["code","function sleep (time) {\n  return new Promise((resolve) => setTimeout(resolve, time));\n}\n\nsleep(100)\n.then(() => console.log('100ms elapsed'))\n.catch(() => console.error('error!'));"]]],meta:{category:"\u6559\u7a0b",title:"Async Await",filename:"docs/spec/asyncawait.zh-CN.md"},toc:["ul",["li",["a",{className:"bisheng-toc-h2",href:"#\u56de\u8c03\u7684\u95ee\u9898",title:"\u56de\u8c03\u7684\u95ee\u9898"},"\u56de\u8c03\u7684\u95ee\u9898"]],["li",["a",{className:"bisheng-toc-h2",href:"#Promise-\u662f\u5982\u4f55\u5de5\u4f5c\u7684",title:"Promise \u662f\u5982\u4f55\u5de5\u4f5c\u7684"},"Promise \u662f\u5982\u4f55\u5de5\u4f5c\u7684"]]]}}});