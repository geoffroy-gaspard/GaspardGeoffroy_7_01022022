<template>
    <div class="card">
        <headerBar msg="Accueil"/>
        <h1 class="card_title" v-if="mode == 'login'">Connexion</h1>
        <h1 class="card_title" v-else>Inscription</h1>
        <p class="card_subtitle" v-if="mode == 'login'">Vous n'avez pas encore de compte ? <span class="card__action"
                @click="switchToSignUp()"> Créer un compte</span></p>
        <p class="card_subtitle" v-else>Vous avez déjà un compte ? <span class="card__action" @click="switchToLogin()">
                Vous connecter</span></p>
        <div class="form-row" v-if="mode == 'signUp'">
            <input v-model="prenom" class="form-row__input" type="text" placeholder="Prénom" />
            <input v-model="nom" class="form-row__input" type="text" placeholder="Nom" />
        </div>
        <div class="form-row">
            <input v-model="email" class="form-row__input" type="text" placeholder="Adresse Email" />
        </div>
        <div class="form-row">
            <input v-model="password" class="form-row__input" type="password" placeholder="Mot de Passe" />
        </div>
        <div class="form-row" v-if="mode == 'login' && status == 'error_login'">
            Adresse email et/ou mot de passe invalide
        </div>
        <div class="form-row" v-if="mode == 'signUp' && status == 'error_signup'">
            Adresse email déjà utilisée
        </div>
        <div class="form-row">
            <button @click="login()" class="btn btn-outline-secondary button--disabled" :class="{'button--disabled' : !validatedFields}" v-if="mode == 'login'">
                <span v-if="status == 'loading'">Connexion en cours...</span>
                <span v-else>Connexion</span>
            </button>
            <button @click="signUp()" class="btn btn-outline-secondary" :class="{'button--disabled' : !validatedFields}" v-else>
                <span v-if="status == 'loading'">Création en cours...</span>
                 <span v-else>Créer mon compte</span>
            </button>
        </div>
    </div>
</template>

<script>

import headerBar from '@/components/headerBar.vue'
import { mapState } from 'vuex';

    export default {
        name: 'Login',
        components: {
        headerBar,
    },
        data: function () {
            return {
                mode: 'login',
                email: '',
                prenom: '',
                nom: '',
                password: ''
            }
        },
        mounted: function () {
            if (this.$store.state.user.userId != -1) {
                this.$router.push('/profile');
                return ;
            }
        },
        computed: {
            validatedFields: function () {
                if (this.mode == 'signUp') {
                    if (this.email != "" && this.prenom != "" && this.nom != "" && this.password != "") {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if (this.email != "" && this.password != "") {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
                ...mapState(['status'])
        },
        methods: {
            switchToSignUp: function () {
                this.mode = 'signUp';
            },
            switchToLogin: function () {
                this.mode = 'login';
            },
            login: function () {
                const self = this;
                this.$store.dispatch('login', {
                    email: this.email,
                    password: this.password,
                }).then(function() {
                    self.$router.push('Profile')
                }, function (error) {
                    console.log(error)
                })
            },
            signUp: function () {
                const self = this;
                this.$store.dispatch('signUp', {
                    first_name: this.prenom,
                    last_name: this.nom,
                    email: this.email,
                    password: this.password,
                }).then(function() {
                    self.login();
                }, function (error) {
                    console.log(error)
                })
            },
        }
    }
</script>
<style scoped>
.form-row__input {
    margin: 1%;
}
.card__action:hover {
    color: rgb(20, 161, 255);
}
</style>