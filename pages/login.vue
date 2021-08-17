<template>
  <Login/>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  mounted(){
    console.log(this.$auth.loggedIn);
  }
})
</script>
