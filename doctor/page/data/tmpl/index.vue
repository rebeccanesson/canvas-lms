
<div class="h-100 ph-3">
	<div class="fixed top-5 h-middle vh-center"><big>Patient Viewer</big></div>

	<select
		v-model="person"
		class="p-choose fixed top-5 left-3 v-center"
		@change="event = 0, active = ''">
		<option v-for="(p, i) in data" v-bind:value="i">
			{{ p.person.name }}
		</option>
	</select>
	<select 
		v-model="event"
		class="e-choose fixed top-5 right-5 v-center"
		@change="active = active">
		<option v-for="(ev, i) in p.event" v-bind:value="i">
			{{ ev.title }}{{ ev.elapsed ? ' - ' + ev.elapsed : '' }}
		</option>
	</select>


	<div class="flex-column">
		<div class="flex-top pv-5"></div>
		<div class="flex-mid relative">
			<div class="flex-row">
				<div class="flex-left person relative">

					<table>
						<tr><td colspan="2" class="text-center">
							<img class="face" v-bind:src="p.person.face"/>
						</td></tr>
						<tr><td class="text-center p-1" colspan="2">
							{{ p.person.name }} ({{ p.person.sex }}, {{ p.person.age }})
						</td></tr>
						<tr class="v-top">
							<td class=" key"><b>Marital Status</b></td>
							<td class="value">{{ p.person.marital_status || p.person.maritalstatus }}</td>
						</tr><tr class="v-top">
							<td class=" key"><b>Education</b></td>
							<td class="value">{{ p.person.education }}</td>
						</tr><tr class="v-top">
							<td class=" key"><b>Occupation</b></td>
							<td class="value">{{ p.person.occupation }}</td>
						</tr><!-- <tr class="v-top">
							<td class=" key"> Language: </td>
							<td class="value">{{ p.person.language }}</td>
						</tr> --><tr class="v-top">
							<td class=" key"><b>Race/Ethnicity</b></td>
							<td class="value">
								{{ p.person.race }}{{ p.person.ethnicity ? '/'+p.person.ethnicity : '' }}
							</td>
						</tr>
						<tr><td></td></tr>
						<tr><td colspan="2">{{ p.person.social }}</td></tr>
					</table>

					<div class="absolute w-100 bottom-1 text-center">
						<input type="button" class="pointer pastinfo" value="Patient Record">
						<input type="button" class="pointer pastinfo" value="Problem List">
						<input type="button" class="pointer pastinfo" value="Drug History">
						<input type="button" class="pointer pastinfo" value="Patient Charts">
					</div>
				</div>

				<div class="flex-mid relative">
					<div class="flex-column ph-3">
						<div class="flex-top">
							<input
								v-if="e.data.inbox.visible"
								v-bind:class="
									[!e.data.inbox.items.length
									 ? 'disabled'
									 :('inbox' === active
									 ? 'active'
									 : 'passive')]"
								type="button"
								class="pointer currinfo"
								@click="e.data.inbox.items.length ? active = 'inbox' : 0"
								value="Inbox">
							<input
								v-if="e.data.history.visible"
								v-bind:class="
									[!e.data.history.items.length
									 ? 'disabled'
									 :('history' === active
									 ? 'active'
									 : 'passive')]"
								type="button"
								class="pointer currinfo"
								@click="
									e.data.history.items.length 
										? active = 'history' : 0,
									app.show('history')"
								value="History">
							<input
								v-if="e.data.physical.visible"
								v-bind:class="
									[!(e.data.physical.data.body || e.data.physical.sign.length)
									 ? 'disabled'
									 :('physical' === active
									 ? 'active'
									 : 'passive')]"
								type="button"
								class="pointer currinfo"
								@click="
									 e.data.physical.data.body || e.data.physical.sign.length
										? active = 'physical' : 0,
									 app.show('physical')"
								value="Physical">
							<input
								v-if="e.data.procedure.visible"
								v-bind:class="
									[!e.data.procedure.items.length
									 ? 'disabled'
									 :('procedure' === active
									 ? 'active'
									 : 'passive')]"
								type="button"
								class="pointer currinfo"
								@click="
									 e.data.procedure.items.length
										? active = 'procedure' : 0,
									 app.show('procedure')"
								value="Procedure">
							<input
								v-if="e.data.investigate.visible"
								v-bind:class="
									[!(e.data.investigate.data.length || e.data.investigate.results.length)
									 ? 'disabled'
									 :('investigate' === active
									 ? 'active'
									 : 'passive')]"
								type="button"
								class="pointer currinfo"
								@click="
									 (e.data.investigate.data.length || e.data.investigate.results.length)
										? active = 'investigate' : 0,
									 app.show('investigate')"
								value="Investigate">
							<input
								v-if="e.data.management.visible"
								v-bind:class="
									[!e.data.management.items.length
									 ? 'disabled'
									 :('management' === active
									 ? 'active'
									 : 'passive')]"
								type="button"
								class="pointer currinfo"
								@click="
									 e.data.management.items.length
										? active = 'management' : 0,
									 app.show('management')"
								value="Management">
						</div>
						
						<div class="flex-mid scroll pv-3 ph-1">
							<div v-if="['inbox', 'history', 'procedure', 'management'].includes(active)">
								<div v-for="item in e.data[active].items"> 
									<p class="inherit-text" v-if="item.title"><b>{{ item.title }}</b><br></p>
									<div
											class="inherit-text" 
											v-if="item.body"
											v-bind:style="{ 'font-family': 'cmu-serif' }"
											v-html="item.body"></div>
								</div>
							</div>
							<div v-if="active==='physical'">
								<div v-if="e.data.physical.sign.length">
									<p><b> Vital Signs </b></p>
									<div class="ph-3">
										<table style="width:60%">
											<tr v-for='item in e.data.physical.sign'>
												<td class=" ph-1"><b>{{ item.name }}</b></td>
												<td class="value text-left" v-html="`${item.value} ${item.units}`"></td>
											</tr>
										</table>
									</div>
									<br>
								</div>

								<div v-if="e.data.physical.data.title">
									<b>{{ e.data.physical.data.title }}</b><br><br>
								</div>
								<div 
										v-if="e.data.physical.data.body"
										v-html="e.data.physical.data.body">
								</div>
							</div>
							<div v-if="active==='investigate'">
								<div
										v-for="r in e.data.investigate.results"
										v-if="e.data.investigate.results.length">
									<p><b>{{ r.title }}</b></p>
									<div class="ph-3">
										<table style="width:100%">
											<tr>
												<th class="text-left v-top ph-1"> Test </th>
												<th class="text-left v-top value"> Result </th>
												<th class="text-left v-top value"> Normal Range </th>
											</tr>
											<tr v-for='item in r.data'>
												<td class="v-top ph-1"><b>{{ item.name }}</b></td>
												<td class="v-top text-left value" v-html="`${item.value} ${item.units}`"></td>
												<td class="v-top text-left value" v-html="`${item.range} ${item.units}`"></td>
											</tr>
										</table>
									</div>
								</div>
								<div
										v-if="e.data.investigate.data.length"
										v-for="d in e.data.investigate.data">
									<div v-if="d.title"><b> {{ d.title }} </b><br></div>
									<div v-if="d.data" v-html="d.data"></div>
								</div>
							</div>
						</div>

						</div>
					</div>
				</div>
			</div>

		</div>
	</div>
</div>
