<script lang="ts">
	export let data;
</script>

<main class="container sm:mx-auto sm:mt-10 mt-4 mx-4">
	<h1 class="sm:text-4xl text-2xl font-bold">Current Weather</h1>

	<div class="mt-8">
		<span class="text-blue-600">{data.formattedDateTime}</span><br />
		<h2 class="sm:text-2xl text-xl font-semibold">{data.place.name}, {data.place.countryId}</h2>
	</div>
	<div class="mt-4">
		<div class="flex flex-row items-center">
			<div class="h-24 w-24">
				<img src={data.weather.icon.large} alt="" />
			</div>
			<div class="ml-2">
				<span class="text-4xl">{data.weather.main}</span><br />
				<span>{data.weather.description}</span>
			</div>
		</div>
		<div class="mt-4">
			<form method="POST" action="?/toggleTempUnit">
				<input
					type="hidden"
					name="tempUnit"
					value={data.temp.unit === 'imperial' ? 'metric' : 'imperial'}
				/>
				<button class="text-2xl text-right"
					>{data.temp.main}<sup>&deg;</sup>{data.temp.symbol}</button
				>
			</form>
			<br />
			<span class="text-right"
				>Feel like {data.temp.feel_like}<sup>&deg;</sup>{data.temp.symbol}</span
			>
		</div>
	</div>
</main>
