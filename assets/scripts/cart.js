const container = document.querySelector('.mycontainer')
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
        
        this.createEditRemoveBtns(itemBox3, product)    //  send main container and product for editEvent

		row.appendChild(itemBox2)
		row.appendChild(itemBox1)
		row.append(itemBox3)


		container.appendChild(row)
	}

    createEditRemoveBtns(mainContainer, product){

        //  create edit column
        let editRow = document.createElement('div')
        editRow.classList.add('row')

        let editColumn = document.createElement('div')
        editColumn.classList.add('col-md')

        //  create edit button
        let editBtn = document.createElement('button')
        editBtn.innerHTML = "EDIT"
        editBtn.classList.add('btn')
        editBtn.classList.add('btn-primary')
        editBtn.classList.add('btn-lg')
        
        editBtn.addEventListener('click', () => onEdit(product))

        editColumn.appendChild(editBtn)
        editRow.appendChild(editColumn)

        //  add both buttons to final container
        mainContainer.appendChild(editRow)
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
}

async function onEdit(product) {
	const newQuant = parseInt(prompt("Enter number of quantity: ", product.quantity))
	const resp = await fetch('/api/update-quantity', {
								method: 'POST',
								body: JSON.stringify({
									productName: product.name,
									oldQuant: product.quantity, 
									newQuant: newQuant}),
								headers: {
									'Content-Type': 'application/json'
								}
							})
	
	const data = await resp.json()
	showStatus(data.status, data.message)
	location.reload()
}


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

async function boot() {
	const records = await fetch('/api/get-cart-products').then((t) => t.json())
    if(records.length > 0 ){
        records.forEach(( record ) => {
            new Product(record)
        })
    }else{
        let noCartItem = document.createElement("h1")
        noCartItem.innerHTML = "No item added in Cart"
        container.appendChild(noCartItem)
    }
}

boot()