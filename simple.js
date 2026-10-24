'use strict';
const T=DisplayTemplates,$=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let data=T.defaults(),step=1,category='packaged',view='front',zoom='all',photoUrl='',dirty=true;
const colors=['#BC754C','#B35B4F','#618679','#C3A14E','#6789A0','#987D9D'];
function toast(s){$('toast').textContent=s;$('toast').hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').hidden=true,4000);}
function active(){return data.products.find(p=>p.id===data.active)||data.products[0];}
function svg(content,w=200,h=150,label=''){return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+w+' '+h+'" '+(label?'role="img" aria-label="'+esc(label)+'"':'aria-hidden="true"')+' style="font-family:Microsoft YaHei,sans-serif">'+content+'</svg>';}
function shape(p,x,y,w,h,label='',top=false){
 const c=p.color;let out='';
 if(p.shape==='round')out='<ellipse cx="'+(x+w/2)+'" cy="'+(y+h*.53)+'" rx="'+(w/2)+'" ry="'+(h*.47)+'" fill="'+c+'"/><path d="M'+(x+w*.5)+','+(y+h*.14)+' q'+(w*.05)+','+(-h*.18)+' '+(w*.25)+','+(-h*.1)+' q'+(-w*.02)+','+(h*.18)+' '+(-w*.25)+','+(h*.1)+'" fill="#5d7b4f"/>';
 else if(p.shape==='long')out='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+Math.min(w,h)*.45+'" fill="'+c+'"/><path d="M'+(x+w*.38)+','+(y+h*.15)+' L'+(x+w*.38)+','+(y+h*.85)+'" stroke="#b0c49b" stroke-width="'+Math.max(1,w*.05)+'"/>';
 else if(p.shape==='leafy'){for(let i=0;i<4;i++)out+='<ellipse cx="'+(x+w*(.16+i*.22))+'" cy="'+(y+h*.43)+'" rx="'+(w*.17)+'" ry="'+(h*.42)+'" fill="'+(i%2?c:'#86a276')+'"/>';out+='<path d="M'+(x+w*.3)+','+(y+h*.6)+' L'+(x+w*.47)+','+(y+h)+' L'+(x+w*.67)+','+(y+h*.6)+'" fill="none" stroke="#bdcda5" stroke-width="'+w*.12+'"/>';}
 else if(p.shape==='fruittray'){out='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+w*.08+'" fill="#dee5d5" stroke="#83947e" stroke-width="1"/>';for(let r=0;r<(top?2:1);r++)for(let c1=0;c1<3;c1++)out+='<ellipse cx="'+(x+w*(.2+c1*.3))+'" cy="'+(y+h*(top?.3+r*.4:.45))+'" rx="'+w*.11+'" ry="'+h*(top?.15:.28)+'" fill="'+c+'"/>';}
 else if(top&&T.circular(p))out='<ellipse cx="'+(x+w/2)+'" cy="'+(y+h/2)+'" rx="'+w/2+'" ry="'+h/2+'" fill="'+c+'"/><ellipse cx="'+(x+w/2)+'" cy="'+(y+h/2)+'" rx="'+w*.2+'" ry="'+h*.2+'" fill="#ffffff70"/>';
 else if(p.shape==='bottle')out='<path d="M'+(x+w*.33)+','+(y+h*.08)+' L'+(x+w*.33)+','+(y+h*.21)+' Q'+x+','+(y+h*.32)+' '+x+','+(y+h*.42)+' L'+x+','+(y+h*.95)+' Q'+(x+w*.5)+','+(y+h*1.02)+' '+(x+w)+','+(y+h*.95)+' L'+(x+w)+','+(y+h*.42)+' Q'+(x+w)+','+(y+h*.32)+' '+(x+w*.67)+','+(y+h*.21)+' L'+(x+w*.67)+','+(y+h*.08)+' Z" fill="'+c+'"/><rect x="'+(x+w*.31)+'" y="'+y+'" width="'+w*.38+'" height="'+h*.09+'" rx="2" fill="#4e6452"/>';
 else if(p.shape==='bag')out='<path d="M'+x+','+(y+h)+' L'+(x+w*.06)+','+(y+h*.06)+' Q'+(x+w*.5)+','+(y-h*.02)+' '+(x+w*.94)+','+(y+h*.06)+' L'+(x+w)+','+(y+h)+' Z" fill="'+c+'"/><path d="M'+(x+w*.1)+','+(y+h*.1)+' H'+(x+w*.9)+'" stroke="#ffffff70"/>';
 else if(p.shape==='cup'&&!top)out='<path d="M'+x+','+y+' H'+(x+w)+' L'+(x+w*.83)+','+(y+h)+' H'+(x+w*.17)+' Z" fill="'+c+'"/><ellipse cx="'+(x+w/2)+'" cy="'+(y+h*.03)+'" rx="'+(w*.5)+'" ry="'+(h*.06)+'" fill="#e4e3d7"/>';
 else {out='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(['can','softbox'].includes(p.shape)?Math.min(w,h)*.13:2)+'" fill="'+c+'"/>';if(p.shape==='can')out+='<ellipse cx="'+(x+w/2)+'" cy="'+(y+h*.04)+'" rx="'+(w*.48)+'" ry="'+(h*.04)+'" fill="#d1d7cc"/>';if(p.shape==='carton')out+='<path d="M'+(x+w/2)+','+y+' V'+(y+h)+'" stroke="#ead8b6" stroke-width="'+w*.06+'"/>';if(p.shape==='softbox')out+='<path d="M'+x+','+(y+h*.15)+' L'+(x+w*.13)+','+(y+h*.03)+' H'+(x+w*.88)+'" fill="none" stroke="#ffffff70" stroke-width="2"/>';}
 if(!['round','long','leafy','fruittray'].includes(p.shape)&&!top)out+='<rect x="'+(x+w*.13)+'" y="'+(y+h*.43)+'" width="'+w*.74+'" height="'+h*.28+'" rx="2" fill="#fffbed"/>';
 if(label)out+='<text x="'+(x+w/2)+'" y="'+(y+h*(top?.58:.63))+'" text-anchor="middle" font-size="'+Math.min(18,w*.35,h*.3)+'" fill="'+(top?'#fff':'#385142')+'" font-weight="600">'+esc(label)+'</text>';
 return out;
}
function productIcon(t){const top=['long','leafy','fruittray'].includes(t.shape),h=top?t.depth:t.height,s=Math.min(62/t.width,58/h);return svg(shape(t,50-t.width*s/2,65-h*s,t.width*s,h*s,'',top),100,72);}
function sceneArt(key,large=false){
 let out='<ellipse cx="154" cy="181" rx="116" ry="15" fill="#e8eddf"/>';
 const plane='<path d="M46 98 H205 L265 57 H106 Z" fill="#b0c59d" stroke="#728e62" stroke-width="2"/>';
 if(key==='island')out+='<path d="M46 98 H205 V166 H46Z" fill="#d7d9c4"/><path d="M205 98 L265 57 V125 L205 166Z" fill="#b9c4ac"/>'+plane;
 else if(key==='corner')out+='<path d="M55 83 H194 L248 45 V125 L194 167 H55Z" fill="#d7dfcc"/><path d="M55 83 H194 V167 H55Z" fill="#e9e9dc"/><path d="M55 95 H194 L248 57 H109Z" fill="#abc49a" stroke="#708d60" stroke-width="2"/><path d="M194 95 V167" stroke="#a2b299" stroke-width="2"/>';
 else out+='<path d="M48 28 H205 V169 H48Z" fill="#e1e6da" stroke="#b5c2a9" stroke-width="3"/><path d="M205 28 L260 9 V140 L205 169Z" fill="#d0dac8"/><path d="M46 53 H205 L260 30" fill="none" stroke="#a0b193" stroke-width="5"/><path d="M46 145 H205 L260 122" fill="none" stroke="#a0b193" stroke-width="5"/>'+plane+(key==='endcap'?'<rect x="48" y="12" width="157" height="24" rx="3" fill="#8ca079"/><rect x="82" y="20" width="89" height="7" rx="2" fill="#dce6cf"/>':'');
 out+='<path d="M75 92 H190 L226 68 H111Z" fill="#dcebd0" stroke="#57784a" stroke-dasharray="5 4" stroke-width="1.5"/>';
 if(large)out+='<g fill="#516b43" font-size="12"><text x="115" y="123" text-anchor="middle">宽 ≈ '+data.space+' cm</text><text x="239" y="102" text-anchor="middle">深 '+data.depth+'</text><text x="287" y="45" text-anchor="middle">净空</text><text x="287" y="63" text-anchor="middle">'+data.height+' cm</text></g><path d="M282 80 V133 M278 85 L282 80 L286 85 M278 128 L282 133 L286 128" fill="none" stroke="#839b72"/><text x="155" y="207" text-anchor="middle" font-size="11" fill="#7d8973">绿色区域：这一层的可摆放范围</text>';
 return svg(out,320,large?220:195,large?'陈列位置和宽深净空示意':'');
}
function renderOptions(){
 document.querySelectorAll('[data-category]').forEach(b=>{b.classList.toggle('active',b.dataset.category===category);b.setAttribute('aria-pressed',b.dataset.category===category);});
 const q=$('template-search').value,ts=T.search(q,q?'':category);
 $('template-options').innerHTML=ts.length?ts.map(t=>'<button class="template-card '+(active().key===t.key?'selected':'')+'" data-template="'+t.key+'" aria-label="'+t.form+' '+t.name+'" aria-pressed="'+(active().key===t.key)+'">'+productIcon(t)+'<strong>'+t.form+'</strong><small>'+t.example+'</small></button>').join(''):'<p class="empty muted">暂时没有这个模板，试试相近的包装外形。</p>';
}
function renderEditor(){
 const p=active(),t=T.template(p.key);data.active=p.id;
 $('active-badge').textContent=p.id+'款 · '+t.form;
 $('chosen').innerHTML=data.products.map(p=>'<button data-active="'+p.id+'" class="'+(p.id===data.active?'active':'')+'" aria-pressed="'+(p.id===data.active)+'"><i style="background:'+p.color+'"></i>'+p.id+' '+esc(p.name)+'</button>').join('');
 for(const [k,id]of[['width','size-width'],['depth','size-depth'],['height','size-height']])$(id).value=Math.round(p[k]/t[k]*100);
 $('product-name').value=p.name;$('stand').checked=p.stand;$('remove').disabled=data.products.length===1;$('add-product').disabled=data.products.length>=3;
 $('depth-row').hidden=T.circular(t);
 $('dimension-note').textContent=['long','leafy'].includes(t.shape)?'按平放方向调整：左右是宽，前后是长度，高度是平放后的厚度。':'数值只是约数，拖到接近实物的比例即可。';
 $('colors').innerHTML=colors.map(c=>'<button aria-label="包装颜色 '+c+'" data-color="'+c+'" class="'+(c===p.color?'active':'')+'" style="background:'+c+'"></button>').join('');
 renderModel();
}
function renderModel(){
 const p=active(),t=T.template(p.key),s=Math.min(130/(t.width*1.5),130/(t.height*1.5));let out='<line x1="25" y1="160" x2="215" y2="160" stroke="#bbcbb0"/>'+shape({...p,shape:t.shape},120-p.width*s/2,160-p.height*s,p.width*s,p.height*s,p.id);
 if(['long','leafy'].includes(t.shape))out+='<text x="120" y="22" text-anchor="middle" font-size="11" fill="#86917c">平放后的正面</text>';
 $('model').innerHTML=svg(out,240,180,'商品外形随滑块调整');
 for(const k of ['width','depth','height'])$(k+'-value').textContent='约'+T.round(p[k])+' cm';
}
function renderScenes(){
 $('scene-options').innerHTML=T.scenes.map(s=>'<button class="scene-card '+(s.key===data.environment?'active':'')+'" data-scene="'+s.key+'" aria-pressed="'+(s.key===data.environment)+'">'+sceneArt(s.key)+'<strong>'+s.name+'</strong><small>'+s.hint+'</small></button>').join('');
 $('environment-editor').hidden=!data.environment;
 if(data.environment){const s=T.scenes.find(s=>s.key===data.environment);$('scene-title').textContent=s.name+' · 可用区域';$('scene-diagram').innerHTML=sceneArt(s.key,true);$('scene-note').textContent=s.key==='corner'?'先估算柜面中可用的一块矩形，弧形、斜边及道具占用留给现场核对。':'默认大小是演示基底。净空指台面上方到遮挡物之间的空间。';}
 for(const [id,k,out]of[['space','space','space-value'],['scene-depth','depth','scene-depth-value'],['scene-height','height','scene-height-value']]){$(id).value=data[k];$(out).textContent='约'+data[k]+' cm';}
}
function motifIcon(key,p=active()){
 const t=T.template(p.key),pp={...p,shape:t.shape},u=T.unit(pp,{motif:key,columns:2,rows:2}),top=T.motif(key).view==='top',s=Math.min(90/u.span,51/(top?u.usedDepth:u.usedHeight)),x0=(110-u.span*s)/2,base=57;
 let out='<line x1="5" y1="59" x2="105" y2="59" stroke="#bdcbb0"/>';
 for(const i of [...u.items].sort((a,b)=>b.y-a.y||a.z-b.z)){const x=x0+i.x*s,y=base-(top?i.y+i.bd:i.z+p.height)*s;let item=shape(pp,top?x+(i.bw-p.width)*s/2:x,y+(top?(i.bd-p.depth)*s/2:0),(top?p.width:i.bw)*s,(top?p.depth:p.height)*s,'',top);if(top&&i.angle)item='<g transform="rotate('+i.angle+' '+(x+i.bw*s/2)+' '+(y+i.bd*s/2)+')">'+item+'</g>';out+=item;}
 return svg(out,110,65);
}
function draw(r){
 if(zoom==='unit')return drawUnit();
 const availableW=r.constrained?data.space:r.requiredWidth,availableD=r.constrained?data.depth:r.requiredDepth,availableH=r.constrained?data.height:r.requiredHeight;
 const span=Math.max(availableW,r.requiredWidth),vertical=view==='front'?Math.max(availableH,r.requiredHeight):Math.max(availableD,r.requiredDepth),portrait=vertical>span,W=portrait?460:850,H=portrait?660:420,base=H-85,s=Math.min((W-110)/span,(H-170)/vertical),x0=(W-span*s)/2;
 let out='<rect width="'+W+'" height="'+H+'" fill="#f7f8f2"/><text x="25" y="30" font-size="14" fill="#7b8c70">'+(view==='top'?'俯视 · 顾客在图下方':'正面 · 标签朝向顾客')+'</text><text x="'+(W-25)+'" y="30" text-anchor="end" font-size="12" fill="#89937e">'+(T.motif(data.motif).stack?'三层样式 · 支撑需现场确认':'同款成组 · 整组重复')+'</text>';
 if(view==='top')out+='<rect x="'+x0+'" y="'+(base-availableD*s)+'" width="'+availableW*s+'" height="'+availableD*s+'" rx="5" fill="#eaf0e1" stroke="#9aac8c" stroke-width="2" stroke-dasharray="'+(r.constrained?'':'6 5')+'"/>';
 else {if(r.constrained&&data.environment!=='island')out+='<path d="M'+x0+','+base+' V'+(base-availableH*s)+' H'+(x0+availableW*s)+' V'+base+'" fill="none" stroke="#bdc7b2" stroke-width="4"/>';out+='<rect x="'+x0+'" y="'+(base+3)+'" width="'+availableW*s+'" height="10" rx="2" fill="#839c70"/>';}
 r.groups.forEach(g=>{const gh=view==='top'?g.usedDepth:g.usedHeight,gy=view==='top'?(g.flipY?g.y+r.rowDepth-g.usedDepth:g.y):0;out+='<rect x="'+(x0+g.x*s-3)+'" y="'+(base-gy*s-gh*s-4)+'" width="'+(g.span*s+6)+'" height="'+(gh*s+8)+'" rx="5" fill="'+(g.group%2?'#dfe9d450':'#f2ead450')+'" stroke="'+(g.category==='fresh'?'#b6c4a7':'none')+'" stroke-dasharray="4 3"/>';});
 const items=[...r.items].sort((a,b)=>b.y-a.y||a.z-b.z);
 items.forEach(p=>{const x=x0+p.x*s,top=view==='top',y=base-(top?p.y+p.bd:p.z+p.height)*s;let item=shape(p,top?x+(p.bw-p.width)*s/2:x,y+(top?(p.bd-p.depth)*s/2:0),(top?p.width:p.bw)*s,(top?p.depth:p.height)*s,p.id,top);if(top&&p.angle)item='<g transform="rotate('+p.angle+' '+(x+p.bw*s/2)+' '+(y+p.bd*s/2)+')">'+item+'</g>';out+=item;});
 if(r.tooWide)out+='<line x1="'+(x0+availableW*s)+'" y1="55" x2="'+(x0+availableW*s)+'" y2="'+(base+20)+'" stroke="#bd8054" stroke-width="2" stroke-dasharray="5 5"/>';
 r.groups.filter(g=>!g.groupRow).forEach(g=>out+='<rect x="'+(x0+(g.x+g.span/2)*s-22)+'" y="'+(base+20)+'" width="44" height="22" rx="3" fill="#fff" stroke="#dce2d3"/><text x="'+(x0+(g.x+g.span/2)*s)+'" y="'+(base+35)+'" text-anchor="middle" font-size="12" fill="#5e7650">'+g.id+'组</text>');
 if(r.composition!=='repeat'){const cx=x0+(r.groups[0].x+r.span/2)*s;out+='<line x1="'+cx+'" x2="'+cx+'" y1="60" y2="'+(base+12)+'" stroke="#577b48" stroke-width="2" stroke-dasharray="6 6"/>';if(r.composition==='quad'&&view==='top'){const cy=base-(r.edge+r.rowDepth+r.gap/2)*s;out+='<line x1="'+x0+'" x2="'+(x0+availableW*s)+'" y1="'+cy+'" y2="'+cy+'" stroke="#577b48" stroke-width="2" stroke-dasharray="6 6"/>';}}
 out+='<text x="'+W/2+'" y="'+(H-20)+'" text-anchor="middle" font-size="'+(portrait?9:13)+'" fill="#7b8c70">'+(!r.constrained?'未设置场地 · 示意组合方式，不判断能否放下':r.tooWide?'虚线是台面边缘，当前组合偏宽':'按参考尺寸试摆 · 商品间隔仍需现场调整')+'</text>';
 return svg(out,W,H,view==='top'?'商品分组俯视示意':'商品分组正面示意');
}
function drawUnit(){
 const p={...data.products[0],shape:T.template(data.products[0].key).shape},u=T.unit(p,data),top=view==='top',height=top?u.usedDepth:u.usedHeight,portrait=height>u.span*1.3,W=portrait?460:850,H=portrait?660:420,s=Math.min((W-170)/u.span,(H-175)/height),x0=(W-u.span*s)/2,base=H-95;
 let out='<rect width="'+W+'" height="'+H+'" fill="#f7f8f2"/><text x="25" y="30" font-size="15" fill="#7b8c70">'+p.id+'款 · 单组细节 · '+(top?'俯视':'正面')+'</text><text x="825" y="30" text-anchor="end" font-size="13" fill="#7b8c70">同款 '+u.items.length+' 件组成一组</text>';
 for(const i of [...u.items].sort((a,b)=>b.y-a.y||a.z-b.z)){const x=x0+i.x*s,y=base-(top?i.y+i.bd:i.z+p.height)*s;let item=shape(p,top?x+(i.bw-p.width)*s/2:x,y+(top?(i.bd-p.depth)*s/2:0),(top?p.width:i.bw)*s,(top?p.depth:p.height)*s,p.id,top);if(top&&i.angle)item='<g transform="rotate('+i.angle+' '+(x+i.bw*s/2)+' '+(y+i.bd*s/2)+')">'+item+'</g>';out+=item;}
 const labels=data.motif==='triangle'&&top?['前排 1瓶','中排 2瓶','后排 3瓶']:data.motif==='pyramid'&&!top?['下层 3罐','中层 2罐','上层 1罐']:[];
 labels.forEach((label,i)=>{const y=base-(top?(i*(p.depth+.8)+p.depth/2):(i*p.height+p.height/2))*s;out+='<text x="'+(x0+u.span*s+18)+'" y="'+(y+5)+'" font-size="16" fill="#758b62">'+label+'</text>';});
 out+='<line x1="'+(x0-15)+'" x2="'+(x0+u.span*s+15)+'" y1="'+(base+13)+'" y2="'+(base+13)+'" stroke="#a7b99a" stroke-width="3"/><text x="'+W/2+'" y="'+(H-42)+'" text-anchor="middle" font-size="16" fill="#637d52">'+esc(T.motif(data.motif).summary)+'</text><text x="'+W/2+'" y="'+(H-15)+'" text-anchor="middle" font-size="'+(portrait?10:12)+'" fill="#87957c">'+(top?'顾客在图下方 · 点“看整体”查看整组重复':'点“俯视”看占地，点“看整体”看整组重复')+'</text>';
 return svg(out,W,H,'单组摆放细节：'+T.motif(data.motif).name);
}
function counters(){
 const repeatLabel=data.composition==='mirror'?'每侧每款':data.composition==='quad'?'每区每款':'每款整组重复';
 const labels={repeat:[repeatLabel,'组'],columns:['每组横着摆','列'],rows:['每组往后摆','排']},max={columns:5,rows:4,repeat:3};
 $('count-controls').innerHTML=Object.entries(labels).filter(([k])=>data.motif==='grid'||k==='repeat').map(([k,[label,u]])=>'<div class="count-control"><span>'+label+(k==='repeat'?'<small>不同款使用相同重复次数</small>':'')+'</span><div class="counter"><button data-count="'+k+'" data-delta="-1" aria-label="减少'+label+'" '+(data[k]===1?'disabled':'')+'>−</button><output>'+data[k]+u+'</output><button data-count="'+k+'" data-delta="1" aria-label="增加'+label+'" '+(data[k]===max[k]?'disabled':'')+'>＋</button></div></div>').join('');
 $('order-settings').hidden=data.products.length===1;
 $('order-options').innerHTML=Object.entries(T.patterns).map(([k,p])=>'<button data-order="'+k+'" class="'+(data.pattern===k?'active':'')+'" title="'+p.hint+'">'+p.name+'</button>').join('');
}
function instructionIcon(type){
 if(type===1)return motifIcon(data.motif,data.products[0]);
 if(type===2)return svg('<rect x="9" y="18" width="23" height="28" rx="3" fill="#b0c39b"/><text x="20" y="36" text-anchor="middle" font-size="11" fill="#fff">A</text><path d="M37 32H51 M46 27L51 32L46 37" fill="none" stroke="#8b9d7e" stroke-width="2"/><rect x="57" y="18" width="23" height="28" rx="3" fill="#b0c39b"/><rect x="86" y="18" width="23" height="28" rx="3" fill="#b0c39b"/>',120,65);
 return svg('<rect x="18" y="12" width="80" height="32" rx="4" fill="#e5edda"/><path d="M30 22L38 30L55 15" fill="none" stroke="#789567" stroke-width="3"/><path d="M61 24H86M61 32H79" stroke="#9bad88" stroke-width="2"/><rect x="38" y="48" width="42" height="12" rx="2" fill="#c9b98c"/>',120,65);
}
function renderPlan(){
 const r=T.layout(data);if(r.error){toast(r.error);return;}
 const m=T.motif(data.motif),recommended=T.recommendMotif(data),scene=T.scenes.find(s=>s.key===data.environment);
 $('result-context').textContent=data.products.length+'款商品 · '+(scene?scene.name+'约'+data.space+' × '+data.depth+' cm':'未设置场地，仅看组合样式');
 $('plan-heading').textContent=m.name;
 $('recommend-tag').textContent=recommended.key===m.key?'参考推荐':'已选摆法';
 $('reason').textContent=recommended.key===m.key?recommended.reason:m.summary+'。先用一组试摆，再决定整组重复。';
 $('diagram').innerHTML=draw(r);
 $('group-sequence').innerHTML='<small>整组顺序</small>'+r.groups.map(g=>'<span><i style="background:'+g.color+'"></i>'+g.id+'</span>').join('');
 const unitCount=r.groups[0].items.length;
 $('counts').textContent=r.groups.length+'组 × 每组'+unitCount+'件 = '+r.total+'件'+(r.constrained?' · 参考占地约'+r.requiredWidth+' × '+r.requiredDepth+' cm':' · 件数为当前图示用量');
 $('status').className=r.issues.length?'warn':'';
 $('status').textContent=r.issues.length?r.issues.join(' '):r.constrained?'参考外形能放入这块区域，接下来检查实物间距、拿取和价签。':'尚未设置环境尺寸，这里只推荐组合方式；现场先摆一组看看。';
 const fit=T.fit(data),overflow=r.constrained&&(r.requiredWidth>data.space||r.requiredDepth>data.depth||r.requiredHeight>data.height);
 $('fit').hidden=!overflow||!fit;
 if(overflow&&!fit)$('status').textContent+=' 当前空间放不下一组此样式，请换摆法或位置。';
 $('stack-check').hidden=!m.stack;$('stack-confirm').checked=data.stackConfirmed;
 document.querySelectorAll('[data-view]').forEach(b=>{b.classList.toggle('active',b.dataset.view===view);b.setAttribute('aria-pressed',b.dataset.view===view);});
 document.querySelectorAll('[data-zoom]').forEach(b=>{b.classList.toggle('active',b.dataset.zoom===zoom);b.setAttribute('aria-pressed',b.dataset.zoom===zoom);});
 const choices=T.available(data);$('motif-count').textContent=choices.length+'种适用';
 $('composition-options').innerHTML=[['repeat','普通重复','▥ ▥ ▥'],['mirror','左右镜像','▥ │ ▥'],['quad','四向呼应','⊞']].map(([k,label,icon])=>'<button data-composition="'+k+'" class="'+((data.composition||'repeat')===k?'active':'')+'" aria-pressed="'+((data.composition||'repeat')===k)+'"><span aria-hidden="true">'+icon+'</span>'+label+'</button>').join('');
 $('motif-options').innerHTML=choices.map(choice=>'<button class="motif-card '+(data.motif===choice.key?'active':'')+'" data-motif="'+choice.key+'" aria-pressed="'+(data.motif===choice.key)+'">'+motifIcon(choice.key,data.products[0])+'<span><strong>'+choice.name+'</strong><small>'+choice.summary+'</small></span></button>').join('');
 counters();
 const first={grid:'同款横着'+data.columns+'列、向后'+data.rows+'排，前沿排齐、间距一致。',offset:'每组3包，统一方向、统一幅度错位露角；先确认包装和底部支撑。',pinwheel:'四件首尾围成一个方形，中间保留自然空隙；每个单元的旋转方向一致。',slant:'四件均在台面平放，固定20°倾角，每件采用相同的侧移和间距。',diamond:'四件均在台面平放，固定45°倾角，中心沿直线等距排列。',texture:'每排固定“一竖一横”，下一排同序复制，前沿对齐。',triangle:'在同一台面前排1瓶、中排2瓶、后排3瓶，围绕中线对称、间距一致。',pyramid:'每组下3罐、中2罐、上1罐，沿中线对称。先确认层间承托与稳定性。'}[data.motif];
 const texts=[['先摆一组',first],['再重复整组','按 '+r.sequence+' 的顺序重复，同一组内不混款。'],['最后整理','对应放好价签，试着拿一件、补一件，确认画面仍整齐。']];
 $('instruction-cards').innerHTML=texts.map(([title,text],i)=>'<article class="instruction-card">'+instructionIcon(i+1)+'<b>'+String(i+1).padStart(2,'0')+' / '+title+'</b><p>'+esc(text)+'</p></article>').join('');
 $('shape-tip').textContent=data.products.map(p=>T.template(p.key).tip).filter((s,i,a)=>a.indexOf(s)===i).join(' ');
 if(!$('compact-status')){const b=document.createElement('button');b.id='compact-status';b.className='compact-status';b.onclick=()=>{$('toggle-notes').click();$('status').scrollIntoView({behavior:'smooth',block:'center'});};$('counts').after(b);}
 $('compact-status').textContent=overflow?'空间不足':m.stack&&!data.stackConfirmed?'支撑待确认':!r.constrained?'未设场地':'尺寸参考';$('compact-status').classList.toggle('warn',r.issues.length>0);
}
function invalidate(){dirty=true;data.stackConfirmed=false;if(!T.available(data).some(m=>m.key===data.motif))data.motif='grid';}
function refresh(){renderOptions();renderEditor();renderScenes();if(step===3)renderPlan();}
function generate(){if(dirty){data.motif=T.recommendMotif(data).key;data.pattern=T.recommend(data).pattern;view=T.motif(data.motif).view;zoom=data.motif==='grid'?'all':'unit';dirty=false;}renderPlan();}
function go(n){step=n;document.querySelectorAll('.page').forEach((p,i)=>p.hidden=i+1!==step);document.querySelectorAll('[data-step]').forEach(b=>{b.classList.toggle('active',+b.dataset.step===step);b.classList.toggle('done',+b.dataset.step<step);if(+b.dataset.step===step)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});$('back').hidden=step===1;$('next').hidden=step===3;$('next').textContent=step===1?'下一步：选位置 →':data.environment?'生成摆法 →':'跳过位置，看摆法 →';$('progress-note').textContent=['先选外形，再拖动大小','场地还没定，可以跳过','看一组怎么摆，再重复整组'][step-1];if(step===3)generate();else if(step===2)renderScenes();window.scrollTo({top:0,behavior:'instant'});$('title-'+step).focus({preventScroll:true});}
function choose(key){const id=active().id;data.products[data.products.findIndex(p=>p.id===id)]=T.make(key,id);category=T.template(key).category;invalidate();refresh();}
$('template-options').onclick=e=>{const b=e.target.closest('[data-template]');if(b)choose(b.dataset.template);};
$('categories').onclick=e=>{const b=e.target.closest('[data-category]');if(b){category=b.dataset.category;$('template-search').value='';if(T.template(active().key).category!==category)choose(T.templates.find(t=>t.category===category).key);else renderOptions();}};
$('template-search').oninput=renderOptions;
$('chosen').onclick=e=>{const b=e.target.closest('[data-active]');if(b){data.active=b.dataset.active;category=T.template(active().key).category;$('template-search').value='';renderOptions();renderEditor();}};
$('add-product').onclick=()=>{if(data.products.length>=3)return;const id='ABC'.split('').find(id=>!data.products.some(p=>p.id===id));data.products.push(T.make(active().key,id));data.active=id;if(data.products.length===2)data.repeat=2;invalidate();refresh();toast('已添加'+id+'款，请为它选择外形');};
$('remove').onclick=()=>{if(data.products.length===1)return;data.products=data.products.filter(p=>p.id!==active().id).map((p,i)=>({...p,id:'ABC'[i]}));data.active=data.products[0].id;category=T.template(active().key).category;invalidate();refresh();};
for(const [k,id]of[['width','size-width'],['depth','size-depth'],['height','size-height']])$(id).oninput=()=>{const p=active(),t=T.template(p.key);p[k]=T.round(t[k]*Number($(id).value)/100);if(k==='width'&&T.circular(t))p.depth=p.width;invalidate();renderModel();};
$('product-name').onchange=e=>{active().name=e.target.value.trim()||T.template(active().key).name;renderEditor();};
$('colors').onclick=e=>{const b=e.target.closest('[data-color]');if(b){active().color=b.dataset.color;renderEditor();}};
$('stand').onchange=e=>{active().stand=e.target.checked;invalidate();};
$('scene-options').onclick=e=>{const b=e.target.closest('[data-scene]');if(!b)return;const s=T.scenes.find(s=>s.key===b.dataset.scene);if(data.environment!==s.key){data.environment=s.key;data.space=s.width;data.depth=s.depth;data.height=s.height;invalidate();}renderScenes();$('next').textContent='生成摆法 →';};
for(const [id,k]of[['space','space'],['scene-depth','depth'],['scene-height','height']])$(id).oninput=()=>{data[k]=Number($(id).value);invalidate();renderScenes();};
$('skip-environment').onclick=()=>{if(data.environment!==null){data.environment=null;invalidate();}go(3);};
document.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>go(+b.dataset.step));
$('next').onclick=()=>go(step+1);$('back').onclick=()=>go(step-1);$('edit-products').onclick=()=>go(1);document.querySelector('.brand').onclick=e=>{e.preventDefault();go(1);};
$('motif-options').onclick=e=>{const b=e.target.closest('[data-motif]');if(b){data.motif=b.dataset.motif;view=T.motif(data.motif).view;zoom=data.motif==='grid'?'all':'unit';data.stackConfirmed=false;renderPlan();$('diagram').scrollIntoView({behavior:'smooth',block:'center'});}};
$('count-controls').onclick=e=>{const b=e.target.closest('[data-count]');if(!b)return;const k=b.dataset.count;data[k]=Math.max(1,Math.min({columns:5,rows:4,repeat:3}[k],data[k]+Number(b.dataset.delta)));data.stackConfirmed=false;zoom='all';renderPlan();};
$('order-options').onclick=e=>{const b=e.target.closest('[data-order]');if(b){data.pattern=b.dataset.order;renderPlan();}};
$('composition-options').onclick=e=>{const b=e.target.closest('[data-composition]');if(b){data.composition=b.dataset.composition;data.stackConfirmed=false;zoom='all';if(data.composition==='quad')view='top';renderPlan();}};
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{view=b.dataset.view;renderPlan();});
document.querySelectorAll('[data-zoom]').forEach(b=>b.onclick=()=>{zoom=b.dataset.zoom;renderPlan();});
$('fit').onclick=()=>{const f=T.fit(data);if(f){Object.assign(data,f);data.stackConfirmed=false;renderPlan();toast('已减少分组用量；请再按实物检查');}};
$('stack-confirm').onchange=e=>{data.stackConfirmed=e.target.checked;renderPlan();};
$('reset').onclick=()=>{data=T.defaults();category='packaged';view='front';dirty=true;$('template-search').value='';refresh();go(1);};
$('help-open').onclick=()=>$('help').showModal();$('photo-open').onclick=()=>$('photos').showModal();document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$(b.dataset.close).close());
$('sources').innerHTML=T.templates.map(t=>{const s=T.sources[t.key];return '<article class="source"><h3>'+t.name+' <small>参考 '+t.width+' × '+t.depth+' × '+t.height+' cm</small></h3><p>'+esc(s.detail)+'</p>'+(s.url?'<a href="'+s.url+'" target="_blank" rel="noreferrer">'+esc(s.label)+'</a>':'<small>'+s.label+'</small>')+'</article>';}).join('');
$('photo-file').onchange=e=>{const f=e.target.files[0];if(!f)return;if(!['image/jpeg','image/png','image/webp'].includes(f.type)||f.size>10*1024*1024){e.target.value='';return toast('请选择10 MB以内的JPG、PNG或WebP图片');}if(photoUrl)URL.revokeObjectURL(photoUrl);photoUrl=URL.createObjectURL(f);$('photo').src=photoUrl;$('photo').hidden=false;e.target.value='';};
$('photo-clear').onclick=()=>{if(photoUrl)URL.revokeObjectURL(photoUrl);photoUrl='';$('photo').removeAttribute('src');$('photo').hidden=true;};
$('print').onclick=()=>window.print();
$('toggle-notes').onclick=()=>{const show=document.body.classList.toggle('show-notes');$('toggle-notes').textContent=show?'隐藏说明':'查看说明';$('toggle-notes').setAttribute('aria-expanded',show);};
$('save').onclick=()=>{const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));a.href=url;a.download='美术陈列方案.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$('import').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{if(f.size>100000)throw Error('文件过大');data=T.normalize(JSON.parse(await f.text()));category=T.template(active().key).category;view=T.motif(data.motif).view;dirty=false;$('template-search').value='';refresh();go(3);toast('已读取方案，照片仍仅留在当前页面');}catch(err){toast('读取失败：'+err.message);}finally{e.target.value='';}};
$('fresh-icon').innerHTML=svg(shape(T.template('apple'),14,17,31,32)+shape(T.template('leafy'),45,10,39,40),100,65);
$('packaged-icon').innerHTML=svg(shape(T.template('biscuit'),15,15,27,40)+shape(T.template('bottle'),49,3,21,53),100,65);
refresh();go(1);

