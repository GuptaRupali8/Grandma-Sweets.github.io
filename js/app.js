//show cart
(function(){
const cartInfo = document.getElementById("cart-info");
const cart = document.getElementById("cart");
    
    cartInfo.addEventListener("click", function(){
        cart.classList.toggle("show-cart");
    });
})();

//add items to the cart

(function(){
const cartBtn = document.querySelectorAll('.store-item-icon');

cartBtn.forEach(function(btn){
    btn.addEventListener('click',function(event){
//    console.log(event.target);    
        
    if(event.target.parentElement.classList.contains("store-item-icon")){
   let fullPath = event.target.parentElement.previousElementSibling.src;
    let pos = fullPath.indexOf("img") + 3 ;
    let partPath = fullPath.slice(pos);
        
//        console.log(partPath);
 const item = {};
item.img =`img-cart${partPath}`;
let name =
event.target.parentElement.parentElement.nextElementSibling.children[0].children[0].textContent;
item.name = name;
        let price =
event.target.parentElement.parentElement.nextElementSibling.children[0].children[1].textContent;
        
let finalPrice = price.slice(1).trim();
        
item.price = finalPrice       
//console.log(finalPrice);
        
//    console.log(name);
//    console.log(item);
        
const cartItem = document.createElement('div');
cartItem.classList.add(
    "cart-item",
    "d-flex",
    "justify-content-between",
    "text-capitalize",
    "my-3"
);

cartItem.innerHTML = `
<img src="${item.img}" class="img-fluid rounded-circle" id="item-img" alt="">
    <div class="cart-item-text">

    <p id="cart-item-title" class="font-weight-bold mb-0">${item.name}</p>
    <span>$</span>
    <span id="cart-item-price" class="cart-item-price" class="mb-0">${item.price}</span>
    </div>
    <a href="#" id='cart-item-remove' class="cart-item-remove">
    <i class="fas fa-trash"></i>
    </a>
    </div>
    `;
        
        
// select cart
const cart = document.getElementById('cart');
const total = document.querySelector(".cart-total-container");

cart.insertBefore(cartItem, total);
alert("item added to the cart");
        showTotals();
        }
     });
});
    //show totals
    function showTotals(){
        
        const total = [];
        const items = document.querySelectorAll(".cart-item-price");
        
        items.forEach(function(item){
            total.push(parseFloat(item.textContent));
            });
//        console.log(total);
        
        
    const totalMoney = total.reduce(function(total,item){
        total += item;
        return total;
    },0)
  const finalMoney = totalMoney.toFixed(2);  
    
document.getElementById("cart-total").textContent = finalMoney;    
document.querySelector(".item-total").textContent = finalMoney; 
document.getElementById("item-count").textContent = total.length;
    
    
    }
})();


//explore or trear button 


console.clear();

let width = window.innerWidth;
let height = window.innerHeight;
const body = document.body;

const elButton = document.querySelector(".treat-button");
const elWrapper = document.querySelector(".treat-wrapper");

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const treatmojis = ["🍬", "🍫", "🍭", "🍡", "🍩", "🍪", "🍒"];
const treats = [];
const radius = 15;

const Cd = 0.47; // Dimensionless
const rho = 1.22; // kg / m^3
const A = Math.PI * radius * radius / 10000; // m^2
const ag = 9.81; // m / s^2
const frameRate = 1 / 60;

function createTreat() /* create a treat */ {
  const vx = getRandomArbitrary(-10, 10); // x velocity
  const vy = getRandomArbitrary(-10, 1);  // y velocity
  
  const el = document.createElement("div");
  el.className = "treat";

  const inner = document.createElement("span");
  inner.className = "inner";
  inner.innerText = treatmojis[getRandomInt(0, treatmojis.length - 1)];
  el.appendChild(inner);
  
  elWrapper.appendChild(el);

  const rect = el.getBoundingClientRect();

  const lifetime = getRandomArbitrary(2000, 3000);

  el.style.setProperty("--lifetime", lifetime);

  const treat = {
    el,
    absolutePosition: { x: rect.left, y: rect.top },
    position: { x: rect.left, y: rect.top },
    velocity: { x: vx, y: vy },
    mass: 0.1, //kg
    radius: el.offsetWidth, // 1px = 1cm
    restitution: -.7,
    
    lifetime,
    direction: vx > 0 ? 1 : -1,

    animating: true,

    remove() {
      this.animating = false;
      this.el.parentNode.removeChild(this.el);
    },

    animate() {
      const treat = this;
      let Fx =
        -0.5 *
        Cd *
        A *
        rho *
        treat.velocity.x *
        treat.velocity.x *
        treat.velocity.x /
        Math.abs(treat.velocity.x);
      let Fy =
        -0.5 *
        Cd *
        A *
        rho *
        treat.velocity.y *
        treat.velocity.y *
        treat.velocity.y /
        Math.abs(treat.velocity.y);

      Fx = isNaN(Fx) ? 0 : Fx;
      Fy = isNaN(Fy) ? 0 : Fy;

      // Calculate acceleration ( F = ma )
      var ax = Fx / treat.mass;
      var ay = ag + Fy / treat.mass;
      // Integrate to get velocity
      treat.velocity.x += ax * frameRate;
      treat.velocity.y += ay * frameRate;

      // Integrate to get position
      treat.position.x += treat.velocity.x * frameRate * 100;
      treat.position.y += treat.velocity.y * frameRate * 100;
      
      treat.checkBounds();
      treat.update();
    },
    
    checkBounds() {

      if (treat.position.y > height - treat.radius) {
        treat.velocity.y *= treat.restitution;
        treat.position.y = height - treat.radius;
      }
      if (treat.position.x > width - treat.radius) {
        treat.velocity.x *= treat.restitution;
        treat.position.x = width - treat.radius;
        treat.direction = -1;
      }
      if (treat.position.x < treat.radius) {
        treat.velocity.x *= treat.restitution;
        treat.position.x = treat.radius;
        treat.direction = 1;
      }

    },

    update() {
      const relX = this.position.x - this.absolutePosition.x;
      const relY = this.position.y - this.absolutePosition.y;

      this.el.style.setProperty("--x", relX);
      this.el.style.setProperty("--y", relY);
      this.el.style.setProperty("--direction", this.direction);
    }
  };

  setTimeout(() => {
    treat.remove();
  }, lifetime);

  return treat;
}


function animationLoop() {
  var i = treats.length;
  while (i--) {
    treats[i].animate();

    if (!treats[i].animating) {
      treats.splice(i, 1);
    }
  }

  requestAnimationFrame(animationLoop);
}

animationLoop();

function addTreats() {
  //cancelAnimationFrame(frame);
  if (treats.length > 40) {
    return;
  }
  for (let i = 0; i < 10; i++) {
    treats.push(createTreat());
  }
}

elButton.addEventListener("click", addTreats);
elButton.click();

window.addEventListener("resize", () => {
  width = window.innerWidth;
  height = window.innerHeight;
});



