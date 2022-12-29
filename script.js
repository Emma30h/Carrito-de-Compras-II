const container = document.getElementById("container");
const tableBody = document.getElementById("tableBody");
const tableFooter = document.getElementById("footer");

const templateCards = document.getElementById("template-cards").content;
const templateCarrito = document.getElementById("template-carrito").content;
const templateFooter = document.querySelector(".template-footer").content;

const fragment = document.createDocumentFragment();
let carrito = {};

window.addEventListener("DOMContentLoaded", ()=>{
    fetchAPI();
    if(localStorage.getItem("carrito")){
        carrito = JSON.parse(localStorage.getItem("carrito"));
    }
    pintarCarrito();
});

container.addEventListener("click", (e)=>{
    añadirProducto(e);
});

tableBody.addEventListener("click", (e)=>{
    btnAccion(e);
});

const fetchAPI = async()=>{
    try {
        const response = await fetch(`api.json`);
        const data = await response.json();
        pintarProductos(data);
    } catch (error) {
        console.log(error);
    }
};

const pintarProductos = (productos)=>{
    productos.forEach(producto=>{
        templateCards.querySelector("img").setAttribute("src", producto.url);
        templateCards.querySelector("h2").textContent = producto.nombre;
        templateCards.querySelector("span").textContent = producto.precio;
        templateCards.querySelector("button").dataset.id = producto.id;

        const clone = templateCards.cloneNode(true);
        fragment.appendChild(clone);
    });
    container.appendChild(fragment);
};

const añadirProducto = (e)=>{
    if(e.target.classList.contains("btn-comprar")){
        setCarrito(e.target.parentElement);
    };
    e.stopPropagation();
};

const setCarrito = (objeto)=>{
    const producto = {
        id: objeto.querySelector("button").dataset.id,
        nombre: objeto.querySelector("h2").textContent,
        precio: objeto.querySelector("span").textContent,
        cantidad: 1
    };
    
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1;
    }

    carrito[producto.id] = {...producto};

    pintarCarrito();

    localStorage.setItem("carrito", JSON.stringify(carrito));
};

const pintarCarrito = ()=>{
    tableBody.innerHTML = "";
    Object.values(carrito).forEach(producto=>{
        console.log(producto.nombre);
        templateCarrito.querySelector("th").textContent = producto.id;
        templateCarrito.querySelectorAll("td")[0].textContent = producto.nombre;
        templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad;
        templateCarrito.querySelector(".btn-info").dataset.id = producto.id;
        templateCarrito.querySelector(".btn-danger").dataset.id = producto.id;
        templateCarrito.querySelector("span").textContent = producto.precio;

        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    });
    tableBody.appendChild(fragment);

    pintarFooter();
};

const pintarFooter = ()=>{
    tableFooter.innerHTML = "";
    if(Object.keys(carrito).length === 0){
        tableFooter.innerHTML = `
            <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `;
    }
    else{
        const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0);
        const nTotal = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio, 0);
    
        templateFooter.querySelectorAll("td")[0].textContent = nCantidad;
        templateFooter.querySelector("span").textContent = nTotal;

        const clone = templateFooter.cloneNode(true);
        fragment.appendChild(clone);
        tableFooter.appendChild(fragment);
    };

    const btnVaciar = document.getElementById("vaciar-carrito");
    console.log(btnVaciar);
    btnVaciar.addEventListener("click", ()=>{
        carrito = {};
        pintarCarrito();
    });
};

const btnAccion = (e)=>{
    if(e.target.classList.contains("btn-info")){
        carrito[e.target.dataset.id].cantidad++;
        pintarCarrito();
    };
    if(e.target.classList.contains("btn-danger")){
        carrito[e.target.dataset.id].cantidad--;
        if(carrito[e.target.dataset.id].cantidad === 0){
            delete carrito[e.target.dataset.id];
        }
        pintarCarrito();
    };
};

