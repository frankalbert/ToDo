"use strict";

let listadoElementos = window.localStorage,
  arregloElementos = [],
  contenido = document.querySelector(".cuerpo__tabla"),
  ventanaModal = document.getElementById("ventana__modal");
  
class Tareas { /*
  constructor(nombre, fecha) {
    this.nombre = nombre;
    this.fecha = fecha;
  } */
  
  crearTarea(nombre, fecha) {
    listadoElementos.getItem("arregloElementos") ? (
      arregloElementos = JSON.parse(listadoElementos.getItem("arregloElementos"))
    ) : ('');

    nombre = document.getElementById("nombreTarea").value;
    fecha = document.getElementById("fechaTarea").value;
    let st = { nombre: nombre, fecha: fecha };

    if (nombre !== "" || fecha !== "") {
      arregloElementos.push(st);
    }
    listadoElementos.setItem(
      "arregloElementos",
      JSON.stringify(arregloElementos)
    );
  }

  modificarTarea(id){
    let miElemento = JSON.parse(listadoElementos.getItem("arregloElementos")),
      nombre = document.getElementById("nombreTarea"),
      fecha = document.getElementById("fechaTarea");

      nombre.value = miElemento[id].nombre;
      fecha.value = miElemento[id].fecha;

    document.getElementById("modificar").onclick = function() {
      miElemento[id].nombre = nombre.value;
      miElemento[id].fecha = fecha.value;
      listadoElementos.setItem(
        "arregloElementos",
        JSON.stringify(miElemento)
      );
      primeraTarea.listarTareas(id);
    };

  }

  eliminarTarea(id){
    let miElemento = JSON.parse(listadoElementos.getItem("arregloElementos")),
      nombre = document.getElementById("nombreTarea"),
      fecha = document.getElementById("fechaTarea");
   
      nombre.readOnly = true;
      fecha.readOnly = true;

      nombre.value = miElemento[id].nombre;
      fecha.value = miElemento[id].fecha;

      document.getElementById("eliminar").onclick = function() {
        miElemento.splice(id, 1);
        listadoElementos.setItem(
          "arregloElementos",
          JSON.stringify(miElemento)
        );
        primeraTarea.listarTareas();

      };
  
  }

  listarTareas(id) {
    contenido.innerHTML = "";
    let miArreglo = JSON.parse(listadoElementos.getItem("arregloElementos"));

    miArreglo.map(function(elemento, indice) {
      contenido.innerHTML += `
          <tr id="${indice}" >
              <th><i class="far fa-edit icono__tarea" onclick="mostrarVentanaModal(2, ${indice})" title="Modificar esta tarea"></i></th>
              <th>${elemento.nombre}</th>
              <th>${elemento.fecha
                .split("-")
                .reverse()
                .join("/")}</th>
              <th><i class="far fa-trash-alt icono__tarea" onclick="mostrarVentanaModal(3, ${indice})" title="Borrar esta tarea"></i></th>
          </tr>
        `;
    });
  }

}

let primeraTarea = new Tareas();

listadoElementos.getItem("arregloElementos") ? (
  primeraTarea.listarTareas()
) : ('');

document.getElementById("crear").addEventListener("click", function() {
  primeraTarea.crearTarea();
  primeraTarea.listarTareas();
});

function saberClick(e) {
  e.target.id === "cerrarModal" ||
  e.target.id === "cancelar" ||
  e.target.id === "crear" ||
  e.target.id === "modificar" ||
  e.target.id === "eliminar"
    ? cerrarModal()
    : "";
}

// Aquí ocultamos la ventana modal
function cerrarModal() {
  document.getElementById("nombreTarea").value = "";
  document.getElementById("fechaTarea").value = "";
  ventanaModal.style.opacity = 0;
  ventanaModal.style.zIndex = -1;
}

function mostrarVentanaModal(elemento, id) {
  let textoVentana = document.getElementById("contenido_ventana_modal"),
    nombre = document.getElementById("nombreTarea"),
    fecha = document.getElementById("fechaTarea");

  nombre.readOnly = false;
  fecha.readOnly = false;
  // Estamos pendiente de que se de un click en la ventana modal para luego averiguar donde se dio
  // click,, y llamar a la función saberClick()
  ventanaModal.addEventListener("click", saberClick);

  // Código para mostrar la ventana emergente
  ventanaModal.style.opacity = 1;
  ventanaModal.style.zIndex = 10;

  // Aquí preguntamos quien llamó a la función para mostrar el botón que me convenga
  Number(elemento) === 1
    ? ((document.getElementById("crear").style.display = "block"),
      (document.getElementById("modificar").style.display = "none"),
      (document.getElementById("eliminar").style.display = "none"),
      (textoVentana.innerHTML = `
          <h2>Crear Nueva Tarea</h2>
          <p>Datos de la nueva tarea</p>
      `))
    : Number(elemento) === 2
      ? ((document.getElementById("modificar").style.display = "block"),
        (document.getElementById("crear").style.display = "none"),
        (document.getElementById("eliminar").style.display = "none"),
        (textoVentana.innerHTML = `
          <h2>Modificar Tarea</h2>
          <p>Datos de la tarea</p>
      `),
        primeraTarea.modificarTarea(id))
      : ((document.getElementById("modificar").style.display = "none"),
        (document.getElementById("crear").style.display = "none"),
        (document.getElementById("eliminar").style.display = "block"),
        (textoVentana.innerHTML = `
          <h2>¿Desea eliminar esta tarea?</h2>
      `,
        primeraTarea.eliminarTarea(id)
    ));
}