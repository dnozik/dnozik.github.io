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

        this.load.image('methaneReformingRxrImage', 'assets/PPmethaneReformingRxrAsset 3.svg');

    }


    create() {
        // let textTest = this.add.text(300, 300, "testing testing", { font: "40px Times New Roman", fill: "#ffa0d0" });

        let sprite1 = this.add.image(150, 100, 'methaneReformingRxrImage');
        let sprite2 = this.add.image(300, 100, 'methaneReformingRxrImage');
        let sprite3 = this.add.image(450, 100, 'methaneReformingRxrImage');
        let sprite4 = this.add.image(600, 100, 'methaneReformingRxrImage');
        let sprite5 = this.add.image(750, 100, 'methaneReformingRxrImage');
        // let circleTest = this.add.circle(150, 200, 5, 0x4e342e);

        const COLOR_PRIMARY = 0x4e342e;
        const COLOR_LIGHT = 0x7b5e57;
        const COLOR_DARK = 0x260e04;

        //this.add.rexRoundRectangle(150, 150, 100, 100, 30, 0x7b5e57);
        //this.add.rexRoundRectangle(350, 150, 100, 100, 30, 0x7b5e57);
        //this.add.rexRoundRectangle(550, 150, 100, 100, 30, 0x7b5e57);
        //this.add.rexRoundRectangle(750, 150, 100, 100, 30, 0x7b5e57);
        //this.add.rexRoundRectangle(950, 150, 100, 100, 30, 0x7b5e57);


        let hydrodesulfurizerLabel = this.add.rexRoundRectangle(250, 450, 100, 100, 30, 0xff0000);
        // let methaneReformingRxrLabel = this.add.rexRoundRectangle(250, 450, 100, 100, 30, 0xff6600);
        // let waterGasShiftRxrLabel = this.add.rexRoundRectangle(250, 400, 100, 100, 30, 0xffff00);
        let waterCondenserLabel = this.add.rexRoundRectangle(250, 400, 100, 100, 30, 0x009900);
        let carbonDioxideCleanupLabel = this.add.rexRoundRectangle(250, 400, 100, 100, 30, 0x0000cc);


        // let roundRectangle1 = this.add.rexRoundRectangle(250, 400, 100, 100, 30, 0xff0099);
        // let drag = this.plugins.get('rexdragplugin').add(hydrodesulfurizerLabel, config);

        let createLabel = function (scene, text) {
            return scene.rexUI.add.label({
                background: scene.rexUI.add.roundRectangle(0, 0, 100, 100, 30, COLOR_PRIMARY),
                text: scene.add.text(0, 0, text),
                icon: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_LIGHT),
                align: 'center',
                space: {
                    left: 20,
                    right: 20,
                    top: 20,
                    bottom: 20,
                    icon: 10
                }
            });
        };

        let methaneReformingRxrLabel = this.rexUI.add.sizer({
            x: 400, y: 300,
            width: 50, height: 50,
            orientation: 0
        }).

            add(
                createLabel(this, 'Reactor: \nSteam \nReforming \nof Methane'), // child
                1, // proportion
                'center' // align
            ).
            layout();

        let waterGasShiftRxrLabel = this.rexUI.add.sizer({
            x: 400, y: 300,
            width: 50, height: 50,
            orientation: 0
        }).

            add(
                createLabel(this, 'Reactor: \nWater \nGas Shift'), // child
                1, // proportion
                'center' // align
            ).
            layout();




        let makeDraggableRxrLabel = (gameObject, reactor) => {
            let drag = this.plugins.get('rexdragplugin').add(gameObject, config);
            gameObject.on('dragstart', function (pointer, dragX, dragY) { /*...*/ });
            gameObject.on('drag', function (pointer, dragX, dragY) { /*...*/ });
            gameObject.on('dragend', function (pointer, dragX, dragY, dropped) {
                let xPosition = (Math.floor(pointer.x * 10. / 1000.) * 1000. / 10.) + 50; // 50 is half the width
                let yPosition = (Math.floor(pointer.y * 10. / 1000.) * 1000. / 10.) + 50; // 50 is half the height

                reactors[reactor]['xCoordinate'] = xPosition;
                reactors[reactor]['yCoordinate'] = yPosition;

                gameObject.x = xPosition; // Math.floor(dragX / 200) * 200;
                gameObject.y = yPosition; // Math.floor(dragY / 200) * 200;
            });
        };

        makeDraggableRxrLabel(hydrodesulfurizerLabel, 'hydrodesulfurizer');
        makeDraggableRxrLabel(methaneReformingRxrLabel, 'methaneReformingRxr');
        makeDraggableRxrLabel(waterGasShiftRxrLabel, 'waterGasShiftRxr');
        makeDraggableRxrLabel(waterCondenserLabel, 'waterCondenser');
        makeDraggableRxrLabel(carbonDioxideCleanupLabel, 'carbonDioxideCleanup');

        let makeSlider = (xCoord, yCoord, intervals, reactor, reactorProperty) => {
            this.rexUI.add.slider({
                x: xCoord,
                y: yCoord,
                width: 130,
                height: 10,
                orientation: 'x',
                track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 4, COLOR_DARK),
                thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 8, COLOR_LIGHT),
                valuechangeCallback: function (value) {
                    this.value = Math.floor(value * intervals) / intervals; // Split in n parts:  Math.floor(value * n) / n
                    //storageContainer[storageKey] = this.value;
                    reactors[reactor][reactorProperty] = this.value;
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

        let methaneReformingRxrTemperatureSlider = makeSlider(150, 300, 5.0, 'methaneReformingRxr', 'temperature');
        let methaneReformingRxrPressureSlider = makeSlider(150, 350, 5.0, 'methaneReformingRxr', 'pressure');
        let methaneReformingRxrSteamToCarbonSlider = makeSlider(150, 400, 5.0, 'methaneReformingRxr', 'steamToCarbonRatio');







    };



    update() {

        // console.log(roundRectangle1Data['coordinates']);
        let setReactorPosition = (reactor) => {
            if (reactors[reactor]['xCoordinate'] == 150. && reactors[reactor]['yCoordinate'] == 150.) {
                reactors[reactor]['position'] = 1;
                reactorPositions['position1'] = reactor;
            } else if (reactors[reactor]['xCoordinate'] == 350. && reactors[reactor]['yCoordinate'] == 150.) {
                reactors[reactor]['position'] = 2;
                reactorPositions['position2'] = reactor;
            } else if (reactors[reactor]['xCoordinate'] == 550. && reactors[reactor]['yCoordinate'] == 150.) {
                reactors[reactor]['position'] = 3;
                reactorPositions['position3'] = reactor;
            } else if (reactors[reactor]['xCoordinate'] == 750. && reactors[reactor]['yCoordinate'] == 150.) {
                reactors[reactor]['position'] = 4;
                reactorPositions['position4'] = reactor;
            } else if (reactors[reactor]['xCoordinate'] == 950. && reactors[reactor]['yCoordinate'] == 150.) {
                reactors[reactor]['position'] = 5;
                reactorPositions['position5'] = reactor;
            } else {
                // reactors[reactor]['position'] = false;
            }
        };

        setReactorPosition('hydrodesulfurizer');
        setReactorPosition('methaneReformingRxr');
        setReactorPosition('waterGasShiftRxr');
        setReactorPosition('waterCondenser');
        setReactorPosition('carbonDioxideCleanup');

        console.log(reactors.hydrodesulfurizer.position);
        console.log(reactorPositions);

        let calculateHydrogenProduction = () => {


        };
    };
};



