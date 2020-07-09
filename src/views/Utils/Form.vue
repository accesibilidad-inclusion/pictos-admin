<template>
    <v-card>
        <v-card-title class="font-weight-regular grey lighten-4" primary-title>
            <span>{{ object.form().title }}</span>
        </v-card-title>

        <ValidationObserver ref="observer">
            <v-form>
                <v-container class="px-7">
                    <v-row>
                        <v-col cols="12" v-for="(field, index) in object.form().fields" v-bind:key="index">
                            <div v-if="field.type == 'read'">
                                <div>{{ field.label }}</div>
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

            <v-btn text color="error" @click="destroy()" v-if="deleteAction">Eliminar</v-btn>
            <v-spacer></v-spacer>
            <template v-for="(action, index) in object.form().actions">
                <v-btn text :color="action.color" @click="handleAction(action)" v-bind:key="index">{{ action.label }}</v-btn>
            </template>

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
<<<<<<< HEAD
                    }
                });
            }
            else {
                this.$http[action.method](process.env.VUE_APP_API_DOMAIN + action.url, this.object).then((response) => {
                    this.$emit( action.emit )
                });
            }
            
=======
                }
            });

>>>>>>> a8badba43695c4445349843bc0c9d445091c2692
        },
        cancel( action ) {
            this.$emit( 'cancel' )
            this.$refs.observer.reset();
        }
    },
};
</script>
