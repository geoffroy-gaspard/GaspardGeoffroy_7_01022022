<template>
  <div class="header">
    <div class="title">
    <img class="logo" alt="Groupomania logo" src="../assets/icon2.png">
    <h1 class="title__groupomania">Groupomania</h1>
    </div>
    <div class="title nav">
      <router-link class="userI" v-if="isHomePage == true" to="/Login">{{ msg }}</router-link>
      <router-link class="userI" v-else to="/">{{ msg }}</router-link>
      <button @click="logout()" class="userI btn" v-if="$store.state.user.userId !== -1">Déconnexion</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'headerBar',
  props: {
    msg: String
  },
  watch: {
    $route: {
      immediate: true,
      handler() {
         if(this.$route.path == '/') {
           this.isHomePage = true;
         } else {
            this.isHomePage = false;
         }
      }
    }
  },
  methods: {
    logout: function() {
            this.$store.commit('logout');
            window.location.reload()
        }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  font-style: none;
  color: #ffffff;
  text-decoration-line: none;
}
.header {
  background-color: #1877f2;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header > h1 {
  margin: 0;
}
.title {
  display: flex;
  align-items: center;
  justify-content: right;
}
.logo {
  width: 3rem;
  height: 3rem;
}
.title__groupomania {
  margin: 0;
}
.userI {
  padding: 2%;
  margin: 1%;
  font-weight: bold;
  border-radius: 0.25rem;
  color: #ffffff;
}
.userI:hover {
  background-color: #f0f2f5;
  color: black;
}
.nav {
  width: 50%;
}
@media all and (max-width: 480px) {
  h1 {
    display: none;
  }
}
</style>
