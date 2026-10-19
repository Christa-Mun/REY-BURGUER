const images = {
 burger: "assets/WhatsApp Image 2026-10-18 at 7.07.28 PM.jpeg",
 local: "assets/32.jpeg"
};
const burgers = [
 {id:"jr",name:"Burger (Rey Jr.)",price:15,withFries:20,ingredients:"90 g de carne de res, jamón, queso mussarela, tomate, lechuga, pan mediano y salsas.",image:"assets/img/rey-jr.jpg"},
 {id:"clasica",name:"Burger (Rey Clásica)",price:23,withFries:28,ingredients:"110 g de carne de res, jamón, queso mussarela, calabresa, huevo, tomate, lechuga, pan grande y salsas.",image:"assets/img/rey-clasica.jpg"},
 {id:"doble",name:"Burger (Rey Doble)",price:32,withFries:37,ingredients:"220 g de carne de res, jamón, queso mussarela, huevo, tomate, lechuga, calabresa, pan grande y salsas.",image:"assets/img/rey-doble.jpg"},
 {id:"salchiburger",name:"Salchiburger",price:37,withFries:null,ingredients:"110 g de carne de res, jamón, queso mussarela, huevo, tomate, lechuga, pan grande, salsas, salchicha y papas.",image:"assets/img/salchiburguer.jpg"},
 {id:"imperial",name:"Burger (Rey Imperial)",price:40,withFries:45,ingredients:"110 g de carne de res, jamón, queso mussarela, catupiry, huevo, tomate, lechuga, pan grande, salsas, tocino, calabresa y salchicha.",image:"assets/img/rey-imperial.jpg"},
 {id:"doble-imperial",name:"Burger (Rey Doble Imperial)",price:50,withFries:55,ingredients:"220 g de carne de res, doble jamón, doble queso mussarela, catupiry, huevo, tomate, lechuga, pan grande, salsas, tocino, calabresa y salchicha.",image:"assets/img/rey-doble-imperial.jpg"},
 {id:"chori-rey",name:"Burger (Chori Rey)",price:33,withFries:38,ingredients:"110 g de carne de res, chorizo ahumado, jamón, queso mussarela, calabresa, huevo, tomate, lechuga, pan grande y salsas.",image:"assets/img/chori-rey.jpg"},
 {id:"lomito",name:"Sándwich de lomito",price:25,withFries:30,ingredients:"Carne de res, pan francés, queso mussarela, jamón, huevo, lechuga, tomate y salsas.",image:"assets/img/Sandwich.png"},
 {id:"salchipapa",name:"Salchipapa",price:15,withFries:20,ingredients:"Papas, salchicha y salsas.",image:"assets/img/Salchipapa.png"}
];
const extras = [
 {id:"papas-extra",name:"Papas",price:5},{id:"jamon-mussarela",name:"Jamón / queso mussarela",price:5},
 {id:"huevo",name:"Huevo",price:3},{id:"calabreza",name:"Calabreza",price:6},
 {id:"tocino",name:"Tocino",price:9},{id:"salchicha",name:"Salchicha",price:4},
 {id:"chorizo",name:"Chorizo parrillero ahumado",price:10},{id:"cheddar",name:"Queso cheddar",price:5},
 {id:"coca-500",name:"Coca-Cola 500 ml (vaso)",price:7},{id:"coca-15",name:"Coca-Cola 1.5 L",price:20},
 {id:"refresco",name:"Refresco natural 500 ml",price:5},{id:"agua",name:"Agua",price:6}
];
const cart = [];
const money = n => `Bs ${n}`;
const elements = {
 burgerGrid: document.getElementById("burgerGrid"),
 extrasGrid: document.getElementById("extrasGrid"),
 navCount: document.getElementById("navCount"),
 floatCount: document.getElementById("floatCount"),
 summaryCount: document.getElementById("summaryCount"),
 summaryTotal: document.getElementById("summaryTotal"),
 whatsappOrder: document.getElementById("whatsappOrder"),
 cartItems: document.getElementById("cartItems"),
 customerName: document.getElementById("customerName"),
 orderNotes: document.getElementById("orderNotes"),
 menuToggle: document.getElementById("menuToggle"),
 nav: document.getElementById("nav"),
 orderSection: document.getElementById("pedido"),
 goOrder: document.getElementById("goOrder"),
 floatingCart: document.getElementById("floatingCart"),
 year: document.getElementById("year")
};

