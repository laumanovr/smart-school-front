<template>
        <SmartBtn2 @onClick="exportExcel">Экспорт <img alt="" src="../../assets/images/icons/export.svg"></SmartBtn2>
</template>

<script>
import * as ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import SmartBtn2 from "@/components/button/SmartBtn2";
export default {
    name: "ExcelJs",
    components: {SmartBtn2},
    props: {
        rows: {
            type: Array,
            default () {
                return []
            }
        },
        headers: {
            type: Array,
            default () {
                return []
            }
        },
        fileName: {
            type: String,
            default: 'new Document'
        }
    },
    methods: {
        exportExcel (e, sheetName = 'Sheet') {
            const workbook = new ExcelJS.Workbook()
            workbook.creator = 'SmartSchool Team';
            workbook.created = new Date();
            workbook.modified = new Date();
            workbook.lastPrinted = new Date();
            const alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','AA'];
            const worksheet = workbook.addWorksheet(`${sheetName}`, {
                pageSetup: { paperSize: 9, orientation: 'landscape' }
            });
            const bodyBorder = {
                top: {style:'thin'},
                left: {style:'thin'},
                bottom: {style:'thin'},
                right: {style:'thin'}
            };
            const bodyFont = { size: 12 }
            const bodyAlignment = { wrapText: true }
            worksheet.addRow(this.headers);
            worksheet.getRow(1).font = { size: 14, bold: true }
            worksheet.getRow(1).alignment = { wrapText: true }
            worksheet.getRow(1).eachCell({ includeEmpty: true }, cell => {
                cell.border = bodyBorder
            })
            worksheet.addRows(this.rows);
            this.headers.forEach((i, index) => {
                worksheet.getColumn(index+1).width = 30
            });
            worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                if (rowNumber > 1) {
                    row.eachCell({ includeEmpty: true },(cell, colNumber) => {
                        cell.border = bodyBorder
                        cell.font = bodyFont
                        cell.alignment = bodyAlignment
                    })
                }
            })
            workbook.xlsx.writeBuffer().then((data) => {
                let blob = new Blob([ data ], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                saveAs(blob, `${this.fileName}.xlsx`);
            });
        }
    }
}
</script>

<style scoped>

</style>
