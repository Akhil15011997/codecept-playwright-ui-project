const { I } = inject();
const config = require("../configs/environmentFile");

class CartPage {
  constructor () {
    // Locators
    this.locators = {
      // Product page locators
      productCard: '.product-card',
      productLink: 'a.product-card__link',
      addToCartButton: 'button[name="add"]',
      addToCartButtonAlt: 'button:has-text("Add to cart")',
      productTitle: '.product__title',
      productPrice: '.product__price',

      // Cart locators
      cartIcon: 'a[href="/cart"]',
      cartIconAlt: '.cart-icon',
      cartDrawer: '.cart-drawer',
      cartPage: '.cart',
      cartItem: '.cart-item',
      cartItemTitle: '.cart-item__title',
      cartItemQuantity: '.cart-item__quantity input',
      cartItemRemove: '.cart-item__remove',
      cartItemPrice: '.cart-item__price',
      cartCount: '.cart-count',
      cartTotal: '.cart__total',
      cartSubtotal: '.cart__subtotal',
      emptyCartMessage: '.cart--empty',

      // Quantity controls
      quantityInput: 'input[name="quantity"]',
      quantityIncrease: '.quantity__button--plus',
      quantityDecrease: '.quantity__button--minus',
      updateQuantityButton: 'button[name="update"]',

      // Checkout locators
      checkoutButton: 'button[name="checkout"]',
      checkoutButtonAlt: 'button:has-text("Checkout")',
      continueShoppingButton: 'a:has-text("Continue shopping")',

      // Checkout form locators
      emailField: '#email',
      firstNameField: '#firstName',
      lastNameField: '#lastName',
      addressField: '#address1',
      cityField: '#city',
      countrySelect: '#country',
      provinceSelect: '#province',
      postalCodeField: '#postalCode',
      phoneField: '#phone',

      // Payment locators
      paymentFrame: 'iframe[name*="payment"]',
      cardNumberField: '#cardNumber',
      cardExpiryField: '#cardExpiry',
      cardCvvField: '#cardCvv',
      cardNameField: '#cardName',

      // Order confirmation
      orderConfirmation: '.order-confirmation',
      orderNumber: '.order-number',
      thankYouMessage: 'h1:has-text("Thank you")',
      orderSummary: '.order-summary',
    };

    // URLs
    this.urls = {
      homepage: config.pageURLs.SHOPIFY_DEMO_URL,
      cart: config.pageURLs.SHOPIFY_DEMO_URL + 'cart',
      checkout: config.pageURLs.SHOPIFY_DEMO_URL + 'checkout',
    };

    // Test data
    this.testData = {
      quantity: 1,
      lastProductAdded: null,
    };
  }

  /**
   * Navigate to the cart page
   */
  async goToCart () {
    await I.amOnPage(this.urls.cart);
    await I.waitForElement('body', 10);
  }

  /**
   * Navigate to a product page (first available product)
   */
  async navigateToProductPage () {
    await I.amOnPage(this.urls.homepage);
    await I.waitForElement('body', 5);

    // Try to find and click on a product
    try {
      await I.waitForElement(this.locators.productLink, 10);
      await I.click(this.locators.productLink);
      await I.waitForElement(this.locators.addToCartButton, 10);
    } catch {
      // If no product cards, navigate to collections or products page
      await I.amOnPage(this.urls.homepage + 'collections/all');
      await I.waitForElement(this.locators.productLink, 10);
      await I.click(this.locators.productLink);
      await I.waitForElement(this.locators.addToCartButton, 10);
    }
  }

  /**
   * Add product to cart from product page
   */
  async addProductToCart () {
    try {
      await I.waitForElement(this.locators.addToCartButton, 5);
      await I.click(this.locators.addToCartButton);
    } catch {
      await I.waitForElement(this.locators.addToCartButtonAlt, 5);
      await I.click(this.locators.addToCartButtonAlt);
    }
    await I.wait(2); // Wait for cart to update
  }

  /**
   * View the cart (click on cart icon or go to cart page)
   */
  async viewCart () {
    try {
      await I.waitForElement(this.locators.cartIcon, 5);
      await I.click(this.locators.cartIcon);
    } catch {
      await this.goToCart();
    }
    await I.wait(2);
  }

  /**
   * Verify cart has specific number of items
   * @param {number} itemCount - Expected number of items
   */
  async verifyCartItemCount (itemCount) {
    await I.waitForElement(this.locators.cartItem, 10);
    const count = await I.grabNumberOfVisibleElements(this.locators.cartItem);
    if (count !== itemCount) {
      throw new Error(`Expected ${itemCount} items in cart, but found ${count}`);
    }
  }

  /**
   * Verify product is displayed in cart
   */
  async verifyProductInCart () {
    await I.waitForElement(this.locators.cartItem, 10);
    await I.seeElement(this.locators.cartItemTitle);
  }

  /**
   * Continue shopping from cart
   */
  async continueShopping () {
    await I.waitForElement(this.locators.continueShoppingButton, 5);
    await I.click(this.locators.continueShoppingButton);
    await I.wait(2);
  }

  /**
   * Navigate to another product page
   */
  async navigateToAnotherProductPage () {
    await this.navigateToProductPage();
  }

