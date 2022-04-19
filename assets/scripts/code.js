const container = document.querySelector('.mycontainer')
const todoAdded = document.querySelector('.todoadded')
const statusSpan = document.querySelector('.status')
var loc = window.location.pathname;

class Product {
	constructor(product) {
		this.createDiv(product)
	}
	createDiv(product) {
		
		let nameItemBox = this.createItemBox(product.name)
		let descItemBox = this.createItemBox(product.desc)
		let quantityItemBox = this.createItemBox(product.quantity)
		let priceItemBox = this.createItemBox(product.price)

		let imgItemBox = document.createElement('img')
		imgItemBox.src = 'uploads/' + product.image
		imgItemBox.width = 256
		imgItemBox.height = 256
		imgItemBox.classList.add('img-thumbnail')
		imgItemBox.classList.add('rounded')

		let row = document.createElement('div')
		row.classList.add('mycard')
		row.classList.add('row')
		row.classList.add('align-items-center')

		let itemBox1 = document.createElement('div')
		itemBox1.classList.add('col')

		itemBox1.appendChild(nameItemBox)
		itemBox1.appendChild(descItemBox)
		itemBox1.appendChild(quantityItemBox)
		itemBox1.appendChild(priceItemBox)

		let itemBox2 = document.createElement('div')
		itemBox2.classList.add('col')
		itemBox2.append(imgItemBox)

		let itemBox3 = document.createElement('div')
		itemBox3.classList.add('col')

		let addToCartBtn = document.createElement('button')
		addToCartBtn.innerHTML = "+"
		addToCartBtn.classList.add('addtocart')

		itemBox3.appendChild(addToCartBtn)

		row.appendChild(itemBox2)
		row.appendChild(itemBox1)
		row.append(itemBox3)


		container.appendChild(row)
		addToCartBtn.addEventListener('click', () => this.addToCart(product))
	}

	createItemBox(item){
		let itemBox = document.createElement('div')
		itemBox.classList.add('form-group')

		let input = document.createElement('input')
		input.value = item
		input.disabled = true
		input.classList.add('control')
		input.type = 'text'

		itemBox.appendChild(input)

		return itemBox
	}	

	async addToCart(product){
		const quantity = parseInt(prompt("Enter Quantity of product: "))
		if(quantity <= product.quantity){
			product.quantity = quantity
			const resp = await fetch('/api/add-to-cart', {
				method: 'POST',
				body: JSON.stringify(product),
				headers: {
					'Content-Type': 'application/json'
				}
			})

			const data = await resp.json()
			showStatus(data.status, data.message)
			location.reload()
		}else{
			if(!isNaN(quantity))
				alert("Cannot add to cart. Quantity beyond range")
		}
	}
}


async function boot() {
	const response = await fetch('/api/get-products')
	const records = await response.json()
	if(response.status != 404){
		records.forEach(( record ) => {
			new Product(record)
		})
	}else{
		showStatus(records.status, records.message)
	}
}

boot()

function showStatus(status, message){
	let spanMessage = document.createElement('span')
	spanMessage.classList.add('alert')
	spanMessage.innerHTML = message

	if(status){
		spanMessage.classList.add('alert-success')
	}else{
		spanMessage.classList.add('alert-danger')
	}

	statusSpan.appendChild(spanMessage)

	setTimeout(() => {
		spanMessage.classList.length = 0
		spanMessage.innerHTML = ""
		statusSpan.remove(spanMessage)
	}, 3000)
}