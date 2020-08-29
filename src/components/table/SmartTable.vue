<template>
    <div class="smart-table">
        <div class="smart-table__head">
            <div class="smart-table__first-item">
                <slot name="firstItem"></slot>
            </div>
            <div class="smart-table__item">
                <slot name="table-head-right">
                    <span>{{ paginationText }}</span>
                    <button @click="$emit('leftClick')" :disabled="currentPage <= 1" class="next-prev">
                        <v-icon>$chevronLeft</v-icon>
                    </button>
                    <button @click="$emit('rightClick')" :disabled="currentPage >= totalPage" class="next-prev">
                        <v-icon>$chevronRight</v-icon>
                    </button>
                </slot>
            </div>
        </div>
        <div class="smart-table__body">
            <table class="smart-table__table">
                <div class="top-head-action" id="actions" v-if="itemsSelected">
                    <span>{{ itemsSelected }}</span>
                    <p>{{ itemsSelected }} Выбрано</p>
                    <button v-if="menu === 'Students'" @click="$emit('deleteStudents')">
	                    <img src="../../assets/images/icons/delete.svg" alt="">
                    </button>
                    <button class="add" v-else @click="$emit('addCourses')"> Add +</button>
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

export default {
    name: 'SmartTable',
    props: {
        schools: {
            type: Array,
            default() {
                return []
            }
        },
        totalElements: {
            type: Number,
            default: 0
        },
        pageSize: {
            type: Number,
            default: 20
        },
        currentPage: {
            type: Number,
            default: 1
        },
	    menu: {
        	type: String,
		    default: ''
	    }
    },
    computed: {
        itemsSelected() {
            return this.schools.filter(i => i.checked).length
        },
        paginationText () {
            return `Показано ${ (this.currentPage - 1) * this.pageSize + 1 }-${ (this.currentPage - 1) * this.pageSize + this.pageRemainder } из ${ this.totalElements }`
        },
        totalPage () {
            return Math.ceil(this.totalElements / this.pageSize);
        },
        pageRemainder () {
            return this.currentPage === this.totalPage ? this.totalElements !== this.pageSize ? this.totalElements % this.pageSize : this.pageSize : this.pageSize;
        }
    },
	// mounted() {
    // 	const el = document.getElementById('actions')
	// 	const body = el.closest('school-admin-manage__body')
    // 	if (body) {
    // 		body.addEventListener('scroll', function (e) {
	// 		    console.log(el.scrollIntoView())
	// 	    })
	//     }
	// },
	// beforeDestroy() {
	// 	window.removeEventListener('scroll', function (e) {
	// 		const elmnt = document.getElementById("actions");
	// 		console.log(elmnt.scrollIntoView())
	// 	})
	// },
	methods: {
		onScroll () {
			const elmnt = document.getElementById("actions");
			console.log(elmnt.scrollIntoView())
		}
	}
}
</script>

<style lang="scss" scoped>
.smart-table {
    &__head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 95%;
        margin: auto;
    }

    &__first-item {
        display: flex;
        margin-bottom: 20px;

        div {
            margin-right: 10px;
        }
    }

    &__item {
        display: flex;
        align-items: center;
        margin-bottom: 20px;

        .v-select {
            width: 150px;
            margin-right: 20px;
        }

        span:first-child {
            margin-right: 10px;
            font-size: 14px;
            line-height: 24px;
            color: #333333;
        }

        .next-prev {
            border: 1px solid #C6CBD4;
            box-sizing: border-box;
            border-radius: 2px;
            width: 32px;
            height: 32px;
        }
    }
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

        .top-head-action {
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

	        .sticky-top {
		        position: fixed;
		        top: 76px;
		        left: 100px;
		        right: 0;
	        }

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
                &.add {
	                background: #339DFA;
	                border-radius: 4px;
	                color: rgba(#FFFFFF, 1);
                }
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
