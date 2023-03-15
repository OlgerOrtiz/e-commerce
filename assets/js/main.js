
// --------------------------------NAVBAR--------------------------------

function transitionNavbar() {
    const navbar = document.querySelector('header');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            navbar.classList.add('navbar__active');
        } else {
            navbar.classList.remove('navbar__active');
        }
    })
}
function handleNavbar() {
    const iconDashboard = document.querySelector('.bxs-dashboard');
    const dashboard = document.querySelector('.navbar__dashboard');

    iconDashboard.addEventListener('click', function () {
        dashboard.classList.toggle('dashboard__show')
    })
}
function handleDarkMode() {
    const iconThemeMoon = document.querySelector('.bx-moon');
    const iconThemeSun = document.querySelector('.bx-sun');

    iconThemeMoon.addEventListener('click', function () {
        if (document.body.classList.toggle('darkmode')) {
            const boton_add = document.getElementById("add");
            boton_add.style.display = "none";

            const boton_remove = document.getElementById("remove");
            boton_remove.style.display = "inline-block";
        }

    })
    iconThemeSun.addEventListener('click', function () {
        if (!document.body.classList.toggle('darkmode')) {
            const boton_remove = document.getElementById("remove");
            boton_remove.style.display = "none";

            const boton_add = document.getElementById("add");
            boton_add.style.display = "inline-block";
        }
    })
}


// -------------------------------PRODUCTOS-------------------------------
async function getProduct() {
    try {
        const data = await fetch(
            'https://ecommercebackend.fundamentos-29.repl.co/'
        );

        const res = await data.json();

        window.localStorage.setItem('products', JSON.stringify(res));

        return res;
    } catch (error) {
        console.log(error);
    }
}
function printProducts(dataBase) {
    const productsHTML = document.querySelector('.products');

    let html = '';

    dataBase.products.forEach(({ id, image, name, price, quantity }) => {
        html += `
                <div class="product">
                    <div class="product__img">
                        <img src="${image}" alt="product">
                    </div>
                    <div class="product__body">
                        <h3>$${price}.00 ${quantity ? `<span>Stock: ${quantity}</span>`
                : `<span class="soldOut"> Sold out</span>`}</h3> 
                        <p>${name}</p>
                        ${quantity ? `<i class='bx bx-plus' id="${id}"></i>` : ``}
                    </div>
                    
                </div>
        `;
    });

    productsHTML.innerHTML = html;
}

// --------------------------------------CART

function handleCartshow() {
    const iconCartHTML = document.querySelector('.bx-cart');
    const iconXHTML = document.querySelector('.bxs-x-circle');
    const cartHTML = document.querySelector('.cart');

    iconCartHTML.addEventListener('click', function () {
        cartHTML.classList.toggle('cart__show')
    })
    iconXHTML.addEventListener('click', function () {
        cartHTML.classList.toggle('cart__show')
    })
}

function addProductsToCart(dataBase) {
    const productsHTML = document.querySelector('.products');
    productsHTML.addEventListener('click', function (elements) {
        if (elements.target.classList.contains('bx-plus')) {
            const id = Number(elements.target.id);

            const productFind = dataBase.products.find(
                (product) => product.id === id);

            if (dataBase.cart[productFind.id]) {
                if (productFind.quantity === dataBase.cart[productFind.id].amount)
                    return alert('No hay más en Stock');

                dataBase.cart[productFind.id].amount++;
            } else {
                dataBase.cart[productFind.id] = { ...productFind, amount: 1 };
            }

            window.localStorage.setItem('cart', JSON.stringify(dataBase.cart));

            printProductsInCart(dataBase);
            printTotal(dataBase);
            handlePrintAmountProductsToCard(dataBase);
        }

    })
}

function printProductsInCart(dataBase) {
    const cardProducts = document.querySelector('.cart__products');
    let html = '';
    for (const product in dataBase.cart) {
        const { quantity, price, name, image, id, amount } = dataBase.cart[product];
        html += `
        
            <div class="card__product">
                <div class="card__product-img">
                    <img src="${image}" alt="image">
                </div>
                <div class="card__product-body">
                    <h4>${name}</h4>
                    <p>Stock: ${quantity} | <span>$${price}.00</span></p>
                    <p class='subTotal__product'>Subtotal: $${price * amount}.00</p>
                    <div class="card__product-lot" id='${id}'>
                        <i class='bx bx-minus'></i>
                        <span>${amount} Unit</span>
                        <i class='bx bx-plus'></i>
                        <i class='bx bx-trash-alt'></i>
                    </div>
                </div>
            </div>
        
        `;
    }
    cardProducts.innerHTML = html;
}

