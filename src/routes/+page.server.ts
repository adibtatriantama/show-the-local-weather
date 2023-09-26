import type { PageServerLoad } from './$types';
import { OPEN_WEATHER_API_KEY } from '$env/static/private';
import type { WeatherData } from './types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies, getClientAddress, fetch }) => {
	let lat: string;
	let lon: string;
	let coordSource: 'geolocation' | 'ip';

	// get location from cookies
	const coordStr = cookies.get('coord');
	if (coordStr) {
		const coord = JSON.parse(coordStr);

		[lat, lon, coordSource] = [coord.lat, coord.lon, coord.source];
	}
	// get location from ip address
	else {
		const response = await fetch(`http://ip-api.com/json/${getClientAddress()}`);
		const json = await response.json();

		[lat, lon, coordSource] = [json.lat, json.lon, 'ip'];

		cookies.set('coord', JSON.stringify({ source: coordSource, lat, lon }), {
			expires: new Date(new Date().getTime() + 5 * 60 * 1000)
		});
	}

	// get weather
	const unit = cookies.get('unit') || 'metric';
	const tempSymbol = unit === 'imperial' ? 'F' : 'C';
	const response = await fetch(
		`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_API_KEY}&units=${unit}`
	);
	const json: WeatherData = await response.json();

	return {
		weather: {
			...json.weather[0],
			icon: {
				small: `https://openweathermap.org/img/wn/${json.weather[0].icon}.png`,
				large: `https://openweathermap.org/img/wn/${json.weather[0].icon}@4x.png`
			}
		},
		coord: { source: coordSource, ...json.coord },
		temp: { unit, main: json.main.temp, feel_like: json.main.feels_like, symbol: tempSymbol },
		place: { name: json.name, countryId: json.sys.country },
		timestamp: json.dt,
		formattedDateTime: formatDateTime(json.dt)
	};
};

export const actions = {
	toggleTempUnit: async ({ cookies, request }) => {
		const data = await request.formData();
		const unit = data.get('tempUnit');

		if (!unit || typeof unit !== 'string') {
			return fail(400);
		}

		cookies.set('unit', unit, { expires: new Date(new Date().getTime() + 5 * 60 * 1000) });

		return { success: true };
	}
};

function formatDateTime(unixTimestamp: number) {
	const date = new Date(unixTimestamp * 1000);

	const months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];

	// Get the month, day, hours, and minutes
	const month = months[date.getMonth()];
	const day = date.getDate();
	const hours = date.getHours();
	const minutes = date.getMinutes();

	const formattedDate = `${month} ${day}, ${hours.toString().padStart(2, '0')}:${minutes
		.toString()
		.padStart(2, '0')}`;

	return formattedDate;
}
