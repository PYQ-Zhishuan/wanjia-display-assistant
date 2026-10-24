(function(root){
'use strict';
const sources={
 biscuit:{label:'IKEA KEX 单包装资料',url:'https://www.ikea.cn/cn/en/p/kex-biscuits-40129020/',detail:'资料列出包装13×19×6 cm。此处按大面直立建模为宽13、深6、高19 cm，朝向为演示选择。仅作盒装饼干参考。'},
 bottle:{label:'Coca-Cola 土耳其官方包装问答',url:'https://merakettim.coca-colaturkiye.com/soru-detay/1-5-litrelik-sisenin-olculeri-capi-nedir--56790',detail:'2019年官方问答中的1.5 L PET瓶为高311 mm、直径94.5 mm。本版取约9.5×9.5×31 cm，地区和包装版本可能不同。'},
 can:{label:'Crown 330 mL Standard 罐型',url:'https://www.crowncork.com/beverage-packaging/products/beverage-cans/113oz-330ml-standard',detail:'厂商公开罐型直径66 mm、高115.2 mm。本版取约6.6×6.6×11.5 cm。同容量也可能有不同罐型。'}
};
const templates=[
 {key:'biscuit',category:'packaged',name:'盒装饼干',form:'盒形',example:'饼干 · 纸盒食品',aliases:'饼干 食品饼干 包装食品饼干 食品纸盒 盒装 cookie biscuit',shape:'box',width:13,depth:6,height:19,color:'#BC754C',tip:'包装大面朝前，盒子的边线排齐。'},
 {key:'bottle',category:'packaged',name:'大瓶饮料',form:'瓶形',example:'大瓶饮料 · 1.5 L',aliases:'大瓶 饮料 大瓶可乐 可乐 汽水 1.5l 1.5升 1500ml bottle',shape:'bottle',width:9.5,depth:9.5,height:31,color:'#B35B4F',tip:'瓶身标识朝前，直立成组，不把瓶子叠高。'},
 {key:'can',category:'packaged',name:'圆罐商品',form:'罐形',example:'罐头 · 易拉罐',aliases:'罐头 圆形罐头 易拉罐 罐装饮料 330ml 330毫升 罐装 can',shape:'can',width:6.6,depth:6.6,height:11.5,color:'#618679',tip:'罐身标签朝向一致，先排齐一组再重复。参考基底为330 mL标准饮料罐，罐头请按实物调整。'},
 {key:'bag',category:'packaged',name:'自立零食袋',form:'袋形',example:'坚果 · 袋装零食',aliases:'坚果 零食 袋装 自立袋 袋装食品 软袋 果干 bag',shape:'bag',width:14,depth:7,height:23,color:'#C3A14E',tip:'袋子站不稳时先用承托，同款袋口和正面方向一致。'},
 {key:'tissue',category:'packaged',name:'方袋纸巾',form:'软方包',example:'纸巾 · 方袋抽纸',aliases:'纸巾 抽纸 方袋纸巾 纸巾包 大方袋',shape:'softbox',width:20,depth:12,height:10,color:'#809BA0',tip:'外包装完整、底面平稳时再考虑错位露角，拿走上层后也要保持稳定。'},
 {key:'carton',category:'packaged',name:'箱装饮料',form:'整箱形',example:'整箱饮料 · 纸箱',aliases:'箱装饮料 成箱饮料 整箱 饮料箱 纸箱',shape:'carton',width:30,depth:20,height:24,color:'#B79969',tip:'在低位台面用平面转向形成纹理，保留可识别的商品正面和价签。'},
 {key:'cup',category:'packaged',name:'杯装食品',form:'杯形',example:'杯装零食 · 碗装食品',aliases:'杯装 碗装 杯子 泡面 方便面',shape:'cup',width:10,depth:10,height:11,color:'#927CA0',tip:'杯身朝向一致，按组排列；本示意不叠杯。'},
 {key:'flatbox',category:'packaged',name:'扁盒食品',form:'扁盒形',example:'糕点盒 · 扁包装',aliases:'扁盒 糕点 包装托盘 礼盒',shape:'tray',width:20,depth:14,height:6,color:'#B69159',tip:'保留包装展示面，不遮住同组商品的信息。'},
 {key:'apple',category:'fresh',name:'圆形果蔬',form:'球圆形',example:'苹果 · 橙子 · 番茄',aliases:'苹果 橙子 橘子 番茄 圆形水果 果蔬',shape:'round',width:8,depth:8,height:8,color:'#C86B50',tip:'散装圆果用适宜的浅筐或围挡分组，先试单层排列，避免滚落。'},
 {key:'cucumber',category:'fresh',name:'长条果蔬',form:'长条形',example:'黄瓜 · 长茄子',aliases:'黄瓜 茄子 长条 玉米 胡萝卜',shape:'long',width:5,depth:24,height:5,color:'#769464',tip:'长条果蔬同向平放，以拿取方便的一端对齐。'},
 {key:'leafy',category:'fresh',name:'成束叶菜',form:'叶束形',example:'小白菜 · 成束青菜',aliases:'叶菜 青菜 小白菜 菠菜 菜心 蔬菜',shape:'leafy',width:13,depth:25,height:9,color:'#678C62',tip:'叶菜按束同向平放，根部对齐；不为了图案压实或遮住叶面。'},
 {key:'freshtray',category:'fresh',name:'盒装小果',form:'浅盒形',example:'草莓 · 蓝莓 · 小果盒',aliases:'草莓 蓝莓 小果 鲜果 盒装水果 小颗粒',shape:'fruittray',width:18,depth:12,height:7,color:'#A96D6D',tip:'以完整小果盒为一件分组，不挤压盒内果实；按商品要求使用相应陈列设施。'}
];
templates.forEach(t=>{if(!sources[t.key])sources[t.key]={label:'演示估值，待补门店实样',url:'',detail:t.width+'×'+t.depth+'×'+t.height+' cm为本项目示意基底，不是行业统一尺寸。'+(t.category==='fresh'?'生鲜个体大小与包装方式差异较大。':'')+'请按实物拖动修正。'};});
const scenes=[
 {key:'island',name:'堆头',hint:'独立台面 · 整组重复',width:120,depth:80,height:80},
 {key:'endcap',name:'端架',hint:'面向通道 · 聚焦中部',width:90,depth:45,height:50},
 {key:'corner',name:'边角柜',hint:'小区域 · 少款清晰',width:60,depth:40,height:45},
 {key:'shelf',name:'货架',hint:'一层空间 · 前沿排齐',width:100,depth:40,height:40}
];
const patterns={blocks:{name:'同款成区',hint:'先摆一组，再整组复制'},alternate:{name:'整组交替',hint:'A组、B组交替出现'},focus:{name:'主推居中',hint:'A款在中间，两侧搭配'},height:{name:'高低呼应',hint:'高的在中间，低的在两侧'}};
const motifs=[
 {key:'grid',name:'整齐成组',summary:'同向排齐，整组重复',shapes:null,view:'front',stack:false},
 {key:'offset',name:'错位露角',summary:'3包一组，每层错开一点',shapes:['softbox'],view:'front',stack:true},
 {key:'pinwheel',name:'四件围合',summary:'四件首尾围合，再重复方形单元',shapes:['carton','box','tray','softbox'],view:'top',stack:false},
 {key:'slant',name:'同角斜列',summary:'统一20°，等距错位成列',shapes:['carton','box','tray','softbox'],view:'top',stack:false},
 {key:'diamond',name:'斜角连排',summary:'统一45°，沿直线等距连排',shapes:['carton','box','tray','softbox'],view:'top',stack:false},
 {key:'texture',name:'横竖交替',summary:'横竖组成单元，每排同序重复',shapes:['carton'],view:'top',stack:false},
 {key:'triangle',name:'六瓶三角组',summary:'前1、中2、后3，共6瓶',shapes:['bottle'],view:'top',stack:false},
 {key:'pyramid',name:'圆罐阶梯',summary:'下3、中2、上1，共6罐',shapes:['can'],view:'front',stack:true}
];
const motif=key=>motifs.find(m=>m.key===key);
const available=d=>motifs.filter(m=>!m.shapes||d.products.every(p=>m.shapes.includes(template(p.key).shape)));
const round=n=>Math.round(n*10)/10;
const template=key=>templates.find(t=>t.key===key);
const circular=t=>['bottle','can','cup','round'].includes(t.shape);
const make=(key,id='A')=>{const t=template(key);if(!t)throw Error('未知模板');return {id,key,name:t.name,width:t.width,depth:t.depth,height:t.height,color:t.color,stand:true};};
function defaults(){return {version:3,products:[make('biscuit')],active:'A',columns:2,rows:2,repeat:3,pattern:'blocks',motif:'grid',composition:'repeat',stackConfirmed:false,environment:null,space:120,depth:80,height:80};}
function search(q,category){const terms=String(q).toLowerCase().replace(/\s+/g,'');return templates.filter(t=>(!category||t.category===category)&&(!terms||(t.name+t.form+t.aliases).toLowerCase().replace(/\s+/g,'').includes(terms)||t.aliases.split(' ').some(a=>a.length>=2&&terms.includes(a))));}
function validate(d){
 if(!d||![2,3].includes(d.version)||!Array.isArray(d.products)||d.products.length<1||d.products.length>3)return '方案格式不正确：请选择1—3款商品。';
 for(const [k,min,max] of [['columns',1,5],['rows',1,4],['repeat',1,3],['space',30,240],['depth',20,120],['height',15,120]])if(typeof d[k]!=='number'||!Number.isFinite(d[k])||d[k]<min||d[k]>max||(['columns','rows','repeat'].includes(k)&&!Number.isInteger(d[k])))return '方案参数超出小样范围。';
 if(!Object.hasOwn(patterns,d.pattern))return '排布方式不正确。';
 if(d.version===3&&(!motif(d.motif)||typeof d.stackConfirmed!=='boolean'))return '摆法模板不正确。';
 if(d.composition!==undefined&&!['repeat','mirror','quad'].includes(d.composition))return '整体构图不正确。';
 if(d.version===3&&d.environment!==null&&!scenes.some(s=>s.key===d.environment))return '陈列环境不正确。';
 if(new Set(d.products.map(p=>p&&p.id)).size!==d.products.length)return '商品编号重复。';
 for(const p of d.products){const t=p&&template(p.key);if(!t||!['A','B','C'].includes(p.id)||typeof p.name!=='string'||!p.name.trim()||p.name.length>30||!/^#[0-9a-f]{6}$/i.test(p.color)||typeof p.stand!=='boolean')return '商品模板资料不正确。';for(const k of ['width','depth','height'])if(typeof p[k]!=='number'||!Number.isFinite(p[k])||p[k]<t[k]*.5-.1||p[k]>t[k]*1.5+.1)return '商品调整幅度超出模板范围。';if(circular(t)&&Math.abs(p.width-p.depth)>.05)return '圆形商品的宽和深应一致。';}
 if(d.version===3&&!available(d).some(m=>m.key===d.motif))return '这套摆法不适合当前商品外形。';
 return '';
}
function normalize(d){const error=validate(d);if(error)throw Error(error);return {version:3,products:d.products.map((p,i)=>({...Object.fromEntries(['key','name','width','depth','height','color','stand'].map(k=>[k,p[k]])),id:'ABC'[i]})),active:'A',...Object.fromEntries(['columns','rows','repeat','pattern','space','depth','height'].map(k=>[k,d[k]])),motif:d.version===2?'grid':d.motif,composition:d.composition||'repeat',stackConfirmed:d.version===2?false:d.stackConfirmed,environment:d.version===2?'shelf':d.environment};}
function recommend(d){
 if(d.products.length===1)return {pattern:'blocks',reason:'只有一款商品，先把同款摆成一组，再重复，最容易做整齐。'};
 if(d.products.some(p=>template(p.key).category==='fresh'))return {pattern:'blocks',reason:'生鲜先按同款分区，承托、价签和补货位置更清楚。'};
 if(d.environment==='corner')return {pattern:'blocks',reason:'边角位置较小，同款集中成区，减少零碎交替。'};
 const hs=d.products.map(p=>p.height);
 if(Math.max(...hs)/Math.min(...hs)>=1.3)return {pattern:'height',reason:'这几款商品高矮差异明显，把高的放中间，用包装自身高度形成轮廓。'};
 if(d.products.length===2)return {pattern:'alternate',reason:'两款商品高度接近，交替重复整组，容易形成清楚的节奏。'};
 return {pattern:'focus',reason:'三款商品可以让A款居中作为主推，两侧用另外两款配合。'};
}
function recommendMotif(d){
 const choices=available(d),special=choices.find(m=>m.key!=='grid');
 if(!special)return {key:'grid',reason:'先将同款商品排成清楚的一组，再重复。多种外形混合时采用通用摆法。'};
 if(d.environment){const us=d.products.map(p=>unit(p,{...d,motif:special.key}));if(us.reduce((n,u)=>n+u.span,0)+(us.length-1)*3+6>d.space||Math.max(...us.map(u=>u.usedDepth))+6>d.depth||Math.max(...us.map(u=>u.usedHeight))+3>d.height)return {key:'grid',reason:'当前场地放不下这类特色组合的完整一组，先用整齐成组，保持边界与前沿清楚。'};}
 if(special.stack)return {key:special.key,reason:'保持相同错位幅度或对称层数，再整组重复；先核对包装可叠放、层间支撑和拿取稳定性。'};
 return {key:special.key,reason:special.key==='triangle'?'瓶子直立、前1中2后3，围绕中线对称；以六瓶为单元向两侧整齐重复。':special.key==='pinwheel'?'四件按同一个方向首尾围合，组成清楚的方形单元；整组边界排齐后再重复。':'每排都按同一个横竖顺序摆放，前沿排齐、间距一致，用规则重复形成纹理。'};
}
function unit(p,d){
 const gap=.8,mode=d.motif||'grid',items=[];
 const add=(x,y,z=0,angle=0)=>{const a=angle*Math.PI/180,bw=round(Math.abs(p.width*Math.cos(a))+Math.abs(p.depth*Math.sin(a))),bd=round(Math.abs(p.depth*Math.cos(a))+Math.abs(p.width*Math.sin(a)));items.push({x:round(x),y:round(y),z:round(z),angle,bw,bd});};
 if(mode==='triangle'){for(let r=0;r<3;r++)for(let c=0;c<=r;c++)add((2-r)*(p.width+gap)/2+c*(p.width+gap),r*(p.depth+gap));}
 else if(mode==='pyramid'){for(let level=0;level<3;level++)for(let c=0;c<3-level;c++)add(level*(p.width+gap)/2+c*(p.width+gap),0,level*p.height);}
 else if(mode==='offset'){for(let level=0;level<3;level++)add(level*p.width*.12,level*p.depth*.05,level*p.height);}
 else if(mode==='texture'){const rowDepth=Math.max(p.width,p.depth)+gap;[90,0,90,0].forEach((angle,i)=>add(i%2?p.depth+gap:0,Math.floor(i/2)*rowDepth,0,angle));}
 else if(mode==='pinwheel'){const long=Math.max(p.width,p.depth),short=Math.min(p.width,p.depth),a=p.width>=p.depth?0:90;add(0,0,0,a);add(long+gap,0,0,90-a);add(short+gap,long+gap,0,a);add(0,short+gap,0,90-a);}
 else if(mode==='slant'||mode==='diamond'){const angle=mode==='slant'?20:45,r=angle*Math.PI/180,dx=mode==='slant'?p.width*.12:0,dy=(p.depth+gap+dx*Math.sin(r))/Math.cos(r);for(let i=0;i<4;i++)add(i*dx,i*dy,0,angle);}
 else for(let r=0;r<d.rows;r++)for(let c=0;c<d.columns;c++)add(c*(p.width+gap),r*(p.depth+gap));
 return {items,span:round(Math.max(...items.map(i=>i.x+i.bw))),usedDepth:round(Math.max(...items.map(i=>i.y+i.bd))),usedHeight:round(Math.max(...items.map(i=>i.z+p.height)))};
}
function layout(d){
 const error=validate(d);if(error)return {error,items:[],groups:[]};
 const ps=d.products.map(p=>({...p,shape:template(p.key).shape,category:template(p.key).category}));
 const col=d.columns,rows=d.rows,repeat=d.repeat,gap=3,unitGap=.8,edge=3;
 let sequence=[];
 if(d.pattern==='alternate'){for(let r=0;r<repeat;r++)sequence.push(...ps);}
 else if(d.pattern==='focus'){const main=ps[0],other=ps.slice(1).flatMap(p=>Array(repeat).fill(p)),split=Math.ceil(other.length/2);sequence=[...other.slice(0,split),...Array(repeat).fill(main),...other.slice(split)];}
 else if(d.pattern==='height'){const sorted=ps.flatMap(p=>Array(repeat).fill(p)).sort((a,b)=>b.height-a.height);for(const [i,p]of sorted.entries())i%2?sequence.push(p):sequence.unshift(p);}
 else sequence=ps.flatMap(p=>Array(repeat).fill(p));
 let groups=sequence.map((p,i)=>({...p,group:i+1,...unit(p,d),flipX:false,flipY:false,groupRow:0}));
 const comp=d.composition||'repeat';
 if(comp!=='repeat')groups=[...groups,...groups.slice().reverse().map(g=>({...g,flipX:true}))];
 const rowDepth=Math.max(...groups.map(g=>g.usedDepth));
 const span=round(groups.reduce((s,g)=>s+g.span,0)+(groups.length-1)*gap),requiredWidth=round(span+edge*2),requiredDepth=round(rowDepth*(comp==='quad'?2:1)+(comp==='quad'?gap:0)+edge*2),requiredHeight=round(Math.max(...groups.map(g=>g.usedHeight))+edge);
 if(comp==='quad')groups=[...groups,...groups.map(g=>({...g,flipY:true,groupRow:1}))];
 const constrained=d.version===2||d.environment!==null;
 let x=constrained?Math.max(edge,(d.space-span)/2):edge;const items=[];
 const xStart=x;
 for(const [gi,g]of groups.entries()){if(gi&&g.groupRow!==groups[gi-1].groupRow)x=xStart;g.group=gi+1;g.x=round(x);g.y=round(edge+g.groupRow*(rowDepth+gap));for(const [index,i]of g.items.entries()){const ix=g.flipX?g.span-i.x-i.bw:i.x,iy=g.flipY?rowDepth-i.y-i.bd:i.y;items.push({...g,...i,x:round(x+ix),y:round(g.y+iy),angle:(g.flipX?-i.angle:i.angle)*(g.flipY?-1:1),index});}x+=g.span+gap;}
 const issues=[];
 if(constrained&&requiredWidth>d.space)issues.push('按模板估算偏宽约'+round(requiredWidth-d.space)+' cm，减少横向列数或重复组数再试。');
 if(constrained&&requiredDepth>d.depth)issues.push('向后摆得偏深，可减少向后排数。');
 if(constrained&&requiredHeight>d.height)issues.push('商品高于参考净空，请核对实物或换位置。');
 if(ps.some(p=>!p.stand))issues.push('有商品需要承托，先确认放稳再采用这套摆法。');
 if(motif(d.motif||'grid').stack&&!d.stackConfirmed)issues.push('这是堆叠样式示意：包装能否叠放、层间支撑和拿取稳定性尚未确认。');
 return {error:'',groups,items,span,requiredWidth,requiredDepth,requiredHeight,total:items.length,issues,constrained,tooWide:constrained&&requiredWidth>d.space,tooDeep:constrained&&requiredDepth>d.depth,sequence:groups.filter(g=>!g.groupRow).map(g=>g.id).join(' '),rowDepth,composition:comp,edge,gap,unitGap};
}
function fit(d){
 if(!d.environment)return null;
 // Keep all SKUs; look for a compact arrangement within the selected single-level area.
 let best=null;
 for(let columns=1;columns<=d.columns;columns++)for(let rows=1;rows<=d.rows;rows++)for(let repeat=1;repeat<=d.repeat;repeat++){
  const candidate={...d,columns,rows,repeat},r=layout(candidate);
  if(!r.error&&r.requiredWidth<=d.space&&r.requiredDepth<=d.depth&&r.requiredHeight<=d.height){const score=r.total*100+repeat*10-Math.abs(columns-d.columns);if(!best||score>best.score)best={columns,rows,repeat,score};}
 }
 return best&&{columns:best.columns,rows:best.rows,repeat:best.repeat};
}
const api={templates,sources,scenes,patterns,motifs,motif,available,recommendMotif,unit,template,circular,make,defaults,search,layout,validate,normalize,recommend,fit,round};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.DisplayTemplates=api;
})(typeof window!=='undefined'?window:globalThis);
