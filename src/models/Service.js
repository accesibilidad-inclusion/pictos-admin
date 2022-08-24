class Service {
  constructor() {
    this.id = null;
    this.name = "";
    this.url = "";
    this.category = null;
    this.venues = [];
    this.tags_text = "";
    this.tags = [];
    this.last_modified = null;
    this.status = "";
  }

  set(service) {
    this.id = service.id;
    this.name = service.name;
    this.url = service.url;
    this.category = {
      id: service.category.id,
      name: service.category.name
    };
    this.venues = service.venues;
    this.tags_text = service.tags.join(", ");
    this.tags = service.tags;
    this.last_modified = service.last_modified;
    this.status = service.status;
  }

  form() {
    let form = {
      title: this.id ? "Editar servicio" : "Agregar nuevo servicio",
      fields: [
        {
          id: "name",
          name: "nombre",
          label: "Nombre del servicio",
          rules: "required|max:100",
          type: "text"
        },
        {
          id: "category",
          name: "categoria",
          label: "Categoria",
          rules: "required",
          type: "select",
          data: "categories",
          textOption: ["name"]
        },
        {
          id: "url",
          name: "url",
          label: "Url",
          rules: "url",
          type: "text"
        },
        {
          id: "tags_text",
          name: "sinonimos",
          label: "Sinónimos de búsqueda (Separados por coma)",
          rules: "",
          type: "text"
        }
      ],
      actions: [
        {
          label: "Cancelar",
          color: "grey",
          callback: "cancel"
        },
        {
          label: this.id ? "Actualizar servicio" : "Crear servicio",
          color: "primary",
          callback: "request",
          url: this.id ? "api/services/update" : "api/services/store",
          method: this.id ? "put" : "post",
          validate: true,
          emit: "updated"
        }
      ]
    };
    return form;
  }
}

export default Service;
