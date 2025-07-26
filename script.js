document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURATION ---
    const StoreWalletAddress = "ST3HMW7MD2GYDBPZWBGJSNREGZW0EAM00KVJ9PT2T";

    // --- PRODUCT DATA ---
    const products = [
        { id: 1, name: 'Classic White Tee', price: 29.99, image: 'images/pic-1.jpg' },
        { id: 2, name: 'Denim Jeans', price: 79.99, image: 'images/pic-2.jpg' },
        { id: 3, name: 'Leather Jacket', price: 199.99, image: 'images/pic-3.jpg' },
        { id: 4, name: 'Stylish Sneakers', price: 89.99, image: 'images/pic-4.jpg' },
        { id: 5, name: 'Stylish Sunglasses', price: 49.99, image: 'images/pic-5.jpg' },
        { id: 6, name: 'Beige Chinos', price: 64.99, image: 'images/pic-6.jpg' },
        { id: 7, name: 'Cozy Hoodie', price: 59.99, image: 'images/pic-7.jpg' },
        { id: 8, name: 'Canvas Backpack', price: 39.99, image: 'images/pic-8.jpg' }
    ];

    // --- STATE ---
    let cart = [];
    let userWalletAddress = null; // To store the user's verified address
    let pendingPayment = null; // To store details of the payment we're waiting for

    // --- DOM SELECTORS ---
    const productList = document.getElementById('product-list');
    const cartButton = document.getElementById('cart-button');
    const cartModal = document.getElementById('cart-modal');
    const closeModalButton = document.getElementById('close-modal-button');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const connectWalletBtn = document.getElementById('connect-wallet-btn');
    const alertModal = document.getElementById('alert-modal');
    const alertMessage = document.getElementById('alert-message');
    const closeAlertBtn = document.getElementById('close-alert-btn');
    const walletModal = document.getElementById('wallet-modal');
    const walletForm = document.getElementById('wallet-form');
    const walletAddressInput = document.getElementById('wallet-address-input');
    const cancelConnectBtn = document.getElementById('cancel-connect-btn');
    const paymentModal = document.getElementById('payment-modal');
    const paymentAddress = document.getElementById('payment-address');
    const paymentAmount = document.getElementById('payment-amount');
    const paymentMemo = document.getElementById('payment-memo');
    const verifyPaymentBtn = document.getElementById('verify-payment-btn');
    const cancelPaymentBtn = document.getElementById('cancel-payment-btn');

    // --- FUNCTIONS ---

    function renderProducts() {
        productList.innerHTML = products.map(p => `
            <div class="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                <img src="${p.image}" alt="${p.name}" class="w-full h-64 object-cover" onerror="this.src='https://placehold.co/400x400/ccc/fff?text=Img+Error'">
                <div class="p-6"><h3 class="text-xl font-semibold text-gray-800 mb-2">${p.name}</h3>
                    <div class="text-gray-600 mb-4 flex items-center">
                        <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/4847.png" alt="STX" class="h-4 w-4 mr-1.5">
                        <span>${p.price.toFixed(2)} coin</span>
                    </div>
                    <button data-id="${p.id}" class="add-to-cart-btn w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition">Add to Cart</button>
                </div>
            </div>`).join('');
    }

    function renderCart() {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartTotal.textContent = `${total.toFixed(2)} coin`;
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-gray-500">Your cart is empty.</p>';
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="flex justify-between items-center py-3 border-b">
                    <div class="flex items-center space-x-4">
                        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-lg object-cover">
                        <div>
                            <p class="font-semibold text-gray-800">${item.name}</p>
                            <div class="flex items-center text-sm text-gray-500 mt-1">
                                <button data-id="${item.id}" class="quantity-decrease bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center font-bold">-</button>
                                <span class="mx-2 w-4 text-center">${item.quantity}</span>
                                <button data-id="${item.id}" class="quantity-increase bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center font-bold">+</button>
                            </div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="font-semibold text-gray-800">${(item.price * item.quantity).toFixed(2)} coin</div>
                        <button data-id="${item.id}" class="remove-from-cart-btn text-red-500 hover:text-red-700 text-xs mt-1 font-semibold">Remove</button>
                    </div>
                </div>`).join('');
        }
    }
    
    function handleCartActions(e) {
        const target = e.target;
        if (!target.dataset.id) return;
        const productId = parseInt(target.dataset.id);
        const item = cart.find(i => i.id === productId);

        if (target.classList.contains('quantity-increase')) {
            if (item) item.quantity++;
        }
        if (target.classList.contains('quantity-decrease')) {
            if (item && item.quantity > 1) item.quantity--;
            else if (item && item.quantity === 1) cart = cart.filter(i => i.id !== productId);
        }
        if (target.classList.contains('remove-from-cart-btn')) {
            cart = cart.filter(i => i.id !== productId);
        }
        renderCart();
    }

    function handleAddToCart(productId) {
        const product = products.find(p => p.id === productId);
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) existingItem.quantity++;
        else cart.push({ ...product, quantity: 1 });
        showAlert(`${product.name} added to cart!`, 'success');
        renderCart();
    }

    function updateUserUI() {
        if (userWalletAddress) {
            const truncated = `${userWalletAddress.substring(0, 4)}...${userWalletAddress.substring(userWalletAddress.length - 4)}`;
            connectWalletBtn.innerHTML = `<i data-feather="check-circle" class="w-4 h-4"></i><span>${truncated}</span>`;
            connectWalletBtn.classList.replace('bg-blue-500', 'bg-green-500');
        } else {
            connectWalletBtn.innerHTML = `<i data-feather="link" class="w-4 h-4"></i><span>Connect Wallet</span>`;
            connectWalletBtn.classList.replace('bg-green-500', 'bg-blue-500');
        }
        feather.replace();
    }

    function handleConnectWallet(e) {
        e.preventDefault();
        const address = walletAddressInput.value.trim();
        if ((address.startsWith('ST') || address.startsWith('SP')) && address.length > 30) {
            userWalletAddress = address;
            walletModal.classList.add('hidden');
            showAlert('Wallet connected successfully!', 'success');
            updateUserUI();
        } else {
            showAlert('Invalid Stacks address. Please try again.', 'error');
        }
    }

    function handleCheckout() {
        if (!userWalletAddress) {
            showAlert('Please connect your wallet first to proceed.', 'error');
            return;
        }
        if (cart.length === 0) {
            showAlert('Your cart is empty.', 'error');
            return;
        }
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const memo = `CLARIFY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        
        pendingPayment = { amount: total, memo: memo };
        
        paymentAddress.textContent = StoreWalletAddress;
        paymentAmount.textContent = total.toFixed(6);
        paymentMemo.textContent = memo;

        cartModal.classList.add('hidden');
        paymentModal.classList.remove('hidden');
    }

    async function handleVerifyPayment() {
        if (!pendingPayment) return;
        verifyPaymentBtn.disabled = true;
        verifyPaymentBtn.textContent = 'Verifying...';

        try {
            const response = await fetch(`https://api.hiro.so/extended/v1/address/${ST3HMW7MD2GYDBPZWBGJSNREGZW0EAM00KVJ9PT2T}/mempool`);
            const data = await response.json();
            let transactionFound = false;

            for (const tx of data.results) {
                if (tx.tx_type === 'token_transfer') {
                    const txMemo = hexToString(tx.token_transfer.memo);
                    const txAmount = parseInt(tx.token_transfer.amount) / 1000000;
                    if (txMemo === pendingPayment.memo && txAmount >= pendingPayment.amount) {
                        transactionFound = true;
                        break;
                    }
                }
            }

            if (transactionFound) {
                showAlert('Payment verified! Thank you.', 'success');
                paymentModal.classList.add('hidden');
                cart = [];
                renderCart();
                pendingPayment = null;
            } else {
                showAlert('Payment not found yet. Please wait a minute and try again.', 'error');
            }
        } catch (error) {
            console.error("Verification failed:", error);
            showAlert('Could not verify transaction. Please try again.', 'error');
        } finally {
            verifyPaymentBtn.disabled = false;
            verifyPaymentBtn.textContent = 'I Have Sent The Payment';
        }
    }
    
    function hexToString(hex) {
        let str = '';
        for (let i = 0; i < hex.length; i += 2) {
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return str.replace(/\0/g, '');
    }

    function showAlert(message, type = 'success') {
        alertMessage.textContent = message;
        alertModal.classList.remove('hidden', 'translate-x-full');
        // This is the corrected line for the pop-up color.
        alertModal.classList.add(type === 'success' ? 'bg-green-500' : 'bg-red-500');
        setTimeout(() => alertModal.classList.add('translate-x-full'), 4000);
    }

    // --- EVENT LISTENERS ---
    connectWalletBtn.addEventListener('click', () => {
        if (userWalletAddress) {
            userWalletAddress = null;
            showAlert('Wallet disconnected.', 'success');
            updateUserUI();
        } else {
            walletModal.classList.remove('hidden');
        }
    });

    productList.addEventListener('click', (e) => {
        const button = e.target.closest('.add-to-cart-btn');
        if (button) handleAddToCart(parseInt(button.dataset.id));
    });
    
    cartItemsContainer.addEventListener('click', handleCartActions);
    cartButton.addEventListener('click', () => cartModal.classList.remove('hidden'));
    closeModalButton.addEventListener('click', () => cartModal.classList.add('hidden'));
    checkoutBtn.addEventListener('click', handleCheckout);
    walletForm.addEventListener('submit', handleConnectWallet);
    cancelConnectBtn.addEventListener('click', () => walletModal.classList.add('hidden'));
    verifyPaymentBtn.addEventListener('click', handleVerifyPayment);
    cancelPaymentBtn.addEventListener('click', () => {
        paymentModal.classList.add('hidden');
        pendingPayment = null;
    });
    closeAlertBtn.addEventListener('click', () => alertModal.classList.add('translate-x-full'));

    // --- INITIALIZATION ---
    renderProducts();
    renderCart();
    feather.replace();
});
