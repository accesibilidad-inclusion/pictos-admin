<template>
  <v-row align="center" justify="center">
    <v-col>
      <ValidationObserver ref="observer">
        <v-form class="login-form mx-auto">
          <v-container>
            <v-row justify="center">
              <v-col>
                <h1>Crea una nueva contraseña</h1>
              </v-col>
            </v-row>
            <v-row justify="center">
              <ValidationProvider
                v-slot="{ errors }"
                name="contraseña"
                rules="required|min:8"
                class="login-form__item"
                vid="confirmation"
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
            <v-row justify="center">
              <ValidationProvider
                v-slot="{ errors }"
                name="confirmar contraseña"
                rules="required|confirmed:confirmation"
                class="login-form__item"
              >
                <v-col cols="12">
                  <v-text-field
                    v-model="confirm_password"
                    label="Confirmar contraseña"
                    type="password"
                    :error-messages="errors"
                    required
                  ></v-text-field>
                </v-col>
              </ValidationProvider>
            </v-row>
            <v-row justify="center" class="mt-3">
              <v-btn color="primary" @click="send()">
                Enviar
              </v-btn>
            </v-row>
          </v-container>
        </v-form>
      </ValidationObserver>
    </v-col>
  </v-row>
</template>
<script>
import { required, confirmed, min } from "vee-validate/dist/rules";
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from "vee-validate";

setInteractionMode("eager");

extend("required", {
  ...required,
  message: "El campo {_field_} es obligatorio"
});

extend("min", {
  ...min,
  message: "El campo {_field_} debe contener al menos {length} caracteres "
});

extend("confirmed", {
  ...confirmed,
  message: "El campo {_field_} debe coincidir con la {target}"
});

export default {
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data() {
    return {
      password: "",
      confirm_password: ""
    };
  },
  methods: {
    send() {
      this.$refs.observer.validate().then(valid => {
        if (valid) {
          this.loading = true;
          this.$http
            .post(process.env.VUE_APP_API_DOMAIN + "api/changePassword/", {
              hash: this.$route.params.hash,
              password: this.password
            })
            .then(response => {
              if (response.data) {
                this.$router.push({ name: "Login", params: { recovered: true } });
              }
              this.loading = false;
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
