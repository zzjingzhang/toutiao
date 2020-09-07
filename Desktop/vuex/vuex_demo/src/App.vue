<template>
  <div>
    <my-addition></my-addition>
    <p>-----------------------------</p>
    <my-subtraction></my-subtraction>
  </div>

</template>

<script>
import Addition from './components/Addition'
import Subtraction from './components/Subtraction'
export default {
  data() {
    return {

    }
  },
  components: {
    'my-addition': Addition,
    'my-subtraction': Subtraction
  },
  methods: {

  }

}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
