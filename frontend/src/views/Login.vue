<template>
    <div class="card">
        <headerBar msg="Accueil"/>
        <div class="card__login">
            <div class="card__login--inputs">
                <h1 class="card_title" v-if="mode == 'login'">Connexion</h1>
                <h1 class="card_title" v-else>Inscription</h1>
                <!-- Evenement permettant de changer de mode -->
                <p class="card_subtitle" v-if="mode == 'login'">Vous n'avez pas encore de compte ? <span class="card__action" @click="switchToSignUp()"> Créer un compte</span></p>
                <p class="card_subtitle" v-else>Vous avez déjà un compte ? <span class="card__action" @click="switchToLogin()">Vous connecter</span></p>
                <!-- Champs de formulaire de connexion et d'inscription ils sont affiché en fonction du mode actif (login ou signUp) -->
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
                <!-- Message d'erreur du mode login -->
                <div class="form-row" v-if="mode == 'login' && status == 'error_login'">
                    Adresse email et/ou mot de passe invalide
                </div>
                <!-- Message d'erreur du mode signUp -->
                <div class="form-row" v-if="mode == 'signUp' && status == 'error_signup'">
                    Adresse email déjà utilisée
                </div>
                <div class="form-row login">
                    <!-- Bouton de connexion -->
                    <button @click="login()" class="btn btn-secondary" :class="{'disabled' : !validatedFields}" v-if="mode == 'login'">
                        <!-- Message de chargement apparaissant lors de la connexion -->
                        <span v-if="status == 'loading'">Connexion en cours...</span>
                        <span v-else>Connexion</span>
                    </button>
                    <!-- Bouton de création de compte -->
                    <button @click="signUp()" class="btn btn-secondary" :class="{'disabled' : !validatedFields}" v-else>
                        <!-- Message de chargement apparaissant lors de la création de compte -->
                        <span v-if="status == 'loading'">Création en cours...</span>
                        <span v-else>Créer mon compte</span>
                    </button>
                </div>
            </div>
        </div>
        <footerBar/>
    </div>
</template>

<script>

import headerBar from '@/components/headerBar.vue'
import { mapState } from 'vuex';
import footerBar from '@/components/footer.vue'

    export default {
        name: 'Login',
        components: {
        headerBar,
        footerBar
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
            // Si un utilisateur est connecté, renvoi sur la page de profil
            if (this.$store.state.user.userId != -1) {
                this.$router.push('/profile');
                return ;
            }
        },
        computed: {
            validatedFields: function () {
                // Validation des champs du formulaire, on s'assure qu'ils ne soient pas vide
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
            // Méthode de changement de mode
            switchToSignUp: function () {
                this.mode = 'signUp';
            },
            // Méthode de changement de mode
            switchToLogin: function () {
                this.mode = 'login';
            },
            // Méthode de connexion d'un utilisateur
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
            // Méthode de création de compte
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

.card__login {
    color: #f0f2f5;
    background-color: #f0f2f5;
    background-image: url(../assets/background2.jpg);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    min-height: 750px;
    opacity: 0.85;
    display: flex;
    justify-content: center;
    align-items: center;
}

.card__login--inputs {
    background: rgb(24, 119, 242, 0.85);
    width: 50%;
    border-radius: 2rem/2rem;
}

.form-row__input {
    margin: 1%;
}

.login {
    margin-bottom: 2%;
}

.card__action:hover {
    color: black;
}
</style>