(() => {
  "use strict";

  const ROUND_COUNT = 4;
  const START_SCORE = 2000;
  const CORRECT_BONUS = 1000;
  const WRONG_PENALTY = 500;
  const STORAGE_KEY = "gamestreet:quiz:scores:v1";
  const NAME_KEY = "gamestreet:player:v1";

  const LOCATIONS = [
    {id:"trafalgar-london",city:"London",country:"Vương quốc Anh",file:"Trafalgar Square 360 Panorama, London - Jun 2009.jpg",author:"David Iliff",license:"CC BY-SA 3.0",hint:"Quảng trường Trafalgar, một không gian công cộng nổi tiếng ở trung tâm London."},
    {id:"times-square-nyc",city:"New York",country:"Hoa Kỳ",file:"20080910 Times Square, New York panorama.JPG",author:"Fod",license:"CC BY 2.5 DK",hint:"Times Square, khu giao lộ nổi tiếng với biển quảng cáo và ánh sáng ở Manhattan."},
    {id:"washingtonplatz-berlin",city:"Berlin",country:"Đức",file:"Berlin Washington Platz – 360° Panorama.jpg",author:"Maximilian Schönherr",license:"CC BY-SA 4.0",hint:"Washingtonplatz nằm cạnh Berlin Hauptbahnhof, nhà ga trung tâm của Berlin."},
    {id:"piazza-navona-rome",city:"Rome",country:"Ý",file:"Piazza Navona 360 panoramic view.jpg",author:"MatthiasKabel",license:"CC BY-SA 3.0",hint:"Piazza Navona là một quảng trường Baroque nổi tiếng tại Rome."},
    {id:"sydney-tower",city:"Sydney",country:"Úc",file:"Sydney Tower Panorama.jpg",author:"Gauthier Pelloquin",license:"CC BY-SA 3.0",hint:"Toàn cảnh khu trung tâm Sydney nhìn từ Sydney Tower."},
    {id:"louvre-paris",city:"Paris",country:"Pháp",file:"Louvre panosphere 20200303.jpg",author:"Daniel Kraft",license:"CC BY-SA 3.0",hint:"Khu vực bảo tàng Louvre và sân Napoléon ở trung tâm Paris."}
  ];

  const $ = id => document.getElementById(id);
  const screens = ["homeScreen","gameScreen","resultScreen","summaryScreen"];
  const state = {
    player:"Explorer",
    round:0,
    score:START_SCORE,
    answers:[],
    selectedLocations:[],
    selectedCity:null,
    dragging:false,
    dragStartX:0,
    dragStartOffset:50,
    panoOffset:50,
    locked:false
  };

  const commonsFileUrl = (file,width=4096) => `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(file)}?width=${width}`;
  const commonsPageUrl = file => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file).replace(/%20/g,"_")}`;

  function showScreen(id){
    screens.forEach(s => $(s).classList.toggle("hidden", s !== id));
    window.scrollTo({top:0,behavior:"instant"});
  }

  function shuffle(array){
    const copy=[...array];
    for(let i=copy.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [copy[i],copy[j]]=[copy[j],copy[i]];
    }
    return copy;
  }

  function sanitizeName(raw){
    return (raw||"").replace(/[<>]/g,"").replace(/\s+/g," ").trim().slice(0,20) || "Explorer";
  }

  function escapeHtml(value){
    return String(value).replace(/[&<>'"]/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[ch]));
  }

  function toast(message){
    const node=$("toast");
    node.textContent=message;
    node.classList.add("show");
    clearTimeout(node._timer);
    node._timer=setTimeout(()=>node.classList.remove("show"),2200);
  }

  function startGame(){
    state.player=sanitizeName($("playerName").value);
    localStorage.setItem(NAME_KEY,state.player);
    state.round=0;
    state.score=START_SCORE;
    state.answers=[];
    state.selectedCity=null;
    state.selectedLocations=shuffle(LOCATIONS).slice(0,ROUND_COUNT);
    showScreen("gameScreen");
    beginRound();
  }

  function beginRound(){
    state.selectedCity=null;
    state.locked=false;
    $("roundLabel").textContent=`${state.round+1} / ${ROUND_COUNT}`;
    $("scoreLabel").textContent=state.score.toLocaleString("vi-VN");
    $("submitAnswerBtn").disabled=true;
    $("submitAnswerBtn").textContent="CHỌN MỘT THÀNH PHỐ";

    const location=state.selectedLocations[state.round];
    const track=$("panoramaTrack");
    track.style.opacity=".18";
    state.panoOffset=15+Math.random()*70;
    track.style.backgroundPosition=`${state.panoOffset}% center`;
    track.style.backgroundImage=`url("${commonsFileUrl(location.file)}")`;

    const preload=new Image();
    preload.onload=()=>{track.style.opacity="1";};
    preload.onerror=()=>{track.style.opacity=".7";toast("Không tải được ảnh chất lượng cao. Hãy kiểm tra kết nối mạng.");};
    preload.src=commonsFileUrl(location.file);

    const credit=$("panoCredit");
    credit.href=commonsPageUrl(location.file);
    credit.textContent=`${location.author} · ${location.license} · Wikimedia Commons`;

    renderOptions(location);
  }

  function renderOptions(location){
    const decoys=shuffle(LOCATIONS.filter(x=>x.city!==location.city)).slice(0,3);
    const options=shuffle([location,...decoys]);
    $("cityOptions").innerHTML=options.map((item,index)=>`
      <button class="city-option" type="button" role="radio" aria-checked="false" data-city="${escapeHtml(item.city)}">
        <span class="option-letter">${String.fromCharCode(65+index)}</span>
        <span class="option-copy"><strong>${escapeHtml(item.city)}</strong><small>${escapeHtml(item.country)}</small></span>
        <span class="option-check">✓</span>
      </button>
    `).join("");

    document.querySelectorAll(".city-option").forEach(button=>{
      button.addEventListener("click",()=>selectCity(button.dataset.city));
    });
  }

  function selectCity(city){
    if(state.locked)return;
    state.selectedCity=city;
    document.querySelectorAll(".city-option").forEach(button=>{
      const active=button.dataset.city===city;
      button.classList.toggle("selected",active);
      button.setAttribute("aria-checked",active?"true":"false");
    });
    $("submitAnswerBtn").disabled=false;
    $("submitAnswerBtn").textContent="GỬI ĐÁP ÁN";
  }

  function submitAnswer(){
    if(state.locked||!state.selectedCity)return;
    state.locked=true;
    const location=state.selectedLocations[state.round];
    const correct=state.selectedCity===location.city;
    const delta=correct?CORRECT_BONUS:-WRONG_PENALTY;
    state.score=Math.max(0,state.score+delta);

    const result={
      location,
      selectedCity:state.selectedCity,
      correct,
      delta,
      scoreAfter:state.score
    };
    state.answers.push(result);
    showRoundResult(result);
  }

  function showRoundResult(result){
    showScreen("resultScreen");
    const correct=result.correct;
    $("resultMeta").textContent=`KẾT QUẢ LƯỢT ${state.round+1} / ${ROUND_COUNT}`;
    $("resultIcon").textContent=correct?"✓":"×";
    $("resultIcon").className=`result-icon ${correct?"success":"error"}`;
    $("resultTitle").textContent=correct?"Chúc mừng bạn!":"Bạn đã sai, rất tiếc!";
    $("resultMessage").textContent=correct
      ? `Bạn đã chọn đúng ${result.location.city}.`
      : `Bạn chọn ${result.selectedCity}. Kết quả đúng là ${result.location.city}. Bạn bị trừ điểm.`;
    $("correctCity").textContent=result.location.city;
    $("correctCountry").textContent=result.location.country;
    $("scoreDelta").textContent=correct?`+${CORRECT_BONUS.toLocaleString("vi-VN")}`:`−${WRONG_PENALTY.toLocaleString("vi-VN")}`;
    $("scoreDelta").className=correct?"score-good":"score-bad";
    $("scoreNow").textContent=result.scoreAfter.toLocaleString("vi-VN");
    $("roundFact").innerHTML=`${escapeHtml(result.location.hint)}<br><span>Ảnh: ${escapeHtml(result.location.author)} · ${escapeHtml(result.location.license)}</span>`;
    $("nextRoundBtn").innerHTML=state.round===ROUND_COUNT-1?"XEM TỔNG KẾT <span>→</span>":"LƯỢT TIẾP THEO <span>→</span>";
  }

  function nextRound(){
    state.round+=1;
    if(state.round>=ROUND_COUNT){
      finishGame();
      return;
    }
    showScreen("gameScreen");
    beginRound();
  }

  function getScores(){
    try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");}
    catch{return [];}
  }

  function saveScore(entry){
    const scores=getScores();
    scores.push(entry);
    scores.sort((a,b)=>b.score-a.score||b.correct-a.correct||new Date(b.date)-new Date(a.date));
    const trimmed=scores.slice(0,30);
    localStorage.setItem(STORAGE_KEY,JSON.stringify(trimmed));
    return trimmed;
  }

  function finishGame(){
    const correctCount=state.answers.filter(a=>a.correct).length;
    const previous=getScores();
    const previousBest=previous.filter(x=>x.player===state.player).reduce((best,x)=>Math.max(best,Number(x.score)||0),0);
    const entry={player:state.player,score:state.score,correct:correctCount,date:new Date().toISOString()};
    const scores=saveScore(entry);
    const rank=scores.findIndex(x=>x.date===entry.date&&x.player===entry.player)+1;
    const personalBest=Math.max(previousBest,state.score);

    $("summaryTitle").textContent=correctCount===4?"Xuất sắc — 4/4 thành phố!":correctCount>=3?"Khả năng nhận diện thành phố rất tốt!":correctCount>=2?"Bạn đã đi đúng nửa chặng đường!":"Thế giới vẫn còn nhiều thành phố để khám phá!";
    $("summarySub").textContent=`${state.player}, bạn đã hoàn thành đủ 4 lượt chơi.`;
    $("finalScore").textContent=state.score.toLocaleString("vi-VN");
    $("correctCount").textContent=`${correctCount} / ${ROUND_COUNT}`;
    $("personalBest").textContent=personalBest.toLocaleString("vi-VN");
    $("localRank").textContent=rank>0?`#${rank}`:"—";
    $("roundBreakdown").innerHTML=state.answers.map((answer,index)=>`
      <div class="round-chip ${answer.correct?"correct":"wrong"}">
        <span>L${index+1}</span>
        <strong>${answer.correct?"✓":"×"} ${escapeHtml(answer.location.city)}</strong>
      </div>
    `).join("");
    showScreen("summaryScreen");
    renderLeaderboard();
  }

  function renderLeaderboard(){
    const scores=getScores().slice(0,5);
    const list=$("leaderboardList");
    if(!scores.length){
      list.innerHTML=`<div class="empty-leaderboard">Chưa có điểm. Hãy trở thành người đầu tiên hoàn thành 4 lượt.</div>`;
      return;
    }
    list.innerHTML=scores.map((entry,index)=>{
      const when=new Date(entry.date).toLocaleDateString("vi-VN");
      return `<div class="score-row">
        <span class="score-rank">#${index+1}</span>
        <div><span class="score-name">${escapeHtml(entry.player)}</span><span class="score-meta">${Number(entry.correct)||0}/4 đúng · ${when}</span></div>
        <span class="score-points">${Number(entry.score).toLocaleString("vi-VN")}</span>
      </div>`;
    }).join("");
  }

  function quitGame(){
    if(!window.confirm("Thoát ván hiện tại? Bốn lượt của ván này sẽ không được lưu."))return;
    showScreen("homeScreen");
  }

  function installPanoramaDrag(){
    const viewport=$("panoramaViewport");
    const track=$("panoramaTrack");
    const getX=e=>e.touches?e.touches[0].clientX:e.clientX;

    const down=e=>{
      state.dragging=true;
      state.dragStartX=getX(e);
      state.dragStartOffset=state.panoOffset;
      viewport.classList.add("dragging");
    };
    const move=e=>{
      if(!state.dragging)return;
      const dx=getX(e)-state.dragStartX;
      state.panoOffset=state.dragStartOffset-dx/window.innerWidth*55;
      track.style.backgroundPosition=`${state.panoOffset}% center`;
    };
    const up=()=>{
      state.dragging=false;
      viewport.classList.remove("dragging");
    };

    viewport.addEventListener("mousedown",down);
    window.addEventListener("mousemove",move);
    window.addEventListener("mouseup",up);
    viewport.addEventListener("touchstart",down,{passive:true});
    viewport.addEventListener("touchmove",move,{passive:true});
    viewport.addEventListener("touchend",up,{passive:true});
  }

  $("startBtn").addEventListener("click",startGame);
  $("quitBtn").addEventListener("click",quitGame);
  $("submitAnswerBtn").addEventListener("click",submitAnswer);
  $("nextRoundBtn").addEventListener("click",nextRound);
  $("playAgainBtn").addEventListener("click",startGame);
  $("backHomeBtn").addEventListener("click",()=>showScreen("homeScreen"));
  $("howBtn").addEventListener("click",()=>$("howDialog").showModal());
  $("closeHowBtn").addEventListener("click",()=>$("howDialog").close());
  $("clearScoresBtn").addEventListener("click",()=>{
    if(window.confirm("Xóa toàn bộ bảng điểm trên thiết bị này?")){
      localStorage.removeItem(STORAGE_KEY);
      renderLeaderboard();
      toast("Đã xóa bảng điểm.");
    }
  });
  $("playerName").addEventListener("keydown",e=>{if(e.key==="Enter")startGame();});

  $("playerName").value=localStorage.getItem(NAME_KEY)||"";
  installPanoramaDrag();
  renderLeaderboard();
})();