function renderBurgers(){
 elements.burgerGrid.innerHTML = burgers.map((b,i)=>`
  <article class="burger-card">
   <div class="burger-img"><img src="${b.image}" alt="${b.name}" loading="lazy"><span class="burger-number">${String(i+1).padStart(2,"0")} / FAVORITA</span></div>
   <div class="burger-body"><h3>${b.name}</h3><p class="ingredients">${b.ingredients}</p>
   ${b.withFries===null ? `<div class="single-price"><strong>${money(b.price)}</strong><button class="add-btn" data-add-burger="${b.id}" data-fries="false">Agregar +</button></div>` :
   `<div class="price-options"><button class="price-choice" data-add-burger="${b.id}" data-fries="false"><strong>${money(b.price)}</strong><small>Sin papas · S.P.</small></button><button class="price-choice" data-add-burger="${b.id}" data-fries="true"><strong>${money(b.withFries)}</strong><small>Con papas · C.P.</small></button></div>`}
   </div>
  </article>`).join("");
}
function renderExtras(){
 elements.extrasGrid.innerHTML = extras.map(e=>`<div class="extra-item"><div><h3>${e.name}</h3><strong>${money(e.price)}</strong></div><button aria-label="Agregar ${e.name}" data-add-extra="${e.id}">+</button></div>`).join("");
}
function getCartSummary(){
 return cart.reduce((summary,item)=>{
  summary.count+=item.qty;
  summary.total+=item.price*item.qty;
  return summary;
 },{count:0,total:0});
}
function addItem(id,kind,withFries=false){
 const item = kind==="burger" ? burgers.find(x=>x.id===id) : extras.find(x=>x.id===id);
 if(!item)return;
 const name = kind==="burger" ? `${item.name}${item.withFries!==null && withFries ? " con papas" : item.withFries!==null ? " sin papas" : ""}` : item.name;
 const price = kind==="burger" ? (withFries && item.withFries!==null ? item.withFries : item.price) : item.price;
 const key = `${kind}-${id}-${withFries}`;
 const existing = cart.find(x=>x.key===key);
 if(existing) existing.qty++;
 else cart.push({key,id,kind,name,price,qty:1});
 renderCart();
}
function updateCartItem(key,delta,remove=false){
 const index=cart.findIndex(item=>item.key===key);
 if(index<0)return;
 if(remove)cart.splice(index,1);
 else{
  cart[index].qty+=delta;
  if(cart[index].qty<=0)cart.splice(index,1);
 }
 renderCart();
}
function renderCart(){
 const {count,total}=getCartSummary();
 elements.navCount.textContent=count;
 elements.floatCount.textContent=count;
 elements.summaryCount.textContent=count;
 elements.summaryTotal.textContent=money(total);
 elements.whatsappOrder.disabled=count===0;
 const target=elements.cartItems;
 if(!count){target.innerHTML=`<div class="empty-cart"><span>🍔</span><h3>Tu pedido está vacío</h3><p>Agrega una hamburguesa, un extra o una bebida del menú.</p><a href="#menu" class="text-link">Explorar menú →</a></div>`;return;}
 target.innerHTML=cart.map(x=>`<div class="cart-row"><div><div class="cart-name">${x.name}</div><div class="cart-meta">${money(x.price)} por unidad</div><div class="cart-controls"><button aria-label="Reducir cantidad" data-minus="${x.key}">−</button><b>${x.qty}</b><button aria-label="Aumentar cantidad" data-plus="${x.key}">+</button><button class="remove" data-remove="${x.key}">Quitar</button></div></div><div class="cart-price">${money(x.price*x.qty)}</div></div>`).join("");
}
document.addEventListener("click",e=>{
 const burger=e.target.closest("[data-add-burger]");
 if(burger){addItem(burger.dataset.addBurger,"burger",burger.dataset.fries==="true");return;}
 const extra=e.target.closest("[data-add-extra]");
 if(extra){addItem(extra.dataset.addExtra,"extra");return;}
 const plus=e.target.closest("[data-plus]");if(plus){updateCartItem(plus.dataset.plus,1);return;}
 const minus=e.target.closest("[data-minus]");if(minus){updateCartItem(minus.dataset.minus,-1);return;}
 const remove=e.target.closest("[data-remove]");if(remove){updateCartItem(remove.dataset.remove,0,true);return;}
});
function sendWhatsApp(){
 if(!cart.length)return;
 const name=elements.customerName.value.trim();
 const notes=elements.orderNotes.value.trim();
 const {total}=getCartSummary();
 const lines=cart.map(x=>`• ${x.qty} x ${x.name} — ${money(x.price*x.qty)}`);
 let message=`¡Hola, Rey Burguer! 👑🍔\nQuiero realizar el siguiente pedido:\n\n${lines.join("\n")}\n\n*TOTAL: ${money(total)}*`;
 if(name)message+=`\n\nNombre: ${name}`;
 if(notes)message+=`\nIndicaciones: ${notes}`;
 message+="\n\n¿Me confirman el pedido, por favor?";

 const phone="59171319219";
 window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`,"_blank","noopener,noreferrer");
}
function scrollToOrder(){
 elements.orderSection.scrollIntoView({behavior:"smooth"});
}
function setMenuOpen(open){
 elements.nav.classList.toggle("open",open);
 elements.menuToggle.setAttribute("aria-expanded",String(open));
 elements.menuToggle.textContent=open?"✕":"☰";
}
elements.whatsappOrder.addEventListener("click",sendWhatsApp);
elements.goOrder.addEventListener("click",scrollToOrder);
elements.floatingCart.addEventListener("click",scrollToOrder);
elements.menuToggle.addEventListener("click",()=>setMenuOpen(!elements.nav.classList.contains("open")));
elements.nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>setMenuOpen(false)));
elements.year.textContent=new Date().getFullYear();
renderBurgers();renderExtras();renderCart();
