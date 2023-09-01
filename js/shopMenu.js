var CUR_SHOP_MENU = 0
var SHOP_MENU_PAGE = 1
var PURCHASE_COOLDOWN = 0.5

function ShopMenu(shopList) {
  ctx.fillStyle = "rgb(100, 100, 120)"
  ctx.roundRect(width / 8, height / 8, width * 3 / 4, height * 3 / 4, 10)
  ctx.fill()

  PURCHASE_COOLDOWN -= 1 / (66 + (2 / 3))
  for (var i in shopList) {
    var item = shopList[i].item
    ctx.fillStyle = "rgba(150, 150, 150, 0.3)"
    ctx.fillRect(width / 8 + i * 200 + 50, height / 8, 100, height * 3 / 4)
    item.draw(width / 8 + i * 200 + 100, height / 8 + 100)

    ctx.fillStyle = "rgb(0, 0, 0)"
    ctx.font = "20px serif"
    ctx.textAlign = "center"
    ctx.fillText("Cost: " + shopList[i].cost, width / 8 + i * 200 + 100, height / 8 + 150)

    if (mouseIsDown && PURCHASE_COOLDOWN <= 0) {
      if (mouseX > width / 8 + i * 200 + 100 &&
         mouseY > height / 8 + 100 &&
         mouseX < width / 8 + i * 200 + 150 &&
         mouseY < height / 8 + 200) {
        if (p.trills >= shopList[i].cost && shopList[i].amount > 0) {
          p.trills -= shopList[i].cost
          shopList[i].amount --
          PURCHASE_COOLDOWN = 0.5
        }
      }
    }
  }

  if (keys.esc) {
    ShopMenu.close()
  }
}

ShopMenu.open = function(shopList) {
  CUR_SHOP_MENU = shopList
}

ShopMenu.close = function() {
  CUR_SHOP_MENU = 0
}