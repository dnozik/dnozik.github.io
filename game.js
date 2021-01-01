const gameState = {
    methaneCost: 0,
    ccsCost: 0.,
    catalystCost: 0.,
    electricityCost: 0.,
    totalCost: 0.,
    ammoniaRevenue: 0.,
    ureaRevenue: 0.,
    totalRevenue: 0.,
    ammoniaMade: 0.,
    ureaMade: 0.,
    profit: 0.,
    co2Made: 0.,
    co2LeavingWGSRxr: 0.,
    h2EnteringAmmoniaSynthesis: 0.,
    nh3LeavingAmmoniaSynthesis: 0.
};

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 2000,
    backgroundColor: '0xFFFFFF',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            enableBody: true,
        }
    },
    pixelArt: false,
    roundPixels: true,
    scene: [StartScene, GameScene]
};

const game = new Phaser.Game(config);

