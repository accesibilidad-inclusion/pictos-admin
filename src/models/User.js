class User {
  constructor() {
    this.id = null;
    this.name = "";
    this.email = "";
    this.role = null;
    this.services = [];
  }

  set(user) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
    this.services = user.services;
  }

  form() {
    let form = {
      title: this.id ? "Editar usuario" : "Agregar nuevo usuario",
      fields: [
        {
          id: "name",
          name: "nombre",
          label: "Nombre del usuario",
          rules: "required|max:100",
          type: "text"
        },
        {
          id: "email",
          name: "correo electronico",
          label: "Correo electronico",
          rules: "required|email|unique_email:" + this.id,
          type: "text"
        },
        {
          id: "role",
          name: "rol",
          label: "Rol",
          rules: "required",
          type: "select",
          data: "roles",
          textOption: ["name"]
        },
        {
          id: "services",
          name: "servicios",
          label: "Servicios",
          rules: "",
          type: "multiselect",
          data: "services",
          condition: this.role?.name === "Colaborador",
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
          label: this.id ? "Actualizar usuario" : "Crear usuario",
          color: "primary",
          callback: "request",
          url: this.id ? "api/users/update" : "api/users/store",
          method: this.id ? "put" : "post",
          validate: true,
          emit: "updated"
        }
      ]
    };
    return form;
  }
}

export default User;
