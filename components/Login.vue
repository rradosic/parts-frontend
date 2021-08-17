<template>
<a-row type="flex" justify="center" align="middle" style="height:100vh">
  <a-col :span="4">
    <a-card>
   <h2 style="text-align:center">Parts.io</h2>
    <a-form layout="vertical" :form="form" @submit="handleSubmit">
    <a-form-item :validate-status="userNameError() ? 'error' : ''" :help="userNameError() || ''">
      <a-input
        v-decorator="[
          'userName',
          { rules: [{ required: true, message: 'Please input your username!' }] },
        ]"
        placeholder="Username"
        v-model="credentials.username"
      >
        <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
      </a-input>
    </a-form-item>
    <a-form-item :validate-status="passwordError() ? 'error' : ''" :help="passwordError() || ''">
      <a-input
        v-decorator="[
          'password',
          { rules: [{ required: true, message: 'Please input your Password!' }] },
        ]"
        type="password"
        placeholder="Password"
        v-model="credentials.password"
      >
        <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
      </a-input>
    </a-form-item>
    <a-form-item style="float:right">
      <a-button type="primary" v-on:click="handleSubmit()" :disabled="hasErrors(form.getFieldsError())">
        Log in
      </a-button>
    </a-form-item>
  </a-form>
  </a-card>
  </a-col>
</a-row>
  
</template>

<script lang="ts">
import loginUserGql from '../gql/loginUser.gql';

function hasErrors(fieldsError:Array<string>) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
export default {
  data() {
    return {
      hasErrors,
      form: this.$form.createForm(this, { name: 'horizontal_login' }),
      credentials: {
                    username: '',
                    password: ''
                }
    };
  },
  mounted() {
    this.$nextTick(() => {
      // To disabled submit button at the beginning.
      this.form.validateFields();
    });
  },
  methods: {
    // Only show error after a field is touched.
    userNameError(): boolean {
      const { getFieldError, isFieldTouched } = this.form;
      return isFieldTouched('userName') && getFieldError('userName');
    },
    // Only show error after a field is touched.
    passwordError(): boolean {
      const { getFieldError, isFieldTouched } = this.form;
      return isFieldTouched('password') && getFieldError('password');
    },
    async handleSubmit() {
      try {
          const res = await this.$apollo.mutate({
              mutation: loginUserGql,
              variables: this.credentials
          }).then(({data}) => data && data.login)
          await this.$apolloHelpers.onLogin(res.token)
      } catch (e) {
          console.error(e)
      }
    },
  },
};
</script>