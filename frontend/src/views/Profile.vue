<template>
    <div class="card">
        <headerBar msg="Accueil"/>
        <h2 class="card_title">Espace Perso</h2>
        <p class="card_subtitle">ma page</p>
        <p>{{ user.first_name }} {{ user.last_name }} {{ user.email }}</p>
        <div class="form-row">
            <button @click="logout()" class="btn btn-outline-secondary">Déconnexion</button>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import headerBar from '@/components/headerBar.vue'

export default {
    name: 'Profile',
    components: {
        headerBar,
    },
    mounted: function () {
        console.log(this.$store.state.user);
        if (this.$store.state.user.userId == -1) {
            this.$router.push('/');
            return;
        }
        this.$store.dispatch('getUserInfos');
    },
    computed: {
        ...mapState({ user: 'userInfos' })
    },
    methods: {
        logout: function() {
            this.$store.commit('logout');
            this.$router.push('/');
        }
    }
}
</script>

<style scoped>

</style>