(()=>{const K="yamamobility_history";window.Yama={
history(){try{return JSON.parse(localStorage.getItem(K)||"[]")}catch(e){return[]}},
log(type,label,extra={}){const h=this.history(),day=new Date().toISOString().slice(0,10);if(!h.some(x=>x.day===day&&x.type===type&&x.label===label)){h.push({day,type,label,...extra});localStorage.setItem(K,JSON.stringify(h));}},
streak(){const days=[...new Set(this.history().map(x=>x.day))].sort().reverse();if(!days.length)return 0;let n=0,d=new Date();for(let i=0;i<400;i++){const k=d.toISOString().slice(0,10);if(days.includes(k)){n++;d.setDate(d.getDate()-1)}else if(i===0){d.setDate(d.getDate()-1)}else break}return n},
timer(sec,name){clearInterval(window._yt);let total=sec,left=sec,running=true,box=document.getElementById("yama-timer");if(!box){box=document.createElement("div");box.id="yama-timer";document.body.appendChild(box)}box.innerHTML='<div class="yt-card"><button id="yt-close" aria-label="Close timer">×</button><b id="yt-name"></b><strong id="yt-time"></strong><div class="yt-actions"><button id="yt-pause">PAUSE</button><button id="yt-reset">RESET</button><button id="yt-add">+15 SEC</button></div></div>';document.getElementById("yt-name").textContent=name;const draw=()=>{document.getElementById("yt-time").textContent=Math.floor(left/60)+":"+String(Math.max(0,left%60)).padStart(2,"0")};const tick=()=>{if(!running)return;left--;draw();if(left<=0){clearInterval(window._yt);running=false;box.classList.add("done");document.getElementById("yt-pause").textContent="DONE";if(navigator.vibrate)navigator.vibrate([250,120,250,120,400])}};draw();window._yt=setInterval(tick,1000);document.getElementById("yt-close").onclick=()=>{clearInterval(window._yt);box.remove()};document.getElementById("yt-pause").onclick=()=>{if(left<=0)return;running=!running;document.getElementById("yt-pause").textContent=running?"PAUSE":"RESUME"};document.getElementById("yt-reset").onclick=()=>{left=total;running=true;box.classList.remove("done");document.getElementById("yt-pause").textContent="PAUSE";draw()};document.getElementById("yt-add").onclick=()=>{left+=15;total+=15;running=true;box.classList.remove("done");document.getElementById("yt-pause").textContent="PAUSE";draw()}}
};
function addYamaTimers(){
 document.querySelectorAll(".exercise-item").forEach(row=>{
  if(row.querySelector(".yama-timer-btn"))return;
  const txt=row.textContent||"";
  const matches=[...txt.matchAll(/(\d+)\s*(sec|seconds|min|mins|minute|minutes)/ig)];
  if(!matches.length)return;
  const m=matches[matches.length-1],sec=Number(m[1])*(m[2].toLowerCase().startsWith("min")?60:1);
  const b=document.createElement("button");b.type="button";b.className="yama-timer-btn";b.textContent=(sec>=60?Math.round(sec/60)+"m":sec+"s");b.setAttribute("aria-label","Start "+sec+" second timer");
  b.addEventListener("click",ev=>{ev.preventDefault();ev.stopPropagation();Yama.timer(sec,(row.querySelector(".exercise-name")||row).textContent.trim())});
  row.appendChild(b);
 });
}
function initYama(){addYamaTimers();setTimeout(addYamaTimers,100);setTimeout(addYamaTimers,600);setTimeout(addYamaTimers,1500)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initYama);else initYama();
new MutationObserver(()=>addYamaTimers()).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener("change",e=>{if(!e.target.matches('input[type="checkbox"]'))return;setTimeout(()=>{const day=document.querySelector('[id^="day-cb-"]:checked');if(day){const n=(day.id.match(/\d+/)||[""])[0];Yama.log("mobility","Day "+n)}},0)});
if("serviceWorker"in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
})();