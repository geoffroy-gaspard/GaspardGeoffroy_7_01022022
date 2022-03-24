<template>
    <div id="profile" class="card">
        <headerBar msg="Accueil"/>
        <div id="infos">
            <h2 class="card_title">Espace Perso</h2>
            <p class="card_subtitle">ma page</p>
            <p>{{ $store.state.user.infos.first_name }} {{ $store.state.user.infos.last_name }} <br> {{ $store.state.user.infos.email }}</p>
            <div class="form-row">
                <button @click="logout()" class="btn btn-outline-secondary">Déconnexion</button>
            </div>
        </div>
        <h2>Vos Posts</h2>
        <mypost/>
        <div>
            <button @click="deleteAccount()" class="btn btn-danger">Supprimer mon compte</button>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import headerBar from '@/components/headerBar.vue'
import mypost from '@/components/mypost.vue'

export default {
    name: 'Profile',
    components: {
        headerBar,
        mypost
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
        },
        deleteAccount: function() {
            this.$store.dispatch('deleteAccount');
            this.$store.commit('logout');
            this.$router.push('/');
        }
    }
}
</script>

<style scoped>
#profile {
    background-color: #FEBEBE;
}
#infos {
    background-color: white;
    padding-bottom: .5rem;
}
</style>