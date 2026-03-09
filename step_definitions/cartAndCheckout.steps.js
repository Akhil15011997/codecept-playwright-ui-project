const { cartPage } = inject();

// Product navigation
When('the user navigates to a product page', async () => {
  await cartPage.navigateToProductPage();
});

When('the user navigates to another product page', async () => {
  await cartPage.navigateToAnotherProductPage();
});

// Add to cart
When('the user adds the product to cart', async () => {
  await cartPage.addProductToCart();
});

When('the user continues shopping', async () => {
  await cartPage.continueShopping();
});

// View cart
When('the user views the cart', async () => {
  await cartPage.viewCart();
});

// Cart verification
Then('the user should see the cart with {int} item(s)', async (itemCount) => {
  await cartPage.verifyCartItemCount(itemCount);
});

Then('the user should see the cart with {int} items', async (itemCount) => {
  await cartPage.verifyCartItemCount(itemCount);
});

Then('the product should be displayed in the cart', async () => {
  await cartPage.verifyProductInCart();
});

// Quantity management
When('the user updates the quantity to {int}', async (quantity) => {
  await cartPage.updateQuantity(quantity);
});

Then('the cart should show quantity of {int}', async (quantity) => {
  await cartPage.verifyCartQuantity(quantity);
});

Then('the cart total should be updated', async () => {
  await cartPage.verifyCartTotalUpdated();
});

// Remove from cart
When('the user removes the product from cart', async () => {
  await cartPage.removeProductFromCart();
});

Then('the cart should be empty', async () => {
  await cartPage.verifyCartEmpty();
});

// Checkout
When('the user proceeds to checkout', async () => {
  await cartPage.proceedToCheckout();
});

Then('the user should be on the checkout page', async () => {
  await cartPage.verifyCheckoutPage();
});

Then('the user should see checkout form', async () => {
  await cartPage.verifyCheckoutForm();
});

// Checkout process
Given('the user has added a product to cart', async () => {
  await cartPage.navigateToProductPage();
  await cartPage.addProductToCart();
});

When('the user enters shipping information', async () => {
  await cartPage.enterShippingInformation();
});

When('the user enters payment information', async () => {
  await cartPage.enterPaymentInformation();
});

When('the user completes the order', async () => {
  await cartPage.completeOrder();
});

Then('the user should see order confirmation', async () => {
  await cartPage.verifyOrderConfirmation();
});

Then('the user should receive an order number', async () => {
  const orderNumber = await cartPage.getOrderNumber();
  if (!orderNumber) {
    throw new Error('No order number found');
  }
});

// Empty cart scenarios
Then('the checkout button should be disabled', async () => {
  await cartPage.verifyCheckoutButtonDisabled();
});

Then('the user should see empty cart message', async () => {
  await cartPage.verifyEmptyCartMessage();
});
