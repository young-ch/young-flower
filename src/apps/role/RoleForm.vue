<template>
  <div class="flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">역할 관리 {{ role.roleName && `- ${role.roleName}` }}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
      <v-spacer></v-spacer>
<!--      <v-btn @click="saveRole">{{ this.role.roleId != null ? '수정' : '추가' }}</v-btn>-->
      <v-btn dark color="red" @click="deleteRole" v-if="this.id"><v-icon left>mdi mdi-delete</v-icon>삭제</v-btn>
      <v-btn @click="resetRole" style="margin-left:1rem">
        <v-icon left>mdi-refresh</v-icon>리셋
      </v-btn>
      <v-btn dark color="indigo" @click="saveRole" style="margin-left:1rem"><v-icon left>mdi mdi-content-save</v-icon>저장</v-btn>
      <v-btn @click="goToList" style="margin-left:1rem"><v-icon left>mdi mdi-format-list-bulleted</v-icon>목록</v-btn>
    </div>

    <v-card class="mb-4">
      <v-card-title>기본 정보

        <v-spacer></v-spacer>
        <v-icon small color="primary" v-if="role.manager">mdi-security</v-icon>
        <span class="ma-1" v-if="role.manager">관리자 권한</span>

      </v-card-title>

      <v-card-text>
        <v-form ref="roleForm">
        <div class="d-flex">
            <v-col>
              <span class="font-weight-bold">사용 여부</span>
              <span class="mx-1">
                  <v-switch
                    v-model="role.activated"
                    flat
                    dense
                    :label="role.activated ?'사용':'사용안함'"
                  ></v-switch>
              </span>
            </v-col>
            <v-col>
              <span class="font-weight-bold">역할 타입</span>
              <span class="mx-1">
                  <v-switch
                    v-model="role.manager"
                    flat
                    dense
                    :label="role.manager ?'관리자':'사용자'"
                  ></v-switch>
              </span>
            </v-col>
            <v-col sm="8">
              <span class="font-weight-bold"></span>
              <span class="mx-3 sm6">
                  <v-text-field
                    v-model="role.roleName"
                    label="역할명을 입력해 주세요"
                    :rules="[rules.common.required]"
                    inverted
                    clearable
                    dense
                  ></v-text-field>
              </span>
            </v-col>
          </div>
          </v-form>
      </v-card-text>
    </v-card>

    <v-tabs v-model="tab" :show-arrows="false" background-color="transparent">
      <v-tab href="#tabs-endpoint">기능 접근 권한</v-tab>
      <v-tab href="#tabs-policy">기능 사용 정책</v-tab>
      <v-tab href="#tabs-user-menu">사용자 메뉴 권한</v-tab>
      <v-tab href="#tabs-admin-menu">관리자 메뉴 권한</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item value="tabs-endpoint">
        <Endpoints ref="tabs-endpoint" @callback-save-event="saveRole"
                   :selectedEndpoint="selectedEndpoint"
                   :headers="endpointHeader"
        ></Endpoints>
      </v-tab-item>

      <v-tab-item value="tabs-policy">
        <Policies ref="tabs-policy" @callback-save-event="saveRole"
                   :selectedPolicy="selectedPolicy"
                   :headers="policyHeader"
        ></Policies>
      </v-tab-item>

      <v-tab-item value="tabs-user-menu">
        <Menus ref="tabs-user-menu" @callback-save-event="saveRole"
                   :selectedMenu="selectedUserMenu"
        ></Menus>
      </v-tab-item>

      <v-tab-item value="tabs-admin-menu">
        <Menus ref="tabs-admin-menu" @callback-save-event="saveRole"
               :selectedMenu="selectedAdminMenu"
               category="ADMIN"
        ></Menus>
      </v-tab-item>

    </v-tabs-items>

    <div class="d-flex" style="margin-top:1rem">
      <v-spacer></v-spacer>
      <v-btn dark color="red" @click="deleteRole" v-if="this.id"><v-icon left>mdi mdi-delete</v-icon>삭제</v-btn>
      <v-btn @click="resetRole" style="margin-left:1rem">
        <v-icon left>mdi-refresh</v-icon>리셋
      </v-btn>
      <v-btn dark color="indigo" @click="saveRole" style="margin-left:1rem"><v-icon left>mdi mdi-content-save</v-icon>저장</v-btn>
      <v-btn @click="goToList" style="margin-left:1rem"><v-icon left>mdi mdi-format-list-bulleted</v-icon>목록</v-btn>

<!--      <v-btn icon @click="resetRole" style="margin-left:1rem">-->
<!--        <v-icon>mdi-refresh</v-icon>-->
<!--      </v-btn>-->
    </div>

  </div>
</template>

<script>

import RoleApi from '../../api/RoleApi'
import MenuApi from "@/api/MenuApi";

import rules from "@/utils/rules";

import Endpoints from "@/components/app/Endpoints"
import Menus from "@/components/app/Menus"
import Policies from "@/components/app/Policies"

import _ from "lodash";
import PolicyApi from "@/api/PolicyApi";

