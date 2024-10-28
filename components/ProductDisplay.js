const productDisplay = {
    template:
        /*html*/
        `
    <div class="product-display">
            <div class="product-container">
                <div class="product-image">
                    <img :src="getImage" :class="{ 'gray-image':!isInchange }">
                </div>
            </div>
            <div class="product-info">
                <h1>{{computedTitle}}</h1>
                <p v-if="isOnSale" class="sale">On Sale</p>
                <p v-else class="not-sale">Not on Sale</p>
                <p v-if="inventoryLevel === 3" class="sale">In Stock</p>
                <p v-else-if="inventoryLevel === 2" class="almost_out-sale">Almost out of Stock</p>
                <p v-else-if="inventoryLevel === 1" class="out-sale">Out of Stock</p>
                <p v-else-if="inventoryLevel === 0" class="none-sale">Pleace  click "Update Stock Status" to showing states</p>
                <p>Shipping: {{shippingCost}} $</p>
                <product-details :details="productDetails"></product-details>
                <div class="sizes">
                    <h3>Size: {{ currentSize }}</h3>
                </div>
                <div v-for="(variant, index) in variantList" :key="variant.id" @mouseover="updateSelectedVariant(index)"
                    class="color-circle" :style="{backgroundColor: variant.color}">
                </div>
                <button class="button" :disabled='!isInStock' @click="addItemToCart" :class="{disabledButton:!isInStock}">Add To
                    Cart</button>
                <button class="button" v-if="cartQuantity >= 0" @click="removeItemFromCart">Remove from Cart</button>
                <button class="button" @click="toggleInventoryStatus">Update Stock Status</button>
            </div>
            <review-list v-if="reviewList.length" :reviews="reviewList"></review-list>
            <review-form @review-submitted="addNewReview"></review-form>
        </div>
    `,
    props: {
        premium: Boolean
    },
    setup(props, { emit }) {
        const shippingCost = computed(() => {
            return props.premium? 'Free' : 666;
        });
        const productName = ref('Boots');
        const brandName = ref('SE 331');
        const isOnSale = ref(true);
        const inventoryLevel = ref(0);
        const reviewList = ref([]);
        const productDetails = ref([
            '50% cotton',
            '30% wool',
            '20% polyester'
        ]);
        const variantList = ref([
            { id: 2234, color: 'green', image: './assets/images/socks_green.jpg', quantity: 50, sizes:'S'},
            { id: 2235, color: 'blue', image: './assets/images/socks_blue.jpg', quantity: 0, sizes:'L'},
        ]);
        const selectedVariant = ref(0);
        const cart = ref(0);

        function updateSelectedVariant(index) {
            selectedVariant.value = index;
        }

        const getImage = computed(() => {
            return variantList.value[selectedVariant.value].image;
        });
        const isInStock = computed(() => {
            return variantList.value[selectedVariant.value].quantity;
        });
        const isInchange = computed(() => {
            return variantList.value[selectedVariant.value].quantity > 0;
        });
        const currentSize = computed(() => {
            return variantList.value[selectedVariant.value].sizes;
        });
        const cartQuantity = computed(() => {
            const variantId = variantList.value[selectedVariant.value]?.id;
            return variantId && props.cart? (props.cart[variantId] || 0) : 0;
        });

        function addItemToCart() {
            const variantId = variantList.value[selectedVariant.value].id;
            emit('add-to-cart', variantId);
        }

        function removeItemFromCart() {
            const variantId = variantList.value[selectedVariant.value].id;
            emit('remove-from-cart', variantId);
        }

        const computedTitle = computed(() => {
            return brandName.value + ' ' + productName.value + ' ' + 'is on sale';
        });


        function toggleInventoryStatus() {
            const currentVariant = variantList.value[selectedVariant.value];
            if (currentVariant.quantity > 10) {
                inventoryLevel.value = 3;
            } else if (currentVariant.quantity <= 10 && currentVariant.quantity > 0) {
                inventoryLevel.value = 2;
            } else {
                inventoryLevel.value = 1;
            }
        }


        function addNewReview(review) {
            reviewList.value.push(review);
        }


        return {
            computedTitle,
            getImage,
            isOnSale,
            inventoryLevel,
            isInStock,
            isInchange,
            currentSize,
            reviewList,
            productDetails,
            variantList,
            cartQuantity,
            addItemToCart,
            updateSelectedVariant,
            addNewReview,
            removeItemFromCart,
            toggleInventoryStatus,
            shippingCost
        };
    }
};