function handleAmountProductInCart(dataBase) {
    const cartProducts = document.querySelector('.cart__products');
    cartProducts.addEventListener('click', function (elements) {
        if (elements.target.classList.contains('bx-minus')) {
            const id = Number(elements.target.parentElement.id);
            if (dataBase.cart[id].amount === 1) {
                const response = confirm('¿Desea eliminar este producto?');
                if (!response) return;
                delete dataBase.cart[id];
            } else {
                dataBase.cart[id].amount--;
            }
        }
        if (elements.target.classList.contains('bx-plus')) {
            const id = Number(elements.target.parentElement.id);

            const productFind = dataBase.products.find(
                (product) => product.id === id);
            if (productFind.quantity === dataBase.cart[productFind.id].amount)
                return alert('No hay más en Stock');

            dataBase.cart[id].amount++;
        }
        if (elements.target.classList.contains('bx-trash-alt')) {
            const id = Number(elements.target.parentElement.id);
            const response = confirm('¿Desea eliminar este producto?');
            if (!response) return;
            delete dataBase.cart[id];
        }
        window.localStorage.setItem('cart', JSON.stringify(dataBase.cart));
        printProductsInCart(dataBase);
        printTotal(dataBase);

    });
    printProductsInCart(dataBase);
    printTotal(dataBase);
    handlePrintAmountProductsToCard(dataBase);
}

function printTotal(dataBase) {
    const items = document.querySelector('.items');
    const price = document.querySelector('.price');

    let totalItems = 0;
    let totalPrice = 0;
    for (const product in dataBase.cart) {
        const { amount, price } = dataBase.cart[product]
        totalItems += amount;
        totalPrice += price * amount;
    }
    items.textContent = totalItems + ' Items';
    price.textContent = '$' + totalPrice + ',00'
}
function handleStockTotal(dataBase) {
    const btnBuy = document.querySelector('.btn__buy');
    btnBuy.addEventListener('click', function () {
        if (!Object.values(dataBase.cart).length)
            return alert('Debe incluir al menos 1 producto.');

        const response = confirm('¿Desea realizar la compra?');
        if (!response) return;

        const currentProducts = [];

        for (const product of dataBase.products) {
            const lotProducts = dataBase.cart[product.id];
            if (product.id === lotProducts?.id) {
                currentProducts.push({
                    ...product,
                    quantity: product.quantity - lotProducts.amount,
                });
            } else {
                currentProducts.push(product);
            } 7
        }
        dataBase.products = currentProducts;
        dataBase.cart = {};

        window.localStorage.setItem('products', JSON.stringify(dataBase.products));
        window.localStorage.setItem('cart', JSON.stringify(dataBase.cart));

        printProductsInCart(dataBase);
        printTotal(dataBase);
        printProducts(dataBase);
        handlePrintAmountProductsToCard(dataBase);
    });
}

function handlePrintAmountProductsToCard(dataBase) {
    const amountProducts = document.querySelector('.amountProducts');
    let amount = 0;
        for (const product in dataBase.cart) {
            amount += dataBase.cart[product].amount;

        }
        amountProducts.textContent = amount;
}


// ------------------------------------MAIN

async function main() {
    const dataBase = {
        products:
            JSON.parse(window.localStorage.getItem('products')) ||
            (await getProduct()),
        cart: JSON.parse(window.localStorage.getItem('cart')) || {},
    };
    transitionNavbar();
    handleNavbar();
    handleDarkMode();

    printProducts(dataBase);

    handleCartshow();
    addProductsToCart(dataBase);
    printProductsInCart(dataBase);
    handleAmountProductInCart(dataBase);
    printTotal(dataBase);
    handleStockTotal(dataBase);
    handlePrintAmountProductsToCard(dataBase);

    

}
main();

