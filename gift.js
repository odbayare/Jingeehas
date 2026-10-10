"use strict";
(async () => {
  const root = document.getElementById("gift"), status = document.getElementById("gift-status");
  const claimToken = location.hash.slice(1);
  window.addEventListener("hashchange", () => { if (location.hash) location.reload(); });
  history.replaceState(null, "", location.pathname); // Remove before any application analytics can run.
  let orderId = sessionStorage.getItem("jingeehas_gift_order") || "", busy = false;
  async function api(input) {
    const response = await fetch("/.netlify/functions/gift", { method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify(input) });
    const result = await response.json(); if (!response.ok) throw new Error(result.error); return result;
  }
  function text(tag, value) { const node=document.createElement(tag); node.textContent=value; root.append(node); return node; }
  function button(label, action) {
    const node=text("button",label); node.type="button"; node.className="button";
    node.onclick=async()=>{if(busy)return;busy=true;node.disabled=true;status.textContent="Түр хүлээнэ үү…";
      try{await action();status.textContent="";}catch(error){status.textContent=error.message==="gifting_unavailable"?"Бэлэглэх боломжийг хянаж байна. Одоогоор төлбөр авахгүй.":"Үйлдлийг дуусгаж чадсангүй. Холбоос ашиглагдсан эсвэл хүчингүй болсон байж болно. Шинэ холбоос авахын тулд бэлэг өгсөн хүнтэй холбогдоорой.";}
      finally{busy=false;if(node.isConnected)node.disabled=false;}};
  }
  async function showOrder(order) {
    orderId=order.orderId;sessionStorage.setItem("jingeehas_gift_order",orderId);root.replaceChildren();
    text("p",`Бэлэг: ${globalThis.JINGEEHAS_PRODUCT_CONFIG.PRODUCT.displayPrice}`);
    if(order.status==="claimed"){text("p","Бэлэг ашиглагдсан. Хүлээн авагчийн хувийн мэдээллийг харуулахгүй.");button("Өөр хүнд бэлэг авах",async()=>{sessionStorage.removeItem("jingeehas_gift_order");sessionStorage.removeItem("jingeehas_gift_request");location.assign("/gift.html");});return;}
    if(["paid","claimed"].includes(order.status)){
      button("Бэлгээ сэргээх код хадгалах",async()=>{const result=await api({action:"recovery_key",orderId});
        let field=document.getElementById("gift-recovery-code");if(!field){field=text("input","");field.id="gift-recovery-code";field.readOnly=true;field.setAttribute("aria-label","Бэлэг сэргээх код");}
        field.value=result.recoveryCode;field.select();
      });text("p","Сэргээх кодоо хувийн, аюулгүй газар хадгална уу. Браузерын сесс дууссан үед ашиглаагүй бэлгийн шинэ холбоос авахад хэрэгтэй. Кодыг хүлээн авагчдаа бүү илгээгээрэй.");
    }
    if(order.status==="paid"){
      button("Хуваалцах шинэ холбоос авах",async()=>{const result=await api({action:"link",orderId});
        let field=document.getElementById("gift-link");if(!field){field=text("input","");field.id="gift-link";field.readOnly=true;field.setAttribute("aria-label","Бэлгийн холбоос");}
        field.value=location.origin+result.claimPath;field.select();
      });text("p","Холбоосыг зөвхөн хүлээн авагчдаа илгээнэ үү. Шинэ холбоос өмнөхийг хүчингүй болгоно. Холбоос 30 хоногийн дараа хүчингүй болсон ч ашиглаагүй бэлэг хэвээр үлдэнэ.");return;
    }
    if(order.status==="pending"){
      if(order.qrImage){const img=text("img","");img.alt="QPay төлбөрийн QR";img.src=`data:image/png;base64,${order.qrImage}`;img.width=240;}
      for(const item of order.urls||[]){const a=text("a",item.description||item.name||"QPay");a.href=item.link;a.rel="noreferrer noopener";a.className="button secondary";}
      button("Төлбөр шалгах",async()=>showOrder(await api({action:"check",orderId})));
      text("p","QPay төлбөрийг баталгаажуулсны дараа бэлгийн холбоос үүснэ.");return;
    }
    text("p","Нэхэмжлэхийн төлөвийг шалгах шаардлагатай. Дахин төлбөр бүү үүсгээрэй.");
  }
  try {
    await fetch("/.netlify/functions/weight-session-start",{method:"POST",headers:{"content-type":"application/json"},body:"{}"}).then(r=>{if(!r.ok)throw new Error("session");});
    if(claimToken){const preview=await api({action:"preview",token:claimToken});if(preview.claimed){location.assign(preview.nextRoute);return;}text("h2","Танд Jingeehas-ийн үнэлгээ бэлэглэсэн байна");if(preview.note)text("p",preview.note);
      text("p","Хүлээн авах эсэхээ та өөрөө шийднэ. Үнэлгээг хүссэн үедээ эхлүүлж болно.");
      button("Бэлгээ хүлээн авч, өөрийн үнэлгээг эхлүүлэх",async()=>{const result=await api({action:"claim",token:claimToken,accept:true});location.assign(result.nextRoute);});
      const decline=text("a","Одоохондоо хүлээн авахгүй");decline.href="/";
    }else if(orderId){await showOrder(await api({action:"status",orderId}));}
    else {text("h2",`Нэг хүнд бэлэглэх — ${globalThis.JINGEEHAS_PRODUCT_CONFIG.PRODUCT.displayPrice}`);
      const label=text("label","Урам өгөх зурвас (заавал биш)");const note=text("textarea","");note.id="gift-note";note.maxLength=280;label.htmlFor=note.id;
      text("p","Хүлээн авагчийн имэйл шаардлагагүй. Төлбөр баталгаажсаны дараа холбоосоо өөрөө хуваалцана.");
      button("QPay-ээр бэлэг авах",async()=>{let requestKey=sessionStorage.getItem("jingeehas_gift_request");if(!requestKey){requestKey=crypto.randomUUID();sessionStorage.setItem("jingeehas_gift_request",requestKey);}await showOrder(await api({action:"create",requestKey,note:note.value}));});
    }
  }catch{status.textContent="Бэлгийн холбоос эсвэл сессийг нээж чадсангүй. Шинэ холбоос авах эсвэл өмнөх браузераасаа үргэлжлүүлнэ үү.";}
    if(!claimToken){
      text("h2","Өмнө авсан бэлгээ сэргээх");const recovery=text("input","");recovery.setAttribute("aria-label","Хадгалсан сэргээх код");recovery.autocomplete="off";
      button("Сэргээх кодоор үргэлжлүүлэх",async()=>showOrder(await api({action:"recover",recoveryCode:recovery.value.trim()})));
    }
})();
