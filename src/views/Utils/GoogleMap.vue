<template>
    <div>
        <div>
            <gmap-autocomplete @place_changed="setPlace" :options="{fields: ['geometry']}">
                <template v-slot:input="slotProps">
                    <v-text-field 
                        label="Ubicación"
                        placeholder=""
                        ref="input"
                        v-on:listeners="slotProps.listeners"
                        v-on:attrs="slotProps.attrs">
                    </v-text-field>
                </template>
            </gmap-autocomplete>
        </div>
        <gmap-map :center="center" :zoom="14" style="width:100%;  height: 300px;">
            <gmap-marker 
                v-if="marker"
                :position="marker"
                :draggable="true"
                @drag="updateCoordinates"
            ></gmap-marker>
        </gmap-map>
    </div>
</template>

<script>
export default {
    name: "GoogleMap",
    props: ['position'],
    data() {
        return {
            center: { lat: -33.02453639391325, lng: -71.55195879049072 },
            currentPlace: null,
            marker: { lat: -33.02453639391325, lng: -71.55195879049072 }
        };
    },

    mounted() {
        if(this.position) {
            this.center = this.position
            this.marker = this.position
        }
        else
            this.geolocate();
            
        this.$emit("update-position", this.marker) ;
    },

    methods: {
        setPlace(place) {
            this.currentPlace = place;
                if (this.currentPlace) {
                const marker = {
                    lat: this.currentPlace.geometry.location.lat(),
                    lng: this.currentPlace.geometry.location.lng()
                };
                this.center = marker;
                this.marker = marker;
                this.currentPlace = null;
                this.$emit("update-position", this.marker) ;
            }
        },
        geolocate() {
            navigator.geolocation.getCurrentPosition(position => {
                this.center = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                this.marker = this.center
            });
        },
        updateCoordinates(location) {
            this.marker = {
                lat: location.latLng.lat(),
                lng: location.latLng.lng()
            };
            this.$emit("update-position", this.marker) ;
        }
    }
};
</script>