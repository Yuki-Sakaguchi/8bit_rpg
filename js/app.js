/**
 * RPGゲーム
 */

'use strict'

const BASE_FONT = '48px monospace'
const FONT_STYLE = '#ffffff'
const BASE_WINDOW = 'rgba(0,0,0,0.75)'
const IS_RATINA = false
const DEVICE_PIXEL_RATIO = IS_RATINA && window.devicePixelRatio || 1
const VIRTUAL_WIDTH = 128
const VIRTUAL_HEIGHT = 120
const SCREEN_HEIGHT = 8
const SCREEN_WIDTH = 8
const DOT_SIZE = 8
const TILE_COLUMN = 4
const TILE_ROW = 4
const CHARACTOR_WIDTH = 8
const CHARACTOR_HEIGHT = 9
const START_X = 15
const START_Y = 17
const MAP_WIDTH = 32
const MAP_HEIGHT = 32
const key = new Uint8Array(0x100) // キー入力バッファ

let canvas,
    ctx,
    virtualCanvas,
    vCtx,
    canvasWidth,
    canvasHeight,
    imgMap,
    imgMonster,
    imgPlayer,
    imgBoss,
    playerX = START_X*DOT_SIZE+(DOT_SIZE/2),
    playerY = START_Y*DOT_SIZE+(DOT_SIZE/2),
    lv = 1,
    exp = 0,
    hp = 10,
    maxHp = 10,
    speed = 4,
    angle = 0,
    mx = 0,
    my = 0,
    moveX = 0,
    moveY = 0,
    message = [],
    item = null,
    phase = 0,
    cursor = 0,
    enemyHp,
    enemyType = 0,
    order,
    frame = 0,
    fps = 33

const encount = [ 0, 0, 0, 1, 0, 0, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0]
const monsterName = ['スライム', 'うさぎ', 'ナイト', 'ドラゴン', 'まおう']
const	MAP = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 3, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 3, 3, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6, 6, 3, 6, 3, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 3, 3, 6, 6, 7, 7, 7, 2, 2, 2, 7, 7, 7, 7, 7, 7, 7, 6, 3, 0, 0, 0, 3, 3, 0, 6, 6, 6, 0, 0, 0,
  0, 0, 3, 3, 6, 6, 6, 7, 7, 2, 2, 2, 7, 7, 2, 2, 2, 7, 7, 6, 3, 3, 3, 6, 6, 3, 6,13, 6, 0, 0, 0,
  0, 3, 3,10,11, 3, 3, 6, 7, 7, 2, 2, 2, 2, 2, 2, 1, 1, 7, 6, 6, 6, 6, 6, 3, 0, 6, 6, 6, 0, 0, 0,
  0, 0, 3, 3, 3, 0, 3, 3, 3, 7, 7, 2, 2, 2, 2, 7, 7, 1, 1, 6, 6, 6, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 7, 7, 7, 7, 2, 7, 6, 3, 1, 3, 6, 6, 6, 3, 0, 0, 0, 3, 3, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 7, 2, 7, 6, 3, 1, 3, 3, 6, 6, 3, 0, 0, 0, 3, 3, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 7, 7, 7, 6, 3, 1, 1, 3, 3, 6, 3, 3, 0, 0, 3, 3, 3, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 6, 6, 7, 7, 7, 6, 3, 1, 1, 3, 3, 6, 3, 3, 0, 3,12, 3, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 7, 7, 6, 3, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 6, 6, 6, 6, 3, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 6, 6, 3, 3, 3, 3, 1, 1, 3, 3, 3, 1, 1, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 5, 3, 3, 3, 6, 6, 6, 3, 3, 3, 1, 1, 1, 1, 1, 3, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 8, 9, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 3, 3, 3, 1, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 3, 3, 3, 3, 3, 3, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 3, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 3, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 3, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 3, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,14, 6, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0,
  7,15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 0, 0, 0, 0, 0,
  7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 7, 7,
]

// ----------------------------------------------------------------------------------------------

/**
 * 描画処理
 */
function rendor () {
  if (message.length == 0) {
    frame++
    tickFeild()
  }
  preRendor()
  mainRendor()
}

/**
 * 仮想canvasへの描画処理
 */
function preRendor () {
  if (phase <= 1) {
    drawMap()
    drawPlayer()
  } else {
    drwaButtle()
  }
}

/**
 * 仮想canvasの内容を転写
 */
