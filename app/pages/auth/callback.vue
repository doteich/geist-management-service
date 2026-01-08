<template>
  <section class="callback">
    <loading-screen></loading-screen>
  </section>
</template>

<script setup lang="ts">

import { useOidcAuth } from "~/composables/useOidcAuth";
import loadingScreen from "~/components/loadingScreen.vue";


const { manager } = useOidcAuth();
const router = useRouter();

onMounted(() => {

  manager.signinRedirectCallback()

    .then((user) => {
      setTimeout(() => {
        router.push('/');

      }, 3000)

    })
    .catch((err) => {

      console.error(err);
      manager.clearStaleState()
      localStorage.clear()
      router.push('/');
    });

}


);
</script>

<style>
.callback {
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  font-size: 2em;

}
</style>