<template>
    <div id="profile" class="card">
        <headerBar msg="Accueil"/>
        <div id="infos">
            <h2 class="card_title">Bienvenue sur votre espace perso</h2>
            <!-- Affichage des informations de l'utilisateur connecté -->
            <p><strong>{{ $store.state.user.infos.first_name }} {{ $store.state.user.infos.last_name }} <br> {{ $store.state.user.infos.email }}</strong></p>
            <!-- Champs de formulaire de modification de compte, caché par défaut -->
            <div class="form-row" :hidden="isHidden">
                <input v-model="prenom" class="form-row__input" type="text" placeholder="Prénom" />
                <input v-model="nom" class="form-row__input" type="text" placeholder="Nom" />
                <input v-model="email" class="form-row__input" type="text" placeholder="Adresse Email">
                <div>
                    <!-- Bouton de modification de compte -->
                    <button @click="updateAccount()" class="btn btn-success">Modifier mon compte</button>
                </div>
            </div>
            <!-- Bouton permettant d'afficher les champs de modification de compte -->
            <div :hidden='!isHidden'>
                <button @click="modifyAccount()" class="btn btn-warning">Modifier mon compte</button>
            </div>
        </div>
        <mypost/>
        <div>
            <!-- Bouton de suppression de compte -->
            <button @click="deleteAccount()" class="delete_btn btn btn-danger">Supprimer mon compte</button>
        </div>
        <footerBar/>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import headerBar from '@/components/headerBar.vue'
import mypost from '@/components/mypost.vue'
import footerBar from '@/components/footer.vue'

export default {
    name: 'Profile',
    components: {
        headerBar,
        mypost,
        footerBar
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
        // Si aucun utilisateur n'est connecté, renvoi à la page d'accueil
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
        // Méthode de suppression de compte
        deleteAccount: function() {
            this.$store.dispatch('deleteAccount');
            this.$store.commit('logout');
            alert('Votre compte à été supprimé avec succès')
            this.$router.push('/');
        },
        modifyAccount: function() {
            this.isHidden = false;
        },
        // Méthode de modification de compte
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
    background-color: #f0f2f5;
    border: 0;
}
#infos {
    background-color: #f0f2f5;
    padding-bottom: .5rem;
}
.delete_btn {
    margin: 0 0 3% 0;
}
</style>