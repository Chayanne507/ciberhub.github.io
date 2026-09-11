
/* =========================================
   PROVEEDORES
========================================= */

const vendors = {

  "NovaShield":{
    code:"SEC-014",
    name:"NovaShield",
    desc:"Especialistas en auditorías técnicas y protección de datos para pequeñas empresas en crecimiento.",
    rating:4.8,
    response:"< 2h",
    count:2
  },

  "Coclé InfoSec":{
    code:"SEC-002",
    name:"Coclé InfoSec",
    desc:"Equipo local enfocado en monitoreo continuo y cumplimiento normativo para PYMEs del interior.",
    rating:4.6,
    response:"< 4h",
    count:2
  },

  "Aguadulce Digital":{
    code:"SEC-021",
    name:"Aguadulce Digital",
    desc:"Capacitaciones prácticas de concientización en ciberseguridad para equipos pequeños.",
    rating:4.9,
    response:"< 1h",
    count:1
  },

  "CertPanamá":{
    code:"SEC-009",
    name:"CertPanamá",
    desc:"Hardening de sitios web y gestión de certificados para negocios que venden en línea.",
    rating:4.7,
    response:"< 3h",
    count:1
  }

};


/* =========================================
   SERVICIOS
========================================= */

const services = [

  {
    vendorKey:"NovaShield",
    cat:"auditoria",
    name:"Auditoría de vulnerabilidades básica",
    desc:"Escaneo de puertos, revisión de configuración de servidores y reporte priorizado de hallazgos.",
    price:180,
    unit:"pago único"
  },

  {
    vendorKey:"Coclé InfoSec",
    cat:"monitoreo",
    name:"Monitoreo perimetral 24/7",
    desc:"Alertas en tiempo real ante intentos de intrusión y accesos anómalos a tu red.",
    price:65,
    unit:"por mes"
  },

  {
    vendorKey:"Aguadulce Digital",
    cat:"capacitacion",
    name:"Taller anti-phishing para tu equipo",
    desc:"Sesión de 2 horas con simulacro de correo malicioso incluido, para hasta 15 empleados.",
    price:95,
    unit:"por sesión"
  },

  {
    vendorKey:"CertPanamá",
    cat:"infraestructura",
    name:"Certificado SSL + hardening del sitio",
    desc:"Instalación de certificado, configuración de cabeceras de seguridad y prueba de carga.",
    price:120,
    unit:"pago único"
  },

  {
    vendorKey:"NovaShield",
    cat:"infraestructura",
    name:"Respaldo automático anti-ransomware",
    desc:"Backups cifrados diarios con retención de 30 días y prueba de restauración mensual.",
    price:55,
    unit:"por mes"
  },

  {
    vendorKey:"Coclé InfoSec",
    cat:"auditoria",
    name:"Revisión de cumplimiento de datos",
    desc:"Checklist de manejo de datos de clientes conforme a buenas prácticas locales.",
    price:150,
    unit:"pago único"
  }

];


services.forEach((service,index)=>{
  service.id=index;
});


/* =========================================
   VARIABLES
========================================= */

const grid =
  document.getElementById('grid');

const emptyState =
  document.getElementById('empty-state');

const resultsCount =
  document.getElementById('results-count');

const cartCountEl =
  document.getElementById('cart-count');

const searchInput =
  document.getElementById('search-input');

const sortSelect =
  document.getElementById('sort-select');


let currentCat = 'todos';

let currentSearch = '';

let currentSort = 'relevancia';

let cart = [];


/* =========================================
   FILTRADO
========================================= */

