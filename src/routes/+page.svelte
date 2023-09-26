<script lang="ts">
	import { onMount, tick } from 'svelte';

	export let data;

	let geolocationForm: HTMLFormElement;
	let geolocationPermissionState: 'granted' | 'denied' | 'prompt' | 'error' | 'unknown' = 'unknown';
	let geoLocationErrorMessage = '';
	let lat: number;
	let lon: number;

	onMount(async () => {
		const permission = await navigator.permissions.query({ name: 'geolocation' });
		geolocationPermissionState = permission.state;

		if (permission.state === 'granted' && data.coord.source !== 'geolocation') {
			updateLocation();
		}
	});

	function updateLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				async (position) => {
					lat = position.coords.latitude;
					lon = position.coords.longitude;

					await tick();

					geolocationForm.submit();
				},
				(error) => {
					switch (error.code) {
						case error.PERMISSION_DENIED:
							geolocationPermissionState = 'denied';
							break;
						case error.POSITION_UNAVAILABLE:
							geolocationPermissionState = 'error';
							geoLocationErrorMessage = 'Geolocation error, postition is currently unavailable.';
							break;
						case error.TIMEOUT:
							geolocationPermissionState = 'error';
							geoLocationErrorMessage = 'Geolocation error, timeout.';
							break;
					}
				}
			);
		} else {
			geolocationPermissionState = 'error';
			geoLocationErrorMessage = "This device doesn't support geolocation";
		}
	}
</script>

<svelte:head>
	<title>{data.place.name} - {data.weather.main}</title>
	<link rel="icon" href={data.weather.icon.small} />
</svelte:head>

<main class="container sm:mx-auto sm:mt-10 mt-4 mx-4">
	<h1 class="sm:text-4xl text-2xl font-bold">Current Weather</h1>

	<div class="mt-8">
		<span class="text-blue-600">{data.formattedDateTime}</span><br />
		<h2 class="sm:text-2xl text-xl font-semibold">{data.place.name}, {data.place.countryId}</h2>
		<form method="POST" class="inline" bind:this={geolocationForm} action="?/updateLocation">
			<input type="hidden" name="lat" bind:value={lat} />
			<input type="hidden" name="lon" bind:value={lon} />
		</form>
		{#if geolocationPermissionState === 'prompt'}
			<span class="text-sm">location not accurate?</span>
			<button class="text-sm text-blue-600" on:click={updateLocation}>enable geolocation</button>
		{:else if geolocationPermissionState === 'denied'}
			<span class="text-sm"
				>based on your ip address, enable location permission manually to get more accurate location</span
			>
		{:else if geolocationPermissionState === 'error'}<span class="text-sm"
				>based on your ip address.
			</span>
			<span class="text-sm text-red-700">{geoLocationErrorMessage}</span>
		{/if}
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
			<span class="text-right"
				>Feel like {data.temp.feel_like}<sup>&deg;</sup>{data.temp.symbol}</span
			>
		</div>
	</div>
</main>
