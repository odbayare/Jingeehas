const assert=require('node:assert/strict');
const root=require('node:path').resolve(__dirname,'..');
const {MemoryDatabaseAdapter}=require(root+'/tests/support/memory-database.js');
const {createAssessment,completeAssessment,reportForSession}=require(root+'/netlify/functions/_lib/assessment.js');
const {validateInvoiceRequest}=require(root+'/netlify/functions/_lib/payment.js');
const {FREE_POSTPAID_FLOW,nextRoute}=require(root+'/netlify/functions/_lib/commercial-flow.js');
const {CURRENT_QUESTIONNAIRE_VERSION}=require(root+'/questions.js');
(async()=>{
 const db=new MemoryDatabaseAdapter();const a=await createAssessment(db,'recipient',{flowVersion:FREE_POSTPAID_FLOW});
 await db.update('assessments',a.id,{questionnaireVersion:CURRENT_QUESTIONNAIRE_VERSION});
 await db.insert('entitlements',{id:a.id+':WEIGHT_TEST_ONE_TIME',sessionId:'recipient',assessmentId:a.id,paymentId:null,giftOrderId:'go-synthetic',productCode:'WEIGHT_TEST_ONE_TIME',status:'active',grantedAt:new Date().toISOString()});
 for(const [questionId,value] of Object.entries({'OPEN-01':'Яг одоо өөртөө хор хүргэх бодол орж ирж байна.','SAFETY-CONFIRM-OPEN-01':'Одоо идэвхтэй бодогдож байна'}))await db.insert('assessment_answers',{id:a.id+questionId,assessmentId:a.id,questionId,value});
 const completed=await completeAssessment(db,'recipient',{assessmentId:a.id});assert.equal(completed.safetyRoute,'urgent_self_harm');
 const report=await reportForSession(db,'recipient',a.id);assert.equal(report.fullReport,null);assert.equal(report.reportMode,'safety');
 assert.equal(await nextRoute(db,completed),'/report');await assert.rejects(validateInvoiceRequest(db,'recipient',{assessmentId:a.id}),{code:'assessment_incomplete'});
 await assert.rejects(reportForSession(db,'buyer',a.id),{code:'assessment_not_found'});
 assert.equal((await db.find('payments',{})).length,0);console.log('PASS independent gifting safety fixture: entitled recipient gets safety guidance/null commercial report; invoice request blocked; buyer denied; zero payment rows');
})().catch(e=>{console.error(e);process.exit(1)});
