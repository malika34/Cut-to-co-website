/* TODO: Edit this array to add projects. Replace each image/video URL with your own work. */
const portfolioVideo = path => encodeURI(`assets/${path}`);
const projects = [
  {title:"1",category:"All",displayCategory:"Business Corporate",client:"Before vs After",video:portfolioVideo("all reels/1.mp4"),reel:true,color:"#c6ff3d"},
  {title:"2",category:"All",displayCategory:"Business Corporate",client:"Before vs After",video:portfolioVideo("all reels/2.mp4"),reel:true,color:"#ff2e93"},
  {title:"3",category:"All",displayCategory:"Real Estate",client:"Before vs After",video:portfolioVideo("all reels/3.mp4"),reel:true,color:"#22d3ee"},
  {title:"4",category:"All",displayCategory:"Real Estate",client:"Before vs After",video:portfolioVideo("all reels/4.mp4"),reel:true,color:"#7c3aed"},
  {title:"5",category:"All",displayCategory:"Real Estate",client:"Before vs After",video:portfolioVideo("all reels/5.mp4"),reel:true,color:"#c6ff3d"},
  {title:"6",category:"All",displayCategory:"Real Estate",client:"Before vs After",video:portfolioVideo("all reels/6.mp4"),reel:true,color:"#ff2e93"},
  {title:"7",category:"All",displayCategory:"UGC Ads",client:"Before vs After",video:portfolioVideo("all reels/7.mp4"),reel:true,color:"#22d3ee"},
  {title:"Gulf Cost",category:"Real Estate",client:"Edited reel",clientType:"International Client",video:portfolioVideo("edited reels/Gulf Cost.mp4"),reel:true,color:"#c6ff3d"},
  {title:"Faiz Residency",category:"Real Estate",client:"Edited reel",clientType:"National Client",video:portfolioVideo("edited reels/Faiz Residency.mp4"),reel:true,color:"#7c3aed"},
  {title:"Merner Field",category:"Real Estate",client:"Edited reel",clientType:"International Client",video:portfolioVideo("edited reels/Merner Field.mp4"),reel:true,color:"#22d3ee"},
  {title:"360 Marketing Hub",category:"Real Estate",client:"Edited reel",clientType:"National Client",video:portfolioVideo("edited reels/360 Marketing Hub.mp4"),reel:true,color:"#ff2e93"},
  {title:"David Clark",category:"Business",client:"Talking Head",video:portfolioVideo("edited reels/David Clark.mp4"),reel:true,color:"#c6ff3d"},
  {title:"Daryl Johnson",category:"Business",client:"Talking Head",video:portfolioVideo("edited reels/Daryl Johnson.mp4"),reel:true,color:"#22d3ee"},
  {title:"My UGC Ad",category:"UGC Ads",client:"UGC Ad",video:portfolioVideo("edited reels/My UGC Ad.mp4"),reel:true,color:"#ff2e93"}
];
const services=[
  ["▷","Reels & Social Content","Quick, engaging edits with strong hooks, clean pacing and captions for your platform."],
  ["◉","E-commerce & Product Ads","Show the product, tell its story and make the key message easy to remember."],
  ["✦","Brand & Promotional Videos","Shape your footage into a polished story that introduces your brand or idea."],
  ["◫","Talking-Head & UGC","Keep creator-led and business videos natural, clear and watchable."],
  ["⌂","Real Estate & Property","Highlight a space with considered pacing, clear details and a smooth walkthrough."],
  ["✳","Custom Editing Styles","From short-form cuts to longer edits, the style follows your brief."]
];
const categories=["All","Real Estate","Business","UGC Ads"];
const grid=document.querySelector("#projectGrid"),filters=document.querySelector(".filters");
const reelControls=document.querySelector("#reelControls"),reelCounter=document.querySelector("#reelCounter");
const swipeHint=document.querySelector("#swipeHint");
const carouselIndices=Object.fromEntries(categories.map(category=>[category,0]));
let currentFilter="All";
let carouselTouchStart=null,suppressProjectClick=false;
const projectVideoObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  const video=entry.target;
  if(entry.isIntersecting){
    if(!video.src)video.src=video.dataset.src;
    video.play().catch(()=>{});
  }else video.pause();
}),{rootMargin:"120px"});
function projectCategoryLabel(project){
  return project.displayCategory||project.category;
}
function projectMedia(project,modal=false,loading="lazy"){
  const category=projectCategoryLabel(project);
  if(project.video){
    const poster=project.image?`poster="${project.image}"`:"";
    return modal
      ? `<video src="${project.video}" ${poster} controls controlslist="nodownload" playsinline preload="metadata"></video>`
      : `<video class="project-video" data-src="${project.video}" ${poster} muted loop playsinline preload="none" aria-label="${project.title} — ${category}"></video>`;
  }
  return `<img src="${project.image}" alt="${project.title} — ${category}" loading="${loading}">`;
}
function projectsForFilter(filter){
  return projects.filter(project=>filter==="All"?project.category==="All":project.category===filter);
}
function renderProjects(filter="All"){
  grid.querySelectorAll(".project-video").forEach(video=>{
    projectVideoObserver.unobserve(video);
    video.pause();
    video.removeAttribute("src");
    video.load();
  });
  grid.dataset.filter=filter;
  const filteredProjects=projectsForFilter(filter);
  const currentIndex=carouselIndices[filter];
  const project=filteredProjects[currentIndex];
  const previousProject=filteredProjects[currentIndex-1];
  const nextProject=filteredProjects[currentIndex+1];
  grid.dataset.carousel="portrait";
  reelControls.hidden=false;
  swipeHint.hidden=false;
  reelCounter.textContent=`${currentIndex+1} / ${filteredProjects.length}`;
  const previousButton=reelControls.querySelector('[data-reel-direction="-1"]');
  const nextButton=reelControls.querySelector('[data-reel-direction="1"]');
  previousButton.disabled=currentIndex===0;
  nextButton.disabled=currentIndex===filteredProjects.length-1;
  previousButton.setAttribute("aria-label","Previous project");
  nextButton.setAttribute("aria-label","Next project");
  const previewCard=(preview,direction)=>preview
    ? `<article class="project project-peek project-peek-${direction}" role="button" tabindex="0" data-carousel-index="${currentIndex+(direction==="prev"?-1:1)}" aria-label="Show ${direction==="prev"?"previous":"next"} project: ${preview.title}"><div class="project-media">${preview.video?`<video class="project-video" data-src="${preview.video}" ${preview.image?`poster="${preview.image}"`:""} muted loop playsinline preload="none" aria-label="Preview: ${preview.title}"></video>`:`<img src="${preview.image}" alt="" loading="lazy">`}</div><span>${direction==="prev"?"PREVIOUS":"UP NEXT"}</span><h3>${preview.title}</h3></article>`
    : '<div class="carousel-spacer" aria-hidden="true"></div>';
  const clientType=project.clientType
    ? `<p class="client-type ${project.clientType==="International Client"?"client-type-international":"client-type-national"}">${project.clientType}</p>`
    : `<p>${project.client}</p>`;
  grid.innerHTML=`${previewCard(previousProject,"prev")}<article class="project project-current ${project.reel?"reel":""}" tabindex="0" data-index="${projects.indexOf(project)}"><div class="project-media">${projectMedia(project,false,"eager")}</div><div class="project-info"><div><h3>${project.title}</h3>${clientType}</div><span class="project-tag">${projectCategoryLabel(project)}</span></div></article>${previewCard(nextProject,"next")}`;
  grid.querySelectorAll(".project-video").forEach(video=>projectVideoObserver.observe(video));
}
filters.innerHTML=categories.map((c,i)=>`<button class="filter ${i===0?"active":""}" role="tab" aria-selected="${i===0}" data-filter="${c}">${c}</button>`).join("");
renderProjects();
filters.addEventListener("click",e=>{const b=e.target.closest(".filter");if(!b)return;document.querySelectorAll(".filter").forEach(x=>{x.classList.toggle("active",x===b);x.setAttribute("aria-selected",x===b)});currentFilter=b.dataset.filter;carouselIndices[currentFilter]=0;renderProjects(currentFilter)});
reelControls.addEventListener("click",e=>{
  const button=e.target.closest("[data-reel-direction]");
  if(!button)return;
  const filteredCount=projectsForFilter(currentFilter).length;
  carouselIndices[currentFilter]=Math.max(0,Math.min(filteredCount-1,carouselIndices[currentFilter]+Number(button.dataset.reelDirection)));
  renderProjects(currentFilter);
});
grid.addEventListener("touchstart",e=>{
  if(e.touches.length!==1)return;
  const touch=e.touches[0];
  carouselTouchStart={x:touch.clientX,y:touch.clientY};
},{passive:true});
grid.addEventListener("touchmove",e=>{
  if(!carouselTouchStart||e.touches.length!==1)return;
  const touch=e.touches[0],deltaX=touch.clientX-carouselTouchStart.x,deltaY=touch.clientY-carouselTouchStart.y;
  if(Math.abs(deltaX)>Math.abs(deltaY)*1.2)e.preventDefault();
},{passive:false});
grid.addEventListener("touchend",e=>{
  if(!carouselTouchStart)return;
  const touch=e.changedTouches[0];
  const deltaX=touch.clientX-carouselTouchStart.x,deltaY=touch.clientY-carouselTouchStart.y;
  carouselTouchStart=null;
  if(Math.abs(deltaX)<45||Math.abs(deltaX)<Math.abs(deltaY)*1.2)return;
  e.preventDefault();
  suppressProjectClick=true;
  window.setTimeout(()=>{suppressProjectClick=false},500);
  const direction=deltaX<0?1:-1;
  const filteredCount=projectsForFilter(currentFilter).length;
  carouselIndices[currentFilter]=Math.max(0,Math.min(filteredCount-1,carouselIndices[currentFilter]+direction));
  renderProjects(currentFilter);
},{passive:false});
grid.addEventListener("touchcancel",()=>{
  carouselTouchStart=null;
});
const serviceGrid=document.querySelector("#serviceGrid");
serviceGrid.innerHTML=services.map((s,i)=>`<article class="service" data-index="0${i+1}"><span class="icon">${s[0]}</span><h3>${s[1]}</h3><p>${s[2]}</p></article>`).join("");
const clips=document.querySelector("#timelineClips");
clips.innerHTML=projects.slice(0,7).map((p,i)=>`<div class="clip" style="--clip:${12+i%3*5}%;--color:${p.color}">${p.title.toUpperCase()}</div>`).join("");
const playhead=document.querySelector("#playhead"),timeline=document.querySelector("#timeline"),timelineTime=document.querySelector("#timelineTime");
function scrub(clientX){const r=timeline.getBoundingClientRect(),left=r.left+timeline.clientLeft,width=timeline.clientWidth,pct=Math.max(0,Math.min(1,(clientX-left)/width));playhead.style.left=`${pct*100}%`;timelineTime.textContent=`00:00:${String(Math.round(pct*58)).padStart(2,"0")}:${String(Math.round(pct*24)).padStart(2,"0")}`}
let dragging=false;
timeline.addEventListener("pointerdown",e=>{
  if(e.button!==0&&e.pointerType==="mouse")return;
  dragging=true;
  timeline.setPointerCapture(e.pointerId);
  scrub(e.clientX);
});
window.addEventListener("pointermove",e=>dragging&&scrub(e.clientX));
window.addEventListener("pointerup",()=>dragging=false);
window.addEventListener("pointercancel",()=>dragging=false);
const modal=document.querySelector("#projectModal"),modalContent=document.querySelector("#modalContent");
function showProject(index){
  const project=projects[index],category=projectCategoryLabel(project);
  const title=project.category==="All"?"Before vs After":project.title;
  const description=project.category==="All"
    ? "See the original footage transformed into the final edit."
    : `${category} portfolio reel`;
  const clientType=project.clientType
    ? `<span class="modal-project-client ${project.clientType==="International Client"?"client-type-international":"client-type-national"}">${project.clientType}</span>`
    : "";
  modalContent.innerHTML=`<div class="modal-project">${projectMedia(project,true)}<div class="modal-project-details"><div class="modal-project-badges"><span class="modal-project-category">${category}</span>${clientType}</div><h2>${title}</h2><p>${description}</p></div></div>`;
  modal.showModal();
}
function handleProjectActivation(e){
  if(suppressProjectClick){
    e.preventDefault();
    return;
  }
  const preview=e.target.closest(".project-peek");
  if(preview){
    const nextIndex=Number(preview.dataset.carouselIndex);
    carouselIndices[currentFilter]=nextIndex;
    renderProjects(currentFilter);
    return;
  }
  const card=e.target.closest(".project-current, .project:not(.project-peek)");
  if(card)showProject(card.dataset.index);
}
grid.addEventListener("click",handleProjectActivation);
grid.addEventListener("keydown",e=>{
  if(e.key!=="Enter"&&e.key!==" ")return;
  const card=e.target.closest(".project-peek");
  if(card){
    e.preventDefault();
    handleProjectActivation(e);
  }else if(e.key==="Enter"){
    const current=e.target.closest(".project-current, .project:not(.project-peek)");
    if(current)showProject(current.dataset.index);
  }
});
reelControls.addEventListener("keydown",e=>{
  if(e.key!=="ArrowLeft"&&e.key!=="ArrowRight")return;
  e.preventDefault();
  const direction=e.key==="ArrowLeft"?-1:1;
  const filteredCount=projectsForFilter(currentFilter).length;
  const nextIndex=Math.max(0,Math.min(filteredCount-1,carouselIndices[currentFilter]+direction));
  if(nextIndex===carouselIndices[currentFilter])return;
  carouselIndices[currentFilter]=nextIndex;
  renderProjects(currentFilter);
});
document.querySelectorAll(".modal-close").forEach(b=>b.addEventListener("click",()=>b.parentElement.close()));
document.querySelectorAll("dialog").forEach(d=>{
  d.addEventListener("click",e=>{if(e.target===d)d.close()});
  d.addEventListener("close",()=>d.querySelectorAll("video").forEach(video=>video.pause()));
});
const form=document.querySelector("#contactForm"),status=document.querySelector(".form-status");
const whatsappNumber="923293009274";
document.querySelectorAll(".price-cta").forEach(button=>button.addEventListener("click",()=>{
  const budget=form.elements.namedItem("budget");
  budget.value=button.dataset.budget;
  document.querySelector("#contact").scrollIntoView({behavior:"smooth",block:"start"});
  status.textContent=`${button.dataset.budget} selected. Tell us a little about your project.`;
  window.setTimeout(()=>budget.focus({preventScroll:true}),450);
}));
form.addEventListener("submit",e=>{
  e.preventDefault();
  if(!form.checkValidity()){
    status.textContent="Please complete the highlighted fields.";
    form.reportValidity();
    return;
  }
  const formData=new FormData(form);
  const brief=[
    "Hi Cut to Co! I'd like to discuss a project.",
    `Name: ${formData.get("name")}`,
    `Project type: ${formData.get("type")}`,
    formData.get("budget")?`Budget: ${formData.get("budget")}`:"",
    `Brief: ${formData.get("message")}`
  ].filter(Boolean).join("\n");
  const whatsappUrl=`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(brief)}`;
  const fallbackLink=document.createElement("a");
  fallbackLink.href=whatsappUrl;
  fallbackLink.target="_blank";
  fallbackLink.rel="noopener noreferrer";
  fallbackLink.textContent="Open WhatsApp to send your project details.";
  status.replaceChildren(document.createTextNode("Your project details are ready. "),fallbackLink);
  window.open(whatsappUrl,"_blank","noopener,noreferrer");
});
const menu=document.querySelector(".menu-toggle"),nav=document.querySelector(".nav nav");menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",open)});nav.addEventListener("click",()=>nav.classList.remove("open"));
const cursor=document.querySelector(".cursor");window.addEventListener("pointermove",e=>{cursor.style.left=e.clientX+"px";cursor.style.top=e.clientY+"px"});document.addEventListener("pointerover",e=>{const play=e.target.closest(".cursor-play"),view=e.target.closest(".project");cursor.classList.toggle("active",!!(play||view));cursor.dataset.label=play?"PLAY":view?"VIEW":""});
document.querySelectorAll(".magnetic").forEach(el=>{el.addEventListener("pointermove",e=>{if(matchMedia("(pointer: fine)").matches){const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.12}px,${(e.clientY-r.top-r.height/2)*.12}px)`}});el.addEventListener("pointerleave",()=>el.style.transform="")});
const counterObs=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,end=+el.dataset.count;let start=null;function tick(t){start??=t;const n=Math.min(end,Math.floor((t-start)/900*end));el.textContent=n+(end===120?"+":"");if(n<end)requestAnimationFrame(tick)}requestAnimationFrame(tick);counterObs.unobserve(el)}),{threshold:.6});document.querySelectorAll("[data-count]").forEach(x=>counterObs.observe(x));
let n=0;const count=document.querySelector("#loadCount"),bar=document.querySelector(".load-track i");const loader=setInterval(()=>{n+=4;count.textContent=String(Math.min(n,100)).padStart(2,"0");bar.style.width=Math.min(n,100)+"%";if(n>=100){clearInterval(loader);document.querySelector(".preloader").classList.add("done")}},28);
