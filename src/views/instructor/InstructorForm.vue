<template>
    <div class="min-obraz-form">
        <div class="header-title"><h3>Формы Министерства Образования</h3></div>

        <table class="table bordered">
            <thead>
            <tr>
                <th>Название формы</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="form in formLinks" :key="form.path">
                <td>{{form.title}}</td>
                <td><v-btn color="primary"><a :href="form.path">Скачать</a></v-btn></td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
  data () {
    return {
      formLinks: [
        { title: 'Календарно-тематический план', path: '/docs/forms/form1.docx' },
        { title: 'План-конспект урока', path: '/docs/forms/form2.docx' },
        { title: 'Отчет о качестве знаний и успеваемости учащихся по преподаваемому предмету', path: '/docs/forms/form3.docx' },
        { title: 'Документация по соблюдению техники безопасности на уроке ', path: '/docs/forms/form4.docx' },
        { title: 'Информация об участниках государственной итоговой аттестации, общереспубликанского тестирования', path: '/docs/forms/form5.docx' },
        { title: 'Отчет о движении, успеваемости и посещаемости учащихся класса', path: '/docs/forms/form6.docx' },
        { title: 'Характеристика на ученика', path: '/docs/forms/form7.docx' },
        { title: 'Отчет по воспитательной работе', path: '/docs/forms/form8.docx' },
        { title: 'Социальный паспорт класса', path: '/docs/forms/form9.docx' },
        { title: 'План работы социального педагога', path: '/docs/forms/form10.docx' },
        { title: 'Отчет по реализации плана работы', path: '/docs/forms/form11.docx' },
        { title: 'Отчет по профилактике безнадзорности учащихся', path: '/docs/forms/form12.docx' },
        { title: 'Социальный банк данных', path: '/docs/forms/form13.docx' },
        { title: 'План работы по внеклассной и внешкольной воспитательной работе', path: '/docs/forms/form14.docx' },
        { title: 'Отчет о проделанной работе', path: '/docs/forms/form15.docx' },
        { title: 'Протоколы заседаний классных руководителей', path: '/docs/forms/form16.docx' },
        { title: 'Журнал организатора внеклассной и внешкольной работы', path: '/docs/forms/form17.docx' }
      ]
    }
  }
}
</script>

<style lang="scss">
.min-obraz-form {
    margin: 0 20px 35px;
    .table {
        a {
            color: #fff;
            text-decoration: none;
        }
    }
}
</style>
