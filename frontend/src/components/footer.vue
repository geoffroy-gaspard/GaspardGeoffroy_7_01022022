<template>
    <div class="nav nav__footer">
        <div class="row row-no-gutters social">
            <div class="col-sm-4">
                <div class="text-center">
                    <a class="social" href="#" title="Twitter"><font-awesome-icon class="fa fa-twitter icon-md" :icon="[ 'fab', 'twitter' ]"/></a>
                </div>
            </div>
                <div class="col-sm-4">
                    <div class="text-center">
                        <a class="social" href="#" title="Facebook"><font-awesome-icon class="fa fa-facebook icon-md" :icon="[ 'fab', 'facebook' ]"/></a>
                    </div>
                </div>
            <div class="col-sm-4">
                <div class="text-center">
                    <a class="social" href="#" title="Dribble"><font-awesome-icon class="fa fa-instagram icon-md" :icon="[ 'fab', 'instagram' ]"/></a>
                </div>
            </div>
        </div>
        <div class="nav__links">
            <a class="links" href="#">Contact</a>
            <a class="links" href="#">Mentions légales</a>
        </div>
    </div>
</template>

<script>
export default {
    name: 'footerBar',

}
</script>

<style>
.nav__footer {
    flex-direction: column;
    background-color: #1877f2;
}

.nav__links {
    display: flex;
    justify-content: space-evenly;
}

.links {
  font-weight: bold;
  text-decoration: none;
  color: #ffffff;
}

.links:hover {
    color: #ffffff;
}

.social {
    font-size: 1.3em;
    color: #ffffff;
}
.social:hover {
    color: #ffffff;
}
</style>