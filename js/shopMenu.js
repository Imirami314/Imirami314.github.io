var CUR_SHOP_MENU = 0
var SHOP_MENU_PAGE = 1
var PURCHASE_COOLDOWN = 0.5

function ShopMenu(shopList) {
    // Entire panel background
    ctx.fillStyle = "rgb(100, 100, 120)"
    ctx.roundRect(width / 8, height / 8, width * 3 / 4, height * 3 / 4, 10)
    ctx.fill()

    PURCHASE_COOLDOWN -= 1 / (66 + (2 / 3))
    for (var i in shopList) {
        var item = shopList[i].item

        // Vertical Bars
        ctx.fillStyle = "rgb(150, 150, 150, 0.3)"
        ctx.fillRect(width / 8 + 50 + i * 200, height / 8, 100, height * 3 / 4 - 50)

        // Box around each item
        ctx.fillStyle = "rgb(125, 125, 125)"
        ctx.roundRect(width / 8 + 60 + i * 200, height / 8 + 60, 80, 80, 10)
        ctx.fill()
        
        // Drawing the item
        item.draw(width / 8 + i * 200 + 100, height / 8 + 100)

        // Displaying item details in text
        ctx.fillStyle = "rgb(0, 0, 0)"
        ctx.font = "20px serif"
        ctx.textAlign = "center"
        ctx.fillText("Cost: " + shopList[i].cost, width / 8 + i * 200 + 100, height / 8 + 175)

        // Bottom bar and text
        ctx.fillStyle = "rgb(90, 90, 90)"
        ctx.roundRect(width / 8, height * 7 / 8 - 50, width * 3 / 4, 50, 10)
        ctx.fill()
        ctx.fillStyle = "rgb(0, 0, 0, " + (Math.sin(elapsed / 20)) + ")"
        ctx.font = "20px serif"
        ctx.fillText("Click on the item to purchase it", width / 2, height * 7 / 8 - 25)

        if (mouseIsDown && PURCHASE_COOLDOWN <= 0) {
            if (mouseX > width / 8 + i * 200 + 60 &&
                 mouseY > height / 8 + 60 &&
                 mouseX < width / 8 + i * 200 + 140 &&
                 mouseY < height / 8 + 140) {
                if (p.trills >= shopList[i].cost && shopList[i].amount > 0) {
                    p.trills -= shopList[i].cost
                    shopList[i].amount --
                    PURCHASE_COOLDOWN = 0.5
                    p.giveItem(item, true)
                    playSound("Purchase")
                }
            }
        }
    }

    if (keys.esc) {
        ShopMenu.close()
    }
}

ShopMenu.open = function(shopList) {
    console.log(shopList.length)
    CUR_SHOP_MENU = shopList
}

ShopMenu.close = function() {
    CUR_SHOP_MENU = 0
}