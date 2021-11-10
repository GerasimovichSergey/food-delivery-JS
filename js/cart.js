const cart = () => {
    const buttonCart = document.querySelector('#cart-button');
    const modalCart = document.querySelector('.modal-cart');
    const modalBody = document.querySelector('.modal-body');
    const modalPrice = modalCart.querySelector('.modal-pricetag');
    const close = modalCart.querySelector('.close');
    const body = modalCart.querySelector('.modal-body');
    const buttonSend = modalCart.querySelector('.button-primary');
    const buttonClearCart = document.querySelector('.clear-cart');

    const toggleModal = () => {
        modalCart.classList.toggle('is-open');
    };

    const resetCart = () => {
        modalBody.innerHTML = '';
        localStorage.removeItem('cart');
        toggleModal();
    };

    const incrementCount = (id) => {
        const cartArray = JSON.parse(localStorage.getItem('cart'));

        cartArray.map((item) => {
            if (item.id === id) {
                item.count++;
            }

            return item;
        });

        localStorage.setItem('cart', JSON.stringify(cartArray));
        renderItems(cartArray);
    };

    const decrementCount = id => {
        const cartArray = JSON.parse(localStorage.getItem('cart'));

        cartArray.map(item => {
            if (item.id === id) {
                item.count = item.count > 0 ? item.count - 1 : 0;
            }
            return item;
        });

        const cartArrayFiltered = cartArray.filter(elem => elem.count !== 0);

        if (cartArrayFiltered.length) {
            localStorage.setItem('cart', JSON.stringify(cartArrayFiltered));
            renderItems(cartArrayFiltered);
        } else {
            resetCart();
        }
    };

    const renderItems = (data) => {
        body.innerHTML = '';

        data.forEach(({name, price, id, count}) => {
            const div = document.createElement('div');

            div.classList.add('food-row');
            div.innerHTML = `
                <span class="food-name">${name}</span>
                <strong class="food-price">${price} ₽</strong>
                <div class="food-counter">
                    <button class="counter-button btn-dec" data-index="${id}">-</button>
                    <span class="counter">${count}</span>
                    <button class="counter-button btn-inc" data-index="${id}">+</button>
                </div>
            `;

            body.append(div);
        });

        const totalPrice = data.reduce((res, item) => res + (parseFloat(item.price) * item.count), 0);
        modalPrice.innerHTML = totalPrice + ' &#8381;';
    };

    body.addEventListener('click', (event) => {
        event.preventDefault();

        if (event.target.classList.contains('btn-inc')) {
            incrementCount(event.target.dataset.index);
        } else if (event.target.classList.contains('btn-dec')) {
            decrementCount(event.target.dataset.index);
        }
    });

    buttonSend.addEventListener('click', () => {
        const cartArray = localStorage.getItem('cart');

        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: cartArray,
        })
            .then(response => {
                if (response.ok) {
                    resetCart();
                }
            })
            .catch(error => {
                console.error(error);
            });
    });

    buttonCart.addEventListener('click', () => {
        if (localStorage.getItem('cart')) {
            renderItems(JSON.parse(localStorage.getItem('cart')))
        }

        modalCart.classList.add('is-open');
    });

    close.addEventListener('click', () => {
        modalCart.classList.remove('is-open');
    });

    buttonClearCart.addEventListener('click', resetCart);
};

cart();