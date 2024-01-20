export interface ICard {
	id: string;
	title: string;
	description: string;
	category: string;
	image: string;
	price: number | null;
}

export interface IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: ICard[];
}

export interface IOrderResult {
	id: string;
	total: number | null;
}