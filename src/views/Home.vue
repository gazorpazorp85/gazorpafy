<template>
  <section
    class="flex column align-center center full w100 main-container home"
  >
    <h1>Welcome To Gazorpafy</h1>
    <p>
      Gazorpafy is a spotify player made with Vue, available to Spotify Premium
      Users only.
    </p>
    <a class="btn login" href="//localhost:3030/api/auth/login">
      get started
    </a>
  </section>
</template>

<script>
export default {
  name: 'Home',
}
</script>