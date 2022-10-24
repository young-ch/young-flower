<template>
  <div>
    <v-list-item
      v-if="authorized && (!menuItem.items || menuItem.items.length === 0)"
      :input-value="menuItem.value"
      :to="menuItem.link"
      :exact="menuItem.exact ? menuItem.regex ? !menuItem.regex.test($route.path) : true : false"
      :disabled="menuItem.disabled"
      active-class="primary--text"
      link

    >
      <v-list-item-icon>
        <v-icon :small="small" :class="{ 'grey--text': menuItem.disabled }" :right="!menuItem.depth || menuItem.depth !== 1">
          {{ menuItem.icon || 'mdi-circle-medium' }}
        </v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>
          {{ menuItem.key ? $t(menuItem.key) : menuItem.text }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-group
      v-else-if="authorized"
      :value="opened"
      :disabled="menuItem.disabled"
      :sub-group="subgroup"
      :to="menuItem.link"
      link
    >

      <template v-slot:activator>
        <v-list-item-icon v-if="!subgroup">
          <v-icon :small="small">{{ menuItem.icon || 'mdi-circle-medium' }}</v-icon>
        </v-list-item-icon>
        <span v-else>
        </span>
        <v-list-item-content>
          <v-list-item-title>
            {{ menuItem.key ? $t(menuItem.key) : menuItem.text }}
          </v-list-item-title>
        </v-list-item-content>
      </template>

      <slot></slot>

    </v-list-group>
  </div>
</template>

<script>
/*
|---------------------------------------------------------------------
| Navigation Menu Item Component
|---------------------------------------------------------------------
|
| Navigation items for the NavMenu component
|
*/
export default {
  props: {
    menuItem: {
      type: Object,
      default: () => {}
    },
    subgroup: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      authorized: false,
      opened: false
    }
  },
  async created() {
    const roles = this.$store.state.user?.roles??[]
    const permittedMenus = this.$store.state.user?.menus??[]
    // console.log(permittedMenus)

    // 1 is administrator role
    //console.log(this.menuItem);

    this.authorized = roles.includes("1");


    if(!this.authorized)
      this.authorized = permittedMenus.includes(this.menuItem.id) && this.menuItem.activated
      
    // this.opened = menuItem.value ? menuItem.value : menuItem.regex ? menuItem.regex.test($route.path) : false

    // this.opened = this.menuItem.regex ? new this.menuItem.regex.test(this.$route.path) : false

    //해당 소스가 반복하면서 메뉴를 생성해주는 것 같음.?
    this.opened = this.menuItem?.items?.map(m => m.link === this.$route.path).includes(true)??false
     
  

    // console.log(this.$store.state.user)
    // console.log(this.menuItem)
  }
}
</script>
<style lang="scss" scoped>
.v-list-group--sub-group {
  ::v-deep .v-list-group__header {
    padding-left: 20px !important
  }
}
</style>
