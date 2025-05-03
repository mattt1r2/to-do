let empleados = [];
let tareas = [];
let idTarea = 1;
let tabla;

$(document).ready(function () {
  tabla = $("#tablaTareas").DataTable({
    language: {
      search: "Buscar:",
      lengthMenu: "Mostrar _MENU_ registros",
      zeroRecords: "No se encontraron tareas",
      info: "Mostrando _START_ a _END_ de _TOTAL_ tareas",
      paginate: {
        first: "Primera",
        last: "Última",
        next: "Siguiente",
        previous: "Anterior"
      }
    }
  });

  $("#formEmpleado").validate({
    rules: {
      nombreEmpleado: {
        required: true,
        minlength: 5
      }
    },
    messages: {
      nombreEmpleado: {
        required: "El nombre del empleado es obligatorio.",
        minlength: "Debe tener al menos 5 caracteres."
      }
    },
    submitHandler: function () {
      const nombre = $("#nombreEmpleado").val();
      empleados.push(nombre);
      actualizarListaEmpleados();
      $("#nombreEmpleado").val("");
      alertify.success("Empleado agregado exitosamente");
    }
  });

  $("#formTarea").validate({
    rules: {
      descripcionTarea: {
        required: true,
        minlength: 5
      },
      empleadoAsignado: {
        required: true
      },
      prioridad: {
        required: true
      }
    },
    messages: {
      descripcionTarea: {
        required: "La descripción es obligatoria.",
        minlength: "Debe tener al menos 5 caracteres."
      },
      empleadoAsignado: {
        required: "Debe seleccionar un empleado."
      },
      prioridad: {
        required: "Debe seleccionar la prioridad."
      }
    },
    submitHandler: function () {
      const tarea = {
        id: idTarea++,
        descripcion: $("#descripcionTarea").val(),
        empleado: $("#empleadoAsignado").val(),
        prioridad: $("#prioridad").val(),
        estado: "pendiente",
        fecha: new Date().toLocaleString()
      };
      tareas.push(tarea);
      agregarTareaTabla(tarea);
      $("#formTarea")[0].reset();
      alertify.success("Tarea ingresada exitosamente");
    }
  });

  $("#tablaTareas tbody").on("click", ".eliminar-btn", function () {
    const id = $(this).data("id");
    alertify.confirm(
      "Confirmación",
      "¿Desea eliminar esta tarea?",
      function () {
        tareas = tareas.filter((t) => t.id !== id);
        tabla.row($(`tr[data-id="${id}"]`)).remove().draw();
        alertify.success("La tarea ha sido eliminada exitosamente");
      },
      function () {
        alertify.message("Acción cancelada");
      }
    ).set("labels", { ok: "Aceptar", cancel: "Cancelar" });
  });

  $("#tablaTareas tbody").on("change", ".estado-select", function () {
    const id = parseInt($(this).data("id"));
    const nuevoEstado = $(this).val();
    const tarea = tareas.find((t) => t.id === id);
    tarea.estado = nuevoEstado;

    const select = $(this);
    select
      .removeClass("estado-pendiente estado-en-proceso estado-finalizada")
      .addClass(`estado-${nuevoEstado}`);

    alertify.message(`Estado actualizado a: ${nuevoEstado.charAt(0).toUpperCase() + nuevoEstado.slice(1)}`);
  });
});

function actualizarListaEmpleados() {
  const select = $("#empleadoAsignado");
  select.empty().append('<option value="">Seleccione empleado</option>');
  empleados.forEach((e) => {
    select.append(`<option value="${e}">${e}</option>`);
  });
}

function agregarTareaTabla(tarea) {
  const prioridadClass = `prioridad-${tarea.prioridad}`;
  const estadoClass = `estado-${tarea.estado}`;

  const rowNode = tabla.row
    .add([
      tarea.id,
      tarea.descripcion,
      tarea.empleado,
      `<span class="${prioridadClass}">${tarea.prioridad.charAt(0).toUpperCase() + tarea.prioridad.slice(1)}</span>`,
      `<select class="form-select estado-select ${estadoClass}" data-id="${tarea.id}">
        <option value="pendiente" ${tarea.estado === "pendiente" ? "selected" : ""}>Pendiente</option>
        <option value="en-proceso" ${tarea.estado === "en-proceso" ? "selected" : ""}>En proceso</option>
        <option value="finalizada" ${tarea.estado === "finalizada" ? "selected" : ""}>Finalizada</option>
      </select>`,
      `<button class="btn btn-danger btn-sm eliminar-btn" data-id="${tarea.id}"><i class="bi bi-trash"></i> Eliminar</button>`
    ])
    .draw()
    .node();

  $(rowNode).attr("data-id", tarea.id);
} 
