<script setup>
import { PageHeader, Form, FormItem, Input, Button, notification } from 'ant-design-vue';
import { reactive } from 'vue';
import axios from 'axios';
</script>
<script>
export default {
    data() {
        return {
            formState: reactive({
                name: '',
                pswd: ''
            }),
        }
    },
    methods: {
        sendForm(isRegistered) {
            let obj = this.formState;
            obj.csrfToken = localStorage.csrf;
            let str = Object.keys(obj).map(k => k + '=' + obj[k]).join('&')
            if (isRegistered) {
                axios.post(window.location.origin + '/validate', str, {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "ContentType": "application/x-www-form-urlencoded"  
                    }
                }).then((response) => {
                    sessionStorage.username = response.data.username
                    window.location.href = window.location.origin+'/todo'
                }).catch((response) => {
                    this.raiseError(response.message);
                })
            } else {
                axios.post(window.location.origin + '/createUser', str, {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "ContentType": "application/x-www-form-urlencoded"
                    }
                }).then((response) => {
                        sessionStorage.username = response.data.username
                        window.location.href = window.location.origin+'/todo'
                }).catch((response) => {
                    this.raiseError(response.message);
                })
            }
        },
        raiseError(errorText) {
            notification.open({
                message: 'Произошла ошибка:',
                description: errorText,
                placement: 'topLeft'
            })
        }
    },
    mounted() {
        if (sessionStorage.username) {
            window.location.assign(window.location.origin + '/todo')
        }
        
    }
}
</script>
<template>
    <div class="form-container">
        <PageHeader title="Авторизация" style="padding-bottom: 0;"></PageHeader>

        <Form :model="formState" name="auth" autocomplete="on" style="padding: 20px 24px;">
            <FormItem label="Логин" name="name">
                <Input v-model:value="formState.name" />
            </FormItem>
            <FormItem label="Пароль" name="pswd">
                <Input v-model:value="formState.pswd" type="password" />
            </FormItem>
            <div style="display:flex; justify-content: space-between;">
                <Button type="primary" @click="sendForm(true)" style="width:45%;">Войти</Button>
                <Button @click="sendForm(false)" style="width:45%;">Регистрация</Button>
            </div>
        </Form>
    </div>
</template>
<style scope>
#login {
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
}
</style>