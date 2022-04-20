<template>
  <div class="container">
    <RouterView />
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@100;400&display=swap");
body{
  margin: 0;
}
.container {
  font-family: "Roboto", sans-serif;
  width: clamp(310px, 86vw, 1800px);
  margin: 30px auto;
}
@media (max-width: 820px) {
  .container {
    width: clamp(310px, 96vw, 800px);
    margin: 30px auto;
  }
}
</style>
