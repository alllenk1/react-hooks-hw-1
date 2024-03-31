export type Position = {
	name: string;
	latitude: number;
	longitude: number;
};

export type WeatherProps = {
	city: string | undefined;
	onError: (boolean: boolean) => void;
};

export type WeatherData = {
	temp_c: string;
	conditionText: string;
	conditionIcon: string;
};

export type CityCheckerProps = {
	className: string;
	onSubmit: (newCity: string) => void;
	onError: (boolean: boolean) => void;
};