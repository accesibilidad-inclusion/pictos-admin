<template>
    <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
            <span v-if="!object.id">Agregar nuevo {{ name }}</span>
            <span v-else>Editar {{ name }}</span>
        </v-card-title>

        <ValidationObserver ref="observer">
            <v-form>
                <v-container>
                    <v-row>
                        <v-col cols="12" v-for="(field, index) in object.form()" v-bind:key="index">
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

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text small color="error" @click="destroy()" v-if="deleteAction">Eliminar</v-btn>
            <v-btn color="grey" text @click="cancel()">
                Cancelar
            </v-btn>
            <v-btn color="primary" text @click="create()">
                <span v-if="!object.id">Crear {{ name }}</span>
                <span v-else>Actualizar {{ name }}</span>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { required, max } from 'vee-validate/dist/rules';
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate';
import axios from 'axios';
import Service from '../../models/Service'

setInteractionMode('eager');

extend('required', {
  ...required,
  message: 'El campo {_field_} es obligatorio',
});

extend('max', {
  ...max,
  message: 'El campo {_field_} no puede ser mas largo que {length} caracteres',
});

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
    props: [ 'object', 'name', 'url', 'method', 'deleteAction', 'deleteUrl' ],
    components: {
        ValidationProvider,
        ValidationObserver,
    },
    data() {
        return {
        };
    },
    methods: {
        create() {
            this.$refs.observer.validate().then( valid => {
                if(valid) {
                    if(this.method == 'post')
                        this.$http.post(process.env.VUE_APP_API_DOMAIN + this.url, this.object).then((response) => {
                            this.$emit( 'created' )
                            this.$refs.observer.reset();
                        });
                    else if(this.method == 'put')
                        this.$http.put(process.env.VUE_APP_API_DOMAIN + this.url, this.object).then((response) => {
                            this.$emit( 'updated' )
                            this.$refs.observer.reset();
                        });
                }
            });
            
        },
        cancel() {
            this.$emit( 'cancel' )
            this.$refs.observer.reset();
        },
        destroy() {
            if(confirm('¿Esta seguro de eliminarlo?')) {
                this.$http.post(process.env.VUE_APP_API_DOMAIN + this.deleteUrl, {
                    'id': this.object.id
                }).then((response) => {
                    this.$emit( 'updated' )
                });
            }
        }
    },
};
</script>
