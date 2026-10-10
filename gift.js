"use strict";
(async () => {
  const root = document.getElementById("gift"), status = document.getElementById("gift-status");
  const claimToken = location.hash.slice(1);
  const recipientEntry = Boolean(claimToken || history.state?.giftRecipient);
  document.querySelector(".skip-link").addEventListener("click", event => {
    event.preventDefault(); document.getElementById("gift-main").focus();
  });
  window.addEventListener("hashchange", () => { if (location.hash) location.reload(); });
  history.replaceState(recipientEntry ? { giftRecipient: true } : null, "", location.pathname); // No capability or greeting in URL, history, or storage.
  if (recipientEntry) {
    document.body.classList.add("gift-recipient");
    document.getElementById("gift-title").textContent = "Танд бэлэг ирлээ 🎁";
    document.getElementById("gift-intro").textContent = "Өөртөө зориулах нэгэн тайван мөч. Танд зориулсан бэлгийг нээгээд үзээрэй.";
    status.textContent = "Бэлгийг тань шалгаж байна…";
  }
  let orderId = sessionStorage.getItem("jingeehas_gift_order") || "", busy = false;
  async function api(input) {
    const response = await fetch("/.netlify/functions/gift", { method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify(input) });
    const result = await response.json(); if (!response.ok) throw new Error(result.error); return result;
  }
  function text(tag, value) { const node=document.createElement(tag); node.textContent=value; root.append(node); return node; }
  function startRecipient(result) { sessionStorage.setItem("jingeehas_gift_assessment", result.assessmentId); location.assign(result.nextRoute); }
  function button(label, action) {
    const node=text("button",label); node.type="button"; node.className="button";
    node.onclick=async()=>{if(busy)return;busy=true;node.disabled=true;status.textContent="Түр хүлээнэ үү…";
      try{await action();status.textContent="";}catch(error){status.textContent=error.message==="gifting_unavailable"?"Бэлэглэх боломжийг хянаж байна. Одоогоор төлбөр авахгүй.":"Үйлдлийг дуусгаж чадсангүй. Холбоос ашиглагдсан эсвэл хүчингүй болсон байж болно. Шинэ холбоос авахын тулд бэлэг өгсөн хүнтэй холбогдоорой.";}
      finally{busy=false;if(node.isConnected)node.disabled=false;}};
    return node;
  }
  function renderRecipient(preview) {
    const stage = text("div", ""); stage.className = "gift-surprise";
    const artwork = document.createElement("div"); artwork.className = "gift-art"; artwork.setAttribute("aria-hidden", "true");
    for (const className of ["gift-spark gift-spark-one", "gift-spark gift-spark-two", "gift-spark gift-spark-three", "gift-box", "gift-lid", "gift-bow"]) {
      const part = document.createElement("span"); part.className = className; artwork.append(part);
    }
    stage.append(artwork);
    const open = document.createElement("button"); open.type = "button"; open.className = "button gift-open";
    open.textContent = "Бэлгээ нээх"; open.setAttribute("aria-expanded", "false"); open.setAttribute("aria-controls", "gift-greeting-panel"); stage.append(open);
    const hint = document.createElement("p"); hint.className = "gift-reveal-hint"; hint.textContent = "Нээж үзэхэд бэлгийг хүлээн авсанд тооцохгүй."; stage.append(hint);
    const panel = document.createElement("section"); panel.id = "gift-greeting-panel"; panel.className = "gift-greeting-panel"; panel.hidden = true;
    panel.setAttribute("aria-labelledby", "gift-greeting-title"); root.append(panel);
    const heading = document.createElement("h2"); heading.id = "gift-greeting-title"; heading.tabIndex = -1;
    heading.textContent = "Танд зориулсан мэндчилгээ"; panel.append(heading);
    const note = document.createElement("p"); note.className = "gift-greeting";
    note.textContent = typeof preview.note === "string" && preview.note.trim() ? preview.note : "Өөртөө цаг гаргаж, өөрийгөө илүү сайн ойлгох энэ мөч танд зориулагдлаа. Хүссэн үедээ, өөрийн хэмнэлээр эхлээрэй.";
    panel.append(note); // Plain text, including newlines; never HTML or sender identity.
    const invitation = document.createElement("p"); invitation.className = "gift-invitation";
    invitation.textContent = "Энэ бэлэг Jingeehas-ийн өөрийгөө таних үнэлгээг нэг удаа хийх боломж олгоно. Хүлээн авах эсэхээ та өөрөө шийднэ."; panel.append(invitation);
    const accept = button("Бэлгээ хүлээн авах", async () => {
      const result = await api({ action: "claim", token: claimToken, accept: true }); startRecipient(result);
    }); panel.append(accept);
    const later = document.createElement("a"); later.className = "gift-later"; later.textContent = "Одоохондоо хүлээн авахгүй"; later.href = "/"; panel.append(later);
    const privacy = text("p", "Таны хариулт, жин, эрүүл мэндийн мэдээлэл болон хувийн тайланг бэлэг өгсөн хүнд харуулахгүй."); privacy.className = "gift-recipient-privacy";
    open.onclick = () => {
      if (!panel.hidden) return;
      open.setAttribute("aria-expanded", "true"); stage.classList.add("is-open"); panel.hidden = false;
      document.getElementById("gift-intro").textContent = "Жижигхэн бэлэг. Өөртөө зориулах нэгэн тайван мөч.";
      open.hidden = true; hint.hidden = true; heading.focus({ preventScroll: true });
    };
  }
  async function showOrder(order) {
    orderId=order.orderId;sessionStorage.setItem("jingeehas_gift_order",orderId);root.replaceChildren();
    text("p",`Бэлэг: ${globalThis.JINGEEHAS_PRODUCT_CONFIG.PRODUCT.displayPrice}`);
    text("p",`Захиалгын лавлах: ${orderId}`);
    if(order.status==="claimed"){text("p","Бэлэг ашиглагдсан. Хүлээн авагчийн хувийн мэдээллийг харуулахгүй.");button("Өөр хүнд бэлэг авах",async()=>{sessionStorage.removeItem("jingeehas_gift_order");sessionStorage.removeItem("jingeehas_gift_request");location.assign("/gift.html");});return;}
    if(["paid","paid_review"].includes(order.status)){
      button("Бэлгээ сэргээх код хадгалах",async()=>{const result=await api({action:"recovery_key",orderId});
        let field=document.getElementById("gift-recovery-code");if(!field){field=text("input","");field.id="gift-recovery-code";field.readOnly=true;field.setAttribute("aria-label","Бэлэг сэргээх код");}
        field.value=result.recoveryCode;field.select();
        let download=document.getElementById("gift-recovery-download");if(!download){download=text("a","Сэргээх кодоо файл болгон хадгалах");download.id="gift-recovery-download";download.download="jingeehas-gift-recovery.txt";}
        if(download.href.startsWith("blob:"))URL.revokeObjectURL(download.href);
        download.href=URL.createObjectURL(new Blob([`Jingeehas gift recovery\nOrder: ${orderId}\nRecovery code: ${result.recoveryCode}\nKeep private. This does not provide recipient report access.\n`],{type:"text/plain"}));
      });text("p","Сэргээх кодоо хувийн, аюулгүй газар хадгална уу. Браузерын сесс дууссан үед ашиглаагүй бэлгийн шинэ холбоос авахад хэрэгтэй. Кодыг хүлээн авагчдаа бүү илгээгээрэй.");
    }
    if(order.status==="paid"){
      button("Хуваалцах шинэ холбоос авах",async()=>{const result=await api({action:"link",orderId});
        let field=document.getElementById("gift-link");if(!field){field=text("input","");field.id="gift-link";field.readOnly=true;field.setAttribute("aria-label","Бэлгийн холбоос");}
        field.value=location.origin+result.claimPath;field.select();
        let expiry=document.getElementById("gift-link-expiry");if(!expiry){expiry=text("p","");expiry.id="gift-link-expiry";}
        expiry.textContent=`Энэ холбоос ${result.linkDays || 30} хоног хүчинтэй. Ашиглаагүй бэлгийн эрхийн хугацаа дуусахгүй.`;
      });text("p","Холбоосыг зөвхөн хүлээн авагчдаа илгээнэ үү. Шинэ холбоос өмнөхийг хүчингүй болгоно. Холбоос хүчингүй болсон ч ашиглаагүй бэлэг хэвээр үлдэнэ. Холбоосоо хуваалцахын өмнө сэргээх кодоо хадгалаарай.");return;
    }
    if(order.status==="pending"){
      if(order.qrImage){const img=text("img","");img.alt="QPay төлбөрийн QR";img.src=`data:image/png;base64,${order.qrImage}`;img.width=240;}
      for(const item of order.urls||[]){const a=text("a",item.description||item.name||"QPay");a.href=item.link;a.rel="noreferrer noopener";a.className="button secondary";}
      button("Төлбөр шалгах",async()=>showOrder(await api({action:"check",orderId})));
      text("p","QPay төлбөрийг баталгаажуулсны дараа бэлгийн холбоос үүснэ.");
      button("Захиалгыг зогсоох хүсэлт",async()=>showOrder(await api({action:"cancel",orderId})));return;
    }
    if(order.status==="paid_review")text("p","Төлбөр бүртгэгдсэн байна. Төлбөрийн бүртгэлийг дэмжлэгээр шалгуулж шийдвэрлүүлнэ. Бэлгийн эрх олгоогүй бөгөөд дахин төлбөр хийх шаардлагагүй.");
    else if(order.status==="canceled")text("p","Захиалгыг зогсоох хүсэлт бүртгэгдсэн. QPay нэхэмжлэх хаагдсан эсэхийг дэмжлэгээр шалгуулна уу. Дахин төлбөр бүү хийгээрэй.");
    else if(order.status==="closed_unpaid")text("p","Нэхэмжлэх хаагдсан бөгөөд төлбөргүй болохыг шалгасан байна.");
    else text("p","Нэхэмжлэхийн төлөвийг шалгах шаардлагатай. Дахин нэхэмжлэх эсвэл төлбөр бүү үүсгээрэй.");
    const support=text("a","Захиалгын лавлахаар дэмжлэг авах");support.href="/support";
    button("Захиалгын төлөв шинэчлэх",async()=>showOrder(await api({action:"check",orderId})));
  }
  function renderPurchase() {
    text("h2",`Нэг хүнд бэлэглэх — ${globalThis.JINGEEHAS_PRODUCT_CONFIG.PRODUCT.displayPrice}`);
      const label=text("label","Урам өгөх зурвас (заавал биш)");const note=text("textarea","");note.id="gift-note";note.maxLength=280;label.htmlFor=note.id;
      text("p","Хүлээн авагчийн имэйл шаардлагагүй. Төлбөр баталгаажсаны дараа холбоосоо өөрөө хуваалцана.");
      button("QPay-ээр бэлэг авах",async()=>{let requestKey=sessionStorage.getItem("jingeehas_gift_request");if(!requestKey){requestKey=crypto.randomUUID();sessionStorage.setItem("jingeehas_gift_request",requestKey);}await showOrder(await api({action:"create",requestKey,note:note.value}));});
  }
  try {
    if (recipientEntry && !claimToken) {
      status.textContent = "Бэлгийн холбоосоо дахин нээгээрэй. Нууцлалыг хамгаалахын тулд холбоосын кодыг энэ хуудсанд хадгалдаггүй. Бэлгийг харах эсвэл нээхэд хүлээн авсанд тооцохгүй.";
      document.getElementById("gift-intro").textContent = "Өмнө ирсэн бэлгийн холбоосоороо үргэлжлүүлж болно.";
      return;
    }
    await fetch("/.netlify/functions/weight-session-start",{method:"POST",headers:{"content-type":"application/json"},body:"{}"}).then(r=>{if(!r.ok)throw new Error("session");});
    if(claimToken){const preview=await api({action:"preview",token:claimToken});if(preview.claimed){startRecipient(preview);return;}renderRecipient(preview); status.textContent="";
    }else if(orderId || sessionStorage.getItem("jingeehas_gift_request")){
      try{await showOrder(await api({action:"status",orderId,requestKey:sessionStorage.getItem("jingeehas_gift_request")}));}
      catch(error){if(error.message==="gift_unavailable")renderPurchase();else throw error;}
    }
    else renderPurchase();
  }catch{if(recipientEntry){document.getElementById("gift-title").textContent="Бэлгийн холбоосыг шалгаарай";document.getElementById("gift-intro").textContent="Энэ холбоосын хугацаа дууссан, ашиглагдсан эсвэл хүчингүй болсон байж болно. Ашиглаагүй бэлэг хэвээр үлдэнэ. Шинэ холбоос авахын тулд бэлэг өгсөн хүнтэй холбогдоорой.";}status.textContent="Бэлгийн холбоос эсвэл сессийг нээж чадсангүй. Шинэ холбоос авах эсвэл өмнөх браузераасаа үргэлжлүүлнэ үү.";}
    if(!recipientEntry){
      text("h2","Өмнө авсан бэлгээ сэргээх");const recovery=text("input","");recovery.setAttribute("aria-label","Хадгалсан сэргээх код");recovery.autocomplete="off";
      button("Сэргээх кодоор үргэлжлүүлэх",async()=>showOrder(await api({action:"recover",recoveryCode:recovery.value.trim()})));
    }
})();
