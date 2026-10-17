export function getCart() {
    const cartString = localStorage.getItem("cart");

    if (cartString == null) {
        localStorage.setItem("cart", "[]");
        return [];
    }

    try {
        return JSON.parse(cartString);
    } catch {
        localStorage.setItem("cart", "[]");
        return [];
    }
}

export function addToCart(product, quantity = 1) {
    const cart = getCart();

    // check if the product is already in the cart
    const index = cart.findIndex((item) => {
        return item.productID == product.productID;
    });

    if (index == -1) {
        cart.push({
            productID: product.productID,
            name: product.name,
            price: product.price,
            labelledPrice: product.labelledPrice,
            quantity: quantity,
            image: product.images?.[0],
        });
    } else {
        const newQty = cart[index].quantity + quantity;

        if (newQty <= 0) {
            cart.splice(index, 1);
        } else {
            cart[index].quantity = newQty;
        }
    }

    localStorage.setItem("cart", JSON.stringify(cart));
}

export function emptyCart() {
    localStorage.setItem("cart", "[]");
}