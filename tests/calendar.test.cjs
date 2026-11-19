const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('dist/app.js','utf8');
const fn=source.slice(source.indexOf('function yearWeeks('),source.indexOf('function yearHTML('));
const yearWeeks=vm.runInNewContext(fn+';yearWeeks');
test('2026 includes all 53 ISO weeks, including year boundaries',()=>{
 const weeks=yearWeeks(2026);assert.equal(weeks.length,53);
 assert.equal(weeks[0].start.getFullYear(),2025);assert.equal(weeks[0].start.getDate(),29);
 assert.equal(weeks.at(-1).end.getFullYear(),2027);assert.equal(weeks.at(-1).end.getDate(),3);
});
test('weeks are consecutive Monday–Sunday and assigned once across all months',()=>{
 for(let year=2020;year<=2035;year++){
 const weeks=yearWeeks(year);assert.ok([52,53].includes(weeks.length));
 const seen=new Set();for(const w of weeks){assert.equal(w.start.getDay(),1);assert.equal(w.end.getDay(),0);assert.ok(w.month>=0&&w.month<12);assert.ok(!seen.has(w.start.toISOString()));seen.add(w.start.toISOString())}
 for(let i=1;i<weeks.length;i++){let d=new Date(weeks[i-1].end);d.setDate(d.getDate()+1);assert.equal(+d,+weeks[i].start)}
 }
});
test('app renders each view without runtime errors and preserves existing tasks',()=>{
 const nodes=new Map();const node=s=>{if(!nodes.has(s))nodes.set(s,{innerHTML:'',classList:{add(){},remove(){}},addEventListener(){},focus(){}});return nodes.get(s)};
 const seed={projects:[{id:'p',name:'Work',color:'#aabbcc',tone:'purple'}],tasks:[{id:'t',title:'Existing plan',date:'2026-11-19',time:'10:00',scope:'day',project:'p',done:false}]};
 const ctx=vm.createContext({document:{querySelector:node,querySelectorAll:()=>[],addEventListener(){}},localStorage:{getItem:()=>JSON.stringify(seed),setItem(){}},crypto:{randomUUID:()=>Math.random().toString()},setTimeout(){},clearTimeout(){},window:{},console});
 vm.runInContext(source,ctx);assert.match(node('#app').innerHTML,/year-grid/);
 for(const v of ['month','week','day','year']){vm.runInContext(`view='${v}';render()`,ctx);assert.ok(node('#app').innerHTML.length>1000)}
 assert.equal(vm.runInContext('data.tasks[0].title',ctx),'Existing plan');
});
function boot(raw){const nodes=new Map();let writes=0;const node=s=>{if(!nodes.has(s))nodes.set(s,{innerHTML:'',classList:{add(){},remove(){}},addEventListener(){},focus(){}});return nodes.get(s)};const ctx=vm.createContext({document:{querySelector:node,querySelectorAll:()=>[],addEventListener(){}},localStorage:{getItem:()=>raw,setItem(){writes++}},crypto:{randomUUID:()=>Math.random().toString()},setTimeout(){},clearTimeout(){},window:{},console});vm.runInContext(source,ctx);return {ctx,node,writes:()=>writes}}
test('new users start empty and see first-plan onboarding',()=>{const b=boot(null);assert.equal(vm.runInContext('data.tasks.length',b.ctx),0);assert.match(b.node('#app').innerHTML,/Create my first plan/);assert.equal(b.writes(),0)});
test('damaged saved calendars are not silently overwritten',()=>{const b=boot('{broken');assert.equal(vm.runInContext('storageIssue',b.ctx),true);vm.runInContext('save()',b.ctx);assert.equal(b.writes(),0);assert.match(b.node('#app').innerHTML,/Your changes are not saving/)});
test('backup validation rejects impossible dates, dangling projects, and duplicate IDs',()=>{const b=boot(null);for(const change of ["date:'2026-02-30'","project:'missing'","time:'25:00'"]){assert.throws(()=>vm.runInContext(`validateBackup({projects:defaultProjects,tasks:[{id:'a',title:'Test',date:'2026-01-01',time:'',project:'studio',scope:'day',${change}}]})`,b.ctx))}assert.throws(()=>vm.runInContext('validateBackup({projects:[],tasks:[]})',b.ctx))});
test('validated backup preserves plan notes and completion',()=>{const b=boot(null);const t=vm.runInContext("validateBackup({projects:defaultProjects,tasks:[{id:'a',title:'A plan',date:'2026-11-19',time:'09:00',project:'studio',scope:'day',notes:'Details',done:true}]}).tasks[0]",b.ctx);assert.equal(t.notes,'Details');assert.equal(t.done,true)});
test('year-view boot tolerates absent conditional controls',()=>{
 const nodes=new Map();const make=s=>{if(!nodes.has(s))nodes.set(s,{innerHTML:'',classList:{add(){},remove(){}},addEventListener(){},focus(){}});return nodes.get(s)};
 const root=make('#app');make('#modal-root');make('#toast');const select=s=>{if(['#app','#modal-root','#toast'].includes(s))return make(s);if(s.startsWith('#')&&!root.innerHTML.includes('id="'+s.slice(1)+'"'))return null;return make(s)};
 const ctx=vm.createContext({document:{querySelector:select,querySelectorAll:()=>[],addEventListener(){}},localStorage:{getItem:()=>null,setItem(){}},crypto:{randomUUID:()=>Math.random().toString()},setTimeout(){},clearTimeout(){},window:{},console});assert.doesNotThrow(()=>vm.runInContext(source,ctx));assert.match(root.innerHTML,/year-grid/)
});
