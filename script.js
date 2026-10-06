/* =========================================
   PRODUCT DATA
   Later this will come from your Node.js API
========================================= */

const products = [

  {
    id: 1,
    name: "Linen Everyday Shirt",
    price: 129,
    category: "fashion",
    label: "New",
    desc: "A relaxed everyday layer made from lightweight natural linen.",
    image:
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=900&q=85"
  },

  {
    id: 2,
    name: "Soft Leather Carryall",
    price: 189,
    category: "fashion",
    label: "Featured",
    desc: "A softly structured bag designed for effortless everyday use.",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85"
  },

  {
    id: 3,
    name: "Studio Trousers",
    price: 158,
    category: "fashion",
    label: "",
    desc: "Clean lines, relaxed movement and a considered tailored finish.",
    image:
      "https://images.unsplash.com/photo-1506629905607-d9a7b2f7b4aa?auto=format&fit=crop&w=900&q=85"
  },

  {
    id: 4,
    name: "Handmade Ceramic",
    price: 64,
    category: "objects",
    label: "New",
    desc: "A hand-finished ceramic form made to bring warmth to quiet spaces.",
    image:
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=85"
  },

  {
    id: 5,
    name: "Soft Everyday Knit",
    price: 142,
    category: "new",
    label: "New",
    desc: "Soft texture and an understated silhouette for everyday wear.",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85"
  },

  {
    id: 6,
    name: "Arc Sunglasses",
    price: 110,
    category: "objects",
    label: "",
    desc: "A precise timeless frame with a distinctly modern profile.",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85"
  },

  {
    id: 7,
    name: "Leather Card Holder",
    price: 79,
    category: "lifestyle",
    label: "",
    desc: "A minimal everyday essential finished in smooth leather.",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=85"
  },

  {
    id: 8,
    name: "Sculptural Vessel",
    price: 58,
    category: "objects",
    label: "",
    desc: "A simple sculptural vessel for flowers, branches or nothing at all.",
    image:
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=900&q=85"
  }

];


/* =========================================
   STATE
========================================= */

let cart =
  JSON.parse(
    localStorage.getItem("maison-cart") || "[]"
  );

let selected = null;


/* =========================================
   HELPERS
========================================= */

const $ = selector =>
  document.querySelector(selector);

const $$ = selector =>
  [...document.querySelectorAll(selector)];

const money = number =>
  `$${number.toFixed(2)}`;


/* =========================================
   TOAST
========================================= */

function toast(message) {

  const toastElement =
    $("#toast");

  toastElement.textContent =
    message;

  toastElement.classList.add("show");

  setTimeout(() => {

    toastElement.classList.remove("show");

  }, 2200);
}


/* =========================================
   SAVE CART
========================================= */

function saveCart() {

  localStorage.setItem(
    "maison-cart",
    JSON.stringify(cart)
  );

  renderBag();
}


/* =========================================
   RENDER PRODUCTS
========================================= */

function renderProducts(list = products) {

  $("#productCount").textContent =
    `${list.length} pieces`;

  $("#products").innerHTML =
    list.map(product => `

      <article
        class="product-card"
        data-id="${product.id}"
      >

        <div
          class="product-image"
          style="background-image:url('${product.image}')"
        >

          ${
            product.label
              ? `<span class="badge">${product.label}</span>`
              : ""
          }

          <button
            class="heart"
            data-heart="${product.id}"
            aria-label="Wishlist"
          >
            ♡
          </button>

          <button
            class="quick-add"
            data-add="${product.id}"
          >
            Add to bag
          </button>

        </div>


        <div class="product-info">

          <h3>
            ${product.name}
          </h3>

          <p class="category">
            ${product.category}
          </p>

          <p class="price">
            ${money(product.price)}
          </p>

        </div>

      </article>

    `).join("");
}


/* =========================================
   RENDER CART
========================================= */

function renderBag() {

  const count =
    cart.reduce(
      (sum, item) =>
        sum + item.qty,
      0
    );

  $("#bagCount").textContent =
    count;


  if (!cart.length) {

    $("#bagItems").innerHTML =
      "";

    $("#bagEmpty").style.display =
      "block";

    $("#subtotal").textContent =
      "$0.00";

    return;
  }


  $("#bagEmpty").style.display =
    "none";


  $("#bagItems").innerHTML =
    cart.map(item => `

      <div class="bag-row">

        <div
          class="bag-thumb"
          style="background-image:url('${item.image}')"
        ></div>


        <div>

          <h4>
            ${item.name}
          </h4>

          <p>
            ${money(item.price)}
          </p>


          <div class="quantity">

            <button
              data-qty="${item.id}"
              data-change="-1"
            >
              −
            </button>

            <span>
              ${item.qty}
            </span>

            <button
              data-qty="${item.id}"
              data-change="1"
            >
              +
            </button>

          </div>

        </div>


        <button
          class="remove"
          data-remove="${item.id}"
        >
          Remove
        </button>

      </div>

    `).join("");


  const subtotal =
    cart.reduce(
      (sum, item) =>
        sum + item.price * item.qty,
      0
    );


  $("#subtotal").textContent =
    money(subtotal);
}


