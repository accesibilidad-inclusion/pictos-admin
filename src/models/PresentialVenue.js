class PresentialVenue {
  constructor() {
    this.id = null;
    this.name = "";
    this.category = null;
    this.service = null;
    this.slug = "";
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
    this.category = venue.category
      ? {
          id: venue.category.id,
          name: venue.category.name,
          slug: venue.category.slug
        }
      : null;
    this.service = venue.service
      ? {
          id: venue.service.id,
          name: venue.service.name,
          slug: venue.service.slug
        }
      : null;
    this.slug = venue.slug;
    this.position = venue.position
      ? {
          lat: parseFloat(venue.position.lat),
          lng: parseFloat(venue.position.lng)
        }
      : null;
    this.tags_text = venue.tags ? venue.tags.join(", ") : "";
    this.tags = venue.tags ?? [];
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
          ? "Crear nuevo lugar presencial"
          : this.id
          ? "Editar lugar presencial"
          : "Agregar nuevo lugar presencial",
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
                url: "api/presential_venues/delete",
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
                url: "api/presential_venues/accept_contribution",
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
                url: this.id ? "api/presential_venues/update" : "api/presential_venues/store",
                method: this.id ? "put" : "post",
                validate: true,
                emit: "updated"
              }
            ]
    };
    return form;
  }
}

export default PresentialVenue;
