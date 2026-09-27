(()=>{const K="yamamobility_history";window.Yama={
history(){try{return JSON.parse(localStorage.getItem(K)||"[]")}catch(e){return[]}},
log(type,label,extra={}){const h=this.history(),day=new Date().toISOString().slice(0,10);if(!h.some(x=>x.day===day&&x.type===type&&x.label===label)){h.push({day,type,label,...extra});localStorage.setItem(K,JSON.stringify(h));}},
streak(){const days=[...new Set(this.history().map(x=>x.day))].sort().reverse();if(!days.length)return 0;let n=0,d=new Date();for(let i=0;i<400;i++){const k=d.toISOString().slice(0,10);if(days.includes(k)){n++;d.setDate(d.getDate()-1)}else if(i===0){d.setDate(d.getDate()-1)}else break}return n},
timer(sec,name,anchor){clearInterval(window._yt);let total=sec,left=sec,running=true,old=document.getElementById("yama-inline-timer");if(old)old.remove();const row=anchor&&anchor.closest?anchor.closest(".exercise-item"):null;if(!row)return;anchor.style.display="none";const box=document.createElement("span");box.id="yama-inline-timer";box.style.cssText="display:inline-flex;align-items:center;gap:4px;vertical-align:middle;width:0;max-width:0;opacity:0;overflow:hidden;white-space:nowrap;transition:max-width .28s ease,opacity .2s ease;margin-left:0";box.innerHTML='<strong id="yt-time" style="font-size:.85rem;color:#38bdf8;min-width:36px;text-align:center"></strong><button id="yt-pause">PAUSE</button><button id="yt-add">+15</button><button id="yt-close">×</button>';box.querySelectorAll("button").forEach(x=>x.style.cssText="border:1px solid #38bdf8;background:#0f172a;color:#fff;border-radius:6px;padding:4px 5px;font-size:.62rem;font-weight:800;line-height:1");anchor.insertAdjacentElement("afterend",box);requestAnimationFrame(()=>requestAnimationFrame(()=>{box.style.maxWidth="190px";box.style.width="190px";box.style.opacity="1";box.style.marginLeft="4px"}));const time=box.querySelector("#yt-time"),pause=box.querySelector("#yt-pause");const draw=()=>{time.textContent=Math.floor(left/60)+":"+String(Math.max(0,left%60)).padStart(2,"0")};const tick=()=>{if(!running)return;left--;draw();if(left<=0){clearInterval(window._yt);running=false;pause.textContent="DONE";if(navigator.vibrate)navigator.vibrate([300,120,300,120,600])}};draw();window._yt=setInterval(tick,1000);box.querySelector("#yt-close").onclick=()=>{clearInterval(window._yt);box.style.width="0";box.style.maxWidth="0";box.style.opacity="0";box.style.marginLeft="0";setTimeout(()=>{box.remove();anchor.style.display=""},290)};pause.onclick=()=>{if(left<=0)return;running=!running;pause.textContent=running?"PAUSE":"RESUME"};box.querySelector("#yt-add").onclick=()=>{left+=15;total+=15;running=true;pause.textContent="PAUSE";draw()}}
};
function addYamaTimers(){
 document.querySelectorAll(".exercise-item").forEach(row=>{
  if(row.querySelector(".yama-timer-btn"))return;
  const txt=((row.querySelector(".exercise-prescription")||row).textContent)||"";
  const matches=[...txt.matchAll(/(\d+)\s*(sec|seconds|min|mins|minute|minutes)/ig)];
  if(!matches.length)return;
  const m=matches[matches.length-1],sec=Number(m[1])*(m[2].toLowerCase().startsWith("min")?60:1);
  const b=document.createElement("button");b.type="button";b.className="yama-timer-btn";b.textContent=(sec>=60?Math.round(sec/60)+"m":sec+"s");b.setAttribute("aria-label","Start "+sec+" second timer");
  b.addEventListener("click",ev=>{ev.preventDefault();ev.stopPropagation();Yama.timer(sec,(row.querySelector(".exercise-name")||row).textContent.trim(),b)});
  row.appendChild(b);
 });
}
function initYama(){addYamaTimers();setTimeout(addYamaTimers,100);setTimeout(addYamaTimers,600);setTimeout(addYamaTimers,1500)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initYama);else initYama();
new MutationObserver(()=>addYamaTimers()).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener("change",e=>{if(!e.target.matches('input[type="checkbox"]'))return;setTimeout(()=>{const day=document.querySelector('[id^="day-cb-"]:checked');if(day){const n=(day.id.match(/\d+/)||[""])[0];Yama.log("mobility","Day "+n)}},0)});
if("serviceWorker"in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
})();