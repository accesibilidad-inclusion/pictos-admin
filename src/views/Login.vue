<template>
  <v-row align="center" justify="center">
    <v-col>
      <ValidationObserver ref="observer">
        <v-form class="login-form mx-auto">
          <v-container>
            <v-row justify="center">
              <v-col>
                <h1>Bienvenido al administrador de Pictos</h1>
              </v-col>
            </v-row>
            <v-row justify="center">
              <ValidationProvider
                v-slot="{ errors }"
                name="correo electronico"
                rules="required|email"
                class="login-form__item"
              >
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
            <v-row justify="center">
              <ValidationProvider
                v-slot="{ errors }"
                name="contraseña"
                rules="required"
                class="login-form__item"
              >
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
              <v-row justify="center">
                <v-alert dense outlined v-if="unauthorized" type="error">
                  La información no coincide.
                </v-alert>
              </v-row>
            </transition>
            <v-row justify="center" class="mt-3">
              <v-btn color="primary" @click="login()">
                Ingresar
              </v-btn>
            </v-row>
            <v-row justify="center">
              <v-dialog v-model="dialog" width="500" persistent>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn class="mt-3" small color="primary" text v-bind="attrs" v-on="on">
                    Recuperar contraseña
                  </v-btn>
                </template>

                <v-card>
                  <v-card-title class="text-h5 grey lighten-2">
                    Recupera tu contraseña
                  </v-card-title>

                  <v-card-text class="mt-5">
                    Ingresa tu e-mail para enviarte un correo con las instrucciones para recuperar
                    tu contraseña
                    <ValidationObserver ref="recoverObserver">
                      <ValidationProvider
                        v-slot="{ errors }"
                        name="correo electronico"
                        rules="required|email"
                        class="login-form__item"
                      >
                        <v-text-field
                          class="mt-2"
                          v-model="recoverEmail"
                          label="Correo electronico"
                          :error-messages="errors"
                          required
                        ></v-text-field>
                      </ValidationProvider>
                    </ValidationObserver>
                    <v-alert dense outlined v-if="!recoverExist" type="error">
                      Este e-mail no esta registrado
                    </v-alert>
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="dialog = false">
                      Cancelar
                    </v-btn>
                    <v-btn :loading="recoverLoading" color="primary" @click="recoverPassword()">
                      Enviar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-row>
          </v-container>
        </v-form>
      </ValidationObserver>
      <v-snackbar elevation="24" :value="recovered" :timeout="20000" color="success" bottom>
        Te hemos enviado un correo con las instrucciones para recuperar tu contraseña.
      </v-snackbar>
      <v-snackbar elevation="24" :value="changed" :timeout="20000" color="success" bottom>
        Has cambiado tu contraseña con exito, intenta ingresar nuevamente
      </v-snackbar>
    </v-col>
  </v-row>
</template>
<script>
import { required, email } from "vee-validate/dist/rules";
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from "vee-validate";

setInteractionMode("eager");

extend("required", {
  ...required,
  message: "El campo {_field_} es obligatorio"
});

extend("email", {
  ...email,
  message: "El campo {_field_} debe ser un e-mail valido"
});

export default {
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data() {
    return {
      email: "",
      password: "",
      unauthorized: false,
      recoverEmail: "",
      recoverExist: true,
      recoverLoading: false,
      dialog: false,
      recovered: false,
      changed: false
    };
  },
  created() {
    if (this.$route.params.recovered) {
      this.changed = true;
    }
  },
  methods: {
    login() {
      this.$refs.observer.validate().then(valid => {
        if (valid) {
          let email = this.email;
          let password = this.password;
          this.$store
            .dispatch("login", { email, password })
            .then(() => this.$router.push("/"))
            .catch(() => (this.unauthorized = true));
        }
      });
    },
    recoverPassword() {
      this.$refs.recoverObserver.validate().then(valid => {
        if (valid) {
          this.recoverLoading = true;
          this.$http
            .post(process.env.VUE_APP_API_DOMAIN + "api/recoverPassword/", {
              email: this.recoverEmail
            })
            .then(response => {
              if (!response.data) {
                this.recoverExist = false;
              } else {
                this.recovered = true;
                this.dialog = false;
              }

              this.recoverLoading = false;
            });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.login-form {
  max-width: 400px;
}
.login-form__item {
  width: 100%;
  display: block;
}
</style>
