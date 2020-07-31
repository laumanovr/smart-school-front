<template>
	<v-form>
		<div class="form-head">
			<span>Добавить Школу</span>
			<img src="../../../assets/images/profile-icon.svg" alt="">
			<button class="profile-edit">
				<img src="../../../assets/images/icons/edit.svg">
			</button>
		</div>
		<div>
			<v-text-field v-model="school.name" label="Название"></v-text-field>
		</div>
		<div class="spacer">
			<v-text-field v-model="school.email" label="Email"></v-text-field>
			<v-text-field v-model="school.phone" label="Номер телефона"></v-text-field>
		</div>
		<div>
			<v-text-field v-model="school.address" label="Адрес"></v-text-field>
		</div>
		<div>
			<v-textarea
					v-model="school.description"
					outlined
					name="input-7-4"
					label="Outlined textarea"
					value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
			></v-textarea>
		</div>
		<div>
			<v-select
					:items="schoolTypes"
					item-text="title"
					item-value="val"
					label="Тип Школы"
					v-model="school.schoolType"
			></v-select>
		</div>
		<div>
			<v-select
					:items="languages"
					item-value="id"
					item-text="name"
					label="Язык"
			></v-select>
		</div>
		<div>
			<v-select
					:items="regions"
					item-text="title"
					item-value="id"
					label="Регион"
					@change="fetchRayons"
			></v-select>
		</div>
		<div>
			<v-select
					:items="rayons"
					item-text="title"
					item-value="id"
					label="Район"
			></v-select>
		</div>
		<div>
			<v-select
					:items="chronicles"
					label="Академический год"
			></v-select>
		</div>
		<div class="form-footer">
			<v-btn color="primary">Сохранить</v-btn>
			<v-btn>Отменить</v-btn>
		</div>
	</v-form>
</template>

<script>
import { LanguageService } from '@/_services/language.service'
import { RegionService } from '@/_services/region.service'
import { RayonService } from '@/_services/rayon.service'
import { ChronicleService } from '@/_services/chronicle.service'

const chronicleService = new ChronicleService()
const rayonService = new RayonService()
const regionService = new RegionService();
const languageService = new LanguageService();

export default {
    name: 'AddSchool',
	data: () => ({
		school: {},
		schoolTypes: [
			{
			    val: 'PUBLIC',
				title: 'Public'
			},
			{
			    val: 'PRIVATE',
				title: 'Private'
			}
		],
		languages: [],
		regions: [],
		rayons: [],
		chronicles: []
	}),
	mounted () {
        this.fetchLanguage()
		this.fetchRegions();
        this.fetchChronicles()
    },
    methods: {
        fetchLanguage () {
            languageService.list().then(res => {
                this.languages = res;
            }).catch(err => console.log(err));
        },
	    fetchRegions () {
            regionService.list(0).then(res => {
                this.regions = res.content;
            }).catch(err => console.log(err));
	    },
	    fetchRayons (id) {
            rayonService.listByRegion(id).then(res => {
	            this.rayons = res;
            }).catch(err => console.log(err));
	    },
	    fetchChronicles () {
            chronicleService.list().then(res => {
                this.chronicles = res;
            }).catch(err => console.log(err));
	    }
	}
}
</script>

<style lang="scss" scoped>
	.v-form {
	  background: #FFFFFF;
	  border-radius: 7px;
	  padding: 20px 40px;


	  > div {
	    display: flex;
	    justify-content: space-between;
	    align-items: center;

	    .v-input__v-slot .v-label {
	      color: red !important;
	    }

	    &.spacer {
	      .v-text-field:first-child {
	        margin-right: 20px;
	      }
	    }
	    &.form-head {
	      position: relative;
	      font-weight: normal;
	      font-size: 18px;
	      line-height: 21px;
	      color: #192A3E;

	      .profile-edit {
	        background: #FFFFFF;
	        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.08);
	        width: 24px;
	        height: 24px;
	        border-radius: 50%;
	        position: absolute;
	        right: 0;
	        bottom: 0;

	        img {
	          margin-top: 5px;
	        }
	      }
	    }
	    &.form-footer {
	      justify-content: center;

	      .v-btn:first-child {
	        margin-right: 20px;
	      }
	    }
	  }

}
</style>
