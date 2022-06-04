export class CreateOrderDto {
	cpf: string
	nome: string
	telefone: string
	products: Array<{
		price: string,
		key: string,
		qtd: number,
		name: string
		total: string,
		orderTotal: string
	}>
}
