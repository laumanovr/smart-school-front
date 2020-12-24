<template>
    <div class="class-attendance-report">
        <PreLoader v-if="isLoading"/>
        <div class="header-title">
            <h3>Отчет посещаемости</h3>
        </div>

        <v-form class="select-form select-clear-block" ref="form">
            <v-select
                :items="classes"
                item-text="classTitle"
                item-value="classId"
                label="Класс"
                :rules="required"
                v-model="selectedClassId"
                class="v-select-item"
            />
            <v-select
                :items="schoolQuarters"
                item-text="semester"
                item-value="id"
                label="Четверть"
                :rules="required"
                v-model="selectedQuarterId"
                class="v-select-item"
            />
            <v-btn color="primary" @click="getAllClassStudents">Сгенерировать</v-btn>
        </v-form>

        <div class="report-content" ref="report" v-if="classStudents.length">
            <div class="report-title">
                <h3>Отчет посещаемости за {{selectedChronicleYear}}, четверть-{{selectedQuarterTitle}}, <br>
                    школы {{school.name}}</h3>
            </div>
            <table class="table bordered">
                <thead>
                <tr>
                    <th class="num">№</th>
                    <th>Ф.И.О</th>
                    <th class="absent95">Н</th>
                    <th class="absent92">Н</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(student, i) in classStudents" :key="student.id">
                    <td>{{ i + 1 }}</td>
                    <td>{{ student.surname + ' ' + student.name }}</td>
                    <td :class="{'absent95': student.total95}">{{ student.total95 }}</td>
                    <td>{{ student.total92 }}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import PreLoader from '@/components/preloader/PreLoader';
    import AnalyticsService from '@/_services/analytics.service';
    import {StudentService} from "@/_services/student.service";
    const studentService = new StudentService();

    export default {
        components: {
            PreLoader
        },
        props: {
            allChronicleYears: Array,
            classes: Array,
            schoolQuarters: Array
        },
        computed: {
            userProfile() {
                return this.$store.state.account.profile;
            },
            school() {
                return this.userProfile.schools[0];
            }
        },
        data() {
            return {
                required: [v => !!v || this.$t('required')],
                isLoading: false,
                classStudents: [],
                selectedQuarterId: '',
                selectedClassId: '',
                selectedChronicleYear: '',
                selectedQuarterTitle: '',
            }
        },
        methods: {
            getAllClassStudents() {
                if (this.$refs.form.validate()) {
                    this.classStudents = [];
                    this.isLoading = true;
                    studentService.getByClass(this.selectedClassId).then((res) => {
                        if (res.length) {
                            this.classStudents = res;
                            this.generateReport();
                        } else {
                            this.$toast.info('Нет учеников!');
                            this.isLoading = false;
                        }
                    }).catch((err) => {
                        this.$toast.error(err);
                        this.isLoading = false;
                    })
                }
            },

            generateReport() {
                this.selectedQuarterTitle = this.schoolQuarters.find(i => i.id === this.selectedQuarterId).semester;
                this.selectedChronicleYear = this.allChronicleYears.find(i => i.id === this.school.chronicleId).selectorTitle;
                AnalyticsService.getClassAttendanceCount(this.selectedClassId, this.selectedQuarterId).then((res) => {
                    this.classStudents = this.classStudents.map((student) => {
                        student.total92 = 0;
                        student.total95 = 0;
                        res.forEach((item) => {
                            if (student.id === item.studentId) {
                                student.total92 += item.total92;
                                student.total95 += item.total95;
                            }
                        });
                        return student;
                    }).sort((a, b) => (b.total92 + b.total95) - (a.total92 + a.total95));
                    this.isLoading = false;
                }).catch((err) => {
                    this.$toast.error(err);
                    this.isLoading = false;
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .header-title {
        h3 {
            font-size: 25px;
        }
    }
    .v-select-item {
        max-width: 160px;
    }
    .report-content {
        text-align: center;
        margin-top: 25px;
        .report-title {
            text-align: center;
            margin-bottom: 25px;
        }
        .num {
            width: 40px;
            min-width: 40px;
            max-width: 40px;
        }
        .absent95 {
            color: #f50606;
            width: 50px;
            min-width: 50px;
            max-width: 50px;
        }
        .absent92 {
            color: #707683;
            width: 50px;
            min-width: 50px;
            max-width: 50px;
        }
        table {
            font-weight: bold;
            width: 900px;
            margin: 0 auto;
            td, th {
                padding: 0;
            }
        }
    }
</style>
