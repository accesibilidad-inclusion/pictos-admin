<template>
    <div>
        <ValidationObserver ref="observer">
            <v-form>
                <v-container>
                    <v-row>
                        <ValidationProvider v-slot="{ errors }" name="correo electronico" rules="required|email">
                            <v-col cols="12">
                                <v-text-field 
                                v-model="email" 
                                label="Correo electronico" 
                                :error-messages="errors" 
                                required
                                ></v-text-field>
                            </v-col>
                        </ValidationProvider>
                    </v-row>
                    <v-row>
                        <ValidationProvider v-slot="{ errors }" name="contraseña" rules="required">
                            <v-col cols="12">
                                <v-text-field 
                                v-model="password" 
                                label="Contraseña"
                                type="password" 
                                :error-messages="errors" 
                                required
                                ></v-text-field>
                            </v-col>
                        </ValidationProvider>
                    </v-row>
                    <transition name="bounce">
                        <v-row v-if="unauthorized">
                            <span>La información no coincide.</span>
                        </v-row>
                    </transition>
                    <v-row>
                        <v-btn color="primary" text @click="login()">
                            Ingresar
                        </v-btn>
                    </v-row>
                </v-container>
            </v-form>
        </ValidationObserver>
    </div>
</template>
<script>
import { required, email } from 'vee-validate/dist/rules';
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate';

setInteractionMode('eager');

extend('required', {
  ...required,
  message: 'El campo {_field_} es obligatorio',
});

extend('email', {
  ...email,
  message: 'El campo {_field_} debe ser un e-mail valido',
});

export default {
    components: {
        ValidationProvider,
        ValidationObserver,
    },
    data () {
        return {
            email : "",
            password : "",
            unauthorized: false
        }
    },
    methods: {
        login () {
            this.$refs.observer.validate().then( ( valid ) => {
                if( valid ) {
                    let email = this.email
                    let password = this.password
                    this.$store.dispatch( 'login', { email, password } )
                    .then( () => this.$router.push( '/' ) )
                    .catch( () => this.unauthorized = true )
                }
            } )
        }
    }
}
</script>
