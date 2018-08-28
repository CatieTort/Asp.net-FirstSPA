var currentList = {};

function createShoppingList() {
    currentList.name = $("#shoppinglist_name").val();
    currentList.items = new Array();

    //Web Service Call
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "api/ShoppingListsEF/",
        data: currentList,
        success: function (result) {
            currentList = result;
            showShoppingList();
            history.pushState({ id: result.id }, result.name, "?id=" + result.id);
        }
    });
}

function showShoppingList() {
    $("#list_title").html(currentList.name);
    $("#shoppingList_items").empty();

    $("#create").hide();
    $("#list").show();

    $("#newItemInput").val("");
    $("#newItemInput").focus();
    $("#newItemInput").unbind("keyup");
    $("#newItemInput").keyup(function (e) {
        if (e.keyCode == 13) {
            addItem();
        }
    })
}

function addItem() {
    var newItem = {};
    newItem.name = $("#newItemInput").val();
    newItem.shoppingListId = currentList.id;

    $.ajax({
        type: "POST",
        dataType: "json",
        url: "api/ItemsEF/",
        data: newItem,
        success: function (result) {
            currentList = result;
            drawItems();
            $("#newItemInput").val('');
        }
    });
}

function drawItems() {
    var $list = $("#shoppingList_items").empty();
   
    for (var i = 0; i < currentList.items.length; i++) {
        var currentItem = currentList.items[i];
        var $p = $("<p id='" + 'item_' + i + "'>" + currentItem.name + "</p>");
        var $li = $("<li>").html($p);
        var $deleteBtn = $("<button class='btn' onclick='deleteItem("+ currentItem.id +")'>Delete</button>").appendTo($li);
        var $checkBtn = $("<button class='btn' onclick='checkItem("+ currentItem.id +")'>Check</button>").appendTo($li);

        if (currentItem.checked) {
            $p.addClass("checked");
        }

        $li.appendTo($list);
    }
}

function deleteItem(itemId) {
    $.ajax({
        type: "DELETE",
        dataType: "json",
        url: "api/ItemsEF/" + itemId,
        success: function (result) {
            currentList = result;
            drawItems();
        }
    });
}

function checkItem(itemId) {
    var changedItem = {};

    for (var i = 0; i < currentList.items.length; i++) {
        if (currentList.items[i].id == itemId) {
            changedItem = currentList.items[i];
        }
    }

    changedItem.checked = !changedItem.checked;

    $.ajax({
        type: "PUT",
        dataType: "json",
        url: "api/ItemsEF/" + itemId,
        data: changedItem,
        success: function (result) {
            changedItem = result;
            drawItems();
        }
    });

}

function getShoppingListById(id) {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "api/ShoppingListsEF/" + id,
        success: function (result) {
            currentList = result;
            showShoppingList();
            drawItems();
        }
    });
}

    function hideShoppingList() {
        $("#create").show();
        $("#list").hide();

        $("#shoppinglist_name").val("");
        $("#shoppinglist_name").focus();
        $("#shoppinglist_name").unbind("keyup");
        $("#shoppinglist_name").keyup(function (e) {
            if (e.keyCode == 13) {
                createShoppingList();
            }
        });
    }

    $(document).ready(function () {
        console.info("ready");

        hideShoppingList();


        var pageURL = window.location.href;
        var idIndex = pageURL.indexOf("?id=");
        if (idIndex != -1) {
            getShoppingListById(pageURL.substring(idIndex + 4));
        }

        window.onpopstate = function (event) {
            if (event.state == null) {
                hideShoppingList();
            }
            else {
                getShoppingListById(event.state.id);
            }
        }
    });