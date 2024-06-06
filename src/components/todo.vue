<script setup>
import { Select, Flex, Card, notification, Popover } from 'ant-design-vue';
import axios from 'axios';
</script>
<script>
export default {
    data() {
        return {
            tasksBase: {},
            tasks: {},
            tags: {},
            rowCount: 0,
            errorMsg: ''
        }
    },
    methods: {
        raiseError(errorText) {
            notification.error({
                message: 'Произошла ошибка:',
                description: errorText,
                placement: 'topLeft'
            })
        },
        filter(tag) {

        }
    },
    mounted() {
        if(!sessionStorage.username) window.location.href = window.location.origin+"/login"
        
        axios.get(window.location.origin + "/getTasks/" + sessionStorage.username, { 
            headers: {
                "Access-Control-Allow-Origin": "*",
                "ContentType": "application/x-www-form-urlencoded"  
            }
        }).then((response) => {
            this.tasksBase = response.data
            this.tasks = this.tasksBase
        }).catch((error) => this.raiseError(error.message))
    }
}
</script>
<template>
    <Flex wrap="wrap" gap="large" v-for="(v, k) in tasks">
        <Card :title="k" style="width:300px;">
            <template #extra>
                <Popover
                    title="Теги">
                    <template #content v-for="tag in v">
                        <a :data-value="tag" @click="filter(tag)">{{ tag }}</a>
                    </template>
                </Popover>
            </template>
        </Card>
    </Flex>

    <Select 
        v-model:value="value"
        mode="tags"
        :options="tags"
        @change="handleChange"
        >
    </Select>
</template>