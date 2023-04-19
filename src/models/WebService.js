class WebService {
  constructor() {
    this.id = null;
    this.name = "";
    this.category = null;
    this.service = null;
    this.url = "";
    this.slug = "";
    this.web_tasks = [];
    this.visible = 0;
    this.last_modified = null;
    this.status = "";
    this.form_type = "";
  }

  set(web_service) {
    this.id = web_service.id;
    this.name = web_service.name;
    this.category = web_service.category
      ? {
        id: web_service.category.id,
        name: web_service.category.name,
        slug: web_service.category.slug
      } : null;
    this.service = web_service.service
      ? {
          id: web_service.service.id,
          name: web_service.service.name,
          slug: web_service.service.slug
        }
      : null;
    this.url = web_service.url;
    this.slug = web_service.slug;
    this.web_tasks = web_service.web_tasks;
    this.status = web_service.status;
    this.visible = web_service.visible;
    this.last_modified = web_service.last_modified;
    this.form_type = web_service.form_type;
  }

  form() {
    let form = {
      title:
        this.id
          ? "Editar servicio web"
          : "Agregar nuevo servicio web",
      fields:
        this.form_type === "service"
          ? [
              {
                id: "name",
                name: "nombre",
                label: "Nombre del lugar",
                rules: "required|max:100",
                type: "text"
              }
            ]
          : [
              {
                id: "name",
                name: "nombre",
                label: "Nombre del lugar",
                rules: "required|max:100",
                type: "text"
              },
              {
                id: "service",
                name: "lugar",
                label: "Servicio al que pertenece",
                rules: "required",
                type: "select",
                data: "services",
                textOption: ["name"]
              }
            ],
      actions: [
        {
          label: "Cancelar",
          color: "grey",
          callback: "cancel"
        },
        {
          label: this.id ? "Actualizar servicio web" : "Crear servicio web",
          color: "primary",
          callback: "request",
          url: this.id ? "api/web_services/update" : "api/web_services/store",
          method: this.id ? "put" : "post",
          validate: true,
          emit: "updated"
        }
      ]
    };
    return form;
  }
}

export default WebService;
