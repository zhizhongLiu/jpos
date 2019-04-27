<template>
  <div class="wrapper">
    <embed
      v-for="(item, key) in tabItems"
      :key="key"
      :src="item.src"
      type="weex"
      :style="{visibility: item.visibility}"
      class="content"
      ></embed>
    <div
      :style="{height: barHeight}"
      class="tabbar"
      append="tree">
      <dd-tabitem
        v-for="(item, key) in tabItems"
        :key="key"
        :index="item.index"
        :icon="item.icon"
        :title="item.title"
        :titleColor="item.titleColor"
        :pattern="item.pattern"
        @tabItemOnClick="tabItemOnClick"
        ></dd-tabitem>
    </div>
  </div>
</template>

<style>
  .wrapper {
    width: 750;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin-top: 0;
    margin-bottom: 98;
  }
  .tabbar {
    flex-direction: row;
    align-items: flex-end;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
/*    height: 98;*/
  }
</style>

<script>
  export default {
    components: {
      ddTabitem: require('./dd-tabitem.vue')
    },

    props: {
      tabItems: { default: [] },
      selectedColor: { default: '#ff0000' },
      unselectedColor: { default: '#000000' },
      pattern: { default: 'normal' }, // normal special
    },

    computed: {
      barHeight: function () {
        return this.pattern === 'normal' ? '98' : '118';
      }
    },

    data: function () {
      return {
        selectedIndex: 0
      }
    },

    created: function () {
      this.select(this.selectedIndex);
    },

    methods: {
      tabItemOnClick: function (e) {
        this.selectedIndex = e.index;
        this.select(e.index);
        this.$emit('tabBarOnClick', e);
      },

      select: function(index) {
        for(var i = 0; i < this.tabItems.length; i++) {

          var tabItem = this.tabItems[i];
          if(i == index){
            tabItem.icon = tabItem.selectedImage;
            tabItem.titleColor = this.selectedColor;
            tabItem.pattern = this.pattern;
            tabItem.visibility = 'visible';
          } else {
            tabItem.icon = tabItem.image;
            tabItem.titleColor = this.unselectedColor;
            tabItem.pattern = 'normal';
            tabItem.visibility = 'hidden';
          }
        }
      },
    }
  }
</script>
