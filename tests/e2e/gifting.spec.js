"use strict";
const fs=require("node:fs");
const { test,expect }=require("@playwright/test");
const path=require("node:path");
const token="a".repeat(43);
async function setup(page,reply){
  await page.route("**/gift.html*",route=>route.fulfill({contentType:"text/html",body:fs.readFileSync(path.resolve("dist/gift.html"),"utf8")}));
  await page.route("**/gift.js",route=>route.fulfill({contentType:"application/javascript",body:fs.readFileSync(path.resolve("dist/gift.js"),"utf8")}));
  await page.route("**/.netlify/functions/weight-session-start",route=>route.fulfill({json:{sessionId:"mock"}}));
  await page.route("**/.netlify/functions/gift",route=>reply(route,route.request().postDataJSON()));
}
test("buyer only obtains a share link after provider-confirmed payment; reload resumes",async({page})=>{
  let paid=false, creates=0;
  await setup(page,(route,input)=>{
    if(input.action==="create")creates++;
    if(input.action==="check")paid=true;
    if(input.action==="link")return route.fulfill({json:{claimPath:`/gift.html#${token}`}});
    return route.fulfill({json:{orderId:"go-mock",amount:19900,status:paid?"paid":"pending",urls:[{link:"https://qpay.mn/q/mock",name:"QPay"}]}});
  });
  await page.goto("/gift.html");await page.getByLabel("Урам өгөх зурвас (заавал биш)").fill("Өөртөө цаг гаргаарай");
  await page.getByRole("button",{name:"QPay-ээр бэлэг авах"}).click();
  await expect(page.getByRole("button",{name:"Хуваалцах шинэ холбоос авах"})).toHaveCount(0);
  await page.reload();await page.getByRole("button",{name:"Төлбөр шалгах"}).click();
  await page.getByRole("button",{name:"Хуваалцах шинэ холбоос авах"}).click();
  await expect(page.getByLabel("Бэлгийн холбоос")).toHaveValue(new RegExp(`#${token}$`));expect(creates).toBe(1);
});
test("recipient explicitly accepts; fragment and note never enter analytics; note is plain text",async({page},testInfo)=>{
  const calls=[];const leaked=[];
  page.on("request",request=>{if(/analytics|facebook/.test(request.url()))leaked.push(request.url());});
  await setup(page,(route,input)=>{calls.push(input);return route.fulfill({json:input.action==="preview"?{available:true,note:'<img src=x onerror="window.giftXss=true">'}:{nextRoute:"/assessment/questions",assessmentId:"wa-recipient"}});});
  await page.goto(`/gift.html#${token}`);await expect(page.getByRole("heading",{name:"Танд бэлэг ирлээ 🎁"})).toBeVisible();
  await expect(page.getByText('<img src=x onerror="window.giftXss=true">')).toBeHidden();
  await page.getByRole("button",{name:"Бэлгээ нээх",exact:true}).click();
  await expect(page.getByText('<img src=x onerror="window.giftXss=true">')).toBeVisible();
  await expect(page.locator("#gift-greeting-panel img")).toHaveCount(0);
  expect(await page.evaluate(()=>window.giftXss)).toBeUndefined();
  expect(await page.evaluate(()=>location.hash)).toBe("");expect(calls.map(x=>x.action)).toEqual(["preview"]);
  await expect(page.getByRole("link",{name:"Одоохондоо хүлээн авахгүй"})).toBeVisible();
  await page.getByRole("button",{name:"Бэлгээ хүлээн авах"}).click();
  await expect(page).toHaveURL(/assessment\/questions/);expect(calls[1].accept).toBe(true);expect(leaked).toEqual([]);
  expect(await page.evaluate(()=>window.giftXss)).toBeUndefined();
});
test("disabled gifting cannot initiate a payment",async({page})=>{
  await setup(page,route=>route.fulfill({status:503,json:{error:"gifting_unavailable"}}));await page.goto("/gift.html");
  await page.getByRole("button",{name:"QPay-ээр бэлэг авах"}).click();await expect(page.getByRole("status")).toContainText("Одоогоор төлбөр авахгүй");
});
test("a saved buyer recovery code resumes the gift in a fresh session without recipient details",async({page})=>{
  const calls=[];await setup(page,(route,input)=>{calls.push(input);return route.fulfill({json:input.action==="recover"?{orderId:"go-recovered",amount:19900,status:"paid"}:{recoveryCode:"b".repeat(43)}});});
  await page.goto("/gift.html");await page.getByLabel("Хадгалсан сэргээх код").fill("b".repeat(43));
  await page.getByRole("button",{name:"Сэргээх кодоор үргэлжлүүлэх"}).click();await expect(page.getByRole("button",{name:"Хуваалцах шинэ холбоос авах"})).toBeVisible();
  await page.getByRole("button",{name:"Бэлгээ сэргээх код хадгалах"}).click();await expect(page.getByLabel("Бэлэг сэргээх код")).toHaveValue("b".repeat(43));
  expect(calls.map(x=>x.action)).toEqual(["recover","recovery_key"]);
});
test("gifting recipient is usable at 375px and unavailable links offer no acceptance",async({page},testInfo)=>{
  await page.setViewportSize({width:375,height:812});
  await setup(page,route=>route.fulfill({json:{available:true,note:"Өөртөө цаг гаргаарай"}}));
  await page.goto(`/gift.html#${token}`);
  await page.getByRole("button",{name:"Бэлгээ нээх",exact:true}).click();
  await expect(page.getByRole("button",{name:"Бэлгээ хүлээн авах"})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:testInfo.outputPath("gift-recipient-375.png"),fullPage:true,animations:"disabled"});
  await page.route("**/.netlify/functions/gift",route=>route.fulfill({status:404,json:{error:"gift_unavailable"}}));
  await page.goto(`/gift.html#${"z".repeat(43)}`);await expect(page.getByRole("button",{name:"Бэлгээ хүлээн авах"})).toHaveCount(0);
});
test("unknown invoices survive reload without another create and show a support reference",async({page})=>{
  let creates=0;await setup(page,(route,input)=>{
    if(input.action==="create")creates++;
    return route.fulfill({json:{orderId:"go-unknown",amount:19900,status:"create_unknown",supportRequired:true}});
  });
  await page.goto("/gift.html");await page.getByRole("button",{name:"QPay-ээр бэлэг авах"}).click();
  await expect(page.getByText("Захиалгын лавлах: go-unknown")).toBeVisible();await page.reload();
  await expect(page.getByRole("button",{name:"QPay-ээр бэлэг авах"})).toHaveCount(0);expect(creates).toBe(1);
  await expect(page.getByRole("link",{name:"Захиалгын лавлахаар дэмжлэг авах"})).toBeVisible();
});
test("verified payment after cancellation displays recoverable review without a gift link",async({page})=>{
  let state="pending";await setup(page,(route,input)=>{
    if(input.action==="cancel")state="canceled";if(input.action==="check")state="paid_review";
    return route.fulfill({json:{orderId:"go-canceled",amount:19900,status:state,urls:[]}});
  });
  await page.goto("/gift.html");await page.getByRole("button",{name:"QPay-ээр бэлэг авах"}).click();
  await page.getByRole("button",{name:"Захиалгыг зогсоох хүсэлт"}).click();
  await expect(page.getByText(/QPay нэхэмжлэх хаагдсан эсэхийг/)).toBeVisible();
  await page.getByRole("button",{name:"Захиалгын төлөв шинэчлэх"}).click();
  await expect(page.getByText(/Төлбөр бүртгэгдсэн байна/)).toBeVisible();
  await expect(page.getByRole("button",{name:"Хуваалцах шинэ холбоос авах"})).toHaveCount(0);
  await expect(page.getByRole("button",{name:"Бэлгээ сэргээх код хадгалах"})).toBeVisible();
});
test("a lost create response resumes by its stored request key",async({page})=>{
  await page.addInitScript(()=>sessionStorage.setItem("jingeehas_gift_request","12345678-1234-1234-1234-123456789012"));
  const calls=[];await setup(page,(route,input)=>{calls.push(input);return route.fulfill({json:{orderId:"go-interrupted",amount:19900,status:"pending",urls:[]}});});
  await page.goto("/gift.html");await expect(page.getByRole("button",{name:"Төлбөр шалгах"})).toBeVisible();
  expect(calls.map(x=>x.action)).toEqual(["status"]);expect(calls[0].requestKey).toBe("12345678-1234-1234-1234-123456789012");
});
test("reveal keeps acceptance separate and moves keyboard focus to the actual greeting",async({page})=>{
  const calls=[]; const note="Өөртөө зөөлөн хандаарай.\nЭнэ мөч зөвхөн чамд зориулагдлаа.";
  await setup(page,(route,input)=>{calls.push(input);return route.fulfill({json:{available:true,note}});});
  await page.goto(`/gift.html#${token}`);
  await expect(page.getByRole("button",{name:"Бэлгээ хүлээн авах",exact:true})).toBeHidden();
  await page.getByRole("button",{name:"Бэлгээ нээх",exact:true}).press("Enter");
  await expect(page.getByText(note,{exact:true})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Танд зориулсан мэндчилгээ"})).toBeFocused();
  await page.keyboard.press("Tab");await expect(page.getByRole("button",{name:"Бэлгээ хүлээн авах",exact:true})).toBeFocused();
  await expect(page.getByRole("button",{name:"Бэлгээ нээх",exact:true})).toHaveCount(0);
  expect(calls.map(x=>x.action)).toEqual(["preview"]);
  const state=await page.evaluate(()=>({hash:location.hash,history:JSON.stringify(history.state),storage:JSON.stringify({...sessionStorage}),images:document.querySelectorAll("#gift-greeting-panel img").length}));
  expect(state.hash).toBe("");expect(state.history).not.toContain(token);expect(state.history).not.toContain(note);expect(state.storage).not.toContain(token);expect(state.storage).not.toContain(note);expect(state.images).toBe(0);
});
test("missing greeting uses neutral copy without invented sender identity",async({page})=>{
  await setup(page,route=>route.fulfill({json:{available:true,note:"  "}}));await page.goto(`/gift.html#${token}`);
  await page.getByRole("button",{name:"Бэлгээ нээх",exact:true}).click();
  await expect(page.getByText("Өөртөө цаг гаргаж, өөрийгөө илүү сайн ойлгох энэ мөч танд зориулагдлаа. Хүссэн үедээ, өөрийн хэмнэлээр эхлээрэй.",{exact:true})).toBeVisible();
  await expect(page.locator(".gift-greeting")).toHaveCount(1);
  await expect(page.getByText(/Таны хариулт, жин, эрүүл мэндийн мэдээлэл/)).toBeVisible();
});
test("reload and back never claim or turn a stripped recipient link into a purchase",async({page})=>{
  const calls=[];await setup(page,(route,input)=>{calls.push(input);return route.fulfill({json:{available:true,note:"Тайван мөч"}});});
  await page.goto(`/gift.html#${token}`);await page.getByRole("button",{name:"Бэлгээ нээх",exact:true}).click();
  await page.reload();await expect(page.getByRole("status")).toContainText("Бэлгийн холбоосоо дахин нээгээрэй");
  await expect(page.getByRole("button",{name:"QPay-ээр бэлэг авах"})).toHaveCount(0);
  await expect(page.getByRole("button",{name:"Бэлгээ хүлээн авах"})).toHaveCount(0);expect(calls.map(x=>x.action)).toEqual(["preview"]);
  await page.goto(`/gift.html#${token}`);await page.getByRole("button",{name:"Бэлгээ нээх",exact:true}).click();
  await page.getByRole("link",{name:"Одоохондоо хүлээн авахгүй"}).click();await page.goBack();
  await expect(page.getByRole("button",{name:"QPay-ээр бэлэг авах"})).toHaveCount(0);
  expect(calls.every(x=>x.action==="preview")).toBe(true);
  await page.goto("/");await page.goto("/gift.html");await expect(page.getByRole("button",{name:"QPay-ээр бэлэг авах"})).toBeVisible();
});
test("repeated acceptance clicks submit one claim and an expired claim stays safe",async({page})=>{
  const calls=[];await setup(page,async(route,input)=>{calls.push(input);if(input.action==="claim"){await new Promise(resolve=>setTimeout(resolve,200));return route.fulfill({status:404,json:{error:"gift_unavailable"}});}return route.fulfill({json:{available:true,note:"Өөрийн хэмнэлээр"}});});
  await page.goto(`/gift.html#${token}`);await page.getByRole("button",{name:"Бэлгээ нээх",exact:true}).click();
  await page.getByRole("button",{name:"Бэлгээ хүлээн авах",exact:true}).dblclick();
  await expect(page.getByRole("status")).toContainText("Холбоос ашиглагдсан эсвэл хүчингүй");
  expect(calls.filter(x=>x.action==="claim")).toHaveLength(1);expect(calls[1].accept).toBe(true);
  await expect(page).toHaveURL(/gift\.html$/);await expect(page.getByRole("button",{name:"QPay-ээр бэлэг авах"})).toHaveCount(0);
});
test("same recipient's previously claimed gift resumes without another claim",async({page})=>{
  const calls=[];await setup(page,(route,input)=>{calls.push(input);return route.fulfill({json:{claimed:true,assessmentId:"wa-resume",nextRoute:"/assessment/questions"}});});
  await page.goto(`/gift.html#${token}`);await expect(page).toHaveURL(/assessment\/questions/);
  expect(calls.map(x=>x.action)).toEqual(["preview"]);expect(await page.evaluate(()=>sessionStorage.getItem("jingeehas_gift_assessment"))).toBe("wa-resume");
});
test("long Mongolian greeting fits mobile and reduced motion disables reveal animations",async({page},testInfo)=>{
  await page.setViewportSize({width:375,height:812});await page.emulateMedia({reducedMotion:"reduce"});
  const note=("Чамдаа өөртөө цаг гаргах тайван мөчийг бэлэглэж байна.\n".repeat(4)+"Жаргалтайбайгаарай".repeat(5)).slice(0,280);
  await setup(page,route=>route.fulfill({json:{available:true,note}}));await page.goto(`/gift.html#${token}`);
  await page.screenshot({path:testInfo.outputPath("gift-surprise-closed-375.png"),fullPage:true,animations:"disabled"});
  await page.getByRole("button",{name:"Бэлгээ нээх",exact:true}).click();await expect(page.getByText(note,{exact:true})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const effects=await page.evaluate(()=>[...document.querySelectorAll(".gift-art span,.gift-greeting-panel")].map(node=>({animation:getComputedStyle(node).animationName,transition:getComputedStyle(node).transitionDuration})));
  expect(effects.every(x=>x.animation==="none"&&x.transition==="0s")).toBe(true);
  await expect(page.getByRole("button",{name:"Бэлгээ хүлээн авах",exact:true})).toBeVisible();
  await page.screenshot({path:testInfo.outputPath("gift-surprise-open-375.png"),fullPage:true,animations:"disabled"});
  await page.setViewportSize({width:320,height:740});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test("custom greeting has a polished desktop reveal with motion confined to decoration",async({page},testInfo)=>{
  await page.setViewportSize({width:1280,height:900});await page.emulateMedia({reducedMotion:"no-preference"});
  const calls=[];const note="Өөртөө зориулах тайван мөчийг бэлэглэж байна.\nХүссэн үедээ, өөрийн хэмнэлээр эхлээрэй. 💚";
  await setup(page,(route,input)=>{calls.push(input);return route.fulfill({json:{available:true,note}});});
  await page.goto(`/gift.html#${token}`);await page.screenshot({path:testInfo.outputPath("gift-surprise-closed-desktop.png"),fullPage:true,animations:"disabled"});
  await page.getByRole("button",{name:"Бэлгээ нээх",exact:true}).click();
  await expect(page.getByText(note,{exact:true})).toBeVisible();
  expect(await page.locator(".gift-lid").evaluate(node=>getComputedStyle(node).transitionDuration)).toBe("0.55s");
  await page.screenshot({path:testInfo.outputPath("gift-surprise-open-desktop.png"),fullPage:true,animations:"disabled"});
  expect(calls.map(x=>x.action)).toEqual(["preview"]);await expect(page.locator("audio,video")).toHaveCount(0);
});