let reactors = {
    hydrodesulfurizer: {
        inlet: {
            ch4: 0,
            h20: 0,
            co: 0,
            co2: 0,
            h2: 0,
            n2: 0,
            nh3: 0,
            sulfur: 0,
            o2: 0
        },
        outlet: {
            ch4: 0,
            h20: 0,
            co: 0,
            co2: 0,
            h2: 0,
            n2: 0,
            nh3: 0,
            sulfur: 0,
            o2: 0
        },
        temperature: 0,
        pressure: 0,
        steamToCarbonRatio: 0,
        conversion: 0.5,
        inUse: 'false',
        position: 0,
        xCoordinate: 0,
        yCoordinate: 0
    },
    methaneReformingRxr: {
        inlet: {
            ch4: 0,
            h20: 0,
            co: 0,
            co2: 0,
            h2: 0,
            n2: 0,
            nh3: 0,
            sulfur: 0,
            o2: 0
        },
        outlet: {
            ch4: 0,
            h20: 0,
            co: 0,
            co2: 0,
            h2: 0,
            n2: 0,
            nh3: 0,
            sulfur: 0,
            o2: 0
        },
        temperature: 0,
        pressure: 0,
        steamToCarbonRatio: 0,
        conversion: 0.5,
        inUse: 'false',
        position: 0,
        xCoordinate: 0,
        yCoordinate: 0
    },
    waterGasShiftRxr: {
        inlet: {
            ch4: 0,
            h20: 0,
            co: 0,
            co2: 0,
            h2: 0,
            n2: 0,
            nh3: 0,
            sulfur: 0,
            o2: 0
        },
        outlet: {
            ch4: 0,
            h20: 0,
            co: 0,
            co2: 0,
            h2: 0,
            n2: 0,
            nh3: 0,
            sulfur: 0,
            o2: 0
        },
        temperature: 0,
        pressure: 0,
        steamToCarbonRatio: 0,
        conversion: 0.5,
        inUse: 'false',
        position: 0,
        xCoordinate: 0,
        yCoordinate: 0
    },
    waterCondenser: {
        inlet: {
            ch4: 0,
            h20: 0,
            co: 0,
            co2: 0,
            h2: 0,
            n2: 0,
            nh3: 0,
            sulfur: 0,
            o2: 0
        },
        outlet: {
            ch4: 0,
            h20: 0,
            co: 0,
            co2: 0,
            h2: 0,
            n2: 0,
            nh3: 0,
            sulfur: 0,
            o2: 0
        },
        temperature: 0,
        pressure: 0,
        steamToCarbonRatio: 0,
        conversion: 0.5,
        inUse: 'false',
        position: 0,
        xCoordinate: 0,
        yCoordinate: 0
    },
    carbonDioxideCleanup: {
        inlet: {
            ch4: 0,
            h20: 0,
            co: 0,
            co2: 0,
            h2: 0,
            n2: 0,
            nh3: 0,
            sulfur: 0,
            o2: 0
        },
        outlet: {
            ch4: 0,
            h20: 0,
            co: 0,
            co2: 0,
            h2: 0,
            n2: 0,
            nh3: 0,
            sulfur: 0,
            o2: 0
        },
        temperature: 0,
        pressure: 0,
        steamToCarbonRatio: 0,
        conversion: 0.5,
        inUse: 'false',
        position: 0,
        xCoordinate: 0,
        yCoordinate: 0
    }
};

let reactorPositions = {
    position1: 'example Reactor',
    position2: 'example Reactor',
    position3: 'example Reactor',
    position4: 'example Reactor',
    position5: 'example Reactor'
};
