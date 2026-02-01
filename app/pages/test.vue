<script setup lang="ts">

import { useOidcAuth } from "~/composables/useOidcAuth";

definePageMeta({
  middleware: ['auth']
})


const { user, login, logout } = useOidcAuth();
const { data: tasks, refresh, pending, error } = await useFetch('/api/edge', {
  headers: {
    "Authorization": `Bearer ${user.value?.access_token}`
  }
})

async function resync() {
  await useFetch('/api/edge', {
    headers: {
      "Authorization": `Bearer ${user.value?.access_token}`
    }
  })

}


</script>

<template>
  <div>
    <h1>Welcome to the Application</h1>
    <div v-if="user">
      <p>Hello, <strong>{{ user.profile.name }}</strong>! 👋</p>
      <pre><code>Access Token: {{ user.access_token.substring(0, 30) }}...</code></pre>
      <button @click="logout()">Sign Out</button>
    </div>
    <div v-else>
      <p>You are not logged in.</p>
      <button @click="login()">Sign In with Keycloak</button>
    </div>
  </div>

  <div>
    <h1>My Tasks</h1>

    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Error loading tasks: {{ error.message }}</div>

    <p v-else>
      {{ tasks }}
    </p>
    <button @click="resync">FETCH</button>
  </div>
</template>
