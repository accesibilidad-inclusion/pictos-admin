class User {

    constructor() {
        this.id = null
        this.name = ''
        this.url = ''
        this.category = {
            'id': null,
            'name': ''
        }
        this.venues = []
        this.tags_text = ''
        this.tags = []
        this.status = ''
    }

    set(user) {
        this.id = user.id
        this.name = user.name
        this.url = user.url
        this.category = {
            'id': user.category.id,
            'name': user.category.name
        }
        this.venues = user.venues
        this.tags_text = user.tags.join(', ')
        this.tags = user.tags
        this.status = user.status
    }

    form() {
        return [
            {
                id: 'name',
                prefix: 'el',
                name: 'nombre',
                label: 'Nombre del usuario',
                rules: 'required|max:100',
                type: 'text'
            },
            {
                id: 'email',
                prefix: 'los',
                name: 'correo electronico',
                label: 'Correo electronico',
                rules: 'required|email',
                type: 'text'
            }
        ]
    }

}

export default User
