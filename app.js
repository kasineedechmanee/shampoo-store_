// ตั้งค่า Google Apps Script Web App URL ใน CONFIG เมื่อพร้อมเชื่อม Google Sheets
const CONFIG={SHEETS_WEB_APP_URL: "https://script.google.com/a/macros/spumail.net/s/AKfycbzINdsEMF0wvrI6UQdkSzO6wa06EezmcsmUttp2bPzX7INWt6mRJjF1YwaxEooKJZVy5g/exec",};
const products=[
 {sku:"SH-001",name:"แชมพูสูตรลดผมขาดหลุดร่วง",desc:"ทำความสะอาดเส้นผมและหนังศีรษะอย่างอ่อนโยน เหมาะสำหรับการดูแลผมประจำวัน",price:259,stock:30,tone:"cream",label:"ANTI HAIR FALL"},
 {sku:"SH-002",name:"แชมพูสูตรดูแลหนังศีรษะ",desc:"ช่วยชำระล้างสิ่งสกปรกและดูแลหนังศีรษะให้รู้สึกสะอาดสดชื่น",price:229,stock:25,tone:"green",label:"SCALP CARE"}
];
let cart=JSON.parse(localStorage.getItem("haire-cart")||"{}");
const $=s=>document.querySelector(s), money=n=>"฿"+Number(n).toLocaleString("th-TH");
function renderProducts(){$("#productGrid").innerHTML=products.map((p,i)=>`<article class="product-card"><div class="product-visual"><div class="bottle ${i?"bottle-b":""}"><span>HAIRÉ</span><small>${p.label.replace(" ","<br>")}</small></div></div><div class="product-info"><span class="sku">${p.sku} · มีสินค้า ${p.stock} ชิ้น</span><h3>${p.name}</h3><p>${p.desc}</p><div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add" onclick="addToCart('${p.sku}')">เพิ่มลงตะกร้า +</button></div></div></article>`).join("")}
function saveCart(){localStorage.setItem("haire-cart",JSON.stringify(cart));renderCart()}
function addToCart(sku){const p=products.find(x=>x.sku===sku);if((cart[sku]||0)>=p.stock)return toast("สินค้าในสต็อกไม่เพียงพอ");cart[sku]=(cart[sku]||0)+1;saveCart();toast("เพิ่มสินค้าในตะกร้าแล้ว")}
function changeQty(sku,d){cart[sku]=(cart[sku]||0)+d;if(cart[sku]<=0)delete cart[sku];saveCart()}
function cartLines(){return Object.entries(cart).map(([sku,q])=>({p:products.find(x=>x.sku===sku),q})).filter(x=>x.p)}
function total(){return cartLines().reduce((s,x)=>s+x.p.price*x.q,0)}
function renderCart(){$("#cartCount").textContent=Object.values(cart).reduce((a,b)=>a+b,0);$("#cartItems").innerHTML=cartLines().length?cartLines().map(({p,q})=>`<div class="cart-row"><div><b>${p.name}</b><br><small>${p.sku} · ${money(p.price)}</small></div><div class="qty"><button onclick="changeQty('${p.sku}',-1)">−</button> ${q} <button onclick="changeQty('${p.sku}',1)">+</button></div></div>`).join(""):"<p>ยังไม่มีสินค้าในตะกร้า</p>";$("#cartTotal").textContent=money(total());$("#checkoutSummary").innerHTML=cartLines().map(x=>`${x.p.name} × ${x.q} — ${money(x.p.price*x.q)}`).join("<br>")+`<hr>รวม ${money(total())}`}
function toast(t){const e=$("#toast");e.textContent=t;e.classList.add("show");setTimeout(()=>e.classList.remove("show"),2300)}
function openCart(){$("#overlay").classList.add("show");$("#cartDrawer").classList.add("open")}
function closeCart(){$("#overlay").classList.remove("show");$("#cartDrawer").classList.remove("open")}
$("#cartOpen").onclick=openCart;$("#cartClose").onclick=closeCart;$("#overlay").onclick=closeCart;
$("#checkoutOpen").onclick=()=>{if(!cartLines().length)return toast("กรุณาเลือกสินค้าก่อน");closeCart();$("#checkoutModal").classList.add("show")};
$("#checkoutClose").onclick=()=>$("#checkoutModal").classList.remove("show");
$("#checkoutForm").onsubmit=async e=>{e.preventDefault();if(!cartLines().length)return toast("ตะกร้าสินค้าว่าง");const f=Object.fromEntries(new FormData(e.target));const order={orderId:"HR"+Date.now().toString().slice(-8),createdAt:new Date().toISOString(),...f,items:cartLines().map(({p,q})=>({sku:p.sku,name:p.name,qty:q,unitPrice:p.price})),total:total(),status:"รอตรวจสอบ"};
 try{if(CONFIG.SHEETS_WEB_APP_URL){const r=await fetch(CONFIG.SHEETS_WEB_APP_URL,{method:"POST",body:JSON.stringify({action:"createOrder",order})});const j=await r.json();if(!j.ok)throw Error(j.error||"บันทึกไม่สำเร็จ")}else{let demo=JSON.parse(localStorage.getItem("haire-orders")||"[]");demo.push(order);localStorage.setItem("haire-orders",JSON.stringify(demo))}
 localStorage.setItem("haire-last-order",JSON.stringify(order));cart={};saveCart();$("#checkoutModal").classList.remove("show");e.target.reset();toast("รับคำสั่งซื้อแล้ว เลขที่ "+order.orderId);setTimeout(()=>showReceipt(order),700)
 }catch(err){toast("บันทึกไม่สำเร็จ กรุณาลองใหม่: "+err.message)}};
function showReceipt(o){const w=window.open("","_blank");if(!w){toast("คำสั่งซื้อบันทึกแล้ว สามารถดูข้อมูลในระบบหลังบ้าน");return}w.document.write(`<html lang="th"><meta charset="utf-8"><title>ใบสรุปคำสั่งซื้อ</title><body style="font-family:Arial,sans-serif;max-width:650px;margin:40px auto;line-height:1.7"><h2>HAIRÉ — ใบสรุปคำสั่งซื้อ</h2><p>เลขที่: ${o.orderId}<br>วันที่: ${new Date(o.createdAt).toLocaleString("th-TH")}</p><hr><p>ผู้รับ: ${o.customer}<br>โทร: ${o.phone}<br>ที่อยู่: ${o.address} ${o.postcode}</p><hr>${o.items.map(x=>`<p>${x.sku} ${x.name} × ${x.qty} — ${money(x.qty*x.unitPrice)}</p>`).join("")}<hr><h3>ยอดรวม ${money(o.total)}</h3><button onclick="window.print()">พิมพ์</button></body></html>`);w.document.close()}
renderProducts();renderCart();
