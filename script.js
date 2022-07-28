//Chamar a função dentro do map
/*pizzaJson.map(chamar);
function chamar(item, index){
	console.log(item);
}*/
//Funções auxiliares com códigos menores (atalhos Ajudadores)
const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);
let modalQt = 1;
let cart = [];
let modalKey = 0;

//Mapeie a esrutura com map e arrow function Listando as pizzas
pizzaJson.map((item, index)=>{
	//Clone um elemento no html
	let pizzaItem = c('.models .pizza-item').cloneNode(true);
	//Insira um atributo associado ao index de cada item
	pizzaItem.setAttribute("data-key", index);
	//Crie uma variavel para a quantidade de pizzas no modal
	modalQt = 1;

	//Preencha as informações na tela
	pizzaItem.querySelector('.pizza-item--img img').src = item.img;
	pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
	pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
	pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

	//Abra o modal adicionando uma escuta ao clique na pizza
	pizzaItem.querySelector('a').addEventListener('click', (e)=>{
		//Previna a ação padrão
		e.preventDefault();
		/*Do elemento selecionado(target), procure a pizza-item mais proxima e 
		pegue o atributo criado acima*/
		let key = e.target.closest(".pizza-item").getAttribute("data-key");
		//Sete a quantia de pizzas no modal cada vez que o usuario abre
		modalQt = 1;
		//Variavel que armazena qual a pizza que será adicionada no carrinho
		modalKey = key;

		//Preencha as informações no modal
		c('.pizzaBig img').src = pizzaJson[key].img;
		c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
		c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
		c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;

		//Procure uma classe que tambem seja selected e remova
		c('.pizzaInfo--size.selected').classList.remove('selected');

		//Liste todos os tamanhos de pizza do Json e preencha-os
		cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
			//Quando sizeIndex for 2 adicione a classe selected
			if(sizeIndex == 2){
				size.classList.add('selected');
			}
			size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
		})

		//Assuma o valor setado para quantia de pizzas
		c('.pizzaInfo--qt').innerHTML = modalQt;

		//Crie animação para abertura do Modal
		c('.pizzaWindowArea').style.opacity = 0;
		c('.pizzaWindowArea').style.display = "flex";
		setTimeout(()=>{
			c('.pizzaWindowArea').style.opacity = 1;
		})

	})


	//Exiba(cole) o elemento clonado na tela
	c('.pizza-area').append(pizzaItem);

})

//Eventos do Modal

//Evento de fechamento do modal
function closeModal(){
	c('.pizzaWindowArea').style.opacity = 0;
	setTimeout(()=>{
		c('.pizzaWindowArea').style.display = 'none';
	}, 500);
}

/*Encontre as classes abaixo, adicione uma escuta de clique em cada item juntamente
com a função de fechar*/
cs('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((item)=>{
	item.addEventListener('click', closeModal);
});

//Adicione uma escuta de clique aos botoes + e -
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
	//Não pode ser menor que 1
	if(modalQt > 1){
		modalQt--;
		c('.pizzaInfo--qt').innerHTML = modalQt;
	}
});
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
	modalQt++;
	c('.pizzaInfo--qt').innerHTML = modalQt;

});

//Troque a seleção dos tamanhos de pizza
cs('.pizzaInfo--size').forEach((size)=>{
	//Adicione uma escuta de clique para a classe selected 
	size.addEventListener('click', ()=>{
		//Remova o selected de quem estiver com essa classe
		c('.pizzaInfo--size.selected').classList.remove('selected');
		//Adicione a clsse selected ao clicado
		size.classList.add('selected');
	})
})

//Reuna as informações e coloque no carrinho
c('.pizzaInfo--addButton').addEventListener('click',()=>{
	//Qual Pizza, qual o tamanho e quantas pizzas serão
	//console.log(`Pizza: ${modalKey}`);
	//console.log(`Qtd: ${modalQt}`);

	//Pegue o tamanho da pizza
	let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

	//Identificador recebe o id do item junto com o tamanho
	let indentifier = pizzaJson[modalKey].id+'@'+size;

	//O key procura e compara se no item o identificador é o mesmo, caso não retorna -1
	let key = cart.findIndex((item)=>{
		return item.indentifier == indentifier;
	})

	//Se for maior que -1, achou e atualiza a nova quantia
	if(key > -1){
		cart[key].qt += modalQt;
	}
	//Caso não, adiciona ao carrinho
	else{
		//Adicione ao array cart
		cart.push({
			indentifier,
			id:pizzaJson[modalKey].id,
			size:size,
			qt:modalQt
		})
	}

	//Atualize o carrinho
	updateCart();
	//Feche o modal
	closeModal();
});

//Adicione uma escuta de clique paa caso tenha item no cart, mostre 
c('.menu-openner').addEventListener('click', ()=>{
	if(cart.length > 0){
		c('aside').style.left = "0";
	}	
})

//Adicione uma escuta de clique no X para jogar a margem em 100%
//do tamanho da tela
c('.menu-closer').addEventListener('click', ()=>{
	c('aside').style.left = "100vw";	
})

//Funcão que atualiza o carrinho
function updateCart(){
	c('.menu-openner span').innerHTML = cart.length;

	if(cart.length > 0){
		//Mostre o cart
		c("aside").classList.add("show");
		//Zere o html do cart
		c('.cart').innerHTML = '';

		//Variaveis de calculo
		let subtotal = 0;
		let desconto = 0;
		let total = 0;

		//Percorra o array do cart
		for(let i in cart){

			//Procure o item na listagem
			let pizzaItem = pizzaJson.find((item)=>{
				return item.id == cart[i].id;
			})
			//Some o subtotal vezes a quantia do item em questão
			subtotal += pizzaItem.price * cart[i].qt;

			//Clone a estrutura do carrinho do HTML
			let cartItem = c('.models .cart--item').cloneNode(true);
			//Troque a posição do tamanho pelas letras
			let pizzaSizeName;
			switch(cart[i].size){
				case 0:
					pizzaSizeName = "P";
					break;
				case 1:
					pizzaSizeName = "M";
					break;
				case 2:
					pizzaSizeName = "G"
					break;
			}

			//Forme o nome da pizza para o carrinho
			let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
			//Preencha a imagem no carrinho
			cartItem.querySelector('img').src = pizzaItem.img;
			//Preencha o nome formado acima
			cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
			//Preencha a quantia no carrinho
			cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;


			//Botões de controle de quantia
			cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
				//Se quantia for maior que 1, faça
				if(cart[i].qt > 1){
					cart[i].qt--;
				}
				//Se menor, retire o item em questão
				else{
					cart.splice(i, 1);
				}
				//Atualize o carrinho
				updateCart();
			})
			cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
				//Aumente a quantia
				cart[i].qt++;
				//Atualize o carrinho
				updateCart();
			})




			c('.cart').append(cartItem);
		}

		//Calculo do desconto de 10%
		desconto = subtotal * 0.1;
		total = subtotal - desconto;

		//Substitua os valores pelas variaveis acima
		c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
		c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
		c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;


	} else{
		//Remove a classe que mostra o carrinho
		c("aside").classList.remove("show");
		//Coloca uma margem em 100% da tela para esconder
		//o carrinho no mobile
		c('aside').style.left = "100vw";
	}
}