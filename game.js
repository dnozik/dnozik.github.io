const gameState = {
    methaneCost: 0,
    ccsCost: 0.,
    catalystCost: 0.,
    electricityCost: 0.,
    ammoniaRevenue: 0.,
    ureaRevenue: 0.,
    ammoniaMade: 0.,
    ureaMade: 0.,
    profit: 0.,
    co2Made: 0.
    /*
    methaneReformingRxr: {
        temperature: 0,
        pressure: 0,
        steamToCarbonRatio: 0
    
}
*/
};

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 1900,
    backgroundColor: '0xFFFFFF',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            enableBody: true,
        }
    },
    pixelArt: true,
    roundPixels: true,
    scene: [StartScene, GameScene]
};

const game = new Phaser.Game(config);

