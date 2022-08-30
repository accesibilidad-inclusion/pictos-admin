class Venue {
  constructor() {
    this.id = null;
    this.name = "";
    this.service = null;
    this.url = "";
    this.position = null;
    this.tags_text = "";
    this.tags = [];
    this.tasks = [];
    this.evaluations = [];
    this.evaluation = null;
    this.show_evaluation = null;
    this.visible = 0;
    this.last_modified = null;
    this.status = "";
    this.form_type = "";
  }

  set(venue) {
    this.id = venue.id;
    this.name = venue.name;
    this.service = venue.service
      ? {
          id: venue.service.id,
          name: venue.service.name
        }
      : null;
    this.url = venue.url;
    this.position = venue.position
      ? {
          lat: parseFloat(venue.position.lat),
          lng: parseFloat(venue.position.lng)
        }
      : null;
    this.tags_text = venue.tags ? venue.tags.join(", ") : "";
    this.tags = venue.tags;
    this.tasks = venue.tasks;
    this.evaluations = venue.evaluations;
    this.evaluation = venue.evaluation;
    this.show_evaluation = venue.show_evaluation;
    this.status = venue.status;
    this.visible = venue.visible;
    this.last_modified = venue.last_modified;
    this.form_type = venue.form_type;
  }

  form() {
    let form = {
      title:
        this.status == "Enviado por usuario"
          ? "Crear nuevo lugar"
          : this.id
          ? "Editar lugar"
          : "Agregar nuevo lugar",
      fields:
        this.form_type === "service"
          ? [
              {
                id: "name",
                name: "nombre",
                label: "Nombre del lugar",
                rules: "required|max:100",
                type: "text"
              },
              {
                id: "position",
                name: "ubicacion",
                label: "Ubicación",
                type: "map"
              },
              {
                id: "tags_text",
                name: "sinonimos",
                label: "Sinónimos de búsqueda (Separados por coma)",
                rules: "",
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
              },
              {
                id: "position",
                name: "ubicacion",
                label: "Ubicación",
                type: "map"
              },
              {
                id: "tags_text",
                name: "sinonimos",
                label: "Sinónimos de búsqueda (Separados por coma)",
                rules: "",
                type: "text"
              }
            ],
      actions:
        this.status == "Enviado por usuario"
          ? [
              {
                label: "Eliminar",
                color: "error",
                callback: "request",
                url: "api/venues/delete",
                method: "post",
                confirm: "¿Esta seguro de eliminar este lugar?",
                emit: "updated"
              },
              {
                label: "Cancelar",
                color: "grey",
                callback: "cancel"
              },
              {
                label: "Aceptar lugar",
                color: "primary",
                callback: "request",
                url: "api/venues/accept_contribution",
                method: "put",
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
                label: this.id ? "Actualizar lugar" : "Crear lugar",
                color: "primary",
                callback: "request",
                url: this.id ? "api/venues/update" : "api/venues/store",
                method: this.id ? "put" : "post",
                validate: true,
                emit: "updated"
              }
            ]
    };
    return form;
  }
}

export default Venue;
