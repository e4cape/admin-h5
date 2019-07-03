<template>
  <div id="login">
    <flexbox orient="vertical" class="flexbox">
      <flexbox-item>
        <div class="flex-demo">
          <!-- <input type="text" placeholder="请输入账号" v-model="username" class="input" /> -->
          <group>
            <x-input
              placeholder="请输入账号"
              v-model="loginForm.username"
              type="text"
              required
              class="input"
            ></x-input>
          </group>
        </div>
      </flexbox-item>
      <flexbox-item>
        <div class="flex-demo">
          <!-- <input type="password" placeholder="请输入密码" v-model="password" class="input" /> -->
          <group>
            <x-input
              placeholder="请输入密码"
              v-model="loginForm.password"
              type="password"
              required
              class="input"
            ></x-input>
          </group>
        </div>
      </flexbox-item>
      <flexbox-item>
        <div class="flex-demo">
          <x-button :gradients="['#1D62F0', '#19D5FD']" class="loginBtn" @click.native="login">登录</x-button>
        </div>
      </flexbox-item>
    </flexbox>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    async login() {
      let res = await this.$axios.post("admin/sysUser/login", this.loginForm);
      //登陆成功
      if (res.data.code === 200) {
        // window.alert("登录成功")
        // console.log("登录成功");
        this.$vux.alert.show({
  title: '',
  content: '登录成功'
})

        //设置token
        window.sessionStorage.setItem("token", res.data.data.token);
        this.$router.push("/wuliushenhe");
      } else {
        //   window.alert("登录失败")
    //    console.log("登录失败");
    this.$vux.alert.show({
  title: '',
  content: '登录失败'
})
      }
    }

  }
};
</script>

<style lang="less" scoped>
#login {
  background-color: #324157;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .flexbox {
    width: 75%;
    // background-color: #fff;
  }
  .flex-demo {
    display: flex;
    justify-content: center;
    .input {
      height: 4vw;
      border-radius: 10px;
      background-color: #fff;
    }
    .loginBtn {
      height: 7vw;
      border-radius: 10px;
      width: 40%;
      font-size: 4vw;
      line-height: 7vw;
    }
  }
}
</style>

