// ข้อมูล Checklist — แก้ตรงนี้ตามเนื้อหา EA จริง
const CHECKLIST_ITEMS = [
  { id: 1, text: "เนื้อหา Enterprise Architecture Overview" },
  { id: 2, text: "Technical Review 1/3" },
  { id: 3, text: "Technical Review 2/3" },
  { id: 4, text: "Technical Review 3/3" },
  { id: 5, text: "CIS/ TOGAF / OWASP คือ ?" },
];

// ข้อมูล Q&A สำหรับ Chatbot
const QA_DATA = [
  {
    keywords: ["ea", "enterprise architecture", "คืออะไร","กรอกยังไง","ใส่อะไร","Propose","Phase","owner","Catalogue","Type"],
    answer: "Enterprise Architecture (EA) **Propose Request**:คุณต้องการขออนุมัติ/แจ้งเพื่อทราบ\n\n **Project Catalague:โครงการใหม่ หรือ POC หรือ Enhance \n **Project Owner:ใครเป็นเจ้าของโครงการ \n **Phase:พึ่งเริ่มหรือกำลัง Design หรือ จะ GoLive "
  },
  {
    keywords: ["server location", "server", "sv"],
    answer: "Server Location จะมีให้เลือก 2 Type ได้แก่ \n\n *OnPremise* จะอยุ่ RO \n  *On-Cloud จะมี AWS และ Azure"
  },
  {
    keywords: ["togaf", "โทแกฟ"],
    answer: "TOGAF (The Open Group Architecture Framework) เป็น framework ยอดนิยมสำหรับ EA ประกอบด้วย ADM (Architecture Development Method) เป็นหลักครับ"
  },
  {
    keywords: ["สอบ", "ข้อสอบ", "เตรียม"],
    answer: "สำหรับการเตรียมสอบ EA แนะนำให้: 1) อ่าน framework หลัก 2) ทำข้อสอบเก่า 3) ทำ checklist ให้ครบทุกข้อครับ"
  },
  {
    keywords: ["zachman"],
    answer: "Zachman Framework จัดกลุ่มสถาปัตยกรรมองค์กรเป็น 6 คอลัมน์ (What, How, Where, Who, When, Why) และ 6 แถว (Perspective) ครับ"
  },
];
