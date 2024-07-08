import store from "@/js/store";

class OnlineVenue {
  constructor() {
    this.id = null;
    this.name = "";
    this.category = null;
    this.service = null;
    this.regions = [];
    this.communes = [];
    this.url = "";
    this.slug = "";
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
    this.all_country = true;
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
          slug: venue.service.slug,
          country_id: venue.service.country?.id || venue.service.country_id
        }
      : null;
    this.regions = venue.regions ?? [];
    this.communes = venue.communes ?? [];
    this.all_country = this.regions.length == 0 && this.communes.length == 0;
    this.slug = venue.slug;
    this.url = venue.url;
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
      title: this.id ? "Editar lugar en internet" : "Agregar nuevo lugar en internet",
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
                id: "url",
                name: "url",
                label: "Url",
                rules: "required|url",
                type: "text"
              },
              {
                id: "all_country",
                label: "Habilitar en todo el pais",
                rules: "",
                fn: (e) => { if(e) {
                  this.regions = []
                  this.communes = []
                } },
                type: "switch"
              },
              {
                id: "all_country",
                text: "Recuerda que la especificidad importa en tu selección. Si eliges solo la región, como 'Valparaíso', se incluirán todas sus comunas automáticamente. Sin embargo, si prefieres seleccionar comunas específicas dentro de una región, solo se aplicarán a las comunas que selecciones.",
                type: "alert",
                hide: this.all_country
              },
              {
                id: "regions",
                name: "regiones",
                label: "Regiones donde estara habilitado el lugar",
                rules: "",
                type: "multiselect",
                hide: this.all_country,
                data: "regions",
                filter: (region) => {
                  return this.service?.country_id === region.country_id
                },
                changeFn: (selecteds) => {
                  this.communes = this.communes.filter( c => {
                    return !selecteds.map(s => s.id).includes(c.region_id);
                  });
                },
                textOption: ["name"]
              },
              {
                id: "communes",
                name: "comunas",
                label: "Comunas donde estara habilitado el lugar",
                rules: "",
                type: "multiselect",
                hide: this.all_country,
                data: "communes",
                filter: (commune) => {
                  return this.service?.country_id === store.getters['regions'].find(region => region.id === commune.region_id)?.country_id && !this.regions.map(region => region.id).includes(commune.region_id)
                },
                textOption: ["name"]
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
                changeFn: (e) => { if(e) {
                  this.regions = []
                  this.communes = []
                } },
                textOption: ["name"]
              },
              {
                id: "url",
                name: "url",
                label: "Url",
                rules: "required|url",
                type: "text"
              },
              {
                id: "all_country",
                label: "Habilitar en todo el pais",
                rules: "",
                fn: (e) => { if(e) {
                  this.regions = []
                  this.communes = []
                } },
                type: "switch"
              },
              {
                id: "all_country",
                text: "Recuerda que la especificidad importa en tu selección. Si eliges solo la región, como 'Valparaíso', se incluirán todas sus comunas automáticamente. Sin embargo, si prefieres seleccionar comunas específicas dentro de una región, solo se aplicarán a las comunas que selecciones.",
                type: "alert",
                hide: this.all_country
              },
              {
                id: "regions",
                name: "regiones",
                label: "Regiones donde estara habilitado el lugar",
                rules: "",
                type: "multiselect",
                hide: this.all_country,
                data: "regions",
                filter: (region) => {
                  return this.service?.country_id === region.country_id
                },
                changeFn: (selecteds) => {
                  this.communes = this.communes.filter( c => {
                    return !selecteds.map(s => s.id).includes(c.region_id);
                  });
                },
                textOption: ["name"]
              },
              {
                id: "communes",
                name: "comunas",
                label: "Comunas donde estara habilitado el lugar",
                rules: "",
                type: "multiselect",
                hide: this.all_country,
                data: "communes",
                filter: (commune) => {
                  return this.service?.country_id === store.getters['regions'].find(region => region.id === commune.region_id)?.country_id && !this.regions.map(region => region.id).includes(commune.region_id)
                },
                textOption: ["name"]
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
          label: this.id ? "Actualizar lugar" : "Crear lugar",
          color: "primary",
          callback: "request",
          url: this.id ? "api/online_venues/update" : "api/online_venues/store",
          method: this.id ? "put" : "post",
          validate: true,
          emit: "updated"
        }
      ]
    };
    return form;
  }
}

export default OnlineVenue;
