<template>
    <v-card>
        <v-card-title class="font-weight-regular grey lighten-4" primary-title>
            <span>{{ object.form().title }}</span>
        </v-card-title>

        <ValidationObserver ref="observer">
            <v-form>
                <v-container class="px-7">
                    <v-row>
                        <v-col cols="12" v-for="(field, index) in object.form().fields" v-bind:key="index" class="pb-2">
                            <div v-if="field.type == 'read'">
                                <div class="grey--text text--darken-2">{{ field.label }}</div>
                                <div>{{ field.value ? object[field.id][field.value] : object[field.id] }}</div>
                            </div>
                            <div v-if="field.type == 'iteration'">
                                <div v-for="it in object[field.id]" v-bind:key="it.id">
                                    <v-text-field
                                        v-model="it[field.value]"
                                        :label="field.label"
                                    ></v-text-field>
                                </div>
                            </div>
                            <div v-if="field.type == 'pictograms'" class="pt-3">
                                <v-row v-for="it in object[field.id]" v-bind:key="it.id" class="mb-6 mx-1">
                                    <v-col cols="6" class="preview__pictos blue lighten-5 pa-0">
                                        <img v-for="image in it.pictogram.images" :src="image.path + '/' + image.filename" v-bind:key="image.id" />
                                    </v-col>
                                    <v-col cols="6" class="d-flex align-center pl-6">{{ it.step.label }}</v-col>
                                </v-row>
                            </div>
                            <GoogleMap v-if="field.type == 'map'" :position="object[field.id]" v-on:update-position="setPosition" />
                            <ValidationProvider v-slot="{ errors }" :name="field.name" :rules="field.rules">
                                <v-text-field
                                    v-if="field.type == 'text'"
                                    v-model="object[field.id]"
                                    :label="field.label"
                                    :error-messages="errors"
                                    required
                                ></v-text-field>
                                <v-autocomplete
                                    v-if="field.type == 'select'"
                                    v-model="object[field.id]"
                                    :items="$store.getters[field.data]"
                                    :error-messages="errors"
                                    hide-no-data
                                    hide-selected
                                    item-text="name"
                                    item-value="id"
                                    :label="field.label"
                                    return-object
                                ></v-autocomplete>
                            </ValidationProvider>
                        </v-col>
                    </v-row>
                </v-container>
            </v-form>
        </ValidationObserver>
        <v-divider></v-divider>

        <v-card-actions class="px-5 pb-6 pt-4">
            <v-spacer></v-spacer>
            <template v-for="(action, index) in object.form().actions">
                <v-btn text :color="action.color" @click="handleAction(action)" v-bind:key="index">{{ action.label }}</v-btn>
            </template>

        </v-card-actions>
    </v-card>
</template>

<script>
import GoogleMap from "./GoogleMap";
import { required, max } from 'vee-validate/dist/rules';
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate';
import axios from 'axios';

setInteractionMode('eager');

extend('required', {
  ...required,
  message: 'El campo {_field_} es obligatorio',
});

extend('max', {
  ...max,
  message: 'El campo {_field_} no puede ser mas largo que {length} caracteres',
});

extend('url', {
    validate: (str) => {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(str);
    },
    message: 'El campo no es una URL valida'
})
extend('unique_email', {
    message: 'El campo {_field_} ya esta registrado.',
    validate: value => {
        return axios.post( process.env.VUE_APP_API_DOMAIN + 'api/users/email_check', { 'email': value } ).then((exist) => {
            return {
                valid: !exist.data
            }
        });
    }
});


export default {
    name: 'Form',
    props: [ 'object' ],
    components: {
        ValidationProvider,
        ValidationObserver,
        GoogleMap,
    },
    data() {
        return {
        };
    },
    methods: {
        handleAction(action) {
            if(action.confirm) {
                if(confirm(action.confirm))
                    this[action.callback](action);
            }
            else {
                this[action.callback](action);
            }
        },
        request(action) {
            if(action.validate) {
                this.$refs.observer.validate().then( valid => {
                    if(valid) {
                        this.$http[action.method](process.env.VUE_APP_API_DOMAIN + action.url, this.object).then((response) => {
                            this.$emit( action.emit )
                            this.$refs.observer.reset();
                        });
                    }
                });
            }
            else {
                this.$http[action.method](process.env.VUE_APP_API_DOMAIN + action.url, this.object).then((response) => {
                    this.$emit( action.emit )
                });
            }

        },
        cancel( action ) {
            this.$emit( 'cancel' )
            this.$refs.observer.reset();
        },
        setPosition( position ) {
            this.object.position = position
        }
    },
};
</script>
<style scoped>
.preview__pictos {
  position: relative;
  height: 180px;
}
.preview__pictos img {
  position: absolute;
  height: 100%;
  right: 0;
  left: 0;
  margin: 0 auto;
}
</style>