/* =========================================
   ADD TO CART
========================================= */

function addToCart(id) {

  const product =
    products.find(
      product =>
        product.id === id
    );


  if (!product) return;


  const existing =
    cart.find(
      item =>
        item.id === id
    );


  if (existing) {

    existing.qty++;

  } else {

    cart.push({
      ...product,
      qty: 1
    });

  }


  saveCart();


  toast(
    `${product.name} added to your bag`
  );
}


/* =========================================
   OPEN BAG
========================================= */

function openBag() {

  $("#bag").classList.add(
    "open"
  );

  $("#overlay").classList.add(
    "show"
  );

  document.body.classList.add(
    "lock"
  );
}


/* =========================================
   CLOSE BAG
========================================= */

function closeBag() {

  $("#bag").classList.remove(
    "open"
  );

  $("#overlay").classList.remove(
    "show"
  );

  document.body.classList.remove(
    "lock"
  );
}


/* =========================================
   PRODUCT MODAL
========================================= */

function openProduct(id) {

  selected =
    products.find(
      product =>
        product.id === id
    );


  if (!selected) return;


  $("#modalImage").style.backgroundImage =
    `url('${selected.image}')`;

  $("#modalCategory").textContent =
    selected.category;

  $("#modalName").textContent =
    selected.name;

  $("#modalPrice").textContent =
    money(selected.price);

  $("#modalDescription").textContent =
    selected.desc;


  $("#productModal").classList.add(
    "open"
  );
}


function closeProduct() {

  $("#productModal")
    .classList.remove("open");
}


/* =========================================
   SEARCH
========================================= */

function openSearch() {

  $("#search")
    .classList.add("open");

  $("#searchInput")
    .focus();
}


function closeSearch() {

  $("#search")
    .classList.remove("open");
}


/* =========================================
   INITIAL RENDER
========================================= */

renderProducts();

renderBag();


/* =========================================
   PRODUCT CLICK EVENTS
========================================= */

$("#products")
  .addEventListener(
    "click",
    event => {

      const addButton =
        event.target.closest(
          "[data-add]"
        );

      const heart =
        event.target.closest(
          "[data-heart]"
        );

      const card =
        event.target.closest(
          ".product-card"
        );


      if (addButton) {

        event.stopPropagation();

        addToCart(
          Number(
            addButton.dataset.add
          )
        );

        return;
      }


      if (heart) {

        event.stopPropagation();

        heart.classList.toggle(
          "active"
        );


        heart.textContent =
          heart.classList.contains(
            "active"
          )
            ? "♥"
            : "♡";

        return;
      }


      if (card) {

        openProduct(
          Number(card.dataset.id)
        );

      }

    }
  );


/* =========================================
   FILTERS
========================================= */

$("#filters")
  .addEventListener(
    "click",
    event => {

      const filter =
        event.target.closest(
          ".filter"
        );


      if (!filter) return;


      $$(".filter")
        .forEach(button =>
          button.classList.remove(
            "active"
          )
        );


      filter.classList.add(
        "active"
      );


      const category =
        filter.dataset.category;


      if (category === "all") {

        renderProducts(
          products
        );

        return;
      }


      renderProducts(
        products.filter(
          product =>
            product.category ===
            category
        )
      );

    }
  );


/* =========================================
   CATEGORY CARDS
========================================= */

$$(".category-card")
  .forEach(card => {

    card.addEventListener(
      "click",
      () => {

        const category =
          card.dataset.jump;


        $$(".filter")
          .forEach(filter => {

            filter.classList.toggle(
              "active",
              filter.dataset.category ===
              category
            );

          });


        renderProducts(
          products.filter(
            product =>
              product.category ===
              category
          )
        );


        $("#shop")
          .scrollIntoView({
            behavior: "smooth"
          });

      }
    );

  });


/* =========================================
   CART CONTROLS
========================================= */