function mainRendor () {
  ctx.drawImage(virtualCanvas,
                0, 0, virtualCanvas.width, virtualCanvas.height,
                0, 0, canvasWidth, canvasHeight)
  drawMessage()
  drawStatus()
}

/**
 * フィールド進行処理
 */
function tickFeild () {
  // キー入力に応じて移動量を更新
  if (moveX !== 0 || moveY !== 0 || message.length >= 1) {} // 移動中、メッセージ表示中は移動させない
  else if (key[37]) { angle = 1; moveX = -DOT_SIZE } // 左
  else if (key[38]) { angle = 3; moveY = -DOT_SIZE } // 上
  else if (key[39]) { angle = 2; moveX =  DOT_SIZE } // 右
  else if (key[40]) { angle = 0; moveY =  DOT_SIZE } // 下

  // 移動後のマップタイルを取得
  let mx = Math.floor((playerX + moveX) / DOT_SIZE)
  let my = Math.floor((playerY + moveY) / DOT_SIZE)
  mx += MAP_WIDTH
  mx %= MAP_WIDTH
  my += MAP_HEIGHT
  my %= MAP_HEIGHT
  const m = MAP[my * MAP_WIDTH + mx]

  // 移動禁止エリア
  if (m < 3 || (item == null && m === 14)) {
    moveX = 0
    moveY = 0
  }

  // 移動後のアクション
  if (Math.abs(moveX) + Math.abs(moveY) == speed) {
    // 城
    if ((m === 8 || m === 9) && message.length == 0) {
      hp = maxHp
      message.push(`まおう を たおして！`)
    }

    // 街
    if ((m === 10 || m === 11) && message.length == 0) {
      hp = maxHp
      message.push(`にし の はてにも`)
      message.push(`むら が あります`)
    }

    // 村
    if (m === 12 && message.length == 0) {
      hp = maxHp
      message.push(`かぎ は`)
      message.push(`どうくつ に あります`)
    }

    // どうくつ
    if (m === 13 && message.length == 0) {
      item = 1
      message.push(`かぎ を てにいれた！`)
    }

    if (m === 15 && message.length == 0) {
      // ボス
      appearEnemy(monsterName.length-1)
    } else if (Math.random() * 8 < encount[m]) {
      // 通常バトル
      let t = Math.abs(playerX / DOT_SIZE - START_X) + Math.abs(playerY / DOT_SIZE - START_Y)
      if (m == 6) t += 8  // 林だったら強いのを出やすく(0.5上昇)
      if (m == 7) t += 16 // 山だったら強いのをより出やすく(1上昇)
      t += Math.random() * 8 // 敵レベルを少しランダムに
      t = Math.floor(t/16)
      t = Math.min(t, monsterName.length - 2)
      appearEnemy(t)
    }
  }

  // 扉は移動前にアクション
  if (m === 14 && message.length == 0) {
    if (item == null) {
      message.push(`かぎ が ひつようです`)
    } else {
      message.push(`かぎ が ひらいた！`)
    }
  }

  // 移動量をプレイヤー位置に代入
  playerX += sign(moveX) * speed
  playerY += sign(moveY) * speed
  moveX -= sign(moveX) * speed
  moveY -= sign(moveY) * speed

  // マップループ処理
  playerX += MAP_WIDTH*DOT_SIZE
  playerX %= MAP_WIDTH*DOT_SIZE
  playerY += MAP_HEIGHT*DOT_SIZE
  playerY %= MAP_HEIGHT*DOT_SIZE
}

/**
 * 戦闘の開始処理
 */
function appearEnemy(val) {
  phase = 1
  enemyType = val
  enemyHp = val * 3 + 5
  message.push('てき が あらわれた！！')
}

/**
 * IE対応用のSign関数
 */
function sign (val) {
  if (val === 0) return 0 
  if (val > 0) return 1
  if (val < 0) return -1
}

/**
 * マップ描画
 */
function drawMap () {
  // プレイヤーのタイル座標
  mx = Math.floor(playerX/DOT_SIZE)
  my = Math.floor(playerY/DOT_SIZE)
  
  for (let dy = -SCREEN_HEIGHT; dy <= SCREEN_HEIGHT; dy++) {
    let y = dy + SCREEN_HEIGHT
    let ty = my + dy // タイル座標
    const py = (ty + MAP_HEIGHT) % MAP_HEIGHT // ループ後のタイル座標

    for (let dx = -SCREEN_WIDTH; dx <= SCREEN_WIDTH; dx++) {
      let x = dx + SCREEN_WIDTH
      let tx = mx + dx // タイル座標
      const px = (tx + MAP_WIDTH) % MAP_WIDTH // ループ後のタイル座標

      drawTile(
        vCtx,
        tx * DOT_SIZE + VIRTUAL_WIDTH/2 - playerX,
        ty * DOT_SIZE + VIRTUAL_HEIGHT/2 - playerY,
        MAP[py * MAP_WIDTH + px]
      )
    }
  }
}

