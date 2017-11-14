<template>
	<transition name="slideOne">
		
	</transition>
</template>

<script>
	import {mapGetters} from 'vuex'
	import {mapMutations} from 'vuex'
	export default {
		data() {
			return{
				choosePersonList:[]
			}
		},
		computed:{
			...mapGetters([
				'comPersonList'
			])
		},
		props:{
			infoList: {
		        type: Array
	        },
	        personShow:{
	       		type:Boolean,
	       		dafault:false
	        }
		},
		methods: {
			choosePerson(item, index) {
				this.choosePersonList.push(item)
				this.setChoosePersonList(this.choosePersonList)
				this.$emit('choosePerson',item,index)
			},
			closePersonList() {
				this.$emit('close')
			},
			...mapMutations({
		    	setChoosePersonList: 'SET_CHOOSE_PERSON_LIST'					  
		    }),
		}

	};
</script>

<style lang="scss">
	
</style>