<template>
  <div class="header">
    <div class="title">
    <img class="logo" alt="Groupomania logo" src="../assets/icon.png">
    <h1>Groupomania</h1>
    </div>
    <div class="title nav">
      <router-link class="userI" v-if="isHomePage == true" to="/Login">{{ msg }}</router-link>
      <router-link class="userI" v-else to="/">{{ msg }}</router-link>
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
}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  font-style: none;
  color: rgb(32, 32, 32);
  text-decoration-line: none;
}
.header {
  background-color: rgb(255, 255, 255);
  color: rgb(32, 32, 32);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.title {
  display: flex;
  align-items: center;
  justify-content: right;
}
.logo {
  width: 4rem;
  height: 4rem;
}
.userI {
  padding: 3%;
  margin: 2%;
  font-weight: bold;
}
.userI:hover {
  background-color: rgb(228, 172, 183);
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