function getFiltered(){

  let list =
    currentCat === 'todos'
      ? services.slice()
      : services.filter(
          service =>
            service.cat === currentCat
        );


  if(currentSearch.trim()){

    const query =
      currentSearch.trim().toLowerCase();

    list =
      list.filter(service => {

        const vendor =
          vendors[service.vendorKey];

        return (

          service.name
            .toLowerCase()
            .includes(query)

          ||

          service.desc
            .toLowerCase()
            .includes(query)

          ||

          service.cat
            .toLowerCase()
            .includes(query)

          ||

          vendor.name
            .toLowerCase()
            .includes(query)

        );

      });

  }


  if(currentSort === 'precio-asc'){

    list.sort(
      (a,b)=>
        a.price-b.price
    );

  }


  if(currentSort === 'precio-desc'){

    list.sort(
      (a,b)=>
        b.price-a.price
    );

  }


  if(currentSort === 'calificacion'){

    list.sort(
      (a,b)=>
        vendors[b.vendorKey].rating -
        vendors[a.vendorKey].rating
    );

  }


  return list;

}


/* =========================================
   RENDERIZAR CATÁLOGO
========================================= */

function render(){

  const list =
    getFiltered();


  const providerCount =
    new Set(
      list.map(
        service =>
          service.vendorKey
      )
    ).size;


  resultsCount.textContent =
    `${list.length} servicio${list.length === 1 ? '' : 's'} de ${providerCount} proveedor${providerCount === 1 ? '' : 'es'}`;


  if(list.length === 0){

    grid.style.display='none';

    emptyState.style.display='block';

    return;

  }


  grid.style.display='grid';

  emptyState.style.display='none';


  grid.innerHTML =
    list.map(service => {

      const vendor =
        vendors[service.vendorKey];

      const inCart =
        cart.includes(service.id);


      return `

        <div class="card">

          <div class="card-top">

            <button
              class="vendor mono"
              data-vendor="${service.vendorKey}"
              type="button"
              aria-label="Ver perfil de ${vendor.name}"
            >
              ${vendor.code} · ${vendor.name}
            </button>

            <span
              class="verified"
              aria-label="Proveedor verificado"
            >
              ✓ verificado
            </span>

          </div>


          <h3>
            ${service.name}
          </h3>


          <p>
            ${service.desc}
          </p>


          <div class="card-foot">

            <div class="price">

              $${service.price.toFixed(2)}

              <span>
                ${service.unit}
              </span>

            </div>


            <button
              class="add-btn ${inCart ? 'added' : ''}"
              data-id="${service.id}"
              type="button"
              aria-label="${inCart ? 'Quitar' : 'Agregar'} ${service.name} ${inCart ? 'del carrito' : 'al carrito'}"
              aria-pressed="${inCart}"
            >

              ${inCart ? 'Agregado ✓' : 'Agregar'}

            </button>

          </div>

        </div>

      `;

    }).join('');


  /* BOTONES AGREGAR */

  grid
    .querySelectorAll('.add-btn')
    .forEach(button => {

      button.addEventListener(
        'click',
        () => {

          const id =
            Number(button.dataset.id);

          toggleCart(id);

          render();

        }
      );

    });


  /* PROVEEDORES */

  grid
    .querySelectorAll('.vendor')
    .forEach(button => {

      button.addEventListener(
        'click',
        () => {

          openVendor(
            button.dataset.vendor
          );

        }
      );

    });

}


/* =========================================
   CARRITO
========================================= */

function toggleCart(id){

  const index =
    cart.indexOf(id);


  if(index === -1){

    cart.push(id);

  }else{

    cart.splice(index,1);

  }


  updateCartCount();

}


function updateCartCount(){

  cartCountEl.textContent =
    cart.length;

}


/* =========================================
   MODAL CARRITO
========================================= */

const cartOverlay =
  document.getElementById(
    'cart-overlay'
  );

const cartBody =
  document.getElementById(
    'cart-body'
  );


function openCart(){

  renderCart();

  cartOverlay.classList.add(
    'open'
  );

  cartOverlay.setAttribute(
    'aria-hidden',
    'false'
  );

}


