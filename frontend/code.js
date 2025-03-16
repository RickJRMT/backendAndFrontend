// Definicion de variables
const url = 'http://localhost:3000/api/clientes/';
const contenedor = document.querySelector('tbody');
const modal = document.getElementById('modalCliente');
const formCliente = document.querySelector('form');
const nombre = document.getElementById('nombre');
const cedula = document.getElementById('documento'); // Aqui colocamos "documento" para coincidir con el HTML
const telefono = document.getElementById('telefono');
const correo = document.getElementById('correo');
const estatura = document.getElementById('estatura');
const edad = document.getElementById('edad');
const btnCrear = document.getElementById('btnCrear');
const closeBtn = document.querySelector('.close');
const closeBtnSecondary = document.querySelector('.close-btn');

let opcion = '';
let idForm = 0;

// Funciones del modal
btnCrear.onclick = function () {
    modal.style.display = "block";
    opcion = 'crear';
    nombre.value = '';
    cedula.value = '';
    telefono.value = '';
    correo.value = '';
    estatura.value = '';
    edad.value = '';
};

closeBtn.onclick = function () {
    modal.style.display = "none";
};

closeBtnSecondary.onclick = function () {
    modal.style.display = "none";
};

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

// Funcion para mostrar o listar los resultados obtenidos de la base de datos
const mostrar = (clientes) => {
    contenedor.innerHTML = '';
    clientes.forEach(clientes => {
        contenedor.innerHTML += `
        <tr>
            <td class = "visually-hidden">${clientes.id}</td>
            <td>${clientes.nombre}</td>
            <td>${clientes.cedula}</td>
            <td>${clientes.telefono}</td>
            <td>${clientes.correo}</td>
            <td>${clientes.estatura}</td>
            <td>${clientes.edad}</td>
            <td>
            <button class = "btn btn-primary btnEditar">Editar</button>
            <button class = "btn btn-primary btnBorrar">Borrar</button>
            </td>
        </tr>
        `;
    });
};

// Cargar datos
fetch(url)
    .then(response => response.json())
    .then(data => mostrar(data))
    .catch(error => console.log(error));

// Funciones para manejar eventos delegados
const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e);
        }
    });
};

// Procesamiento para borrar
on(document, 'click', '.btnBorrar', e => {
    const fila = e.target.closest('tr');
    const id = fila.cells[0].textContent;

    if (confirm('¿Estas seguro de que deseas eliminar este registro?')) {
        fetch(url + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Hay un error en la respuesta hacia el servidor');
                }
                return response.json();
            })
            .then(() => {
                fila.remove();
            })
            .catch(error => {
                console.error(`Error: ${error}`);
                alert('Hubo un error al tratar de eliminar el registro');
            });
    }
});

// Procedimiento para actualizar registros
on(document, 'click', '.btnEditar', e => {
    const fila = e.target.closest('tr');
    idForm = fila.cells[0].textContent;
    nombre.value = fila.cells[1].textContent;
    cedula.value = fila.cells[2].textContent;
    telefono.value = fila.cells[3].textContent;
    correo.value = fila.cells[4].textContent;
    estatura.value = fila.cells[5].textContent;
    edad.value = fila.cells[6].textContent;
    opcion = 'editar';
    modal.style.display = "block";
})

// Procedimiento para Crear y Editar
formCliente.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
        nombre: nombre.value,
        cedula: cedula.value,
        telefono: telefono.value,
        correo: correo.value,
        estatura: estatura.value,
        edad: edad.value
    };

    const method = opcion === 'crear' ? 'POST' : 'PUT';
    const endPoint = opcion === 'crear' ? url : url + idForm;

    fetch(endPoint, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            if (opcion === 'crear') {
                const nuevoCliente = [data];
                mostrar(nuevoCliente);
            } else {
                fetch(url)
                    .then(response => response.json())
                    .then(data => mostrar(data));
            }
            modal.style.display = "none";
        })
        .catch(error => {
            console.error(`Error: ${error}`);
            alert('Hubo un errro al procesar la solicitud')
        });
});

