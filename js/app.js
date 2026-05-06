const DEFAULT_OWNER = "CodeWander-666";
const DEFAULT_REPO  = "kalkicore";
let owner = localStorage.getItem("kalki_owner") || DEFAULT_OWNER;
let repo  = localStorage.getItem("kalki_repo")  || DEFAULT_REPO;
let ghToken = sessionStorage.getItem("kalki_token") || "";
let totalPoints = parseInt(localStorage.getItem("kalki_points")||"0",10);
let workerActive = false;
let activeTasks = new Map();

const elPoints=document.getElementById("totalPoints"),elStatus=document.getElementById("statusBadge"),
      elLog=document.getElementById("logbox"),startBtn=document.getElementById("startBtn"),
      stopBtn=document.getElementById("stopBtn"),saveConfigBtn=document.getElementById("saveConfigBtn");

function updateUI(){elPoints.textContent=totalPoints;elStatus.textContent=workerActive?"ACTIVE":"IDLE";elStatus.className=`status ${workerActive?'active':'idle'}`;startBtn.disabled=workerActive;stopBtn.disabled=!workerActive}
function log(msg){const t=new Date().toLocaleTimeString();elLog.textContent+=`[${t}] ${msg}\n`;elLog.scrollTop=elLog.scrollHeight}
async function fetchTasks(){try{const r=await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/tasks.json`);if(!r.ok)throw new Error("HTTP "+r.status);return await r.json()}catch(e){log("Fetch: "+e.message);return null}}
function pickTask(tasks,skip){const p=tasks.pending||[];return p.find(t=>!skip.has(t.id))||null}
async function doTask(task){let h=0;const n=task.cost||50000000;for(let i=0;i<n;i++)h=(h+Math.random())%1e9;return{taskId:task.id,timestamp:new Date().toISOString(),hash:Math.floor(h).toString(16)}}
async function submitResult(taskId,result){if(!ghToken){log("No token");return}const body=`\`\`\`json\n${JSON.stringify(result)}\n\`\`\``;try{const r=await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`,{method:'POST',headers:{'Authorization':`token ${ghToken}`,'Content-Type':'application/json','Accept':'application/vnd.github.v3+json'},body:JSON.stringify({title:`[worker-result] ${taskId}`,body,labels:['worker-result']})});if(r.status===201){log("Submitted "+taskId);totalPoints+=10;localStorage.setItem("kalki_points",totalPoints);updateUI()}else{const e=await r.json();log("Fail: "+r.status+" "+JSON.stringify(e))}}catch(e){log("Err: "+e.message)}}
async function runSlot(id){while(workerActive){try{const t=await fetchTasks();if(!t){await new Promise(r=>setTimeout(r,10000));continue}const ids=new Set([...activeTasks.values()].map(v=>v?.taskId).filter(Boolean));const n=pickTask(t,ids);if(!n){log(`[${id}] No tasks`);await new Promise(r=>setTimeout(r,10000));continue}const p=(async()=>{log(`[${id}] Running ${n.id}`);const r=await doTask(n);await submitResult(n.id,r)})();activeTasks.set(id,{taskId:n.id,promise:p});await p;activeTasks.delete(id)}catch(e){log(`[${id}] ${e.message}`);await new Promise(r=>setTimeout(r,5000))}}}
function startWorkers(){if(!ghToken){log("Need token");return}workerActive=true;const c=parseInt(document.getElementById("concurrency").value,10)||1;updateUI();log(`Starting ${c} slot(s)`);for(let i=0;i<c;i++)runSlot(i)}
function stopWorkers(){workerActive=false;updateUI();log("Stopping…")}
function saveConfig(){owner=document.getElementById("repoOwner").value.trim()||DEFAULT_OWNER;repo=document.getElementById("repoName").value.trim()||DEFAULT_REPO;const t=document.getElementById("ghToken").value.trim();if(t){ghToken=t;sessionStorage.setItem("kalki_token",t)}localStorage.setItem("kalki_owner",owner);localStorage.setItem("kalki_repo",repo);log("Config saved: "+owner+"/"+repo);updateUI()}
document.addEventListener("DOMContentLoaded",()=>{document.getElementById("repoOwner").value=owner;document.getElementById("repoName").value=repo;if(ghToken)document.getElementById("ghToken").value=ghToken;saveConfigBtn.addEventListener("click",saveConfig);startBtn.addEventListener("click",startWorkers);stopBtn.addEventListener("click",stopWorkers);updateUI();log("Ready. Set token & target repo.")});
if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw/service-worker.js').catch(()=>{})})}
