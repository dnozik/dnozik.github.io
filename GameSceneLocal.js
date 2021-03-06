class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' })
    }

    preload() {

        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'assets/js/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });

        this.load.plugin('rexroundrectangleplugin', 'assets/js/rexroundrectangleplugin.min.js', true);

        this.load.plugin('rexdragplugin', 'assets/js/rexdragplugin.min.js', true);

        // Buttons
        // this.load.scenePlugin({
        //     key: 'rexuiplugin',
        //     url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
        //     sceneKey: 'rexUI'
        // });


        this.load.svg('haberBoschBackground', 'assets/HaberBoschArtboard 6.svg', { width: 1280, height: 2000 });
        this.load.image('greenAnglePipe10', 'assets/GreenAnglePipeAsset 10.png', { width: 10, height: 10 });
        this.load.image('greenStraightPipe', 'assets/GreenStraightPipeAsset 17@288x.png', { width: 10, height: 10 });
        this.load.image('greenArrow', 'assets/GreenArrowAsset 18@288x.png', { width: 10, height: 10 });
        // Load SVG background image: https://phaser.io/examples/v3/view/loader/svg/load-svg-with-fixed-size
    }


    create() {
        this.add.image(640, 1000, 'haberBoschBackground');

        gameState.greenAnglePipe1 = this.add.sprite(758, 1450, 'greenAnglePipe10');
        gameState.greenAnglePipe1.scaleX = 0.5;
        gameState.greenAnglePipe1.scaleY = 0.5;
        gameState.greenAnglePipe1.orientation = 'down';
        gameState.greenAnglePipe1.setInteractive();

        gameState.greenAnglePipe2 = this.add.sprite(791, 819, 'greenAnglePipe10');
        gameState.greenAnglePipe2.scaleX = -0.5;
        gameState.greenAnglePipe2.scaleY = 0.5;
        gameState.greenAnglePipe2.orientation = 'left';
        gameState.greenAnglePipe2.setInteractive();

        gameState.greenArrow = this.add.image(1218, 1362, 'greenArrow');
        gameState.greenArrow.scaleX = 0.25;
        gameState.greenArrow.scaleY = 0.25;
        gameState.greenArrow.setVisible(false);

        gameState.greenStraightPipe = this.add.image(1218, 1318, 'greenStraightPipe');
        gameState.greenStraightPipe.scaleX = 0.25;
        gameState.greenStraightPipe.scaleY = 0.25;
        gameState.greenStraightPipe.orientation = 'horizontal';
        gameState.greenStraightPipe.setAngle(90);

        // Green Angle Pipe 1 (Select steam reforming or water electrolysis)
        // Up: steam reforming, Down: water electrolysis

        gameState.greenStraightPipe.setInteractive(); gameState.greenAnglePipe1.on('pointerup', function () {
            if (gameState.greenAnglePipe1.orientation == 'down') {
                gameState.greenAnglePipe1.scaleY = -0.5;
                gameState.greenAnglePipe1.y -= 22;
                gameState.greenAnglePipe1.orientation = 'up';

            }
            else {
                gameState.greenAnglePipe1.scaleY = 0.5;
                gameState.greenAnglePipe1.y += 22;
                gameState.greenAnglePipe1.orientation = 'down'

                gameState.greenAnglePipe2.scaleX = -0.5;
                gameState.greenAnglePipe2.x = 791;
                gameState.greenAnglePipe2.orientation = 'left'

                gameState.greenStraightPipe.setAngle(90);
                gameState.greenStraightPipe.orientation = 'horizontal';
                gameState.greenArrow.setVisible(false);

            }
        })

        // Green Angle Pipe 2 (Select urea production or CCS)
        // Right: Urea production, Left: CCS

        gameState.greenAnglePipe2.on('pointerup', function () {
            if (gameState.greenAnglePipe2.orientation == 'left') {
                gameState.greenAnglePipe2.scaleX = 0.5;
                gameState.greenAnglePipe2.x += 22;
                gameState.greenAnglePipe2.orientation = 'right'

                gameState.greenStraightPipe.setAngle(0);
                gameState.greenStraightPipe.orientation = 'vertical';
                gameState.greenArrow.setVisible(true);
            }
            else {
                gameState.greenAnglePipe2.scaleX = -0.5;
                gameState.greenAnglePipe2.x -= 22;
                gameState.greenAnglePipe2.orientation = 'left'

                gameState.greenStraightPipe.setAngle(90);
                gameState.greenStraightPipe.orientation = 'horizontal';
                gameState.greenArrow.setVisible(false);
            }
        })

        // Green Straight Pipe: send NH3 to urea factory or not
        // Horizontal: not directed to urea. Vertical: directed to urea.
        gameState.greenStraightPipe.on('pointerup', function () {
            if (gameState.greenStraightPipe.orientation == 'vertical') {
                gameState.greenAnglePipe2.scaleX = -0.5;
                gameState.greenAnglePipe2.x -= 22;
                gameState.greenAnglePipe2.orientation = 'left'

                gameState.greenStraightPipe.setAngle(90);
                gameState.greenStraightPipe.orientation = 'horizontal';
                gameState.greenArrow.setVisible(false);
            }
            else {
                gameState.greenAnglePipe2.scaleX = 0.5;
                gameState.greenAnglePipe2.x += 22;
                gameState.greenAnglePipe2.orientation = 'right'

                gameState.greenStraightPipe.setAngle(0);
                gameState.greenStraightPipe.orientation = 'vertical';
                gameState.greenArrow.setVisible(true);

                gameState.greenAnglePipe1.scaleY = -0.5;
                gameState.greenAnglePipe1.y = 1428;
                gameState.greenAnglePipe1.orientation = 'up'
            }
        })

        // Create methane reforming reactor temperature slider
        let makeSlider = (xCoord, yCoord, intervals, reactor, reactorProperty, widthVal) => {
            this.rexUI.add.slider({
                x: xCoord,
                y: yCoord,
                width: widthVal,
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
                input: 'click', // 'drag'|'click'
                // sliderPosition: this.value
            }).layout();
            /*
            Resources: 
            codepen.io/rexrainbow/pen/dwYaaQ
            rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-slider/#live-demos 
            */
        };
        let methaneReformingRxrTemperatureSlider = makeSlider(428, 750, 5.0, 'methaneReformingRxr', 'temperatureIndex', 144);
        let ammoniaSynthesisRxrPressureSlider = makeSlider(1135, 1737, 2.0, 'ammoniaSynthesisRxr', 'pressureIndex', 114);

        // Create ammonia synthesis reactor catalyst buttons
        let CheckboxesMode = false;  // False = radio mode
        let buttons = this.rexUI.add.buttons({
            x: 1170, y: 1705,

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

        gameState.totalCostText = this.add.text(290, 337, gameState.totalCost, { font: '18px Arial', fill: '#000000' });
        gameState.totalCostText.setText(gameState.totalCost);

        gameState.ammoniaRevenueText = this.add.text(595, 221, gameState.ammoniaRevenue, { font: '18px Arial', fill: '#000000' });
        gameState.ammoniaRevenueText.setText(gameState.ammoniaRevenue);

        gameState.ureaRevenueText = this.add.text(595, 270, gameState.ureaRevenue, { font: '18px Arial', fill: '#000000' });
        gameState.ureaRevenueText.setText(gameState.ureaRevenue);

        gameState.totalRevenueText = this.add.text(595, 303, gameState.totalRevenue, { font: '18px Arial', fill: '#000000' });
        gameState.totalRevenueText.setText(gameState.totalRevenue);

        gameState.ammoniaMadeText = this.add.text(915, 199, gameState.ammoniaMade, { font: '18px Arial', fill: '#000000' });
        gameState.ammoniaMadeText.setText(gameState.ammoniaMade);

        gameState.ureaMadeText = this.add.text(915, 227, gameState.ureaMade, { font: '18px Arial', fill: '#000000' });
        gameState.ureaMadeText.setText(gameState.ureaMade);

        gameState.profitText = this.add.text(915, 276, gameState.profitRevenue, { font: '18px Arial', fill: '#000000' });
        gameState.profitText.setText(gameState.profitRevenue);

        gameState.co2MadeText = this.add.text(915, 325, gameState.co2Made, { font: '18px Arial', fill: '#000000' });
        gameState.co2MadeText.setText(gameState.co2Made);

        gameState.co2LeavingWGSRxrText = this.add.text(822, 990, gameState.co2LeavingWGSRxr, { font: '14px Arial', fill: '#39b42a' });
        gameState.co2LeavingWGSRxrText.setText(gameState.co2LeavingWGSRxr);

        gameState.h2EnteringAmmoniaSynthesisText = this.add.text(822, 1391, gameState.h2EnteringAmmoniaSynthesis, { font: '14px Arial', fill: '#39b42a' });
        gameState.h2EnteringAmmoniaSynthesisText.setText(gameState.h2EnteringAmmoniaSynthesis);

        gameState.nh3LeavingAmmoniaSynthesisText = this.add.text(1045, 1391, gameState.nh3LeavingAmmoniaSynthesis, { font: '14px Arial', fill: '#39b42a' });
        gameState.nh3LeavingAmmoniaSynthesisText.setText(gameState.nh3LeavingAmmoniaSynthesis);

        gameState.ureaMadeText2 = this.add.text(948, 565, gameState.ureaMade, { font: '14px Arial', fill: '#39b42a' });
        gameState.ureaMadeText2.setText(gameState.ureaMade);
    };



    update() {
        console.log(plantDesign());

        gameState.catalyst = reactors.ammoniaSynthesisRxr.catalyst;
        console.log(gameState.catalyst);


        gameState.methaneCostText.setText(gameState.methaneCost);
        gameState.ccsCostText.setText(gameState.ccsCost);
        gameState.catalystCostText.setText(gameState.catalystCost);
        gameState.electricityCostText.setText(gameState.electricityCost);
        gameState.totalCostText.setText(gameState.totalCost);
        gameState.ammoniaRevenueText.setText(gameState.ammoniaRevenue);
        gameState.ureaRevenueText.setText(gameState.ureaRevenue);
        gameState.totalRevenueText.setText(gameState.totalRevenue);
        gameState.ammoniaMadeText.setText(gameState.ammoniaMade);
        gameState.ureaMadeText.setText(gameState.ureaMade);
        gameState.profitText.setText(gameState.profit);
        gameState.co2MadeText.setText(gameState.co2Made);
        gameState.co2LeavingWGSRxrText.setText(gameState.co2LeavingWGSRxr);
        gameState.h2EnteringAmmoniaSynthesisText.setText(gameState.h2EnteringAmmoniaSynthesis);
        gameState.nh3LeavingAmmoniaSynthesisText.setText(gameState.nh3LeavingAmmoniaSynthesis);
        gameState.ureaMadeText2.setText(gameState.ureaMade);
    };



};


// Set reactor properties
let reactors = {
    methaneReformingRxr: {
        temperatureIndex: 0,
    },
    ammoniaSynthesisRxr: {
        catalyst: 'blank',
        // ironConversion: 0.286,
        // osmiumConversion: 0.4,
        pressureIndex: 0
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
        gameState.h2EnteringAmmoniaSynthesis = (Fh2 * 2.02 * (1. / 1000.) * (1. / 907.185)).toFixed(2);  // tons H2 / day;

        // Calculate CO2 output of water gas shift and methane reforming reactor furnace
        const Fco2 = Xch4 * Fch40; // (mol/day) Molar flowrate of CO2 after WGS. 
        gameState.co2LeavingWGSRxr = (Fco2 * 44.01 * (1. / 1000.) * (1. / 907.185)).toFixed(1);  // tons CO2 / day;

        // Initialize plant metrics for steam reforming
        // CO2 emission and CCS cost
        let co2Emitted = co2EmittedFromRxrFurnace;
        let costCcsTotal = 0.;

        // Output of ammonia synthesis reactor:
        if (reactors.ammoniaSynthesisRxr.catalyst == 'iron') {
            const Da = (reactors.ammoniaSynthesisRxr.pressureIndex) * 0.18 + 0.011761;
            const Xh2 = ((6. * Da + 1.) - Math.sqrt((6. * Da + 1.) ** 2. - 4. * (3. * Da) * (3. * Da))) / (2. * (3. * Da));
            Fnh3 = (2. / 3.) * Xh2 * Fh2; // (mol NH3/day)
            // Fnh3 = (2. / 3.) * reactors.ammoniaSynthesisRxr.ironConversion * Fh2; // (mol NH3/day)
            costCatalyst = costIron;
        }
        // If using osmium catalyst:
        else if (reactors.ammoniaSynthesisRxr.catalyst == 'osmium') {
            const Da = (reactors.ammoniaSynthesisRxr.pressureIndex) * 0.3 + 0.07037;
            const Xh2 = ((6. * Da + 1.) - Math.sqrt((6. * Da + 1.) ** 2. - 4. * (3. * Da) * (3. * Da))) / (2. * (3. * Da));
            Fnh3 = (2. / 3.) * Xh2 * Fh2; // (mol NH3/day)
            // Fnh3 = (2. / 3.) * reactors.ammoniaSynthesisRxr.osmiumConversion * Fh2; // (mol NH3/day)
            costCatalyst = costOsmium;
        }
        else {
            Fnh3 = 0; // (mol NH3/day)
        }
        gameState.nh3LeavingAmmoniaSynthesis = (Fnh3 * 17.031 * (1. / 1000.) * (1. / 907.185)).toFixed(2);  // tons NH3 / day

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
            gameState.ureaMade = (0.00).toFixed(2); // tons urea / day
        }

        totalCosts = costCh4 + costCcsTotal + costCatalyst;
        totalRevenue = revenueAmmonia + revenueUrea;
        profit = totalRevenue - totalCosts;

        gameState.catalystCost = costCatalyst;
        gameState.totalCost = totalCosts.toFixed(1);
        gameState.totalRevenue = totalRevenue.toFixed(0);
        gameState.ammoniaRevenue = revenueAmmonia.toFixed(0);
        gameState.ureaRevenue = revenueUrea.toFixed(0);
        gameState.profit = profit.toFixed(0);
        gameState.co2Made = (co2Emitted * 44.01 * (1. / 1000.) * (1. / 907.185)).toFixed(1);
        gameState.ccsCost = costCcsTotal.toFixed(1);

        // return [costCh4, revenueAmmonia, revenueUrea, costCcsTotal, costCatalyst, profit];
        return [Fh2, Fco2, Fnh3, Furea];

    }

    // If using water electrolysis:
    else {
        // Fixed chemical and process costs and values for electrolysis
        const Fh2 = 205019.193959246; // (mol H2 / day) Moles of H2 formed using water electrolysis (const.)
        const kgH2 = Fh2 * (2.02 / 1.) * (1. / 1000.);
        gameState.h2EnteringAmmoniaSynthesis = (Fh2 * 2.02 * (1. / 1000.) * (1. / 907.185)).toFixed(2);  // tons H2 / day;

        /*
        const costElectricityPerH2 = 3.; // ($ / kg H2) Cost of electricity per kg H2
        const costElectricity = kgH2 * costElectricityPerH2 // ($/day) Cost of electricity for electrolysis
        */
        const costElectricity = 50. * 2.8; // ($/day) Cost of electricity for electrolysis
        gameState.methaneCost = 0;
        gameState.ccsCost = 0;
        gameState.electricityCost = costElectricity;
        gameState.ureaRevenue = 0;
        gameState.ureaMade = (0.00).toFixed(2);
        gameState.co2Made = 0.;
        gameState.co2LeavingWGSRxr = 0.;  // tons CO2 / day;


        // Output of ammonia synthesis reactor:
        if (reactors.ammoniaSynthesisRxr.catalyst == 'iron') {
            const Da = (reactors.ammoniaSynthesisRxr.pressureIndex) * 0.18 + 0.011761;
            const Xh2 = ((6. * Da + 1.) - Math.sqrt((6. * Da + 1.) ** 2. - 4. * (3. * Da) * (3. * Da))) / (2. * (3. * Da));
            Fnh3 = (2. / 3.) * Xh2 * Fh2; // (mol NH3/day)
            // Fnh3 = (2. / 3.) * reactors.ammoniaSynthesisRxr.ironConversion * Fh2; // (mol NH3/day)
            costCatalyst = costIron;
        }
        // If using osmium catalyst:
        else if (reactors.ammoniaSynthesisRxr.catalyst == 'osmium') {
            const Da = (reactors.ammoniaSynthesisRxr.pressureIndex) * 0.3 + 0.07037;
            const Xh2 = ((6. * Da + 1.) - Math.sqrt((6. * Da + 1.) ** 2. - 4. * (3. * Da) * (3. * Da))) / (2. * (3. * Da));
            Fnh3 = (2. / 3.) * Xh2 * Fh2; // (mol NH3/day)
            // Fnh3 = (2. / 3.) * reactors.ammoniaSynthesisRxr.osmiumConversion * Fh2; // (mol NH3/day)
            costCatalyst = costOsmium;
        }
        else {
            Fnh3 = 0; // (mol NH3/day)
        }
        gameState.nh3LeavingAmmoniaSynthesis = (Fnh3 * 17.031 * (1. / 1000.) * (1. / 907.185)).toFixed(2);  // tons NH3 / day

        revenueAmmonia = Fnh3 * valueAmmonia;
        totalCosts = costElectricity + costCatalyst;
        totalRevenue = revenueAmmonia;
        profit = totalRevenue - totalCosts;

        gameState.catalystCost = costCatalyst.toFixed(0);
        gameState.totalCost = totalCosts.toFixed(1);
        gameState.totalRevenue = totalRevenue.toFixed(0);
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
        width: 107,
        height: 40,
        /*
        text: scene.add.text(0, 0, text, {
            fontSize: 18
        }),
        */
        icon: scene.add.circle(0, 0, 10).setStrokeStyle(1.75, 0x000000), // Black
        space: {
            left: 10,
            right: 10,
            icon: 10
        },

        name: name
    });

    return button;
}
