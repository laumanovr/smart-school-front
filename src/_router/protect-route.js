export default {
	isExistRole (role) {
		let user = JSON.parse(localStorage.getItem('user'));
		return user.roles.some(i => i.code === role)
	},
	
	checkSchoolAdmin(next) {
		if (this.isExistRole('ROLE_ADMIN')) {
			next()
		} else {
			next('/login')
		}
	},
	
	checkInstructor(next) {
		if (this.isExistRole('ROLE_INSTRUCTOR')) {
			next()
		} else {
			next('/login')
		}
	},
	
	checkSuperAdmin(next) {
		if (this.isExistRole('ROLE_SUPER_ADMIN')) {
			next()
		} else {
			next('/login')
		}
	},
	
	checkParent(next) {
		if (this.isExistRole('ROLE_PARENT')) {
			next()
		} else {
			next('/login')
		}
	},
	
	checkRayonHeader(next) {
		if (this.isExistRole('ROLE_RAYON_HEADER')) {
			next()
		} else {
			next('/login')
		}
	},
	
	checkStudent(next) {
		if (this.isExistRole('ROLE_STUDENT')) {
			next()
		} else {
			next('/login')
		}
	}
}