$("#bagItems")
  .addEventListener(
    "click",
    event => {

      const remove =
        event.target.closest(
          "[data-remove]"
        );

      const quantity =
        event.target.closest(
          "[data-qty]"
        );


      if (remove) {

        cart =
          cart.filter(
            item =>
              item.id !==
              Number(
                remove.dataset.remove
              )
          );


        saveCart();

      }


      if (quantity) {

        const item =
          cart.find(
            product =>
              product.id ===
              Number(
                quantity.dataset.qty
              )
          );


        if (!item) return;


        item.qty +=
          Number(
            quantity.dataset.change
          );


        if (item.qty <= 0) {

          cart =
            cart.filter(
              product =>
                product.id !==
                item.id
            );

        }


        saveCart();

      }

    }
  );


/* =========================================
   BAG
========================================= */

$("#bagOpen")
  .addEventListener(
    "click",
    openBag
  );


$("#bagClose")
  .addEventListener(
    "click",
    closeBag
  );


$("#overlay")
  .addEventListener(
    "click",
    closeBag
  );


/* =========================================
   SEARCH
========================================= */

$("#searchOpen")
  .addEventListener(
    "click",
    openSearch
  );


$("#searchClose")
  .addEventListener(
    "click",
    closeSearch
  );


$("#searchInput")
  .addEventListener(
    "input",
    event => {

      const query =
        event.target.value
          .toLowerCase()
          .trim();


      if (!query) {

        $("#searchResults")
          .innerHTML = "";

        return;
      }


      const results =
        products
          .filter(product =>

            (
              product.name +
              " " +
              product.category
            )
              .toLowerCase()
              .includes(query)

          )
          .slice(0, 7);


      if (!results.length) {

        $("#searchResults")
          .innerHTML = `
            <p style="
              padding:25px 0;
              color:#81766c;
            ">
              Nothing found.
            </p>
          `;

        return;
      }


      $("#searchResults")
        .innerHTML =
        results.map(product => `

          <button
            class="search-result"
            data-result="${product.id}"
          >

            <img
              src="${product.image}"
              alt=""
            >

            <div>

              <h4>
                ${product.name}
              </h4>

              <p>
                ${money(product.price)}
              </p>

            </div>

          </button>

        `).join("");

    }
  );


$("#searchResults")
  .addEventListener(
    "click",
    event => {

      const result =
        event.target.closest(
          "[data-result]"
        );


      if (!result) return;


      closeSearch();


      openProduct(
        Number(
          result.dataset.result
        )
      );

    }
  );


/* =========================================
   PRODUCT MODAL
========================================= */

$("#modalClose")
  .addEventListener(
    "click",
    closeProduct
  );


$("#productModal")
  .addEventListener(
    "click",
    event => {

      if (
        event.target.id ===
        "productModal"
      ) {

        closeProduct();

      }

    }
  );


$("#modalAdd")
  .addEventListener(
    "click",
    () => {

      if (!selected) return;

      addToCart(
        selected.id
      );

      closeProduct();

    }
  );


/* =========================================
   MOBILE MENU
========================================= */

$("#menuOpen")
  .addEventListener(
    "click",
    () => {

      const nav =
        $("#mobileNav");


      nav.style.display =
        nav.style.display === "flex"
          ? "none"
          : "flex";

    }
  );


$("#mobileNav")
  .addEventListener(
    "click",
    event => {

      if (
        event.target.tagName ===
        "A"
      ) {

        $("#mobileNav")
          .style.display =
          "none";

      }

    }
  );


/* =========================================
   NEWSLETTER
========================================= */

$("#newsletter")
  .addEventListener(
    "submit",
    event => {

      event.preventDefault();

      toast(
        "Welcome to Maison."
      );

      event.target.reset();

    }
  );


/* =========================================
   ACCOUNT
========================================= */

$("#accountBtn")
  .addEventListener(
    "click",
    () => {

      toast(
        "Account features will connect to the backend."
      );

    }
  );


/* =========================================
   CHECKOUT
========================================= */

$("#checkout")
  .addEventListener(
    "click",
    () => {

      if (!cart.length) {

        toast(
          "Your bag is empty."
        );

        return;
      }


      toast(
        "Checkout will connect to the backend next."
      );

    }
  );


/* =========================================
   HEADER SCROLL
========================================= */

window.addEventListener(
  "scroll",
  () => {

    $("#header")
      .classList.toggle(
        "scrolled",
        window.scrollY > 20
      );

  }
);


/* =========================================
   ESCAPE KEY
========================================= */

document.addEventListener(
  "keydown",
  event => {

    if (event.key === "Escape") {

      closeBag();

      closeSearch();

      closeProduct();

    }

  }
);