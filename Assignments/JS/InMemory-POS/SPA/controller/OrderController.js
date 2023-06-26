$(function () {
    $("#btnAddToCart").attr("disabled", true);
    $("#btnPurchaseOrder").attr("disabled", true);

});

function loadAllCustomerIdsInPurchaseOrder() {
    $("#cmbCustomerId").empty();
    $("#cmbCustomerId").append(`<option>Customer ID</option>`);

    for (let customer of customerDB) {
        $("#cmbCustomerId").append(`<option>${customer.id}</option>`);
    }
}

// var selectElement = $("#cmbCustomerId");
//
// function updateSelector() {
//     selectElement.empty();
//     $.each(customerDB, function (index, customer) {
//         var option = $("<option>")
//             .val(customer.id)
//             .text(customer.id);
//         selectElement.append(option);
//     });
// }

function loadAllItemCodesInPurchaseOrder() {
    $("#cmbItemCode").empty();
    $("#cmbItemCode").append(`<option disabled selected hidden>Item Code</option>`);

    for (let item of itemDB) {
        $("#cmbItemCode").append(`<option>${item.code}</option>`);
    }
}

$("#cmbCustomerId").change(function () {
    var customer = searchCustomer($(this).val());
    $("#inputName").val(customer.name);
    $("#inputAddress").val(customer.address);
    $("#inputSalary").val(customer.salary);
});

$("#cmbItemCode").change(function () {
    var item = searchItem($(this).val());
    var cartItem = searchCartItem($(this).val());
    $("#inputItemName").val(item.name);
    $("#inputIPrice").val(item.price);
    if (cartItem != null) {
        $("#inputItemQty").val(parseInt(item.qty) - parseInt(cartItem.qty));
    } else {
        $("#inputItemQty").val(item.qty);
    }
});

$("#btnAddToCart").on("click", function () {
    addToCart();
    $(this).attr("disabled", true);
});

function addToCart() {
    let code = $("#cmbItemCode").val();
    let name = $("#inputItemName").val();
    let qtyOnHand = $("#inputItemQty").val();
    let unitPrice = $("#inputIPrice").val();
    let qty = $("#inputOrderQty").val();
    let cartItem = searchCartItem(code);

    if (parseInt(qtyOnHand) < qty) {
        alert("No Stock");
        return false;
    } else if (cartItem == null) {
        var cart = {
            code: code,
            name: name,
            qtyOnHand: qtyOnHand,
            unitPrice: unitPrice,
            qty: qty,
            total: parseFloat(unitPrice) * parseInt(qty)
        }
        cartDB.push(cart);

    } else {
        cartItem.qtyOnHand = cartItem.qtyOnHand - parseInt($("#inputItemQty").val());
        cartItem.qty = parseInt(cartItem.qty) + parseInt($("#inputOrderQty").val());
    }

    loadCart();
    $("#btnPlaceOrder").attr("disabled", false);
    $("#inputOrderQty").val("");
}

// Load Cart
function loadCart() {

    $("#tblCart > tbody").empty();

    for (let cart of cartDB) {
        $("#tblCart > tbody").append(
            `<tr><td>${cart.code}</td><td>${cart.name}</td><td>${cart.price}</td><td>${cart.qty}</td><td>${cart.total}</td><td><i class="bi bi-pencil-fill text-success me-4 purchase-order-edits"></i><i class="bi bi-trash text-danger purchase-order-deletes"></i></td></tr>`
        );
        bindPurchaseEditEvent();
        bindPurchaseDeleteEvent();
    }
    setTotal();
}

function bindPurchaseEditEvent() {
    $(".purchase-order-edits").on("click", function () {
        var code = $(this).parent().parent().children(":eq(0)").text();
        var cartItem = searchCartItem(code);

        var item = searchItem(code);
        $("#cmbItemCode").val(item.code);
        $("#inputItemName").val(item.name);
        $("#inputItemQty").val(parseInt(item.qty) - parseInt(cartItem.qty));
        $("#unitPrice").val(item.price);
        $("#inputOrderQty").val("");
    });
}

function bindPurchaseDeleteEvent() {
    $(".purchase-order-deletes").on("click", function () {
        var code = $(this).parent().parent().children(":eq(0)").text();
        deleteCartObject(code);
        loadCart();
    });
}

function deleteCartObject(code) {
    let cartItem = searchCartItem(code);
    if (cartItem != null) {
        let indexNumber = cartDB.indexOf(cartItem);
        cartDB.splice(indexNumber, 1);
        return true;
    } else {
        return false;
    }
}

function searchCartItem(code) {
    for (let cartItem of cartDB) {
        if (cartItem.code == code) {
            return cartItem;
        }
    }
    return null;
}

function setTotal() {
    let total = 0;
    for (let cartItem of cartDB) {
        total += parseFloat(cartItem.total);
    }
    $("#total").text(total + " /=");
}

function generateNewOrderId() {
    if (ordersDB.length > 0) {
        var lastId = ordersDB[ordersDB.length - 1].orderId;
        var digit = lastId.substring(6);
        var number = parseInt(digit) + 1;
        return lastId.replace(digit, number);
    } else {
        return "ORD-001";
    }
}



$("#inputDiscount").on("keyup", function () {
    if ($(this).val() !== "") {
        $("#inputAmount").val(parseFloat($("#total").val()) - parseFloat($(this).val()));
    } else {
        $("#inputAmount").val($("#total").val());
    }
});

$("#btnPurchaseOrder").on("click", function () {
    purchaseOrder();
});

function purchaseOrder() {
    let orderId = $("#orderId").val();
    let total = $("#total").val();
    let discount = $("#inputDiscount").val();
    let amount = $("#inputAmount").val();
    var order = orders(orderId, total, discount, amount);
    ordersDB.push(order);
    $("#placeOrder");
    alert("Save...");
    for (let cartItem of cartDB) {
        let searchItem1 = searchItem(cartItem.code);
        var qtyOnHand = parseInt(searchItem1.qty) - parseInt(cartItem.qty);
        updateItem(searchItem1.code, searchItem1.name, searchItem1.price, qtyOnHand);
    }
    cartDB = [];
    getAllItems();
    loadCart();
    clearCustomerAndItemTexts();
}

function clearCustomerAndItemTexts() {
    loadAllCustomerIdsInPurchaseOrder();
    // updateSelector();
    loadAllItemCodesInPurchaseOrder();
    $("#inputName ,#inputAddress, #inputSalary, #inputItemName, #inputItemQty, #inputIPrice, #inputOrderQty").val("");
}

// validation
const qtyRegEx = /^[0-9]{1,}$/

$("#inputDiscount").on('keyup', function (event) {
    if (check(qtyRegEx, $("#inputDiscount"))) {
        $("#btnPurchaseOrder").attr("disabled", false);
        if (event.key == "Enter") {
            purchaseOrder();
        }
    } else {
        $("#btnPurchaseOrder").attr("disabled", true);
    }
});

$("#inputOrderQty").on('keyup', function (event) {
    if (check(qtyRegEx, $("#inputOrderQty"))) {
        $("#btnAddToCart").attr("disabled", false);
        if (event.key == "Enter") {
            addToCart();
        }
    } else {
        $("#btnAddToCart").attr("disabled", true);
    }
});