export default {
  components: {
    Endpoints,
    Menus,
    Policies
  },
  props: ['id'],
  data() {
    return {
      tab: null,
      rules,
      breadcrumbs: [{
        text: '역할관리',
        disabled: false,
        href: '#'
      }, {
        text: this.$props.id ? '역할수정' : '역할등록'
      }],
      role: {
      },
      copiedRole: {},
      selectedEndpoint: [],
      selectedPolicy: [],
      copiedSelectedEndpoint: [],
      copiedSelectedPolicy: [],
      selectedUserMenu: [],
      selectedAdminMenu: [],
      copiedUserSelectedMenu: [],
      copiedAdminSelectedMenu: [],
      endpointHeader: [
        {text: 'resource title', value: 'resourceDescription', align: 'left'},
        {text: 'api title', value: 'operationDescription', align: 'left'},
        {text: 'uri', value: 'uri', align: 'left'},
        {text: 'http method', value: 'httpMethod', align: 'left'},
        {text: '공개 여부', value: 'isPublicText'}
      ],
      policyHeader: [
        {text: '정책 그룹 코드', value: 'policyGroupCode', align: 'left'},
        {text: '정책 코드', value: 'policyCode', align: 'left'},
        {text: '정책 명', value: 'policyName', align: 'left'}
      ]
    }
  },
  methods: {
    async saveRole() {
      if(this.role.id === 1) {
        alert("관리자 역할은 수정하거나 삭제하실 수 없습니다.")
        return false
      }
      const isValidRoleForm = await this.$refs.roleForm.validate()
      if (confirm("역할 정보를 저장하시겠습니까?") && isValidRoleForm) {

        const selectedEndpoint = this.$refs["tabs-endpoint"].selected;
        this.role.roleEndpoints = selectedEndpoint.map(e => { return {'id': {'uri': e.uri, 'httpMethod':e.httpMethod}}})

        const selectedPolicy = this.$refs["tabs-policy"]?.selected??this.copiedSelectedPolicy.map(p => { return {'id': p.id} })
        this.role.rolePolicies = selectedPolicy.map(e => { return {'id': {'policyId': e.id}}})

        const selectedAdminMenu = this.$refs["tabs-admin-menu"]?.selected??this.copiedAdminSelectedMenu.map(e => { return {'id':e.menuId}})
        const selectedUserMenu = this.$refs["tabs-user-menu"]?.selected??this.copiedUserSelectedMenu.map(e => { return {'id':e.menuId}})
        this.role.roleMenus = [...selectedAdminMenu.map(e => { return {'id': {'menuId':e.id}}}), ...selectedUserMenu.map(e => { return {'id': {'menuId':e.id}}})]

        RoleApi.saveRole(this.role).then(result => {
          this.role.id = result.id
          alert("저장되었습니다.")
          // this.$router.push({path: '/roles'})
        })
      }
    },
    goToList() {
      this.$router.push({path: '/roles'})
    },
    resetRole() {
      this.role = _.cloneDeep(this.copiedRole)
      this.selectedEndpoint = _.cloneDeep(this.copiedSelectedEndpoint)
      this.selectedPolicy = _.cloneDeep(this.copiedSelectedPolicy)
      this.selectedUserMenu = _.cloneDeep(this.copiedUserSelectedMenu)
      this.selectedAdminMenu = _.cloneDeep(this.copiedAdminSelectedMenu)
    },
    deleteRole(role) {
      if(role.id === 1) {
        alert("관리자 역할은 수정하거나 삭제하실 수 없습니다.")
        return false
      }
      if (confirm('삭제하시겠습니까?'))
        RoleApi.deleteRole(role.id).then(() => {
          this.roles = this.roles.filter(r => r !== role)
          alert("삭제되었습니다.")
          this.$router.push({path: '/roles'})
        })
    }

  },
  created() {
    if (this.id) {
      RoleApi.getRole(this.id).then(async result => {
        this.role = result.data;
        this.copiedRole = _.cloneDeep(this.role)

        this.selectedEndpoint = this.role.roleEndpoints?.map(re => re.id)??[]
        const flatMenus = (result) => {
          let children = [];
          const flattenMenus = result.map(m => {
            if (m.childMenus && m.childMenus.length) {
              children = [...children, ...m.childMenus];
            }
            return m;
          });

          return flattenMenus.concat(children.length ? flatMenus(children) : children);
        };

        if(this.role.id === 1) {
          // const menus = await MenuApi.findMenusByCategory('HOME');
          const userMenus = await MenuApi.findMenusByCategory('HOME');
          const adminMenus = await MenuApi.findMenusByCategory('ADMIN');
          this.selectedUserMenu = flatMenus(userMenus).map(m => {
            return {
              menuId: m.id
            }
          })
          this.selectedAdminMenu = flatMenus(adminMenus).map(m => {
            return {
              menuId: m.id
            }
          })

          const tempPolicies = (await PolicyApi.findPolicies({size:-1})).content;
          this.selectedPolicy = tempPolicies.map(p => { return {'id': p.id} })

          // PolicyApi.findPolicies({size:-1}).then(async data => {
          //    this.selectedPolicy = await data.content.map(p => { return {'id': p.id} })
          // })

        } else {
          this.selectedUserMenu = this.role.roleHomeMenuIds?.map(id => {return {menuId: id}}) ?? []
          this.selectedAdminMenu = this.role.roleAdminMenuIds?.map(id => {return {menuId: id}}) ?? []
          this.selectedPolicy = this.role.rolePolicies?.map(re => {return {'id' : re.id.policyId}})??[]

          // this.selectedAdminMenu = _.cloneDeep(this.selectedUserMenu)
        }

        this.copiedSelectedEndpoint = _.cloneDeep(this.selectedEndpoint)
        this.copiedSelectedPolicy = _.cloneDeep(this.selectedPolicy)
        this.copiedUserSelectedMenu = _.cloneDeep(this.selectedUserMenu)
        this.copiedAdminSelectedMenu = _.cloneDeep(this.selectedAdminMenu)
      })
    }

    // console.log(this.$store.state.user)
  }


};
</script>
