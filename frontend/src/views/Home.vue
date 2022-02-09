<template>
  <div class="home">
    <headerBar v-if="this.$store.state.user.userId == -1" msg="Connexion / Inscription"/>
    <headerBar v-else msg="Mon profil"/>
    <post/>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from 'vuex';
import headerBar from '@/components/headerBar.vue'
import post from '@/components/post.vue'

export default {
  name: 'Home',
  components: {
    headerBar,
    post,
  },
  computed: {
        ...mapState({ user: 'userInfos' })
    },
}
</script>