function renderCart(){

  if(cart.length === 0){

    cartBody.innerHTML = `

      <p class="cart-empty">

        Tu carrito está vacío.
        Explora el catálogo y agrega un servicio.

      </p>

    `;

    return;

  }


  const items =
    cart
      .map(id =>
        services.find(
          service =>
            service.id === id
        )
      )
      .filter(Boolean);


  const subtotal =
    items.reduce(
      (total,service) =>
        total + service.price,
      0
    );


  const itbms =
    subtotal * 0.07;


  const total =
    subtotal + itbms;


  cartBody.innerHTML =

    items.map(service => `

      <div class="cart-item">

        <div>

          <p class="cart-item-name">
            ${service.name}
          </p>

          <span class="cart-item-vendor">

            ${vendors[service.vendorKey].code}
            ·
            ${vendors[service.vendorKey].name}

          </span>

          <br>

          <button
            class="cart-remove"
            data-id="${service.id}"
            type="button"
            aria-label="Eliminar ${service.name} del carrito"
          >
            Quitar
          </button>

        </div>


        <div class="cart-item-price">

          $${service.price.toFixed(2)}

        </div>

      </div>

    `).join('')


    + `

      <div class="cart-summary">

        <div class="cart-summary-row">

          <span>
            Subtotal
          </span>

          <span>
            $${subtotal.toFixed(2)}
          </span>

        </div>


        <div class="cart-summary-row">

          <span>
            ITBMS (7%)
          </span>

          <span>
            $${itbms.toFixed(2)}
          </span>

        </div>


        <div class="cart-summary-row total">

          <span>
            Total
          </span>

          <span>
            $${total.toFixed(2)}
          </span>

        </div>

      </div>

    `;


  cartBody
    .querySelectorAll('.cart-remove')
    .forEach(button => {

      button.addEventListener(
        'click',
        () => {

          const id =
            Number(button.dataset.id);

          toggleCart(id);

          renderCart();

          render();

        }
      );

    });

}


/* ABRIR CARRITO */

document
  .getElementById('cart-btn')
  .addEventListener(
    'click',
    openCart
  );


/* CERRAR CARRITO */

document
  .getElementById('cart-close')
  .addEventListener(
    'click',
    () => {

      cartOverlay.classList.remove(
        'open'
      );

      cartOverlay.setAttribute(
        'aria-hidden',
        'true'
      );

    }
  );


cartOverlay.addEventListener(
  'click',
  event => {

    if(event.target === cartOverlay){

      cartOverlay.classList.remove(
        'open'
      );

      cartOverlay.setAttribute(
        'aria-hidden',
        'true'
      );

    }

  }
);


/* =========================================
   CATEGORÍAS
========================================= */

document
  .querySelectorAll('.cat-btn')
  .forEach(button => {

    button.addEventListener(
      'click',
      () => {

        document
          .querySelectorAll('.cat-btn')
          .forEach(btn => {

            btn.classList.remove(
              'active'
            );

            btn.setAttribute(
              'aria-pressed',
              'false'
            );

          });


        button.classList.add(
          'active'
        );

        button.setAttribute(
          'aria-pressed',
          'true'
        );


        currentCat =
          button.dataset.cat;


        render();

      }
    );

  });


/* =========================================
   BUSCADOR
========================================= */

searchInput.addEventListener(
  'input',
  event => {

    currentSearch =
      event.target.value;

    render();

  }
);


/* =========================================
   ORDENAMIENTO
========================================= */

sortSelect.addEventListener(
  'change',
  event => {

    currentSort =
      event.target.value;

    render();

  }
);


/* =========================================
   PERFIL PROVEEDOR
========================================= */

const vendorOverlay =
  document.getElementById(
    'vendor-overlay'
  );


