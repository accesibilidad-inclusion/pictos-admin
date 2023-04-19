class WebTask {
  constructor() {
    this.id = null;
    this.title = "";
    this.category = null;
    this.service = null;
    this.web_service = null;
    this.url = "";
    this.slug = "";
    this.web_steps = [];
    this.visible = 0;
    this.status = "";
    this.form_type = "";
    this.last_modified = null;
  }

  set(web_task) {
    this.id = web_task.id;
    this.title = web_task.title;
    this.category = web_task.category
      ? {
          id: web_task.category.id,
          name: web_task.category.name,
          slug: web_task.category.slug
        }
      : null;
    this.service = web_task.service
      ? {
          id: web_task.service.id,
          name: web_task.service.name,
          slug: web_task.service.slug
        }
      : null;
    this.web_service = web_task.web_service ? {
      id: web_task.web_service.id,
      name: web_task.web_service.name,
      slug: web_task.web_service.slug
    } : null;
    this.url = web_task.url;
    this.slug = web_task.slug;
    this.web_steps = web_task.web_steps;
    this.visible = web_task.visible;
    this.status = web_task.status;
    this.form_type = web_task.form_type;
    this.last_modified = web_task.last_modified;
  }

  form() {
    let form = {
      title:
        this.status === "Enviado por usuario"
          ? "Tarea propuesta por usuario"
          : this.form_type === "duplicate"
          ? "Duplicar tarea"
          : this.id
          ? "Editar tarea"
          : "Agregar nueva tarea",
      fields:
        this.form_type === "web_task"
          ? [
              {
                id: "title",
                name: "titulo",
                label: "Titulo de la tarea web",
                rules: "required|max:500",
                type: "text"
              }
            ]
          : [
              {
                id: "title",
                name: "titulo",
                label: "Titulo de la tarea web",
                rules: "required|max:500",
                type: "text"
              },
              {
                id: "web_service",
                name: "servicio web",
                label: "Servicio web al que pertenece",
                rules: "required",
                type: "select",
                data: "web_services",
                textOption: ["name"]
              }
            ],
      actions:
        this.form_type === "duplicate"
          ? [
              {
                label: "Cancelar",
                color: "grey",
                callback: "cancel"
              },
              {
                label: "Duplicar tarea web",
                color: "primary",
                callback: "request",
                url: "api/web_tasks/duplicate",
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
                label: this.id ? "Actualizar tarea web" : "Crear tarea web",
                color: "primary",
                callback: "request",
                url: this.id ? "api/web_tasks/update" : "api/web_tasks/store",
                method: this.id ? "put" : "post",
                validate: true,
                emit: "updated"
              }
            ]
    };

    return form;
  }
}

export default WebTask;
