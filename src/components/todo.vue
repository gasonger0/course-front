<script setup>
import { Select, Flex, Card, notification, Popover, Button, InputSearch, Modal, Input, Form, Textarea} from 'ant-design-vue';
import axios from 'axios';
import { ref, reactive } from 'vue';
import { CheckOutlined, PlusCircleOutlined, CloseCircleOutlined } from '@ant-design/icons-vue';
</script>
<script>
export default {
    data() {
        return {
            tasksBase: {},
            tasks: {},
            tags: {},
            rowCount: 0,
            errorMsg: '',
            curTags: ref([]),
            activeSelect: [],
            open: ref(false),
            formState: reactive({
                title: '',
                desc: ''
            }),
        }
    },
    methods: {
        raiseError(errorText) {
            notification.open({
                message: 'Произошла ошибка:',
                description: errorText,
                placement: 'topLeft'
            })
        },
        filter(tag) {

        },
        showSelect(k, tags) {
            console.log(tags);
            this.curTags = ref(tags);
            this.activeSelect.push(k);
        },
        changeTags(k) {
            let index = this.activeSelect.indexOf(k);
            if (index !== -1) {
                this.activeSelect.splice(index, 1);
                let obj = {
                    'name': k,
                    'tags': this.curTags,
                    'username': sessionStorage.username
                };
                let str = Object.keys(obj).map(k => k + '=' + obj[k]).join('&');
                this.curTags = ref([]);
                axios.post(window.location.origin + '/updateTags/', str);
                
            }
        },
        removeTask(k) {
            console.log(this.$data.tasksBase);
            let id = this.$data.tasksBase.map(function (e) { return e.name }).indexOf(k);
            axios.post(window.location.origin + '/removeTask', 'id='+id+'&username='+sessionStorage.username);
        },
        openModal() {
            this.open = ref(true);
        },
        getTasks() {
            axios.get(window.location.origin + "/getTasks/" + sessionStorage.username, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "ContentType": "application/x-www-form-urlencoded"
                }
            }).then((response) => {
                this.tasksBase = response.data
                this.tasks = this.tasksBase
            }).catch((error) => this.raiseError(error.message))
        },
        addTask() {
            let obj = this.formState;
            obj.csrfToken = localStorage.csrf;
            obj.tags = this.curTags;
            obj.username = sessionStorage.username;
            let str = Object.keys(obj).map(k => k + '=' + obj[k]).join('&');
            axios.post(window.location.origin + '/addTask', str);
            this.open = ref(false);
        }
    },
    mounted() {
        if (sessionStorage.username == '') {
            console.log(sessionStorage.username);
            window.location.href = window.location.origin + "/login"
        }
        this.getTasks()
    }
}
</script>
<template>
    <Modal v-model:open="open" title="Новая запись" @ok="addTask">
        <Form
            v-model="formState"
            name="new">
            <span>Название</span>
            <br><br>
            <Input v-model:value="formState.title" placeholder="Навзание записи"></Input>
            <br>
            <br>
            <span>Теги</span>
            <Select v-model:value="curTags" mode="tags" style="width:100%;" placeholder="Tag1, Tag2, Tag3.."></Select>
            <br>
            <br>
            <span>Описание</span>
            <Textarea v-model:value="formState.desc" laceholder="Описание"></Textarea>
        </Form>
    </Modal>
    <div style="width:100%; padding:20px 0; display:flex; justify-content: space-between;">
        <InputSearch style="width:80%;" placeholder="Начинайте вводить ..."></InputSearch>
        <Button type="primary" @click="openModal">
            <PlusCircleOutlined />
            Новая
        </Button>
    </div>
    <Flex wrap="wrap" gap="large" :vertical="false" justify="center">
        <Card style="width:300px;" v-for="(v, k) in tasks" :title="k">
            <template #extra>
                <div
                    style="width: 100%; display: flex; flex-direction: row; align-items: center; justify-content: space-between;">
                    <div style="display:flex; align-items: center;">
                        <Popover>
                            <template #title>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span>Теги</span>
                                    <Button type="dashed" @click="showSelect(k, v.tags)">Добавить</Button>
                                </div>
                            </template>
                            <template #content>
                                <div v-for="tag in v.tags">
                                    {{ tag }}
                                </div>
                            </template>
                            <Button type="link">Теги</Button>
                        </Popover>
                        <CloseCircleOutlined @click="removeTask(k)" style="color:red;font-size:24px;" />
                    </div>
                </div>
            </template>
            <p>{{ v.desc ? v["desc"][0] : ''}}</p>
            <div v-show="activeSelect.indexOf(k) >= 0" style="display:flex; flex-wrap:wrap; justify-content: end;">
                <Select v-model:value="curTags" mode="tags" style="width:100%;"></Select>
                <Button type="primary" @click="changeTags(k)" style="margin:10px 0;">
                    <CheckOutlined />
                </Button>
            </div>
        </Card>
    </Flex>
</template>
<style scope>
#todo {
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
}
</style>