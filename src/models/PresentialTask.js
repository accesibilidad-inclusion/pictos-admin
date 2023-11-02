class PresentialTask {
  constructor() {
    this.id = null;
    this.title = "";
    this.category = null;
    this.service = null;
    this.presential_venue = null;
    this.url = "";
    this.slug = "";
    this.tags_text = "";
    this.tags = [];
    this.steps = [];
    this.visible = 0;
    this.likes = 0;
    this.dislikes = 0;
    this.status = "";
    this.form_type = "";
    this.last_modified = null;
    this.hasPrerequisites = false;
    this.prerequisites = "";
  }

  set(task) {
    this.id = task.id;
    this.title = task.title;
    this.category = task.category
      ? {
          id: task.category.id,
          name: task.category.name,
          slug: task.category.slug
        }
      : null;
    this.service = task.service
      ? {
          id: task.service.id,
          name: task.service.name,
          slug: task.service.slug
        }
      : null;
    this.presential_venue = {
      id: task.presential_venue.id,
      name: task.presential_venue.name,
      slug: task.presential_venue.slug
    };
    this.url = task.url;
    this.slug = task.slug;
    this.tags_text = task.tags ? task.tags.join(", ") : "";
    this.tags = task.tags;
    this.steps = task.steps;
    this.visible = task.visible;
    this.likes = task.likes;
    this.dislikes = task.dislikes;
    this.status = task.status;
    this.form_type = task.form_type;
    this.last_modified = task.last_modified;
    this.hasPrerequisites = task.prerequisites !== "";
    this.prerequisites = task.prerequisites ?? "";
  }

  form() {
    let form = {
      title:
        this.status === "Enviado por usuario"
          ? "Tarea propuesta por usuario"
          : this.form_type === "duplicate"
          ? "Duplicar tarea presencial"
          : this.id
          ? "Editar tarea presencial"
          : "Agregar nueva tarea presencial",
      fields:
        this.status === "Enviado por usuario"
          ? [
              {
                id: "presential_venue",
                value: "name",
                label: "Nombre del lugar",
                type: "read"
              },
              {
                id: "service",
                value: "name",
                label: "Servicio al que pertenece",
                type: "read"
              },
              {
                id: "title",
                name: "titulo",
                label: "Titulo de la tarea",
                rules: "required|max:500",
                type: "text"
              },
              {
                id: "steps",
                label: "Pasos de la tarea",
                type: "iteration",
                value: "label"
              }
            ]
          : this.form_type === "venue"
          ? [
              {
                id: "title",
                name: "titulo",
                label: "Titulo de la tarea",
                rules: "required|max:500",
                type: "text"
              },
              {
                id: "tags_text",
                name: "sinonimos",
                label: "Sinónimos de búsqueda (Separados por coma)",
                rules: "",
                type: "text"
              },
              {
                id: "hasPrerequisites",
                name: "tiene prerrequisitos",
                label: "Tiene Prerrequisitos",
                rules: "",
                type: "switch"
              },
              {
                id: "prerequisites",
                name: "prerrequisitos",
                label: "Prerrequisitos",
                rules: this.hasPrerequisites ? "required" : "",
                type: "wysiwyg"
              }
            ]
          : [
              {
                id: "title",
                name: "titulo",
                label: "Titulo de la tarea",
                rules: "required|max:500",
                type: "text"
              },
              {
                id: "presential_venue",
                name: "lugar",
                label: "Lugar al que pertenece",
                rules: "required",
                type: "select",
                data: "venues",
                textOption: ["name"]
              },
              {
                id: "tags_text",
                name: "sinonimos",
                label: "Sinónimos de búsqueda (Separados por coma)",
                rules: "",
                type: "text"
              },
              {
                id: "hasPrerequisites",
                name: "tiene prerrequisitos",
                label: "Tiene Prerrequisitos",
                rules: "",
                type: "switch"
              },
              {
                id: "prerequisites",
                name: "prerrequisitos",
                label: "Prerrequisitos",
                rules: this.hasPrerequisites ? "required" : "",
                type: "wysiwyg"
              }
            ],
      actions:
        this.status == "Enviado por usuario"
          ? [
              {
                label: "Eliminar",
                color: "error",
                callback: "request",
                url: "api/presential_tasks/delete",
                method: "post",
                confirm: "¿Esta seguro de eliminar esta tarea?",
                emit: "updated"
              },
              {
                label: "Cancelar",
                color: "grey",
                callback: "cancel"
              },
              {
                label: "Agregar tarea",
                color: "primary",
                callback: "request",
                url: "api/presential_tasks/accept_contribution",
                method: "put",
                validate: true,
                emit: "updated"
              }
            ]
          : this.form_type === "duplicate"
          ? [
              {
                label: "Cancelar",
                color: "grey",
                callback: "cancel"
              },
              {
                label: "Duplicar tarea",
                color: "primary",
                callback: "request",
                url: "api/presential_tasks/duplicate",
                method: "post",
                validate: true,
                emit: "updated"
              }
            ]
          : [
              {
                label: "Cancelar",
                color: "grey",
                callback: "cancel"
              },
              {
                label: this.id ? "Actualizar tarea" : "Crear tarea",
                color: "primary",
                callback: "request",
                url: this.id ? "api/presential_tasks/update" : "api/presential_tasks/store",
                method: this.id ? "put" : "post",
                validate: true,
                emit: "updated"
              }
            ]
    };

    return form;
  }
}

export default PresentialTask;
