<template>
    <div class="smart-table">
        <TableHead>
            <template v-slot:firstItem>
                <slot name="firstItem"></slot>
            </template>
        </TableHead>
        <div class="smart-table__body">
            <table class="smart-table__table">
                <div v-if="itemsSelected">
                    <span>{{ itemsSelected }}</span>
                    <p>{{ itemsSelected }} Выбрано</p>
                    <button @click="$emit('addCourses')"> Add +</button>
                </div>
                <thead>
                <tr>
                    <slot name="head"></slot>
                </tr>
                </thead>
                <tbody>
                <tr :key="index" v-for="(item, index) in schools">
                    <slot name="body" v-bind:item="item">
                        {{ item.name }}
                    </slot>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import TableHead from '@/components/table/TableHead'

export default {
    name: 'SmartTable',
    props: {
        schools: {
            type: Array,
            default() {
                return []
            }
        }
    },
    components: {TableHead},
    computed: {
        itemsSelected() {
            return this.schools.filter(i => i.checked).length
        }
    }
}
</script>

<style lang="scss" scoped>
.smart-table {
    &__body {
        overflow-y: auto;
    }

    &__table {
        width: 95%;
        margin: auto;
        background: linear-gradient(180deg, rgba(74, 39, 243, 0.1) 0%, rgba(51, 157, 250, 0.1) 100%);
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        text-align: center;
        border-collapse: collapse;
        position: relative;

        div {
            background: #FFFFFF;
            border-top-right-radius: 4px;
            border-top-left-radius: 4px;
            height: 48px;
            left: 1px;
            right: 1px;
            top: 0;
            position: absolute;
            display: flex;
            align-items: center;
            padding-left: 22px;
            font-weight: normal;
            font-size: 14px;
            line-height: 16px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);

            span {
                background: #339DFA;
                border-radius: 2px;
                font-weight: bold;
                font-size: 9px;
                line-height: 10px;
                color: #FFFFFF;
                padding: 2px 5px;
            }

            p {
                margin: 0 0 0 30px;
                padding: 0;
            }

            button {
                margin-left: 30px;
                padding: 5px;
                background: #339DFA;
                border-radius: 4px;
                color: rgba(#FFFFFF, 1);
            }
        }

        tbody {
            tr:hover {
                box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
            }
        }

        tr:first-child {
            border-top: none;
        }

        th {
            font-size: 15px;
            line-height: 17px;
            letter-spacing: 0.01em;
            color: #339DFA;
        }

        td {
            font-size: 14px;
            line-height: 16px;
            letter-spacing: 0.01em;
            color: #707683;
            &.actions {
                cursor: pointer;
            }
        }

        tr {
            border: 1px solid rgba(0, 0, 0, 0.1);

            th:nth-child(odd), td:nth-child(odd) {
                background: #FFFFFF;
            }
        }

        th, td {
            padding: 15px 5px;
        }

        td:hover {
            box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
        }

        td:last-child {
            border-right: none;
        }

        tr:last-child {
            td {
                border-bottom: none;
            }
        }
    }
}
</style>
