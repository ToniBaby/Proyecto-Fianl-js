   function esSoloLetras(str) {
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(str);
  }
  // Función que valida si un número es positivo y menor que 100
  function esEdadValida(num) {
    return /^\d+$/.test(num) && num > 0 && num < 100;
  }
  
  // Preguntamos el nombre y validamos si es un nombre válido
  let nombre = prompt('Hola, ingrese su nombre: ');
  while (!esSoloLetras(nombre)) {
    nombre = prompt('Por favor, ingrese un nombre válido (solo letras): ');
  }
  
  // Guardamos el nombre en el LocalStorage
  localStorage.setItem('nombre', nombre);
  
  // Preguntamos la edad y validamos si es una edad válida
  let edad = prompt('Por favor, ingrese su edad: ');
  while (!esEdadValida(edad)) {
    edad = prompt('Por favor, ingrese una edad válida (número positivo menor que 100): ');
  }
  
  // Guardamos la edad en el LocalStorage
  localStorage.setItem('edad', edad);
  
  // Preguntamos la localidad y validamos si es una localidad válida
  let localidad = prompt('Por favor, ingrese su localidad: ');
  while (!esSoloLetras(localidad)) {
    localidad = prompt('Por favor, ingrese una localidad válida (solo letras): ');
  }
  
  // Guardamos la localidad en el LocalStorage
  localStorage.setItem('localidad', localidad);
  
  // Mostramos un mensaje de bienvenida y el nombre ingresado
  Swal.fire({
    title: 'Muy Bieeeen !',
    text: `Gracias por comprar en nuestra tienda, ${nombre}! Disfrute de su compra.`,
    imageUrl: './imagenes/mario.jpg',
    imageWidth: 200,
    imageHeight: 200,
    imageAlt: 'Iujuuuuuu',
  });
 
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let contenedor = document.getElementById("misprods");
let finalizarBtn = document.getElementById("finalizar"); 

    //
    let dolarVenta;
    obtenerDolar();

    //JSON
    let productos;
    obtenerJSON();

    //tratamiento si encontramos algo en un carrito abandonado
    (carrito.length != 0) && dibujarTabla();

    //Luxon
    const DateTime = luxon.DateTime;
    const inicio = DateTime.now(); //cuando ingresamos a la web
    console.log(inicio.toString());
    console.log(inicio.weekday);
    console.log(inicio.zoneName);
    console.log(inicio.daysInMonth);
    console.log(inicio.toLocaleString(DateTime.DATETIME_HUGE_WITH_SECONDS));


    //dibujo tabla si hay algo en el storage al comienzo
    function dibujarTabla(){
        for(const producto of carrito){
            document.getElementById("tablabody").innerHTML += `
            <tr>
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${producto.precio}</td>
                <td><button class="btn btn-light" onclick="eliminar(event)">🗑️</button></td>
            </tr>
        `;
        }
        totalCarrito = carrito.reduce((acumulador,producto)=> acumulador + producto.precio,0);
        let infoTotal = document.getElementById("total");
        infoTotal.innerText="Total a pagar u$: "+totalCarrito;
        //evaluamos si el dolar venta esta disponible


        let aPagarPesos = totalCarrito * dolarVenta || '   Total a pagar $: realizando conversion ...';
        console.log(aPagarPesos)
        infoTotal.innerText += '   Total a pagar $:' + aPagarPesos;
        //espero a que llegue la data
        setTimeout(() => {
            let aPagarPesos = totalCarrito * dolarVenta || '   Total a pagar $: realizando conversion ...';
            infoTotal.innerText='Total a pagar u$: '+totalCarrito+'   Total a pagar $: '+aPagarPesos;
        }, 2000);
    }

    //funcion para eliminar elementos del carro
    //Para eliminar prods del carro
    function eliminar(ev){
        console.log(ev);
        let fila = ev.target.parentElement.parentElement;
        console.log(fila);
        let id = fila.children[0].innerText;
        console.log(id);
        let indice = carrito.findIndex(producto => producto.id == id);
        console.log(indice)
        //remueve el producto del carro
        carrito.splice(indice,1);
        console.table(carrito);
        //remueve la fila de la tabla
        fila.remove();
        //recalcular el total
        let preciosAcumulados = carrito.reduce((acumulador,producto)=>acumulador+producto.precio,0);
        total.innerText="Total a pagar u$: "+preciosAcumulados;
      


        //storage
        localStorage.setItem("carrito",JSON.stringify(carrito));
    }


    function renderizarProductos(){
        for(const producto of productos){
            contenedor.innerHTML += `
                <div class="card col-sm-2">
                    <img src=${producto.foto} class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${producto.id}</h5>
                        <p class="card-text">${producto.nombre}</p>
                        <p class="card-text">U$ ${producto.precio}</p>
                        <button id='btn${producto.id}' class="btn btn-primary align-bottom">Comprar</button>
                    </div>
                </div>   
            `;
        }
        
        //EVENTOS
        productos.forEach((producto)=>{
            document.getElementById(`btn${producto.id}`).addEventListener('click',()=>{
                agregarACarrito(producto);
        });
    });
    }

    function agregarACarrito(prodAAgregar){
        carrito.push(prodAAgregar);
        console.table(carrito);
        
        //uso sweetAlert2
        Swal.fire({
            title: 'Fantastico !',
            text: `Agregaste ${prodAAgregar.nombre} al carrito ! 😉`,
            imageUrl: prodAAgregar.foto,
            imageWidth: 200,
            imageHeight: 200,
            imageAlt: prodAAgregar.nombre,
        });
        //agregar fila a la tabla de carrito
        document.getElementById('tablabody').innerHTML += `
            <tr>
                <td>${prodAAgregar.id}</td>
                <td>${prodAAgregar.nombre}</td>
                <td>${prodAAgregar.precio}</td>
                <td><button class="btn btn-light" onclick="eliminar(event)">🗑️</button></td>
            </tr>
        `;
        //incrementar el total
        let totalCarrito = carrito.reduce((acumulador,producto)=>acumulador+producto.precio,0);
        document.getElementById('total').innerText = 'Total a pagar u$: '+totalCarrito+'   Total a pagar $: '+totalCarrito * dolarVenta;
        //storage
        localStorage.setItem("carrito",JSON.stringify(carrito));
    }

    finalizarBtn.onclick=()=>{
        carrito=[];
        document.getElementById('tablabody').innerHTML='';
        document.getElementById('total').innerText = 'Total a pagar $:';
        Toastify({
            text: "Recibiras el pedido en las proximas 24 hs!",
            duration: 3000,
            gravity: 'up',
            position: 'bottom-right',
            style: {
                background: 'linear-gradient(to right, #00b09b, #96c92d)'
            }
        }).showToast();
        //luxon
        const fin = DateTime.now();
        const Interval = luxon.Interval;
        const tiempoParaComprar = Interval.fromDateTimes(inicio,fin);
        console.log(`Tiempo empleado en realizar la compra ${tiempoParaComprar.length('seconds')} segundos`);
        //storage NEW
        localStorage.removeItem("carrito");
    }

    //API
    function obtenerDolar(){
        const URLDOLAR='https://api.bluelytics.com.ar/v2/latest';
        fetch(URLDOLAR)
            .then((respuesta) => respuesta.json())
            .then((datos) => {
                const dolarBlue = datos.blue;
                console.log(dolarBlue);
                document.getElementById('fila_prueba').innerHTML += `
                    <p>Dolar compra: $ ${dolarBlue.value_buy} - Dolar venta: $ ${dolarBlue.value_sell}</p>
                `;
                dolarVenta = dolarBlue.value_sell;
            })
    }

    //JSON
    async function obtenerJSON(){
        const URLJSON = '/productos.json';
        const respuesta = await fetch(URLJSON);
        const data = await respuesta.json();
        productos = data;
        //ya tengo los productos, entonces llamo a renderizarlos
        renderizarProductos();
    }