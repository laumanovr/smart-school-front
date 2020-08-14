<template>
    <div class="course-grid">
        <div class="course-grid__card grid-card" v-for="item in courses" :key="item.id">
            <div class="grid-card__body">
                <div class="grid-card__img">
                    <img alt="" src="../../../assets/images/icons/book.svg">
                </div>
                <div class="grid-card__info">
                    <div class="grid-card__title">
                        <div>Название</div>
                        <div>{{ item.title }}</div>
                    </div>
                    <div class="grid-card__description">
                        <div>Описание</div>
                        <div>{{ item.description }}</div>
                    </div>
                </div>
            </div>
            <div class="grid-card__footer">
                <div class="grid-card__edit">
                    <img @click="$emit('onEdit', item)" class="clickable-icons" src="../../../assets/images/icons/edit-green.svg">
                </div>
                <div class="grid-card__delete">
                    <img @click="$emit('onDelete', item)" class="clickable-icons" alt="" src="../../../assets/images/icons/trash.svg">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "CourseGrid",
    props: {
        courses: {
            type: Array,
            default () {
                return [];
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .course-grid {
        font-family: Helvetica,sans-serif;
        font-style: normal;
        font-weight: normal;
        margin: 0 30px;
        background: #FFFFFF;
        border-radius: 7px;
        display: flex;
        flex-wrap: wrap;
        padding: 10px 0;
        justify-content: center;

        &__card {
            background: #FFFFFF;
            border: 0.7px solid rgba(167, 209, 233, 0.45);
            box-sizing: border-box;
            border-radius: 7px;
            width: 260px;
            height: 160px;
            margin: 20px;
        }
    }
    .grid-card {
        display: flex;
        flex-direction: column;
        &__body {
            display: flex;
            padding: 15px;
            flex: 1;
        }
        &__img {
            background: rgba(76, 184, 255, 0.07);
            width: 61px;
            height: 61px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        &__info {
            padding: 0 10px;
        }
        &__title {
            margin-bottom: 10px;
            div:first-child {
                letter-spacing: 0.01em;
                font-size: 11px;
                line-height: 13px;
                color: #339DFA;
                margin-bottom: 5px;
            }
            div:last-child {
                color: #192A3E;
                opacity: 0.5;
                font-size: 18px;
                line-height: 21px;
                letter-spacing: 0.01em;
            }
        }
        &__description {
            letter-spacing: 0.01em;
            div:first-child {
                font-size: 11px;
                line-height: 13px;
                color: #339DFA;
                margin-bottom: 5px;
            }
            div:last-child {
                color: #192A3E;
                opacity: 0.5;
                font-size: 13px;
                line-height: 15px;
            }
        }
        &__footer {
            display: flex;
            div {
                padding: 10px;
                flex: 1;
                text-align: center;
                border-top: 0.2px solid rgba(#858585, 0.3);
            }
            div:first-child {
                border-right: 0.2px solid rgba(#858585, 0.3);
            }
        }
    }
</style>
