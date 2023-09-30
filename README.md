# Show Current Weather

Fullstack app showing current weather in your location.

## Depend On

### [ip-api.com](https://ip-api.com/)

Getting location from ip address.

### [OpenWeatherMap](https://openweathermap.org/current)

Getting current weather info. To run this app, register to the site and create an API key.

Put your API in .env file

```
OPEN_WEATHER_API_KEY=<your api key>
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Reference

This project is from [Free Code Camp Take Home Projects](https://www.freecodecamp.org/learn/coding-interview-prep/take-home-projects/show-the-local-weather).

User stories to complete the challenge

1. I can see the weather in my current location.
2. I can see a different icon or background image (e.g. snowy mountain, hot desert) depending on the weather.
3. I can push a button to toggle between Fahrenheit and Celsius.
