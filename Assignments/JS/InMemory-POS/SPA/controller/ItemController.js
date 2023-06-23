//load all existing items
getAllItems();

//add item event
$("#btnItemSave").click(function () {
    if (checkAllItems()){
        saveItem();
    }

});

//get all items event
$("#btnItemSearch").click(function () {
    getAllItems();
});

//bind tr events for getting back data of the rows to text fields
function bindItemTrEvents() {
    $('#tblItem>tr').click(function () {
        //get the selected rows data
        let code = $(this).children().eq(0).text();
        let name = $(this).children().eq(1).text();
        let price = $(this).children().eq(2).text();
        let qty = $(this).children().eq(3).text();

        //set the selected rows data to the input fields
        $("#txtItemCode").val(code);
        $("#txtItemName").val(name);
        $("#txtPrice").val(price);
        $("#txtQty").val(qty);
    })
}

//delete btn event
$("#btnItemDelete").click(function () {
    let code = $("#txtItemCode").val();

    let consent = confirm("Do you want to delete.?");
    if (consent) {
        let response = deleteItem(code);
        if (response) {
            alert("Item Deleted");
            clearItemInputFields();
            getAllItems();
        } else {
            alert("Item Not Removed..!");
        }
    }


});

//update  btn event
$("#btnItemUpdate").click(function () {
    let code = $("#txtItemCode").val();
    updateItem(code);
    clearItemInputFields();
});

//clear btn event
$("#btnItemClear").click(function () {
    clearItemInputFields();
});



// CRUD operation Functions
function saveItem() {
    let itemCode = $("#txtItemCode").val();
    //check item is exists or not?
    if (searchItem(itemCode.trim()) == undefined) {

        //if the customer is not available then add him to the array
        let itemName = $("#txtItemName").val();
        let itemPrice = $("#txtPrice").val();
        let itemQty = $("#txtQty").val();

        //by using this one we can create a new object using
        //the item model with same properties
        let newItem = Object.assign({}, item);
        newItem.code = itemCode;
        newItem.name = itemName;
        newItem.price = itemPrice;
        newItem.qty = itemQty;

        //add item record to the item array (DB)
        itemDB.push(newItem);
        clearItemInputFields();
        getAllItems();

    } else {
        alert("Item already exits.!");
        clearItemInputFields();
    }
}

function getAllItems() {
    //clear all tbody data before add
    $("#tblItem").empty();

    //get all items
    for (let i = 0; i < itemDB.length; i++) {
        let code = itemDB[i].code;
        let name = itemDB[i].name;
        let price = itemDB[i].price;
        let qty = itemDB[i].qty;


        let row = `<tr>
                     <td>${code}</td>
                     <td>${name}</td>
                     <td>${price}</td>
                     <td>${qty}</td>
                    </tr>`;

        // //and then append the row to tableBody
        $("#tblItem").append(row);

        //invoke this method every time
        // we add a row // otherwise click
        //event will not work
        bindItemTrEvents();
    }
}

function deleteItem(code) {
    for (let i = 0; i < itemDB.length; i++) {
        if (itemDB[i].code == code) {
            itemDB.splice(i, 1);
            return true;
        }
    }
    return false;
}

function searchItem(code) {
    return itemDB.find(function (item) {
        //if the search code match with item record
        //then return that object
        return item.code == code;
    });
}

function updateItem(code) {
    if (searchItem(code) == undefined) {
        alert("No such Item..please check the Code");
    } else {
        let consent = confirm("Do you really want to update this Item.?");
        if (consent) {
            let item = searchItem(code);
            //if the item available can we update.?

            let itemName = $("#txtItemName").val();
            let itemPrice = $("#txtPrice").val();
            let itemQty = $("#txtQty").val();


            item.name = itemName;
            item.price = itemPrice;
            item.qty = itemQty;


            getAllItems();
        }
    }

}

function clearItemInputFields() {
    $("#txtItemCode,#txtItemName,#txtPrice,#txtQty").val("");
    $("#txtItemCode,#txtItemName,#txtPrice,#txtQty").css("border", "1px solid #ced4da");
    $("#txtItemCode").focus();
    setItemBtn();
}