  /**
   * Update quantity of item in cart
   * @param {number} quantity - New quantity
   */
  async updateQuantity (quantity) {
    await I.waitForElement(this.locators.quantityInput, 5);
    await I.clearField(this.locators.quantityInput);
    await I.fillField(this.locators.quantityInput, quantity.toString());

    // Try to click update button if it exists
    try {
      await I.click(this.locators.updateQuantityButton);
    } catch {
      // Some carts auto-update without button
      await I.wait(2);
    }
    await I.wait(2); // Wait for cart to recalculate
  }

  /**
   * Verify cart quantity
   * @param {number} expectedQuantity - Expected quantity
   */
  async verifyCartQuantity (expectedQuantity) {
    await I.waitForElement(this.locators.quantityInput, 5);
    const quantity = await I.grabValueFrom(this.locators.quantityInput);
    if (parseInt(quantity) !== expectedQuantity) {
      throw new Error(`Expected quantity ${expectedQuantity}, but found ${quantity}`);
    }
  }

  /**
   * Verify cart total is updated
   */
  async verifyCartTotalUpdated () {
    await I.waitForElement(this.locators.cartTotal, 5);
    await I.seeElement(this.locators.cartTotal);
  }

  /**
   * Remove product from cart
   */
  async removeProductFromCart () {
    await I.waitForElement(this.locators.cartItemRemove, 5);
    await I.click(this.locators.cartItemRemove);
    await I.wait(2); // Wait for removal animation
  }

  /**
   * Verify cart is empty
   */
  async verifyCartEmpty () {
    try {
      await I.waitForElement(this.locators.emptyCartMessage, 5);
      await I.see('empty', this.locators.emptyCartMessage);
    } catch {
      // Alternative: check that no cart items exist
      const itemCount = await I.grabNumberOfVisibleElements(this.locators.cartItem);
      if (itemCount > 0) {
        throw new Error('Expected cart to be empty but found items');
      }
    }
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout () {
    try {
      await I.waitForElement(this.locators.checkoutButton, 5);
      await I.click(this.locators.checkoutButton);
    } catch {
      await I.waitForElement(this.locators.checkoutButtonAlt, 5);
      await I.click(this.locators.checkoutButtonAlt);
    }
    await I.wait(3); // Wait for checkout page load
  }

  /**
   * Verify user is on checkout page
   */
  async verifyCheckoutPage () {
    await I.waitInUrl('/checkout', 10);
    await I.seeInCurrentUrl('checkout');
  }

  /**
   * Verify checkout form is displayed
   */
  async verifyCheckoutForm () {
    await I.waitForElement(this.locators.emailField, 10);
    await I.seeElement(this.locators.emailField);
  }

  /**
   * Enter shipping information
   * @param {Object} shippingInfo - Shipping details
   */
  async enterShippingInformation (shippingInfo = {}) {
    const defaultInfo = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Test Street',
      city: 'Test City',
      postalCode: '12345',
      phone: '1234567890',
    };

    const info = { ...defaultInfo, ...shippingInfo };

    await I.waitForElement(this.locators.emailField, 5);
    await I.fillField(this.locators.emailField, info.email);
    await I.fillField(this.locators.firstNameField, info.firstName);
    await I.fillField(this.locators.lastNameField, info.lastName);
    await I.fillField(this.locators.addressField, info.address);
    await I.fillField(this.locators.cityField, info.city);
    await I.fillField(this.locators.postalCodeField, info.postalCode);
    await I.fillField(this.locators.phoneField, info.phone);
  }

  /**
   * Enter payment information
   * @param {Object} paymentInfo - Payment details
   */
  async enterPaymentInformation (paymentInfo = {}) {
    const defaultInfo = {
      cardNumber: '4242424242424242',
      expiry: '12/25',
      cvv: '123',
      name: 'John Doe',
    };

    const info = { ...defaultInfo, ...paymentInfo };

    // Switch to payment iframe if exists
    try {
      await I.switchTo(this.locators.paymentFrame);
      await I.fillField(this.locators.cardNumberField, info.cardNumber);
      await I.fillField(this.locators.cardExpiryField, info.expiry);
      await I.fillField(this.locators.cardCvvField, info.cvv);
      await I.fillField(this.locators.cardNameField, info.name);
      await I.switchTo(); // Switch back to main frame
    } catch {
      // If not in iframe, fill directly
      await I.fillField(this.locators.cardNumberField, info.cardNumber);
      await I.fillField(this.locators.cardExpiryField, info.expiry);
      await I.fillField(this.locators.cardCvvField, info.cvv);
      await I.fillField(this.locators.cardNameField, info.name);
    }
  }

  /**
   * Complete the order
   */
  async completeOrder () {
    const completeOrderButton = 'button:has-text("Complete order")';
    await I.waitForElement(completeOrderButton, 5);
    await I.click(completeOrderButton);
    await I.wait(5); // Wait for order processing
  }

  /**
   * Verify order confirmation
   */
  async verifyOrderConfirmation () {
    await I.waitForElement(this.locators.thankYouMessage, 15);
    await I.see('Thank you');
  }

  /**
   * Get order number from confirmation page
   */
  async getOrderNumber () {
    await I.waitForElement(this.locators.orderNumber, 10);
    return await I.grabTextFrom(this.locators.orderNumber);
  }

  /**
   * Verify checkout button is disabled
   */
  async verifyCheckoutButtonDisabled () {
    await I.seeElement(this.locators.checkoutButton + '[disabled]');
  }

  /**
   * Verify empty cart message
   */
  async verifyEmptyCartMessage () {
    await I.waitForElement(this.locators.emptyCartMessage, 5);
    await I.see('empty');
  }
}

module.exports = new CartPage();
module.exports.CartPage = CartPage;
