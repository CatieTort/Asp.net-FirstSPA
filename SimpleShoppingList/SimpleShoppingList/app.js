var currentList = {};

function createShoppingList() {
    currentList.name = $("#shoppinglist_name").val();
    currentList.items = new Array();

    //Web Service Call
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "api/ShoppingList/",
        data: currentList,
        success: function (result) {
            showShoppingList();
        }
    });
}

function showShoppingList() {
    $("#list_title").html(currentList.name);
    $("#shoppingList_items").empty();

    $("#create").hide();
    $("#list").show();

    $("#newItemInput").focus();
    $("#newItemInput").keyup(function (e) {
        if (e.keyCode == 13) {
            addItem();
        }
    })
}

function addItem() {
    var newItem = {};
    newItem.name = $("#newItemInput").val();
    currentList.items.push(newItem);
    console.log(currentList);

    drawItems();
    $("#newItemInput").val('');
}

function drawItems() {
    var $list = $("#shoppingList_items").empty();
   
    for (var i = 0; i < currentList.items.length; i++) {
        var currentItem = currentList.items[i];
        var $li = $("<li>").html("<p id='"+'item_'+ i +"'>" + currentItem.name + "</p>");
        var $deleteBtn = $("<button class='btn' onclick='deleteItem("+ i +")'>Delete</button>").appendTo($li);
        var $checkBtn = $("<button class='btn' onclick='checkItem("+ i +")'>Check</button>").appendTo($li);

        $li.appendTo($list);
    }
}

function deleteItem(index) {
    currentList.items.splice(index, 1);
    drawItems();
}

function checkItem(index) {
    var itemLocation = $("#item_" + index);

    if (itemLocation.hasClass("checked")) {
        itemLocation.removeClass("checked");
    } else {
        itemLocation.addClass("checked");
    }
}

function getShoppingListById(id) {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "api/ShoppingList/" + id,
        success: function (result) {
            currentList = result;
            showShoppingList();
            drawItems();
        }
    });
}

$(document).ready(function () {
    console.info("ready");
    $("#shoppinglist_name").focus();
    $("#shoppinglist_name").keyup(function (e) {
        if (e.keyCode == 13) {
            createShoppingList();
        }
    })

    var pageURL = window.location.href;
    var idIndex = pageURL.indexOf("?id=");
    if (idIndex != -1) {
        getShoppingListById(pageURL.substring(idIndex + 4));
    }

    $("#list").hide();
});