function openVendor(key){

  const vendor =
    vendors[key];


  document
    .getElementById('vendor-title')
    .textContent =
      vendor.name;


  const fullStars =
    Math.round(vendor.rating);


  const emptyStars =
    5 - fullStars;


  document
    .getElementById('vendor-body')
    .innerHTML = `

      <div
        class="mono"
        style="
          color:var(--muted);
          font-size:12px;
        "
      >
        ${vendor.code}
      </div>


      <div class="vendor-rating">

        ${'★'.repeat(fullStars)}
        ${'☆'.repeat(emptyStars)}

        ${vendor.rating.toFixed(1)}

      </div>


      <p
        style="
          color:var(--muted);
          font-size:14px;
        "
      >

        ${vendor.desc}

      </p>


      <div class="vendor-stats">

        <div>

          <b>
            ${vendor.response}
          </b>

          tiempo promedio de respuesta

        </div>


        <div>

          <b>
            ${vendor.count}
          </b>

          servicio${vendor.count === 1 ? '' : 's'}
          ofrecido${vendor.count === 1 ? '' : 's'}

        </div>


        <div>

          <b>
            ✓
          </b>

          verificado

        </div>

      </div>

    `;


  vendorOverlay.classList.add(
    'open'
  );

  vendorOverlay.setAttribute(
    'aria-hidden',
    'false'
  );

}


document
  .getElementById('vendor-close')
  .addEventListener(
    'click',
    () => {

      vendorOverlay.classList.remove(
        'open'
      );

      vendorOverlay.setAttribute(
        'aria-hidden',
        'true'
      );

    }
  );


vendorOverlay.addEventListener(
  'click',
  event => {

    if(event.target === vendorOverlay){

      vendorOverlay.classList.remove(
        'open'
      );

      vendorOverlay.setAttribute(
        'aria-hidden',
        'true'
      );

    }

  }
);


/* =========================================
   FORMULARIO SOY PROVEEDOR
========================================= */

const providerOverlay =
  document.getElementById(
    'provider-overlay'
  );

const providerForm =
  document.getElementById(
    'provider-form'
  );

const providerSuccess =
  document.getElementById(
    'pf-success'
  );


/* ABRIR */

document
  .getElementById('provider-btn')
  .addEventListener(
    'click',
    () => {

      providerOverlay.classList.add(
        'open'
      );

      providerOverlay.setAttribute(
        'aria-hidden',
        'false'
      );

    }
  );


/* CERRAR */

document
  .getElementById('provider-close')
  .addEventListener(
    'click',
    () => {

      providerOverlay.classList.remove(
        'open'
      );

      providerOverlay.setAttribute(
        'aria-hidden',
        'true'
      );

    }
  );


providerOverlay.addEventListener(
  'click',
  event => {

    if(event.target === providerOverlay){

      providerOverlay.classList.remove(
        'open'
      );

      providerOverlay.setAttribute(
        'aria-hidden',
        'true'
      );

    }

  }
);


/* VALIDAR FORMULARIO */

providerForm.addEventListener(
  'submit',
  event => {

    event.preventDefault();


    if(!providerForm.checkValidity()){

      providerForm.reportValidity();

      return;

    }


    providerSuccess.style.display =
      'flex';


    providerForm
      .querySelectorAll(
        'input, textarea, button[type="submit"]'
      )
      .forEach(element => {

        element.disabled = true;

      });

  }
);


/* =========================================
   ESCAPE PARA CERRAR
========================================= */

document.addEventListener(
  'keydown',
  event => {

    if(event.key !== 'Escape'){
      return;
    }


    cartOverlay.classList.remove(
      'open'
    );

    vendorOverlay.classList.remove(
      'open'
    );

    providerOverlay.classList.remove(
      'open'
    );


    cartOverlay.setAttribute(
      'aria-hidden',
      'true'
    );

    vendorOverlay.setAttribute(
      'aria-hidden',
      'true'
    );

    providerOverlay.setAttribute(
      'aria-hidden',
      'true'
    );

  }
);


/* =========================================
   INICIAR
========================================= */

render();

updateCartCount();
