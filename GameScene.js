class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' })
    }

    preload() {

        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });

        let url;
        url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexroundrectangleplugin.min.js';
        this.load.plugin('rexroundrectangleplugin', url, true);

        this.load.plugin('rexdragplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexdragplugin.min.js', true);

        // Buttons
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });


        this.load.svg('haberBoschBackground', 'assets/HaberBoschArtboard 1.svg', { width: 1280, height: 1900 });
        this.load.image('greenAnglePipe10', 'assets/GreenAnglePipeAsset 10.png', { width: 10, height: 10 });
        this.load.image('greenStraightPipe', 'assets/GreenStraightPipeAsset 17@288x.png', { width: 10, height: 10 });
        // Load SVG background image: https://phaser.io/examples/v3/view/loader/svg/load-svg-with-fixed-size
    }


    create() {
        this.add.image(640, 950, 'haberBoschBackground');

        // Green Angle Pipe 1 (Select steam reforming or water electrolysis)
        // Up: steam reforming, Down: water electrolysis
        gameState.greenAnglePipe1 = this.add.sprite(758, 1450, 'greenAnglePipe10');
        gameState.greenAnglePipe1.scaleX = 0.5;
        gameState.greenAnglePipe1.scaleY = 0.5;
        gameState.greenAnglePipe1.orientation = 'down';
        gameState.greenAnglePipe1.setInteractive();
        gameState.greenAnglePipe1.on('pointerup', function () {
            if (gameState.greenAnglePipe1.orientation == 'down') {
                gameState.greenAnglePipe1.scaleY = -0.5;
                gameState.greenAnglePipe1.y -= 22;
                gameState.greenAnglePipe1.orientation = 'up';
            }
            else {
                gameState.greenAnglePipe1.scaleY = 0.5;
                gameState.greenAnglePipe1.y += 22;
                gameState.greenAnglePipe1.orientation = 'down'
            }
        })

        // Green Angle Pipe 2 (Select urea production or CCS)
        // Right: Urea production, Left: CCS
        gameState.greenAnglePipe2 = this.add.sprite(791, 819, 'greenAnglePipe10');
        gameState.greenAnglePipe2.scaleX = -0.5;
        gameState.greenAnglePipe2.scaleY = 0.5;
        gameState.greenAnglePipe2.orientation = 'left';
        gameState.greenAnglePipe2.setInteractive();
        gameState.greenAnglePipe2.on('pointerup', function () {
            if (gameState.greenAnglePipe2.orientation == 'left') {
                gameState.greenAnglePipe2.scaleX = 0.5;
                gameState.greenAnglePipe2.x += 22;
                gameState.greenAnglePipe2.orientation = 'right'
            }
            else {
                gameState.greenAnglePipe2.scaleX = -0.5;
                gameState.greenAnglePipe2.x -= 22;
                gameState.greenAnglePipe2.orientation = 'left'
            }
        })


        /*
        gameState.greenStraightPipe = this.add.image(1218, 773, 'greenStraightPipe');
        gameState.greenStraightPipe.scaleX = 0.25;
        gameState.greenStraightPipe.scaleY = 0.25;
        gameState.greenStraightPipe.orientation = 'vertical';
        gameState.greenStraightPipe.setInteractive();
        gameState.greenAStraightPipe.on('pointerup', function () {
            if (gameState.greenAnglePipe2.orientation == 'vertical') {
                gameState.greenAnglePipe2.scaleX = 0.5;
                gameState.greenAnglePipe2.x += 22;
                gameState.greenAnglePipe2.orientation = 'right'
            }
            else {
                gameState.greenAnglePipe2.scaleX = -0.5;
                gameState.greenAnglePipe2.x -= 22;
                gameState.greenAnglePipe2.orientation = 'left'
            }
        })
        */

        // Create methane reforming reactor temperature slider
        let makeSlider = (xCoord, yCoord, intervals, reactor, reactorProperty) => {
            this.rexUI.add.slider({
                x: xCoord,
                y: yCoord,
                width: 140,
                height: 10,
                orientation: 'x',
                track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 4, 0x006837), // Dark green
                thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 8, 0x39b42a), // Light green
                valuechangeCallback: function (value) {
                    this.value = Math.floor(value * intervals) / intervals; // Split in n parts:  Math.floor(value * n) / n
                    //storageContainer[storageKey] = this.value;
                    reactors[reactor][reactorProperty] = this.value; // Temperature in C
                },
                space: {
                    top: 4,
                    bottom: 4
                },
                input: 'drag', // 'drag'|'click'
                // sliderPosition: this.value
            }).layout();
            /*
            Resources: 
            codepen.io/rexrainbow/pen/dwYaaQ
            rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-slider/#live-demos 
            */
        };
        let methaneReformingRxrTemperatureSlider = makeSlider(446, 750.5, 5.0, 'methaneReformingRxr', 'temperatureIndex');

        // Create ammonia synthesis reactor catalyst buttons
        let CheckboxesMode = false;  // False = radio mode
        let buttons = this.rexUI.add.buttons({
            x: 1085, y: 1705,

            orientation: 'x',

            // background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 0, COLOR_PRIMARY),
            buttons: [
                createButton(this, 'iron'),
                createButton(this, 'osmium'),
                // createButton(this, 'C'),
                // createButton(this, 'D')
            ],

            type: ((CheckboxesMode) ? 'checkboxes' : 'radio'),
            setValueCallback: function (button, value) {
                button.getElement('icon')
                    .setFillStyle((value) ? 0x39b42a : undefined); // Light green
            }

        })
            .layout()
        // Dump states
        // var print = this.add.text(0, 0, '');
        let dumpButtonStates = function () {
            if (CheckboxesMode) { // checkboxes
                var s = '';
                buttons.data.each(function (buttons, key, value) {
                    s += `${key}:${value}\n`
                })
                print.setText(s);
            } else { // radio
                // print.setText(buttons.value);
                reactors.ammoniaSynthesisRxr.catalyst = buttons.value;
            }

        }
        buttons.on('button.click', dumpButtonStates);
        dumpButtonStates();

        // this.add.text(5, 5, gameState.catalyst, { font: '18px Arial', fill: '#0095DD' });

        // Text to print out
        // Edit this first one
        gameState.methaneCostText = this.add.text(290, 199, gameState.methaneCost, { font: '18px Arial', fill: '#000000' });
        gameState.methaneCostText.setText(gameState.methaneCost);

        gameState.ccsCostText = this.add.text(290, 248, gameState.ccsCost, { font: '18px Arial', fill: '#000000' });
        gameState.ccsCostText.setText(gameState.ccsCost);

        gameState.catalystCostText = this.add.text(290, 276, gameState.catalystCost, { font: '18px Arial', fill: '#000000' });
        gameState.catalystCostText.setText(gameState.catalystCost);

        gameState.electricityCostText = this.add.text(290, 303, gameState.electricityCost, { font: '18px Arial', fill: '#000000' });
        gameState.electricityCostText.setText(gameState.electricityCost);

        gameState.ammoniaRevenueText = this.add.text(595, 221, gameState.ammoniaRevenue, { font: '18px Arial', fill: '#000000' });
        gameState.ammoniaRevenueText.setText(gameState.ammoniaRevenue);

        gameState.ureaRevenueText = this.add.text(595, 270, gameState.ureaRevenue, { font: '18px Arial', fill: '#000000' });
        gameState.ureaRevenueText.setText(gameState.ureaRevenue);

        gameState.ammoniaMadeText = this.add.text(915, 199, gameState.ammoniaMade, { font: '18px Arial', fill: '#000000' });
        gameState.ammoniaMadeText.setText(gameState.ammoniaMade);

        gameState.ureaMadeText = this.add.text(915, 225, gameState.ureaMade, { font: '18px Arial', fill: '#000000' });
        gameState.ureaMadeText.setText(gameState.ureaMade);

        gameState.profitText = this.add.text(915, 250, gameState.profitRevenue, { font: '18px Arial', fill: '#000000' });
        gameState.profitText.setText(gameState.profitRevenue);

        gameState.co2MadeText = this.add.text(915, 300, gameState.co2Made, { font: '18px Arial', fill: '#000000' });
        gameState.co2MadeText.setText(gameState.co2Made);
    };



    update() {
        console.log(plantDesign());

        gameState.catalyst = reactors.ammoniaSynthesisRxr.catalyst;
        console.log(gameState.catalyst);


        gameState.methaneCostText.setText(gameState.methaneCost);
        gameState.ccsCostText.setText(gameState.ccsCost);
        gameState.catalystCostText.setText(gameState.catalystCost);
        gameState.electricityCostText.setText(gameState.electricityCost);
        gameState.ammoniaRevenueText.setText(gameState.ammoniaRevenue);
        gameState.ureaRevenueText.setText(gameState.ureaRevenue);
        gameState.ammoniaMadeText.setText(gameState.ammoniaMade);
        gameState.ureaMadeText.setText(gameState.ureaMade);
        gameState.profitText.setText(gameState.profit);
        gameState.co2MadeText.setText(gameState.co2Made);
    };



};


