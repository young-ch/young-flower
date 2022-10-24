<template>
  <section>
    <v-autocomplete
        v-model="searchUsers"
        :items="users"
        chips
        dense
        label="이름 / 아이디 / 핸드폰 번호 / 이메일 검색"
        item-text="name"
        item-value="name"
        multiple
        return-object
        :filter="userFilter"
        :search-input.sync="searchUserKeyword"
        @keydown.enter="searchUser(searchUserKeyword)"
        v-on:change="changeCallback"
    >
      <template v-slot:selection="data">
        <v-chip
            v-bind="data.attrs"
            :input-value="data.selected"
            close
            @click="data.select"
            @click:close="removeUser(data.item)"
        >
          <v-avatar left>
            <img :src="`${attachFileServerUrl}/user/photo/${data.item.photoFile}`">
          </v-avatar>
          {{ data.item.name }}
        </v-chip>
      </template>
      <template v-slot:item="data">
        <template v-if="typeof data.item !== 'object'">
          <v-list-item-content v-text="data.item"></v-list-item-content>
        </template>
        <template v-else>
          <v-list-item-avatar>
            <img :src="`${attachFileServerUrl}/user/photo/${data.item.photoFile}`">
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{data.item.name}} / {{ data.item.departmentGroup ? data.item.departmentGroup[0].groupName : '' }}</v-list-item-title>
            <v-list-item-subtitle>{{data.item.userId}} / {{ data.item.mobileNo }} / {{ data.item.email }}</v-list-item-subtitle>
            <v-list-item-subtitle>
              <template v-for="g in data.item.clubGroup">
                {{g.groupName}},
              </template>
            </v-list-item-subtitle>
          </v-list-item-content>
        </template>
      </template>
    </v-autocomplete>
  </section>
</template>

<script>
import userApi from '@/api/UserApi'

export default {
  name: "UserSearchComponent",
  props: {
  },
  data: () => ({
    users: [],
    searchUsers: [],
    searchUserKeyword:null,
    attachFileServerUrl: process.env.VUE_APP_ATTACH_FILE_SERVER_URL,
    waitingSearch: false
  }),
  watch: {
    searchUserKeyword(v) {
      if (v != null && v.length > 1 && !this.waitingSearch) {
        setTimeout(() => {
          this.searchUser(v);
          this.waitingSearch = false;
        }, 500); // 0.5 sec delay
        this.waitingSearch = true;
      }
    },
    searchUsers(nv) {
      if(nv) {
        this.searchUserKeyword = null;
      }
    }
  },
  methods: {
    searchUser(v) {
      if (v != null && v.length > 1) {
        const params = {
          size: -1,
          page: 1,
          searchKeyword: v
        }
        userApi.list(params).then(data => {
          this.users = [...this.searchUsers, ...data.content];

          // console.log(data);
          // this.totalItems = data.totalElements;
        });
      }
    },
    userFilter(item, queryText) {

      const searchText = queryText.toLowerCase();
      const name = item.name.toLowerCase();
      const userId = item.userId.toLowerCase();
      const mobileNo = item.mobileNo.toLowerCase();
      const email = item.email.toLowerCase();

      return name.indexOf(searchText) > -1 || userId.indexOf(searchText) > -1 || mobileNo.indexOf(searchText) > -1 || email.indexOf(searchText) > -1

    },
    changeCallback() {
      this.$emit('callback-event', this.searchUsers);

    },
    removeUser (item) {
      this.searchUsers = this.searchUsers.filter(u => u.userId !== item.userId);
      this.$emit('callback-event', this.searchUsers);
    },
  },
  created() {

  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/style/layout/variables';
</style>