/**
 * マップパーツを描画
 */
function drawTile (ctx, x, y, index) {
  const ix = (index % TILE_COLUMN) * DOT_SIZE
  const iy = Math.floor(index / TILE_COLUMN) * DOT_SIZE
  ctx.drawImage(imgMap, ix, iy, DOT_SIZE, DOT_SIZE, x, y, DOT_SIZE, DOT_SIZE)
}

/**
 * プレイヤーの描画
 */
function drawPlayer () {
  const ax = (frame >> 4 & 1) * CHARACTOR_WIDTH // ビットシフト演算で16で割って少数切り捨てし、&で割り算を省略
  const ay = angle * CHARACTOR_HEIGHT
  vCtx.drawImage(imgPlayer,
                 ax, ay, CHARACTOR_WIDTH, CHARACTOR_HEIGHT,
                 VIRTUAL_WIDTH/2 - CHARACTOR_WIDTH/2, VIRTUAL_HEIGHT/2 - CHARACTOR_HEIGHT + DOT_SIZE/2, 8, 9)
}

/**
 * 先頭処理
 */
function drwaButtle () {
  // 背景表示
  vCtx.fillStype = '#000000'
  vCtx.fillRect(0, 0, canvasWidth, canvasHeight)

  // 敵表示
  if (phase <= 5) {
    if (isBoss()) {
      vCtx.drawImage(imgBoss, VIRTUAL_WIDTH/2 - imgBoss.width/2, VIRTUAL_HEIGHT/2 - imgBoss.height/2)
    } else {
      let w = imgMonster.width/4
      let h = imgMonster.height
      vCtx.drawImage(imgMonster,
                    enemyType * w, 0, w, h,
                    Math.floor(VIRTUAL_WIDTH/2 - w/2), Math.floor(VIRTUAL_HEIGHT/2 - h/2), w, h)  
    }
  }
}

/**
 * ボスチェック
 */
function isBoss () {
  return enemyType === monsterName.length-1
}

/**
 * 戦闘処理
 */
function action () {
  phase++

  if (((phase + order) & 1) == 0) {
    let d = getDamage(enemyType + 2)
    message = [monsterName[enemyType] + ' の こうげき！', d + 'のダメージ']
    hp -= d
    if (hp <= 0) {
      hp = 0
      phase = 7
    }
    return false
  }
  
  if (cursor == 0) {
    let d = getDamage(lv + 2)
    message = ['あなた の こうげき！', d +'のダメージ']
    enemyHp -= d
    if (enemyHp <= 0) {
      phase = 5
    }
    return false
  }

  if (Math.random() < 0.5) {
    message = ['あなた は にげだした！']
    phase = 6
    return false
  }

  message = ['あなた は にげだした！', 'しかし まわりこまれた！']
}

/**
 * ダメージの計算
 */
function getDamage (val) {
  return Math.floor(val * (1 + Math.random())) // 攻撃力の１〜２倍
}

/**
 * 戦闘中の入力
 */
function commondEnter () {
  phase = 2
  message = ['たたかう', 'にげる']
}

/**
 * メッセージを表示
 */
function drawMessage () {
  if (message.length == 0) return false

  ctx.fillStyle = BASE_WINDOW
  ctx.fillRect(10, canvasHeight-210, canvasWidth-20, 200)

  const basePoitionY = canvasHeight-150
  const positionY = 60
  ctx.font = BASE_FONT
  ctx.fillStyle = FONT_STYLE
  for (let i = 0; i < message.length; i++) {
    ctx.fillText(message[i], 30, basePoitionY+(positionY*i))
  }

  // バトル中の場合、キー入力を表示
  if (phase == 2) {
    ctx.font = BASE_FONT
    ctx.fillStyle = FONT_STYLE
    ctx.fillText('→', -15, canvasHeight-150 + (60 * cursor))
  }
}


/**
 * ステータスウィンドウの表示
 */