// Set reactor properties
let reactors = {
    methaneReformingRxr: {
        temperatureIndex: 0,
    },
    ammoniaSynthesisRxr: {
        catalyst: 'blank',
        ironConversion: 0.286,
        osmiumConversion: 0.4,
    }
};



let plantOutputs = {
    ammoniaProduction: 0.,
    co2Emitted: 0.,
    profit: 0.
};

// Determine chemical plant outputs
function plantDesign() {

    // Costs independent of steam reforming vs. electrolysis
    // Catalyst costs
    const costIron = 1.; // $/day 
    const costOsmium = 100.; // $/day 
    let costCatalyst = 0.;
    // Chemical values
    const valueAmmonia = 0.002; // ($/mol ammonia)
    const valueUrea = 0.0083; // ($/mol urea)


    // Initialize plant metrics
    // Product flowrates
    let Fnh3 = 0.;
    let Furea = 0.;
    // Chemicals revenue
    let revenueAmmonia = 0.;
    let revenueUrea = 0.;
    // Cost, revenue, profits
    let totalCosts = 0.;
    let totalRevenue = 0.;
    let profit = 0.;




    // Check if using steam reforming or water electrolysis

    // If using steam reforming:
    if (gameState.greenAnglePipe1.orientation == 'up') {

        // Fixed chemical and process costs and values for steam reforming
        const Fch40 = (1000. / 16.04) * 907.185 // (mol/day) Inlet molar flowrate of methane, with inlet flowrate of 1 ton/day 
        const valueCh4 = 50.; // ($/ton) Cost for 1 ton methane (constant)
        const startingTonsOfMethane = 1.; // tons
        const costCh4 = valueCh4 * startingTonsOfMethane // ($/day)
        const costCcsPerH2 = 0.03 * (1. / 1000.) * (2.02 / 1.); // ($/mol H2) Cost of CCS per mol H2. Equal to $5/ton CO2
        const co2EmittedFromRxrFurnace = 103066.; // mol Co2 emitted by running the methane reforming reactor furnace.

        gameState.methaneCost = costCh4;
        gameState.electricityCost = 0.;


        // Calculate H2 output of water gas shift
        const T = (reactors.methaneReformingRxr.temperatureIndex) * 500. + 300. // (C) Methane reforming reactor T 
        const Xch4 = 1. - Math.exp(-250. * Math.exp(-5000. / (T + 273.))); // Conversion of methane after reforming
        const Fh2 = Xch4 * Fch40 * (3. + 1.); // (mol/day) Molar flowrate of hydrogen after reforming and WGS
        // Calculate CO2 output of water gas shift and methane reforming reactor furnace
        const Fco2 = Xch4 * Fch40; // (mol/day) Molar flowrate of CO2 after WGS. 

        // Initialize plant metrics for steam reforming
        // CO2 emission and CCS cost
        let co2Emitted = co2EmittedFromRxrFurnace;
        let costCcsTotal = 0.;

        // Output of ammonia synthesis reactor:
        if (reactors.ammoniaSynthesisRxr.catalyst == 'iron') {
            Fnh3 = (2. / 3.) * reactors.ammoniaSynthesisRxr.ironConversion * Fh2; // (mol NH3/day)
            costCatalyst = costIron;
        }
        // If using osmium catalyst:
        else {
            Fnh3 = (2. / 3.) * reactors.ammoniaSynthesisRxr.osmiumConversion * Fh2; // (mol NH3/day)
            costCatalyst = costOsmium;
        }


        // Urea production vs. CCS
        // If using urea production:
        if (gameState.greenAnglePipe2.orientation == 'right') {
            // Conversion of ammonia to urea:
            Furea = (1. / 2.) * Fnh3; // (mol urea/day) Amount of urea produced, assuming 100% conversion
            revenueUrea = Furea * valueUrea; // ($/day) Revenue per day from selling urea
            co2Emitted = co2EmittedFromRxrFurnace + Fco2; // mol CO2

            gameState.ammoniaMade = 0.;  // tons NH3 / day
            gameState.ureaMade = (Furea * 60.06 * (1. / 1000.) * (1. / 907.185)).toFixed(2); // tons urea / day
            // revenueAmmonia will be 0, because all NH3 is converted to urea
        }
        // If using carbon capture and sequestration
        else {
            costCcsTotal = costCcsPerH2 * Fh2; // ($/day) Cost of CCS per day
            revenueAmmonia = Fnh3 * valueAmmonia; // ($/day) Revenue per day from selling ammonia

            gameState.ammoniaMade = (Fnh3 * 17.031 * (1. / 1000.) * (1. / 907.185)).toFixed(2);  // tons NH3 / day
            gameState.ureaMade = 0.; // tons urea / day
        }

        totalCosts = costCh4 + costCcsTotal + costCatalyst;
        totalRevenue = revenueAmmonia + revenueUrea;
        profit = totalRevenue - totalCosts;

        gameState.catalystCost = costCatalyst;
        gameState.ammoniaRevenue = revenueAmmonia.toFixed(0);;
        gameState.ureaRevenue = revenueUrea.toFixed(0);
        gameState.profit = profit.toFixed(0);
        gameState.co2Made = (co2Emitted * 44.01 * (1. / 1000.) * (1. / 907.185)).toFixed(1);
        gameState.ccsCost = costCcsTotal.toFixed(1);

        return [costCh4, revenueAmmonia, revenueUrea, costCcsTotal, costCatalyst, profit];
    }

    // If using water electrolysis:
    else {
        // Fixed chemical and process costs and values for electrolysis
        const Fh2 = 205019.193959246; // (mol H2 / day) Moles of H2 formed using water electrolysis (const.)
        const kgH2 = Fh2 * (2.02 / 1.) * (1. / 1000.);
        /*
        const costElectricityPerH2 = 3.; // ($ / kg H2) Cost of electricity per kg H2
        const costElectricity = kgH2 * costElectricityPerH2 // ($/day) Cost of electricity for electrolysis
        */
        const costElectricity = 50. * 2.8; // ($/day) Cost of electricity for electrolysis
        gameState.methaneCost = 0;
        gameState.ccsCost = 0;
        gameState.electricityCost = costElectricity;
        gameState.ureaRevenue = 0;
        gameState.ureaMade = 0.;
        gameState.co2Made = 0.;

        // Output of ammonia synthesis reactor:
        if (reactors.ammoniaSynthesisRxr.catalyst == 'iron') {
            Fnh3 = (2. / 3.) * reactors.ammoniaSynthesisRxr.ironConversion * Fh2; // (mol NH3/day)
            costCatalyst = costIron;
        }
        // If using osmium catalyst:
        else {
            Fnh3 = (2. / 3.) * reactors.ammoniaSynthesisRxr.osmiumConversion * Fh2; // (mol NH3/day)
            costCatalyst = costOsmium;
        }


        revenueAmmonia = Fnh3 * valueAmmonia;
        totalCosts = costElectricity + costCatalyst;
        totalRevenue = revenueAmmonia;
        profit = totalRevenue - totalCosts;

        gameState.catalystCost = costCatalyst.toFixed(0);
        gameState.ammoniaRevenue = revenueAmmonia.toFixed(0);
        gameState.ammoniaMade = (Fnh3 * 17.031 * (1. / 1000.) * (1. / 907.185)).toFixed(2);  // tons NH3 / day
        gameState.profit = profit.toFixed(0);

        return [kgH2, Fnh3, totalCosts, totalRevenue, profit];
    }




}

// Create button
let createButton = function (scene, text, name) {
    if (name === undefined) {
        name = text;
    }
    let button = scene.rexUI.add.label({
        width: 100,
        height: 40,
        /*
        text: scene.add.text(0, 0, text, {
            fontSize: 18
        }),
        */
        icon: scene.add.circle(0, 0, 10).setStrokeStyle(1.5, 0x000000), // Black
        space: {
            left: 10,
            right: 10,
            icon: 10
        },

        name: name
    });

    return button;
}