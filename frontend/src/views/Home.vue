<template>
  <div class="home">
    <!-- Le lien du header renvoi au profil si un utilisateur est connecté sinon il renvoi à la page de connexion/inscription -->
    <headerBar v-if="this.$store.state.user.userId == -1" msg="Connexion / Inscription"/>
    <headerBar v-else msg="Mon profil"/>
    <!-- Si un utilisateur est connecté, affichage de tout les posts. Sinon une page d'accueil est présenté -->
    <post v-if="this.$store.state.user.userId !== -1"/>
    <div class="home__page" v-else>
      <h2 class="home__page--title">Groupomania vous présente sa plateforme sociale</h2>
    </div>
    <footerBar/>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from 'vuex';
import headerBar from '@/components/headerBar.vue'
import post from '@/components/post.vue'
import footerBar from '@/components/footer.vue'

export default {
  name: 'Home',
  components: {
    headerBar,
    post,
    footerBar
  },
  computed: {
        ...mapState({ user: 'userInfos' })
    },
}
</script>

<style>

.home__page {
  background-color: #f0f2f5;
  background-image: url(../assets/background2.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  min-height: 900px;
  opacity: 0.85;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.home__page--title {
  padding: 2%;
  background: rgb(24, 119, 242, 0.85);
  border-radius: 2rem/2rem;
  width: 50%;
  text-align: center;
}

.home__page > h2 {
  margin: 3% 0 0 0;
  color: #ffffff;
}

</style>