function drawStatus () {
  ctx.fillStyle = BASE_WINDOW
  ctx.fillRect(10, 10, 180, 200)

  ctx.font = BASE_FONT
  ctx.fillStyle = FONT_STYLE
  ctx.fillText(`Lv ${lv}`,  30,  70)
  ctx.fillText(`HP ${hp}`,  30, 130)
  ctx.fillText(`Ex ${exp}`, 30, 190)
}

/**
 * 経験値加算
 */
function addExp (val) {
  exp += val

  // レベルアップ
  //  Lv1 = 4
  //  Lv2 = 12
  //  Lv3 = 24
  while (lv * (lv + 1) * 2 <= exp) {
    lv++
    maxHp += 4 + Math.floor(Math.random() * 3) // 4〜6
  }
}

// ----------------------------------------------------------------------------------------------

/**
 * 初期化処理
 */
function init () {
  initCanvas()
  loadImage()
  setCanvasSize()
  setInterval(rendor, fps)
}

/**
 * canvasの準備
 */
function initCanvas () {
  // canvasを取得
  canvas = document.querySelector('#main')
  ctx = canvas.getContext('2d')

  // 仮想canvasを作成
  virtualCanvas = document.createElement('canvas')
  virtualCanvas.width = VIRTUAL_WIDTH
  virtualCanvas.height = VIRTUAL_HEIGHT
  vCtx = virtualCanvas.getContext('2d')
}

/**
 * 画像の読み込み
 */
function loadImage () {
  imgMap = new Image(); imgMap.src = 'images/map.png'
  imgMonster = new Image(); imgMonster.src = 'images/monster.png'
  imgPlayer = new Image(); imgPlayer.src = 'images/player.png'
  imgBoss = new Image(); imgBoss.src = 'images/boss.png'
}

/**
 * canvasをブラウザの表示サイズに固定
 */
function setCanvasSize () {
  canvas.width = canvasWidth = window.innerWidth * DEVICE_PIXEL_RATIO
  canvas.height = canvasHeight = window.innerHeight * DEVICE_PIXEL_RATIO
  canvas.style.width = `${window.innerWidth/DEVICE_PIXEL_RATIO}px`
  canvas.style.height = `${window.innerHeight/DEVICE_PIXEL_RATIO}px`

  // ドットをくっきり表示させる
  ctx.imageSmoothingEnabled = ctx.msImageSmoothingEnebled = false
  
  // アスペクト比を維持して最大の表示サイズで表示する
  if (canvasWidth / VIRTUAL_WIDTH < canvasHeight / VIRTUAL_HEIGHT) {
    // 横の方が大きい場合は横に合わせる
    canvasHeight = canvasWidth * VIRTUAL_HEIGHT / VIRTUAL_WIDTH
  } else {
    // 縦の方が大きい場合は縦に合わせる
    canvasWidth = canvasHeight * VIRTUAL_WIDTH / VIRTUAL_HEIGHT
  }
}

/**
 * リサイズ処理
 */
function resize () {
  setCanvasSize()
}

/**
 * キー入力処理 
 */
function keydown (e) {
  let c = e.keyCode

  // 既に入力中の場合
  if (key[c] != 0) return false

  key[c] = 1

  // バトル
  if (phase == 1) {
    cursor = 0
    commondEnter()
    return false
  }

  // コマンド入力
  if (phase == 2) {
    if (c == 13 || c == 90) {
      // 決定enter, z
      order = Math.floor(Math.random() * 2)
      action()
    } else {
      // カーソル移動
      cursor = 1 - cursor
    }
    return false
  }

  // コマンド入力
  if (phase === 3) {
    action()
    return false
  }

  // コマンド入力
  if (phase == 4) {
    commondEnter()
    return false
  }

  // バトル終了
  if (phase === 5) {
    message = ['てき を たおした']
    addExp(enemyType+1)
    phase = 6
    return false
  }

  // バトル終了
  if (phase === 6) {
    if (isBoss() && cursor == 0) {
      // 敵がボスでたたかうコマンド入力時
      message = [`まおう を たおし`, `せかい に へいわ が おとずれた`]
      return false
    }
    phase = 0
    message = []
    return false
  }

  // バトル終了
  if (phase === 7) {
    message = ['あなた は たおれた']
    phase = 8
    return false
  }

  if (phase === 8) {
    message = ['GAME OVER']
    return false
  }

  message = []
}

/**
 * キー入力終了
 */
function keyup (e) {
  key[e.keyCode] = 0
}

window.addEventListener('load', init)
window.addEventListener('resize', resize)
window.addEventListener('keydown', keydown)
window.addEventListener('keyup', keyup)
