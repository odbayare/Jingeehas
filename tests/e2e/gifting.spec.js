"use strict";
const { test,expect }=require("@playwright/test");
const fs=require("node:fs");
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
test("recipient explicitly accepts; fragment and note never enter analytics; note is plain text",async({page})=>{
  const calls=[];const leaked=[];
  page.on("request",request=>{if(/analytics|facebook/.test(request.url()))leaked.push(request.url());});
  await setup(page,(route,input)=>{calls.push(input);return route.fulfill({json:input.action==="preview"?{available:true,note:'<img src=x onerror="window.giftXss=true">'}:{nextRoute:"/assessment/questions",assessmentId:"wa-recipient"}});});
  await page.goto(`/gift.html#${token}`);await expect(page.getByText('<img src=x onerror="window.giftXss=true">')).toBeVisible();
  expect(await page.evaluate(()=>location.hash)).toBe("");expect(calls.map(x=>x.action)).toEqual(["preview"]);
  await expect(page.getByRole("link",{name:"Одоохондоо хүлээн авахгүй"})).toBeVisible();
  await page.getByRole("button",{name:"Бэлгээ хүлээн авч, өөрийн үнэлгээг эхлүүлэх"}).click();
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
test("gifting recipient is usable at 375px and unavailable links offer no acceptance",async({page})=>{
  await page.setViewportSize({width:375,height:812});
  await setup(page,route=>route.fulfill({json:{available:true,note:"Өөртөө цаг гаргаарай"}}));
  await page.goto(`/gift.html#${token}`);
  await expect(page.getByRole("button",{name:"Бэлгээ хүлээн авч, өөрийн үнэлгээг эхлүүлэх"})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  fs.mkdirSync("docs/gifting/evidence",{recursive:true});await page.screenshot({path:"docs/gifting/evidence/recipient-375.png",fullPage:true});
  await page.route("**/.netlify/functions/gift",route=>route.fulfill({status:404,json:{error:"gift_unavailable"}}));
  await page.goto(`/gift.html#${"z".repeat(43)}`);await expect(page.getByRole("button",{name:"Бэлгээ хүлээн авч, өөрийн үнэлгээг эхлүүлэх"})).toHaveCount(0);
});
