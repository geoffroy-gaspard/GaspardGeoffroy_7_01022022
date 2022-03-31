<template>
    <div id="profile" class="card">
        <headerBar msg="Accueil"/>
        <div id="infos">
            <h2 class="card_title">Espace Perso</h2>
            <p class="card_subtitle">ma page</p>
            <p>{{ $store.state.user.infos.first_name }} {{ $store.state.user.infos.last_name }} <br> {{ $store.state.user.infos.email }}</p>
            <div class="form-row" :hidden="isHidden">
                <input v-model="prenom" class="form-row__input" type="text" placeholder="Prénom" />
                <input v-model="nom" class="form-row__input" type="text" placeholder="Nom" />
                <input v-model="email" class="form-row__input" type="text" placeholder="Adresse Email">
                <div>
                    <button @click="updateAccount()" class="btn btn-success">Modifier mon compte</button>
                </div>
            </div>
            <div :hidden='!isHidden'>
                <button @click="modifyAccount()" class="btn btn-warning">Modifier mon compte</button>
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
    data() {
        return {
            isHidden: true,
            prenom: '',
            nom: '',
            email: ''
        }
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
        deleteAccount: function() {
            this.$store.dispatch('deleteAccount');
            this.$store.commit('logout');
            alert('Votre compte à été supprimé avec succès')
            this.$router.push('/');
        },
        modifyAccount: function() {
            this.isHidden = false;
        },
        updateAccount: function () {
                this.$store.dispatch('updateAccount', {
                    first_name: this.prenom,
                    last_name: this.nom,
                    email: this.email
                }).then(function() {
                    alert('Nous allons vous déconnecter afin de mettre à jour les informations de votre compte')
                }, function (error) {
                    console.log(error)
                });
                this.$store.commit('logout');
                this.$router.push('/');
            },
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